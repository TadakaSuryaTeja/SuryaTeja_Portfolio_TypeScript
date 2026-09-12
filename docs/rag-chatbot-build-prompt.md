# RAG Chatbot — Build Prompt & Production Architecture

## Part 1 — The build prompt

> Paste this into a fresh Claude Code session at the repo root.

---

Build a retrieval-augmented chatbot ("Ask My Portfolio") into this Next.js 13
(pages router) + TypeScript + Tailwind portfolio. It answers recruiter questions
about Surya Teja Tadaka using only facts already in this repo. It must run
entirely on Vercel's free tier with zero paid services.

### Hard constraints
- No vector database, no AWS, no Docker, no paid API. Free tiers only.
- Never invent a fact. Every claim must trace to a retrieved chunk.
  `portfolio.ts` is the single source of truth and its header rule applies:
  facts are copied, never embellished.
- Total added bundle cost to the main page: 0 KB. The chat UI is dynamically
  imported and only loads when opened.
- TypeScript strict. Match existing conventions in `lib/` and `components/`.
- `npm run build`, `npm run lint` and `npm test` must all pass.

### 1. Ingestion — `scripts/build-embeddings.ts`
Run via a new `gen:rag` script, wired into `build` before `next build`.

- Source the corpus from: `portfolio.ts` (all exports), `content/resume.mjs`,
  `content/systems.ts`, `content/taxonomy.ts`, and the MDX/TSX under
  `pages/work/`. Do not scrape rendered HTML — read the structured data.
- Chunk semantically, not by character count: one chunk per experience entry,
  per project, per skill category, per certification, per blog post. Split any
  chunk over ~300 tokens on paragraph boundaries with 1-sentence overlap.
- Every chunk carries metadata: `{ id, text, source, section, title, url,
  dateRange? }` so answers can cite and deep-link.
- Embed with `@xenova/transformers` using `Xenova/all-MiniLM-L6-v2` (384-dim),
  running locally in Node. No network calls, no API key.
- Quantize vectors to int8 with a per-vector scale factor to keep the artifact
  small. Write `public/rag-index.json` plus a `version` hash of the inputs.
- The script must be idempotent and must fail loudly if the corpus is empty or
  a chunk exceeds the token budget.

### 2. Retrieval + generation — `pages/api/chat.ts`
Edge runtime (`export const config = { runtime: 'edge' }`).

- Load and memoize the index on first request.
- Embed the user query with the same MiniLM model (WASM backend).
- Cosine similarity, take top-5 above a `MIN_SCORE = 0.30` floor.
- **If nothing clears the floor, do not call the LLM.** Return a fixed message
  that says the question is outside what the site covers, and link to the
  contact section. This is the anti-hallucination guarantee — test it.
- Prompt shape: a system card (who Surya is, tone: concise, factual, first
  person as an assistant *about* him not *as* him, never speculate about
  salary/visa/availability beyond what the resume states) + the retrieved
  chunks as numbered sources + the last 4 turns of history + the question.
  Instruct the model to cite sources as `[1]`, `[2]`.
- Provider chain with failover: Groq `llama-3.3-70b-versatile` →
  Google `gemini-2.0-flash` → static fallback message. Stream via SSE.
  Keys from `GROQ_API_KEY` / `GEMINI_API_KEY` env vars; degrade gracefully
  if a key is absent rather than crashing the build.
- Abuse control: in-memory LRU rate limit, 10 requests/min/IP, 500-char cap on
  input, reject prompt-injection patterns that try to override the system card.

### 3. UI — `components/chat/`
- Floating action button, bottom-right, respecting the existing accent system
  in `lib/accent.ts` and the light/dark theme.
- Panel with streamed token rendering, source chips under each answer that
  deep-link into the site, and 3 suggested starter questions
  ("What's his experience with agentic systems?", "Has he shipped RAG in
  production?", "Walk me through his AWS work").
- Full keyboard access, `prefers-reduced-motion` respected, ARIA live region
  for streamed output, focus trap while open, Esc to close.
- Mobile: full-height sheet below 640px.

### 4. Tests — `tests/rag.test.ts` (tsx --test, matching existing style)
- Chunker produces non-empty, metadata-complete chunks from a fixture.
- Cosine similarity ranks a known-relevant chunk first for a known query.
- Below-threshold query returns the refusal path and never reaches a provider.
- Rate limiter blocks the 11th request in a window.

### 5. Docs
Add a short section to `README.md`: how the index is built, how to add a
provider key, and how to regenerate after editing `portfolio.ts`.

Work incrementally: ingestion + tests first, prove retrieval quality from the
CLI, then the API route, then the UI last.

---

## Part 2 — Production architecture

```
BUILD TIME (Vercel CI, every deploy)
  portfolio.ts · content/* · pages/work/*
        │  scripts/build-embeddings.ts
        ├─ section-aware chunking (~300 tok, metadata-tagged)
        ├─ @xenova/transformers · all-MiniLM-L6-v2 · 384-dim · local · free
        └─ public/rag-index.json   (int8-quantized, ~400 KB, version-hashed)

REQUEST TIME (Vercel Edge Function)
  question
    ├─ rate limit (LRU, 10/min/IP) ─────────────► 429
    ├─ embed query (MiniLM WASM, ~40 ms)
    ├─ cosine top-5 over in-memory index, floor 0.30
    ├─ nothing clears floor ────────────────────► grounded refusal + contact
    ├─ prompt = system card + sources + history
    ├─ Groq llama-3.3-70b ─fail─► Gemini Flash ─fail─► static message
    └─ SSE stream ─────────────────────────────► React panel + source chips
```

### Why no vector DB
The corpus is ~200–400 chunks. Brute-force cosine over 400 × 384 int8 vectors
is sub-millisecond and needs no network hop. A managed index would add latency,
cost, an availability dependency and an operational surface — to search 8 KB of
text. Ship the index as a build artifact instead: it is immutable, versioned
with the deploy, and therefore can never drift out of sync with the site.

### Why no AWS
AWS earns its place at one of three thresholds, none of which this hits:
corpus beyond ~50k chunks (needs ANN + a real store), per-user private data
(needs auth, isolation, audit), or self-hosted weights (needs GPUs). For a
public, single-tenant, read-only corpus, Vercel Edge is strictly the better
engineering answer — and cheaper to defend in an interview than an
over-provisioned cluster.

### What would change at scale (say so if a recruiter asks)
| Trigger | Change |
|---|---|
| > 50k chunks | Swap the JSON index for pgvector on Neon or Upstash Vector; keep the same retrieval interface |
| Per-user data | Move to AWS: Lambda + OpenSearch Serverless, Cognito for identity, per-tenant index prefixes |
| Paid traffic | Add semantic caching (Upstash Redis) on normalized queries — typically 40%+ hit rate on portfolio-style traffic |
| Quality regressions | Golden-question eval set in CI; fail the build if recall@5 drops |

### Cost and performance envelope
- Infra cost: **$0** (Vercel Hobby + Groq/Gemini free tiers).
- Embedding cost: **$0** forever — runs locally, no API.
- Cold start ~200 ms; p50 time-to-first-token ~400 ms.
- Failure modes are all graceful: no key → static answers; provider down →
  failover; no relevant chunk → honest refusal.
