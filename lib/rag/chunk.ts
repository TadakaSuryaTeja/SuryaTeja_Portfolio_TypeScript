/**
 * Semantic chunker for the retrieval corpus.
 *
 * Chunking is by *meaning*, not by character count: one chunk per experience
 * entry, per system, per case-study section, per skill category, per
 * certification, per article. A fixed-width splitter would cut a résumé bullet
 * in half and let the model stitch two unrelated facts into one sentence —
 * which is exactly the failure mode this whole feature exists to avoid.
 *
 * Only entries that exceed the token budget are split further, and then on
 * paragraph boundaries with a one-sentence overlap so a split never orphans
 * the subject of the following sentence.
 *
 * This module is pure and dependency-free so the chunking rules can be tested
 * against a fixture without loading an embedding model.
 */
import type {
  AboutType,
  BlogPostType,
  CertificationType,
  ContactType,
  EducationType,
  ExperienceType,
  MetricType,
  OwnershipLayerType,
  ProfileType,
  SkillCategoryType,
} from '@/types/sections';
import type { System, Technology } from '@/types/systems';
import type { Chunk, ChunkSource } from './types';

/** ~300 tokens. Nothing longer is embedded — MiniLM truncates at 256 anyway. */
export const MAX_CHUNK_TOKENS = 300;

/**
 * Cheap token estimate. MiniLM's tokenizer is only available once the model is
 * loaded, and the chunker must be testable without it; ~4 characters per token
 * over-counts English prose slightly, which is the safe direction to err.
 */
export const estimateTokens = (text: string): number => Math.ceil(text.length / 4);

/* ------------------------------- corpus input ----------------------------- */

/** Facts pulled from `content/resume.mjs` that the site itself never renders. */
export type ResumeFacts = {
  name: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  education: { school: string; detail: string; date: string }[];
  certifications: string[];
};

/**
 * Every field is optional so a test can exercise one branch with a fixture,
 * and so a corpus source that is emptied out fails the emptiness check in
 * `scripts/build-embeddings.ts` rather than throwing here.
 */
export type CorpusInput = {
  profile?: ProfileType;
  recruiterBrief?: {
    coreAreas: string[];
    achievements: string[];
    interestedIn: string[];
  };
  about?: AboutType;
  metrics?: MetricType[];
  skillCategories?: SkillCategoryType[];
  ownershipLayers?: OwnershipLayerType[];
  experience?: ExperienceType[];
  educationInfo?: EducationType[];
  certifications?: CertificationType[];
  blogPosts?: BlogPostType[];
  contactInfo?: ContactType;
  systems?: System[];
  technologies?: Technology[];
  resume?: ResumeFacts;
};

/* --------------------------------- helpers -------------------------------- */

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);

/** Joins non-empty lines, collapsing the blanks an absent field would leave. */
const lines = (...parts: (string | false | null | undefined)[]): string =>
  parts.filter((p): p is string => Boolean(p && p.trim())).join('\n');

const bullets = (items: readonly string[] | undefined): string =>
  (items ?? []).map((item) => `- ${item}`).join('\n');

/**
 * Splits a paragraph-separated body that exceeds the budget, carrying the last
 * sentence of each part into the next so a pronoun never loses its referent.
 */
export function splitToBudget(text: string, maxTokens = MAX_CHUNK_TOKENS): string[] {
  if (estimateTokens(text) <= maxTokens) return [text];

  const blocks = text
    .split(/\n{2,}|\n(?=- )/)
    .map((b) => b.trim())
    .filter(Boolean);

  const parts: string[] = [];
  let current: string[] = [];

  /** Re-joins blocks, keeping a bullet run tight instead of double-spacing it. */
  const join = (blocks: string[]) =>
    blocks.reduce((acc, block, i) => {
      if (i === 0) return block;
      const consecutiveBullets = blocks[i - 1].startsWith('- ') && block.startsWith('- ');
      return `${acc}${consecutiveBullets ? '\n' : '\n\n'}${block}`;
    }, '');

  const flush = () => {
    if (!current.length) return;
    parts.push(join(current));
    current = [];
  };

  for (const block of blocks) {
    const candidate = [...current, block].join('\n\n');
    if (current.length && estimateTokens(candidate) > maxTokens) {
      const carry = lastSentence(current[current.length - 1]);
      flush();
      if (carry) current.push(carry);
    }
    current.push(block);
  }
  flush();

  // A single block over budget cannot be split on a boundary that does not
  // exist; hand it back whole and let the build script fail loudly on it.
  return parts.length ? parts : [text];
}

