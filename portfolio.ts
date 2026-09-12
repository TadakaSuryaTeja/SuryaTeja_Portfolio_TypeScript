/**
 * SINGLE SOURCE OF TRUTH
 * ----------------------
 * Every fact rendered anywhere on this site comes from this file.
 * Employers, official titles, dates, education and certifications are copied
 * verbatim from the source résumé kept at `resume-src/original/` and must
 * never be embellished. Wording, ordering and emphasis are editorial; facts
 * are not. When the résumé changes, change this file — nothing else.
 */
import type {
  ProfileType,
  SocialLinksType,
  MetricType,
  AboutType,
  TerminalLineType,
  SkillCategoryType,
  ExperienceType,
  EducationType,
  ProjectType,
  CaseStudyType,
  CertificationType,
  TestimonialType,
  BlogPostType,
  ContactType,
  MarqueeItemType,
  SEODataType,
  OwnershipLayerType,
  CapabilityDomainType,
  AILabEntryType,
} from './types/sections';

/* ----------------------------- HERO / PROFILE ----------------------------- */
export const profile: ProfileType = {
  name: 'Surya Teja Tadaka',
  initials: 'ST',
  headline:
    'Technical Lead · Enterprise AI & Agentic Systems · GenAI • RAG • MCP • Python • AWS',
  roles: [
    'AI Agents',
    'Enterprise RAG',
    'MCP Integrations',
    'AI Platforms',
    'Cloud-Native Systems',
  ],
  tagline:
    'I build production AI systems that connect models, data, tools and infrastructure — multi-agent orchestration over MCP, RAG over enterprise knowledge, and the Python/AWS platforms underneath them.',
  location: 'Dallas, Texas',
  availability: 'Open to Staff / Principal AI & GenAI engineering roles',
  yearsExperience: '7+',
  resumeLink: '/resume/Surya_Teja_Tadaka_AI_Engineer_Resume.pdf',
  // Drop a square, professional headshot at public/profile.png and set this to
  // '/profile.png'. While empty, the hero shows a clean gradient-initials card.
  photo: '',
};

export const openSource = {
  githubUserName: 'TadakaSuryaTeja',
};

/** Résumé variants surfaced in the UI and the command palette. */
export const resumes = [
  {
    label: 'AI / GenAI Engineer résumé',
    description: 'Targeted at Staff / Principal AI, GenAI and agentic-systems roles.',
    href: '/resume/Surya_Teja_Tadaka_AI_Engineer_Resume.pdf',
    primary: true,
  },
  {
    label: 'Master résumé',
    description: 'Full engineering history — AI, backend, data and cloud.',
    href: '/resume/Surya_Teja_Tadaka_Resume.pdf',
    primary: false,
  },
];

/* --------------------------------- SOCIALS -------------------------------- */
export const socialLinks: SocialLinksType = {
  url: 'https://surya-teja-tadaka.vercel.app/',
  email: 'suryateja233@gmail.com',
  linkedin: 'https://www.linkedin.com/in/surya-teja-tadaka-36ba8814a/',
  github: 'https://github.com/TadakaSuryaTeja',
  medium: 'https://medium.com/@suryateja233',
  kaggle: 'https://www.kaggle.com/tadakasuryateja',
  linktr: 'https://linktr.ee/suryatejatadaka',
};

/* --------------------------------- METRICS -------------------------------- */
/* Every number below appears verbatim on the résumé. Nothing is extrapolated. */
export const metrics: MetricType[] = [
  {
    value: '7+',
    label: 'Years Engineering',
    sublabel: 'Backend · data · cloud · AI',
    accent: 'accent',
  },
  {
    value: '$100K',
    label: 'Annual Cloud Cost Cut',
    sublabel: 'Workflow automation & optimization',
    accent: 'success',
  },
  {
    value: '95%',
    label: 'ETL Test Coverage',
    sublabel: 'Automated pipeline verification',
    accent: 'violet',
  },
  {
    value: '50%',
    label: 'Faster Env Setup',
    sublabel: 'Terraform / YAML IaC migration',
    accent: 'accent',
  },
];

/* ---------------------------------- ABOUT --------------------------------- */
export const about: AboutType = {
  paragraphs: [
    "I'm a Technical Lead with 7+ years of software, data and cloud engineering, now specialized in production Generative AI. At Southwest Airlines I designed and led an end-to-end AI automation platform on AWS Bedrock and Amazon Q Business — multi-agent orchestration that turns a Jira ticket into a branch, generated code and an open GitLab merge request.",
    'The agent layer talks to Jira, GitLab and Xray through custom MCP servers, so tool-calling is structured and auditable rather than glued together with prompts. Alongside it I built a RAG pipeline over thousands of Confluence documents — embeddings, vector retrieval and Bedrock models (Claude, Llama, Titan) answering real engineering questions — with rate limiting, fallback logic, error handling and observability so it behaves like a product, not a demo.',
    'That AI work sits on a deep systems foundation: a zero-loss Teradata-to-Redshift migration, Confluent Kafka streaming on AWS, Glue ETL into S3/Parquet, and Python services across Lambda, ECS, Fargate, DynamoDB and Step Functions — all Terraform-provisioned and instrumented. I lead engagements end-to-end: discovery, architecture, delivery, rollout and the demo to leadership afterwards.',
  ],
  highlights: [
    { label: 'Based in', value: 'Dallas, Texas, USA' },
    { label: 'Currently', value: 'Tech Lead — Southwest Airlines (Qentelli)' },
    { label: 'Specialty', value: 'Agentic systems · RAG · MCP · AWS Bedrock' },
    { label: 'Certified', value: 'AWS Solutions Architect – Associate' },
  ],
  interests: [
    'Agent Orchestration',
    'Retrieval Architecture',
    'Model Context Protocol',
    'LLM Evaluation',
    'Distributed Systems',
    'Developer Experience',
  ],
};

