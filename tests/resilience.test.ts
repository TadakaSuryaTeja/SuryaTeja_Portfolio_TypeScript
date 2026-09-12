/**
 * External-dependency failure tests.
 *
 * The site must survive Notion and GitHub being unreachable, misconfigured or
 * rate-limited. These assert the degradation path rather than the happy path.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('Notion returns an empty list when unconfigured', async () => {
  delete process.env.NOTION_TOKEN;
  delete process.env.NOTION_ARTICLES_DATABASE_ID;
  const { getArticles } = await import('../lib/cms/notion');
  assert.deepEqual(await getArticles(), []);
});

test('Notion returns an empty list when the token is rejected', async () => {
  process.env.NOTION_TOKEN = 'invalid_token_for_test';
  process.env.NOTION_ARTICLES_DATABASE_ID = '00000000000000000000000000000000';
  const { getArticles } = await import('../lib/cms/notion');
  const articles = await getArticles();
  assert.deepEqual(articles, [], 'a rejected token must degrade, not throw');
  delete process.env.NOTION_TOKEN;
  delete process.env.NOTION_ARTICLES_DATABASE_ID;
});

test('GitHub degrades to an empty list for an unknown user', async () => {
  const { getFeaturedRepos } = await import('../lib/cms/github');
  const repos = await getFeaturedRepos('this-user-should-not-exist-9x8y7z');
  assert.deepEqual(repos, [], 'missing repos must be skipped, not thrown');
});

test('local fallback content exists for every Notion-backed surface', async () => {
  const { blogPosts } = await import('../portfolio');
  assert.ok(blogPosts.length > 0, 'Insights would render empty if Notion is down');
});
