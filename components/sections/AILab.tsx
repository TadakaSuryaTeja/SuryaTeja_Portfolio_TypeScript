import { Icon } from '@/components/ui/Icon';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import { accentMap } from '@/lib/accent';
import { aiLab } from '@/portfolio';
import type { AILabEntryType } from '@/types/sections';

const STATUS_STYLE: Record<AILabEntryType['status'], string> = {
  'In production': 'border-success/30 bg-success/10 text-success',
  Shipped: 'border-accent/30 bg-accent/10 text-accent',
  Prototype: 'border-violet/30 bg-violet/10 text-violet',
  Exploring: 'border-line bg-fill-2 text-ink-muted',
};

/**
 * AI Systems Lab — the concrete agentic/RAG building blocks behind the
 * platform work. Status labels are honest: "Exploring" is never dressed up
 * as shipped.
 */
export default function AILab() {
  return (
    <Section id="ai-lab">
      <SectionHeading
        eyebrow="AI Systems Lab"
        title="The pieces production AI is actually made of"
        subtitle="Agent loops, tool protocols, retrieval and guardrails — each one a component I have built, shipped or am actively deepening."
      />

      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {aiLab.map((entry, i) => {
          const accent = accentMap[entry.accent];
          return (
            <Reveal key={entry.title} delay={i * 0.06}>
              <article className="glass glass-hover flex h-full flex-col rounded-3xl p-6">
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent.bgSoft} ${accent.text}`}
                  >
                    <Icon icon={entry.icon} className="text-xl" aria-hidden />
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide ${STATUS_STYLE[entry.status]}`}
                  >
                    {entry.status}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-semibold text-ink">{entry.title}</h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-muted">
                  {entry.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {entry.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-lg border border-line bg-fill-2 px-2 py-1 text-[0.7rem] font-medium text-ink-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {(entry.github || entry.demo) && (
                  <div className="mt-4 flex gap-3 text-xs font-medium">
                    {entry.github && (
                      <a
                        className="text-accent hover:underline"
                        href={entry.github}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        Repository
                      </a>
                    )}
                    {entry.demo && (
                      <a
                        className="text-accent hover:underline"
                        href={entry.demo}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        Demo
                      </a>
                    )}
                  </div>
                )}
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