export const aboutTerminal: TerminalLineType[] = [
  {
    cmd: 'whoami',
    out: 'Surya Teja Tadaka — Technical Lead · Enterprise AI & Agentic Systems',
  },
  {
    cmd: 'cat focus.txt',
    out: 'Agents · MCP · RAG · AWS Bedrock · Python · Cloud-native platforms',
  },
  {
    cmd: 'ls shipped/',
    out: 'ai-code-automation-platform   confluence-rag   mcp-tool-servers   teradata->redshift   kafka-streaming',
  },
  {
    cmd: 'cat impact.txt',
    out: '$100K-cloud-saved   95%-ETL-coverage   30%-fewer-pipeline-failures   50%-faster-env-setup',
  },
  {
    cmd: 'cat open-to.txt',
    out: 'Staff / Principal AI · GenAI · Agentic AI · AI Platform · Forward Deployed · Dallas, TX or remote',
  },
];

/* --------------------------------- SKILLS --------------------------------- */
export const skillCategories: SkillCategoryType[] = [
  {
    title: 'Generative AI & Agents',
    description: 'The layer I specialize in today.',
    icon: 'ph:sparkle-bold',
    accent: 'violet',
    skills: [
      { name: 'AWS Bedrock', icon: 'logos:aws' },
      { name: 'Amazon Q Business', icon: 'logos:aws' },
      { name: 'Multi-Agent Orchestration', icon: 'ph:circles-three-bold' },
      { name: 'MCP Servers', icon: 'ph:plugs-connected-bold' },
      { name: 'Tool Calling', icon: 'ph:wrench-bold' },
      { name: 'RAG Pipelines', icon: 'ph:magnifying-glass-bold' },
      { name: 'Embeddings & Vector DBs', icon: 'ph:vector-three-bold' },
      { name: 'Claude · Llama · Titan', icon: 'ph:brain-bold' },
      { name: 'NLP', icon: 'ph:chat-text-bold' },
      { name: 'MLOps', icon: 'ph:flow-arrow-bold' },
    ],
  },
  {
    title: 'Languages',
    description: 'The core toolkit I build with.',
    icon: 'ph:code-bold',
    accent: 'accent',
    skills: [
      { name: 'Python', icon: 'logos:python' },
      { name: 'TypeScript', icon: 'logos:typescript-icon' },
      { name: 'JavaScript', icon: 'logos:javascript' },
      { name: 'SQL', icon: 'vscode-icons:file-type-sql' },
      { name: 'Java', icon: 'logos:java' },
      { name: 'Bash', icon: 'logos:bash' },
    ],
  },
  {
    title: 'Backend & APIs',
    description: 'Services, serverless and integrations.',
    icon: 'ph:stack-bold',
    accent: 'success',
    skills: [
      { name: 'FastAPI', icon: 'simple-icons:fastapi' },
      { name: 'Django', icon: 'vscode-icons:file-type-django' },
      { name: 'Flask', icon: 'simple-icons:flask' },
      { name: 'Node.js', icon: 'logos:nodejs-icon' },
      { name: 'REST APIs & Webhooks', icon: 'ph:plugs-connected-bold' },
      { name: 'Microservices', icon: 'ph:squares-four-bold' },
      { name: 'Message Queues', icon: 'logos:aws-sqs' },
      { name: 'React', icon: 'logos:react' },
    ],
  },
  {
    title: 'Data Engineering',
    description: 'Batch and streaming pipelines at enterprise scale.',
    icon: 'ph:database-bold',
    accent: 'violet',
    skills: [
      { name: 'Confluent Kafka', icon: 'simple-icons:apachekafka' },
      { name: 'AWS Glue ETL', icon: 'logos:aws-glue' },
      { name: 'Amazon Redshift', icon: 'logos:aws-redshift' },
      { name: 'BigQuery', icon: 'logos:google-cloud' },
      { name: 'Step Functions', icon: 'logos:aws-step-functions' },
      { name: 'OpenSearch', icon: 'logos:aws-open-search' },
      { name: 'S3 / Parquet', icon: 'logos:aws-s3' },
      { name: 'Streaming Pipelines', icon: 'ph:flow-arrow-bold' },
    ],
  },
  {
    title: 'Cloud & AWS',
    description: 'Architecting and running systems on AWS.',
    icon: 'ph:cloud-bold',
    accent: 'accent',
    skills: [
      { name: 'Lambda', icon: 'logos:aws-lambda' },
      { name: 'ECS / Fargate', icon: 'logos:aws-ecs' },
      { name: 'API Gateway', icon: 'logos:aws-api-gateway' },
      { name: 'DynamoDB', icon: 'logos:aws-dynamodb' },
      { name: 'IAM', icon: 'logos:aws-iam' },
      { name: 'SQS / SNS', icon: 'logos:aws-sqs' },
      { name: 'CloudWatch', icon: 'logos:aws-cloudwatch' },
      { name: 'GCP', icon: 'logos:google-cloud' },
    ],
  },
  {
    title: 'Infrastructure & DevOps',
    description: 'IaC, containers, pipelines and observability.',
    icon: 'ph:gear-six-bold',
    accent: 'success',
    skills: [
      { name: 'Terraform', icon: 'logos:terraform-icon' },
      { name: 'Docker', icon: 'logos:docker-icon' },
      { name: 'Kubernetes', icon: 'logos:kubernetes' },
      { name: 'GitLab CI', icon: 'logos:gitlab' },
      { name: 'GitHub Actions', icon: 'logos:github-actions' },
      { name: 'Jenkins', icon: 'logos:jenkins' },
      { name: 'Grafana', icon: 'logos:grafana' },
      { name: 'DataDog', icon: 'logos:datadog' },
    ],
  },
  {
    title: 'Databases',
    description: 'Relational, document and cache layers.',
    icon: 'ph:hard-drives-bold',
    accent: 'accent',
    skills: [
      { name: 'PostgreSQL', icon: 'logos:postgresql' },
      { name: 'MySQL', icon: 'logos:mysql' },
      { name: 'DynamoDB', icon: 'logos:aws-dynamodb' },
      { name: 'Redis', icon: 'logos:redis' },
      { name: 'Teradata', icon: 'ph:database-bold' },
    ],
  },
  {
    title: 'Customer & Delivery',
    description: 'How I run an engagement end-to-end.',
    icon: 'ph:compass-tool-bold',
    accent: 'violet',
    skills: [
      { name: 'Technical Discovery', icon: 'ph:magnifying-glass-bold' },
      { name: 'Solution Architecture', icon: 'ph:blueprint-bold' },
      { name: 'Stakeholder Alignment', icon: 'ph:handshake-bold' },
      { name: 'Demo-Driven Delivery', icon: 'ph:presentation-chart-bold' },
      { name: 'Forward Deployment', icon: 'ph:rocket-launch-bold' },
      { name: 'Mentoring', icon: 'ph:users-three-bold' },
    ],
  },
];

