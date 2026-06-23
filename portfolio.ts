import type {
  ProfileType,
  SocialLinksType,
  MetricType,
  AboutType,
  TerminalLineType,
  SkillCategoryType,
  SkillBarType,
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
} from './types/sections';

/* ----------------------------- HERO / PROFILE ----------------------------- */
export const profile: ProfileType = {
  name: 'Tadaka Surya Teja',
  initials: 'ST',
  headline: 'Software Engineer · AI/ML · AWS Solutions Architect',
  roles: [
    'Software Engineer',
    'Feature Development Engineer',
    'AI / ML Engineer',
    'AWS Solutions Architect',
    'Python Developer',
    'Full Stack Engineer',
    'Cloud Engineer',
  ],
  tagline:
    'I build across the stack — Python services and APIs, AWS cloud architecture, and applied AI/ML — turning complex problems into scalable, production systems.',
  location: 'Dallas, Texas',
  availability: 'Open to Software, AI/ML, Cloud & Architect roles',
  yearsExperience: '7+',
  resumeLink:
    'https://github.com/TadakaSuryaTeja/TadakaSuryaTeja/blob/main/SuryaTejaTadaka-sdet.pdf',
  // Drop a square, professional headshot at public/profile.png and set this to
  // '/profile.png'. While empty, the hero shows a clean gradient-initials card.
  photo: '',
};

export const openSource = {
  githubUserName: 'TadakaSuryaTeja',
};

/* --------------------------------- SOCIALS -------------------------------- */
export const socialLinks: SocialLinksType = {
  url: 'https://surya-teja-tadaka.vercel.app/',
  // TODO: replace with your preferred contact email
  email: '',
  linkedin: 'https://www.linkedin.com/in/surya-teja-tadaka-36ba8814a/',
  github: 'https://github.com/TadakaSuryaTeja',
  medium: 'https://medium.com/@suryateja233',
  kaggle: 'https://www.kaggle.com/tadakasuryateja',
  linktr: 'https://linktr.ee/suryatejatadaka',
};

/* --------------------------------- METRICS -------------------------------- */
export const metrics: MetricType[] = [
  {
    value: '7+',
    label: 'Years Experience',
    sublabel: 'Forward-deployed delivery',
    accent: 'accent',
  },
  {
    value: '$100K+',
    label: 'Cloud Cost Saved',
    sublabel: 'Automation & right-sizing',
    accent: 'success',
  },
  {
    value: '80%',
    label: 'Fewer Prod Errors',
    sublabel: 'Monitoring & alerting',
    accent: 'violet',
  },
  {
    value: '45%',
    label: 'Faster Data Pipelines',
    sublabel: 'Automated ETL',
    accent: 'accent',
  },
];

/* ---------------------------------- ABOUT --------------------------------- */
export const about: AboutType = {
  paragraphs: [
    "I'm a software engineer with 7+ years building across the stack — Python services and APIs, AWS cloud architecture, and applied AI/ML — for enterprises in airlines, MedTech, and financial services. I've grown from hands-on engineering into architecting the cloud platforms and systems large products depend on, leading and mentoring along the way.",
    'On the cloud and backend side I design infrastructure-as-code (EKS, Lambda, Terraform), event-driven systems (SQS/SNS/S3), Django/Flask APIs, and CI/CD with built-in observability — work that has cut $100K in cloud cost, reduced production errors by 80%, and sped data pipelines 45%. I hold the AWS Solutions Architect – Associate certification.',
    "On the AI/ML side I work in Python — PyTorch, NLP, and computer vision — from genomics text classification to forecasting, and I'm a Kaggle Expert. I care about clean architecture, measurable impact, and going deeper on scalable systems and modern AI.",
  ],
  highlights: [
    { label: 'Based in', value: 'Dallas, Texas, USA' },
    { label: 'Currently', value: 'Associate Architect · Tech Lead' },
    { label: 'Certified', value: 'AWS Solutions Architect · Kaggle Expert' },
    { label: 'Focus', value: 'Software · Cloud · AI/ML' },
  ],
  interests: [
    'System Design',
    'Machine Learning',
    'Cloud Architecture',
    'Distributed Systems',
    'Open Source',
    'Developer Experience',
  ],
  // Honest growth roadmap — rendered separately as "Currently learning",
  // never mixed into the skills you already have.
  learning: [
    'Generative AI',
    'LLMs & RAG',
    'LangChain',
    'Vector Databases',
    'MLOps',
    'FastAPI',
    'PySpark',
    'Kafka',
  ],
};

