/**
 * The retrieval contract shared by the build script, the API route and the UI.
 *
 * Everything the chatbot is ever allowed to say traces back to a `Chunk` in
 * here, and every `Chunk` is generated from structured content in the repo —
 * `portfolio.ts`, `content/*`, and the case studies rendered under
 * `pages/work/`. Nothing is authored for the chatbot and nothing is scraped.
 */

/** Where a chunk came from — used for provenance, not for ranking. */
export type ChunkSource = 'portfolio' | 'systems' | 'taxonomy' | 'resume' | 'work';

export type Chunk = {
  /** Stable across rebuilds: `${source}:${section}:${slug}[#n]`. */
  id: string;
  text: string;
  source: ChunkSource;
  /** The part of the site this fact lives in, e.g. `experience`, `case-study`. */
  section: string;
  /** Human-readable heading, shown on the source chip. */
  title: string;
  /** Deep link into the site so a cited claim can be checked in one click. */
  url: string;
  /** Only present where the underlying fact is time-bounded. */
  dateRange?: string;
};

/**
 * One int8-quantized embedding. `scale` is per-vector: `v[i] ≈ q[i] * scale`.
 * Stored separately from the chunk so the text stays readable in the artifact.
 */
export type QuantizedVector = {
  q: number[];
  scale: number;
};

export type RagIndex = {
  /** Hash of the corpus + model + chunker settings. Changes ⇒ rebuild. */
  version: string;
  model: string;
  dimensions: number;
  createdAt: string;
  chunks: Chunk[];
  vectors: QuantizedVector[];
};

export type RetrievedChunk = {
  chunk: Chunk;
  score: number;
};

/** A single turn of chat history, as the API route accepts it. */
export type ChatTurn = {
  role: 'user' | 'assistant';
  content: string;
};
