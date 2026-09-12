/**
 * Retry with exponential backoff and jitter.
 *
 * Failover alone is not a retry strategy. A 429 from a free-tier provider is
 * usually a per-minute burst limit that clears in seconds, and a 500 is often
 * a single bad node — failing straight over to the secondary provider on
 * either one spends the fallback's quota on a problem that would have
 * resolved itself, and leaves nothing in reserve for a real outage.
 *
 * What is NOT retried matters as much: a 400 or a 401 is a bug or a bad key
 * and will fail identically every time, so retrying it just adds latency to a
 * failure that is already certain.
 */

export type RetryOptions = {
  /** Total attempts including the first. */
  attempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  signal?: AbortSignal;
  onRetry?: (info: { attempt: number; delayMs: number; error: unknown }) => void;
};

/** Carries the provider's own advice about when to come back. */
export class RetryableError extends Error {
  constructor(
    message: string,
    readonly status: number,
    /** Seconds, from a `Retry-After` header, when the provider sent one. */
    readonly retryAfterSeconds?: number,
  ) {
    super(message);
    this.name = 'RetryableError';
  }
}

/** 429 and 5xx are transient; 408 and 409 are worth one more go. */
export function isRetryableStatus(status: number): boolean {
  return status === 429 || status === 408 || status === 409 || status >= 500;
}

/**
 * Full jitter: a random point in [0, backoff]. Without it, every client that
 * failed at the same instant retries at the same instant, and the thundering
 * herd reproduces the outage it is trying to ride out.
 */
export function backoffDelay(attempt: number, baseDelayMs: number, maxDelayMs: number): number {
  const ceiling = Math.min(maxDelayMs, baseDelayMs * 2 ** (attempt - 1));
  return Math.random() * ceiling;
}

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal?.aborted) return reject(new Error('Aborted'));
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(new Error('Aborted'));
      },
      { once: true },
    );
  });

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const { attempts = 3, baseDelayMs = 400, maxDelayMs = 4_000, signal, onRetry } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      const retryable = error instanceof RetryableError;
      if (!retryable || attempt === attempts || signal?.aborted) throw error;

      // Honour the provider's own Retry-After over our guess — it knows when
      // the window resets and we are only estimating.
      const advised = error.retryAfterSeconds;
      const delayMs =
        advised !== undefined
          ? Math.min(advised * 1_000, maxDelayMs)
          : backoffDelay(attempt, baseDelayMs, maxDelayMs);

      onRetry?.({ attempt, delayMs, error });
      await sleep(delayMs, signal);
    }
  }

  throw lastError;
}
