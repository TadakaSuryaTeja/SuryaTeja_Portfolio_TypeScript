import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import { profile, socialLinks } from '@/portfolio';

type Command = {
  id: string;
  label: string;
  hint: string;
  icon: string;
  keywords?: string;
  run: () => void;
};

const SECTION_ICONS: Record<string, string> = {
  home: 'ph:house-bold',
  about: 'ph:user-bold',
  experience: 'ph:briefcase-bold',
  'case-studies': 'ph:cube-bold',
  projects: 'ph:folder-simple-bold',
  skills: 'ph:code-bold',
  certifications: 'ph:certificate-bold',
  writing: 'ph:pen-nib-bold',
  contact: 'ph:envelope-simple-bold',
};

const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'case-studies', label: 'Case Studies' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'writing', label: 'Writing' },
  { id: 'contact', label: 'Contact' },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const go = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = NAV.map((s) => ({
      id: `go-${s.id}`,
      label: `Go to ${s.label}`,
      hint: 'Section',
      icon: SECTION_ICONS[s.id] ?? 'ph:arrow-right-bold',
      keywords: s.label,
      run: () => go(s.id),
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
    if (profile.resumeLink)
      actions.push({
        id: 'resume',
        label: 'Open résumé',
        hint: 'Action',
        icon: 'ph:file-text-bold',
        keywords: 'cv download pdf',
        run: () => window.open(profile.resumeLink, '_blank', 'noopener'),
      });
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
        run: () =>
          window.open(socialLinks[l.key] as string, '_blank', 'noopener'),
      }));

    return [...nav, ...actions, ...links];
  }, [go]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) =>
      `${c.label} ${c.keywords ?? ''}`.toLowerCase().includes(q)
    );
  }, [commands, query]);

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
            className="absolute inset-0 bg-base/80 backdrop-blur-sm"
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
                placeholder="Search sections, links, actions…"
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
