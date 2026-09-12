/**
 * Scoring for the golden set.
 *
 * Separated from the runner so the scoring rules are unit-testable against a
 * fixture index — an eval harness that is itself untested will happily report
 * a green suite while measuring the wrong thing.
 */
import { contextualizeQuery } from '@/lib/rag/prompt';
import { validateQuestion } from '@/lib/rag/guard';
import { retrieve } from '@/lib/rag/vector';
import type { RagIndex, ChatTurn } from '@/lib/rag/types';
import type { EvalCase, EvalCategory } from './dataset';

export type CaseResult = {
  id: string;
  category: EvalCategory;
  passed: boolean;
  /** What the system actually did. */
  actual: 'answer' | 'refuse' | 'block';
  retrieved: string[];
  topScore: number | null;
  /** True when a `mustRetrieve` prefix appeared in the top-k. */
  recallHit: boolean | null;
  latencyMs: number;
  note?: string;
};

export type EvalReport = {
  total: number;
  passed: number;
  failed: number;
  byCategory: Record<string, { total: number; passed: number }>;
  /** Share of answerable cases whose expected chunk was retrieved. */
  recallAtK: number | null;
  /** Share of out-of-corpus cases correctly refused. */
  refusalAccuracy: number | null;
  /** Share of hostile inputs blocked before retrieval. */
  injectionBlockRate: number | null;
  medianLatencyMs: number | null;
  results: CaseResult[];
};

export type EvalDeps = {
  index: RagIndex | null;
  embedQuery: ((text: string) => Promise<number[]>) | null;
  now?: () => number;
};

const toHistory = (questions: string[] | undefined): ChatTurn[] =>
  (questions ?? []).map((content) => ({ role: 'user' as const, content }));

/**
 * Runs one case through the same guard, contextualization and retrieval the
 * live endpoint uses. Generation is deliberately NOT invoked: it costs quota,
 * it is non-deterministic, and every property worth regression-testing here
 * is decided before a model is called.
 */
export async function runCase(evalCase: EvalCase, deps: EvalDeps): Promise<CaseResult> {
  const now = deps.now ?? Date.now;
  const started = now();

  const base = {
    id: evalCase.id,
    category: evalCase.category,
    retrieved: [] as string[],
    topScore: null as number | null,
    recallHit: null as boolean | null,
  };

  // 1. Input guard — the only gate that runs before anything is embedded.
  const validation = validateQuestion(evalCase.question);
  if (!validation.ok) {
    return {
      ...base,
      actual: 'block',
      passed: evalCase.expect === 'block',
      latencyMs: now() - started,
      note: validation.reason,
    };
  }

  if (evalCase.expect === 'block') {
    return {
      ...base,
      actual: 'answer',
      passed: false,
      latencyMs: now() - started,
      note: 'hostile or malformed input was not blocked by the guard',
    };
  }

  if (!deps.index || !deps.embedQuery) {
    return {
      ...base,
      actual: 'refuse',
      passed: false,
      latencyMs: now() - started,
      note: 'no index or embedder available — run `npm run gen:rag` first',
    };
  }

  // 2. Retrieval, with the same follow-up contextualization as production.
  const query = contextualizeQuery(evalCase.question, toHistory(evalCase.history));
  const results = retrieve(await deps.embedQuery(query), deps.index.chunks, deps.index.vectors);

  const retrieved = results.map((r) => r.chunk.id);
  const topScore = results.length ? Number(results[0].score.toFixed(3)) : null;
  const actual: CaseResult['actual'] = results.length === 0 ? 'refuse' : 'answer';

  // 3. Recall@k — did any acceptable chunk make the cut?
  const recallHit =
    evalCase.mustRetrieve && evalCase.mustRetrieve.length > 0
      ? retrieved.some((id) => evalCase.mustRetrieve!.some((prefix) => id.startsWith(prefix)))
      : null;

  const passed =
    actual === evalCase.expect && (evalCase.expect !== 'answer' || recallHit !== false);

  return {
    ...base,
    actual,
    retrieved,
    topScore,
    recallHit,
    passed,
    latencyMs: now() - started,
    note: passed
      ? undefined
      : actual !== evalCase.expect
        ? `expected to ${evalCase.expect}, actually ${actual}`
        : `retrieved nothing matching ${evalCase.mustRetrieve?.join(' | ')}`,
  };
}

export function summarize(results: CaseResult[]): EvalReport {
  const byCategory: EvalReport['byCategory'] = {};
  for (const result of results) {
    const bucket = (byCategory[result.category] ??= { total: 0, passed: 0 });
    bucket.total += 1;
    if (result.passed) bucket.passed += 1;
  }

  const ratio = (subset: CaseResult[]) =>
    subset.length === 0
      ? null
      : Number((subset.filter((r) => r.passed).length / subset.length).toFixed(3));

  const withRecall = results.filter((r) => r.recallHit !== null);
  const latencies = results.map((r) => r.latencyMs).sort((a, b) => a - b);

  return {
    total: results.length,
    passed: results.filter((r) => r.passed).length,
    failed: results.filter((r) => !r.passed).length,
    byCategory,
    recallAtK:
      withRecall.length === 0
        ? null
        : Number((withRecall.filter((r) => r.recallHit).length / withRecall.length).toFixed(3)),
    refusalAccuracy: ratio(results.filter((r) => r.category === 'out-of-corpus')),
    injectionBlockRate: ratio(results.filter((r) => r.category === 'injection')),
    medianLatencyMs: latencies.length ? latencies[Math.floor(latencies.length / 2)] : null,
    results,
  };
}

export function formatReport(report: EvalReport): string {
  const pct = (value: number | null) => (value === null ? 'n/a' : `${(value * 100).toFixed(1)}%`);

  const lines = [
    '',
    `  ${report.passed}/${report.total} cases passed`,
    '',
    '  Category            Passed',
    '  ------------------  ------',
    ...Object.entries(report.byCategory).map(
      ([category, { total, passed }]) =>
        `  ${category.padEnd(18)}  ${passed}/${total}${passed === total ? '' : '  <-'}`,
    ),
    '',
    `  Recall@5 (answerable)   ${pct(report.recallAtK)}`,
    `  Refusal accuracy        ${pct(report.refusalAccuracy)}`,
    `  Injection block rate    ${pct(report.injectionBlockRate)}`,
    `  Median retrieval        ${report.medianLatencyMs ?? 'n/a'} ms`,
  ];

  const failures = report.results.filter((r) => !r.passed);
  if (failures.length) {
    lines.push('', '  Failures:');
    for (const failure of failures) {
      lines.push(`   x ${failure.id} (${failure.category}) — ${failure.note ?? 'failed'}`);
    }
  }

  return lines.join('\n');
}
