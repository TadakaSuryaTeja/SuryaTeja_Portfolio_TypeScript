import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Icon } from '@/components/ui/Icon';
import { profile, socialLinks } from '@/portfolio';
import { SOCIAL_ITEMS } from '@/lib/socials';

function RotatingRole({ roles }: { roles: string[] }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((p) => (p + 1) % roles.length), 2600);
    return () => clearInterval(t);
  }, [roles.length]);

  return (
    <span className="relative inline-flex h-[1.15em] items-center overflow-hidden align-bottom">
      <span key={i} className="gradient-text animate-role-in whitespace-nowrap">
        {roles[i]}
      </span>
    </span>
  );
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24"
    >
      <div className="pointer-events-none absolute inset-0 grid-bg" aria-hidden />
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[80px]"
        aria-hidden
      />

      <div className="container-px">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Copy */}
          <div>
            <span className="eyebrow animate-fade-up">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-success" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              {profile.availability}
            </span>

            <h1
              className="mt-6 animate-fade-up text-balance text-4xl font-semibold leading-[1.05] tracking-tightest text-ink sm:text-6xl"
              style={{ animationDelay: '0.03s' }}
            >
              {profile.name}
            </h1>

            <div
              className="mt-3 animate-fade-up text-2xl font-semibold tracking-tight sm:text-3xl"
              style={{ animationDelay: '0.06s' }}
            >
              <RotatingRole roles={profile.roles} />
            </div>

            <p
              className="mt-6 max-w-xl animate-fade-up text-balance text-base leading-relaxed text-ink-muted sm:text-lg"
              style={{ animationDelay: '0.09s' }}
            >
              {profile.tagline}
            </p>

            <div
              className="mt-8 flex flex-wrap items-center gap-3 animate-fade-up"
              style={{ animationDelay: '0.12s' }}
            >
              <a href="#projects" className="btn-primary">
                <Icon icon="ph:rocket-launch-bold" aria-hidden /> View My Work
              </a>
              {profile.resumeLink && (
                <a
                  href={profile.resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  <Icon icon="ph:file-text-bold" aria-hidden /> Résumé
                </a>
              )}
            </div>

            <div
              className="mt-8 flex items-center gap-4 animate-fade-up"
              style={{ animationDelay: '0.15s' }}
            >
              <div className="flex items-center gap-2">
                {SOCIAL_ITEMS.map(
                  (s) =>
                    socialLinks[s.key] && (
                      <a
                        key={s.key}
                        href={socialLinks[s.key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-fill-2 text-ink-muted transition-all hover:-translate-y-0.5 hover:border-hair-strong hover:text-ink"
                      >
                        <Icon icon={s.icon} className="text-lg" aria-hidden />
                      </a>
                    )
                )}
              </div>
              <span className="hidden h-5 w-px bg-line sm:block" />
              <span className="hidden items-center gap-1.5 text-sm text-ink-muted sm:flex">
                <Icon icon="ph:map-pin-bold" aria-hidden /> {profile.location}
              </span>
            </div>
          </div>

          {/* Portrait */}
          <div
            className="relative mx-auto w-full max-w-sm animate-fade-scale"
            style={{ animationDelay: '0.06s' }}
          >
            <div className="relative">
              <div
                className="absolute -inset-4 -z-10 rounded-[2.2rem] bg-gradient-to-br from-accent/30 via-violet/20 to-transparent blur-xl"
                aria-hidden
              />
              <div className="glass overflow-hidden rounded-[2rem] p-2">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-elevated to-surface">
                  {profile.photo ? (
                    <Image
                      src={profile.photo}
                      alt={profile.name}
                      fill
                      sizes="(max-width: 1024px) 80vw, 380px"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="relative flex h-full w-full flex-col items-center justify-center gap-5 p-8 text-center">
                      <div className="grid-bg absolute inset-0 opacity-40" aria-hidden />
                      <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-accent to-violet text-5xl font-bold text-white shadow-glow">
                        {profile.initials}
                      </div>
                      <div className="relative">
                        <p className="text-lg font-semibold text-ink">
                          {profile.name}
                        </p>
                        <p className="mt-1 text-sm text-ink-muted">
                          {profile.headline}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="glass absolute -left-6 top-10 flex animate-float items-center gap-2.5 rounded-2xl px-3.5 py-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/15 text-success">
                  <Icon icon="ph:trend-up-bold" aria-hidden />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-ink">$100K+</p>
                  <p className="text-[11px] text-ink-muted">Cloud cost saved</p>
                </div>
              </div>

              <div
                className="glass absolute -right-5 bottom-12 flex animate-float items-center gap-2.5 rounded-2xl px-3.5 py-2.5"
                style={{ animationDelay: '1.5s' }}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  <Icon icon="logos:aws" aria-hidden />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-ink">AWS Certified</p>
                  <p className="text-[11px] text-ink-muted">Solutions Architect</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
