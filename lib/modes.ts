/**
 * VIEW MODES
 *
 * The site serves two very different readers. A recruiter needs the 60-second
 * version; an engineering manager wants architecture and tradeoffs. Rather
 * than averaging them into one compromised page, the same content has three
 * presentations.
 *
 * The active mode lives on `<html data-view-mode>` so hiding and revealing is
 * pure CSS — no re-render, no layout thrash, and content is only ever hidden,
 * never removed from the document.
 */
export type ViewMode = 'default' | 'recruiter' | 'deep';

export const STORAGE_KEY = 'view-mode';
export const MODE_EVENT = 'viewmode:set';

export const MODES: { id: ViewMode; label: string; icon: string; description: string }[] = [
  {
    id: 'default',
    label: 'Full portfolio',
    icon: 'ph:squares-four-bold',
    description: 'Everything, in narrative order.',
  },
  {
    id: 'recruiter',
    label: 'Recruiter mode',
    icon: 'ph:identification-badge-bold',
    description: 'The 60-second version: summary, experience, systems, résumé.',
  },
  {
    id: 'deep',
    label: 'Engineering deep dive',
    icon: 'ph:blueprint-bold',
    description: 'Architecture, decisions, tradeoffs and infrastructure detail.',
  },
];

export function readStoredMode(): ViewMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'recruiter' || stored === 'deep' || stored === 'default') return stored;
  } catch {
    /* private mode — fall through to the default */
  }
  return 'default';
}

export function applyMode(mode: ViewMode) {
  document.documentElement.dataset.viewMode = mode;
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* the mode still applies for this session */
  }
}

/** Broadcast a mode change from anywhere (navbar, palette, in-page buttons). */
export function setMode(mode: ViewMode) {
  window.dispatchEvent(new CustomEvent<ViewMode>(MODE_EVENT, { detail: mode }));
}
