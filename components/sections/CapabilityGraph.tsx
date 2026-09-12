import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import { accentMap } from '@/lib/accent';
import { capabilityGraph } from '@/portfolio';

/**
 * Capability map — deliberately percentage-free. Selecting a node reveals the
 * evidence behind the claim instead of an invented proficiency number.
 */
export default function CapabilityGraph() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="glass rounded-4xl p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-ink">Capability map</h3>
          <p className="mt-1 text-sm text-ink-muted">
            No progress bars — select any capability to see the work behind it.
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {capabilityGraph.map((domain) => {
          const accent = accentMap[domain.accent];
          return (
            <div
              key={domain.domain}
              className="rounded-3xl border border-line bg-fill-1 p-5"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent.bgSoft} ${accent.text}`}
                >
                  <Icon icon={domain.icon} className="text-lg" aria-hidden />
                </span>
                <h4 className="text-sm font-semibold text-ink">{domain.domain}</h4>
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-ink-muted">
                {domain.blurb}
              </p>

              <ul className="mt-4 space-y-2" role="list">
                {domain.nodes.map((node) => {
                  const key = `${domain.domain}:${node.name}`;
                  const isOpen = active === key;
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        onClick={() => setActive(isOpen ? null : key)}
                        aria-expanded={isOpen}
                        className={`flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs font-medium transition-colors ${
                          isOpen
                            ? `border-hair-strong bg-fill-3 text-ink`
                            : 'border-line bg-fill-2 text-ink-muted hover:border-hair-strong hover:text-ink'
                        }`}
                      >
                        <Icon icon={node.icon} className="text-base" aria-hidden />
                        <span className="flex-1">{node.name}</span>
                        <Icon
                          icon="ph:caret-down-bold"
                          className={`text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          aria-hidden
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: 'easeOut' }}
                            className="overflow-hidden px-2.5 text-xs leading-relaxed text-ink-muted"
                          >
                            <span className="block pt-2">{node.evidence}</span>
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
