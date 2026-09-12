/**
 * "Ask My Portfolio" — retrieval-augmented answers over this repository.
 *
 * Request path: same-origin check → rate limit → validate → cache lookup →
 * embed the query → cosine top-5 over the in-memory index → refuse if nothing
 * clears the floor → otherwise budget the prompt, call a provider with the
 * retrieved sources, and stream the answer back as SSE. Exactly one structured
 * log line is emitted per request, whatever path it took.
 *
 * RUNTIME NOTE — this route runs on Node, not Edge, and that is a deliberate
 * departure from the original sketch. Query-time embedding needs the same
 * MiniLM encoder the index was built with, and `@xenova/transformers` carries
 * an ONNX runtime that is an order of magnitude larger than Vercel's 1 MB
 * Edge bundle cap on Hobby. The alternatives were a hosted embedding API
 * (a key, a quota and a bill), or a different query encoder than the index
 * encoder — which does not fail loudly, it just returns confident nonsense,
 * because mismatched vectors still have a cosine similarity. Node serverless
 * is free on the same plan and costs roughly a second of cold start.
 */
import type { NextApiRequest, NextApiResponse } from 'next';

import { AnswerCache } from '@/lib/ai/cache';
import { encodeEvent, parseChatRequest, type ChatSourceMeta } from '@/lib/ai/contracts';
import {
  RequestSpan,
  anonymizeClient,
  estimateCostUsd,
  logChat,
  type ChatStatus,
} from '@/lib/ai/telemetry';
import { estimateTokens } from '@/lib/ai/tokens';
import { embedQuery } from '@/lib/rag/embed';
import { RateLimiter, clientKey, validateQuestion } from '@/lib/rag/guard';
import { loadIndex } from '@/lib/rag/index-store';
import { runPipeline } from '@/lib/rag/pipeline';
import { providerChain } from '@/lib/rag/providers';

export const config = {
  runtime: 'nodejs',
  api: {
    // The encoder and the index both live in memory for the life of the
    // instance; the default allowance leaves no room for either.
    responseLimit: false,
    // A question is capped at 500 characters — a megabyte of JSON is an
    // attack, not a question, and is cheapest to reject before parsing.
    bodyParser: { sizeLimit: '16kb' },
  },
};

/** Per-instance, module-scoped so they survive between warm invocations. */
const limiter = new RateLimiter();
const cache = new AnswerCache();

/** Parsed once per process — reading `process.env` per request buys nothing. */
const chain = providerChain(process.env);

/**
 * The panel is same-origin, so a cross-origin POST is either a misconfigured
 * client or someone spending this deployment's provider quota from their own
 * page. Browsers already block the cross-origin *read*, but they happily send
 * the request; checking here means the quota is never spent on it.
 *
 * A missing Origin (curl, server-side fetch, same-origin navigation in some
 * browsers) is allowed: it is not evidence of a cross-origin caller, and the
 * rate limiter is the real backstop.
 */
