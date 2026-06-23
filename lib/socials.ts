export type SocialItem = {
  key: string;
  icon: string;
  label: string;
};

/** Single source of truth for the social links rendered across the site. */
export const SOCIAL_ITEMS: SocialItem[] = [
  { key: 'linkedin', icon: 'ph:linkedin-logo-fill', label: 'LinkedIn' },
  { key: 'github', icon: 'ph:github-logo-fill', label: 'GitHub' },
  { key: 'kaggle', icon: 'simple-icons:kaggle', label: 'Kaggle' },
  { key: 'medium', icon: 'ph:medium-logo-fill', label: 'Medium' },
];
