import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import { TechnologyPanel } from '@/components/knowledge/TechChips';
import { accentMap } from '@/lib/accent';
import { DOMAIN_META, technologies } from '@/content/taxonomy';
import type { TechnologyDomain } from '@/types/systems';

const DOMAIN_ORDER: TechnologyDomain[] = ['ai', 'backend', 'data', 'cloud', 'infra'];

/**
 * Engineering systems map — the percentage-free replacement for skill bars.
 *
 * Capability is claimed by showing where it was used, not by asserting a
 * number. Selecting any node opens the knowledge-graph panel: what it is,
 * which systems it appears in, which employers it shipped at, and what sits
 * next to it.
 */
export default function CapabilityGraph() {
  const [selected, setSelected] = useState<string | null>(null);
  const reduce = useReducedMotion();

  return (
    <div className="glass rounded-4xl p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-ink">Engineering systems map</h3>
          <p className="mt-1 text-sm text-ink-muted">
            No progress bars. Select any capability to see the systems it was built into.
          </p>
        </div>
        {selected && (
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="text-xs font-medium text-ink-muted transition-colors hover:text-ink"
          >
            Clear selection
          </button>
        )}
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {DOMAIN_ORDER.map((domain) => {
          const meta = DOMAIN_META[domain];
          const accent = accentMap[meta.accent];
          const nodes = technologies.filter((t) => t.domain === domain);

          return (
            <section
              key={domain}
              aria-label={meta.label}
              className="rounded-3xl border border-line bg-fill-1 p-5"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent.bgSoft} ${accent.text}`}
                >
                  <Icon icon={meta.icon} className="text-lg" aria-hidden />
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-ink">{meta.label}</h4>
                  <p className="text-[0.68rem] text-ink-faint">{nodes.length} capabilities</p>
                </div>
              </div>

              <p className="mt-2.5 text-xs leading-relaxed text-ink-muted">{meta.blurb}</p>

              <ul className="mt-4 flex flex-wrap gap-1.5" role="list">
                {nodes.map((node) => {
                  const isSelected = selected === node.id;
                  return (
                    <li key={node.id}>
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setSelected(isSelected ? null : node.id)}
                        className={`relative inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
                          isSelected
                            ? `${accent.border} ${accent.bgSoft} ${accent.text}`
                            : 'border-line bg-fill-2 text-ink-muted hover:-translate-y-0.5 hover:border-hair-strong hover:text-ink'
                        }`}
                      >
                        <Icon icon={node.icon} className="text-sm" aria-hidden />
                        {node.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      <AnimatePresence initial={false} mode="wait">
        {selected && (
          <motion.div
            key={selected}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >
            <TechnologyPanel id={selected} onNavigate={setSelected} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
