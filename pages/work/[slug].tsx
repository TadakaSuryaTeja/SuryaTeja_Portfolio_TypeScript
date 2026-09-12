import type { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import PageShell from '@/components/ui/PageShell';
import ArchitectureVisualizer from '@/components/architecture/ArchitectureVisualizer';
import { FadeIn, SlideReveal, TextReveal } from '@/components/motion';
import TechChips from '@/components/knowledge/TechChips';
import { caseStudySystems, getSystem } from '@/content/systems';
import { seoData, socialLinks, profile } from '@/portfolio';
import { trackEvent } from '@/lib/analytics';
import type { System } from '@/types/systems';

/* ------------------------------- primitives ------------------------------- */

function Block({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <SlideReveal className="border-t border-line pt-10">
      <h2 className="flex items-center gap-2.5 text-xl font-semibold tracking-tight text-ink">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <Icon icon={icon} className="text-lg" aria-hidden />
        </span>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </SlideReveal>
  );
}

function Bullets({ items, icon = 'ph:caret-right-bold' }: { items: string[]; icon?: string }) {
  return (
    <ul className="space-y-2.5" role="list">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-muted">
          <Icon icon={icon} className="mt-1 shrink-0 text-xs text-accent" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Columns({ groups }: { groups: { title: string; icon: string; items?: string[] }[] }) {
  const present = groups.filter((g) => g.items?.length);
  if (!present.length) return null;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {present.map((g) => (
        <div key={g.title} className="rounded-2xl border border-line bg-fill-1 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Icon icon={g.icon} className="text-base text-accent" aria-hidden />
            {g.title}
          </h3>
          <div className="mt-3">
            <Bullets items={g.items!} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------- page ---------------------------------- */

type Props = { system: System; next: { slug: string; name: string } | null };

export default function CaseStudyPage({ system, next }: Props) {
  const cs = system.caseStudy!;
  const base = (seoData.url ?? '').replace(/\/$/, '');
  const url = `${base}/work/${system.slug}`;
  const ogImage = `${base}/api/og?title=${encodeURIComponent(system.name)}&subtitle=${encodeURIComponent(
    system.systemType
  )}&tech=${encodeURIComponent(system.tech.slice(0, 5).join(' · '))}`;
  const description = `${system.problem} ${system.summary}`.slice(0, 300);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: system.name,
    description,
    url,
    image: ogImage,
    author: { '@type': 'Person', name: profile.name, url: base },
    about: system.tech,
    articleSection: system.category,
  };

  return (
    <>
      <Head>
        <title>{`${system.name} — ${profile.name}`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${system.name} — ${system.systemType}`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${system.name} — ${system.systemType}`} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <PageShell>
        <article className="container-px pb-24 pt-28 sm:pt-36">
          <div className="mx-auto max-w-4xl">
            <FadeIn onMount>
              <Link
                href="/#work"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
              >
                <Icon icon="ph:arrow-left-bold" className="text-xs" aria-hidden />
                All systems
              </Link>
            </FadeIn>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="chip !text-accent">{system.category}</span>
              <span className="chip">{system.status}</span>
              {system.period && <span className="chip">{system.period}</span>}
            </div>

            <TextReveal
              as="h1"
              text={system.name}
              className="mt-5 block text-balance text-3xl font-semibold leading-[1.1] tracking-tightest text-ink sm:text-5xl"
            />

            <FadeIn delay={0.1} onMount>
              <p className="mt-4 text-base text-ink-muted sm:text-lg">
                {system.systemType} · {system.origin}
              </p>
              <p className="mt-6 text-lg leading-relaxed text-ink">{system.summary}</p>
            </FadeIn>

            {system.metrics && (
              <FadeIn delay={0.15} onMount>
                <dl className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {system.metrics.map((m) => (
                    <div key={m.label} className="glass rounded-2xl p-4">
                      <dt className="sr-only">{m.label}</dt>
                      <dd>
                        <span className="block text-2xl font-semibold text-success">{m.value}</span>
                        <span className="mt-1 block text-xs text-ink-muted">{m.label}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </FadeIn>
            )}

            <FadeIn delay={0.2} onMount>
              <div className="mt-8">
                <TechChips tech={system.tech} />
              </div>
            </FadeIn>

            <div className="mt-16 space-y-10">
              <Block title="Problem" icon="ph:target-bold">
                <p className="text-base leading-relaxed text-ink-muted">{system.problem}</p>
              </Block>

              <Block title="Context" icon="ph:compass-bold">
                <p className="text-base leading-relaxed text-ink-muted">{cs.context}</p>
              </Block>

              {system.architecture && (
                <Block title="Architecture" icon="ph:blueprint-bold">
                  <ArchitectureVisualizer spec={system.architecture} />
                </Block>
              )}

              <Block title="System flow" icon="ph:flow-arrow-bold">
                <ol className="space-y-3" role="list">
                  {cs.systemFlow.map((step, i) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-fill-3 text-xs font-semibold text-ink">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-ink-muted">{step}</span>
                    </li>
                  ))}
                </ol>
              </Block>

              <Block title="My contribution" icon="ph:user-focus-bold">
                <Bullets items={system.contribution} />
              </Block>

              <Block title="Technical decisions" icon="ph:git-branch-bold">
                <div className="space-y-4">
                  {cs.technicalDecisions.map((d) => (
                    <div key={d.decision} className="rounded-2xl border border-line bg-fill-1 p-5">
                      <p className="text-sm font-semibold text-ink">{d.decision}</p>
                      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{d.rationale}</p>
                    </div>
                  ))}
                </div>
              </Block>

              {(cs.aiArchitecture || cs.dataArchitecture || cs.infrastructure) && (
                <Block title="Layer by layer" icon="ph:stack-bold">
                  <Columns
                    groups={[
                      { title: 'AI architecture', icon: 'ph:sparkle-bold', items: cs.aiArchitecture },
                      { title: 'Data architecture', icon: 'ph:database-bold', items: cs.dataArchitecture },
                      { title: 'Infrastructure', icon: 'ph:gear-six-bold', items: cs.infrastructure },
                    ]}
                  />
                </Block>
              )}

              {(cs.security || cs.reliability) && (
                <Block title="Security & reliability" icon="ph:shield-check-bold">
                  <Columns
                    groups={[
                      { title: 'Security', icon: 'ph:lock-key-bold', items: cs.security },
                      { title: 'Reliability', icon: 'ph:heartbeat-bold', items: cs.reliability },
                    ]}
                  />
                </Block>
              )}

              <Block title="Challenges" icon="ph:warning-bold">
                <Bullets items={cs.challenges} />
              </Block>

              <Block title="Tradeoffs" icon="ph:scales-bold">
                <div className="space-y-4">
                  {cs.tradeoffs.map((t) => (
                    <div key={t.chose} className="rounded-2xl border border-line bg-fill-1 p-5">
                      <p className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-semibold text-success">{t.chose}</span>
                        <span className="text-ink-faint">over</span>
                        <span className="font-medium text-ink-muted">{t.over}</span>
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t.because}</p>
                    </div>
                  ))}
                </div>
              </Block>

              <Block title="Outcome" icon="ph:check-circle-bold">
                <Bullets items={cs.outcome} icon="ph:check-bold" />
              </Block>

              <Block title="What I'd improve" icon="ph:arrow-counter-clockwise-bold">
                <p className="mb-4 text-sm text-ink-faint">
                  Nothing ships finished. These are the changes I&rsquo;d make with another pass.
                </p>
                <Bullets items={cs.improvements} icon="ph:arrow-up-right-bold" />
              </Block>
            </div>

            <div className="mt-16 border-t border-line pt-10">
              <div className="flex flex-wrap items-center gap-3">
                {system.github && (
                  <a
                    className="btn-ghost"
                    href={system.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    onClick={() => trackEvent('github_click', system.slug)}
                  >
                    <Icon icon="ph:github-logo-bold" aria-hidden /> Repository
                  </a>
                )}
                {system.demo && (
                  <a className="btn-ghost" href={system.demo} target="_blank" rel="noreferrer noopener">
                    <Icon icon="ph:arrow-square-out-bold" aria-hidden /> Live demo
                  </a>
                )}
                <a
                  className="btn-primary"
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={() => trackEvent('linkedin_click', 'case-study')}
                >
                  <Icon icon="ph:chat-circle-bold" aria-hidden /> Discuss this system
                </a>
              </div>

              {next && (
                <Link
                  href={`/work/${next.slug}`}
                  className="glass glass-hover group mt-8 flex items-center justify-between gap-4 rounded-3xl p-5"
                >
                  <span>
                    <span className="block text-xs font-medium uppercase tracking-wide text-ink-faint">
                      Next system
                    </span>
                    <span className="mt-1 block text-base font-semibold text-ink">{next.name}</span>
                  </span>
                  <Icon
                    icon="ph:arrow-right-bold"
                    className="shrink-0 text-ink-muted transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                </Link>
              )}
            </div>
          </div>
        </article>
      </PageShell>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: caseStudySystems.map((s) => ({ params: { slug: s.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const system = getSystem(params?.slug as string);
  if (!system?.caseStudy) return { notFound: true };

  const ordered = caseStudySystems;
  const idx = ordered.findIndex((s) => s.slug === system.slug);
  const nextSystem = ordered[(idx + 1) % ordered.length];

  return {
    props: {
      system,
      next:
        nextSystem && nextSystem.slug !== system.slug
          ? { slug: nextSystem.slug, name: nextSystem.name }
          : null,
    },
  };
};