/* --------------------- WHAT I CAN OWN (stack ownership) ------------------- */
export const ownershipLayers: OwnershipLayerType[] = [
  {
    layer: 'AI Application Layer',
    icon: 'ph:sparkle-bold',
    accent: 'violet',
    summary:
      'The surface users touch — assistants, copilots and automation that produce real work products.',
    items: ['Chat & copilot UX', 'Prompt design', 'Human-in-the-loop review', 'Demo-ready delivery'],
  },
  {
    layer: 'Agent & Orchestration Layer',
    icon: 'ph:circles-three-bold',
    accent: 'violet',
    summary:
      'Reasoning agents, structured tool-calling over MCP, and the guardrails that keep them safe.',
    items: ['Multi-agent workflows', 'MCP tool servers', 'RAG retrieval', 'Rate limiting & fallbacks'],
  },
  {
    layer: 'API & Backend Layer',
    icon: 'ph:stack-bold',
    accent: 'success',
    summary: 'The services that make AI callable, observable and safe to depend on.',
    items: ['Python / FastAPI services', 'REST & webhooks', 'Microservices', 'Auth & error handling'],
  },
  {
    layer: 'Data Layer',
    icon: 'ph:database-bold',
    accent: 'accent',
    summary: 'The pipelines and stores that make enterprise knowledge retrievable.',
    items: ['Kafka streaming', 'Glue ETL → S3/Parquet', 'Redshift & BigQuery', 'Embeddings & vector search'],
  },
  {
    layer: 'Cloud & Infrastructure Layer',
    icon: 'ph:cloud-bold',
    accent: 'accent',
    summary: 'Everything provisioned as code, deployed continuously, and watched in production.',
    items: ['Terraform IaC', 'Lambda / ECS / Fargate', 'CI/CD pipelines', 'CloudWatch & Grafana'],
  },
];

/* --------------------------- CAPABILITY GRAPH ----------------------------- */
/* Deliberately no percentages — each node carries verifiable evidence instead. */
export const capabilityGraph: CapabilityDomainType[] = [
  {
    domain: 'AI / GenAI',
    icon: 'ph:sparkle-bold',
    accent: 'violet',
    blurb: 'Production agentic systems, not API calls.',
    nodes: [
      { name: 'Agents', icon: 'ph:circles-three-bold', evidence: 'Multi-agent ecosystem across Jira, GitLab and Xray in production.' },
      { name: 'MCP', icon: 'ph:plugs-connected-bold', evidence: 'Custom MCP servers giving agents structured, auditable tool access.' },
      { name: 'RAG', icon: 'ph:magnifying-glass-bold', evidence: 'Embeddings + vector retrieval over thousands of Confluence documents.' },
      { name: 'Bedrock', icon: 'logos:aws', evidence: 'Claude, Llama and Titan integrated with reasoning agents.' },
    ],
  },
  {
    domain: 'Backend',
    icon: 'ph:stack-bold',
    accent: 'success',
    blurb: 'Services that hold up under enterprise load.',
    nodes: [
      { name: 'Python', icon: 'logos:python', evidence: 'Primary language across all three roles for 7+ years.' },
      { name: 'FastAPI', icon: 'simple-icons:fastapi', evidence: 'Backend services and automation workflows at Southwest.' },
      { name: 'APIs', icon: 'ph:plugs-connected-bold', evidence: 'Real-time API integrations across enterprise systems.' },
      { name: 'Microservices', icon: 'ph:squares-four-bold', evidence: 'Containerized, independently deployed service boundaries.' },
    ],
  },
  {
    domain: 'Data',
    icon: 'ph:database-bold',
    accent: 'accent',
    blurb: 'Batch and streaming at warehouse scale.',
    nodes: [
      { name: 'Kafka', icon: 'simple-icons:apachekafka', evidence: 'Confluent Kafka on AWS for event-driven processing.' },
      { name: 'Redshift', icon: 'logos:aws-redshift', evidence: 'Zero-data-loss Teradata → Redshift migration.' },
      { name: 'Glue ETL', icon: 'logos:aws-glue', evidence: 'Automated ETL into S3/Parquet; 95% test coverage.' },
      { name: 'BigQuery', icon: 'logos:google-cloud', evidence: 'Warehouse design and query/cost optimization.' },
    ],
  },
  {
    domain: 'Cloud',
    icon: 'ph:cloud-bold',
    accent: 'accent',
    blurb: 'AWS-certified, production-operated.',
    nodes: [
      { name: 'Lambda', icon: 'logos:aws-lambda', evidence: 'Serverless compute across automation and data workloads.' },
      { name: 'ECS / Fargate', icon: 'logos:aws-ecs', evidence: 'Containerized service deployment at Southwest.' },
      { name: 'Step Functions', icon: 'logos:aws-step-functions', evidence: 'Orchestrated multi-step data workflows.' },
      { name: 'OpenSearch', icon: 'logos:aws-open-search', evidence: 'Search and real-time observability pipelines.' },
    ],
  },
  {
    domain: 'Infrastructure',
    icon: 'ph:gear-six-bold',
    accent: 'success',
    blurb: 'Everything as code, everything observed.',
    nodes: [
      { name: 'Terraform', icon: 'logos:terraform-icon', evidence: 'Manual deployments → IaC; 50% faster environment setup.' },
      { name: 'Kubernetes', icon: 'logos:kubernetes', evidence: 'Container orchestration for enterprise workloads.' },
      { name: 'CI/CD', icon: 'ph:infinity-bold', evidence: 'GitLab and GitHub Actions pipelines with quality gates.' },
      { name: 'Observability', icon: 'logos:grafana', evidence: 'Grafana, CloudWatch and DataDog; 30% fewer pipeline failures.' },
    ],
  },
];

