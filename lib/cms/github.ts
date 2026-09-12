/**
 * GitHub proof-of-work — server-side only.
 *
 * Works unauthenticated (60 req/hr per IP, plenty at build time). Set
 * `GITHUB_TOKEN` to raise the limit; it is never exposed to the browser.
 * Any failure (rate limit, outage, renamed repo) returns an empty list and the
 * UI falls back to the curated repositories in `portfolio.ts`.
 */
export type GitHubRepo = {
  name: string;
  description: string;
  url: string;
  language: string;
  stars: number;
  forks: number;
  updatedAt: string;
  topics: string[];
};

/** Curated — quality over vanity. Only these repos are surfaced. */
const FEATURED_REPOS = [
  'BroadcomInstaller2021',
  'aws_eks',
  'sample_CRUD_in_AWS',
  'nlp_webapp',
  'PersonalizedCancerDiagnosis',
  'API_django',
];

function headers(): HeadersInit {
  const h: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'surya-teja-portfolio',
  };
  if (process.env.GITHUB_TOKEN) {
    (h as Record<string, string>).Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return h;
}

export async function getFeaturedRepos(user: string): Promise<GitHubRepo[]> {
  const results = await Promise.all(
    FEATURED_REPOS.map(async (repo) => {
      try {
        const res = await fetch(`https://api.github.com/repos/${user}/${repo}`, {
          headers: headers(),
        });
        if (!res.ok) {
          console.warn(`[github] ${repo} unavailable (${res.status}) — skipping`);
          return null;
        }
        const r = await res.json();
        return {
          name: r.name,
          description: r.description ?? '',
          url: r.html_url,
          language: r.language ?? '',
          stars: r.stargazers_count ?? 0,
          forks: r.forks_count ?? 0,
          updatedAt: r.pushed_at ?? '',
          topics: r.topics ?? [],
        } as GitHubRepo;
      } catch (err) {
        console.warn(`[github] ${repo} fetch failed — skipping`, err);
        return null;
      }
    })
  );

  return results
    .filter((r): r is GitHubRepo => r !== null)
    .sort((a, b) => b.stars - a.stars);
}
