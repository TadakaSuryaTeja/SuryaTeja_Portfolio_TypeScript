import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { TiltCard } from '@/components/motion';
import { trackEvent } from '@/lib/analytics';
import type { System } from '@/types/systems';

const STATUS_STYLE: Record<System['status'], string> = {
  'In production': 'border-success/30 bg-success/10 text-success',
  Shipped: 'border-accent/30 bg-accent/10 text-accent',
  Prototype: 'border-violet/30 bg-violet/10 text-violet',
  Exploring: 'border-line bg-fill-2 text-ink-muted',
  Archived: 'border-line bg-fill-2 text-ink-faint',
};

/** A compact wiring sketch derived from the system's own architecture spec. */
function ArchitecturePreview({ system }: { system: System }) {
  const spec = system.architecture;
  if (!spec) return null;

  const rows = [...new Set(spec.nodes.map((n) => n.row))].sort((a, b) => a - b);
  const counts = rows.map((r) => spec.nodes.filter((n) => n.row === r).length);

  return (
    <div
      className="mt-5 rounded-2xl border border-line bg-fill-1 p-3"
      aria-label={`Architecture outline: ${rows.length} layers`}
    >
      <div className="flex flex-col gap-1.5">
        {counts.map((count, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {Array.from({ length: count }).map((_, j) => (
              <span
                key={j}
                className="h-1.5 flex-1 rounded-full bg-gradient-to-r from-accent/50 to-violet/40"
                style={{ opacity: 1 - i * 0.11 }}
              />
            ))}
          </div>
        ))}
      </div>
      <p className="mt-2.5 text-[0.68rem] font-medium uppercase tracking-wide text-ink-faint">
        {rows.length} layers · {spec.nodes.length} components
      </p>
    </div>
  );
}

export default function SystemCard({ system }: { system: System }) {
  const hasCaseStudy = Boolean(system.caseStudy);

  return (
    <TiltCard className="h-full">
      <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-fill-2 p-6 transition-colors duration-300 hover:border-hair-strong hover:bg-fill-3">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-accent/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="chip !text-accent">{system.category}</span>
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${STATUS_STYLE[system.status]}`}
          >
            {system.status}
          </span>
        </div>

        <h3 className="mt-4 text-lg font-semibold leading-snug text-ink">{system.name}</h3>

        <p className="mt-1.5 text-xs font-medium uppercase tracking-wide text-ink-faint">
          {system.systemType} · {system.origin}
        </p>

        <p className="mt-4 flex items-start gap-1.5 text-sm leading-relaxed text-ink-muted">
          <Icon icon="ph:target-bold" className="mt-0.5 shrink-0 text-accent" aria-hidden />
          <span>{system.problem}</span>
        </p>

        <ArchitecturePreview system={system} />

        {system.metrics && (
          <dl className="mt-4 grid grid-cols-2 gap-2">
            {system.metrics.slice(0, 4).map((m) => (
              <div key={m.label} className="rounded-xl border border-line bg-fill-1 px-2.5 py-2">
                <dt className="sr-only">{m.label}</dt>
                <dd>
                  <span className="block text-sm font-semibold text-success">{m.value}</span>
                  <span className="mt-0.5 block text-[0.68rem] leading-tight text-ink-faint">
                    {m.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-auto pt-5">
          <div className="mb-4 flex flex-wrap gap-1.5">
            {system.tech.slice(0, 6).map((t) => (
              <span
                key={t}
                className="rounded-md border border-line bg-fill-1 px-2 py-0.5 text-[11px] text-ink-muted"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4">
            {hasCaseStudy && (
              <Link
                href={`/work/${system.slug}`}
                onClick={() => trackEvent('case_study_open', system.slug)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-ink"
              >
                Explore architecture
                <Icon
                  icon="ph:arrow-right-bold"
                  className="transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            )}
            {system.github && (
              <a
                href={system.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('github_click', system.slug)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-accent"
              >
                <Icon icon="ph:github-logo-bold" aria-hidden /> GitHub
              </a>
            )}
            {system.demo && (
              <a
                href={system.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-accent"
              >
                <Icon icon="ph:arrow-square-out-bold" aria-hidden /> Live demo
              </a>
            )}
            {!hasCaseStudy && !system.github && !system.demo && (
              <span className="text-xs text-ink-faint">
                Built under enterprise NDA — architecture described, code not public.
              </span>
            )}
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