/* ------------------------------- EXPERIENCE ------------------------------- */
/* Company, official title, dates and location are verbatim from the résumé.   */
export const experience: ExperienceType[] = [
  {
    role: 'Tech Lead',
    company: 'Southwest Airlines (Qentelli)',
    client: 'Southwest Airlines',
    companyLogo: '/img/icons/common/Southwest-Airlines.png',
    location: 'TX',
    date: 'June 2023 — Present',
    summary:
      'Designed and led an end-to-end enterprise AI automation platform — Bedrock, Amazon Q Business and multi-agent orchestration over custom MCP servers.',
    bullets: [
      'Designed and led development of an end-to-end AI automation platform using AWS Bedrock, Amazon Q Business and multi-agent orchestration to auto-generate code, create branches and raise GitLab merge requests directly from Jira tickets.',
      'Built a multi-agent ecosystem spanning Jira, GitLab and Xray through custom MCP servers, enabling structured tool-calling and seamless cross-system automation.',
      'Architected a scalable RAG pipeline using embeddings and vector databases over thousands of Confluence documents, letting Bedrock models answer engineering questions accurately and with citations.',
      'Integrated Bedrock LLMs (Claude, Llama, Titan) with reasoning agents to improve code generation, ticket comprehension and automated documentation.',
      'Ensured enterprise reliability through rate limiting, error handling, observability, fallback logic and structured agent workflows.',
      'Delivered end-to-end — technical discovery, requirements, architecture, development, CI/CD, AWS deployment, monitoring and iterative optimization — as primary technical POC across cross-functional teams.',
      'Architected production backend services and automation workflows in Python, FastAPI, React, Docker, Terraform and AWS, and mentored junior engineers on design, observability and reliability practices.',
    ],
    tech: [
      'AWS Bedrock',
      'Amazon Q',
      'MCP',
      'Multi-Agent',
      'RAG',
      'Python',
      'FastAPI',
      'Terraform',
      'GitLab CI',
      'React',
    ],
  },
  {
    role: 'Sr. Software Engineer',
    company: 'Smile Direct Club (Qentelli)',
    client: 'Smile Direct Club',
    companyLogo: '/img/icons/common/smiledirectclub_logo.jpeg',
    location: 'Remote, USA',
    date: 'Oct 2020 — May 2023',
    summary:
      'Led a zero-loss Teradata → Redshift migration and built the streaming and ETL backbone for a consumer MedTech platform.',
    bullets: [
      'Led the migration from on-prem Teradata to AWS Redshift with zero data loss and optimized downstream query performance.',
      'Architected and deployed Confluent Kafka on AWS for real-time streaming and event-driven data processing.',
      'Automated AWS Glue ETL workflows transforming and storing data in S3 (Parquet), improving reliability and cutting manual operations.',
      'Integrated Lambda, DynamoDB, OpenSearch, Step Functions, SQS, SNS and S3 via boto3, and designed batch and real-time pipelines in Python and Java.',
      'Built data-quality monitoring with SonarQube and DataDog, reducing pipeline failures and downtime by 30%, and reached 95% automated test coverage for ETL processes.',
      'Converted manual infrastructure deployments to Terraform and YAML IaC, reducing environment setup time by 50%.',
      'Reduced cloud infrastructure cost by $100K annually through workflow automation and test/reporting optimization.',
    ],
    tech: [
      'Python',
      'Kafka',
      'Redshift',
      'AWS Glue',
      'Step Functions',
      'DynamoDB',
      'OpenSearch',
      'Terraform',
      'BigQuery',
    ],
    metrics: [
      { value: '$100K', label: 'Annual cloud cost saved' },
      { value: '95%', label: 'ETL test coverage' },
      { value: '30%', label: 'Fewer pipeline failures' },
      { value: '50%', label: 'Faster env setup' },
    ],
  },
  {
    role: 'Software Engineer',
    company: 'SS&C Technologies',
    client: 'Health insurance & claims',
    companyLogo: '/img/icons/common/ssandc.png',
    location: 'India',
    date: 'May 2019 — April 2020',
    summary:
      'Built secure backend services for claims adjudication and health-insurance workflows across Django, Flask, React and Spring Boot.',
    bullets: [
      'Developed backend services using Django, Flask, React and Spring Boot for claims adjudication and health-insurance workflows.',
      'Implemented secure authentication and data protection with OAuth2, JWT, SSL and encryption.',
      'Built automated data-backup pipelines to AWS S3, ensuring compliant storage of claims data.',
      'Applied BeautifulSoup and NLTK for parsing and text extraction, improving data accuracy and automated claims adjudication.',
      'Containerized applications with Docker and built Jenkins CI/CD workflows to automate builds, tests and deployments.',
      'Reduced production defects by enforcing automated test coverage and environment parity.',
    ],
    tech: ['Python', 'Django', 'Flask', 'React', 'Spring Boot', 'OAuth2', 'Docker', 'Jenkins'],
  },
];

/* -------------------------------- EDUCATION ------------------------------- */
export const educationInfo: EducationType[] = [
  {
    schoolName: 'Vardhaman College of Engineering',
    subHeader: 'B.Tech, Computer Science',
    duration: 'Graduated 2019',
  },
  {
    schoolName: 'Government Polytechnic',
    subHeader: 'Diploma, Computer Science',
    duration: 'Graduated 2016',
  },
];

