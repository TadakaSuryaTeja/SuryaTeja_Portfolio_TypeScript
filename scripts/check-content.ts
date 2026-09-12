/**
 * Content consistency checker.
 *
 * The portfolio, the résumé and the knowledge graph have to agree. This
 * catches the drift that creeps in when one of them is edited alone:
 * dangling system slugs, taxonomy entries pointing at companies that do not
 * exist, systems claiming technologies the graph has never heard of, and
 * résumé facts that no longer match the site.
 *
 * Run: npm run check:content
 */
import { systems, caseStudySystems } from '../content/systems';
import { technologies, matchTechnology } from '../content/taxonomy';
import { experience, educationInfo, certifications, profile } from '../portfolio';
import { contact, education, certifications as resumeCerts, experience as resumeExperience } from '../content/resume.mjs';

const errors: string[] = [];
const warnings: string[] = [];

const fail = (m: string) => errors.push(m);
const warn = (m: string) => warnings.push(m);

/* ------------------------- systems <-> taxonomy -------------------------- */
const slugs = new Set(systems.map((s) => s.slug));
const companies = new Set(experience.map((e) => e.company));

if (slugs.size !== systems.length) fail('Duplicate system slugs found.');

for (const tech of technologies) {
  for (const slug of tech.systems) {
    if (!slugs.has(slug)) fail(`taxonomy "${tech.id}" references unknown system slug "${slug}".`);
  }
  for (const company of tech.experience) {
    if (!companies.has(company)) {
      fail(`taxonomy "${tech.id}" references unknown company "${company}".`);
    }
  }
  for (const rel of tech.related) {
    if (!technologies.some((t) => t.id === rel)) {
      fail(`taxonomy "${tech.id}" references unknown related technology "${rel}".`);
    }
  }
}

/* --------------------------- architecture graphs -------------------------- */
for (const system of systems) {
  if (!system.architecture) continue;
  const ids = new Set(system.architecture.nodes.map((n) => n.id));
  for (const edge of system.architecture.edges) {
    if (!ids.has(edge.source)) fail(`"${system.slug}" edge source "${edge.source}" is not a node.`);
    if (!ids.has(edge.target)) fail(`"${system.slug}" edge target "${edge.target}" is not a node.`);
  }
}

/* ----------------------- unmapped technology chips ------------------------ */
const unmapped = new Set<string>();
for (const system of systems) {
  for (const t of system.tech) if (!matchTechnology(t)) unmapped.add(t);
}
if (unmapped.size) {
  warn(`Tech chips with no taxonomy entry (they render, but are not explorable): ${[...unmapped].join(', ')}`);
}

/* --------------------------- résumé <-> portfolio ------------------------- */
const resumeJobs = resumeExperience('ai');
if (resumeJobs.length !== experience.length) {
  fail(`Résumé lists ${resumeJobs.length} roles, portfolio lists ${experience.length}.`);
}
for (const job of resumeJobs) {
  const match = experience.find((e) => e.company === job.company);
  if (!match) {
    fail(`Résumé company "${job.company}" has no matching portfolio experience entry.`);
    continue;
  }
  if (match.role !== job.title) {
    fail(`Title mismatch for ${job.company}: résumé "${job.title}" vs portfolio "${match.role}".`);
  }
  const normalise = (d: string) => d.replace(/[–—-]/g, '-').replace(/\s+/g, ' ').trim().toLowerCase();
  if (normalise(match.date) !== normalise(job.date)) {
    fail(`Date mismatch for ${job.company}: résumé "${job.date}" vs portfolio "${match.date}".`);
  }
}

if (resumeCerts.length !== certifications.length) {
  fail(`Résumé lists ${resumeCerts.length} certifications, portfolio lists ${certifications.length}.`);
}
if (education.length !== educationInfo.length) {
  fail(`Résumé lists ${education.length} education entries, portfolio lists ${educationInfo.length}.`);
}
for (const e of education) {
  if (!educationInfo.some((p) => p.schoolName === e.school)) {
    fail(`Résumé school "${e.school}" missing from portfolio education.`);
  }
}
if (contact.name !== profile.name) {
  fail(`Name mismatch: résumé "${contact.name}" vs portfolio "${profile.name}".`);
}

/* --------------------------------- report -------------------------------- */
for (const w of warnings) console.warn(`  ! ${w}`);
for (const e of errors) console.error(`  ✗ ${e}`);

if (errors.length) {
  console.error(`\n✗ ${errors.length} consistency error(s).`);
  process.exit(1);
}
console.log(
  `✓ Content consistent — ${systems.length} systems (${caseStudySystems.length} with case studies), ` +
    `${technologies.length} technologies, ${experience.length} roles cross-checked against the résumé.`
);
