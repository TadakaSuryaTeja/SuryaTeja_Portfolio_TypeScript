import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Icon } from '@/components/ui/Icon';
import { profile, socialLinks } from '@/portfolio';
import { SOCIAL_ITEMS } from '@/lib/socials';
import SystemNetwork from '@/components/hero/SystemNetwork';

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
      data-essential="true"
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

            <p
              className="mt-4 max-w-xl animate-fade-up text-balance text-xl font-semibold leading-snug text-ink sm:text-2xl"
              style={{ animationDelay: '0.05s' }}
            >
              Building production AI systems that connect models, data, tools
              and infrastructure.
            </p>

            <div
              className="mt-4 flex animate-fade-up items-baseline gap-2 text-2xl font-semibold tracking-tight sm:text-3xl"
              style={{ animationDelay: '0.07s' }}
            >
              <span className="text-ink-muted">I build</span>
              <RotatingRole roles={profile.roles} />
            </div>

            <p
              className="mt-4 animate-fade-up text-sm font-medium uppercase tracking-wide text-ink-faint"
              style={{ animationDelay: '0.08s' }}
            >
              Enterprise AI • Agentic Systems • RAG • MCP • Python • AWS
            </p>

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
                <Icon icon="ph:rocket-launch-bold" aria-hidden /> Explore Work
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
                <div className={`relative w-full overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-elevated to-surface ${profile.photo ? 'aspect-[4/5]' : 'aspect-square'}`}>
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
                    <div className="relative flex h-full w-full items-center justify-center p-5">
                      <SystemNetwork />
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
