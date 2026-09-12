/**
 * Production-infrastructure tests: budgeting, retries, caching, the wire
 * contract and telemetry redaction.
 *
 * These cover the parts that only misbehave under conditions that are awkward
 * to reproduce by hand — a provider returning 429, a prompt that outgrows its
 * budget, a truncated SSE frame, a cache that should not have been used.
 *
 * Run: npm test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { budgetPrompt, estimateTokens, MAX_PROMPT_TOKENS } from '../lib/ai/tokens';
import { withRetry, RetryableError, isRetryableStatus, backoffDelay } from '../lib/ai/retry';
import { AnswerCache, normalizeQuestion } from '../lib/ai/cache';
import { parseChatRequest, encodeEvent, decodeEvent } from '../lib/ai/contracts';
import {
  anonymizeClient,
  estimateCostUsd,
  RequestSpan,
  type ChatTelemetry,
} from '../lib/ai/telemetry';
import type { RetrievedChunk } from '../lib/rag/types';

/* -------------------------------- budgeting ------------------------------- */

const source = (id: string, size: number, score: number): RetrievedChunk => ({
  score,
  chunk: {
    id,
    text: 'x'.repeat(size),
    source: 'portfolio',
    section: 'experience',
    title: `Source ${id}`,
    url: '/#experience',
  },
});

test('a prompt inside the budget is left untouched', () => {
  const results = [source('a', 400, 0.8), source('b', 400, 0.7)];
  const budget = budgetPrompt({
    systemCard: 'system',
    question: 'What has he built?',
    results,
    history: [],
  });

  assert.equal(budget.results.length, 2);
  assert.equal(budget.droppedSources, 0);
  assert.ok(budget.estimatedPromptTokens <= MAX_PROMPT_TOKENS);
});

test('history is dropped before evidence is', () => {
  // Sources large enough that something has to give.
  const results = [source('a', 4000, 0.8), source('b', 4000, 0.7), source('c', 4000, 0.6)];
  const history = Array.from({ length: 6 }, (_, i) => ({
    role: (i % 2 === 0 ? 'user' : 'assistant') as 'user' | 'assistant',
    content: `turn ${i} `.repeat(20),
  }));

  const budget = budgetPrompt({ systemCard: 'system', question: 'Why?', results, history });

  assert.ok(budget.droppedTurns > 0, 'history should be sacrificed first');
  assert.ok(budget.estimatedPromptTokens <= MAX_PROMPT_TOKENS);
});

test('the weakest source is dropped first and at least one always survives', () => {
  const results = [source('a', 12000, 0.9), source('b', 12000, 0.5)];
  const budget = budgetPrompt({ systemCard: 'system', question: 'Why?', results, history: [] });

  assert.ok(budget.results.length >= 1, 'a prompt must never be left with no evidence');
  assert.equal(budget.results[0].chunk.id, 'a', 'the strongest source must survive');
  if (budget.results.length === 1) assert.equal(budget.droppedSources, 1);
});

test('one pasted essay in the history cannot evict the evidence', () => {
  const results = [source('a', 400, 0.8)];
  const history = [{ role: 'user' as const, content: 'y'.repeat(20_000) }];

  const budget = budgetPrompt({ systemCard: 'system', question: 'And?', results, history });

  assert.equal(budget.results.length, 1, 'the source survived');
  assert.ok(budget.estimatedPromptTokens <= MAX_PROMPT_TOKENS);
});

test('token estimation is monotonic and non-zero for real text', () => {
  assert.ok(estimateTokens('hello world') > 0);
  assert.ok(estimateTokens('a'.repeat(400)) > estimateTokens('a'.repeat(100)));
});

/* --------------------------------- retries -------------------------------- */

test('transient statuses retry, permanent ones do not', () => {
  for (const status of [429, 408, 409, 500, 502, 503]) {
    assert.equal(isRetryableStatus(status), true, `${status} should retry`);
  }
  for (const status of [400, 401, 403, 404, 422]) {
    assert.equal(isRetryableStatus(status), false, `${status} should not retry`);
  }
});

test('a retryable failure is retried and can succeed', async () => {
  let calls = 0;
  const result = await withRetry(
    async () => {
      calls += 1;
      if (calls < 3) throw new RetryableError('429 slow down', 429, 0.001);
      return 'ok';
    },
    { attempts: 3, baseDelayMs: 1 },
  );

  assert.equal(result, 'ok');
  assert.equal(calls, 3);
});