/* ---------------------- SYSTEMS I'VE BUILT (projects) --------------------- */
/* Tier 1 (featured) = production systems from the résumé.                     */
/* Tier 3 (archive)  = public GitHub work kept for provenance, de-emphasized.  */
export const projects: ProjectType[] = [
  {
    name: 'Enterprise AI Code-Automation Platform',
    category: 'Agentic AI',
    problem:
      'Engineering cycle time was dominated by mechanical work: read a Jira ticket, create a branch, scaffold the code, open a merge request.',
    desc: 'An end-to-end platform on AWS Bedrock and Amazon Q Business where reasoning agents take a Jira ticket and drive it through to an open GitLab merge request — retrieving the summary, generating a feature branch, writing boilerplate, committing and raising the MR with minimal human involvement.',
    highlights: [
      'Multi-agent orchestration across Jira, GitLab and Xray',
      'Bedrock LLMs (Claude, Llama, Titan) behind reasoning agents',
      'Rate limiting, fallback logic and structured agent workflows',
      'Delivered end-to-end: discovery → architecture → production',
    ],
    tech: ['AWS Bedrock', 'Amazon Q', 'MCP', 'Python', 'GitLab', 'Terraform'],
    impact: 'Cut engineering cycle time and manual workload across the delivery org.',
    featured: true,
  },
  {
    name: 'Custom MCP Tool Servers',
    category: 'Agentic AI',
    problem:
      'Agents that reach enterprise systems through ad-hoc prompt glue are unsafe, unauditable and impossible to extend.',
    desc: 'A set of custom Model Context Protocol servers exposing Jira, GitLab and Xray as typed, structured tools. Agents call capabilities through a contract instead of improvising API calls, so tool access is explicit, auditable and reusable across workflows.',
    highlights: [
      'Structured tool-calling contract per system',
      'Cross-system automation without bespoke glue',
      'Reusable across multiple agent workflows',
    ],
    tech: ['MCP', 'Python', 'Jira API', 'GitLab API', 'Xray'],
    impact: 'Made agent tool access explicit and auditable instead of prompt-driven.',
    featured: true,
  },
  {
    name: 'Confluence RAG Knowledge Assistant',
    category: 'Generative AI',
    problem:
      'Thousands of Confluence pages held the answers engineers needed, but search returned documents rather than answers.',
    desc: 'A scalable retrieval-augmented generation pipeline that ingests and chunks enterprise Confluence documentation, embeds it into a vector store, and serves grounded answers through Bedrock models — built for accuracy on internal engineering questions rather than general chat.',
    highlights: [
      'Ingestion and chunking over thousands of documents',
      'Embeddings + vector retrieval feeding Bedrock models',
      'Grounded answers with enterprise error handling',
    ],
    tech: ['RAG', 'Embeddings', 'Vector DB', 'AWS Bedrock', 'Python'],
    impact: 'Engineering answers sourced from internal documentation instead of tribal knowledge.',
    featured: true,
  },
  {
    name: 'Teradata → Redshift Migration & Streaming Platform',
    category: 'Data Platforms',
    problem:
      'An on-prem Teradata warehouse capped scale and cost, with no path to real-time event processing.',
    desc: 'A zero-data-loss migration to AWS Redshift alongside a Confluent Kafka streaming backbone and automated Glue ETL into S3/Parquet — with data-quality monitoring, 95% automated ETL coverage and Terraform-provisioned environments.',
    highlights: [
      'Zero data loss across the migration',
      'Confluent Kafka on AWS for event-driven processing',
      'Glue ETL → S3/Parquet with quality monitoring',
      '$100K annual cloud cost reduction',
    ],
    tech: ['Redshift', 'Kafka', 'AWS Glue', 'S3/Parquet', 'Terraform', 'Python'],
    impact: '$100K saved annually, 30% fewer pipeline failures, 50% faster environment setup.',
    featured: true,
  },
  {
    name: 'Cloud-Native Infrastructure as Code',
    category: 'Cloud Platforms',
    problem: 'Standing up Kubernetes by hand is slow, error-prone and impossible to reproduce.',
    desc: 'Provisions an Amazon EKS cluster declaratively with eksctl and Terraform — cluster manifests and variables codified for repeatable, version-controlled deployments.',
    highlights: ['EKS provisioned via eksctl', 'Terraform-managed configuration', 'Reproducible, version-controlled infra'],
    tech: ['AWS EKS', 'Terraform', 'Kubernetes', 'eksctl'],
    github: 'https://github.com/TadakaSuryaTeja/aws_eks',
  },
  {
    name: 'Serverless REST API on AWS Lambda',
    category: 'Cloud Platforms',
    problem: 'Always-on servers are overkill and costly for spiky CRUD workloads.',
    desc: 'A pay-per-use CRUD REST API built on AWS Lambda in Python, with custom JSON serialization and a Postman test collection.',
    highlights: ['AWS Lambda (Python) handlers', 'Custom JSON encoder', 'Postman-tested endpoints'],
    tech: ['AWS Lambda', 'Python', 'API Gateway'],
    github: 'https://github.com/TadakaSuryaTeja/sample_CRUD_in_AWS',
  },
  {
    name: 'Broadcom Driver Installer',
    category: 'Developer Tools',
    problem: 'Enabling Broadcom Wi-Fi on fresh Linux installs is a notorious, repetitive pain point.',
    desc: 'A shell utility that automates Broadcom driver enablement on Linux — adopted by the community with 42 stars and 27 forks.',
    highlights: ['⭐ 42 stars · 27 forks', 'Solves a real hardware-enablement pain', 'Clean, reusable shell tooling'],
    tech: ['Bash', 'Linux', 'Shell'],
    github: 'https://github.com/TadakaSuryaTeja/BroadcomInstaller2021',
  },
  {
    name: 'NLP Text-Classification Service',
    category: 'Product Engineering',
    problem: 'A trained NLP model is useless until it is served behind an interface users can hit.',
    desc: 'A Django web service that serves an NLP text-classification model end-to-end — training to inference to a usable web interface.',
    highlights: ['Django-served ML model', 'End-to-end train → infer → serve', 'NLP classification pipeline'],
    tech: ['Python', 'Django', 'NLP', 'NLTK'],
    github: 'https://github.com/TadakaSuryaTeja/nlp_webapp',
  },
  {
    name: 'Personalized Cancer Diagnosis',
    category: 'Product Engineering',
    problem: 'Classifying genetic mutations from dense clinical literature is a high-dimensional NLP problem.',
    desc: 'A machine-learning pipeline classifying genetic mutations into clinical categories from text — feature engineering, multiclass modeling and evaluation on a real genomics dataset.',
    highlights: ['Genomics NLP', 'Multiclass classification', 'Feature engineering + evaluation'],
    tech: ['Python', 'scikit-learn', 'NLP', 'Pandas'],
    github: 'https://github.com/TadakaSuryaTeja/PersonalizedCancerDiagnosis',
  },
];

