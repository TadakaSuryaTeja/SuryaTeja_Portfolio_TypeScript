/**
 * MiniLM embeddings, run locally.
 *
 * `Xenova/all-MiniLM-L6-v2` is a 384-dimension sentence encoder that runs on
 * CPU in ONNX. Using it locally rather than a hosted embedding API is what
 * makes the cost of this feature exactly zero and keeps the build reproducible
 * — there is no key to rotate, no quota to exhaust and no vendor to be down.
 *
 * The same function embeds the corpus at build time and the query at request
 * time. That is not a convenience: an index built with one encoder and queried
 * with another produces confident nonsense, because the vectors still have a
 * cosine similarity — it is just meaningless.
 *
 * The import is dynamic so that `@xenova/transformers` and the ONNX runtime
 * behind it never enter a bundle that does not call this, and so a missing or
 * unfetchable model degrades to a caught error rather than a crash at import.
 */

export const EMBEDDING_MODEL = 'Xenova/all-MiniLM-L6-v2';
export const EMBEDDING_DIMENSIONS = 384;

/**
 * Model weights are cached here rather than in `node_modules` so the build can
 * hand the directory to Next's file tracing and the serverless function ships
 * with the weights it needs. Roughly 25 MB, quantized.
 */
export const MODEL_CACHE_DIR = '.rag-model';

type FeatureExtractor = (
  texts: string[],
  options: { pooling: 'mean'; normalize: boolean },
) => Promise<{ data: Float32Array | number[]; dims: number[] }>;

let extractorPromise: Promise<FeatureExtractor> | null = null;

/**
 * Loads the encoder once per process. Memoizing the *promise* rather than the
 * resolved value means concurrent first requests share one load instead of
 * racing to start several.
 */
export function loadEmbedder(): Promise<FeatureExtractor> {
  if (!extractorPromise) {
    extractorPromise = (async () => {
      const { pipeline, env } = await import('@xenova/transformers');

      env.cacheDir = MODEL_CACHE_DIR;
      // Weights come from the cache directory above, populated at build time.
      // Nothing here reaches the network once that cache exists.
      env.allowLocalModels = false;

      const extractor = await pipeline('feature-extraction', EMBEDDING_MODEL, {
        quantized: true,
      });
      return extractor as unknown as FeatureExtractor;
    })().catch((error) => {
      // Clear the memo so a transient failure does not poison the process.
      extractorPromise = null;
      throw error;
    });
  }

  return extractorPromise;
}

/**
 * Embeds a batch and returns unit-length vectors, mean-pooled over tokens.
 * Batching matters at build time (a few hundred chunks) and is harmless for
 * the single-query case at request time.
 */
export async function embed(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  const extractor = await loadEmbedder();
  const output = await extractor(texts, { pooling: 'mean', normalize: true });

  const dimensions = output.dims[output.dims.length - 1];
  if (dimensions !== EMBEDDING_DIMENSIONS) {
    throw new Error(`Expected ${EMBEDDING_DIMENSIONS}-dim embeddings, got ${dimensions}.`);
  }

  const flat = Array.from(output.data as ArrayLike<number>);
  return texts.map((_, i) => flat.slice(i * dimensions, (i + 1) * dimensions));
}

export async function embedQuery(text: string): Promise<number[]> {
  const [vector] = await embed([text]);
  return vector;
}
