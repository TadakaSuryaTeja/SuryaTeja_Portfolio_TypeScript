/**
 * Builds the retrieval index that "Ask My Portfolio" answers from.
 *
 * The index is a *build artifact*, not a database. It is generated from the
 * same structured content the site renders, versioned with the deploy, and
 * therefore cannot drift out of sync with the page a visitor is reading —
 * which is the failure mode a managed vector store would introduce for a
 * corpus this size.
 *
 * The script is idempotent: same inputs, same `version` hash, byte-identical
 * output. It fails loudly rather than shipping a degraded index, because a
 * silently-empty index turns every answer into a refusal and nothing in the
 * UI would say why.
 *
 * Run: npm run gen:rag
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

import {
  about,
  blogPosts,
  certifications,
  contactInfo,
  educationInfo,
  experience,
  metrics,
  ownershipLayers,
  profile,
  recruiterBrief,
  skillCategories,
} from '../portfolio';
import { systems } from '../content/systems';
import { technologies } from '../content/taxonomy';
import {
  contact as resumeContact,
  education as resumeEducation,
  certifications as resumeCertifications,
} from '../content/resume.mjs';

import { buildChunks, estimateTokens, MAX_CHUNK_TOKENS } from '../lib/rag/chunk';
import { EMBEDDING_DIMENSIONS, EMBEDDING_MODEL, embed } from '../lib/rag/embed';
import { quantize } from '../lib/rag/vector';
import type { RagIndex } from '../lib/rag/types';

const OUTPUT_PATH = 'public/rag-index.json';

/** Files whose contents feed the corpus. Any edit changes the version hash. */
const SOURCE_FILES = [
  'portfolio.ts',
  'content/systems.ts',
  'content/taxonomy.ts',
  'content/resume.mjs',
  'lib/rag/chunk.ts',
  'pages/work/[slug].tsx',
];

/** Smallest corpus worth shipping. Below this, something failed to import. */
const MIN_CHUNKS = 50;

const fail = (message: string): never => {
  console.error(`✗ gen:rag — ${message}`);
  process.exit(1);
};

/**
 * Hashes the raw source files rather than the generated chunks. The chunker
 * itself is included, so a change to the chunking rules invalidates the index
 * even when no content moved.
 */
function corpusVersion(): string {
  const hash = createHash('sha256');
  hash.update(`${EMBEDDING_MODEL}:${EMBEDDING_DIMENSIONS}:${MAX_CHUNK_TOKENS}`);
  for (const file of SOURCE_FILES) {
    hash.update(file);
    hash.update(readFileSync(file));
  }
  return hash.digest('hex').slice(0, 16);
}

async function main() {
  const started = Date.now();

  const chunks = buildChunks({
    profile,
    recruiterBrief,
    about,
    metrics,
    skillCategories,
    ownershipLayers,
    experience,
    educationInfo,
    certifications,
    blogPosts,
    contactInfo,
    systems,
    technologies,
    resume: {
      name: resumeContact.name,
      email: resumeContact.email,
      phone: resumeContact.phone,
      location: resumeContact.location,
      website: resumeContact.website,
      education: resumeEducation,
      certifications: resumeCertifications,
    },
  });

  if (chunks.length === 0) fail('the corpus is empty — no content was chunked.');
  if (chunks.length < MIN_CHUNKS) {
    fail(
      `only ${chunks.length} chunks were produced (expected at least ${MIN_CHUNKS}). ` +
        'A content module probably failed to import.',
    );
  }

  const oversized = chunks.filter((chunk) => estimateTokens(chunk.text) > MAX_CHUNK_TOKENS);
  if (oversized.length) {
    fail(
      `${oversized.length} chunk(s) exceed the ${MAX_CHUNK_TOKENS}-token budget and could not be ` +
        `split on a paragraph boundary:\n  ${oversized
          .map((c) => `${c.id} (~${estimateTokens(c.text)} tokens)`)
          .join('\n  ')}\n` +
        'Add a paragraph break inside the offending content entry.',
    );
  }

  console.log(`  ${chunks.length} chunks · embedding with ${EMBEDDING_MODEL}…`);

  const vectors: RagIndex['vectors'] = [];
  const BATCH = 32;
  for (let i = 0; i < chunks.length; i += BATCH) {
    const batch = chunks.slice(i, i + BATCH);
    const embeddings = await embed(batch.map((chunk) => chunk.text));
    vectors.push(...embeddings.map(quantize));
    process.stdout.write(`\r  embedded ${Math.min(i + BATCH, chunks.length)}/${chunks.length}`);
  }
  process.stdout.write('\n');

  if (vectors.length !== chunks.length) {
    fail(`embedded ${vectors.length} vectors for ${chunks.length} chunks.`);
  }

  const index: RagIndex = {
    version: corpusVersion(),
    model: EMBEDDING_MODEL,
    dimensions: EMBEDDING_DIMENSIONS,
    // Pinned to the corpus hash, not the wall clock, so an unchanged corpus
    // produces a byte-identical artifact and a no-op diff.
    createdAt: new Date(0).toISOString(),
    chunks,
    vectors,
  };

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(index), 'utf8');

  const kb = Math.round(Buffer.byteLength(JSON.stringify(index)) / 1024);
  console.log(
    `✓ ${OUTPUT_PATH} — ${chunks.length} chunks, ${EMBEDDING_DIMENSIONS}d int8, ` +
      `${kb} KB, version ${index.version} (${((Date.now() - started) / 1000).toFixed(1)}s)`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  fail(
    `${message}\n` +
      'If this is a model download failure, the build host needs network access to ' +
      'huggingface.co once; the weights are then cached in .rag-model/.',
  );
});
