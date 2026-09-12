/**
 * Answer cache for repeated questions.
 *
 * Portfolio traffic is unusually repetitive: most visitors click one of the
 * three suggested questions, and recruiters ask the same handful of things in
 * slightly different words. Caching those turns a provider call into a map
 * lookup — which removes the cost, the quota draw and the multi-second
 * thinking latency for the most common path through the product.
 *
 * Two rules keep it honest:
 *
 * 1. Only the FIRST turn of a conversation is cacheable. A follow-up is
 *    interpreted against history that is unique to that visitor, so a cached
 *    "why?" would answer someone else's question.
 * 2. The index version is part of the key. Rebuilding the corpus changes what
 *    is true, and a cache that outlived a content edit would serve answers the
 *    site no longer supports.
 *
 * There is no per-user data in the corpus, so a shared cache leaks nothing
 * between visitors — every entry is derived entirely from public content.
 */
import type { ChatSourceMeta } from './contracts';

export type CachedAnswer = {
  text: string;
  sources: ChatSourceMeta[];
  provider: string | null;
  refused: boolean;
};

type Entry = { value: CachedAnswer; expiresAt: number };

export const CACHE_TTL_MS = 60 * 60 * 1_000;
export const CACHE_CAPACITY = 200;

/**
 * Normalizes away the differences that do not change the question: case,
 * punctuation, filler words and whitespace. "What's his RAG experience?" and
 * "what is his rag experience" are one cache entry.
 *
 * This is deliberately lexical, not semantic. A semantic cache would need an
 * embedding per lookup and a similarity threshold, and a threshold set even
 * slightly too loose answers a question the visitor did not ask — a much worse
 * failure than a cache miss.
 */
/**
 * Removed because they carry no meaning on their own, so their presence or
 * absence should not split one question into two cache entries. Includes the
 * bare `s` left behind when an apostrophe is stripped from a contraction,
 * which is what makes "what's his RAG experience" and "what is his RAG
 * experience" resolve to the same key.
 */
const FILLER =
  /\b(please|can you|could you|tell me|i want to know|so|just|really|is|are|was|were|the|a|an|of|do|does|did|s)\b/g;

export function normalizeQuestion(question: string): string {
  return question
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s]/g, ' ')
    .replace(FILLER, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export class AnswerCache {
  private readonly entries = new Map<string, Entry>();
  private hits = 0;
  private misses = 0;

  constructor(
    private readonly capacity: number = CACHE_CAPACITY,
    private readonly ttlMs: number = CACHE_TTL_MS,
  ) {}

  key(question: string, indexVersion: string): string {
    return `${indexVersion}::${normalizeQuestion(question)}`;
  }

  get(key: string, now: number = Date.now()): CachedAnswer | null {
    const entry = this.entries.get(key);
    if (!entry) {
      this.misses += 1;
      return null;
    }

    if (entry.expiresAt <= now) {
      this.entries.delete(key);
      this.misses += 1;
      return null;
    }

    // Re-insert so this key becomes most-recently-used.
    this.entries.delete(key);
    this.entries.set(key, entry);
    this.hits += 1;
    return entry.value;
  }

  set(key: string, value: CachedAnswer, now: number = Date.now()): void {
    this.entries.delete(key);
    this.entries.set(key, { value, expiresAt: now + this.ttlMs });

    while (this.entries.size > this.capacity) {
      const oldest = this.entries.keys().next();
      if (oldest.done) break;
      this.entries.delete(oldest.value);
    }
  }

  stats() {
    const total = this.hits + this.misses;
    return {
      size: this.entries.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: total === 0 ? 0 : Number((this.hits / total).toFixed(3)),
    };
  }

  clear(): void {
    this.entries.clear();
    this.hits = 0;
    this.misses = 0;
  }
}