/* --------------------------------- AI LAB --------------------------------- */
/* Only entries backed by shipped work or explicitly marked as exploration.    */
export const aiLab: AILabEntryType[] = [
  {
    title: 'Jira → Merge Request agent loop',
    description:
      'A reasoning agent that reads a ticket, plans the change, writes boilerplate, commits and opens the MR — with fallback logic when a step fails.',
    tech: ['Bedrock', 'Multi-agent', 'GitLab API'],
    status: 'In production',
    icon: 'ph:git-merge-bold',
    accent: 'violet',
  },
  {
    title: 'MCP servers for enterprise tools',
    description:
      'Jira, GitLab and Xray exposed as typed MCP tools so agents call contracts, not improvised HTTP.',
    tech: ['MCP', 'Python', 'Tool calling'],
    status: 'In production',
    icon: 'ph:plugs-connected-bold',
    accent: 'accent',
  },
  {
    title: 'RAG over Confluence',
    description:
      'Chunking, embedding and retrieval tuned for internal engineering documentation, served through Bedrock.',
    tech: ['Embeddings', 'Vector DB', 'Bedrock'],
    status: 'In production',
    icon: 'ph:magnifying-glass-bold',
    accent: 'success',
  },
  {
    title: 'Model routing across Claude, Llama and Titan',
    description:
      'Comparing Bedrock foundation models per task — code generation, ticket comprehension, documentation — rather than defaulting to one.',
    tech: ['Bedrock', 'Claude', 'Llama', 'Titan'],
    status: 'Shipped',
    icon: 'ph:brain-bold',
    accent: 'violet',
  },
  {
    title: 'Agent reliability guardrails',
    description:
      'Rate limiting, structured error handling, observability and fallback paths so agent workflows degrade instead of failing loudly.',
    tech: ['Observability', 'Rate limiting', 'Fallbacks'],
    status: 'In production',
    icon: 'ph:shield-check-bold',
    accent: 'accent',
  },
  {
    title: 'LLM evaluation harness',
    description:
      'Measuring retrieval quality and generation accuracy on internal engineering questions — an area I am actively deepening.',
    tech: ['Evaluation', 'RAG', 'Python'],
    status: 'Exploring',
    icon: 'ph:chart-line-up-bold',
    accent: 'success',
  },
];

