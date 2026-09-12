import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import SystemCard from '@/components/projects/SystemCard';
import Reveal from '@/components/ui/Reveal';
import { systems } from '@/content/systems';
import type { SystemTier } from '@/types/systems';

const TIERS: { id: SystemTier; label: string; blurb: string }[] = [
  {
    id: 'featured',
    label: 'Featured systems',
    blurb: 'Production systems I designed and led, end-to-end.',
  },
  {
    id: 'lab',
    label: 'AI Lab',
    blurb: 'Components and experiments around agents, retrieval and evaluation.',
  },
  {
    id: 'archive',
    label: 'Archive',
    blurb:
      'Earlier public work — kept for provenance, not as a description of what I do now.',
  },
];

/**
 * "Systems I've Built" — tiered so recent, substantial work dominates and
 * older work stays reachable without defining the professional identity.
 */
export default function Systems() {
  const [tier, setTier] = useState<SystemTier>('featured');
  const reduce = useReducedMotion();

  const byTier = useMemo(
    () => ({
      featured: systems.filter((s) => s.tier === 'featured'),
      lab: systems.filter((s) => s.tier === 'lab'),
      archive: systems.filter((s) => s.tier === 'archive'),
    }),
    []
  );

  const active = TIERS.find((t) => t.id === tier)!;
  const shown = byTier[tier];

  return (
    <Section id="work" essential>
      <SectionHeading
        eyebrow="Systems I've Built"
        title="Production systems, not demos"
        subtitle="Each one starts from a real engineering problem. The flagship systems have full architecture write-ups — decisions, tradeoffs and what I'd do differently."
      />

      {/* Tier switcher */}
      <div className="mt-12 flex justify-center">
        <div
          className="inline-flex flex-wrap justify-center gap-1 rounded-2xl border border-line bg-fill-1 p-1"
          role="tablist"
          aria-label="System tiers"
        >
          {TIERS.map((t) => {
            const selected = t.id === tier;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={selected}
                aria-controls={`systems-${t.id}`}
                id={`systems-tab-${t.id}`}
                onClick={() => setTier(t.id)}
                className={`relative rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                  selected ? 'text-ink' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {selected && (
                  <motion.span
                    layoutId="tier-pill"
                    className="absolute inset-0 -z-10 rounded-xl bg-fill-3"
                    transition={
                      reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }
                    }
                  />
                )}
                {t.label}
                <span className="ml-1.5 text-xs text-ink-faint">{byTier[t.id].length}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-ink-muted">{active.blurb}</p>

      <div
        id={`systems-${tier}`}
        role="tabpanel"
        aria-labelledby={`systems-tab-${tier}`}
        className="mt-10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={tier}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            {/* Reveal is IntersectionObserver + CSS: no animation runtime
                hydrates per card, which keeps a long grid cheap. */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {shown.map((system, i) => (
                <Reveal key={system.slug} delay={i * 0.05} className="h-full">
                  <SystemCard system={system} />
                </Reveal>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
}
