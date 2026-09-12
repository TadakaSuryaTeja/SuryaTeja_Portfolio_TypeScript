import { useCallback, useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { profile, socialLinks, experience, resumes, about } from '@/portfolio';
import { trackEvent } from '@/lib/analytics';

const STORAGE_KEY = 'recruiter-mode';

/**
 * Recruiter Mode — an alternate presentation, never a reduced portfolio.
 * Turning it on hides the deep-dive sections (case studies, architecture,
 * AI lab, insights) and surfaces a 60-second summary card. Everything is one
 * toggle away, and the toggle state lives in `<html data-recruiter>` so the
 * hiding is pure CSS with no layout thrash.
 */
export default function RecruiterMode() {
  const [on, setOn] = useState(false);

  const apply = useCallback((next: boolean) => {
    setOn(next);
    if (next) trackEvent('recruiter_mode_enable');
    document.documentElement.dataset.recruiter = next ? 'on' : 'off';
    try {
      localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off');
    } catch {
      /* private mode — the toggle still works for this session */
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let initial = false;
    if (params.get('recruiter') === '1') initial = true;
    else {
      try {
        initial = localStorage.getItem(STORAGE_KEY) === 'on';
      } catch {
        initial = false;
      }
    }
    if (initial) apply(true);

    const toggle = () => apply(document.documentElement.dataset.recruiter !== 'on');
    window.addEventListener('recruiter:toggle', toggle);
    return () => window.removeEventListener('recruiter:toggle', toggle);
  }, [apply]);

  if (!on) return null;

  const current = experience[0];

  return (
    <section
      id="recruiter-summary"
      data-essential="true"
      aria-label="Recruiter summary"
      className="container-px pt-28 sm:pt-32"
    >
      <div className="glass rounded-4xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Recruiter Mode
          </span>
          <button
            type="button"
            onClick={() => apply(false)}
            className="btn-ghost !py-1.5 !text-xs"
          >
            Show full portfolio
            <Icon icon="ph:arrow-right-bold" className="text-xs" aria-hidden />
          </button>
        </div>

        <h2 className="mt-5 text-balance text-2xl font-semibold tracking-tightest text-ink sm:text-3xl">
          {profile.name} — {profile.headline}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-muted sm:text-base">
          {profile.tagline}
        </p>

        <dl className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: 'Experience', v: `${profile.yearsExperience} years engineering` },
            { k: 'Current role', v: `${current.role} — ${current.company}` },
            { k: 'Specialty', v: 'Agentic AI · RAG · MCP · AWS Bedrock' },
            { k: 'Location', v: profile.location },
          ].map((row) => (
            <div key={row.k} className="rounded-2xl border border-line bg-fill-1 p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-ink-faint">
                {row.k}
              </dt>
              <dd className="mt-1.5 text-sm font-semibold text-ink">{row.v}</dd>
            </div>
          ))}
        </dl>

        <ul className="mt-6 flex flex-wrap gap-2" role="list">
          {about.interests.map((i) => (
            <li
              key={i}
              className="rounded-lg border border-line bg-fill-2 px-2.5 py-1 text-xs font-medium text-ink-muted"
            >
              {i}
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-wrap gap-3">
          <a
            className="btn-primary"
            href={resumes[0].href}
            download
            onClick={() => trackEvent('resume_download', resumes[0].label)}
          >
            <Icon icon="ph:download-simple-bold" aria-hidden />
            Download résumé
          </a>
          <a
            className="btn-ghost"
            href={socialLinks.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() => trackEvent('linkedin_click')}
          >
            <Icon icon="ph:linkedin-logo-bold" aria-hidden />
            LinkedIn
          </a>
          <a
            className="btn-ghost"
            href={socialLinks.github}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() => trackEvent('github_click')}
          >
            <Icon icon="ph:github-logo-bold" aria-hidden />
            GitHub
          </a>
          <a
            className="btn-ghost"
            href={`mailto:${socialLinks.email}`}
            onClick={() => trackEvent('contact_click')}
          >
            <Icon icon="ph:envelope-simple-bold" aria-hidden />
            Email
          </a>
        </div>
      </div>
    </section>
  );
}
