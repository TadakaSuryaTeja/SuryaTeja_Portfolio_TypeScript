import type { GetStaticProps } from 'next';
import Head from 'next/head';
import { Icon } from '@/components/ui/Icon';
import PageShell from '@/components/ui/PageShell';
import PageHeader from '@/components/ui/PageHeader';
import Reveal from '@/components/ui/Reveal';
import { getArticles } from '@/lib/cms/notion';
import { blogPosts, seoData, profile, socialLinks } from '@/portfolio';
import type { BlogPostType } from '@/types/sections';

type Props = { articles: BlogPostType[]; source: 'notion' | 'local' };

/**
 * Insights. Articles come from Notion when it is configured, and from the
 * local fallback otherwise — the page renders either way.
 *
 * Planned topics are listed explicitly as *planned*. Nothing is presented as
 * published before it exists.
 */
const PLANNED = [
  'Designing production RAG systems',
  'MCP architecture for enterprise AI',
  'How I think about agent reliability',
  'RAG vs agentic retrieval',
  'Human approval in agent workflows',
  'AWS architecture for enterprise GenAI',
  'LLM evaluation in production',
  'Securing MCP tool execution',
];

export default function InsightsPage({ articles }: Props) {
  const base = (seoData.url ?? '').replace(/\/$/, '');
  const description =
    'Notes on agentic architecture, retrieval, AWS and the engineering underneath production AI systems.';

  return (
    <>
      <Head>
        <title>{`Insights — ${profile.name}`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${base}/insights`} />
        <meta property="og:title" content={`Insights — ${profile.name}`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${base}/insights`} />
        <meta
          property="og:image"
          content={`${base}/api/og?title=${encodeURIComponent('Insights')}&subtitle=${encodeURIComponent('Agentic architecture · Retrieval · AWS')}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <PageShell>
        <PageHeader
          eyebrow="Insights"
          title="Writing about systems, not tools"
          subtitle={description}
        />

        <section className="container-px py-16 sm:py-20">
          {articles.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((post, i) => (
                <Reveal key={post.title} delay={i * 0.05} className="h-full">
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass glass-hover group flex h-full flex-col rounded-3xl p-6"
                  >
                    <div className="flex items-center justify-between">
                      <span className="chip !text-accent">{post.tag}</span>
                      {post.readTime && (
                        <span className="text-xs text-ink-faint">{post.readTime}</span>
                      )}
                    </div>
                    <h2 className="mt-4 text-base font-semibold text-ink">{post.title}</h2>
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
            <p className="text-center text-sm text-ink-muted">
              No published articles yet.
            </p>
          )}

          {/* Planned, and labelled as planned. */}
          <div className="mx-auto mt-16 max-w-3xl rounded-3xl border border-line bg-fill-1 p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
              <Icon icon="ph:notepad-bold" className="text-lg text-accent" aria-hidden />
              In the writing queue
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Drafts in progress, listed so the topics are visible — these are not
              published yet, and none of them link anywhere until they are.
            </p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2" role="list">
              {PLANNED.map((topic) => (
                <li
                  key={topic}
                  className="flex items-start gap-2 text-sm leading-relaxed text-ink-muted"
                >
                  <Icon
                    icon="ph:circle-dashed-bold"
                    className="mt-0.5 shrink-0 text-xs text-ink-faint"
                    aria-hidden
                  />
                  {topic}
                </li>
              ))}
            </ul>
            <a
              className="btn-ghost mt-6 !text-xs"
              href={socialLinks.medium}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Icon icon="ph:medium-logo-fill" aria-hidden />
              Follow on Medium
            </a>
          </div>
        </section>
      </PageShell>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const fromNotion = await getArticles();
  return {
    props: {
      articles: fromNotion.length > 0 ? fromNotion : blogPosts,
      source: fromNotion.length > 0 ? 'notion' : 'local',
    },
    revalidate: 3600,
  };
};
