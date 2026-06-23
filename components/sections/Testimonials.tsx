import { Icon } from '@/components/ui/Icon';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import { testimonials } from '@/portfolio';

export default function Testimonials() {
  // Renders only once you add real recommendations to `testimonials` in portfolio.ts
  if (!testimonials.length) return null;

  return (
    <Section id="testimonials">
      <SectionHeading
        eyebrow="Testimonials"
        title="What colleagues say"
        subtitle="Recommendations from managers and peers I've worked alongside."
      />
      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.06}>
            <figure className="glass glass-hover flex h-full flex-col rounded-3xl p-6">
              <Icon
                icon="ph:quotes-fill"
                className="text-3xl text-accent/60"
                aria-hidden
              />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-muted">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-violet text-sm font-bold text-white">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{t.name}</p>
                  <p className="text-xs text-ink-muted">
                    {t.role}
                    {t.company ? ` · ${t.company}` : ''}
                  </p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
