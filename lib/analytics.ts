import { track } from '@vercel/analytics';

/**
 * Conversion events. Privacy-conscious by construction: only the event name
 * and, at most, a coarse label are sent — never personal data, never free text
 * a visitor typed.
 */
export type PortfolioEvent =
  | 'resume_download'
  | 'github_click'
  | 'linkedin_click'
  | 'project_open'
  | 'case_study_open'
  | 'contact_click'
  | 'recruiter_mode_enable'
  | 'deep_dive_enable'
  | 'technology_explore'
  | 'command_palette_open';

export function trackEvent(event: PortfolioEvent, label?: string) {
  try {
    track(event, label ? { label } : undefined);
  } catch {
    /* analytics must never break the UI */
  }
}
