export type NavSection = {
  id: string;
  label: string;
  /** Shown in the desktop top nav. Defaults to true; false = footer/mobile/⌘K only. */
  desktop?: boolean;
  /** Palette/nav icon. */
  icon?: string;
};

/**
 * Single source of navigation truth — the navbar, footer, mobile menu and
 * command palette all read this, in this order.
 */
export const NAV_SECTIONS: NavSection[] = [
  { id: 'home', label: 'Home', desktop: false, icon: 'ph:house-bold' },
  { id: 'work', label: 'Work', icon: 'ph:cube-bold' },
  { id: 'architecture', label: 'Architecture', icon: 'ph:blueprint-bold' },
  { id: 'experience', label: 'Experience', icon: 'ph:briefcase-bold' },
  { id: 'skills', label: 'Skills', desktop: false, icon: 'ph:graph-bold' },
  { id: 'stack', label: 'The stack', desktop: false, icon: 'ph:stack-bold' },
  { id: 'ownership', label: 'Scope', desktop: false, icon: 'ph:squares-four-bold' },
  { id: 'about', label: 'About', icon: 'ph:user-bold' },
  { id: 'certifications', label: 'Certifications', desktop: false, icon: 'ph:certificate-bold' },
  { id: 'open-source', label: 'Open Source', desktop: false, icon: 'ph:github-logo-bold' },
  { id: 'writing', label: 'Insights', desktop: false, icon: 'ph:pen-nib-bold' },
  { id: 'resume', label: 'Résumé', desktop: false, icon: 'ph:file-text-bold' },
  { id: 'contact', label: 'Contact', desktop: false, icon: 'ph:envelope-simple-bold' },
];

/** Standalone routes, surfaced in the palette and the mobile menu. */
export const NAV_ROUTES: { href: string; label: string; icon: string }[] = [
  { href: '/ai-lab', label: 'AI Lab', icon: 'ph:flask-bold' },
  { href: '/insights', label: 'Insights', icon: 'ph:pen-nib-bold' },
  { href: '/resume', label: 'Résumé', icon: 'ph:file-text-bold' },
];
