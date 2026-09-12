/**
 * The retrieval-then-generation pipeline, independent of any transport.
 *
 * Keeping this out of the API route is what makes the anti-hallucination
 * guarantee testable: the refusal path can be asserted against a stub provider
 * chain that fails the test if it is ever called, which is a stronger claim
 * than "the prompt tells the model not to".
 *
 * The pipeline reports facts; it does not log. The route owns the request span
 * and the log line, so there is exactly one place where anything is written
 * about a request and exactly one place to audit for leaked content.
 */
import { budgetPrompt, estimateTokens } from '@/lib/ai/tokens';
import {
  REFUSAL_MESSAGE,
  PROVIDER_FALLBACK_MESSAGE,
  SYSTEM_CARD,
  buildPrompt,
  contextualizeQuery,
} from './prompt';
import { generate, type GenerationOutcome, type Provider } from './providers';
import { MIN_SCORE, TOP_K, retrieve } from './vector';
import type { ChatTurn, RagIndex, RetrievedChunk } from './types';

export type RefusalReason = 'no_index' | 'below_floor' | 'retrieval_error';

export type PipelineOutcome = {
  refused: boolean;
  /** Why nothing was answered, when it was not. */
  refusalReason: RefusalReason | null;
  provider: string | null;
  model: string | null;
  fallbackUsed: boolean;
  retriesUsed: number;
  /** Sources were found but no provider produced prose. */
  degraded: boolean;
  retrievedCount: number;
  topScore: number | null;
  droppedSources: number;
  droppedTurns: number;
  promptTokens: number;
  completionTokens: number;
  retrievalMs: number;
  indexVersion: string | null;
  /** The complete answer, so the caller can cache it without re-joining. */
  answer: string;
};

export type PipelineEvent =
  /** Always first. An empty list means the question was refused. */
  | { type: 'sources'; sources: RetrievedChunk[] }
  | { type: 'token'; text: string }
  | { type: 'done'; outcome: PipelineOutcome };

export type PipelineDeps = {
  /** Resolves to null when no index shipped — treated as "nothing retrievable". */
  loadIndex: () => Promise<RagIndex | null>;
  embedQuery: (question: string) => Promise<number[]>;
  chain: Provider[];
  topK?: number;
  minScore?: number;
  /** Injected so tests can drive timings without a real clock. */
  now?: () => number;
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
  signal: AbortSignal
): AsyncGenerator<PipelineEvent> {
  const { topK = TOP_K, minScore = MIN_SCORE, now = Date.now } = deps;

  const retrievalStarted = now();
  let results: RetrievedChunk[] = [];
  let indexVersion: string | null = null;
  let refusalReason: RefusalReason | null = null;

  try {
    const index = await deps.loadIndex();
    if (!index) {
      refusalReason = 'no_index';
    } else {
      indexVersion = index.version;
      // Embed the question *in context* so a follow-up retrieves against the
      // topic it refers to; the model still receives the question verbatim.
      const queryVector = await deps.embedQuery(contextualizeQuery(question, history));
      results = retrieve(queryVector, index.chunks, index.vectors, { topK, minScore });
      if (results.length === 0) refusalReason = 'below_floor';
    }
  } catch (error) {
    // A retrieval failure must never become an ungrounded answer: fall through
    // with no sources, which takes the refusal path below.
    console.error('[chat] retrieval failed:', error);
    results = [];
    refusalReason = 'retrieval_error';
  }

  const retrievalMs = now() - retrievalStarted;

  const base: PipelineOutcome = {
    refused: true,
    refusalReason,
    provider: null,
    model: null,
    fallbackUsed: false,
    retriesUsed: 0,
    degraded: false,
    retrievedCount: results.length,
    topScore: results.length ? Number(results[0].score.toFixed(3)) : null,
    droppedSources: 0,
    droppedTurns: 0,
    promptTokens: 0,
    completionTokens: 0,
    retrievalMs,
    indexVersion,
    answer: REFUSAL_MESSAGE,
  };

  if (results.length === 0) {
    yield { type: 'sources', sources: [] };
    yield { type: 'token', text: REFUSAL_MESSAGE };
    yield { type: 'done', outcome: base };
    return;
  }

  // Fit the prompt to the token budget before anything is sent or shown, so
  // the sources the visitor sees are exactly the ones the model was given.
  const budget = budgetPrompt({ systemCard: SYSTEM_CARD, question, results, history });

  yield { type: 'sources', sources: budget.results };

  const prompt = buildPrompt(question, budget.results, budget.history);

  let generation: GenerationOutcome = {
    provider: null,
    model: null,
    fallbackUsed: false,
    retriesUsed: 0,
  };
  let answer = '';

  for await (const token of generate(deps.chain, prompt, signal, (result) => {
    generation = result;
  })) {
    answer += token;
    yield { type: 'token', text: token };
  }

  // No key configured, or every provider failed before emitting a token. The
  // sources were already sent, so the visitor still gets the grounded answer —
  // just without the prose around it.
  const degraded = answer.length === 0;
  if (degraded) {
    answer = PROVIDER_FALLBACK_MESSAGE;
    yield { type: 'token', text: PROVIDER_FALLBACK_MESSAGE };
  }

  yield {
    type: 'done',
    outcome: {
      ...base,
      refused: false,
      refusalReason: null,
      provider: generation.provider,
      model: generation.model,
      fallbackUsed: generation.fallbackUsed,
      retriesUsed: generation.retriesUsed,
      degraded,
      retrievedCount: budget.results.length,
      droppedSources: budget.droppedSources,
      droppedTurns: budget.droppedTurns,
      promptTokens: estimateTokens(prompt.system) + estimateTokens(prompt.user),
      completionTokens: estimateTokens(answer),
      answer,
    },
  };
}
