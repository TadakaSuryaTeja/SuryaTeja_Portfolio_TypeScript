import { Icon } from '@/components/ui/Icon';
import { setMode } from '@/lib/modes';
import { useViewMode } from '@/components/recruiter/ViewModeController';
import { trackEvent } from '@/lib/analytics';
import { profile, socialLinks, experience, resumes, recruiterBrief } from '@/portfolio';
import { featuredSystems } from '@/content/systems';

/**
 * The 60-second answer. Rendered only in recruiter mode, above everything
 * else: who, how senior, what specialty, what proof, and four obvious CTAs.
 */
export default function RecruiterSummary() {
  const [mode] = useViewMode();
  if (mode !== 'recruiter') return null;

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
            Recruiter mode
          </span>
          <button
            type="button"
            onClick={() => setMode('default')}
            className="btn-ghost !py-1.5 !text-xs"
          >
            Show full portfolio
            <Icon icon="ph:arrow-right-bold" className="text-xs" aria-hidden />
          </button>
        </div>

        <h2 className="mt-5 text-balance text-2xl font-semibold tracking-tightest text-ink sm:text-3xl">
          {profile.name}
        </h2>
        <p className="mt-1.5 text-base font-medium text-ink-muted sm:text-lg">
          Enterprise AI &amp; Agentic Systems Engineer · Technical Lead
        </p>

        <dl className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: 'Experience', v: `${profile.yearsExperience} years in technology` },
            { k: 'Current role', v: `${current.role} — ${current.company}` },
            { k: 'Specialty', v: 'Agentic AI · RAG · MCP · AWS Bedrock' },
            { k: 'Location', v: profile.location },
          ].map((row) => (
            <div key={row.k} className="rounded-2xl border border-line bg-fill-1 p-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-ink-faint">{row.k}</dt>
              <dd className="mt-1.5 text-sm font-semibold text-ink">{row.v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-xs text-ink-faint">
          7+ years across software, data and cloud engineering; the Generative AI
          specialisation is the most recent chapter, not the whole span.
        </p>

        <div className="mt-7 grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-ink">Core areas</h3>
            <ul className="mt-3 flex flex-wrap gap-1.5" role="list">
              {recruiterBrief.coreAreas.map((area) => (
                <li
                  key={area}
                  className="rounded-lg border border-line bg-fill-2 px-2.5 py-1 text-xs font-medium text-ink-muted"
                >
                  {area}
                </li>
              ))}
            </ul>

            <h3 className="mt-6 text-sm font-semibold text-ink">Selected achievements</h3>
            <ul className="mt-3 space-y-2" role="list">
              {recruiterBrief.achievements.map((a) => (
                <li key={a} className="flex items-start gap-2 text-sm leading-relaxed text-ink-muted">
                  <Icon icon="ph:check-bold" className="mt-1 shrink-0 text-xs text-success" aria-hidden />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">Featured systems</h3>
            <ul className="mt-3 space-y-2" role="list">
              {featuredSystems.slice(0, 3).map((s) => (
                <li key={s.slug} className="rounded-2xl border border-line bg-fill-1 p-3.5">
                  <p className="text-sm font-semibold text-ink">{s.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-muted">{s.systemType}</p>
                  <p className="mt-1.5 text-[0.68rem] text-ink-faint">{s.tech.slice(0, 4).join(' · ')}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
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
            onClick={() => trackEvent('linkedin_click', 'recruiter')}
          >
            <Icon icon="ph:linkedin-logo-bold" aria-hidden />
            LinkedIn
          </a>
          <a
            className="btn-ghost"
            href={socialLinks.github}
            target="_blank"
            rel="noreferrer noopener"
            onClick={() => trackEvent('github_click', 'recruiter')}
          >
            <Icon icon="ph:github-logo-bold" aria-hidden />
            GitHub
          </a>
          <a
            className="btn-ghost"
            href={`mailto:${socialLinks.email}`}
            onClick={() => trackEvent('contact_click', 'recruiter')}
          >
            <Icon icon="ph:envelope-simple-bold" aria-hidden />
            Email
          </a>
        </div>
      </div>
    </section>
  );
}
