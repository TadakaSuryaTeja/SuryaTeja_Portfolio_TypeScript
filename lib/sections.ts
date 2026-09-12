export type NavSection = {
  id: string;
  label: string;
  /** Shown in the desktop top nav. Defaults to true; false = footer/mobile/⌘K only. */
  desktop?: boolean;
};

export const NAV_SECTIONS: NavSection[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'ownership', label: 'Scope', desktop: false },
  { id: 'experience', label: 'Experience' },
  { id: 'case-studies', label: 'Case Studies' },
  { id: 'projects', label: 'Work' },
  { id: 'ai-lab', label: 'AI Lab' },
  { id: 'skills', label: 'Skills' },
  { id: 'certifications', label: 'Certifications', desktop: false },
  { id: 'open-source', label: 'Open Source', desktop: false },
  { id: 'writing', label: 'Insights', desktop: false },
  { id: 'resume', label: 'Résumé', desktop: false },
  { id: 'contact', label: 'Contact' },
];
