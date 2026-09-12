import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import { MODES, setMode } from '@/lib/modes';
import { useViewMode } from '@/components/recruiter/ViewModeController';

/**
 * Mode switcher. Two audiences, one site — this is how a visitor says which
 * one they are. Implemented as a small menu-button per the APG pattern.
 */
export default function ViewModeMenu() {
  const [mode] = useViewMode();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const current = MODES.find((m) => m.id === mode) ?? MODES[0];

  return (
    <div ref={wrapRef} className="relative hidden lg:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Choose how to view this site"
        className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition-colors ${
          mode === 'default'
            ? 'border-line bg-fill-2 text-ink-muted hover:border-hair-strong hover:text-ink'
            : 'border-accent/40 bg-accent/10 text-accent'
        }`}
      >
        <Icon icon={current.icon} aria-hidden />
        <span className="hidden whitespace-nowrap xl:inline">
          {mode === 'default' ? 'View as' : current.label}
        </span>
        <Icon
          icon="ph:caret-down-bold"
          className={`text-[0.6rem] transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="View mode"
            initial={reduce ? false : { opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="glass absolute right-0 top-[calc(100%+0.5rem)] z-50 w-72 overflow-hidden rounded-2xl p-1.5"
          >
            {MODES.map((m) => (
              <button
                key={m.id}
                role="menuitemradio"
                aria-checked={m.id === mode}
                onClick={() => {
                  setMode(m.id);
                  setOpen(false);
                }}
                className={`flex w-full items-start gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors ${
                  m.id === mode ? 'bg-fill-3' : 'hover:bg-fill-2'
                }`}
              >
                <Icon
                  icon={m.icon}
                  className={`mt-0.5 text-base ${m.id === mode ? 'text-accent' : 'text-ink-muted'}`}
                  aria-hidden
                />
                <span className="flex-1">
                  <span className="block text-sm font-medium text-ink">{m.label}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">
                    {m.description}
                  </span>
                </span>
                {m.id === mode && (
                  <Icon icon="ph:check-bold" className="mt-1 text-xs text-accent" aria-hidden />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