/* ------------------------------ CASE STUDIES ------------------------------ */
export const caseStudies: CaseStudyType[] = [
  {
    id: 'southwest',
    company: 'Southwest Airlines (Qentelli)',
    title: 'An agentic AI platform that turns Jira tickets into merge requests',
    period: 'June 2023 — Present',
    accent: 'violet',
    problem:
      'A large airline engineering org spent a meaningful share of every sprint on mechanical work — reading tickets, creating branches, scaffolding code, opening merge requests — and answers to internal engineering questions were buried in thousands of Confluence pages.',
    approach: [
      'Designed an end-to-end AI automation platform on AWS Bedrock and Amazon Q Business with multi-agent orchestration driving the Jira → code → GitLab MR workflow.',
      'Exposed Jira, GitLab and Xray to agents through custom MCP servers so tool-calling is structured and auditable rather than prompt-glued.',
      'Built a RAG pipeline — chunking, embeddings, vector retrieval — over thousands of Confluence documents so Bedrock models answer from real documentation.',
      'Integrated Claude, Llama and Titan with reasoning agents, selecting models per task across code generation, ticket comprehension and documentation.',
      'Hardened the platform for enterprise use with rate limiting, structured error handling, fallback logic and observability.',
    ],
    challenges: [
      'Keeping agent tool access auditable and safe across three separate enterprise systems.',
      'Retrieval quality over heterogeneous, inconsistently structured internal documentation.',
      'Making a non-deterministic system reliable enough for engineers to trust in their daily workflow.',
    ],
    results: [
      'A production multi-agent platform owned end-to-end, from discovery through rollout',
      'Reusable MCP tool servers shared across agent workflows',
      'Grounded engineering answers sourced from internal documentation',
      'Demonstrated reductions in engineering cycle time and manual workload to leadership',
    ],
    stack: ['AWS Bedrock', 'Amazon Q', 'MCP', 'RAG', 'Python', 'FastAPI', 'Terraform', 'GitLab CI'],
    architecture: {
      caption:
        'Ticket in, merge request out — agents reach enterprise systems through MCP, grounded by RAG over Confluence.',
      layers: [
        {
          title: 'Trigger',
          nodes: [
            { label: 'Jira Ticket', icon: 'logos:jira' },
            { label: 'Engineer', icon: 'ph:user-bold' },
          ],
        },
        {
          title: 'Orchestration',
          nodes: [
            { label: 'Agent Planner', icon: 'ph:circles-three-bold' },
            { label: 'Amazon Q', icon: 'logos:aws' },
          ],
        },
        {
          title: 'Reasoning',
          nodes: [
            { label: 'Bedrock LLMs', icon: 'ph:brain-bold' },
            { label: 'RAG Retriever', icon: 'ph:magnifying-glass-bold' },
          ],
        },
        {
          title: 'Tools (MCP)',
          nodes: [
            { label: 'Jira MCP', icon: 'ph:plugs-connected-bold' },
            { label: 'GitLab MCP', icon: 'logos:gitlab' },
            { label: 'Xray MCP', icon: 'ph:wrench-bold' },
          ],
        },
        {
          title: 'Output',
          nodes: [
            { label: 'Merge Request', icon: 'ph:git-merge-bold' },
            { label: 'Observability', icon: 'logos:grafana' },
          ],
        },
      ],
    },
  },
  {
    id: 'smiledirectclub',
    company: 'Smile Direct Club (Qentelli)',
    title: 'Teradata to Redshift with zero data loss — and a streaming backbone',
    period: 'Oct 2020 — May 2023',
    accent: 'success',
    problem:
      'A consumer MedTech platform ran analytics on an on-prem Teradata warehouse: expensive, capacity-bound, and with no path to real-time event processing. Pipelines failed quietly and environments were built by hand.',
    approach: [
      'Led the Teradata → AWS Redshift migration with zero data loss, then optimized warehouse design across Redshift and BigQuery for query performance and cost.',
      'Architected and deployed Confluent Kafka on AWS for real-time streaming and event-driven processing.',
      'Automated Glue ETL workflows transforming and landing data in S3 as Parquet, integrating Lambda, DynamoDB, OpenSearch, Step Functions, SQS and SNS via boto3.',
      'Built data-quality monitoring with SonarQube and DataDog, and added unit plus integration testing to ETL pipelines.',
      'Converted manual infrastructure to Terraform and YAML IaC, and enhanced observability with CloudWatch, OpenSearch and SNS.',
    ],
    challenges: [
      'Guaranteeing zero data loss while cutting over a live analytics warehouse.',
      'Making batch and streaming pipelines observable enough to catch silent failures.',
      'Reducing cloud spend without sacrificing pipeline coverage or freshness.',
    ],
    results: [
      'Zero-loss warehouse migration with improved downstream performance',
      'Real-time event processing on Confluent Kafka',
      '95% automated test coverage across ETL processes',
      'Reusable Python data-generation library adopted across teams',
    ],
    metrics: [
      { value: '$100K', label: 'Annual cloud cost saved' },
      { value: '95%', label: 'ETL test coverage' },
      { value: '30%', label: 'Fewer pipeline failures' },
      { value: '50%', label: 'Faster env setup' },
    ],
    stack: ['Redshift', 'Kafka', 'AWS Glue', 'S3/Parquet', 'Step Functions', 'DynamoDB', 'Terraform', 'DataDog'],
    architecture: {
      caption: 'Streaming and batch ingestion landing in Parquet, warehoused in Redshift, watched end-to-end.',
      layers: [
        {
          title: 'Sources',
          nodes: [
            { label: 'Teradata', icon: 'ph:database-bold' },
            { label: 'App Events', icon: 'ph:lightning-bold' },
          ],
        },
        {
          title: 'Streaming',
          nodes: [
            { label: 'Confluent Kafka', icon: 'simple-icons:apachekafka' },
            { label: 'SQS / SNS', icon: 'logos:aws-sqs' },
          ],
        },
        {
          title: 'Processing',
          nodes: [
            { label: 'Glue ETL', icon: 'logos:aws-glue' },
            { label: 'Step Functions', icon: 'logos:aws-step-functions' },
            { label: 'Lambda', icon: 'logos:aws-lambda' },
          ],
        },
        {
          title: 'Storage',
          nodes: [
            { label: 'S3 / Parquet', icon: 'logos:aws-s3' },
            { label: 'Redshift', icon: 'logos:aws-redshift' },
            { label: 'DynamoDB', icon: 'logos:aws-dynamodb' },
          ],
        },
        {
          title: 'Observability',
          nodes: [
            { label: 'CloudWatch', icon: 'logos:aws-cloudwatch' },
            { label: 'DataDog', icon: 'logos:datadog' },
          ],
        },
      ],
    },
  },
  {
    id: 'ssc',
    company: 'SS&C Technologies',
    title: 'Secure backend services for health-insurance claims adjudication',
    period: 'May 2019 — April 2020',
    accent: 'accent',
    problem:
      'Claims adjudication depended on manual review of unstructured employer and job data, inside an application with strict security and compliance requirements.',
    approach: [
      'Built backend services across Django, Flask, React and Spring Boot for claims adjudication and health-insurance workflows.',
      'Implemented OAuth2, JWT, SSL and encryption for authentication and data protection.',
      'Applied BeautifulSoup and NLTK to parse employer/job details and extract text, improving data accuracy and adjudication speed.',
      'Containerized applications with Docker and automated builds, tests and deployments through Jenkins CI/CD.',
      'Built automated data-backup pipelines to AWS S3 for compliant claims storage.',
    ],
    challenges: [
      'Handling sensitive claims data under compliance constraints.',
      'Extracting reliable structure from inconsistent employer and job text.',
      'Keeping QA and production environments at parity to stop defect leakage.',
    ],
    results: [
      'Secure, authenticated claims services in production',
      'Automated text extraction feeding adjudication',
      'Jenkins CI/CD with enforced automated test coverage',
      'Reduced production defects through environment parity',
    ],
    stack: ['Python', 'Django', 'Flask', 'React', 'Spring Boot', 'OAuth2', 'Docker', 'Jenkins'],
    architecture: {
      caption: 'Authenticated claims services with automated text extraction and compliant S3 backup.',
      layers: [
        {
          title: 'Client',
          nodes: [{ label: 'React UI', icon: 'logos:react' }],
        },
        {
          title: 'Auth',
          nodes: [
            { label: 'OAuth2 / JWT', icon: 'ph:shield-check-bold' },
          ],
        },
        {
          title: 'Services',
          nodes: [
            { label: 'Django / Flask', icon: 'vscode-icons:file-type-django' },
            { label: 'Spring Boot', icon: 'logos:java' },
          ],
        },
        {
          title: 'Processing',
          nodes: [
            { label: 'NLTK', icon: 'ph:chat-text-bold' },
            { label: 'BeautifulSoup', icon: 'ph:funnel-bold' },
          ],
        },
        {
          title: 'Storage & CI',
          nodes: [
            { label: 'AWS S3', icon: 'logos:aws-s3' },
            { label: 'Jenkins', icon: 'logos:jenkins' },
          ],
        },
      ],
    },
  },
];

