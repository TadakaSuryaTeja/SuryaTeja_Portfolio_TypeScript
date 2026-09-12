import { Icon } from '@/components/ui/Icon';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import { socialLinks } from '@/portfolio';
import type { GitHubRepo } from '@/lib/cms/github';
import { trackEvent } from '@/lib/analytics';

/**
 * Live GitHub metadata, fetched at build time and revalidated. When the API is
 * rate-limited or down, `repos` arrives empty and the section collapses to a
 * profile CTA rather than rendering a broken grid.
 */
export default function OpenSource({ repos }: { repos: GitHubRepo[] }) {
  return (
    <Section id="open-source">
      <SectionHeading
        eyebrow="Open Source"
        title="Public code, not just claims"
        subtitle="A curated slice of the public repositories — cloud infrastructure, serverless backends and developer tooling."
      />

      {repos.length > 0 ? (
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {repos.map((repo, i) => (
            <Reveal key={repo.name} delay={i * 0.05}>
              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => trackEvent('github_click', repo.name)}
                className="glass glass-hover group flex h-full flex-col rounded-3xl p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                    <Icon icon="ph:github-logo-bold" className="text-lg" aria-hidden />
                    {repo.name}
                  </span>
                  {repo.stars > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
                      <Icon icon="ph:star-bold" className="text-sm" aria-hidden />
                      {repo.stars}
                    </span>
                  )}
                </div>

                {repo.description && (
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">
                    {repo.description}
                  </p>
                )}

                <div className="mt-5 flex items-center justify-between text-xs text-ink-faint">
                  {repo.language && (
                    <span className="rounded-lg border border-line bg-fill-2 px-2 py-1 font-medium text-ink-muted">
                      {repo.language}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 font-semibold text-accent">
                    View repo
                    <Icon
                      icon="ph:arrow-up-right-bold"
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal className="mt-12">
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noreferrer noopener"
            className="glass glass-hover group mx-auto flex max-w-2xl items-center gap-4 rounded-4xl p-10 text-center sm:text-left"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-fill-3 text-ink">
              <Icon icon="ph:github-logo-bold" className="text-3xl" aria-hidden />
            </span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-ink">Browse the code on GitHub</h3>
              <p className="mt-1 text-sm text-ink-muted">
                Cloud infrastructure, serverless backends, ML pipelines and developer tooling.
              </p>
            </div>
          </a>
        </Reveal>
      )}
    </Section>
  );
}
