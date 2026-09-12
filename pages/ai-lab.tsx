import Head from 'next/head';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import PageShell from '@/components/ui/PageShell';
import PageHeader from '@/components/ui/PageHeader';
import TechChips from '@/components/knowledge/TechChips';
import Reveal from '@/components/ui/Reveal';
import { labSystems, featuredSystems } from '@/content/systems';
import { seoData, profile } from '@/portfolio';
import type { System } from '@/types/systems';

const STATUS_STYLE: Record<System['status'], string> = {
  'In production': 'border-success/30 bg-success/10 text-success',
  Shipped: 'border-accent/30 bg-accent/10 text-accent',
  Prototype: 'border-violet/30 bg-violet/10 text-violet',
  Exploring: 'border-line bg-fill-2 text-ink-muted',
  Archived: 'border-line bg-fill-2 text-ink-faint',
};

/**
 * AI Lab — the components production AI is made of, with honest statuses.
 * "Exploring" is never dressed up as shipped.
 */
export default function AILabPage() {
  const base = (seoData.url ?? '').replace(/\/$/, '');
  const description =
    'Agent loops, MCP tool servers, retrieval pipelines, model routing and evaluation — the building blocks behind production AI systems.';

  return (
    <>
      <Head>
        <title>{`AI Lab — ${profile.name}`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${base}/ai-lab`} />
        <meta property="og:title" content={`AI Lab — ${profile.name}`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${base}/ai-lab`} />
        <meta
          property="og:image"
          content={`${base}/api/og?title=${encodeURIComponent('AI Systems Lab')}&subtitle=${encodeURIComponent('Agents · MCP · RAG · Evaluation')}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <PageShell>
        <PageHeader
          eyebrow="AI Lab"
          title="The pieces production AI is actually made of"
          subtitle="Agent loops, tool protocols, retrieval and guardrails — each one a component I have built, shipped, or am actively deepening. Status labels here are literal."
        />

        <section className="container-px py-16 sm:py-20">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {labSystems.map((entry, i) => (
              <Reveal key={entry.slug} delay={i * 0.05} className="h-full">
                <article className="glass flex h-full flex-col rounded-3xl p-6">
                  <div className="flex items-start justify-between gap-3">
                    <span className="chip !text-accent">{entry.category}</span>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide ${STATUS_STYLE[entry.status]}`}
                    >
                      {entry.status}
                    </span>
                  </div>
                  <h2 className="mt-4 text-base font-semibold text-ink">{entry.name}</h2>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wide text-ink-faint">
                    {entry.systemType} · {entry.origin}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                    {entry.summary}
                  </p>
                  <div className="mt-5">
                    <TechChips tech={entry.tech} />
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mx-auto mt-14 max-w-3xl rounded-3xl border border-line bg-fill-1 p-6 text-center sm:p-8">
            <h2 className="text-lg font-semibold text-ink">
              These components ship inside real systems
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
              The lab is not a side project. Every component above exists because a
              production system needed it — the full architecture write-ups show where.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {featuredSystems
                .filter((s) => s.caseStudy)
                .slice(0, 2)
                .map((s) => (
                  <Link key={s.slug} href={`/work/${s.slug}`} className="btn-ghost group !text-xs">
                    {s.name}
                    <Icon
                      icon="ph:arrow-right-bold"
                      className="transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </PageShell>
    </>
  );
}
