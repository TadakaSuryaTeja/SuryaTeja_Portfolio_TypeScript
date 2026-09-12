/**
 * Vector quantization and similarity.
 *
 * The index ships as a static asset, so its size is a page-weight problem, not
 * a storage problem: 384 float32 values per chunk is 1.5 KB before JSON
 * overhead, and JSON has no float16. Int8 with a per-vector scale factor keeps
 * the artifact roughly a quarter of the size at a cosine error of ~1e-3 —
 * far below the gap between a relevant and an irrelevant chunk, and therefore
 * invisible to ranking.
 *
 * Per-vector (rather than global) scaling matters because MiniLM embeddings
 * are L2-normalized: the largest component of one vector says nothing about
 * the largest component of another, so one shared scale would waste range on
 * every vector but the widest.
 */
import type { QuantizedVector, RetrievedChunk, Chunk } from './types';

/** Below this cosine score nothing is considered an answer. See `retrieve`. */
export const MIN_SCORE = 0.3;

export const TOP_K = 5;

/**
 * Keep only chunks scoring within this fraction of the best match.
 *
 * The absolute floor answers "is anything relevant?", but it cannot tell a
 * strong match from a weak one in the same result set. A question with one
 * obvious answer — "what's his phone number?" — was retrieving the contact
 * chunk alongside four unrelated ones that merely cleared 0.30, and every one
 * of them got cited. Padding a precise answer with near-miss citations makes
 * the whole answer look less trustworthy, not more.
 *
 * A relative gate keeps a genuinely broad question ("who is Surya?") at its
 * full five sources, where the top matches really are comparable, while a
 * precise question narrows to the one or two chunks that actually answer it.
 */
export const RELATIVE_SCORE_FLOOR = 0.7;

const INT8_MAX = 127;

export function quantize(vector: number[]): QuantizedVector {
  let max = 0;
  for (const value of vector) {
    const magnitude = Math.abs(value);
    if (magnitude > max) max = magnitude;
  }

  // An all-zero vector has no scale; keep it representable rather than NaN.
  const scale = max === 0 ? 1 : max / INT8_MAX;
  return {
    q: vector.map((value) => Math.round(value / scale)),
    scale: Number(scale.toPrecision(7)),
  };
}

export function dequantize({ q, scale }: QuantizedVector): number[] {
  return q.map((value) => value * scale);
}

/**
 * Cosine similarity against a quantized vector.
 *
 * The query side is a plain float array and is normalized by the caller, so
 * the scale factor cancels out of the numerator and denominator alike — which
 * means dequantizing first would be arithmetic for nothing.
 */
export function cosineToQuantized(query: number[], target: QuantizedVector): number {
  if (query.length !== target.q.length) {
    throw new Error(`Dimension mismatch: query ${query.length} vs index ${target.q.length}`);
  }

  let dot = 0;
  let queryNorm = 0;
  let targetNorm = 0;

  for (let i = 0; i < query.length; i += 1) {
    const a = query[i];
    const b = target.q[i];
    dot += a * b;
    queryNorm += a * a;
    targetNorm += b * b;
  }

  const denominator = Math.sqrt(queryNorm) * Math.sqrt(targetNorm);
  return denominator === 0 ? 0 : dot / denominator;
}

export function normalize(vector: number[]): number[] {
  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  return norm === 0 ? vector : vector.map((value) => value / norm);
}

/**
 * Brute-force top-k over the whole corpus.
 *
 * At a few hundred chunks this is sub-millisecond and exact. An approximate
 * index would trade that exactness for a network hop and an availability
 * dependency — see the README for the thresholds at which that trade starts
 * paying off.
 *
 * Returns only chunks at or above `minScore`. An empty result is meaningful:
 * it is the signal that the question is outside what the site covers, and the
 * caller must refuse rather than fall through to a model.
 */
export function retrieve(
  queryVector: number[],
  chunks: Chunk[],
  vectors: QuantizedVector[],
  {
    topK = TOP_K,
    minScore = MIN_SCORE,
    relativeFloor = RELATIVE_SCORE_FLOOR,
  }: { topK?: number; minScore?: number; relativeFloor?: number } = {},
): RetrievedChunk[] {
  const scored: RetrievedChunk[] = [];

  for (let i = 0; i < chunks.length; i += 1) {
    const vector = vectors[i];
    if (!vector) continue;

    const score = cosineToQuantized(queryVector, vector);
    if (score >= minScore) scored.push({ chunk: chunks[i], score });
  }

  const ranked = scored.sort((a, b) => b.score - a.score).slice(0, topK);
  if (!ranked.length) return ranked;

  // Drop the near-misses that only look relevant next to the real answer.
  const cutoff = ranked[0].score * relativeFloor;
  return ranked.filter((result) => result.score >= cutoff);
}
