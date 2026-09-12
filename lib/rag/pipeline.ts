/**
 * The retrieval-then-generation pipeline, independent of any transport.
 *
 * Keeping this out of the API route is what makes the anti-hallucination
 * guarantee testable: the refusal path can be asserted against a stub provider
 * chain that fails the test if it is ever called, which is a stronger claim
 * than "the prompt tells the model not to".
 */
import { REFUSAL_MESSAGE, PROVIDER_FALLBACK_MESSAGE, buildPrompt } from './prompt';
import { generate, type Provider, type ProviderName } from './providers';
import { MIN_SCORE, TOP_K, retrieve } from './vector';
import type { ChatTurn, RagIndex, RetrievedChunk } from './types';

export type PipelineEvent =
  /** Always first. An empty list means the question was refused. */
  | { type: 'sources'; sources: RetrievedChunk[] }
  | { type: 'token'; text: string }
  | { type: 'done'; provider: ProviderName | null; refused: boolean };

export type PipelineDeps = {
  /** Resolves to null when no index shipped — treated as "nothing retrievable". */
  loadIndex: () => Promise<RagIndex | null>;
  embedQuery: (question: string) => Promise<number[]>;
  chain: Provider[];
  topK?: number;
  minScore?: number;
};

/**
 * Yields the full response as a sequence of events.
 *
 * The order of operations is the whole design: retrieve first, and only call a
 * model if retrieval produced something above the floor. A model that is never
 * invoked cannot invent anything, so the refusal is a structural property
 * rather than an instruction the model might not follow.
 */
export async function* runPipeline(
  question: string,
  history: ChatTurn[],
  deps: PipelineDeps,
  signal: AbortSignal,
): AsyncGenerator<PipelineEvent> {
  const { topK = TOP_K, minScore = MIN_SCORE } = deps;

  let results: RetrievedChunk[] = [];

  try {
    const index = await deps.loadIndex();
    if (index) {
      const queryVector = await deps.embedQuery(question);
      results = retrieve(queryVector, index.chunks, index.vectors, {
        topK,
        minScore,
      });
    }
  } catch (error) {
    // A retrieval failure must never become an ungrounded answer: fall through
    // with no sources, which takes the refusal path below.
    console.error('[chat] retrieval failed:', error);
    results = [];
  }

  if (results.length === 0) {
    yield { type: 'sources', sources: [] };
    yield { type: 'token', text: REFUSAL_MESSAGE };
    yield { type: 'done', provider: null, refused: true };
    return;
  }

  yield { type: 'sources', sources: results };

  const prompt = buildPrompt(question, results, history);

  let provider: ProviderName | null = null;
  let produced = false;

  for await (const token of generate(deps.chain, prompt, signal, (name) => {
    provider = name;
  })) {
    produced = true;
    yield { type: 'token', text: token };
  }

  // No key configured, or every provider failed before emitting a token. The
  // sources were already sent, so the visitor still gets the grounded answer —
  // just without the prose around it.
  if (!produced) yield { type: 'token', text: PROVIDER_FALLBACK_MESSAGE };

  yield { type: 'done', provider, refused: false };
}
