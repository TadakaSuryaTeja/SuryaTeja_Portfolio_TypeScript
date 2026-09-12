/**
 * RÉSUMÉ SOURCE OF TRUTH (editable).
 *
 * Plain ESM so `scripts/build-resume.mjs` can render it to ATS-safe HTML and
 * PDF with no build step. Employers, official titles, dates, education and
 * certifications are verbatim from the résumé PDF and must match
 * `portfolio.ts` exactly — when you change a fact, change it in both.
 *
 * Rebuild with:  npm run build:resume
 */

export const contact = {
  name: 'Surya Teja Tadaka',
  email: 'suryateja233@gmail.com',
  phone: '+1 (914) 309-1946',
  location: 'Dallas, Texas',
  website: 'https://surya-teja-tadaka.vercel.app/',
  linkedin: 'https://www.linkedin.com/in/surya-teja-tadaka-36ba8814a/',
  github: 'https://github.com/TadakaSuryaTeja',
};

/* Verbatim facts shared by both variants. --------------------------------- */

export const education = [
  {
    school: 'Vardhaman College of Engineering',
    detail: 'Bachelor of Technology in Computer Science',
    date: 'Graduation: 2019',
  },
  {
    school: 'Government Polytechnic',
    detail: 'Diploma in Computer Science',
    date: 'Graduation: 2016',
  },
];

export const certifications = [
  'AWS Certified Solutions Architect – Associate — Amazon Web Services',
  'AWS Certified Cloud Practitioner — Amazon Web Services',
  'Machine Learning and Artificial Intelligence — AppliedAI',
  'Information Security-IV — NPTEL',
  'Mobile Application Development — NPTEL',
];

/* Experience — official titles, companies and dates are fixed. Bullets are
   selected per variant from the same verified pool.                          */

const southwestBullets = {
  ai: [
    'Designed and led development of an end-to-end AI automation platform using AWS Bedrock, Amazon Q Business and multi-agent orchestration to auto-generate code, create branches and raise GitLab merge requests directly from Jira tickets.',
    'Built a multi-agent ecosystem spanning Jira, GitLab and Xray through custom MCP (Model Context Protocol) servers, enabling structured tool-calling and cross-system automation.',
    'Architected a scalable RAG pipeline using embeddings and vector databases to ingest and retrieve thousands of Confluence documents, enabling Bedrock models to answer engineering questions accurately.',
    'Integrated Bedrock LLMs (Claude, Llama, Titan) with reasoning agents to improve code generation, ticket comprehension and automated documentation generation.',
    'Ensured enterprise reliability through rate limiting, error handling, observability, fallback logic and structured agent workflows.',
    'Delivered the platform end-to-end: technical discovery, requirements gathering, architecture, development, CI/CD, AWS deployment, monitoring and iterative optimization.',
    'Architected production backend services and automation workflows using Python, FastAPI, React, Docker, Terraform and AWS; mentored junior engineers and established practices around design, observability and reliability.',
  ],
  master: [
    'Designed and led development of an end-to-end AI automation platform using AWS Bedrock, Amazon Q Business and multi-agent orchestration to auto-generate code, create branches and raise GitLab merge requests from Jira tickets.',
    'Built a multi-agent ecosystem (Jira, GitLab, Xray) through custom MCP servers enabling structured tool-calling and cross-system automation.',
    'Created a scalable RAG pipeline using embeddings and vector DBs to ingest and retrieve thousands of Confluence documents.',
    'Architected and deployed production-ready backend services and automation workflows using Python, React, FastAPI, Docker, Terraform and AWS cloud services.',
    'Led customer-facing technical engagements including discovery, solution design, integration planning and production rollout of AI and automation solutions.',
    'Acted as primary technical POC for cross-functional teams, managing stakeholders, resolving blockers and driving delivery timelines.',
    'Owned full SDLC including prototyping, development, CI/CD pipelines, cloud deployment, monitoring and production support; mentored junior engineers.',
  ],
};

const sdcBullets = [
  'Led successful migration from on-prem Teradata to AWS Redshift ensuring zero data loss and optimized performance.',
  'Architected and deployed Confluent Kafka on AWS for real-time streaming and event-driven data processing.',
  'Automated AWS Glue ETL workflows to transform and store data in S3 (Parquet), improving reliability and reducing manual operations.',
  'Integrated AWS services including Lambda, DynamoDB, OpenSearch, Step Functions, SQS, SNS and S3 using boto3; designed batch and real-time pipelines in Python and Java.',
  'Built data quality monitoring using SonarQube and DataDog, reducing pipeline failures and downtime by 30%; achieved 95% automated test coverage for ETL processes.',
  'Converted manual infrastructure deployments to Terraform and YAML IaC, reducing environment setup time by 50%.',
  'Reduced cloud infrastructure cost by $100K annually through workflow automation and test/reporting optimizations.',
];

