/**
 * Structured, per-request telemetry for the chat endpoint.
 *
 * A non-deterministic system that you cannot see into is a system you cannot
 * operate. When someone reports "it told me it didn't know", the questions are
 * immediate and specific: did retrieval find anything, what did it score, which
 * provider answered, did it fall back, how long did each stage take. None of
 * that is recoverable after the fact unless it was recorded at the time.
 *
 * One structured line per request, emitted on a single `console.log`, because
 * that is what Vercel's log drain ingests on the free tier — no agent, no
 * sidecar, no vendor. The shape is deliberately flat and stable so it can be
 * queried as JSON, and so moving to a real sink later is a change of transport
 * rather than a change of instrumentation.
 *
 * REDACTION IS STRUCTURAL: this module has no field for the question text, the
 * answer text, or any header. It cannot leak what it cannot hold. Question
 * *shape* (length, token count) is recorded because it is diagnostic; question
 * *content* is the visitor's, and is not ours to keep.
 */

export type ChatStatus =
  | 'answered'
  | 'refused'
  | 'cached'
  | 'rate_limited'
  | 'rejected'
  | 'degraded'
  | 'error';

export type ChatTelemetry = {
  event: 'chat_request';
  requestId: string;
  status: ChatStatus;
  /** Coarse, non-identifying client bucket. Never the raw IP. */
  client: string;
  cached: boolean;
  provider: string | null;
  model: string | null;
  fallbackUsed: boolean;
  retriesUsed: number;
  indexVersion: string | null;
  questionChars: number;
  questionTokens: number;
  historyTurns: number;
  retrievedCount: number;
  topScore: number | null;
  droppedSources: number;
  droppedTurns: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  /** tokens x configured rate. Zero on the free tier — never an invented rate. */
  estimatedCostUsd: number;
  embedMs: number | null;
  retrievalMs: number | null;
  ttftMs: number | null;
  totalMs: number;
  errorType?: string;
};

/**
 * Price per million tokens, from the environment. Defaults to zero because
 * both providers are on a free tier here — a made-up rate would be worse than
 * no rate, since it would look like a measurement.
 */
const USD_PER_MILLION_INPUT = Number(process.env.AI_USD_PER_MTOK_INPUT ?? 0);
const USD_PER_MILLION_OUTPUT = Number(process.env.AI_USD_PER_MTOK_OUTPUT ?? 0);

export function estimateCostUsd(promptTokens: number, completionTokens: number): number {
  const cost =
    (promptTokens / 1_000_000) * USD_PER_MILLION_INPUT +
    (completionTokens / 1_000_000) * USD_PER_MILLION_OUTPUT;
  return Number(cost.toFixed(6));
}

/**
 * A short random id. Not a UUID: it only has to be unique across the logs of
 * one deployment for long enough to correlate a report with a request, and it
 * is shown to the visitor so they can quote it — which makes length a UX
 * property as much as a collision property.
 */
export function createRequestId(): string {
  return Math.random().toString(36).slice(2, 10);
}

/**
 * A one-way, non-identifying bucket for a client key.
 *
 * Rate limiting needs to tell clients apart; logs do not need to know who they
 * were. Hashing to a small space keeps "was this one visitor or forty?"
 * answerable while making the IP unrecoverable from the logs.
 */
export function anonymizeClient(key: string): string {
  let hash = 2166136261;
  for (let i = 0; i < key.length; i += 1) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `c_${(hash >>> 0).toString(36)}`;
}

/**
 * Collects stage timings without scattering `Date.now()` through the request
 * path. Marks are relative to span creation, so they are directly comparable
 * across requests.
 */
export class RequestSpan {
  readonly requestId = createRequestId();
  private readonly startedAt = Date.now();
  private readonly marks = new Map<string, number>();

  mark(name: string): void {
    this.marks.set(name, Date.now() - this.startedAt);
  }

  at(name: string): number | null {
    return this.marks.get(name) ?? null;
  }

  /** Elapsed time between two marks, or null if either never happened. */
  between(from: string, to: string): number | null {
    const a = this.marks.get(from);
    const b = this.marks.get(to);
    return a === undefined || b === undefined ? null : b - a;
  }

  get elapsedMs(): number {
    return Date.now() - this.startedAt;
  }
}

/** Emits one structured line. Kept as the only sink so redaction stays here. */
export function logChat(telemetry: ChatTelemetry): void {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(telemetry));
}
