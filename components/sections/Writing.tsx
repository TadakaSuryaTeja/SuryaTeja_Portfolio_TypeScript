import { Icon } from '@/components/ui/Icon';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import { blogPosts, socialLinks } from '@/portfolio';

export default function Writing() {
  const hasPosts = blogPosts.length > 0;

  return (
    <Section id="writing">
      <SectionHeading
        eyebrow="Writing"
        title="Notes on building systems"
        subtitle="I write about AI/ML, MLOps, AWS, system design, and Python — distilling what I learn shipping software."
      />

      {hasPosts ? (
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, i) => (
            <Reveal key={post.title} delay={i * 0.06}>
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="glass glass-hover group flex h-full flex-col rounded-3xl p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="chip !text-accent">{post.tag}</span>
                  {post.readTime && (
                    <span className="text-xs text-ink-faint">
                      {post.readTime}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-base font-semibold text-ink">
                  {post.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                  {post.excerpt}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                  Read article
                  <Icon
                    icon="ph:arrow-right-bold"
                    className="transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal className="mt-12">
          <a
            href={socialLinks.medium}
            target="_blank"
            rel="noopener noreferrer"
            className="glass glass-hover group mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-4xl p-10 text-center sm:flex-row sm:text-left"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-fill-3 text-ink">
              <Icon icon="ph:medium-logo-fill" className="text-3xl" aria-hidden />
            </span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-ink">
                I publish on Medium
              </h3>
              <p className="mt-1 text-sm text-ink-muted">
                Articles on machine learning, automation, and cloud
                architecture.
              </p>
            </div>
            <span className="btn-ghost shrink-0">
              Read on Medium
              <Icon
                icon="ph:arrow-up-right-bold"
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </span>
          </a>
        </Reveal>
      )}
    </Section>
  );
}
