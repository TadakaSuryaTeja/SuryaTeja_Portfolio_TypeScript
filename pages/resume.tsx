import Head from 'next/head';
import { Icon } from '@/components/ui/Icon';
import PageShell from '@/components/ui/PageShell';
import { FadeIn } from '@/components/motion';
import {
  profile,
  socialLinks,
  resumes,
  experience,
  educationInfo,
  certifications,
  skillCategories,
  seoData,
  recruiterBrief,
} from '@/portfolio';
import { trackEvent } from '@/lib/analytics';

/**
 * Web résumé — the same facts as the PDF, readable without a download and
 * printable to a clean single-column document (see the `print:` utilities).
 */
export default function ResumePage() {
  const base = (seoData.url ?? '').replace(/\/$/, '');
  const description = `${profile.name} — ${profile.headline}. ${profile.yearsExperience} years across software, data and cloud engineering with recent specialisation in production Generative AI.`;

  return (
    <>
      <Head>
        <title>{`Résumé — ${profile.name}`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${base}/resume`} />
        <meta property="og:title" content={`Résumé — ${profile.name}`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${base}/resume`} />
        <meta
          property="og:image"
          content={`${base}/api/og?title=${encodeURIComponent('Résumé')}&subtitle=${encodeURIComponent(profile.headline)}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <PageShell>
        <div className="container-px pb-24 pt-28 sm:pt-36">
          <div className="mx-auto max-w-3xl">
            {/* Download bar — hidden when printing. */}
            <FadeIn onMount className="print:hidden">
              <div className="glass flex flex-col gap-4 rounded-3xl p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <p className="text-sm font-semibold text-ink">Prefer the PDF?</p>
                  <p className="mt-1 text-xs text-ink-muted">
                    Both versions are ATS-safe: single column, selectable text, no graphics.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resumes.map((r) => (
                    <a
                      key={r.href}
                      href={r.href}
                      download
                      onClick={() => trackEvent('resume_download', r.label)}
                      className={r.primary ? 'btn-primary !py-2.5 !text-xs' : 'btn-ghost !py-2.5 !text-xs'}
                    >
                      <Icon icon="ph:download-simple-bold" aria-hidden />
                      {r.primary ? 'AI Engineer résumé' : 'Master résumé'}
                    </a>
                  ))}
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn-ghost !py-2.5 !text-xs"
                  >
                    <Icon icon="ph:printer-bold" aria-hidden />
                    Print
                  </button>
                </div>
              </div>
            </FadeIn>

            {/* Résumé document */}
            <article className="mt-8">
              <header className="border-b border-line pb-6">
                <h1 className="text-3xl font-semibold tracking-tightest text-ink sm:text-4xl">
                  {profile.name}
                </h1>
                <p className="mt-2 text-sm font-semibold text-ink-muted sm:text-base">
                  {profile.headline}
                </p>
                <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-muted">
                  <a className="hover:text-ink" href={`mailto:${socialLinks.email}`}>
                    {socialLinks.email}
                  </a>
                  <span aria-hidden>·</span>
                  <span>{profile.location}</span>
                  <span aria-hidden>·</span>
                  <a className="hover:text-ink" href={socialLinks.linkedin} target="_blank" rel="noreferrer noopener">
                    LinkedIn
                  </a>
                  <span aria-hidden>·</span>
                  <a className="hover:text-ink" href={socialLinks.github} target="_blank" rel="noreferrer noopener">
                    GitHub
                  </a>
                </p>
              </header>

              <Block title="Professional summary">
                <p className="text-sm leading-relaxed text-ink-muted">
                  Technical Lead with {profile.yearsExperience} years of software, data and cloud
                  engineering, specialised in production Generative AI. Designed and led an
                  end-to-end enterprise AI automation platform on AWS Bedrock and Amazon Q
                  Business, using multi-agent orchestration over custom MCP servers. Built RAG
                  pipelines over thousands of enterprise documents, with a deep foundation in
                  Python backend engineering, AWS architecture and data platforms.
                </p>
              </Block>

              <Block title="Experience">
                <div className="space-y-6">
                  {experience.map((e) => (
                    <div key={e.company}>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <h3 className="text-sm font-semibold text-ink">
                          {e.company} — {e.role}
                        </h3>
                        <span className="text-xs text-ink-faint">{e.date}</span>
                      </div>
                      {e.location && (
                        <p className="mt-0.5 text-xs italic text-ink-faint">{e.location}</p>
                      )}
                      <ul className="mt-2.5 space-y-1.5" role="list">
                        {e.bullets.map((b) => (
                          <li
                            key={b}
                            className="flex items-start gap-2 text-sm leading-relaxed text-ink-muted"
                          >
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Block>

              <Block title="Skills">
                <dl className="space-y-2.5">
                  {skillCategories.map((cat) => (
                    <div key={cat.title} className="text-sm leading-relaxed">
                      <dt className="inline font-semibold text-ink">{cat.title}: </dt>
                      <dd className="inline text-ink-muted">
                        {cat.skills.map((s) => s.name).join(', ')}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Block>

              <Block title="Education">
                <ul className="space-y-2" role="list">
                  {educationInfo.map((e) => (
                    <li key={e.schoolName} className="text-sm">
                      <span className="font-semibold text-ink">{e.schoolName}</span>
                      <span className="text-ink-muted"> — {e.subHeader}</span>
                      <span className="text-ink-faint"> · {e.duration}</span>
                    </li>
                  ))}
                </ul>
              </Block>

              <Block title="Certifications">
                <ul className="space-y-1.5" role="list">
                  {certifications.map((c) => (
                    <li key={c.certificate} className="text-sm text-ink-muted">
                      <span className="font-medium text-ink">{c.certificate}</span> — {c.issuedby}
                    </li>
                  ))}
                </ul>
              </Block>

              <Block title="Interested in">
                <p className="text-sm leading-relaxed text-ink-muted">
                  {recruiterBrief.interestedIn.join(' · ')}
                </p>
              </Block>
            </article>
          </div>
        </div>
      </PageShell>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 break-inside-avoid">
      <h2 className="border-b border-line pb-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-ink">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