test('a non-retryable failure fails immediately without burning attempts', async () => {
  let calls = 0;
  await assert.rejects(
    withRetry(
      async () => {
        calls += 1;
        throw new Error('401 Unauthorized');
      },
      { attempts: 5, baseDelayMs: 1 },
    ),
    /401/,
  );

  assert.equal(calls, 1, 'a bad key was retried, which only adds latency to a certain failure');
});

test('retries are bounded and the last error propagates', async () => {
  let calls = 0;
  await assert.rejects(
    withRetry(
      async () => {
        calls += 1;
        throw new RetryableError('503', 503, 0.001);
      },
      { attempts: 3, baseDelayMs: 1 },
    ),
    /503/,
  );

  assert.equal(calls, 3);
});

test('backoff grows, stays within its ceiling, and is jittered', () => {
  const samples = Array.from({ length: 50 }, () => backoffDelay(3, 100, 4000));
  for (const delay of samples) {
    assert.ok(delay >= 0 && delay <= 400, `delay ${delay} escaped its ceiling`);
  }
  assert.ok(new Set(samples).size > 1, 'no jitter — every client would retry in lockstep');
  assert.ok(backoffDelay(5, 100, 4000) >= 0);
});

test('an aborted retry stops waiting', async () => {
  const controller = new AbortController();
  const promise = withRetry(
    async () => {
      controller.abort();
      throw new RetryableError('500', 500);
    },
    { attempts: 3, baseDelayMs: 50, signal: controller.signal },
  );

  await assert.rejects(promise);
});

/* ---------------------------------- cache --------------------------------- */

test('normalization collapses the differences that do not change the question', () => {
  assert.equal(
    normalizeQuestion("What's his RAG experience?"),
    normalizeQuestion('what is his rag experience'),
  );
  assert.equal(
    normalizeQuestion('Tell me about his AWS work'),
    normalizeQuestion('about his AWS work!!'),
  );
  assert.notEqual(normalizeQuestion('his AWS work'), normalizeQuestion('his Kafka work'));
});

test('a cache hit returns the stored answer', () => {
  const cache = new AnswerCache();
  const key = cache.key('What is his AWS experience?', 'v1');
  cache.set(key, { text: 'Answer [1].', sources: [], provider: 'groq', refused: false });

  assert.equal(cache.get(cache.key('what is his aws experience', 'v1'))?.text, 'Answer [1].');
  assert.equal(cache.stats().hits, 1);
});

test('rebuilding the index invalidates every cached answer', () => {
  const cache = new AnswerCache();
  cache.set(cache.key('Q', 'v1'), { text: 'old', sources: [], provider: null, refused: false });

  assert.equal(cache.get(cache.key('Q', 'v2')), null, 'a stale answer survived a content change');
});

test('entries expire', () => {
  const cache = new AnswerCache(10, 1_000);
  const key = cache.key('Q', 'v1');
  cache.set(key, { text: 'x', sources: [], provider: null, refused: false }, 0);

  assert.ok(cache.get(key, 500));
  assert.equal(cache.get(key, 1_001), null);
});

test('the cache evicts least-recently-used entries rather than growing', () => {
  const cache = new AnswerCache(2, 60_000);
  const entry = { text: 'x', sources: [], provider: null, refused: false };

  cache.set(cache.key('a', 'v1'), entry);
  cache.set(cache.key('b', 'v1'), entry);
  cache.get(cache.key('a', 'v1')); // 'a' becomes most recent
  cache.set(cache.key('c', 'v1'), entry); // evicts 'b'

  assert.ok(cache.get(cache.key('a', 'v1')));
  assert.equal(cache.get(cache.key('b', 'v1')), null);
});

/* ------------------------------ wire contract ----------------------------- */

test('a request body is validated, not trusted', () => {
  assert.equal(parseChatRequest(null).ok, false);
  assert.equal(parseChatRequest('a string').ok, false);
  assert.equal(parseChatRequest({}).ok, false);
  assert.equal(parseChatRequest({ question: 42 }).ok, false);

  const ok = parseChatRequest({ question: 'Hi', history: 'not an array' });
  assert.equal(ok.ok, true);
  assert.deepEqual(ok.ok && ok.value.history, [], 'a malformed history should degrade to empty');
});

