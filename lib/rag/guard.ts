/**
 * Abuse controls for the public chat endpoint.
 *
 * The endpoint is unauthenticated and spends someone else's free-tier quota,
 * so it needs a cheap answer to three questions before any model is called:
 * is this IP asking too often, is the input a reasonable question, and is it
 * trying to talk to the system card rather than through it.
 *
 * All of it is in-memory and per-instance. That is deliberate: a shared store
 * would mean a network round trip and an availability dependency in front of
 * every request, to rate-limit a portfolio. Per-instance counters let a burst
 * spread across instances leak a few extra requests — an acceptable ceiling
 * when the downside is a slightly larger free-tier bill, not a breach.
 */

/** Requests permitted per IP per window. */
export const RATE_LIMIT = 10;

/** Window length in milliseconds. */
export const RATE_WINDOW_MS = 60_000;

/** Longest question accepted. Long inputs are prompt-stuffing, not questions. */
export const MAX_INPUT_CHARS = 500;

/** Entries retained before the oldest is evicted. Bounds memory on a hot edge. */
const LRU_CAPACITY = 1_000;

type Bucket = {
  count: number;
  /** Epoch ms at which this bucket resets. */
  resetAt: number;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  /** Seconds until the window resets — surfaced as `Retry-After`. */
  retryAfter: number;
};

/**
 * A Map preserves insertion order, so re-inserting on access turns it into an
 * LRU with no dependency and no bookkeeping beyond a delete and a set.
 */
export class RateLimiter {
  private readonly buckets = new Map<string, Bucket>();

  constructor(
    private readonly limit: number = RATE_LIMIT,
    private readonly windowMs: number = RATE_WINDOW_MS,
    private readonly capacity: number = LRU_CAPACITY,
  ) {}

  check(key: string, now: number = Date.now()): RateLimitResult {
    const existing = this.buckets.get(key);
    const bucket =
      existing && existing.resetAt > now ? existing : { count: 0, resetAt: now + this.windowMs };

    // Re-insert so this key becomes the most recently used.
    this.buckets.delete(key);
    this.buckets.set(key, bucket);

    while (this.buckets.size > this.capacity) {
      const oldest = this.buckets.keys().next();
      if (oldest.done) break;
      this.buckets.delete(oldest.value);
    }

    const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));

    if (bucket.count >= this.limit) {
      return { allowed: false, remaining: 0, retryAfter };
    }

    bucket.count += 1;
    return { allowed: true, remaining: this.limit - bucket.count, retryAfter };
  }

  /** Test seam — production instances live for the lifetime of the isolate. */
  reset(): void {
    this.buckets.clear();
  }
}

/* ----------------------------- input validation --------------------------- */

export type ValidationResult = { ok: true; question: string } | { ok: false; reason: string };

/**
 * Patterns that try to address the system card rather than ask about Surya.
 *
 * This is a cheap first gate, not a security boundary — the real guarantee is
 * that the model only ever sees retrieved chunks, so even a successful
 * override has nothing ungrounded to reveal. Blocking the obvious cases keeps
 * those attempts out of the free-tier quota.
 */
const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+|any\s+)?(previous|prior|above|earlier)\s+(instructions?|prompts?|rules?)/i,
  /disregard\s+(all\s+|any\s+|the\s+)?(previous|prior|above|system)/i,
  /forget\s+(everything|all|your)\s+(you|instructions?|rules?|prompt)/i,
  /(reveal|show|print|repeat|output)\s+(me\s+)?(your|the)\s+(system\s+)?(prompt|instructions?|rules?)/i,
  /you\s+are\s+now\s+(a|an|no longer)/i,
  /\bact\s+as\s+(if\s+)?(a|an|though)\b/i,
  /\b(developer|debug|god|admin|jailbreak)\s+mode\b/i,
  /<\s*\/?\s*(system|instructions?)\s*>/i,
  /\[\s*(system|inst)\s*\]/i,
  /新しい指示|忽略(以上|之前)/i,

  /*
   * Secret exfiltration.
   *
   * These are deliberately verb-anchored rather than noun-anchored. Blocking
   * the bare words "API key" or "credentials" would reject a perfectly good
   * recruiter question — "has he worked with credential management?" is
   * exactly the kind of thing this site exists to answer. What makes an input
   * hostile is the demand that *this assistant* hand something over, so the
   * pattern requires an exfiltration verb pointed at a secret.
   */
  /\b(show|print|reveal|list|give|tell|dump|output|expose|leak)\b[^.?!]{0,40}\b(your|the)\b[^.?!]{0,25}\b(api[\s-]?keys?|secret|credentials?|environment variables?|env\s?vars?|access tokens?|passwords?)\b/i,
  /\b(print|show|dump|list|output|reveal|echo)\b[^.?!]{0,30}\b(all\s+)?(environment variables?|env\s?vars?|process\.env)\b/i,
  /\bprocess\.env\b/i,
];

export function detectInjection(input: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(input));
}

export function validateQuestion(raw: unknown): ValidationResult {
  if (typeof raw !== 'string') return { ok: false, reason: 'A question is required.' };

  const question = raw.replace(/\s+/g, ' ').trim();

  if (!question) return { ok: false, reason: 'A question is required.' };
  if (question.length > MAX_INPUT_CHARS) {
    return {
      ok: false,
      reason: `Questions are limited to ${MAX_INPUT_CHARS} characters.`,
    };
  }
  if (detectInjection(question)) {
    return {
      ok: false,
      reason:
        'That looks like an attempt to change how this assistant works rather than a question about Surya. Ask about his experience, systems or skills instead.',
    };
  }

  return { ok: true, question };
}

/**
 * Best-effort client identity. Vercel sets `x-forwarded-for`; the left-most
 * entry is the client and everything after it is proxy chain. A spoofed header
 * only lets an abuser share someone else's bucket, which costs them requests
 * rather than earning them any.
 *
 * Takes a header lookup rather than a `Headers` object so the same function
 * works against a Node request and a Fetch request alike.
 */
export function clientKey(getHeader: (name: string) => string | string[] | undefined): string {
  const first = (value: string | string[] | undefined) =>
    (Array.isArray(value) ? value[0] : value) ?? '';

  const forwarded = first(getHeader('x-forwarded-for'));
  if (forwarded) return forwarded.split(',')[0].trim();

  return first(getHeader('x-real-ip')).trim() || 'unknown';
}
