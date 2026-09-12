/**
 * Loads the build-time index and keeps it resident.
 *
 * The artifact is read from disk once per warm instance and then lives in
 * memory for every subsequent request — a few hundred kilobytes against a
 * network round trip per query, which is the entire argument for shipping the
 * index with the deploy rather than querying a hosted one.
 *
 * A missing or malformed index resolves to `null` rather than throwing. The
 * pipeline reads that as "nothing is retrievable" and refuses, which is the
 * correct behaviour: a deploy whose index failed to build must not start
 * answering from the model's own knowledge.
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { EMBEDDING_DIMENSIONS } from './embed';
import type { RagIndex } from './types';

export const INDEX_PATH = 'public/rag-index.json';

let cached: Promise<RagIndex | null> | null = null;

function isUsable(index: RagIndex): boolean {
  return (
    Array.isArray(index.chunks) &&
    Array.isArray(index.vectors) &&
    index.chunks.length > 0 &&
    index.chunks.length === index.vectors.length &&
    index.dimensions === EMBEDDING_DIMENSIONS
  );
}

export function loadIndex(): Promise<RagIndex | null> {
  if (!cached) {
    cached = readFile(join(process.cwd(), INDEX_PATH), 'utf8')
      .then((raw) => {
        const index = JSON.parse(raw) as RagIndex;
        if (!isUsable(index)) {
          console.error('[chat] rag-index.json is present but unusable — refusing to answer.');
          return null;
        }
        return index;
      })
      .catch((error: unknown) => {
        console.error(
          `[chat] no retrieval index at ${INDEX_PATH}. Run \`npm run gen:rag\`.`,
          error,
        );
        return null;
      });
  }

  return cached;
}