/* ----------------------------- CERTIFICATIONS ----------------------------- */
export const certifications: CertificationType[] = [
  {
    certificate: 'AWS Certified Solutions Architect – Associate',
    issuedby: 'Amazon Web Services',
    category: 'Cloud',
    accent: 'accent',
    link: 'https://www.credly.com/badges/a3337dc2-e390-42a4-b7ae-b8fb401f1386',
  },
  {
    certificate: 'AWS Certified Cloud Practitioner',
    issuedby: 'Amazon Web Services',
    category: 'Cloud',
    accent: 'accent',
    link: 'https://www.credly.com/badges/1eb48c8d-7a51-4006-a7f5-be69b65f62ff',
  },
  {
    certificate: 'Machine Learning and Artificial Intelligence',
    issuedby: 'AppliedAI',
    category: 'AI / ML',
    accent: 'violet',
    link: 'https://www.appliedaicourse.com/certificate/d7dbb737c0',
  },
  {
    certificate: 'Information Security – IV',
    issuedby: 'NPTEL',
    category: 'Security',
    accent: 'success',
    link: 'https://github.com/TadakaSuryaTeja/Profile/blob/main/Information%20Security%20-%20IV.jpg',
  },
  {
    // NOTE: résumé says "Mobile Application Development"; the linked image file
    // is named "Modern Application Development". Confirm which is correct.
    certificate: 'Mobile Application Development',
    issuedby: 'NPTEL',
    category: 'Engineering',
    accent: 'accent',
    link: 'https://github.com/TadakaSuryaTeja/Profile/blob/main/Introduction%20to%20Modern%20Application%20Development.jpg',
  },
];

/* ------------------------------ TECH MARQUEE ------------------------------ */
export const techMarquee: MarqueeItemType[] = [
  { name: 'AWS Bedrock', icon: 'logos:aws' },
  { name: 'MCP', icon: 'ph:plugs-connected-bold' },
  { name: 'RAG', icon: 'ph:magnifying-glass-bold' },
  { name: 'Multi-Agent', icon: 'ph:circles-three-bold' },
  { name: 'Python', icon: 'logos:python' },
  { name: 'FastAPI', icon: 'simple-icons:fastapi' },
  { name: 'Vector DBs', icon: 'ph:vector-three-bold' },
  { name: 'Lambda', icon: 'logos:aws-lambda' },
  { name: 'Terraform', icon: 'logos:terraform-icon' },
  { name: 'Kafka', icon: 'simple-icons:apachekafka' },
  { name: 'Redshift', icon: 'logos:aws-redshift' },
  { name: 'AWS Glue', icon: 'logos:aws-glue' },
  { name: 'Kubernetes', icon: 'logos:kubernetes' },
  { name: 'Docker', icon: 'logos:docker-icon' },
  { name: 'React', icon: 'logos:react' },
  { name: 'TypeScript', icon: 'logos:typescript-icon' },
  { name: 'Grafana', icon: 'logos:grafana' },
  { name: 'GitLab CI', icon: 'logos:gitlab' },
];

/* ------------------------------ TESTIMONIALS ------------------------------ */
// Provide real LinkedIn recommendations / manager quotes here.
// The section renders only when this array is non-empty.
export const testimonials: TestimonialType[] = [];

/* --------------------------------- INSIGHTS ------------------------------- */
// Local fallback used when Notion is unavailable or unconfigured.
// TODO: swap each `link` for the exact Medium article URL.
export const blogPosts: BlogPostType[] = [
  {
    title: 'Getting Started with Computer Vision in OpenCV',
    excerpt:
      'A practical introduction to image processing and computer vision in Python with OpenCV.',
    tag: 'Computer Vision',
    readTime: '6 min',
    link: 'https://medium.com/@suryateja233',
  },
  {
    title: 'Working with Amazon S3 in Python',
    excerpt:
      'Storing, retrieving and managing objects in Amazon S3 programmatically with boto3.',
    tag: 'AWS',
    readTime: '5 min',
    link: 'https://medium.com/@suryateja233',
  },
  {
    title: 'Automating NFT Creation & Listing with Python',
    excerpt: 'Scripting the mint-to-marketplace pipeline end to end with Python automation.',
    tag: 'Python',
    readTime: '7 min',
    link: 'https://medium.com/@suryateja233',
  },
];

/* --------------------------------- CONTACT -------------------------------- */
export const contactInfo: ContactType = {
  title: "Let's build production AI systems",
  subtitle:
    "If you're building agentic systems, enterprise RAG, or the AI platform underneath them — I'd like to hear about it.",
  email: 'suryateja233@gmail.com',
};

export const showContactForm = false;

/* ----------------------------------- SEO ---------------------------------- */
export const seoData: SEODataType = {
  title: 'Surya Teja Tadaka — Enterprise AI & Agentic Systems Engineer · Technical Lead',
  description:
    'Surya Teja Tadaka is a Technical Lead and Enterprise AI engineer with 7+ years across backend, data and cloud — building production agentic systems on AWS Bedrock with multi-agent orchestration, custom MCP servers, RAG over enterprise knowledge, Python and AWS.',
  author: 'Surya Teja Tadaka',
  image: '/og.png',
  url: 'https://surya-teja-tadaka.vercel.app/',
  keywords: [
    'Surya Teja Tadaka',
    'Tadaka Surya Teja',
    'AI Engineer',
    'Generative AI Engineer',
    'Agentic AI Engineer',
    'Enterprise AI Engineer',
    'Staff AI Engineer',
    'Principal AI Engineer',
    'Applied AI Engineer',
    'AI Platform Engineer',
    'AI Solutions Architect',
    'GenAI Architect',
    'AI Infrastructure Engineer',
    'Forward Deployed Engineer',
    'Technical Lead AI',
    'Model Context Protocol',
    'MCP',
    'RAG',
    'Retrieval Augmented Generation',
    'Multi-Agent Orchestration',
    'AWS Bedrock',
    'Amazon Q',
    'LLM',
    'Vector Databases',
    'Python',
    'FastAPI',
    'AWS',
    'Data Engineering',
    'Kafka',
    'Redshift',
    'Terraform',
    'AWS Solutions Architect',
    'Dallas',
  ],
};