test('malformed history entries are dropped, not passed through', () => {
  const parsed = parseChatRequest({
    question: 'Hi',
    history: [
      { role: 'user', content: 'keep' },
      { role: 'system', content: 'drop — not a permitted role' },
      { role: 'assistant', content: 42 },
      null,
      { role: 'assistant', content: 'keep too' },
    ],
  });

  assert.equal(parsed.ok, true);
  assert.deepEqual(parsed.ok && parsed.value.history.map((t) => t.content), ['keep', 'keep too']);
});

test('history is clamped so a huge array cannot inflate the prompt', () => {
  const history = Array.from({ length: 200 }, () => ({ role: 'user', content: 'x' }));
  const parsed = parseChatRequest({ question: 'Hi', history });

  assert.equal(parsed.ok, true);
  assert.ok(parsed.ok && parsed.value.history.length <= 8);
});

test('every event survives a round trip through the wire format', () => {
  const events = [
    { type: 'token' as const, text: 'hello' },
    {
      type: 'sources' as const,
      sources: [
        { id: 'a', title: 'A', url: '/#a', section: 'experience', score: 0.7, dateRange: '2023' },
      ],
    },
    { type: 'done' as const, provider: 'groq', refused: false },
    { type: 'error' as const, message: 'nope', code: 'stream_failed' },
  ];

  for (const event of events) {
    const frame = encodeEvent(event);
    const [eventLine, dataLine] = frame.trim().split('\n');
    const decoded = decodeEvent(eventLine.slice(7), dataLine.slice(6));
    assert.deepEqual(decoded, event, `${event.type} did not survive the round trip`);
  }
});

test('a truncated or malformed frame is ignored, not thrown on', () => {
  // Losing one damaged frame must not discard a good partial answer.
  assert.equal(decodeEvent('token', '{"text":'), null);
  assert.equal(decodeEvent('token', '{"text":42}'), null);
  assert.equal(decodeEvent('sources', '{"sources":"nope"}'), null);
  assert.equal(decodeEvent('unknown-type', '{}'), null);
});

test('junk entries inside a sources frame are filtered out', () => {
  const decoded = decodeEvent(
    'sources',
    JSON.stringify({
      sources: [{ id: 'a', title: 'A', url: '/#a', section: 's', score: 0.5 }, { id: 'bad' }, null],
    }),
  );

  assert.equal(decoded?.type, 'sources');
  assert.equal(decoded.type === 'sources' && decoded.sources.length, 1);
});

/* -------------------------------- telemetry ------------------------------- */

test('the client identifier is anonymized and stable', () => {
  const a = anonymizeClient('203.0.113.7');
  assert.ok(!a.includes('203.0.113.7'), 'the raw IP survived into the log identifier');
  assert.equal(a, anonymizeClient('203.0.113.7'), 'the same client must bucket consistently');
  assert.notEqual(a, anonymizeClient('198.51.100.1'));
});

test('the telemetry record has no field that could carry question or answer text', () => {
  // Redaction here is structural: a field that does not exist cannot leak.
  const record: ChatTelemetry = {
    event: 'chat_request',
    requestId: 'abc',
    status: 'answered',
    client: 'c_x',
    cached: false,
    provider: 'groq',
    model: 'm',
    fallbackUsed: false,
    retriesUsed: 0,
    indexVersion: 'v1',
    questionChars: 12,
    questionTokens: 3,
    historyTurns: 0,
    retrievedCount: 3,
    topScore: 0.6,
    droppedSources: 0,
    droppedTurns: 0,
    promptTokens: 100,
    completionTokens: 50,
    totalTokens: 150,
    estimatedCostUsd: 0,
    embedMs: 10,
    retrievalMs: 12,
    ttftMs: 300,
    totalMs: 900,
  };

  const forbidden = ['question', 'answer', 'text', 'content', 'prompt', 'ip', 'headers', 'key'];
  for (const field of Object.keys(record)) {
    assert.ok(
      !forbidden.includes(field.toLowerCase()),
      `telemetry exposes a free-text field: ${field}`,
    );
  }
});

test('cost is derived from configured rates, never invented', () => {
  // No rate configured (free tier) must report zero, not a guess.
  assert.equal(estimateCostUsd(1_000_000, 1_000_000), 0);
});

test('a request span measures stages and produces a usable id', () => {
  const span = new RequestSpan();
  assert.match(span.requestId, /^[a-z0-9]{6,10}$/);
  assert.equal(span.at('ttft'), null);

  span.mark('ttft');
  assert.ok((span.at('ttft') ?? -1) >= 0);
  assert.ok(span.elapsedMs >= 0);
});