export const aboutTerminal: TerminalLineType[] = [
  {
    cmd: 'whoami',
    out: 'Tadaka Surya Teja — Software Engineer · AI/ML · Cloud Architect',
  },
  {
    cmd: 'cat focus.txt',
    out: 'Python · AWS (EKS / Lambda / Terraform) · APIs · AI/ML',
  },
  {
    cmd: 'ls impact/',
    out: '$100K-cloud-saved   80%-fewer-errors   45%-faster-pipelines   AWS-certified',
  },
  {
    cmd: 'cat open-to.txt',
    out: 'Software · Backend · AI/ML · Cloud · Architect roles · Dallas, TX',
  },
];

/* --------------------------------- SKILLS --------------------------------- */
export const skillCategories: SkillCategoryType[] = [
  {
    title: 'Languages',
    description: 'The core toolkit I build with.',
    icon: 'ph:code-bold',
    accent: 'accent',
    skills: [
      { name: 'Python', icon: 'logos:python' },
      { name: 'SQL', icon: 'vscode-icons:file-type-sql' },
      { name: 'Bash', icon: 'logos:bash' },
      { name: 'Java', icon: 'logos:java' },
      { name: 'JavaScript', icon: 'logos:javascript' },
    ],
  },
  {
    title: 'Backend & APIs',
    description: 'Services, serverless, and integrations.',
    icon: 'ph:stack-bold',
    accent: 'success',
    skills: [
      { name: 'Django', icon: 'vscode-icons:file-type-django' },
      { name: 'Flask', icon: 'simple-icons:flask' },
      { name: 'REST APIs', icon: 'ph:plugs-connected-bold' },
      { name: 'Serverless', icon: 'ph:lightning-bold' },
      { name: 'Postman', icon: 'logos:postman-icon' },
      { name: 'PostgreSQL', icon: 'logos:postgresql' },
    ],
  },
  {
    title: 'AI / ML & Data',
    description: 'Modeling, NLP, vision, and data pipelines.',
    icon: 'ph:brain-bold',
    accent: 'violet',
    skills: [
      { name: 'PyTorch', icon: 'logos:pytorch-icon' },
      { name: 'scikit-learn', icon: 'simple-icons:scikitlearn' },
      { name: 'Pandas', icon: 'simple-icons:pandas' },
      { name: 'NumPy', icon: 'logos:numpy' },
      { name: 'NLP / NLTK', icon: 'ph:chat-text-bold' },
      { name: 'Computer Vision', icon: 'ph:eye-bold' },
      { name: 'ETL', icon: 'ph:flow-arrow-bold' },
    ],
  },
  {
    title: 'Cloud & AWS',
    description: 'Architecting and running systems on AWS.',
    icon: 'ph:cloud-bold',
    accent: 'accent',
    skills: [
      { name: 'AWS', icon: 'logos:aws' },
      { name: 'Lambda', icon: 'logos:aws-lambda' },
      { name: 'Amazon EKS', icon: 'logos:kubernetes' },
      { name: 'EC2', icon: 'logos:aws-ec2' },
      { name: 'S3', icon: 'logos:aws-s3' },
      { name: 'SQS / SNS', icon: 'logos:aws-sqs' },
      { name: 'CloudWatch', icon: 'logos:aws-cloudwatch' },
    ],
  },
  {
    title: 'Infrastructure & DevOps',
    description: 'IaC, containers, pipelines, and observability.',
    icon: 'ph:gear-six-bold',
    accent: 'violet',
    skills: [
      { name: 'Terraform', icon: 'logos:terraform-icon' },
      { name: 'Docker', icon: 'logos:docker-icon' },
      { name: 'Kubernetes', icon: 'logos:kubernetes' },
      { name: 'GitHub Actions', icon: 'logos:github-actions' },
      { name: 'Jenkins', icon: 'logos:jenkins' },
      { name: 'DataDog', icon: 'logos:datadog' },
      { name: 'SonarQube', icon: 'logos:sonarqube' },
    ],
  },
  {
    title: 'Architecture & Delivery',
    description: 'How I design and ship close to the customer.',
    icon: 'ph:compass-tool-bold',
    accent: 'accent',
    skills: [
      { name: 'Solution Architecture', icon: 'ph:blueprint-bold' },
      { name: 'Event-Driven Design', icon: 'ph:tree-structure-bold' },
      { name: 'System Design', icon: 'ph:graph-bold' },
      { name: 'Stakeholder Partnership', icon: 'ph:handshake-bold' },
      { name: 'Agile', icon: 'ph:repeat-bold' },
      { name: 'Reliability & Testing', icon: 'ph:shield-check-bold' },
    ],
  },
];

