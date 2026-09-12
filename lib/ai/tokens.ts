/**
 * Token estimation and prompt budgeting.
 *
 * Nothing here calls a tokenizer. A real BPE tokenizer for each provider would
 * be a megabyte of tables and a per-request cost, to make a decision — "does
 * this prompt fit?" — that only needs to be right to within a few percent.
 * ~4 characters per token over-counts English prose slightly, which is the
 * safe direction: the budget binds a little early rather than a little late.
 *
 * Budgeting matters even with a large context window. Every token in the
 * prompt is paid for on every turn, and a prompt that grows without bound is
 * how a chat feature turns into an unbounded bill.
 */
import type { ChatTurn, RetrievedChunk } from '@/lib/rag/types';

export const estimateTokens = (text: string): number => Math.ceil(text.length / 4);

/**
 * Ceiling for everything sent to the provider: system card + sources +
 * history + question. Sized so a full top-5 retrieval (5 x ~300) plus four
 * turns of history plus the system card fits with headroom, and anything
 * beyond that is trimmed rather than silently paid for.
 */
export const MAX_PROMPT_TOKENS = 3_000;

/** History is trimmed before sources: evidence outranks conversation. */
export const MAX_HISTORY_TOKENS = 600;

/** Longest single history message carried forward, in tokens. */
export const MAX_TURN_TOKENS = 150;

export type BudgetInput = {
  systemCard: string;
  question: string;
  results: RetrievedChunk[];
  history: ChatTurn[];
  maxPromptTokens?: number;
};

export type BudgetResult = {
  results: RetrievedChunk[];
  history: ChatTurn[];
  /** What the budget actually removed — surfaced in telemetry, not guessed. */
  droppedSources: number;
  droppedTurns: number;
  estimatedPromptTokens: number;
};

const turnTokens = (turn: ChatTurn) => estimateTokens(turn.content) + 4;
const sourceTokens = (result: RetrievedChunk) =>
  estimateTokens(result.chunk.text) + estimateTokens(result.chunk.title) + 8;

/**
 * Fits the prompt to the budget, dropping the least valuable material first.
 *
 * Order is deliberate: oldest history goes before any source does, because a
 * dropped source can make an answer wrong while a dropped turn only makes it
 * less contextual. Sources are dropped lowest-score-first, and at least one
 * always survives — a prompt with no evidence would invite the model to answer
 * from its own knowledge, which is the one thing this system must never do.
 */
export function budgetPrompt(input: BudgetInput): BudgetResult {
  const { systemCard, question, maxPromptTokens = MAX_PROMPT_TOKENS } = input;

  const fixed = estimateTokens(systemCard) + estimateTokens(question) + 32;

  // Truncate individual turns first: one pasted essay in the history should
  // not evict the evidence.
  let history = input.history.map((turn) =>
    turnTokens(turn) > MAX_TURN_TOKENS
      ? { ...turn, content: `${turn.content.slice(0, MAX_TURN_TOKENS * 4)}…` }
      : turn,
  );

  let droppedTurns = input.history.length - history.length;
  while (
    history.length &&
    history.reduce((sum, t) => sum + turnTokens(t), 0) > MAX_HISTORY_TOKENS
  ) {
    history = history.slice(1);
    droppedTurns += 1;
  }

  let results = [...input.results];
  let droppedSources = 0;

  const total = () =>
    fixed +
    history.reduce((sum, t) => sum + turnTokens(t), 0) +
    results.reduce((sum, r) => sum + sourceTokens(r), 0);

  while (total() > maxPromptTokens && history.length) {
    history = history.slice(1);
    droppedTurns += 1;
  }

  while (total() > maxPromptTokens && results.length > 1) {
    results.pop(); // results arrive sorted by score, so this drops the weakest
    droppedSources += 1;
  }

  return {
    results,
    history,
    droppedSources,
    droppedTurns,
    estimatedPromptTokens: total(),
  };
}
