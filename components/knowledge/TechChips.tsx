import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import { matchTechnology, getTechnology, DOMAIN_META } from '@/content/taxonomy';
import { getSystem } from '@/content/systems';
import { accentMap } from '@/lib/accent';

/**
 * Technology chips wired into the knowledge graph.
 *
 * A chip that maps to a taxonomy entry becomes a button: selecting it explains
 * the technology, lists the systems and roles it appears in, and offers
 * adjacent technologies to keep exploring. Chips with no taxonomy entry still
 * render — they are just static text rather than a dead-end link.
 */
export default function TechChips({
  tech,
  className = '',
}: {
  tech: string[];
  className?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const open = openId ? getTechnology(openId) : null;

  return (
    <div className={className}>
      <ul className="flex flex-wrap gap-1.5" role="list">
        {tech.map((label) => {
          const match = matchTechnology(label);
          if (!match) {
            return (
              <li
                key={label}
                className="rounded-lg border border-line bg-fill-1 px-2.5 py-1 text-xs text-ink-muted"
              >
                {label}
              </li>
            );
          }
          const selected = openId === match.id;
          return (
            <li key={label}>
              <button
                type="button"
                aria-expanded={selected}
                onClick={() => setOpenId(selected ? null : match.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                  selected
                    ? 'border-accent/40 bg-accent/10 text-accent'
                    : 'border-line bg-fill-2 text-ink-muted hover:border-hair-strong hover:text-ink'
                }`}
              >
                <Icon icon={match.icon} className="text-sm" aria-hidden />
                {label}
              </button>
            </li>
          );
        })}
      </ul>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key={open.id}
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="overflow-hidden"
          >
            <TechnologyPanel id={open.id} onNavigate={setOpenId} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TechnologyPanel({
  id,
  onNavigate,
}: {
  id: string;
  onNavigate?: (id: string) => void;
}) {
  const tech = getTechnology(id);
  if (!tech) return null;
  const meta = DOMAIN_META[tech.domain];
  const accent = accentMap[meta.accent];

  const linkedSystems = tech.systems
    .map((slug) => getSystem(slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <div className="mt-3 rounded-2xl border border-line bg-fill-1 p-5">
      <div className="flex items-center gap-2.5">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${accent.bgSoft} ${accent.text}`}
        >
          <Icon icon={tech.icon} className="text-base" aria-hidden />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">{tech.label}</p>
          <p className="text-[0.68rem] font-medium uppercase tracking-wide text-ink-faint">
            {meta.label}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{tech.blurb}</p>

      {linkedSystems.length > 0 && (
        <div className="mt-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-ink-faint">
            Used in
          </p>
          <ul className="mt-2 space-y-1.5" role="list">
            {linkedSystems.map((s) =>
              s.caseStudy ? (
                <li key={s.slug}>
                  <Link
                    href={`/work/${s.slug}`}
                    className="group inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                  >
                    {s.name}
                    <Icon
                      icon="ph:arrow-right-bold"
                      className="text-xs transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </Link>
                </li>
              ) : (
                <li key={s.slug} className="text-sm text-ink-muted">
                  {s.name}
                </li>
              )
            )}
          </ul>
        </div>
      )}

      {tech.experience.length > 0 && (
        <div className="mt-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-ink-faint">
            Shipped at
          </p>
          <p className="mt-1.5 text-sm text-ink-muted">{tech.experience.join(' · ')}</p>
        </div>
      )}

      {tech.related.length > 0 && onNavigate && (
        <div className="mt-4 border-t border-line pt-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-wide text-ink-faint">
            Related
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5" role="list">
            {tech.related.map((rel) => {
              const r = getTechnology(rel);
              if (!r) return null;
              return (
                <li key={rel}>
                  <button
                    type="button"
                    onClick={() => onNavigate(rel)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-fill-2 px-2.5 py-1 text-xs font-medium text-ink-muted transition-colors hover:border-hair-strong hover:text-ink"
                  >
                    <Icon icon={r.icon} className="text-sm" aria-hidden />
                    {r.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
