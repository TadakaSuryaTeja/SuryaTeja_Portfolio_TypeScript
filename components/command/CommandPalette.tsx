import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import { socialLinks, resumes, experience } from '@/portfolio';
import { NAV_SECTIONS, NAV_ROUTES } from '@/lib/sections';
import { systems } from '@/content/systems';
import { technologies } from '@/content/taxonomy';
import { setMode } from '@/lib/modes';
import { trackEvent } from '@/lib/analytics';

type Command = {
  id: string;
  label: string;
  hint: string;
  icon: string;
  keywords?: string;
  run: () => void;
};


export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  /** Scroll to a section on the homepage, routing there first if needed. */
  const go = useCallback(
    (id: string) => {
      if (router.pathname === '/') {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        router.push(`/#${id}`);
      }
    },
    [router]
  );

  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = NAV_SECTIONS.map((s) => ({
      id: `go-${s.id}`,
      label: `Go to ${s.label}`,
      hint: 'Section',
      icon: s.icon ?? 'ph:arrow-right-bold',
      keywords: s.label,
      run: () => go(s.id),
    }));

    const routes: Command[] = NAV_ROUTES.map((r) => ({
      id: `route-${r.href}`,
      label: `Open ${r.label}`,
      hint: 'Page',
      icon: r.icon,
      keywords: r.label,
      run: () => router.push(r.href),
    }));

    const modes: Command[] = [
      {
        id: 'mode-recruiter',
        label: 'Recruiter mode',
        hint: 'Mode',
        icon: 'ph:identification-badge-bold',
        keywords: 'recruiter hiring summary quick overview 60 seconds',
        run: () => setMode('recruiter'),
      },
      {
        id: 'mode-deep',
        label: 'Engineering deep dive',
        hint: 'Mode',
        icon: 'ph:blueprint-bold',
        keywords: 'engineer architecture tradeoffs decisions technical depth',
        run: () => setMode('deep'),
      },
      {
        id: 'mode-default',
        label: 'Full portfolio',
        hint: 'Mode',
        icon: 'ph:squares-four-bold',
        keywords: 'default reset everything normal',
        run: () => setMode('default'),
      },
    ];

    /* Search index — systems, technologies and roles are all reachable. */
    const systemCommands: Command[] = systems.map((sys) => ({
      id: `system-${sys.slug}`,
      label: sys.name,
      hint: sys.caseStudy ? 'Case study' : sys.category,
      icon: 'ph:cube-bold',
      keywords: `${sys.category} ${sys.systemType} ${sys.tech.join(' ')} ${sys.problem} ${sys.origin}`,
      run: () => {
        if (sys.caseStudy) {
          trackEvent('case_study_open', sys.slug);
          router.push(`/work/${sys.slug}`);
        } else if (sys.github) {
          window.open(sys.github, '_blank', 'noopener');
        } else {
          go('work');
        }
      },
    }));

    const techCommands: Command[] = technologies.map((t) => ({
      id: `tech-${t.id}`,
      label: t.label,
      hint: 'Technology',
      icon: t.icon,
      keywords: `${t.domain} ${t.blurb} ${t.related.join(' ')}`,
      run: () => {
        trackEvent('technology_explore', t.id);
        go('skills');
      },
    }));

    const roleCommands: Command[] = experience.map((e) => ({
      id: `role-${e.company}`,
      label: `${e.role} — ${e.company}`,
      hint: 'Experience',
      icon: 'ph:briefcase-bold',
      keywords: `${e.date} ${e.tech.join(' ')}`,
      run: () => go('experience'),
    }));

    const actions: Command[] = [
      {
        id: 'theme',
        label: 'Toggle light / dark theme',
        hint: 'Action',
        icon: 'ph:circle-half-bold',
        keywords: 'theme dark light mode appearance',
        run: () => window.dispatchEvent(new CustomEvent('theme:toggle')),
      },
    ];

    resumes.forEach((r) =>
      actions.push({
        id: `resume-${r.href}`,
        label: `Download ${r.label}`,
        hint: 'Action',
        icon: 'ph:download-simple-bold',
        keywords: 'cv resume pdf download ats',
        run: () => {
          trackEvent('resume_download', r.label);
          window.open(r.href, '_blank', 'noopener');
        },
      })
    );

    if (socialLinks.email)
      actions.push({
        id: 'email',
        label: 'Copy email address',
        hint: 'Action',
        icon: 'ph:copy-bold',
        keywords: 'contact mail',
        run: () => navigator.clipboard?.writeText(socialLinks.email as string),
      });

    const links: Command[] = (
      [
        { key: 'github', label: 'GitHub', icon: 'ph:github-logo-bold' },
        { key: 'linkedin', label: 'LinkedIn', icon: 'ph:linkedin-logo-bold' },
        { key: 'kaggle', label: 'Kaggle', icon: 'simple-icons:kaggle' },
        { key: 'medium', label: 'Medium', icon: 'ph:medium-logo-fill' },
      ] as const
    )
      .filter((l) => socialLinks[l.key])
      .map((l) => ({
        id: `link-${l.key}`,
        label: `Open ${l.label}`,
        hint: 'Link',
        icon: l.icon,
        keywords: l.label,
        run: () => {
          if (l.key === 'github') trackEvent('github_click', 'palette');
          if (l.key === 'linkedin') trackEvent('linkedin_click', 'palette');
          window.open(socialLinks[l.key] as string, '_blank', 'noopener');
        },
      }));

    /* Shown at rest — a short, scannable menu. */
    const primary = [...modes, ...nav, ...routes, ...actions, ...links];
    /* Searchable long tail — surfaced only once the visitor types. */
    const searchable = [...systemCommands, ...techCommands, ...roleCommands];

    return [...primary, ...searchable];
  }, [go, router]);

  /** Resting state hides the search index so the menu stays short. */
  const restingCount = useMemo(
    () => commands.findIndex((c) => c.id.startsWith('system-')),
    [commands]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return restingCount > 0 ? commands.slice(0, restingCount) : commands;
    const terms = q.split(/\s+/);
    return commands
      .filter((c) => {
        const haystack = `${c.label} ${c.hint} ${c.keywords ?? ''}`.toLowerCase();
        return terms.every((t) => haystack.includes(t));
      })
      /* Label matches rank above keyword-only matches. */
      .sort((a, b) => {
        const score = (c: (typeof commands)[number]) =>
          c.label.toLowerCase().includes(q) ? 0 : 1;
        return score(a) - score(b);
      });
  }, [commands, query, restingCount]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('cmdk:open', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('cmdk:open', onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 20);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => setActive(0), [query]);

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = filtered[active];
      if (cmd) {
        cmd.run();
        setOpen(false);
      }
    }
  };

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-canvas/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="glass relative w-full max-w-xl overflow-hidden rounded-2xl"
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onKeyDown={onListKey}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Icon
                icon="ph:magnifying-glass-bold"
                className="text-lg text-ink-faint"
                aria-hidden
              />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search systems, technologies, sections…"
                aria-label="Search commands"
                className="w-full bg-transparent py-4 text-sm text-ink outline-none placeholder:text-ink-faint"
              />
              <kbd className="hidden rounded-md border border-line bg-fill-2 px-1.5 py-0.5 text-[10px] font-medium text-ink-faint sm:block">
                ESC
              </kbd>
            </div>

            <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-ink-muted">
                  No results for &ldquo;{query}&rdquo;
                </p>
              ) : (
                filtered.map((cmd, i) => (
                  <button
                    key={cmd.id}
                    data-idx={i}
                    onClick={() => {
                      cmd.run();
                      setOpen(false);
                    }}
                    onMouseMove={() => setActive(i)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      i === active ? 'bg-fill-3' : ''
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line ${
                        i === active
                          ? 'bg-accent/15 text-accent'
                          : 'bg-fill-2 text-ink-muted'
                      }`}
                    >
                      <Icon icon={cmd.icon} aria-hidden />
                    </span>
                    <span className="flex-1 text-sm font-medium text-ink">
                      {cmd.label}
                    </span>
                    <span className="text-[11px] text-ink-faint">{cmd.hint}</span>
                  </button>
                ))
              )}
            </div>

            <div className="flex items-center justify-between border-t border-line px-4 py-2.5 text-[11px] text-ink-faint">
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-line bg-fill-2 px-1.5 py-0.5">
                  ↑↓
                </kbd>
                navigate
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-line bg-fill-2 px-1.5 py-0.5">
                  ↵
                </kbd>
                select
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
