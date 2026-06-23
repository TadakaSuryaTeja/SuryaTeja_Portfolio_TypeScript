export type NavSection = {
  id: string;
  label: string;
  /** Shown in the desktop top nav. Defaults to true; false = footer/mobile/⌘K only. */
  desktop?: boolean;
};

export const NAV_SECTIONS: NavSection[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'case-studies', label: 'Case Studies' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'writing', label: 'Writing', desktop: false },
  { id: 'contact', label: 'Contact' },
];
