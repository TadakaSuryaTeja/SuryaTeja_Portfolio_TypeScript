import { Icon } from '@/components/ui/Icon';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import { resumes, profile } from '@/portfolio';
import { trackEvent } from '@/lib/analytics';

/**
 * Résumé section — two ATS-safe variants, previewable inline and downloadable.
 * Both are generated from `content/resume.mjs` via `npm run build:resume`.
 */
export default function Resume() {
  const primary = resumes.find((r) => r.primary) ?? resumes[0];

  return (
    <Section id="resume" essential>
      <SectionHeading
        eyebrow="Résumé"
        title="Two versions, both ATS-safe"
        subtitle="Single column, selectable text, no graphics or skill bars — built to survive an applicant tracking system and still read well to a human."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <div className="glass flex h-full flex-col rounded-4xl p-6 sm:p-8">
            <h3 className="text-base font-semibold text-ink">{profile.name}</h3>
            <p className="mt-1.5 text-sm text-ink-muted">{profile.headline}</p>

            <ul className="mt-6 space-y-3" role="list">
              {resumes.map((r) => (
                <li key={r.href}>
                  <a
                    href={r.href}
                    download
                    onClick={() => trackEvent('resume_download', r.label)}
                    className="group flex items-start gap-3 rounded-2xl border border-line bg-fill-1 p-4 transition-colors hover:border-hair-strong"
                  >
                    <span className="mt-0.5 text-accent">
                      <Icon icon="ph:file-pdf-bold" className="text-xl" aria-hidden />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-semibold text-ink">
                        {r.label}
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-ink-muted">
                        {r.description}
                      </span>
                    </span>
                    <Icon
                      icon="ph:download-simple-bold"
                      className="mt-0.5 text-ink-faint transition-transform group-hover:translate-y-0.5"
                      aria-hidden
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="glass overflow-hidden rounded-4xl p-2">
            <object
              data={`${primary.href}#toolbar=0&navpanes=0`}
              type="application/pdf"
              className="h-[34rem] w-full rounded-3xl"
              aria-label={`Preview of ${primary.label}`}
            >
              <div className="flex h-[34rem] flex-col items-center justify-center gap-4 rounded-3xl bg-fill-1 p-8 text-center">
                <p className="text-sm text-ink-muted">
                  Your browser can&rsquo;t preview PDFs inline.
                </p>
                <a className="btn-primary" href={primary.href} download>
                  <Icon icon="ph:download-simple-bold" aria-hidden />
                  Download the résumé
                </a>
              </div>
            </object>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
