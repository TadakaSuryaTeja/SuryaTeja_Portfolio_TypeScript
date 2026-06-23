import type { ReactNode } from 'react';

/* ----------------------------------- SEO ---------------------------------- */
export type SEODataType = {
  title: string;
  author?: string;
  description?: string;
  image?: string;
  url?: string;
  keywords: string[];
};

/* --------------------------------- SOCIALS -------------------------------- */
export type SocialLinksType = {
  url?: string;
  email?: string;
  linkedin?: string;
  github?: string;
  medium?: string;
  kaggle?: string;
  linktr?: string;
  twitter?: string;
  [link: string]: string | undefined;
};

/* ------------------------------- HERO / PROFILE --------------------------- */
export type ProfileType = {
  name: string;
  initials: string;
  headline: string;
  roles: string[];
  tagline: string;
  location: string;
  availability: string;
  yearsExperience: string;
  resumeLink?: string;
  photo?: string;
};

/* --------------------------------- METRICS -------------------------------- */
export type MetricType = {
  value: string;
  label: string;
  sublabel?: string;
  accent?: 'accent' | 'violet' | 'success';
};

/* ---------------------------------- ABOUT --------------------------------- */
export type AboutType = {
  paragraphs: string[];
  highlights: { label: string; value: string }[];
  interests: string[];
  /** Aspirational — rendered as a clearly-labeled "Currently learning" group, never as claimed skills. */
  learning?: string[];
};

/* --------------------------------- SKILLS --------------------------------- */
export type SkillType = {
  name: string;
  icon: string;
};

export type SkillCategoryType = {
  title: string;
  description: string;
  icon: string;
  accent: 'accent' | 'violet' | 'success';
  skills: SkillType[];
};

export type SkillBarType = {
  stack: string;
  level: number; // 0 - 100
};

/* ------------------------------- EXPERIENCE ------------------------------- */
export type ExperienceType = {
  role: string;
  company: string;
  client?: string;
  companyLogo?: string;
  location?: string;
  date: string;
  summary: ReactNode | string;
  bullets: string[];
  tech: string[];
  metrics?: { value: string; label: string }[];
};

/* -------------------------------- EDUCATION ------------------------------- */
export type EducationType = {
  schoolName: string;
  subHeader: string;
  duration: string;
};

/* --------------------------------- PROJECTS ------------------------------- */
export type ProjectType = {
  name: string;
  category: string;
  problem: string;
  desc: string;
  highlights?: string[];
  tech: string[];
  impact?: string;
  github?: string;
  link?: string;
  featured?: boolean;
};

/* ----------------------------- CERTIFICATIONS ----------------------------- */
export type CertificationType = {
  certificate: string;
  issuedby: string;
  category: 'Cloud' | 'AI / ML' | 'Security' | 'Engineering';
  year?: string;
  link?: string;
  accent: 'accent' | 'violet' | 'success';
};

/* ------------------------------ TESTIMONIALS ------------------------------ */
export type TestimonialType = {
  name: string;
  role: string;
  company?: string;
  avatar?: string;
  relationship?: string;
  quote: string;
};

/* ---------------------------------- BLOG ---------------------------------- */
export type BlogPostType = {
  title: string;
  excerpt: string;
  tag: string;
  date?: string;
  readTime?: string;
  link: string;
};

/* --------------------------------- CONTACT -------------------------------- */
export type ContactType = {
  title: string;
  subtitle: string;
  email?: string;
};

/* ----------------------------- TECH MARQUEE ------------------------------- */
export type MarqueeItemType = {
  name: string;
  icon: string;
};

/* ------------------------------- TERMINAL --------------------------------- */
export type TerminalLineType = { cmd: string; out: string };

/* ----------------------------- CASE STUDIES ------------------------------- */
export type ArchNode = { label: string; icon: string };
export type ArchLayer = { title: string; nodes: ArchNode[] };
export type ArchitectureType = { caption: string; layers: ArchLayer[] };

export type CaseStudyType = {
  id: string;
  company: string;
  title: string;
  period: string;
  accent: 'accent' | 'violet' | 'success';
  problem: string;
  approach: string[];
  challenges: string[];
  results: string[];
  metrics?: { value: string; label: string }[];
  stack: string[];
  architecture: ArchitectureType;
};
