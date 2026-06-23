import { Icon } from '@/components/ui/Icon';
import { NAV_SECTIONS } from '@/lib/sections';
import { profile, socialLinks } from '@/portfolio';
import { SOCIAL_ITEMS } from '@/lib/socials';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="container-px py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <a href="#home" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-violet text-sm font-bold text-white">
                {profile.initials}
              </span>
              <span className="text-sm font-semibold text-ink">
                {profile.name}
              </span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              {profile.headline}. Currently building in {profile.location}.
            </p>
            <div className="mt-5 flex items-center gap-2.5">
              {SOCIAL_ITEMS.map(
                (s) =>
                  socialLinks[s.key] && (
                    <a
                      key={s.key}
                      href={socialLinks[s.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-fill-2 text-ink-muted transition-all hover:border-hair-strong hover:text-ink"
                    >
                      <Icon icon={s.icon} aria-hidden />
                    </a>
                  )
              )}
            </div>
          </div>

          <nav className="grid grid-cols-2 gap-x-12 gap-y-2.5 sm:grid-cols-3">
            {NAV_SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-sm text-ink-muted transition-colors hover:text-ink"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-ink-faint sm:flex-row">
          <p>
            © {year} {profile.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5">
            Built with Next.js, Tailwind CSS &amp; Framer Motion
          </p>
        </div>
      </div>
    </footer>
  );
}