const sscBullets = [
  'Developed backend services using Django, Flask, React and Spring Boot for claims adjudication and health insurance workflows.',
  'Implemented secure authentication and data protection using OAuth2, SSL, JWT and encryption.',
  'Applied BeautifulSoup and NLTK for parsing and text extraction, improving data accuracy and automated claims adjudication.',
  'Built containerized applications using Docker and CI/CD workflows using Jenkins to automate builds, tests and deployments.',
  'Built automated data backup pipelines to AWS S3, ensuring compliant storage of claims data.',
  'Reduced production defects by enforcing automated test coverage and environment parity.',
];

export function experience(variant) {
  return [
    {
      company: 'Southwest Airlines (Qentelli)',
      title: 'Tech Lead',
      location: 'TX',
      date: 'June 2023 – Present',
      bullets: variant === 'ai' ? southwestBullets.ai : southwestBullets.master,
    },
    {
      company: 'Smile Direct Club (Qentelli)',
      title: 'Sr. Software Engineer',
      location: 'Remote, USA',
      date: 'Oct 2020 – May 2023',
      bullets: sdcBullets,
    },
    {
      company: 'SS&C Technologies',
      title: 'Software Engineer',
      location: 'India',
      date: 'May 2019 – April 2020',
      bullets: sscBullets,
    },
  ];
}

/* Variants ----------------------------------------------------------------- */