function lastSentence(block: string): string {
  const sentences = block.match(/[^.!?]+[.!?]+/g);
  return sentences?.length ? sentences[sentences.length - 1].trim() : '';
}

type ChunkSeed = {
  idBase: string;
  source: ChunkSource;
  section: string;
  title: string;
  url: string;
  dateRange?: string;
  text: string;
};

/** Applies the token budget and stamps final ids, so every builder shares it. */
function emit(seed: ChunkSeed): Chunk[] {
  const parts = splitToBudget(seed.text);
  return parts.map((text, i) => ({
    id: parts.length > 1 ? `${seed.idBase}#${i + 1}` : seed.idBase,
    text: text.trim(),
    source: seed.source,
    section: seed.section,
    title: parts.length > 1 ? `${seed.title} (${i + 1}/${parts.length})` : seed.title,
    url: seed.url,
    ...(seed.dateRange ? { dateRange: seed.dateRange } : {}),
  }));
}

/* -------------------------------- builders -------------------------------- */

function portfolioChunks(input: CorpusInput): Chunk[] {
  const out: Chunk[] = [];
  const { profile, recruiterBrief, about, metrics, skillCategories, ownershipLayers } = input;

  if (profile) {
    out.push(
      ...emit({
        idBase: 'portfolio:profile',
        source: 'portfolio',
        section: 'profile',
        title: 'Who Surya Teja Tadaka is',
        url: '/',
        text: lines(
          `${profile.name} — ${profile.headline}.`,
          profile.tagline,
          `Based in ${profile.location}.`,
          `Experience: ${profile.yearsExperience} years.`,
          `Currently: ${profile.availability}.`,
          `Focus areas: ${profile.roles.join(', ')}.`,
        ),
      }),
    );
  }

  if (recruiterBrief) {
    out.push(
      ...emit({
        idBase: 'portfolio:recruiter-brief',
        source: 'portfolio',
        section: 'recruiter-brief',
        title: 'Recruiter brief',
        url: '/',
        text: lines(
          `Core areas: ${recruiterBrief.coreAreas.join(', ')}.`,
          'Headline achievements:',
          bullets(recruiterBrief.achievements),
          `Interested in: ${recruiterBrief.interestedIn.join(', ')}.`,
        ),
      }),
    );
  }

  if (about) {
    out.push(
      ...emit({
        idBase: 'portfolio:about',
        source: 'portfolio',
        section: 'about',
        title: 'About',
        url: '/#about',
        text: lines(
          about.paragraphs.join('\n\n'),
          about.highlights.map((h) => `${h.label}: ${h.value}`).join('\n'),
          `Interests: ${about.interests.join(', ')}.`,
        ),
      }),
    );
  }

  if (metrics?.length) {
    out.push(
      ...emit({
        idBase: 'portfolio:metrics',
        source: 'portfolio',
        section: 'metrics',
        title: 'Measured outcomes',
        url: '/',
        text: lines(
          'Outcomes claimed on the résumé, verbatim:',
          bullets(metrics.map((m) => `${m.value} — ${m.label} (${m.sublabel}).`)),
        ),
      }),
    );
  }

  for (const category of skillCategories ?? []) {
    out.push(
      ...emit({
        idBase: `portfolio:skills:${slugify(category.title)}`,
        source: 'portfolio',
        section: 'skills',
        title: `Skills — ${category.title}`,
        url: '/#skills',
        text: lines(
          `${category.title}: ${category.description}`,
          `Technologies: ${category.skills.map((s) => s.name).join(', ')}.`,
        ),
      }),
    );
  }

  for (const layer of ownershipLayers ?? []) {
    out.push(
      ...emit({
        idBase: `portfolio:ownership:${slugify(layer.layer)}`,
        source: 'portfolio',
        section: 'ownership',
        title: `Scope — ${layer.layer}`,
        url: '/#ownership',
        text: lines(
          `${layer.layer} — a layer Surya can own end-to-end.`,
          layer.summary,
          `Covers: ${layer.items.join(', ')}.`,
        ),
      }),
    );
  }

  for (const role of input.experience ?? []) {
    out.push(
      ...emit({
        idBase: `portfolio:experience:${slugify(role.company)}`,
        source: 'portfolio',
        section: 'experience',
        title: `${role.role} — ${role.company}`,
        url: '/#experience',
        dateRange: role.date,
        text: lines(
          `${role.role} at ${role.company}${role.location ? `, ${role.location}` : ''} (${role.date}).`,
          typeof role.summary === 'string' ? role.summary : undefined,
          bullets(role.bullets),
          `Technologies used: ${role.tech.join(', ')}.`,
          role.metrics?.length
            ? `Outcomes: ${role.metrics.map((m) => `${m.value} ${m.label}`).join('; ')}.`
            : undefined,
        ),
      }),
    );
  }

  if (input.educationInfo?.length) {
    out.push(
      ...emit({
        idBase: 'portfolio:education',
        source: 'portfolio',
        section: 'education',
        title: 'Education',
        url: '/#about',
        text: lines(
          'Education:',
          bullets(
            input.educationInfo.map((e) => `${e.subHeader}, ${e.schoolName} — ${e.duration}.`),
          ),
        ),
      }),
    );
  }

  for (const cert of input.certifications ?? []) {
    out.push(
      ...emit({
        idBase: `portfolio:certification:${slugify(cert.certificate)}`,
        source: 'portfolio',
        section: 'certifications',
        title: cert.certificate,
        url: '/#certifications',
        dateRange: cert.year,
        text: lines(
          `Certification: ${cert.certificate}, issued by ${cert.issuedby}.`,
          `Category: ${cert.category}.`,
          cert.year ? `Year: ${cert.year}.` : undefined,
        ),
      }),
    );
  }

  for (const post of input.blogPosts ?? []) {
    out.push(
      ...emit({
        idBase: `portfolio:article:${slugify(post.title)}`,
        source: 'portfolio',
        section: 'writing',
        title: post.title,
        url: '/insights',
        dateRange: post.date,
        text: lines(
          `Article: "${post.title}" (${post.tag}${post.date ? `, published ${post.date}` : ''}).`,
          post.excerpt,
        ),
      }),
    );
  }

  if (input.contactInfo) {
    out.push(
      ...emit({
        idBase: 'portfolio:contact',
        source: 'portfolio',
        section: 'contact',
        title: 'Contact',
        url: '/#contact',
        text: lines(
          input.contactInfo.title,
          input.contactInfo.subtitle,
          input.contactInfo.email ? `Email: ${input.contactInfo.email}.` : undefined,
        ),
      }),
    );
  }

  return out;
}