export const skillBars: SkillBarType[] = [
  { stack: 'Python Engineering', level: 92 },
  { stack: 'AWS Cloud & IaC', level: 88 },
  { stack: 'Backend & APIs', level: 85 },
  { stack: 'CI/CD & DevOps', level: 85 },
  { stack: 'AI / ML', level: 75 },
  { stack: 'System Design', level: 80 },
];

/* ------------------------------- EXPERIENCE ------------------------------- */
export const experience: ExperienceType[] = [
  {
    role: 'Associate Architect / Tech Lead',
    company: 'Southwest Airlines',
    client: 'Southwest Airlines',
    companyLogo: '/img/icons/common/Southwest-Airlines.png',
    location: 'Dallas, TX',
    date: 'May 2023 — Present',
    summary:
      'Forward-deployed architect for AWS cloud platforms, infrastructure-as-code, and Python services powering enterprise systems.',
    bullets: [
      'Embedded with the client as a forward-deployed engineer — partnered directly with product, engineering, and business stakeholders to turn ambiguous requirements into shipped systems, owning delivery end-to-end.',
      'Provisioned AWS infrastructure-as-code — EKS (Kubernetes) and EC2 via Terraform and eksctl — and automated cloud-stack operations in Python (boto3).',
      'Built event-driven services with Lambda, SQS/SNS, and S3, and containerized Python applications with Docker for reproducible deployment.',
      'Designed CI/CD pipelines (AWS CodePipeline/CodeBuild, Jenkins, GitHub Actions) with SonarQube quality gates for continuous, reliable delivery.',
      'Instrumented observability with CloudWatch and DataDog, reducing production error rates and hardening reliability across distributed services.',
      'Led the team on architecture and infrastructure standards, mentoring engineers across cross-functional Agile delivery.',
    ],
    tech: [
      'Python',
      'AWS',
      'Terraform',
      'Lambda',
      'Docker',
      'CI/CD',
      'CloudWatch',
      'boto3',
    ],
  },
  {
    role: 'Sr. Software Engineer / Tech Lead',
    company: 'Smile Direct Club',
    client: 'Smile Direct Club',
    companyLogo: '/img/icons/common/smiledirectclub_logo.jpeg',
    location: 'Remote, USA',
    date: 'Oct 2020 — Apr 2023',
    summary:
      'Senior engineer and tech lead for Python services, AWS automation, and containerized delivery — cutting $100K in cloud cost.',
    bullets: [
      'Built Python services and automation across AWS cloud environments, replacing slow, manual processes for the consumer MedTech platform.',
      'Containerized workloads with Docker for reproducible, multi-OS deployment, and tuned CI/CD to shorten feedback loops.',
      'Cut cloud infrastructure costs by $100K through automation and right-sizing, and increased release frequency by 50%.',
      'Reduced manual effort by 70% and improved defect-resolution time by 40% with reliable, maintainable engineering practices.',
      'Hardened reliability with monitoring and consistent code quality across front-end (JavaScript) and back-end work.',
      'Partnered with stakeholders to align delivery with product needs in an Agile environment.',
    ],
    tech: ['Python', 'AWS', 'Docker', 'CI/CD', 'boto3', 'CloudWatch'],
    metrics: [
      { value: '$100K', label: 'Cloud cost saved' },
      { value: '50%', label: 'Faster releases' },
      { value: '70%', label: 'Less manual effort' },
      { value: '40%', label: 'Faster defect resolution' },
    ],
  },
  {
    role: 'Software Engineer',
    company: 'SS&C Technologies (formerly DST)',
    client: 'Amisys',
    companyLogo: '/img/icons/common/ss&c.png',
    location: 'India',
    date: 'May 2019 — May 2020',
    summary:
      'Built Python/Java services and REST APIs for enterprise healthcare-claims web applications, optimizing performance 40%.',
    bullets: [
      'Optimized application code paths and queries to cut page load times by 40%, materially improving user experience.',
      'Integrated REST APIs that expanded functionality and increased user reach by 35%.',
      'Built Python/Java services for enterprise healthcare-claims web applications.',
      'Established a maintainable Java automation framework (Selenium, TestNG) to lock in reliability and catch regressions.',
      'Collaborated cross-functionally to drive feature improvements and resolve defects from user feedback.',
    ],
    tech: ['Java', 'Python', 'REST APIs', 'Selenium', 'TestNG', 'Jira'],
    metrics: [
      { value: '40%', label: 'Faster load times' },
      { value: '35%', label: 'More user reach' },
    ],
  },
];

