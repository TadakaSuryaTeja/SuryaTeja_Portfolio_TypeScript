/**
 * Notion CMS — server-side only.
 *
 * Deliberately dependency-free: it talks to the Notion REST API with `fetch`
 * rather than pulling in the SDK. Every call is wrapped so that a missing
 * token, a schema drift, a rate limit or a Notion outage degrades to the local
 * fallback content in `portfolio.ts` instead of failing the build or the page.
 *
 * NEVER import this from a client component — `NOTION_TOKEN` must not reach
 * the browser bundle. It is read from `process.env` at build/request time only.
 */
import type { BlogPostType } from '@/types/sections';

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

type NotionPage = {
  id: string;
  properties: Record<string, any>;
};

function token() {
  return process.env.NOTION_TOKEN;
}

/** Narrow a Notion property to plain text regardless of its property type. */
function text(prop: any): string {
  if (!prop) return '';
  switch (prop.type) {
    case 'title':
    case 'rich_text':
      return (prop[prop.type] ?? []).map((t: any) => t.plain_text).join('').trim();
    case 'select':
      return prop.select?.name ?? '';
    case 'url':
      return prop.url ?? '';
    case 'date':
      return prop.date?.start ?? '';
    case 'number':
      return prop.number != null ? String(prop.number) : '';
    default:
      return '';
  }
}

function bool(prop: any): boolean {
  return prop?.type === 'checkbox' ? Boolean(prop.checkbox) : false;
}

function list(prop: any): string[] {
  if (prop?.type === 'multi_select') return prop.multi_select.map((s: any) => s.name);
  return [];
}

async function queryDatabase(databaseId: string | undefined): Promise<NotionPage[]> {
  const key = token();
  if (!key || !databaseId) return [];

  try {
    const res = await fetch(`${NOTION_API}/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ page_size: 50 }),
    });
    if (!res.ok) {
      console.warn(`[notion] database query failed (${res.status}) — using fallback content`);
      return [];
    }
    const json = await res.json();
    return Array.isArray(json.results) ? (json.results as NotionPage[]) : [];
  } catch (err) {
    console.warn('[notion] unreachable — using fallback content', err);
    return [];
  }
}

/* --------------------------------- Articles ------------------------------- */
/**
 * Reads the Articles database. Only rows with `Published` checked are
 * returned, so drafts stay invisible — an article is never surfaced as
 * published unless it actually is.
 */
export async function getArticles(): Promise<BlogPostType[]> {
  const pages = await queryDatabase(process.env.NOTION_ARTICLES_DATABASE_ID);

  return pages
    .filter((p) => bool(p.properties.Published))
    .map((p) => ({
      title: text(p.properties.Title),
      excerpt: text(p.properties.Summary),
      tag: list(p.properties.Tags)[0] ?? 'Engineering',
      date: text(p.properties['Published Date']) || undefined,
      readTime: text(p.properties['Read Time']) || undefined,
      link: text(p.properties.URL) || `/insights/${text(p.properties.Slug)}`,
    }))
    .filter((a) => a.title && a.link);
}

/* ------------------------------- Case studies ----------------------------- */
export type NotionCaseStudy = {
  title: string;
  slug: string;
  category: string;
  problem: string;
  technologies: string[];
  github?: string;
  live?: string;
  featured: boolean;
};

export async function getNotionCaseStudies(): Promise<NotionCaseStudy[]> {
  const pages = await queryDatabase(process.env.NOTION_CASE_STUDIES_DATABASE_ID);

  return pages
    .filter((p) => text(p.properties.Status).toLowerCase() === 'published')
    .map((p) => ({
      title: text(p.properties.Title),
      slug: text(p.properties.Slug),
      category: text(p.properties.Category),
      problem: text(p.properties.Problem),
      technologies: list(p.properties.Technologies),
      github: text(p.properties['GitHub URL']) || undefined,
      live: text(p.properties['Live URL']) || undefined,
      featured: bool(p.properties.Featured),
    }))
    .filter((c) => c.title);
}

/* ---------------------------------- AI Lab -------------------------------- */
export type NotionAILabEntry = {
  experiment: string;
  description: string;
  technology: string[];
  status: string;
  github?: string;
  demo?: string;
};

export async function getNotionAILab(): Promise<NotionAILabEntry[]> {
  const pages = await queryDatabase(process.env.NOTION_AI_LAB_DATABASE_ID);

  return pages
    .filter((p) => bool(p.properties.Published))
    .map((p) => ({
      experiment: text(p.properties.Experiment),
      description: text(p.properties.Description),
      technology: list(p.properties.Technology),
      status: text(p.properties.Status) || 'Exploring',
      github: text(p.properties.GitHub) || undefined,
      demo: text(p.properties.Demo) || undefined,
    }))
    .filter((e) => e.experiment);
}

/** True when Notion is configured at all — used to label the content source. */
export const notionConfigured = () => Boolean(process.env.NOTION_TOKEN);
