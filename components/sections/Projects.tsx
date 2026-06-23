import { forwardRef, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import { projects } from '@/portfolio';
import type { ProjectType } from '@/types/sections';

function codeLink(p: ProjectType) {
  if (p.github?.includes('kaggle'))
    return { href: p.github, label: 'Kaggle', icon: 'simple-icons:kaggle' };
  return p.github
    ? { href: p.github, label: 'Code', icon: 'ph:github-logo-bold' }
    : null;
}

const ProjectCard = forwardRef<HTMLElement, { p: ProjectType }>(({ p }, ref) => {
  const code = codeLink(p);
  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-fill-2 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-hair-strong hover:bg-fill-3 hover:shadow-glass"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />

      <div className="flex items-center justify-between">
        <span className="chip !text-accent">{p.category}</span>
        {p.featured && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-violet">
            <Icon icon="ph:star-fill" aria-hidden /> Featured
          </span>
        )}
      </div>

      <h3 className="mt-4 text-lg font-semibold text-ink">{p.name}</h3>
      <p className="mt-2 flex items-start gap-1.5 text-sm text-ink-faint">
        <Icon icon="ph:target-bold" className="mt-0.5 shrink-0" aria-hidden />
        <span>{p.problem}</span>
      </p>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{p.desc}</p>

      {p.highlights && (
        <ul className="mt-4 space-y-1.5">
          {p.highlights.map((h) => (
            <li key={h} className="flex items-center gap-2 text-xs text-ink-muted">
              <span className="h-1 w-1 rounded-full bg-accent" />
              {h}
            </li>
          ))}
        </ul>
      )}

      {p.impact && (
        <p className="mt-4 rounded-xl border border-line bg-fill-1 px-3 py-2 text-xs text-ink-muted">
          <span className="font-semibold text-success">Impact · </span>
          {p.impact}
        </p>
      )}

      <div className="mt-auto pt-5">
        <div className="mb-4 flex flex-wrap gap-1.5">
          {p.tech.map((t) => (
            <span
              key={t}
              className="rounded-md border border-line bg-fill-1 px-2 py-0.5 text-[11px] text-ink-muted"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 border-t border-line pt-4">
          {code && (
            <a
              href={code.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-accent"
            >
              <Icon icon={code.icon} aria-hidden /> {code.label}
            </a>
          )}
          {p.link && (
            <a
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-accent"
            >
              <Icon icon="ph:arrow-square-out-bold" aria-hidden /> Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
});
ProjectCard.displayName = 'ProjectCard';

export default function Projects() {
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(projects.map((p) => p.category)))],
    []
  );
  const [filter, setFilter] = useState('All');
  const filtered =
    filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  return (
    <Section id="projects">
      <SectionHeading
        eyebrow="Projects"
        title="Things I've designed & shipped"
        subtitle="From cloud infrastructure and backend services to AI/ML — each project below links to real code."
      />

      <Reveal className="mt-10 flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
              filter === c
                ? 'border-accent/40 bg-accent/10 text-ink'
                : 'border-line bg-fill-1 text-ink-muted hover:border-hair-strong hover:text-ink'
            }`}
          >
            {c}
          </button>
        ))}
      </Reveal>

      <motion.div
        layout
        className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <ProjectCard key={p.name} p={p} />
          ))}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}