/* -------------------------------- EDUCATION ------------------------------- */
export const educationInfo: EducationType[] = [
  {
    schoolName: 'Applied AI Course',
    subHeader: 'Machine Learning & Deep Learning Specialization',
    duration: 'May 2020 — May 2021',
  },
  {
    schoolName: 'Vardhaman College of Engineering',
    subHeader: 'B.Tech, Computer Science & Engineering',
    duration: 'Jun 2016 — May 2019',
  },
  {
    schoolName: 'Govt. Polytechnic',
    subHeader: 'Diploma, Computer Science & Engineering',
    duration: 'Jun 2013 — Jun 2016',
  },
];

/* --------------------------------- PROJECTS ------------------------------- */
export const projects: ProjectType[] = [
  {
    name: 'Cloud-Native Infrastructure as Code',
    category: 'Cloud',
    problem:
      'Standing up Kubernetes by hand is slow, error-prone, and impossible to reproduce.',
    desc: 'Provisions an Amazon EKS (Kubernetes) cluster declaratively with eksctl and Terraform — cluster manifests and variables codified for repeatable, version-controlled deployments.',
    highlights: [
      'EKS cluster provisioned via eksctl',
      'Terraform-managed configuration',
      'Reproducible, version-controlled infra',
    ],
    tech: ['AWS EKS', 'Terraform', 'Kubernetes', 'eksctl', 'YAML'],
    impact: 'Repeatable Kubernetes provisioning straight from code.',
    github: 'https://github.com/TadakaSuryaTeja/aws_eks',
    featured: true,
  },
  {
    name: 'Serverless REST API on AWS Lambda',
    category: 'Cloud',
    problem:
      'Always-on servers are overkill and costly for spiky, simple CRUD workloads.',
    desc: 'A pay-per-use CRUD REST API built on AWS Lambda in Python, with custom JSON serialization and a Postman test collection — event-driven and serverless.',
    highlights: [
      'AWS Lambda (Python) handlers',
      'Custom JSON encoder',
      'Postman-tested endpoints',
    ],
    tech: ['AWS Lambda', 'Python', 'API Gateway', 'Postman'],
    impact: 'Event-driven backend with zero idle cost.',
    github: 'https://github.com/TadakaSuryaTeja/sample_CRUD_in_AWS',
    featured: true,
  },
  {
    name: 'NLP Text-Classification Service',
    category: 'AI / ML',
    problem:
      'A trained NLP model is useless until it is served behind an interface users can hit.',
    desc: 'A Django web service that serves an NLP text-classification model end-to-end — training to inference to a usable web interface.',
    highlights: [
      'Django-served ML model',
      'End-to-end train → infer → serve',
      'NLP classification pipeline',
    ],
    tech: ['Python', 'Django', 'NLP', 'NLTK'],
    impact: 'Full ML lifecycle behind a web app.',
    github: 'https://github.com/TadakaSuryaTeja/nlp_webapp',
    featured: true,
  },
  {
    name: 'Personalized Cancer Diagnosis',
    category: 'AI / ML',
    problem:
      'Classifying genetic mutations from dense clinical literature is a high-stakes, high-dimensional NLP problem.',
    desc: 'A machine-learning pipeline that classifies genetic mutations into clinical categories from text — feature engineering, multiclass modeling, and evaluation on a real genomics dataset.',
    highlights: [
      'Genomics NLP',
      'Multiclass classification',
      'Feature engineering + evaluation',
    ],
    tech: ['Python', 'scikit-learn', 'NLP', 'Pandas'],
    impact: 'Applied ML on a real-world healthcare dataset.',
    github: 'https://github.com/TadakaSuryaTeja/PersonalizedCancerDiagnosis',
    featured: true,
  },
  {
    name: 'Broadcom Driver Installer',
    category: 'Open Source',
    problem:
      'Enabling Broadcom Wi-Fi on fresh Linux installs is a notorious, repetitive pain point.',
    desc: 'A robust shell utility that automates Broadcom driver enablement on Linux — adopted by the community with 42 stars and 27 forks.',
    highlights: [
      '⭐ 42 stars · 27 forks',
      'Solves a real hardware-enablement pain',
      'Clean, reusable shell tooling',
    ],
    tech: ['Bash', 'Linux', 'Shell'],
    impact: '40+ developers starred it; forked into active use.',
    github: 'https://github.com/TadakaSuryaTeja/BroadcomInstaller2021',
    featured: true,
  },
  {
    name: 'Computer-Vision Image Classifier',
    category: 'AI / ML',
    problem:
      'Putting a CV model in front of non-technical users requires real serving infrastructure.',
    desc: 'A Flask app serving an image classifier built with scikit-image — upload an image, get a label in real time.',
    highlights: [
      'Flask model serving',
      'scikit-image CV pipeline',
      'Real-time inference UI',
    ],
    tech: ['Python', 'Flask', 'Computer Vision', 'scikit-image'],
    github: 'https://github.com/TadakaSuryaTeja/Image-Classification-WebApp',
  },
  {
    name: 'World Countries REST API',
    category: 'Backend',
    problem: 'Apps need clean, queryable reference data exposed over a stable API.',
    desc: 'A Django REST API exposing world-countries data with clean resource modeling and queryable endpoints.',
    highlights: ['Django REST', 'Resource modeling', 'Queryable endpoints'],
    tech: ['Python', 'Django', 'REST APIs'],
    github: 'https://github.com/TadakaSuryaTeja/API_django',
  },
  {
    name: 'Walmart Sales Forecasting',
    category: 'Data',
    problem:
      'Retail demand is seasonal and noisy; accurate forecasts drive inventory and staffing.',
    desc: 'Time-series forecasting of Walmart store sales — EDA, feature engineering, and regression modeling.',
    highlights: [
      'Time-series forecasting',
      'Feature engineering',
      'EDA + modeling',
    ],
    tech: ['Python', 'Pandas', 'scikit-learn'],
    github: 'https://github.com/TadakaSuryaTeja/Walmart-Sales-Forecasting',
  },
];

