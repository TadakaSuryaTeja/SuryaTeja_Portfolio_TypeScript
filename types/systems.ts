/**
 * The system + knowledge-graph content model.
 *
 * A "system" is a thing that was built. Systems are tiered so that recent,
 * substantial work dominates the site while older work stays reachable rather
 * than deleted. Case-study fields are optional: a system only gets a
 * `/work/[slug]` page when there is real depth to put on it.
 */

export type SystemCategory =
  | 'Agentic AI'
  | 'Generative AI'
  | 'Data Platforms'
  | 'Cloud Platforms'
  | 'Developer Tools'
  | 'Product Engineering';

/**
 * featured = flagship production systems (these dominate the page)
 * lab      = current experiments with emerging AI technology
 * archive  = earlier legitimate work, kept for provenance
 */
export type SystemTier = 'featured' | 'lab' | 'archive';

export type SystemStatus =
  | 'In production'
  | 'Shipped'
  | 'Prototype'
  | 'Exploring'
  | 'Archived';

/* ------------------------- Architecture visualizer ------------------------ */

export type ArchitectureCategory = 'user' | 'ai' | 'backend' | 'data' | 'cloud' | 'infra';

export type ArchitectureNode = {
  id: string;
  label: string;
  category: ArchitectureCategory;
  icon?: string;
  /** Shown in the side panel on hover/focus — why this component exists. */
  description?: string;
  /** Which layer row the node sits on (0 = top). */
  row: number;
};

export type ArchitectureEdge = {
  source: string;
  target: string;
  label?: string;
};

export type ArchitectureSpec = {
  caption: string;
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
};

/* --------------------------------- Systems -------------------------------- */

export type CaseStudyContent = {
  /** Why the problem mattered to the business, not just to engineering. */
  context: string;
  systemFlow: string[];
  technicalDecisions: { decision: string; rationale: string }[];
  aiArchitecture?: string[];
  dataArchitecture?: string[];
  infrastructure?: string[];
  security?: string[];
  reliability?: string[];
  challenges: string[];
  tradeoffs: { chose: string; over: string; because: string }[];
  outcome: string[];
  /** Engineering maturity signal — what a second pass would change. */
  improvements: string[];
};

export type System = {
  slug: string;
  name: string;
  category: SystemCategory;
  tier: SystemTier;
  status: SystemStatus;
  /** Where it was built — an employer, or "Personal" for public work. */
  origin: string;
  period?: string;
  /** One line: the engineering problem. */
  problem: string;
  /** What kind of system this is, e.g. "Multi-agent automation platform". */
  systemType: string;
  summary: string;
  /** What *I* did, specifically. */
  contribution: string[];
  tech: string[];
  metrics?: { value: string; label: string }[];
  architecture?: ArchitectureSpec;
  caseStudy?: CaseStudyContent;
  github?: string;
  demo?: string;
};

/* ------------------------------ Knowledge graph --------------------------- */

export type TechnologyDomain = 'ai' | 'backend' | 'data' | 'cloud' | 'infra';

export type Technology = {
  id: string;
  label: string;
  domain: TechnologyDomain;
  icon: string;
  /** One sentence: what it is and how I've used it. */
  blurb: string;
  /** Slugs of systems that use it. */
  systems: string[];
  /** Company names (must match `experience[].company`). */
  experience: string[];
  /** Related technology ids — powers lateral exploration. */
  related: string[];
};
