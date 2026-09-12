import { useEffect, useState } from 'react';
import { applyMode, readStoredMode, MODE_EVENT, type ViewMode } from '@/lib/modes';
import { trackEvent } from '@/lib/analytics';

/**
 * Owns the active view mode. Mounted once; every other component changes the
 * mode by dispatching `viewmode:set` rather than reaching in here directly.
 */
export function useViewMode(): [ViewMode, (m: ViewMode) => void] {
  const [mode, setModeState] = useState<ViewMode>('default');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get('mode');
    const initial: ViewMode =
      fromQuery === 'recruiter' || fromQuery === 'deep' ? fromQuery : readStoredMode();

    setModeState(initial);
    applyMode(initial);

    const onSet = (e: Event) => {
      const next = (e as CustomEvent<ViewMode>).detail;
      setModeState(next);
      applyMode(next);
      if (next === 'recruiter') trackEvent('recruiter_mode_enable');
      if (next === 'deep') trackEvent('deep_dive_enable');
    };

    window.addEventListener(MODE_EVENT, onSet);
    return () => window.removeEventListener(MODE_EVENT, onSet);
  }, []);

  return [mode, setModeState];
}

export default function ViewModeController() {
  useViewMode();
  return null;
}
