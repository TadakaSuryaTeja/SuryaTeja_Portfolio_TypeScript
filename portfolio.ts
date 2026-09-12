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
  CertificationType,
  TestimonialType,
  BlogPostType,
  ContactType,
  MarqueeItemType,
  SEODataType,
  OwnershipLayerType,
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

/* ------------------------- RECRUITER BRIEF (60 seconds) -------------------- */
/* Every line here must be defensible in the first interview question about it. */
export const recruiterBrief = {
  coreAreas: [
    'Generative AI',
    'Agentic Systems',
    'RAG',
    'MCP',
    'Python',
    'AWS',
    'Data Engineering',
    'Cloud Architecture',
  ],
  achievements: [
    'Designed and led an end-to-end enterprise AI automation platform on AWS Bedrock and Amazon Q Business, in production at Southwest Airlines.',
    'Built a multi-agent ecosystem across Jira, GitLab and Xray through custom MCP servers enabling structured tool-calling.',
    'Architected a RAG pipeline over thousands of Confluence documents, grounding Bedrock models in real engineering documentation.',
    'Led a zero-data-loss Teradata → AWS Redshift migration and deployed Confluent Kafka for real-time streaming.',
    'Reduced cloud infrastructure cost by $100K annually and cut environment setup time by 50% through automation and IaC.',
  ],
  /* Interest, stated confidently — never availability anxiety. */
  interestedIn: [
    'Staff / Principal AI Engineering',
    'Applied AI',
    'AI Platforms',
    'Agentic Systems',
    'Enterprise GenAI',
    'Technical Leadership',
  ],
};

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
    items: ['LLMs', 'Tool Calling', 'Human-in-the-loop review', 'LLM Evaluation'],
  },
  {
    layer: 'Agent & Orchestration Layer',
    icon: 'ph:circles-three-bold',
    accent: 'violet',
    summary:
      'Reasoning agents, structured tool-calling over MCP, and the guardrails that keep them safe.',
    items: ['AI Agents', 'MCP', 'RAG', 'AWS Bedrock'],
  },
  {
    layer: 'API & Backend Layer',
    icon: 'ph:stack-bold',
    accent: 'success',
    summary: 'The services that make AI callable, observable and safe to depend on.',
    items: ['Python', 'FastAPI', 'REST APIs', 'Microservices', 'Auth & Security'],
  },
  {
    layer: 'Data Layer',
    icon: 'ph:database-bold',
    accent: 'accent',
    summary: 'The pipelines and stores that make enterprise knowledge retrievable.',
    items: ['Kafka', 'AWS Glue', 'Redshift', 'S3 / Parquet', 'Vector Search'],
  },
  {
    layer: 'Cloud & Infrastructure Layer',
    icon: 'ph:cloud-bold',
    accent: 'accent',
    summary: 'Everything provisioned as code, deployed continuously, and watched in production.',
    items: ['Terraform', 'Kubernetes', 'Lambda', 'ECS / Fargate', 'CI/CD', 'Observability'],
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
    title: 'Build a CRUD API using AWS Lambda, API Gateway and DynamoDB',
    excerpt:
      'A walkthrough of a fully serverless CRUD API — Lambda handlers, API Gateway routing and DynamoDB persistence.',
    tag: 'AWS',
    date: '2022-08-25',
    readTime: '6 min',
    link: 'https://medium.com/@suryateja233/build-a-crud-api-using-aws-lambda-api-gateway-and-dynamodb-df306212d329',
  },
  {
    title: 'Computer Vision with OpenCV Library using Python',
    excerpt:
      'A practical introduction to image processing and computer vision in Python with OpenCV.',
    tag: 'Computer Vision',
    date: '2021-12-05',
    readTime: '5 min',
    link: 'https://medium.com/@suryateja233/computer-vision-with-opencv-library-using-python-7246078892b7',
  },
  {
    title: 'S3 Storage Classes',
    excerpt:
      'How the S3 storage classes differ on cost, durability and retrieval, and how to choose between them.',
    tag: 'AWS',
    date: '2021-09-04',
    readTime: '4 min',
    link: 'https://medium.com/@suryateja233/s3-storage-classes-4cc65b5f55c4',
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
