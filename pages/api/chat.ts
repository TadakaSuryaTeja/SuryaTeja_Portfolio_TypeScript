/**
 * "Ask My Portfolio" — retrieval-augmented answers over this repository.
 *
 * Request path: rate limit → validate → embed the query → cosine top-5 over
 * the in-memory index → refuse if nothing clears the floor → otherwise prompt
 * a provider with the retrieved sources and stream the answer back as SSE.
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

import { RateLimiter, clientKey, validateQuestion } from '@/lib/rag/guard';
import { embedQuery } from '@/lib/rag/embed';
import { loadIndex } from '@/lib/rag/index-store';
import { runPipeline } from '@/lib/rag/pipeline';
import { providerChain } from '@/lib/rag/providers';
import { HISTORY_TURNS } from '@/lib/rag/prompt';
import type { ChatTurn } from '@/lib/rag/types';

export const config = {
  runtime: 'nodejs',
  // The encoder and the index both live in memory for the life of the
  // instance; the default allowance leaves no room for either.
  api: { responseLimit: false },
};

/** Per-instance, module-scoped so it survives between warm invocations. */
const limiter = new RateLimiter();

/** Parsed once per process — reading `process.env` per request buys nothing. */
const chain = providerChain(process.env);

function parseHistory(raw: unknown): ChatTurn[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter(
      (turn): turn is ChatTurn =>
        !!turn &&
        typeof turn === 'object' &&
        (turn.role === 'user' || turn.role === 'assistant') &&
        typeof turn.content === 'string',
    )
    .slice(-HISTORY_TURNS);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('allow', 'POST');
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  const rate = limiter.check(clientKey((name) => req.headers[name]));
  if (!rate.allowed) {
    res.setHeader('retry-after', String(rate.retryAfter));
    res.status(429).json({
      error: `Too many questions — try again in ${rate.retryAfter}s.`,
    });
    return;
  }

  const body = (req.body ?? {}) as { question?: unknown; history?: unknown };
  const validation = validateQuestion(body.question);
  if (!validation.ok) {
    res.status(400).json({ error: validation.reason });
    return;
  }

  /* --------------------------------- stream -------------------------------- */

  res.writeHead(200, {
    'content-type': 'text/event-stream; charset=utf-8',
    'cache-control': 'no-cache, no-transform',
    connection: 'keep-alive',
    // Vercel's proxy buffers by default, which would defeat streaming.
    'x-accel-buffering': 'no',
  });

  const send = (event: string, data: unknown) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  // Stop generating when the visitor closes the panel — an abandoned answer
  // still costs provider quota until it is cancelled.
  const controller = new AbortController();
  res.once('close', () => controller.abort());

  try {
    for await (const event of runPipeline(
      validation.question,
      parseHistory(body.history),
      { loadIndex, embedQuery, chain },
      controller.signal,
    )) {
      if (controller.signal.aborted) break;

      if (event.type === 'sources') {
        send('sources', {
          sources: event.sources.map(({ chunk, score }) => ({
            id: chunk.id,
            title: chunk.title,
            url: chunk.url,
            section: chunk.section,
            dateRange: chunk.dateRange,
            score: Number(score.toFixed(3)),
          })),
        });
      } else if (event.type === 'token') {
        send('token', { text: event.text });
      } else {
        send('done', { provider: event.provider, refused: event.refused });
      }
    }
  } catch (error) {
    console.error('[chat] stream failed:', error);
    send('error', {
      message: 'Something went wrong answering that. Please try again.',
    });
  } finally {
    if (!res.writableEnded) res.end();
  }
}