function isSameOrigin(req: NextApiRequest): boolean {
  const origin = req.headers.origin;
  if (!origin) return true;

  const host = req.headers.host;
  if (!host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const span = new RequestSpan();

  const client = clientKey((name) => req.headers[name]);
  const anonymousClient = anonymizeClient(client);

  /** Emits the single log line for this request and nothing else ever does. */
  const finishLog = (
    status: ChatStatus,
    extra: Partial<Parameters<typeof logChat>[0]> = {}
  ) => {
    const promptTokens = extra.promptTokens ?? 0;
    const completionTokens = extra.completionTokens ?? 0;

    logChat({
      event: 'chat_request',
      requestId: span.requestId,
      status,
      client: anonymousClient,
      cached: false,
      provider: null,
      model: null,
      fallbackUsed: false,
      retriesUsed: 0,
      indexVersion: null,
      questionChars: 0,
      questionTokens: 0,
      historyTurns: 0,
      retrievedCount: 0,
      topScore: null,
      droppedSources: 0,
      droppedTurns: 0,
      totalTokens: promptTokens + completionTokens,
      estimatedCostUsd: estimateCostUsd(promptTokens, completionTokens),
      embedMs: null,
      retrievalMs: null,
      ttftMs: span.at('ttft'),
      totalMs: span.elapsedMs,
      ...extra,
      promptTokens,
      completionTokens,
    });
  };

  if (req.method !== 'POST') {
    res.setHeader('allow', 'POST');
    res.status(405).json({ error: 'Method not allowed.', requestId: span.requestId });
    finishLog('rejected', { errorType: 'method_not_allowed' });
    return;
  }

  if (!isSameOrigin(req)) {
    res.status(403).json({ error: 'Cross-origin requests are not accepted.', requestId: span.requestId });
    finishLog('rejected', { errorType: 'cross_origin' });
    return;
  }

  const rate = limiter.check(client);
  if (!rate.allowed) {
    res.setHeader('retry-after', String(rate.retryAfter));
    res.status(429).json({
      error: `You've sent several questions quickly. Please try again in ${rate.retryAfter}s.`,
      code: 'rate_limited',
      requestId: span.requestId,
    });
    finishLog('rate_limited', { errorType: 'rate_limited' });
    return;
  }

  const parsed = parseChatRequest(req.body);
  if (!parsed.ok) {
    res.status(400).json({ error: parsed.reason, code: 'invalid_request', requestId: span.requestId });
    finishLog('rejected', { errorType: 'invalid_request' });
    return;
  }

  const validation = validateQuestion(parsed.value.question);
  if (!validation.ok) {
    res.status(400).json({
      error: validation.reason,
      code: 'rejected_input',
      requestId: span.requestId,
    });
    finishLog('rejected', { errorType: 'guard_rejected' });
    return;
  }

  const { question } = validation;
  const { history } = parsed.value;

  /* --------------------------------- stream -------------------------------- */

  res.writeHead(200, {
    'content-type': 'text/event-stream; charset=utf-8',
    'cache-control': 'no-cache, no-transform',
    connection: 'keep-alive',
    // Vercel's proxy buffers by default, which would defeat streaming.
    'x-accel-buffering': 'no',
    'x-request-id': span.requestId,
  });

  const send = (frame: string) => {
    if (!res.writableEnded) res.write(frame);
  };

  // Stop generating when the visitor closes the panel — an abandoned answer
  // still costs provider quota until it is cancelled.
  const controller = new AbortController();
  res.once('close', () => controller.abort());

  const index = await loadIndex();
  const indexVersion = index?.version ?? 'none';

  // Only a first turn is cacheable: a follow-up is interpreted against history
  // unique to this visitor, so a shared cache entry would answer the wrong
  // question. See lib/ai/cache.ts.
  const cacheable = history.length === 0;
  const cacheKey = cache.key(question, indexVersion);

  if (cacheable) {
    const hit = cache.get(cacheKey);
    if (hit) {
      span.mark('ttft');
      send(encodeEvent({ type: 'sources', sources: hit.sources }));
      send(encodeEvent({ type: 'token', text: hit.text }));
      send(
        encodeEvent({
          type: 'meta',
          meta: {
            requestId: span.requestId,
            provider: hit.provider,
            model: null,
            cached: true,
            retrievedCount: hit.sources.length,
            topScore: hit.sources[0]?.score ?? null,
            retrievalMs: 0,
            ttftMs: span.at('ttft'),
            totalMs: span.elapsedMs,
            promptTokens: 0,
            completionTokens: estimateTokens(hit.text),
            droppedSources: 0,
            droppedTurns: 0,
            indexVersion: index?.version ?? null,
          },
        })
      );
      send(encodeEvent({ type: 'done', provider: hit.provider, refused: hit.refused }));
      res.end();

      finishLog('cached', {
        cached: true,
        provider: hit.provider,
        indexVersion: index?.version ?? null,
        questionChars: question.length,
        questionTokens: estimateTokens(question),
        retrievedCount: hit.sources.length,
        topScore: hit.sources[0]?.score ?? null,
        completionTokens: estimateTokens(hit.text),
      });
      return;
    }
  }

  try {
    let sources: ChatSourceMeta[] = [];
    let answer = '';

    for await (const event of runPipeline(
      question,
      history,
      { loadIndex: async () => index, embedQuery, chain },
      controller.signal
    )) {
      if (controller.signal.aborted) break;

      if (event.type === 'sources') {
        sources = event.sources.map(({ chunk, score }) => ({
          id: chunk.id,
          title: chunk.title,
          url: chunk.url,
          section: chunk.section,
          dateRange: chunk.dateRange,
          score: Number(score.toFixed(3)),
        }));
        send(encodeEvent({ type: 'sources', sources }));
      } else if (event.type === 'token') {
        if (span.at('ttft') === null) span.mark('ttft');
        answer += event.text;
        send(encodeEvent({ type: 'token', text: event.text }));
      } else {
        const { outcome } = event;

        send(
          encodeEvent({
            type: 'meta',
            meta: {
              requestId: span.requestId,
              provider: outcome.provider,
              model: outcome.model,
              cached: false,
              retrievedCount: outcome.retrievedCount,
              topScore: outcome.topScore,
              retrievalMs: outcome.retrievalMs,
              ttftMs: span.at('ttft'),
              totalMs: span.elapsedMs,
              promptTokens: outcome.promptTokens,
              completionTokens: outcome.completionTokens,
              droppedSources: outcome.droppedSources,
              droppedTurns: outcome.droppedTurns,
              indexVersion: outcome.indexVersion,
            },
          })
        );
        send(encodeEvent({ type: 'done', provider: outcome.provider, refused: outcome.refused }));

        // Only cache a real, complete answer. A degraded response (no provider
        // reached) or an aborted stream would otherwise be served to everyone
        // who asks the same question for the next hour.
        if (cacheable && !outcome.degraded && !controller.signal.aborted && answer) {
          cache.set(cacheKey, {
            text: answer,
            sources,
            provider: outcome.provider,
            refused: outcome.refused,
          });
        }

        finishLog(
          outcome.refused ? 'refused' : outcome.degraded ? 'degraded' : 'answered',
          {
            provider: outcome.provider,
            model: outcome.model,
            fallbackUsed: outcome.fallbackUsed,
            retriesUsed: outcome.retriesUsed,
            indexVersion: outcome.indexVersion,
            questionChars: question.length,
            questionTokens: estimateTokens(question),
            historyTurns: history.length,
            retrievedCount: outcome.retrievedCount,
            topScore: outcome.topScore,
            droppedSources: outcome.droppedSources,
            droppedTurns: outcome.droppedTurns,
            promptTokens: outcome.promptTokens,
            completionTokens: outcome.completionTokens,
            retrievalMs: outcome.retrievalMs,
            errorType: outcome.refusalReason ?? undefined,
          }
        );
      }
    }
  } catch (error) {
    // The visitor gets a sentence; the stack stays in the logs.
    console.error(`[chat] ${span.requestId} stream failed:`, error);
    send(
      encodeEvent({
        type: 'error',
        message: 'Something went wrong generating the response. Please try again.',
        code: 'stream_failed',
      })
    );
    finishLog('error', {
      errorType: error instanceof Error ? error.name : 'unknown',
      questionChars: question.length,
      questionTokens: estimateTokens(question),
      historyTurns: history.length,
    });
  } finally {
    if (!res.writableEnded) res.end();
  }
}
