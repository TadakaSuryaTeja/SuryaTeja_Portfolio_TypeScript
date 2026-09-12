import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import ArchitectureVisualizer from '@/components/architecture/ArchitectureVisualizer';
import { FadeIn } from '@/components/motion';
import { systems } from '@/content/systems';
import { trackEvent } from '@/lib/analytics';

const withArchitecture = systems.filter((s) => s.architecture);

/**
 * "How I build" — the architecture thinking, on the homepage rather than
 * buried a click away. Switching systems swaps the diagram in place, so a
 * technical visitor can compare shapes without leaving the page.
 */
export default function ArchitectureSection() {
  const [slug, setSlug] = useState(withArchitecture[0]?.slug ?? '');
  const active = withArchitecture.find((s) => s.slug === slug) ?? withArchitecture[0];

  if (!active?.architecture) return null;

  return (
    <Section id="architecture">
      <SectionHeading
        eyebrow="How I build"
        title="Architecture, not just integration"
        subtitle="The same systems, drawn. Select any component to see what it does and why it earns its place — these are the diagrams I'd draw on a whiteboard in an interview."
      />

      <div className="mt-12">
        <div
          className="flex flex-wrap justify-center gap-2"
          role="tablist"
          aria-label="System architectures"
        >
          {withArchitecture.map((s) => {
            const selected = s.slug === active.slug;
            return (
              <button
                key={s.slug}
                role="tab"
                aria-selected={selected}
                onClick={() => setSlug(s.slug)}
                className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                  selected
                    ? 'border-accent/40 bg-accent/10 text-accent'
                    : 'border-line bg-fill-2 text-ink-muted hover:border-hair-strong hover:text-ink'
                }`}
              >
                {s.name}
              </button>
            );
          })}
        </div>

        <FadeIn key={active.slug} className="mt-8">
          <ArchitectureVisualizer spec={active.architecture} />

          {/* Deep-dive readers get the decision log inline. */}
          {active.caseStudy && (
            <div data-deep-only className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-line bg-fill-1 p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <Icon icon="ph:git-branch-bold" className="text-base text-accent" aria-hidden />
                  Key decisions
                </h3>
                <ul className="mt-3 space-y-3" role="list">
                  {active.caseStudy.technicalDecisions.slice(0, 3).map((d) => (
                    <li key={d.decision}>
                      <p className="text-xs font-semibold text-ink">{d.decision}</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-muted">{d.rationale}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-line bg-fill-1 p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <Icon icon="ph:scales-bold" className="text-base text-accent" aria-hidden />
                  Tradeoffs
                </h3>
                <ul className="mt-3 space-y-3" role="list">
                  {active.caseStudy.tradeoffs.map((t) => (
                    <li key={t.chose}>
                      <p className="text-xs">
                        <span className="font-semibold text-success">{t.chose}</span>
                        <span className="text-ink-faint"> over </span>
                        <span className="text-ink-muted">{t.over}</span>
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-ink-muted">{t.because}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {active.caseStudy && (
            <div className="mt-6 flex justify-center">
              <Link
                href={`/work/${active.slug}`}
                onClick={() => trackEvent('case_study_open', active.slug)}
                className="btn-ghost group"
              >
                Read the full case study
                <Icon
                  icon="ph:arrow-right-bold"
                  className="transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </div>
          )}
        </FadeIn>
      </div>
    </Section>
  );
}
