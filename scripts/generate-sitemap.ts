/**
 * Regenerates public/sitemap.xml from the routes that actually exist,
 * so a new case study can never be missing from it. Run: npm run gen:sitemap
 */
import { writeFileSync } from 'node:fs';
import { caseStudySystems } from '../content/systems';
import { seoData } from '../portfolio';

const base = (seoData.url ?? '').replace(/\/$/, '');
const today = new Date().toISOString().slice(0, 10);

const routes: { path: string; priority: string; changefreq: string }[] = [
  { path: '/', priority: '1.0', changefreq: 'monthly' },
  { path: '/resume', priority: '0.9', changefreq: 'monthly' },
  { path: '/ai-lab', priority: '0.8', changefreq: 'monthly' },
  { path: '/insights', priority: '0.7', changefreq: 'weekly' },
  ...caseStudySystems.map((s) => ({
    path: `/work/${s.slug}`,
    priority: '0.9',
    changefreq: 'monthly',
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${base}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

writeFileSync('public/sitemap.xml', xml, 'utf8');
console.log(`✓ sitemap.xml — ${routes.length} routes`);
