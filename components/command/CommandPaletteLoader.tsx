import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

/**
 * The palette indexes every system, technology and role, and pulls in
 * animation and routing code to do it. None of that is needed until someone
 * actually reaches for it — so it is fetched on the first ⌘K / Ctrl-K or
 * `cmdk:open`, keeping it off the initial hydration path entirely.
 */
const CommandPalette = dynamic(() => import('@/components/command/CommandPalette'), {
  ssr: false,
});

export default function CommandPaletteLoader() {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (armed) return;

    const arm = () => setArmed(true);

    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        arm();
        // Re-dispatch once mounted so the palette opens on this same keystroke.
        requestAnimationFrame(() => window.dispatchEvent(new CustomEvent('cmdk:open')));
      }
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('cmdk:open', arm);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('cmdk:open', arm);
    };
  }, [armed]);

  return armed ? <CommandPalette /> : null;
}
