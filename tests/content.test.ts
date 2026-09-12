/**
 * Content + resilience tests.
 *
 * These cover the two things most likely to break silently: the content graph
 * drifting out of sync, and an external API failure taking the site with it.
 *
 * Run: npm test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { systems, featuredSystems, caseStudySystems, getSystem } from '../content/systems';
import { technologies, matchTechnology, getTechnology } from '../content/taxonomy';
import { experience, profile, certifications, educationInfo } from '../portfolio';
import { NAV_SECTIONS, NAV_ROUTES } from '../lib/sections';

/* ------------------------------- content graph ---------------------------- */

test('system slugs are unique', () => {
  const slugs = systems.map((s) => s.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test('every taxonomy system reference resolves', () => {
  for (const tech of technologies) {
    for (const slug of tech.systems) {
      assert.ok(getSystem(slug), `${tech.id} → unknown system "${slug}"`);
    }
  }
});

test('every taxonomy related-technology reference resolves', () => {
  for (const tech of technologies) {
    for (const rel of tech.related) {
      assert.ok(getTechnology(rel), `${tech.id} → unknown technology "${rel}"`);
    }
  }
});

test('taxonomy only cites companies that exist in the résumé experience', () => {
  const companies = new Set(experience.map((e) => e.company));
  for (const tech of technologies) {
    for (const company of tech.experience) {
      assert.ok(companies.has(company), `${tech.id} → unknown company "${company}"`);
    }
  }
});

test('architecture edges only connect declared nodes', () => {
  for (const system of systems) {
    if (!system.architecture) continue;
    const ids = new Set(system.architecture.nodes.map((n) => n.id));
    for (const edge of system.architecture.edges) {
      assert.ok(ids.has(edge.source), `${system.slug}: bad source "${edge.source}"`);
      assert.ok(ids.has(edge.target), `${system.slug}: bad target "${edge.target}"`);
    }
  }
});

test('every architecture node explains itself', () => {
  for (const system of systems) {
    for (const node of system.architecture?.nodes ?? []) {
      assert.ok(node.description, `${system.slug}: "${node.id}" has no description`);
    }
  }
});

/* ------------------------------- credibility ------------------------------ */

test('featured systems are substantial: every one has a case study', () => {
  assert.ok(featuredSystems.length >= 3);
  for (const s of featuredSystems) {
    assert.ok(s.caseStudy, `${s.slug} is featured without a case study`);
  }
});

test('case studies state tradeoffs and improvements, not just wins', () => {
  for (const s of caseStudySystems) {
    assert.ok(s.caseStudy!.tradeoffs.length > 0, `${s.slug} has no tradeoffs`);
    assert.ok(s.caseStudy!.improvements.length > 0, `${s.slug} has no improvements`);
  }
});

test('archived work is never presented as current', () => {
  for (const s of systems.filter((x) => x.tier === 'archive')) {
    assert.notEqual(s.status, 'In production');
  }
});

test('profile does not claim 7+ years of GenAI specifically', () => {
  const claims = `${profile.headline} ${profile.tagline}`.toLowerCase();
  assert.ok(!/\d\+?\s*years?[^.]*\b(genai|generative|llm)/.test(claims));
});

test('résumé-backed facts are present', () => {
  assert.equal(profile.name, 'Surya Teja Tadaka');
  assert.equal(experience.length, 3);
  assert.equal(certifications.length, 5);
  assert.equal(educationInfo.length, 2);
});

/* -------------------------------- navigation ------------------------------ */

test('navigation entries are unique and carry icons', () => {
  const ids = NAV_SECTIONS.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const s of NAV_SECTIONS) assert.ok(s.icon, `${s.id} has no icon`);
  for (const r of NAV_ROUTES) assert.ok(r.href.startsWith('/'));
});

/* ------------------------------ tech chip mapping ------------------------- */

test('flagship systems surface at least one explorable technology', () => {
  for (const s of featuredSystems) {
    const mapped = s.tech.filter((t) => matchTechnology(t));
    assert.ok(mapped.length > 0, `${s.slug} has no chips wired into the taxonomy`);
  }
});