/**
 * Systems get one overview chunk plus one chunk per case-study dimension. The
 * split is deliberate: "how did the platform work" and "what tradeoffs did he
 * accept" are different questions and should retrieve independently.
 */
function systemChunks(systems: System[]): Chunk[] {
  const out: Chunk[] = [];

  for (const system of systems) {
    const url = system.caseStudy ? `/work/${system.slug}` : '/#work';

    out.push(
      ...emit({
        idBase: `systems:${system.slug}:overview`,
        source: 'systems',
        section: 'system',
        title: system.name,
        url,
        dateRange: system.period,
        text: lines(
          `${system.name} — ${system.systemType} (${system.category}, ${system.status}).`,
          `Built at: ${system.origin}${system.period ? ` (${system.period})` : ''}.`,
          `Problem: ${system.problem}`,
          system.summary,
          'His contribution:',
          bullets(system.contribution),
          `Technologies: ${system.tech.join(', ')}.`,
          system.metrics?.length
            ? `Outcomes: ${system.metrics.map((m) => `${m.value} ${m.label}`).join('; ')}.`
            : undefined,
        ),
      }),
    );

    const study = system.caseStudy;
    if (!study) continue;

    const sections: { key: string; title: string; text: string }[] = [
      { key: 'context', title: 'context', text: study.context },
      { key: 'flow', title: 'how it works', text: bullets(study.systemFlow) },
      {
        key: 'decisions',
        title: 'technical decisions',
        text: study.technicalDecisions
          .map((d) => `- Decision: ${d.decision}\n  Why: ${d.rationale}`)
          .join('\n'),
      },
      {
        key: 'ai-architecture',
        title: 'AI architecture',
        text: bullets(study.aiArchitecture),
      },
      {
        key: 'data-architecture',
        title: 'data architecture',
        text: bullets(study.dataArchitecture),
      },
      {
        key: 'infrastructure',
        title: 'infrastructure',
        text: bullets(study.infrastructure),
      },
      { key: 'security', title: 'security', text: bullets(study.security) },
      {
        key: 'reliability',
        title: 'reliability',
        text: bullets(study.reliability),
      },
      {
        key: 'challenges',
        title: 'challenges',
        text: bullets(study.challenges),
      },
      {
        key: 'tradeoffs',
        title: 'tradeoffs',
        text: study.tradeoffs
          .map((t) => `- Chose ${t.chose} over ${t.over}, because ${t.because}`)
          .join('\n'),
      },
      { key: 'outcome', title: 'outcome', text: bullets(study.outcome) },
      {
        key: 'improvements',
        title: 'what he would improve',
        text: bullets(study.improvements),
      },
    ];

    for (const section of sections) {
      if (!section.text.trim()) continue;
      out.push(
        ...emit({
          idBase: `work:${system.slug}:${section.key}`,
          source: 'work',
          section: 'case-study',
          title: `${system.name} — ${section.title}`,
          url,
          dateRange: system.period,
          text: lines(`${system.name} — ${section.title}:`, section.text),
        }),
      );
    }

    if (system.architecture) {
      out.push(
        ...emit({
          idBase: `work:${system.slug}:architecture`,
          source: 'work',
          section: 'architecture',
          title: `${system.name} — architecture`,
          url,
          dateRange: system.period,
          text: lines(
            `${system.name} architecture: ${system.architecture.caption}`,
            bullets(
              system.architecture.nodes
                .filter((n) => n.description)
                .map((n) => `${n.label}: ${n.description}`),
            ),
          ),
        }),
      );
    }
  }

  return out;
}

