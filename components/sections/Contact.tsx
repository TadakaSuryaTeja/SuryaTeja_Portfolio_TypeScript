import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import { contactInfo, profile, socialLinks } from '@/portfolio';
import { SOCIAL_ITEMS } from '@/lib/socials';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const email = contactInfo.email;

  const copyEmail = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <Section id="contact">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] border border-line bg-gradient-to-b from-fill-3 to-fill-1 px-6 py-16 text-center sm:px-12 sm:py-20">
          <div
            className="pointer-events-none absolute inset-0 grid-bg opacity-60"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/15 blur-[100px]"
            aria-hidden
          />

          <div className="relative">
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              {profile.availability}
            </span>
            <h2 className="mx-auto mt-6 max-w-2xl text-balance text-3xl font-semibold tracking-tightest text-ink sm:text-5xl sm:leading-[1.08]">
              {contactInfo.title}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-muted">
              {contactInfo.subtitle}
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              {email ? (
                <>
                  <a href={`mailto:${email}`} className="btn-primary">
                    <Icon icon="ph:envelope-simple-bold" aria-hidden /> Email me
                  </a>
                  <button onClick={copyEmail} className="btn-ghost">
                    <Icon
                      icon={copied ? 'ph:check-bold' : 'ph:copy-bold'}
                      aria-hidden
                    />
                    {copied ? 'Copied!' : email}
                  </button>
                </>
              ) : (
                socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    <Icon icon="ph:linkedin-logo-bold" aria-hidden /> Connect on
                    LinkedIn
                  </a>
                )
              )}
              {profile.resumeLink && (
                <a
                  href={profile.resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  <Icon icon="ph:download-simple-bold" aria-hidden /> Résumé
                </a>
              )}
            </div>

            <div className="mt-10 flex items-center justify-center gap-3">
              {SOCIAL_ITEMS.map(
                (s) =>
                  socialLinks[s.key] && (
                    <a
                      key={s.key}
                      href={socialLinks[s.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-fill-2 text-ink-muted transition-all hover:-translate-y-0.5 hover:border-hair-strong hover:text-ink"
                    >
                      <Icon icon={s.icon} className="text-xl" aria-hidden />
                    </a>
                  )
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