/* ------------------------------ CASE STUDIES ------------------------------ */
export const caseStudies: CaseStudyType[] = [
  {
    id: 'smiledirectclub',
    company: 'Smile Direct Club',
    title: 'Cutting $100K in cloud cost through automation & right-sizing',
    period: 'Oct 2020 — Apr 2023',
    accent: 'success',
    problem:
      'A fast-shipping consumer MedTech platform leaned on slow, manual processes and over-provisioned cloud infrastructure. Release velocity was capped, errors leaked late, and costs ran high.',
    approach: [
      'Standardized Python automation and tooling across cloud environments, replacing slow, manual processes.',
      'Containerized workloads with Docker for reproducible execution across multiple OS platforms.',
      'Right-sized cloud infrastructure and tuned CI/CD to cut redundant compute and shorten feedback loops.',
      'Hardened reliability through monitoring and consistent, maintainable engineering practices.',
    ],
    challenges: [
      'Cross-platform parity — identical behavior across browsers, mobile, and desktop.',
      'Right-sizing cloud test infrastructure without losing coverage or speed.',
      'Keeping a large suite reliable while the product changed rapidly.',
    ],
    results: [
      'Reproducible test runs on any OS via Docker',
      'Faster, cheaper feedback loops through CI/CD tuning',
      'A standardized, reusable automation suite',
    ],
    metrics: [
      { value: '$100K', label: 'Cloud cost saved' },
      { value: '50%', label: 'Faster releases' },
      { value: '70%', label: 'Less manual effort' },
      { value: '95%', label: 'Automated coverage' },
    ],
    stack: ['Python', 'AWS', 'Docker', 'CI/CD', 'boto3', 'CloudWatch'],
    architecture: {
      caption:
        'Containerized cross-platform test automation with cost-optimized cloud execution.',
      layers: [
        {
          title: 'Source & CI',
          nodes: [
            { label: 'GitHub', icon: 'ph:github-logo-bold' },
            { label: 'CI/CD', icon: 'ph:infinity-bold' },
          ],
        },
        {
          title: 'Containerize',
          nodes: [{ label: 'Docker', icon: 'logos:docker-icon' }],
        },
        {
          title: 'Test Engine',
          nodes: [
            { label: 'Selenium', icon: 'logos:selenium' },
            { label: 'Appium', icon: 'simple-icons:appium' },
            { label: 'Python', icon: 'logos:python' },
          ],
        },
        {
          title: 'Targets',
          nodes: [
            { label: 'Web', icon: 'ph:browser-bold' },
            { label: 'Mobile', icon: 'ph:device-mobile-bold' },
            { label: 'Desktop', icon: 'ph:desktop-bold' },
          ],
        },
        {
          title: 'Insight',
          nodes: [
            { label: 'Reports', icon: 'ph:chart-bar-bold' },
            { label: 'Jira', icon: 'logos:jira' },
          ],
        },
      ],
    },
  },
  {
    id: 'southwest',
    company: 'Southwest Airlines',
    title: 'An enterprise cloud platform built with Python & infrastructure-as-code',
    period: 'May 2023 — Present',
    accent: 'accent',
    problem:
      'Large-scale, distributed airline systems needed reliable services and AWS infrastructure that could be provisioned on demand and delivered continuously — codified and observable, not hand-maintained.',
    approach: [
      'Provisioned AWS infrastructure-as-code — EKS (Kubernetes) and EC2 via Terraform and eksctl — and automated cloud-stack operations in Python (boto3).',
      'Built event-driven flows with Lambda, SQS/SNS, and S3; containerized Python services with Docker for reproducible deployment.',
      'Designed CI/CD with AWS CodePipeline/CodeBuild, Jenkins, and GitHub Actions, with quality gates via SonarQube.',
      'Instrumented observability with CloudWatch and DataDog, partnering with stakeholders to harden reliability across services.',
    ],
    challenges: [
      'On-demand, repeatable provisioning instead of static, hand-managed infrastructure.',
      'Reliability and visibility across many distributed services.',
      'Aligning a team on reusable, version-controlled infrastructure patterns.',
    ],
    results: [
      'Architect-level ownership of the cloud platform and team',
      'On-demand, version-controlled AWS provisioning (IaC)',
      'Continuous delivery with built-in observability',
      'Reusable infrastructure standards adopted across services',
    ],
    metrics: [
      { value: '80%', label: 'Fewer prod errors' },
      { value: '45%', label: 'Faster data pipelines' },
    ],
    stack: [
      'Python',
      'AWS',
      'Terraform',
      'Lambda',
      'EKS',
      'Docker',
      'CloudWatch',
      'DataDog',
    ],
    architecture: {
      caption:
        'Infrastructure-as-code, event-driven compute, and built-in observability on AWS.',
      layers: [
        {
          title: 'Source & CI',
          nodes: [
            { label: 'GitHub', icon: 'ph:github-logo-bold' },
            { label: 'CodePipeline', icon: 'ph:infinity-bold' },
          ],
        },
        {
          title: 'Provision (IaC)',
          nodes: [
            { label: 'Terraform', icon: 'logos:terraform-icon' },
            { label: 'EKS', icon: 'logos:kubernetes' },
          ],
        },
        {
          title: 'Compute',
          nodes: [
            { label: 'Lambda', icon: 'logos:aws-lambda' },
            { label: 'Docker', icon: 'logos:docker-icon' },
          ],
        },
        {
          title: 'Events & Data',
          nodes: [
            { label: 'SQS / SNS', icon: 'logos:aws-sqs' },
            { label: 'S3', icon: 'logos:aws-s3' },
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
    company: 'SS&C Technologies (DST)',
    title: 'Backend performance & API integration that cut load times 40%',
    period: 'May 2019 — May 2020',
    accent: 'violet',
    problem:
      'Enterprise healthcare-claims web applications needed faster page performance and reliable API integration to improve the user experience.',
    approach: [
      'Optimized application code paths and queries to cut page load times.',
      'Integrated REST APIs that expanded functionality and grew user reach.',
      'Built a maintainable Java automation framework (Selenium, TestNG) to lock in reliability and catch regressions.',
      'Collaborated cross-functionally on feature delivery and defect resolution.',
    ],
    challenges: [
      'Keeping a growing suite maintainable with the POM pattern.',
      'Balancing thorough coverage with execution speed.',
      'Driving performance gains without regressions.',
    ],
    results: [
      'A POM framework adopted for reliable, maintainable web testing',
      'Comprehensive coverage with structured defect tracking',
      'Measurable performance and reach improvements',
    ],
    metrics: [
      { value: '40%', label: 'Faster load times' },
      { value: '35%', label: 'More user reach' },
    ],
    stack: ['Java', 'Selenium', 'TestNG', 'Cucumber', 'Maven', 'Jira'],
    architecture: {
      caption: 'Page Object Model test architecture over Selenium WebDriver.',
      layers: [
        {
          title: 'Specs',
          nodes: [
            { label: 'Cucumber', icon: 'logos:cucumber' },
            { label: 'TestNG', icon: 'carbon:test-tool' },
          ],
        },
        {
          title: 'Page Objects',
          nodes: [
            { label: 'Page Factory', icon: 'ph:squares-four-bold' },
            { label: 'Java', icon: 'logos:java' },
          ],
        },
        {
          title: 'Driver',
          nodes: [{ label: 'Selenium', icon: 'logos:selenium' }],
        },
        {
          title: 'App',
          nodes: [{ label: 'Web App', icon: 'ph:browser-bold' }],
        },
        {
          title: 'Defects',
          nodes: [{ label: 'Jira', icon: 'logos:jira' }],
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
    certificate: 'Machine Learning & Deep Learning',
    issuedby: 'Applied AI Course',
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
    certificate: 'Modern Application Development',
    issuedby: 'NPTEL',
    category: 'Engineering',
    accent: 'accent',
    link: 'https://github.com/TadakaSuryaTeja/Profile/blob/main/Introduction%20to%20Modern%20Application%20Development.jpg',
  },
];

/* ------------------------------ TECH MARQUEE ------------------------------ */
export const techMarquee: MarqueeItemType[] = [
  { name: 'Python', icon: 'logos:python' },
  { name: 'AWS', icon: 'logos:aws' },
  { name: 'Docker', icon: 'logos:docker-icon' },
  { name: 'Django', icon: 'vscode-icons:file-type-django' },
  { name: 'Flask', icon: 'simple-icons:flask' },
  { name: 'TensorFlow', icon: 'logos:tensorflow' },
  { name: 'Selenium', icon: 'logos:selenium' },
  { name: 'Pytest', icon: 'simple-icons:pytest' },
  { name: 'PostgreSQL', icon: 'logos:postgresql' },
  { name: 'GitHub Actions', icon: 'logos:github-actions' },
  { name: 'Jenkins', icon: 'logos:jenkins' },
  { name: 'JavaScript', icon: 'logos:javascript' },
  { name: 'Pandas', icon: 'simple-icons:pandas' },
  { name: 'NumPy', icon: 'logos:numpy' },
  { name: 'Nginx', icon: 'logos:nginx' },
  { name: 'Postman', icon: 'logos:postman-icon' },
];

/* ------------------------------ TESTIMONIALS ------------------------------ */
// Provide real LinkedIn recommendations / manager quotes here.
// The section renders only when this array is non-empty.
export const testimonials: TestimonialType[] = [];

/* ---------------------------------- BLOG ---------------------------------- */
// Add real Medium posts here to render article cards.
// When empty, the Writing section shows a "Read on Medium" call-to-action.
// Real Medium articles. TODO: swap each `link` for the exact article URL
// (and fine-tune the titles) — these currently point to your Medium profile.
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
      'Storing, retrieving, and managing objects in Amazon S3 programmatically with boto3.',
    tag: 'AWS',
    readTime: '5 min',
    link: 'https://medium.com/@suryateja233',
  },
  {
    title: 'Automating NFT Creation & Listing with Python',
    excerpt:
      'Scripting the mint-to-marketplace pipeline end to end with Python automation.',
    tag: 'Python',
    readTime: '7 min',
    link: 'https://medium.com/@suryateja233',
  },
];

/* --------------------------------- CONTACT -------------------------------- */
export const contactInfo: ContactType = {
  title: "Let's build great software together",
  subtitle:
    "Whether you're hiring, collaborating, or just want to talk software, cloud, or AI/ML — my inbox is open.",
  email: '', // TODO: add your email to enable the one-click contact button
};

export const showContactForm = false;

/* ----------------------------------- SEO ---------------------------------- */
export const seoData: SEODataType = {
  title: 'Tadaka Surya Teja — Software Engineer · AI/ML · AWS Solutions Architect',
  description:
    'Tadaka Surya Teja is a software engineer and AWS-certified Solutions Architect with 7+ years across Python backend, AWS cloud architecture, and applied AI/ML — building scalable, production systems.',
  author: 'Tadaka Surya Teja',
  image: '/og.png',
  url: 'https://surya-teja-tadaka.vercel.app/',
  keywords: [
    'Tadaka Surya Teja',
    'Surya Teja Tadaka',
    'Software Engineer',
    'Software Development Engineer',
    'Feature Development Engineer',
    'Python Developer',
    'Backend Engineer',
    'Full Stack Engineer',
    'Application Developer',
    'API Engineer',
    'AI Engineer',
    'Machine Learning Engineer',
    'Data Engineer',
    'Cloud Engineer',
    'AWS Solutions Architect',
    'Software Architect',
    'Associate Architect',
    'DevOps Engineer',
    'Platform Engineer',
    'Technical Lead',
    'Microservices',
    'Event-Driven Architecture',
    'Distributed Systems',
    'Kubernetes',
    'Terraform',
    'Kaggle Expert',
    'Dallas',
  ],
};
