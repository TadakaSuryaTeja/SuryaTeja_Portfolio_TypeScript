# Surya Teja Tadaka — Portfolio

Personal site of **Surya Teja Tadaka** — Technical Lead, Enterprise AI & Agentic
Systems Engineer. It exists to answer one question for a recruiter or an
engineering leader in about five seconds: _can this person design and build
complete production AI systems, not just call an LLM API?_

**Live:** https://surya-teja-tadaka.vercel.app/

---

## Architecture

```
                    ┌──────────────────────────────────────────┐
                    │            CONTENT GRAPH                 │
                    │                                          │
                    │  portfolio.ts        profile · experience │
                    │                      certs · education    │
                    │  content/systems.ts  systems + case       │
                    │                      studies + diagrams   │
                    │  content/taxonomy.ts technology ↔ system  │
                    │                      ↔ employer edges     │
                    │  content/resume.mjs  résumé source        │
                    └───────────────────┬──────────────────────┘
                                        │ one definition per fact
        ┌───────────────────────────────┼───────────────────────────────┐
        │                               │                               │
┌───────▼────────┐          ┌───────────▼──────────┐        ┌───────────▼─────────┐
│  pages/        │          │  components/         │        │  scripts/           │
│  index.tsx     │          │  architecture/  ←────┼────────┤  check-content.ts   │
│  work/[slug]   │          │  knowledge/          │        │  build-resume.mjs   │
│  ai-lab        │          │  projects/           │        │  generate-sitemap   │
│  insights      │          │  recruiter/          │        │  generate-icons     │
│  resume        │          │  motion/             │        └─────────────────────┘
│  api/og        │          │  command/            │
└───────┬────────┘          └──────────────────────┘
        │ getStaticProps (ISR 1h)
        │
┌───────▼──────────┐   ┌──────────────────┐
│ lib/cms/notion   │   │ lib/cms/github   │
│ (Articles)       │   │ (curated repos)  │
└───────┬──────────┘   └────────┬─────────┘
        │ fails → []            │ fails → []
        └───────────┬───────────┘
                    ▼
        local fallback content
        (the site never breaks when an API is down)
```

Content flows one way. Components never hold facts of their own — they read the
content graph. `npm run check:content` and `npm test` enforce that the graph,
the résumé and the portfolio cannot drift apart.

### View modes

The site serves two readers rather than averaging them. The active mode lives on
`<html data-view-mode>`, so switching is pure CSS and content is only ever
hidden, never removed:

| Mode        | What it shows                                                         |
| ----------- | --------------------------------------------------------------------- |
| `default`   | The full narrative, in scroll order                                   |
| `recruiter` | A 60-second summary plus experience, systems, skills, résumé, contact |
| `deep`      | Adds inline decision logs and tradeoffs for engineering readers       |

Reachable from the navbar menu, ⌘K, or `?mode=recruiter` / `?mode=deep`.

### Routes

| Route          | Rendering      | Purpose                                         |
| -------------- | -------------- | ----------------------------------------------- |
| `/`            | SSG + ISR (1h) | The homepage narrative                          |
| `/work/[slug]` | SSG            | Deep case studies with interactive architecture |
| `/ai-lab`      | Static         | AI components, with honest status labels        |
| `/insights`    | SSG + ISR (1h) | Articles (Notion-backed, local fallback)        |
| `/resume`      | Static         | Web résumé, print-friendly, PDF downloads       |
| `/api/og`      | Edge           | Dynamic social cards                            |

## Tech stack

| Layer     | Choice                                          |
| --------- | ----------------------------------------------- |
| Framework | Next.js 13 (Pages Router), React 18             |
| Language  | TypeScript (strict)                             |
| Styling   | Tailwind CSS 3, CSS custom properties           |
| Motion    | Framer Motion + hand-rolled CSS/IO animations   |
| Icons     | Iconify sets, **bundled offline** at build time |
| CMS       | Notion REST API (dependency-free `fetch`)       |
| Analytics | Vercel Analytics + Speed Insights               |
| Hosting   | Vercel                                          |

No 3D library, no animation library duplication, no icon runtime. Every
dependency has to earn its bytes.

## Local setup

```bash
nvm use            # Node 22
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build          # production build
npm run lint           # ESLint
npm test               # content + resilience tests (node:test via tsx)
npm run check:content  # résumé ↔ portfolio ↔ taxonomy consistency
npx tsc --noEmit       # typecheck
npm run build:resume   # regenerate résumé HTML + PDFs
npm run gen:sitemap    # regenerate sitemap.xml from real routes
npm run gen:icons      # re-bundle icons after adding new ones
npm run gen:og         # regenerate the static social card
```

Run `npm run check:content` and `npm test` before every commit — they are what
stop the résumé, the site and the knowledge graph from telling different
stories.

