import { Fragment, ReactNode, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import { accentMap } from '@/lib/accent';
import { caseStudies } from '@/portfolio';
import type { ArchitectureType } from '@/types/sections';

function Block({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
        <Icon icon={icon} className="text-ink-muted" aria-hidden />
        {title}
      </div>
      {children}
    </div>
  );
}

function List({ items, dotClass }: { items: string[]; dotClass: string }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink-muted">
          <span
            className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`}
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

function ArchitectureDiagram({ arch }: { arch: ArchitectureType }) {
  return (
    <div className="mt-8 rounded-2xl border border-line bg-fill-1 p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-faint">
        <Icon icon="ph:blueprint-bold" aria-hidden /> Representative architecture
      </div>
      <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
        {arch.layers.map((layer, i) => (
          <Fragment key={layer.title}>
            <div className="flex-1 rounded-xl border border-line bg-fill-2 p-3">
              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                {layer.title}
              </p>
              <div className="space-y-1.5">
                {layer.nodes.map((n) => (
                  <div
                    key={n.label}
                    className="flex items-center gap-2 rounded-lg bg-fill-2 px-2.5 py-1.5 text-xs font-medium text-ink"
                  >
                    <Icon icon={n.icon} className="shrink-0 text-base" aria-hidden />
                    {n.label}
                  </div>
                ))}
              </div>
            </div>
            {i < arch.layers.length - 1 && (
              <div
                className="flex items-center justify-center text-ink-faint"
                aria-hidden
              >
                <Icon icon="ph:caret-down-bold" className="lg:hidden" />
                <Icon icon="ph:caret-right-bold" className="hidden lg:block" />
              </div>
            )}
          </Fragment>
        ))}
      </div>
      <p className="mt-4 text-xs text-ink-muted">{arch.caption}</p>
    </div>
  );
}

export default function CaseStudies() {
  const [active, setActive] = useState(caseStudies[0].id);
  const cs = caseStudies.find((c) => c.id === active) ?? caseStudies[0];
  const accent = accentMap[cs.accent];

  return (
    <Section id="case-studies">
      <SectionHeading
        eyebrow="Case Studies"
        title="Deep dives into systems I've built"
        subtitle="The problem, the design, the hard parts, and the measurable outcome — from real engagements."
      />

      <Reveal className="mt-10 flex flex-wrap justify-center gap-2">
        {caseStudies.map((c) => {
          const a = accentMap[c.accent];
          const on = c.id === active;
          return (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              aria-pressed={on}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                on
                  ? `${a.border} ${a.bgSoft} text-ink`
                  : 'border-line bg-fill-1 text-ink-muted hover:border-hair-strong hover:text-ink'
              }`}
            >
              {c.company}
            </button>
          );
        })}
      </Reveal>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.article
            key={cs.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="glass rounded-4xl p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className={`chip ${accent.text}`}>{cs.company}</span>
                <h3 className="mt-3 max-w-2xl text-xl font-semibold leading-snug text-ink sm:text-2xl">
                  {cs.title}
                </h3>
              </div>
              <span className="chip whitespace-nowrap">{cs.period}</span>
            </div>

            {cs.metrics && (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {cs.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-2xl border border-line bg-fill-2 p-4"
                  >
                    <p className={`text-2xl font-bold ${accent.text}`}>
                      {m.value}
                    </p>
                    <p className="mt-1 text-xs text-ink-muted">{m.label}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-7 grid gap-7 lg:grid-cols-2">
              <div className="space-y-6">
                <Block icon="ph:target-bold" title="Problem">
                  <p className="text-sm leading-relaxed text-ink-muted">
                    {cs.problem}
                  </p>
                </Block>
                <Block icon="ph:blueprint-bold" title="Approach">
                  <List items={cs.approach} dotClass={accent.bg} />
                </Block>
              </div>
              <div className="space-y-6">
                <Block icon="ph:warning-bold" title="Challenges">
                  <List items={cs.challenges} dotClass={accent.bg} />
                </Block>
                <Block icon="ph:check-circle-bold" title="Results">
                  <List items={cs.results} dotClass="bg-success" />
                </Block>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-2 border-t border-line pt-6">
              {cs.stack.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>

            <ArchitectureDiagram arch={cs.architecture} />
          </motion.article>
        </AnimatePresence>
      </div>
    </Section>
  );
}
