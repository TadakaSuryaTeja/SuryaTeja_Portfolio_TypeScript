/**
 * TECHNOLOGY TAXONOMY — the knowledge graph behind the site.
 *
 * Each technology knows which systems use it, which roles it appears in, and
 * which technologies sit next to it. That single relationship model powers
 * the capability graph, the technology drill-downs and command-palette search,
 * so those features stay consistent instead of drifting apart.
 *
 * `systems` values must be slugs in `content/systems.ts`; `experience` values
 * must match `company` in `portfolio.ts`. `npm run check:content` verifies both.
 */
import type { Technology } from '@/types/systems';

export const technologies: Technology[] = [
  /* ---------------------------------- AI ---------------------------------- */
  {
    id: 'agents',
    label: 'AI Agents',
    domain: 'ai',
    icon: 'ph:circles-three-bold',
    blurb:
      'Multi-agent orchestration in production: planning a ticket into steps, routing each to a model or a tool, and knowing when to hand back to a human.',
    systems: ['enterprise-ai-code-automation', 'mcp-tool-servers', 'agent-guardrails'],
    experience: ['Southwest Airlines (Qentelli)'],
    related: ['mcp', 'bedrock', 'rag', 'tool-calling'],
  },
  {
    id: 'mcp',
    label: 'MCP',
    domain: 'ai',
    icon: 'ph:plugs-connected-bold',
    blurb:
      'Custom Model Context Protocol servers exposing Jira, GitLab and Xray as typed tools, so agents call contracts instead of improvising API requests.',
    systems: ['mcp-tool-servers', 'enterprise-ai-code-automation'],
    experience: ['Southwest Airlines (Qentelli)'],
    related: ['agents', 'tool-calling', 'python'],
  },
  {
    id: 'rag',
    label: 'RAG',
    domain: 'ai',
    icon: 'ph:magnifying-glass-bold',
    blurb:
      'Retrieval-augmented generation over thousands of Confluence documents — ingestion, chunking, embeddings and retrieval tuned for internal engineering questions.',
    systems: ['confluence-rag-assistant', 'enterprise-ai-code-automation', 'llm-evaluation-harness'],
    experience: ['Southwest Airlines (Qentelli)'],
    related: ['embeddings', 'vector-search', 'bedrock', 'agents'],
  },
  {
    id: 'bedrock',
    label: 'AWS Bedrock',
    domain: 'ai',
    icon: 'logos:aws',
    blurb:
      'Claude, Llama and Titan integrated behind reasoning agents, with per-task model routing rather than one default model everywhere.',
    systems: ['enterprise-ai-code-automation', 'confluence-rag-assistant', 'model-routing'],
    experience: ['Southwest Airlines (Qentelli)'],
    related: ['llms', 'agents', 'rag', 'aws'],
  },
  {
    id: 'llms',
    label: 'LLMs',
    domain: 'ai',
    icon: 'ph:brain-bold',
    blurb:
      'Foundation models applied to code generation, ticket comprehension and documentation — selected per task on cost and quality.',
    systems: ['model-routing', 'enterprise-ai-code-automation'],
    experience: ['Southwest Airlines (Qentelli)'],
    related: ['bedrock', 'rag', 'evaluation'],
  },
  {
    id: 'tool-calling',
    label: 'Tool Calling',
    domain: 'ai',
    icon: 'ph:wrench-bold',
    blurb:
      'Structured, schema-validated tool invocation — the boundary that makes an agent’s blast radius knowable.',
    systems: ['mcp-tool-servers', 'enterprise-ai-code-automation'],
    experience: ['Southwest Airlines (Qentelli)'],
    related: ['mcp', 'agents'],
  },
  {
    id: 'embeddings',
    label: 'Embeddings',
    domain: 'ai',
    icon: 'ph:vector-three-bold',
    blurb: 'Chunk embedding for semantic retrieval over enterprise documentation.',
    systems: ['confluence-rag-assistant'],
    experience: ['Southwest Airlines (Qentelli)'],
    related: ['rag', 'vector-search'],
  },
  {
    id: 'vector-search',
    label: 'Vector Search',
    domain: 'ai',
    icon: 'ph:database-bold',
    blurb: 'Similarity retrieval over an indexed vector store, refreshed as source documentation changes.',
    systems: ['confluence-rag-assistant'],
    experience: ['Southwest Airlines (Qentelli)'],
    related: ['embeddings', 'rag', 'opensearch'],
  },
  {
    id: 'evaluation',
    label: 'LLM Evaluation',
    domain: 'ai',
    icon: 'ph:chart-line-up-bold',
    blurb:
      'Offline scoring of retrieval and generation quality. Actively in progress — the honest gap in the current stack.',
    systems: ['llm-evaluation-harness'],
    experience: [],
    related: ['rag', 'llms'],
  },
  {
    id: 'nlp',
    label: 'NLP',
    domain: 'ai',
    icon: 'ph:chat-text-bold',
    blurb:
      'Text extraction and classification — NLTK-based parsing for claims adjudication, and earlier applied-ML classification work.',
    systems: ['nlp-text-classification-service', 'personalized-cancer-diagnosis'],
    experience: ['SS&C Technologies'],
    related: ['python', 'embeddings'],
  },

  /* -------------------------------- Backend ------------------------------- */
  {
    id: 'python',
    label: 'Python',
    domain: 'backend',
    icon: 'logos:python',
    blurb: 'The primary language across all three roles for 7+ years — services, agents, pipelines and automation.',
    systems: [
      'enterprise-ai-code-automation',
      'mcp-tool-servers',
      'confluence-rag-assistant',
      'teradata-redshift-streaming-platform',
      'serverless-crud-api',
    ],
    experience: ['Southwest Airlines (Qentelli)', 'Smile Direct Club (Qentelli)', 'SS&C Technologies'],
    related: ['fastapi', 'django', 'apis'],
  },
  {
    id: 'fastapi',
    label: 'FastAPI',
    domain: 'backend',
    icon: 'simple-icons:fastapi',
    blurb: 'Backend services and automation workflows behind the AI platform.',
    systems: ['enterprise-ai-code-automation'],
    experience: ['Southwest Airlines (Qentelli)'],
    related: ['python', 'apis', 'microservices'],
  },
  {
    id: 'django',
    label: 'Django',
    domain: 'backend',
    icon: 'vscode-icons:file-type-django',
    blurb: 'Claims adjudication and health-insurance backends, plus earlier ML-serving applications.',
    systems: ['nlp-text-classification-service', 'world-countries-api'],
    experience: ['SS&C Technologies'],
    related: ['python', 'apis'],
  },
  {
    id: 'apis',
    label: 'REST APIs',
    domain: 'backend',
    icon: 'ph:plugs-connected-bold',
    blurb: 'Real-time API integrations across enterprise systems, plus webhook-driven automation.',
    systems: ['serverless-crud-api', 'world-countries-api', 'mcp-tool-servers'],
    experience: ['Southwest Airlines (Qentelli)', 'SS&C Technologies'],
    related: ['fastapi', 'microservices', 'api-gateway'],
  },
  {
    id: 'microservices',
    label: 'Microservices',
    domain: 'backend',
    icon: 'ph:squares-four-bold',
    blurb: 'Containerized, independently deployed service boundaries behind the platform work.',
    systems: ['enterprise-ai-code-automation'],
    experience: ['Southwest Airlines (Qentelli)'],
    related: ['docker', 'apis', 'ecs'],
  },
  {
    id: 'auth',
    label: 'Auth & Security',
    domain: 'backend',
    icon: 'ph:shield-check-bold',
    blurb: 'OAuth2, JWT, SSL and encryption for claims data; scoped credential handling for agent tools.',
    systems: ['mcp-tool-servers'],
    experience: ['SS&C Technologies'],
    related: ['apis', 'iam'],
  },

  /* --------------------------------- Data --------------------------------- */
  {
    id: 'kafka',
    label: 'Kafka',
    domain: 'data',
    icon: 'simple-icons:apachekafka',
    blurb: 'Confluent Kafka on AWS as the streaming backbone for real-time, event-driven processing.',
    systems: ['teradata-redshift-streaming-platform'],
    experience: ['Smile Direct Club (Qentelli)'],
    related: ['glue', 'redshift', 'lambda'],
  },
  {
    id: 'redshift',
    label: 'Redshift',
    domain: 'data',
    icon: 'logos:aws-redshift',
    blurb: 'Destination warehouse of a zero-data-loss Teradata migration, tuned for query performance and cost.',
    systems: ['teradata-redshift-streaming-platform'],
    experience: ['Smile Direct Club (Qentelli)'],
    related: ['glue', 'bigquery', 's3'],
  },
  {
    id: 'glue',
    label: 'AWS Glue',
    domain: 'data',
    icon: 'logos:aws-glue',
    blurb: 'Automated ETL into S3/Parquet with 95% test coverage, replacing manual transformation operations.',
    systems: ['teradata-redshift-streaming-platform'],
    experience: ['Smile Direct Club (Qentelli)'],
    related: ['s3', 'redshift', 'step-functions'],
  },
  {
    id: 'bigquery',
    label: 'BigQuery',
    domain: 'data',
    icon: 'logos:google-cloud',
    blurb: 'Warehouse modelling and query/cost optimization alongside Redshift.',
    systems: ['teradata-redshift-streaming-platform'],
    experience: ['Smile Direct Club (Qentelli)'],
    related: ['redshift'],
  },
  {
    id: 's3',
    label: 'S3 / Parquet',
    domain: 'data',
    icon: 'logos:aws-s3',
    blurb: 'Columnar landing zone that made the migration restartable and reprocessing cheap.',
    systems: ['teradata-redshift-streaming-platform'],
    experience: ['Smile Direct Club (Qentelli)', 'SS&C Technologies'],
    related: ['glue', 'redshift'],
  },
  {
    id: 'dynamodb',
    label: 'DynamoDB',
    domain: 'data',
    icon: 'logos:aws-dynamodb',
    blurb: 'Low-latency operational state alongside the analytical store.',
    systems: ['teradata-redshift-streaming-platform'],
    experience: ['Smile Direct Club (Qentelli)'],
    related: ['lambda', 's3'],
  },
  {
    id: 'opensearch',
    label: 'OpenSearch',
    domain: 'data',
    icon: 'logos:aws-open-search',
    blurb: 'Search and real-time observability pipelines across the data platform.',
    systems: ['teradata-redshift-streaming-platform'],
    experience: ['Smile Direct Club (Qentelli)'],
    related: ['vector-search', 'observability'],
  },

  /* --------------------------------- Cloud -------------------------------- */
  {
    id: 'aws',
    label: 'AWS',
    domain: 'cloud',
    icon: 'logos:aws',
    blurb: 'AWS Certified Solutions Architect – Associate, with production ownership across compute, data and AI services.',
    systems: [
      'enterprise-ai-code-automation',
      'teradata-redshift-streaming-platform',
      'aws-eks-iac',
      'serverless-crud-api',
    ],
    experience: ['Southwest Airlines (Qentelli)', 'Smile Direct Club (Qentelli)'],
    related: ['lambda', 'ecs', 'api-gateway', 'bedrock', 'step-functions'],
  },
  {
    id: 'lambda',
    label: 'Lambda',
    domain: 'cloud',
    icon: 'logos:aws-lambda',
    blurb: 'Serverless compute across automation and data workloads.',
    systems: ['serverless-crud-api', 'teradata-redshift-streaming-platform'],
    experience: ['Southwest Airlines (Qentelli)', 'Smile Direct Club (Qentelli)'],
    related: ['aws', 'api-gateway', 'dynamodb'],
  },
  {
    id: 'ecs',
    label: 'ECS / Fargate',
    domain: 'cloud',
    icon: 'logos:aws-ecs',
    blurb: 'Containerized service deployment for the platform work at Southwest.',
    systems: ['enterprise-ai-code-automation'],
    experience: ['Southwest Airlines (Qentelli)'],
    related: ['docker', 'aws', 'microservices'],
  },
  {
    id: 'api-gateway',
    label: 'API Gateway',
    domain: 'cloud',
    icon: 'logos:aws-api-gateway',
    blurb: 'Managed entry point in front of serverless backends.',
    systems: ['serverless-crud-api'],
    experience: ['Southwest Airlines (Qentelli)'],
    related: ['lambda', 'apis', 'aws'],
  },
  {
    id: 'step-functions',
    label: 'Step Functions',
    domain: 'cloud',
    icon: 'logos:aws-step-functions',
    blurb: 'Orchestrated multi-step data workflows so partial failures stay visible and retryable.',
    systems: ['teradata-redshift-streaming-platform'],
    experience: ['Smile Direct Club (Qentelli)'],
    related: ['glue', 'lambda', 'aws'],
  },
  {
    id: 'iam',
    label: 'IAM',
    domain: 'cloud',
    icon: 'logos:aws-iam',
    blurb: 'Scoped access control across services and, for agent tooling, across tool boundaries.',
    systems: ['enterprise-ai-code-automation'],
    experience: ['Southwest Airlines (Qentelli)'],
    related: ['aws', 'auth'],
  },

  /* ----------------------------- Infrastructure --------------------------- */
  {
    id: 'terraform',
    label: 'Terraform',
    domain: 'infra',
    icon: 'logos:terraform-icon',
    blurb: 'Manual infrastructure converted to IaC — environment setup time cut by 50%.',
    systems: ['teradata-redshift-streaming-platform', 'aws-eks-iac', 'enterprise-ai-code-automation'],
    experience: ['Southwest Airlines (Qentelli)', 'Smile Direct Club (Qentelli)'],
    related: ['kubernetes', 'aws', 'cicd'],
  },
  {
    id: 'kubernetes',
    label: 'Kubernetes',
    domain: 'infra',
    icon: 'logos:kubernetes',
    blurb: 'Container orchestration; EKS provisioned declaratively with Terraform and eksctl.',
    systems: ['aws-eks-iac'],
    experience: ['Southwest Airlines (Qentelli)'],
    related: ['docker', 'terraform'],
  },
  {
    id: 'docker',
    label: 'Docker',
    domain: 'infra',
    icon: 'logos:docker-icon',
    blurb: 'Containerized services and reproducible environments across every role.',
    systems: ['enterprise-ai-code-automation'],
    experience: ['Southwest Airlines (Qentelli)', 'SS&C Technologies'],
    related: ['kubernetes', 'cicd', 'ecs'],
  },
  {
    id: 'cicd',
    label: 'CI/CD',
    domain: 'infra',
    icon: 'ph:infinity-bold',
    blurb: 'GitLab, GitHub Actions and Jenkins pipelines with quality gates, including pipelines for data workloads.',
    systems: ['enterprise-ai-code-automation', 'teradata-redshift-streaming-platform'],
    experience: ['Southwest Airlines (Qentelli)', 'Smile Direct Club (Qentelli)', 'SS&C Technologies'],
    related: ['terraform', 'docker', 'observability'],
  },
  {
    id: 'observability',
    label: 'Observability',
    domain: 'infra',
    icon: 'logos:grafana',
    blurb:
      'Grafana, CloudWatch and DataDog — 30% fewer pipeline failures, and the traces that make agent runs debuggable.',
    systems: ['agent-guardrails', 'teradata-redshift-streaming-platform'],
    experience: ['Southwest Airlines (Qentelli)', 'Smile Direct Club (Qentelli)'],
    related: ['cicd', 'opensearch'],
  },
];