> **Never run `next build` while `next dev` is running** — it clobbers `.next`.
> Stop the dev server first.

## Environment variables

All are **optional and server-side only**. Copy `.env.example` to `.env.local`
and fill in what you have. Never prefix any of them with `NEXT_PUBLIC_`.

| Variable                          | Purpose                            |
| --------------------------------- | ---------------------------------- |
| `NOTION_TOKEN`                    | Notion internal integration secret |
| `NOTION_ARTICLES_DATABASE_ID`     | Insights / articles database       |
| `NOTION_CASE_STUDIES_DATABASE_ID` | Case-studies database              |
| `NOTION_AI_LAB_DATABASE_ID`       | AI Lab experiments database        |
| `GITHUB_TOKEN`                    | Raises the GitHub API rate limit   |

## Notion setup

1. Create an internal integration at <https://www.notion.so/my-integrations>
   and copy the secret into `NOTION_TOKEN`.
2. Create the databases below, then **share each one with the integration**
   (`•••` → Connections → your integration).
3. Copy each database ID out of its URL into the matching variable.

**Articles** — `Title` (title), `Slug` (rich text), `Summary` (rich text),
`Tags` (multi-select), `Published` (checkbox), `Published Date` (date),
`Read Time` (rich text), `URL` (url), `Featured` (checkbox).

**Case Studies** — `Title`, `Slug`, `Category` (select), `Problem` (rich text),
`Technologies` (multi-select), `GitHub URL` (url), `Live URL` (url),
`Featured` (checkbox), `Status` (select: `Draft` / `Published`).

**AI Lab** — `Experiment` (title), `Description` (rich text),
`Technology` (multi-select), `Status` (select), `GitHub` (url), `Demo` (url),
`Published` (checkbox).

Only rows with `Published` checked (or `Status = Published`) are surfaced —
drafts stay invisible, so nothing is ever presented as published before it is.

Content is fetched in `getStaticProps` and revalidated hourly. If Notion is
unconfigured, rate-limited or down, `lib/cms/notion.ts` returns an empty array,
a warning is logged server-side, and the local fallback content renders instead.

## GitHub integration

`lib/cms/github.ts` fetches metadata for a **curated** list of repositories
(quality over vanity metrics) at build time. It works unauthenticated;
`GITHUB_TOKEN` only raises the rate limit. Any failure yields an empty list and
the Open Source section collapses to a profile CTA.

## Content management

| What you want to change        | Where                                   |
| ------------------------------ | --------------------------------------- |
| Any fact on the site           | `portfolio.ts`                          |
| Navigation order / labels      | `lib/sections.ts`                       |
| Résumé content                 | `content/resume.mjs`                    |
| Articles, case studies, AI Lab | Notion (falls back to `portfolio.ts`)   |
| Featured repositories          | `FEATURED_REPOS` in `lib/cms/github.ts` |

After adding an icon anywhere, run `npm run gen:icons` — icons are bundled
offline into `lib/icons-bundle.json`, so an unbundled icon renders blank.

## Résumé update process

1. Edit `content/resume.mjs`.
2. Run `npm run build:resume`.
3. Two ATS-safe PDFs land in `public/resume/`, with the HTML source in
   `resume-src/` for deterministic re-export.
4. Keep every fact in step with `portfolio.ts` — same employers, titles, dates.

The original résumé PDF is preserved untouched at
`resume-src/original/` as the factual reference.

The generated PDFs are single-column, text-selectable, table-free, image-free
and progress-bar-free by construction.

## Deployment

Vercel, on push to `main`. Add the environment variables in the Vercel project
settings (Production + Preview). No build step beyond `npm run build` is needed;
the résumé PDFs and icon bundle are committed.

## Conventions

- **Never fabricate.** Employers, titles, dates, education, certifications and
  metrics come from the résumé and nothing else. Positioning and wording are
  editorial; facts are not.
- **No percentage skill bars.** Capability is shown with evidence
  (`capabilityGraph` in `portfolio.ts`), never with invented proficiency numbers.
- **Featured means substantial.** A system is only `tier: 'featured'` if it has
  a real case study with tradeoffs and a "what I'd improve" section. Tests
  enforce this.
- Accent colours come from `lib/accent.ts` static maps — never build Tailwind
  class names by string interpolation, or the scanner will purge them.
- Animation composes from `components/motion` — don't hand-roll transitions in
  feature components. Pointer-driven effects write transforms directly to the
  node (rAF-throttled) rather than storing pointer position in React state.
- Every interactive visualisation needs a keyboard path and a text equivalent;
  see `ArchitectureVisualizer` for the pattern (roving tabindex + `sr-only`
  connection list).
- The Tailwind colour token is `canvas`, not `base`: a colour named `base`
  makes Tailwind emit `text-base` as a _colour_ utility, which silently
  overrides text colour in responsive variants like `sm:text-base`.
