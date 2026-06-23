import { Icon } from '@/components/ui/Icon';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import { accentMap } from '@/lib/accent';
import { certifications } from '@/portfolio';
import type { CertificationType } from '@/types/sections';

function certIcon(c: CertificationType) {
  if (c.issuedby.toLowerCase().includes('amazon')) return 'logos:aws';
  switch (c.category) {
    case 'AI / ML':
      return 'ph:brain-bold';
    case 'Security':
      return 'ph:shield-check-bold';
    default:
      return 'ph:certificate-bold';
  }
}

export default function Certifications() {
  return (
    <Section id="certifications">
      <SectionHeading
        eyebrow="Certifications"
        title="Credentials that back the claims"
        subtitle="Industry certifications validating my cloud, security, and machine-learning foundations."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((c, i) => {
          const accent = accentMap[c.accent];
          return (
            <Reveal key={c.certificate} delay={i * 0.06}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-line bg-fill-2 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-hair-strong">
                <div
                  className={`pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent ${accent.via} to-transparent opacity-70`}
                  aria-hidden
                />
                <div
                  className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full ${accent.bgSoft} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
                  aria-hidden
                />

                <div className="flex items-start justify-between">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent.bgSoft} ${accent.text}`}
                  >
                    <Icon icon={certIcon(c)} className="text-2xl" aria-hidden />
                  </span>
                  <span className={`chip ${accent.text}`}>{c.category}</span>
                </div>

                <h3 className="mt-5 text-base font-semibold leading-snug text-ink">
                  {c.certificate}
                </h3>
                <p className="mt-1 text-sm text-ink-muted">{c.issuedby}</p>

                {c.link && (
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-accent"
                  >
                    <Icon icon="ph:seal-check-bold" aria-hidden /> Verify
                    credential
                  </a>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
