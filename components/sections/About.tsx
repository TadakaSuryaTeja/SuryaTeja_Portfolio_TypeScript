import { Icon } from '@/components/ui/Icon';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import Terminal from '@/components/ui/Terminal';
import { about, aboutTerminal, educationInfo } from '@/portfolio';

export default function About() {
  return (
    <Section id="about">
      <Reveal className="mx-auto mb-12 max-w-3xl">
        <Terminal lines={aboutTerminal} />
      </Reveal>
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Narrative */}
        <Reveal>
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            About me
          </span>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tightest text-ink sm:text-[2.6rem] sm:leading-[1.1]">
            Architecture mindset, <span className="gradient-text">builder</span>{' '}
            instincts.
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-muted">
            {about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint">
              What I enjoy
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {about.interests.map((tag) => (
                <span key={tag} className="chip">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {about.learning && about.learning.length > 0 && (
            <div className="mt-7">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint">
                <Icon icon="ph:trend-up-bold" aria-hidden /> Currently learning
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {about.learning.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-hair-strong px-3 py-1 text-xs font-medium text-ink-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Reveal>

        {/* At a glance + education */}
        <Reveal delay={0.1}>
          <div className="glass rounded-4xl p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint">
              At a glance
            </p>
            <dl className="mt-4 divide-y divide-line">
              {about.highlights.map((h) => (
                <div
                  key={h.label}
                  className="flex items-start justify-between gap-6 py-3.5"
                >
                  <dt className="text-sm text-ink-muted">{h.label}</dt>
                  <dd className="text-right text-sm font-semibold text-ink">
                    {h.value}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint">
              Education
            </p>
            <ul className="mt-4 space-y-4">
              {educationInfo.map((e) => (
                <li key={e.schoolName} className="flex gap-3.5">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-fill-2 text-accent">
                    <Icon icon="ph:graduation-cap-bold" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {e.schoolName}
                    </p>
                    <p className="text-sm text-ink-muted">{e.subHeader}</p>
                    <p className="mt-0.5 text-xs text-ink-faint">{e.duration}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
