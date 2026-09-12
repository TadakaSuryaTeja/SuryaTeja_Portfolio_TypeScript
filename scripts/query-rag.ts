/**
 * Retrieval probe — inspect what the chatbot would be allowed to say, without
 * calling a model.
 *
 * This is the fastest way to judge whether a content change helped or hurt:
 * if the right chunk is not in this list, no prompt wording will rescue the
 * answer, and if the wrong chunk is, the model will faithfully cite it.
 *
 *   npm run rag:query -- "Has he shipped RAG in production?"
 *   npm run rag:query                # runs the starter questions
 */
import { readFileSync } from 'node:fs';

import { embedQuery } from '../lib/rag/embed';
import { MIN_SCORE, TOP_K, retrieve } from '../lib/rag/vector';
import type { RagIndex } from '../lib/rag/types';

const DEFAULT_QUESTIONS = [
  "What's his experience with agentic systems?",
  'Has he shipped RAG in production?',
  'Walk me through his AWS work.',
  // Deliberately outside the corpus — this one should retrieve nothing.
  'What is his favourite restaurant in Dallas?',
];

async function main() {
  let index: RagIndex;
  try {
    index = JSON.parse(readFileSync('public/rag-index.json', 'utf8')) as RagIndex;
  } catch {
    console.error('✗ No index found. Run `npm run gen:rag` first.');
    process.exit(1);
  }

  const questions = process.argv.slice(2).filter(Boolean);
  const asked = questions.length ? questions : DEFAULT_QUESTIONS;

  console.log(
    `Index: ${index.chunks.length} chunks · ${index.model} · version ${index.version}\n` +
      `Floor: ${MIN_SCORE} · top-${TOP_K}\n`,
  );

  for (const question of asked) {
    const results = retrieve(await embedQuery(question), index.chunks, index.vectors);

    console.log(`? ${question}`);
    if (!results.length) {
      console.log('  → nothing cleared the floor: the assistant would refuse.\n');
      continue;
    }
    for (const [i, { chunk, score }] of results.entries()) {
      console.log(`  [${i + 1}] ${score.toFixed(3)}  ${chunk.title}  (${chunk.url})`);
    }
    console.log();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