export const variants = {
  ai: {
    file: 'Surya_Teja_Tadaka_AI_Engineer_Resume',
    headline:
      'Technical Lead | Enterprise AI & Agentic Systems | GenAI • RAG • MCP • Python • AWS',
    summary:
      'Technical Lead with 7+ years of software, data and cloud engineering, specialized in production Generative AI. Designed and led an end-to-end enterprise AI automation platform on AWS Bedrock and Amazon Q Business, using multi-agent orchestration over custom MCP servers to drive Jira tickets through to GitLab merge requests. Built RAG pipelines over thousands of enterprise documents with embeddings and vector search, integrating Claude, Llama and Titan behind reasoning agents. Deep foundation in Python backend engineering, AWS architecture and data platforms — Kafka streaming, Glue ETL and a zero-loss Teradata-to-Redshift migration. Owns engagements end-to-end from technical discovery through production rollout.',
    skills: [
      {
        label: 'AI / Generative AI',
        items:
          'Generative AI, LLMs, AI Agents, Agentic Workflows, Multi-Agent Orchestration, RAG, MCP (Model Context Protocol), Tool Calling, Embeddings, Vector Search, Amazon Bedrock, Amazon Q Business, Claude, Llama, Titan, NLP, MLOps, Prompt Engineering',
      },
      {
        label: 'Programming & Backend',
        items:
          'Python, TypeScript, JavaScript, SQL, Java, FastAPI, Django, Flask, Node.js, REST APIs, Webhooks, Microservices, Message Queues, Distributed Systems, React',
      },
      {
        label: 'Cloud',
        items:
          'AWS (Lambda, ECS, Fargate, API Gateway, S3, DynamoDB, IAM, Redshift, Glue, OpenSearch, SQS, SNS, Step Functions, CloudWatch), GCP, BigQuery, Serverless, Cloud Security',
      },
      {
        label: 'Data',
        items:
          'Confluent Kafka, Streaming Pipelines, ETL, Data Pipelines, Data Engineering, Real-Time Processing, Redshift, BigQuery, Parquet, Data Quality Monitoring',
      },
      {
        label: 'Infrastructure & DevOps',
        items:
          'Terraform, Infrastructure as Code, Kubernetes, Docker, CI/CD (GitLab, GitHub Actions, Jenkins), Observability (Grafana, CloudWatch, DataDog), Production Debugging',
      },
      {
        label: 'Customer & Delivery',
        items:
          'Technical Discovery, Scoping, Solution Architecture, Stakeholder Alignment, Demo-Driven Delivery, Forward Deployment, Project Leadership, Mentoring',
      },
    ],
    projects: [
      {
        name: 'Enterprise AI Code-Automation Platform',
        detail:
          'Multi-agent platform on AWS Bedrock and Amazon Q Business that takes a Jira ticket through branch creation, code generation and an open GitLab merge request. Agents reach Jira, GitLab and Xray through custom MCP servers; hardened with rate limiting, fallback logic and observability. (Southwest Airlines)',
      },
      {
        name: 'Confluence RAG Knowledge Assistant',
        detail:
          'Retrieval-augmented generation pipeline over thousands of Confluence documents — ingestion, chunking, embeddings and vector retrieval feeding Bedrock models to answer internal engineering questions with grounded citations. (Southwest Airlines)',
      },
      {
        name: 'Teradata → Redshift Migration & Streaming Platform',
        detail:
          'Zero-data-loss warehouse migration paired with a Confluent Kafka streaming backbone and automated Glue ETL into S3/Parquet; 95% ETL test coverage, 30% fewer pipeline failures, $100K annual cloud cost reduction. (Smile Direct Club)',
      },
      {
        name: 'Cloud-Native Infrastructure as Code — github.com/TadakaSuryaTeja/aws_eks',
        detail:
          'Declarative Amazon EKS provisioning with Terraform and eksctl for repeatable, version-controlled Kubernetes environments.',
      },
      {
        name: 'Broadcom Driver Installer — github.com/TadakaSuryaTeja/BroadcomInstaller2021',
        detail:
          'Open-source Linux hardware-enablement tool adopted by the community (42 stars, 27 forks).',
      },
    ],
  },

  master: {
    file: 'Surya_Teja_Tadaka_Resume',
    headline:
      'Technical Lead | Enterprise AI & Cloud Engineering | Python • AWS • Data • GenAI',
    summary:
      'Tech Lead with 7+ years of experience delivering AI-driven, customer-facing and cloud-native enterprise solutions. Leads end-to-end technical engagements, interfaces directly with business stakeholders, and deploys production AI/ML, automation and backend systems at scale. Strong background in Python, React, APIs, microservices and cloud platforms (AWS/GCP), with deep data engineering experience across Kafka, Glue and Redshift. Experienced in designing scalable architectures, debugging live production issues and mentoring engineering teams.',
    skills: [
      {
        label: 'Programming & Backend',
        items:
          'Python, Node.js, React, TypeScript, JavaScript, SQL, Java, FastAPI, Django, Flask, REST APIs, Webhooks, Microservices, Message Queues, SQL/NoSQL',
      },
      {
        label: 'AI / Generative AI',
        items:
          'Generative AI, LLMs, AI Agents, Multi-Agent Orchestration, RAG, MCP, Tool Calling, Embeddings, Vector Search, Amazon Bedrock, Amazon Q Business, NLP, MLOps',
      },
      {
        label: 'Cloud & DevOps',
        items:
          'AWS (Lambda, ECS, Fargate, S3, API Gateway, DynamoDB, IAM, Redshift, Glue, OpenSearch, Step Functions), GCP, Terraform, Infrastructure as Code, Kubernetes, Docker, CI/CD (GitHub Actions, GitLab, Jenkins), Monitoring & Alerting, Cloud Security',
      },
      {
        label: 'Data',
        items:
          'Confluent Kafka, Streaming Pipelines, ETL, Data Pipelines, Redshift, BigQuery, Parquet, Redis, Data Quality Monitoring, Observability (Grafana, CloudWatch, DataDog)',
      },
      {
        label: 'Customer & Delivery',
        items:
          'Technical Discovery, Scoping, Demo-driven Selling, Stakeholder Alignment, Forward Deployment, Requirements Gathering, Customer Solutioning, Project Leadership, Cross-functional Collaboration, Mentoring',
      },
    ],
    projects: [
      {
        name: 'Enterprise AI Code-Automation Platform',
        detail:
          'AWS Bedrock and Amazon Q Business platform with multi-agent orchestration over custom MCP servers, automating Jira → code → GitLab merge request. (Southwest Airlines)',
      },
      {
        name: 'Teradata → Redshift Migration & Streaming Platform',
        detail:
          'Zero-loss warehouse migration, Confluent Kafka streaming and automated Glue ETL into S3/Parquet; $100K annual cloud cost reduction. (Smile Direct Club)',
      },
      {
        name: 'Cloud-Native Infrastructure as Code — github.com/TadakaSuryaTeja/aws_eks',
        detail: 'Declarative Amazon EKS provisioning with Terraform and eksctl.',
      },
      {
        name: 'Broadcom Driver Installer — github.com/TadakaSuryaTeja/BroadcomInstaller2021',
        detail: 'Open-source Linux hardware-enablement tool (42 stars, 27 forks).',
      },
    ],
  },
};
