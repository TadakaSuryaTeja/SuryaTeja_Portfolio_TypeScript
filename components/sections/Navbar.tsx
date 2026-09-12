import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { NAV_SECTIONS, NAV_ROUTES } from '@/lib/sections';
import { profile, socialLinks } from '@/portfolio';
import ViewModeMenu from '@/components/recruiter/ViewModeMenu';
import { trackEvent } from '@/lib/analytics';

export default function Navbar() {
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevOpen = useRef(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.2,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Lock scroll, move focus into the dialog, and close on Escape.
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      // Trap focus within the dialog (APG modal pattern).
      if (e.key === 'Tab') {
        const dialog = document.getElementById('mobile-menu');
        if (!dialog) return;
        const focusables = dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Return focus to the toggle when the dialog closes.
  useEffect(() => {
    if (prevOpen.current && !open) toggleRef.current?.focus();
    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-line bg-canvas/70 backdrop-blur-xl'
            : 'border-b border-transparent'
        }`}
      >
        <nav
          aria-label="Primary"
          className="container-px flex h-16 items-center justify-between sm:h-[72px]"
        >
          <Link href="/" className="flex items-center gap-2.5" aria-label="Home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-violet text-sm font-bold text-white shadow-glow">
              {profile.initials}
            </span>
            <span className="hidden whitespace-nowrap text-sm font-semibold tracking-tight text-ink xl:block">
              {profile.name}
            </span>
          </Link>

          <div className="hidden items-center gap-0.5 lg:flex">
            {NAV_SECTIONS.filter((s) => s.desktop !== false).map((s) => (
              <a
                key={s.id}
                href={`/#${s.id}`}
                aria-current={active === s.id ? 'location' : undefined}
                className="relative whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
              >
                {active === s.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-fill-3 ring-1 ring-line"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={active === s.id ? 'text-ink' : undefined}>
                  {s.label}
                </span>
              </a>
            ))}
            {NAV_ROUTES.filter((r) => r.href !== '/resume').map((r) => (
              <a
                key={r.href}
                href={r.href}
                className="relative whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
              >
                {r.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 xl:flex">
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub"
                onClick={() => trackEvent('github_click', 'navbar')}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-fill-2 text-ink-muted transition-colors hover:border-hair-strong hover:text-ink"
              >
                <Icon icon="ph:github-logo-bold" aria-hidden />
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn"
                onClick={() => trackEvent('linkedin_click', 'navbar')}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-fill-2 text-ink-muted transition-colors hover:border-hair-strong hover:text-ink"
              >
                <Icon icon="ph:linkedin-logo-bold" aria-hidden />
              </a>
            </div>
            <ViewModeMenu />
            <ThemeToggle />
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('cmdk:open'))}
              className="hidden items-center gap-2 rounded-full border border-line bg-fill-2 py-2 pl-3 pr-2 text-xs font-medium text-ink-muted transition-colors hover:border-hair-strong hover:text-ink sm:flex"
              aria-label="Open command palette"
            >
              <Icon icon="ph:magnifying-glass-bold" aria-hidden />
              <kbd className="rounded border border-line bg-fill-3 px-1.5 py-0.5 text-[10px] text-ink-faint">
                ⌘K
              </kbd>
            </button>
            <Link
              href="/resume"
              onClick={() => trackEvent('resume_download', 'navbar')}
              className="btn-primary hidden !py-2.5 px-4 text-[13px] sm:inline-flex"
            >
              <Icon icon="ph:file-text-bold" aria-hidden /> Résumé
            </Link>
            <button
              ref={toggleRef}
              onClick={() => setOpen(true)}
              className="btn-ghost !px-0 h-10 w-10 lg:hidden"
              aria-label="Open navigation menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <Icon icon="ph:list-bold" className="text-lg" aria-hidden />
            </button>
          </div>
        </nav>
        <motion.div
          style={{ scaleX: progress }}
          className="h-px origin-left bg-gradient-to-r from-accent via-violet to-accent"
        />
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-canvas/90 backdrop-blur-xl"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              className="absolute right-0 top-0 flex h-full w-[80%] max-w-sm flex-col gap-1 border-l border-line bg-surface p-6"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm font-semibold text-ink">
                  {profile.name}
                </span>
                <button
                  ref={closeRef}
                  onClick={() => setOpen(false)}
                  className="btn-ghost !px-0 h-9 w-9"
                  aria-label="Close navigation menu"
                >
                  <Icon icon="ph:x-bold" aria-hidden />
                </button>
              </div>
              {NAV_SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`/#${s.id}`}
                  onClick={() => setOpen(false)}
                  aria-current={active === s.id ? 'location' : undefined}
                  className={`rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                    active === s.id
                      ? 'bg-fill-3 text-ink'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {s.label}
                </a>
              ))}
              <div className="my-3 border-t border-line pt-3">
                {NAV_ROUTES.map((r) => (
                  <a
                    key={r.href}
                    href={r.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-base font-medium text-ink-muted transition-colors hover:text-ink"
                  >
                    <Icon icon={r.icon} className="text-lg" aria-hidden />
                    {r.label}
                  </a>
                ))}
              </div>
              <Link href="/resume" className="btn-primary mt-1" onClick={() => setOpen(false)}>
                <Icon icon="ph:file-text-bold" aria-hidden /> View résumé
              </Link>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