export const DOMAIN_META: Record<
  Technology['domain'],
  { label: string; accent: 'accent' | 'violet' | 'success'; icon: string; blurb: string }
> = {
  ai: {
    label: 'AI / GenAI',
    accent: 'violet',
    icon: 'ph:sparkle-bold',
    blurb: 'Production agentic systems, not API calls.',
  },
  backend: {
    label: 'Backend',
    accent: 'success',
    icon: 'ph:stack-bold',
    blurb: 'Services that hold up under enterprise load.',
  },
  data: {
    label: 'Data',
    accent: 'accent',
    icon: 'ph:database-bold',
    blurb: 'Batch and streaming at warehouse scale.',
  },
  cloud: {
    label: 'Cloud',
    accent: 'accent',
    icon: 'ph:cloud-bold',
    blurb: 'AWS-certified, production-operated.',
  },
  infra: {
    label: 'Infrastructure',
    accent: 'success',
    icon: 'ph:gear-six-bold',
    blurb: 'Everything as code, everything observed.',
  },
};

export function getTechnology(id: string) {
  return technologies.find((t) => t.id === id);
}

/** Resolve a free-text tech chip (e.g. "AWS Bedrock") to a taxonomy entry. */
export function matchTechnology(label: string) {
  const norm = label.toLowerCase().replace(/[^a-z0-9]/g, '');
  return technologies.find(
    (t) =>
      t.id.replace(/[^a-z0-9]/g, '') === norm ||
      t.label.toLowerCase().replace(/[^a-z0-9]/g, '') === norm
  );
}

export const technologiesByDomain = (domain: Technology['domain']) =>
  technologies.filter((t) => t.domain === domain);