function taxonomyChunks(technologies: Technology[], systems: System[]): Chunk[] {
  const names = new Map(systems.map((s) => [s.slug, s.name]));

  return technologies.flatMap((tech) =>
    emit({
      idBase: `taxonomy:${tech.id}`,
      source: 'taxonomy',
      section: 'technology',
      title: `Technology — ${tech.label}`,
      url: '/#skills',
      text: lines(
        `${tech.label} (${tech.domain}): ${tech.blurb}`,
        tech.systems.length
          ? `Used in: ${tech.systems.map((s) => names.get(s) ?? s).join(', ')}.`
          : undefined,
        tech.experience.length ? `Applied at: ${tech.experience.join(', ')}.` : undefined,
      ),
    }),
  );
}

function resumeChunks(resume: ResumeFacts): Chunk[] {
  return emit({
    idBase: 'resume:facts',
    source: 'resume',
    section: 'resume',
    title: 'Résumé facts',
    url: '/resume',
    text: lines(
      `${resume.name} — ${resume.location}.`,
      `Email: ${resume.email}. Phone: ${resume.phone}. Website: ${resume.website}.`,
      'Education:',
      bullets(resume.education.map((e) => `${e.detail}, ${e.school} — ${e.date}.`)),
      'Certifications:',
      bullets(resume.certifications),
    ),
  });
}

/* ---------------------------------- entry --------------------------------- */

/**
 * Builds the full corpus. Ids are stable and unique; a duplicate means two
 * content entries collide on slug, which is a content bug worth surfacing.
 */
export function buildChunks(input: CorpusInput): Chunk[] {
  const chunks = [
    ...portfolioChunks(input),
    ...systemChunks(input.systems ?? []),
    ...taxonomyChunks(input.technologies ?? [], input.systems ?? []),
    ...(input.resume ? resumeChunks(input.resume) : []),
  ].filter((chunk) => chunk.text.trim().length > 0);

  const seen = new Set<string>();
  for (const chunk of chunks) {
    if (seen.has(chunk.id)) throw new Error(`Duplicate chunk id "${chunk.id}" — colliding slugs?`);
    seen.add(chunk.id);
  }

  return chunks;
}
