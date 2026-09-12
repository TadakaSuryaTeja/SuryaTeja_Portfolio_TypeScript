/**
 * SYSTEMS I'VE BUILT — the work, tiered.
 *
 * Facts here trace to the résumé (`resume-src/original/`) or to public GitHub
 * repositories. Case-study prose explains engineering *thinking*, which is
 * editorial; every claimed outcome, metric and technology is not.
 *
 * Tiering exists so recent, substantial work dominates the site. Archive
 * entries are real history — kept reachable, never deleted, never featured.
 */
import type { System } from '@/types/systems';

export const systems: System[] = [
  /* ------------------------------ FEATURED ------------------------------- */
  {
    slug: 'enterprise-ai-code-automation',
    name: 'Enterprise AI Code-Automation Platform',
    category: 'Agentic AI',
    tier: 'featured',
    status: 'In production',
    origin: 'Southwest Airlines (Qentelli)',
    period: 'June 2023 — Present',
    problem:
      'A meaningful share of every sprint went to mechanical work: read a ticket, cut a branch, scaffold the code, open the merge request.',
    systemType: 'Multi-agent automation platform',
    summary:
      'Reasoning agents on AWS Bedrock and Amazon Q Business take a Jira ticket and drive it through to an open GitLab merge request — retrieving the summary, generating a feature branch, writing boilerplate, committing and raising the MR with minimal human involvement.',
    contribution: [
      'Designed the platform architecture and led its development end-to-end.',
      'Built the multi-agent orchestration layer and the MCP tool contracts it calls.',
      'Owned technical discovery, requirements, CI/CD, AWS deployment and monitoring.',
      'Presented demos and technical documentation to leadership.',
    ],
    tech: ['AWS Bedrock', 'Amazon Q', 'MCP', 'Multi-Agent', 'Python', 'GitLab CI', 'Terraform'],
    architecture: {
      caption:
        'A ticket enters, a merge request leaves. Agents reach enterprise systems only through typed MCP tools, and ground their reasoning in retrieved documentation.',
      nodes: [
        { id: 'engineer', label: 'Engineer', category: 'user', icon: 'ph:user-bold', row: 0, description: 'Files or picks up a Jira ticket, then reviews the merge request the platform opens.' },
        { id: 'jira', label: 'Jira Ticket', category: 'user', icon: 'logos:jira', row: 0, description: 'The trigger. Ticket summary and acceptance criteria become the agent’s task definition.' },
        { id: 'orchestrator', label: 'Agent Orchestrator', category: 'ai', icon: 'ph:circles-three-bold', row: 1, description: 'Plans the work into steps, routes each step to a model or a tool, and decides when to stop or hand back to a human.' },
        { id: 'q', label: 'Amazon Q Business', category: 'ai', icon: 'logos:aws', row: 1, description: 'Enterprise assistant layer providing business-context answers alongside the custom agents.' },
        { id: 'bedrock', label: 'Bedrock LLMs', category: 'ai', icon: 'ph:brain-bold', row: 2, description: 'Claude, Llama and Titan behind reasoning agents — chosen per task rather than defaulting to one model.' },
        { id: 'rag', label: 'RAG Retriever', category: 'ai', icon: 'ph:magnifying-glass-bold', row: 2, description: 'Grounds generation in retrieved Confluence documentation so output reflects how this org actually builds.' },
        { id: 'mcp-jira', label: 'Jira MCP', category: 'backend', icon: 'ph:plugs-connected-bold', row: 3, description: 'Typed tool contract for reading tickets and writing comments — the agent calls a capability, not a raw API.' },
        { id: 'mcp-gitlab', label: 'GitLab MCP', category: 'backend', icon: 'logos:gitlab', row: 3, description: 'Branch creation, commits and merge-request operations exposed as structured, auditable tools.' },
        { id: 'mcp-xray', label: 'Xray MCP', category: 'backend', icon: 'ph:wrench-bold', row: 3, description: 'Test-management operations, so generated work can be tied back to test coverage.' },
        { id: 'vector', label: 'Vector Store', category: 'data', icon: 'ph:vector-three-bold', row: 4, description: 'Embedded Confluence chunks backing retrieval.' },
        { id: 'confluence', label: 'Confluence', category: 'data', icon: 'ph:files-bold', row: 4, description: 'Thousands of pages of internal engineering documentation — the knowledge the platform reasons over.' },
        { id: 'guardrails', label: 'Guardrails', category: 'infra', icon: 'ph:shield-check-bold', row: 5, description: 'Rate limiting, structured error handling and fallback paths so a failed step degrades instead of cascading.' },
        { id: 'obs', label: 'Observability', category: 'infra', icon: 'logos:grafana', row: 5, description: 'Traces and metrics over agent runs — without them a non-deterministic system is undebuggable.' },
      ],
      edges: [
        { source: 'engineer', target: 'jira' },
        { source: 'jira', target: 'orchestrator', label: 'task' },
        { source: 'orchestrator', target: 'q' },
        { source: 'orchestrator', target: 'bedrock', label: 'reason' },
        { source: 'orchestrator', target: 'rag', label: 'ground' },
        { source: 'rag', target: 'vector' },
        { source: 'vector', target: 'confluence' },
        { source: 'orchestrator', target: 'mcp-jira', label: 'tool call' },
        { source: 'orchestrator', target: 'mcp-gitlab', label: 'tool call' },
        { source: 'orchestrator', target: 'mcp-xray', label: 'tool call' },
        { source: 'mcp-gitlab', target: 'guardrails' },
        { source: 'mcp-jira', target: 'guardrails' },
        { source: 'guardrails', target: 'obs' },
      ],
    },
    caseStudy: {
      context:
        'Engineering capacity at an airline is finite and heavily spoken for. The work being burned here was not hard, it was repetitive: translating a ticket into the same five mechanical steps, dozens of times a sprint. Automating it returns capacity to the work that actually needs judgement — and does so without asking anyone to change how they already use Jira and GitLab.',
      systemFlow: [
        'An engineer picks up a Jira ticket; the platform receives the ticket identifier.',
        'The orchestrator retrieves the ticket summary and acceptance criteria through the Jira MCP tool.',
        'Relevant internal documentation is retrieved from the vector store and attached as grounding context.',
        'A Bedrock model is selected for the step — comprehension, generation or documentation — and produces a plan.',
        'The agent creates a feature branch and writes boilerplate through the GitLab MCP tool.',
        'Changes are committed and a merge request is opened, annotated with the originating ticket.',
        'The engineer reviews the MR. Human approval remains the gate; the platform never merges on its own.',
      ],
      technicalDecisions: [
        {
          decision: 'Expose enterprise systems through MCP servers instead of direct API calls from the agent.',
          rationale:
            'A typed tool contract makes every capability explicit and auditable. It also means a new agent workflow reuses the same tools rather than re-implementing Jira and GitLab access — and a tool can be tested independently of any model.',
        },
        {
          decision: 'Ground generation in retrieved documentation rather than relying on the model alone.',
          rationale:
            'General code generation produces plausible code that ignores local conventions. Retrieval over internal documentation keeps output consistent with how this organisation actually builds.',
        },
        {
          decision: 'Route tasks across Claude, Llama and Titan instead of standardising on one model.',
          rationale:
            'The tasks are genuinely different — ticket comprehension, code generation and documentation have different cost and quality profiles. Choosing per task is cheaper and better than a single default.',
        },
        {
          decision: 'Keep a human review gate on every merge request.',
          rationale:
            'Removing the review step would have been easy and wrong. The value is in eliminating mechanical work, not in removing engineering judgement from the loop.',
        },
      ],
      aiArchitecture: [
        'Orchestration layer decomposes a ticket into discrete, individually retryable steps.',
        'Retrieval-augmented context assembled per step rather than stuffed into one prompt.',
        'Tool calling through MCP with structured arguments and typed responses.',
        'Per-task model selection across Bedrock foundation models.',
      ],
      dataArchitecture: [
        'Confluence pages ingested, chunked and embedded into a vector store.',
        'Retrieval tuned for internal engineering documentation rather than general prose.',
        'Re-ingestion keeps the index aligned with documentation as it changes.',
      ],
      infrastructure: [
        'Python services deployed on AWS, provisioned with Terraform.',
        'GitLab CI pipelines for build, test and deployment.',
        'CloudWatch and Grafana for metrics and traces across agent runs.',
      ],
      security: [
        'Agents hold no ambient credentials — every privileged action goes through an MCP tool with its own scoped access.',
        'Tool surface is an allowlist: an agent can only do what a tool explicitly exposes.',
        'Human approval required before any merge.',
      ],
      reliability: [
        'Rate limiting protects both the foundation models and the enterprise APIs behind the tools.',
        'Structured error handling with fallback paths so a failed step degrades rather than cascading.',
        'Observability over agent runs — traces are what make a non-deterministic system debuggable.',
      ],
      challenges: [
        'Keeping agent tool access auditable and safe across three separate enterprise systems.',
        'Retrieval quality over heterogeneous, inconsistently structured internal documentation.',
        'Making a non-deterministic system reliable enough that engineers trust it in their daily workflow.',
      ],
      tradeoffs: [
        {
          chose: 'Structured MCP tool contracts',
          over: 'Free-form API access from the agent',
          because:
            'Slower to build, but it made the blast radius of a bad generation knowable — and the tools became reusable across workflows.',
        },
        {
          chose: 'Human review on every merge request',
          over: 'Fully autonomous merging',
          because:
            'Trust is the adoption constraint. An autonomous merge that goes wrong once costs more than the review step ever saves.',
        },
        {
          chose: 'Per-task model routing',
          over: 'One model everywhere',
          because:
            'More configuration surface to maintain, but materially better cost and quality per task.',
        },
      ],
      outcome: [
        'A production multi-agent platform, owned end-to-end from discovery through rollout.',
        'Reusable MCP tool servers shared across agent workflows.',
        'Demonstrated reductions in engineering cycle time and manual workload to leadership.',
      ],
      improvements: [
        'A proper offline evaluation harness. Today quality is judged largely by review outcomes; a scored regression suite over historical tickets would let the platform change models confidently.',
        'Cost attribution per agent run. Knowing the per-ticket token cost would make model routing a measured decision rather than a reasoned one.',
        'Richer failure taxonomy. Fallbacks currently handle failure generically; classifying *why* a run failed would let the orchestrator retry intelligently instead of uniformly.',
      ],
    },
  },

  {
    slug: 'mcp-tool-servers',
    name: 'Custom MCP Tool Servers',
    category: 'Agentic AI',
    tier: 'featured',
    status: 'In production',
    origin: 'Southwest Airlines (Qentelli)',
    period: 'June 2023 — Present',
    problem:
      'Agents that reach enterprise systems through ad-hoc prompt glue are unsafe, unauditable and impossible to extend.',
    systemType: 'Model Context Protocol tool layer',
    summary:
      'Jira, GitLab and Xray exposed to agents as typed Model Context Protocol tools. Agents call a capability through a contract instead of improvising API requests, so tool access is explicit, auditable and reusable across workflows.',
    contribution: [
      'Designed the tool contracts and their argument/response schemas.',
      'Implemented the MCP servers and the access scoping behind them.',
      'Made the tool layer reusable across multiple agent workflows.',
    ],
    tech: ['MCP', 'Python', 'Jira API', 'GitLab API', 'Xray', 'Tool Calling'],
    architecture: {
      caption:
        'One protocol between reasoning and enterprise systems: the agent knows capabilities, not endpoints.',
      nodes: [
        { id: 'agent', label: 'Agent', category: 'ai', icon: 'ph:circles-three-bold', row: 0, description: 'Requests a capability by name with structured arguments — it never constructs an HTTP call.' },
        { id: 'mcp', label: 'MCP Server', category: 'backend', icon: 'ph:plugs-connected-bold', row: 1, description: 'Validates arguments, enforces scope, translates the call into the system’s real API and returns a typed response.' },
        { id: 'schema', label: 'Tool Schema', category: 'backend', icon: 'ph:brackets-curly-bold', row: 1, description: 'The contract. Declares what each tool accepts and returns, so bad calls fail at the boundary.' },
        { id: 'jira', label: 'Jira', category: 'data', icon: 'logos:jira', row: 2, description: 'Ticket read and comment operations.' },
        { id: 'gitlab', label: 'GitLab', category: 'data', icon: 'logos:gitlab', row: 2, description: 'Branch, commit and merge-request operations.' },
        { id: 'xray', label: 'Xray', category: 'data', icon: 'ph:wrench-bold', row: 2, description: 'Test-management operations.' },
        { id: 'audit', label: 'Audit Trail', category: 'infra', icon: 'ph:list-checks-bold', row: 3, description: 'Every tool invocation is a discrete, loggable event — which is what makes agent behaviour reviewable after the fact.' },
      ],
      edges: [
        { source: 'agent', target: 'mcp', label: 'tool call' },
        { source: 'schema', target: 'mcp' },
        { source: 'mcp', target: 'jira' },
        { source: 'mcp', target: 'gitlab' },
        { source: 'mcp', target: 'xray' },
        { source: 'mcp', target: 'audit' },
      ],
    },
    caseStudy: {
      context:
        'Every team building agents hits the same wall: the model is fine, but letting it touch real systems is terrifying. The usual answer is to hand the agent API credentials and hope the prompt holds. That does not survive a security review, and it does not survive the second workflow either, because none of the integration is reusable.',
      systemFlow: [
        'An agent decides it needs a capability — read a ticket, open a merge request.',
        'It issues an MCP tool call with structured arguments against a published schema.',
        'The MCP server validates the arguments and rejects anything outside the contract.',
        'The server performs the real API call using its own scoped credentials.',
        'A typed response returns to the agent; the invocation is recorded as an auditable event.',
      ],
      technicalDecisions: [
        {
          decision: 'Adopt MCP rather than building a bespoke function-calling layer.',
          rationale:
            'A standard protocol means the tools are not welded to one model or one framework. Swapping the reasoning layer does not mean rewriting the integrations.',
        },
        {
          decision: 'Keep credentials in the server, never in the agent context.',
          rationale:
            'A credential inside a prompt is a credential one injection away from leaking. The agent asks for an action; the server decides whether it is allowed.',
        },
        {
          decision: 'One server per enterprise system.',
          rationale:
            'Clear ownership and blast-radius boundaries. A change to test tooling cannot break ticket access.',
        },
      ],
      security: [
        'Scoped credentials held server-side, never exposed to the model.',
        'Argument validation at the boundary — malformed or out-of-contract calls never reach the real API.',
        'Allowlist semantics: absent a tool, the capability simply does not exist for the agent.',
      ],
      reliability: [
        'Per-tool rate limiting protects the upstream enterprise APIs.',
        'Typed errors let the orchestrator distinguish "retry" from "give up and ask a human".',
      ],
      challenges: [
        'Designing tool granularity — too coarse and the agent cannot express intent, too fine and it spends its context negotiating.',
        'Mapping enterprise API semantics onto clean contracts without leaking their quirks to the model.',
      ],
      tradeoffs: [
        {
          chose: 'Typed contracts with validation',
          over: 'Passing through raw API payloads',
          because:
            'More schema to maintain, but it moves failure from "the agent did something strange in production" to "the call was rejected at the boundary".',
        },
      ],
      outcome: [
        'A reusable tool layer shared across agent workflows.',
        'Agent behaviour that is reviewable after the fact, because every action is a discrete event.',
      ],
      improvements: [
        'Publish a sanitised version as open source. The pattern is generic and the public artifact would be worth more than any description of it.',
        'Contract tests per tool, so an upstream API change fails in CI rather than mid-agent-run.',
        'Per-tool cost and latency metrics to find which capabilities agents actually lean on.',
      ],
    },
  },

  {
    slug: 'confluence-rag-assistant',
    name: 'Confluence RAG Knowledge Assistant',
    category: 'Generative AI',
    tier: 'featured',
    status: 'In production',
    origin: 'Southwest Airlines (Qentelli)',
    period: 'June 2023 — Present',
    problem:
      'Thousands of Confluence pages held the answers engineers needed, but search returned documents rather than answers.',
    systemType: 'Retrieval-augmented generation pipeline',
    summary:
      'Enterprise documentation ingested, chunked and embedded into a vector store, with retrieval tuned for internal engineering questions and answers served through Bedrock models — grounded in real documentation rather than model recall.',
    contribution: [
      'Designed and built the ingestion, chunking and embedding pipeline.',
      'Tuned retrieval for heterogeneous internal documentation.',
      'Integrated retrieval with Bedrock models and the wider agent platform.',
    ],
    tech: ['RAG', 'Embeddings', 'Vector DB', 'AWS Bedrock', 'Python'],
    architecture: {
      caption: 'Documents in, grounded answers out — retrieval is the part that decides whether the answer is true.',
      nodes: [
        { id: 'docs', label: 'Confluence', category: 'data', icon: 'ph:files-bold', row: 0, description: 'Thousands of internal engineering pages, inconsistently structured and constantly changing.' },
        { id: 'ingest', label: 'Ingestion', category: 'backend', icon: 'ph:download-simple-bold', row: 1, description: 'Pulls pages, strips markup and normalises them into clean text.' },
        { id: 'chunk', label: 'Chunking', category: 'backend', icon: 'ph:squares-four-bold', row: 1, description: 'Splits documents so a retrieved chunk is self-contained — the single biggest lever on answer quality.' },
        { id: 'embed', label: 'Embeddings', category: 'ai', icon: 'ph:vector-three-bold', row: 2, description: 'Turns chunks into vectors so retrieval can work on meaning rather than keywords.' },
        { id: 'vector', label: 'Vector Store', category: 'data', icon: 'ph:database-bold', row: 2, description: 'Indexed chunks queried by similarity at request time.' },
        { id: 'retriever', label: 'Retriever', category: 'ai', icon: 'ph:magnifying-glass-bold', row: 3, description: 'Selects the context that actually goes to the model — the quality ceiling of the whole system.' },
        { id: 'llm', label: 'Bedrock LLM', category: 'ai', icon: 'ph:brain-bold', row: 4, description: 'Generates the answer constrained to retrieved context rather than parametric memory.' },
        { id: 'answer', label: 'Grounded Answer', category: 'user', icon: 'ph:chat-text-bold', row: 5, description: 'An answer an engineer can act on, traceable back to the documentation it came from.' },
      ],
      edges: [
        { source: 'docs', target: 'ingest' },
        { source: 'ingest', target: 'chunk' },
        { source: 'chunk', target: 'embed' },
        { source: 'embed', target: 'vector' },
        { source: 'retriever', target: 'vector', label: 'similarity' },
        { source: 'retriever', target: 'llm', label: 'context' },
        { source: 'llm', target: 'answer' },
      ],
    },
    caseStudy: {
      context:
        'The documentation existed. That was never the problem. The problem was that finding the one paragraph that answered your question meant reading six pages that nearly did, so people asked a colleague instead — which is the expensive path, twice over.',
      systemFlow: [
        'Confluence pages are pulled, stripped of markup and normalised.',
        'Documents are chunked so each chunk stands on its own.',
        'Chunks are embedded and indexed in the vector store.',
        'A question is embedded and matched against the index.',
        'Retrieved context is assembled and passed to a Bedrock model.',
        'The model answers constrained to that context rather than from parametric memory.',
      ],
      technicalDecisions: [
        {
          decision: 'Invest in chunking strategy before touching model selection.',
          rationale:
            'Retrieval sets the ceiling. A better model cannot answer from context it was never given, and swapping models is the easy knob people reach for first.',
        },
        {
          decision: 'Constrain generation to retrieved context.',
          rationale:
            'An answer from model memory is confident and occasionally wrong, which is the worst combination for internal engineering guidance.',
        },
        {
          decision: 'Re-ingest as documentation changes rather than indexing once.',
          rationale:
            'A stale index is worse than no index — it answers authoritatively about a system that has moved on.',
        },
      ],
      aiArchitecture: [
        'Embedding-based semantic retrieval over chunked enterprise documentation.',
        'Context assembly per question with relevance-ordered chunks.',
        'Generation constrained to retrieved context, served by Bedrock foundation models.',
      ],
      dataArchitecture: [
        'Ingestion pipeline normalising heterogeneous Confluence markup.',
        'Chunking tuned so retrieved units are self-contained.',
        'Vector index refreshed as source documentation changes.',
      ],
      reliability: [
        'Retrieval failures degrade to "I could not find this documented" rather than to invention.',
        'Error handling and rate limiting shared with the wider agent platform.',
      ],
      challenges: [
        'Heterogeneous documentation: some pages are specifications, some are meeting notes, and they need different chunking.',
        'Questions that span several documents, where a single top-k retrieval returns none of them completely.',
        'Keeping the index current without re-embedding everything on every change.',
      ],
      tradeoffs: [
        {
          chose: 'Tighter, self-contained chunks',
          over: 'Larger chunks with more surrounding context',
          because:
            'Precision mattered more than recall here — a wrong-but-confident answer about internal process costs more than a missed one.',
        },
        {
          chose: 'Grounded-only answers',
          over: 'Letting the model fall back on general knowledge',
          because:
            'The value of the system is that it speaks for this organisation, not for the internet.',
        },
      ],
      outcome: [
        'Engineering answers sourced from internal documentation rather than tribal knowledge.',
        'Retrieval layer reused as grounding for the wider agent platform.',
      ],
      improvements: [
        'Add a reranking stage. Top-k similarity is a blunt instrument, and reranking is the cheapest quality win still on the table.',
        'Measure groundedness explicitly instead of inferring it from user reports.',
        'Handle multi-document questions with query decomposition rather than one retrieval pass.',
      ],
    },
  },

  {
    slug: 'teradata-redshift-streaming-platform',
    name: 'Teradata → Redshift Migration & Streaming Platform',
    category: 'Data Platforms',
    tier: 'featured',
    status: 'Shipped',
    origin: 'Smile Direct Club (Qentelli)',
    period: 'Oct 2020 — May 2023',
    problem:
      'An on-prem Teradata warehouse capped scale and cost, with no path to real-time event processing.',
    systemType: 'Warehouse migration + streaming data platform',
    summary:
      'A zero-data-loss migration to AWS Redshift alongside a Confluent Kafka streaming backbone and automated Glue ETL into S3/Parquet — with data-quality monitoring, 95% automated ETL coverage and Terraform-provisioned environments.',
    contribution: [
      'Led the migration and owned its zero-data-loss guarantee.',
      'Architected and deployed the Kafka streaming layer on AWS.',
      'Automated Glue ETL and built the data-quality monitoring around it.',
      'Converted manual environment builds to Terraform and YAML IaC.',
    ],
    tech: ['Redshift', 'Kafka', 'AWS Glue', 'S3/Parquet', 'Step Functions', 'DynamoDB', 'Terraform', 'DataDog'],
    metrics: [
      { value: '$100K', label: 'Annual cloud cost saved' },
      { value: '95%', label: 'ETL test coverage' },
      { value: '30%', label: 'Fewer pipeline failures' },
      { value: '50%', label: 'Faster env setup' },
    ],
    architecture: {
      caption: 'Batch and streaming converge in Parquet on S3, warehoused in Redshift, watched end-to-end.',
      nodes: [
        { id: 'teradata', label: 'Teradata', category: 'data', icon: 'ph:database-bold', row: 0, description: 'The on-prem warehouse being migrated away from — capacity-bound and expensive.' },
        { id: 'events', label: 'App Events', category: 'user', icon: 'ph:lightning-bold', row: 0, description: 'Product events that previously had no real-time path into analytics.' },
        { id: 'kafka', label: 'Confluent Kafka', category: 'data', icon: 'simple-icons:apachekafka', row: 1, description: 'Streaming backbone decoupling producers from consumers and enabling event-driven processing.' },
        { id: 'queues', label: 'SQS / SNS', category: 'cloud', icon: 'logos:aws-sqs', row: 1, description: 'Buffering and fan-out between pipeline stages.' },
        { id: 'glue', label: 'Glue ETL', category: 'data', icon: 'logos:aws-glue', row: 2, description: 'Automated transformation jobs replacing manual, failure-prone operations.' },
        { id: 'sfn', label: 'Step Functions', category: 'cloud', icon: 'logos:aws-step-functions', row: 2, description: 'Orchestrates multi-step workflows so partial failures are visible and retryable.' },
        { id: 'lambda', label: 'Lambda', category: 'cloud', icon: 'logos:aws-lambda', row: 2, description: 'Event-driven compute for lightweight transformation and routing.' },
        { id: 's3', label: 'S3 / Parquet', category: 'data', icon: 'logos:aws-s3', row: 3, description: 'Columnar landing zone — cheap to store and fast to scan.' },
        { id: 'redshift', label: 'Redshift', category: 'data', icon: 'logos:aws-redshift', row: 3, description: 'The destination warehouse, tuned for query performance and cost.' },
        { id: 'dynamo', label: 'DynamoDB', category: 'data', icon: 'logos:aws-dynamodb', row: 3, description: 'Low-latency operational state alongside the analytical store.' },
        { id: 'quality', label: 'Data Quality', category: 'infra', icon: 'ph:shield-check-bold', row: 4, description: 'SonarQube and DataDog checks catching pipeline failures that used to surface as silently wrong dashboards.' },
        { id: 'cw', label: 'CloudWatch', category: 'infra', icon: 'logos:aws-cloudwatch', row: 4, description: 'Metrics and alerting, tuned to cut false alerts rather than maximise them.' },
      ],
      edges: [
        { source: 'teradata', target: 'glue', label: 'migrate' },
        { source: 'events', target: 'kafka' },
        { source: 'kafka', target: 'glue' },
        { source: 'kafka', target: 'queues' },
        { source: 'queues', target: 'lambda' },
        { source: 'glue', target: 's3' },
        { source: 'sfn', target: 'glue' },
        { source: 'lambda', target: 'dynamo' },
        { source: 's3', target: 'redshift' },
        { source: 'glue', target: 'quality' },
        { source: 'quality', target: 'cw' },
      ],
    },
    caseStudy: {
      context:
        'The warehouse was the company’s analytical backbone, and it was the wrong shape: capacity you had to buy ahead of time, cost that only went up, and no answer at all for anything that needed to be real-time. Migrating it is the kind of project where nobody thanks you if it goes well and everybody notices if a single row goes missing.',
      systemFlow: [
        'Historical data is extracted from Teradata and validated against source counts.',
        'Glue jobs transform and land it in S3 as Parquet.',
        'Parquet is loaded into Redshift and reconciled before cutover.',
        'In parallel, application events flow into Confluent Kafka for real-time processing.',
        'Step Functions orchestrate multi-stage workflows; Lambda handles event-driven transforms.',
        'Quality checks and CloudWatch alerting run across both paths.',
      ],
      technicalDecisions: [
        {
          decision: 'Land everything in S3 as Parquet before loading Redshift.',
          rationale:
            'Decouples extraction from loading, makes reprocessing cheap, and leaves a columnar copy that other consumers can read without touching the warehouse.',
        },
        {
          decision: 'Reconcile rather than trust the migration.',
          rationale:
            '"Zero data loss" is a claim you have to be able to prove. Validation against source counts is what turns it from a hope into a guarantee.',
        },
        {
          decision: 'Add Kafka alongside the migration rather than after it.',
          rationale:
            'The streaming gap was the reason the warehouse was limiting. Migrating without addressing it would have moved the problem to a new bill.',
        },
        {
          decision: 'Convert environments to Terraform during the project.',
          rationale:
            'A migration needs environments rebuilt repeatedly. Manual builds would have made every dry run expensive; IaC cut setup time in half.',
        },
      ],
      dataArchitecture: [
        'Batch and streaming paths converging on a shared Parquet landing zone.',
        'Redshift and BigQuery warehouse models tuned for query performance and cost.',
        'A reusable Python data-generation library (JSON, CSV, XML) shared across teams.',
      ],
      infrastructure: [
        'Terraform and YAML IaC replacing manual environment builds.',
        'CI/CD workflows for data pipelines with automated tests.',
      ],
      reliability: [
        '95% automated test coverage across ETL processes.',
        'Unit and integration tests on pipelines, improving schema consistency.',
        'Observability via CloudWatch, OpenSearch and SNS, tuned to cut false alerts by 20%.',
      ],
      challenges: [
        'Guaranteeing zero data loss while cutting over a live analytical warehouse.',
        'Making batch and streaming pipelines observable enough to catch silent failures.',
        'Reducing cloud spend without sacrificing pipeline coverage or data freshness.',
      ],
      tradeoffs: [
        {
          chose: 'S3/Parquet as an intermediate landing zone',
          over: 'Direct Teradata-to-Redshift transfer',
          because:
            'An extra hop and extra storage, but reprocessing became cheap and the migration became restartable instead of all-or-nothing.',
        },
        {
          chose: 'Investing in test coverage during the migration',
          over: 'Migrating first and hardening later',
          because:
            'Pipelines that fail silently produce wrong dashboards, and wrong dashboards are discovered late and expensively.',
        },
      ],
      outcome: [
        'Zero-loss warehouse migration with improved downstream query performance.',
        'Real-time event processing on Confluent Kafka.',
        '$100K annual cloud cost reduction, 30% fewer pipeline failures, 50% faster environment setup.',
      ],
      improvements: [
        'Data contracts between producers and pipelines. Most schema breakage originated upstream, and tests caught it later than a contract would have.',
        'Automated cost attribution per pipeline, so the $100K saving becomes a monitored budget rather than a one-time win.',
        'Formal data lineage — reconciliation proved correctness once; lineage would prove it continuously.',
      ],
    },
  },

  /* -------------------------------- LAB ---------------------------------- */
  {
    slug: 'model-routing',
    name: 'Per-task model routing across Bedrock',
    category: 'Generative AI',
    tier: 'lab',
    status: 'Shipped',
    origin: 'Southwest Airlines (Qentelli)',
    problem: 'Defaulting to one foundation model for every task is convenient and usually wrong.',
    systemType: 'Model selection experiment',
    summary:
      'Comparing Claude, Llama and Titan per task — code generation, ticket comprehension, documentation — rather than standardising on a single model, and routing accordingly.',
    contribution: ['Evaluated model behaviour per task class and implemented the routing.'],
    tech: ['AWS Bedrock', 'Claude', 'Llama', 'Titan'],
  },
  {
    slug: 'agent-guardrails',
    name: 'Agent reliability guardrails',
    category: 'Agentic AI',
    tier: 'lab',
    status: 'In production',
    origin: 'Southwest Airlines (Qentelli)',
    problem: 'Non-deterministic systems fail in ways that ordinary error handling does not anticipate.',
    systemType: 'Reliability layer',
    summary:
      'Rate limiting, structured error handling, observability and fallback paths so agent workflows degrade predictably instead of failing loudly.',
    contribution: ['Designed and implemented the guardrail layer across agent workflows.'],
    tech: ['Observability', 'Rate limiting', 'Fallbacks', 'Python'],
  },
  {
    slug: 'llm-evaluation-harness',
    name: 'LLM evaluation harness',
    category: 'Generative AI',
    tier: 'lab',
    status: 'Exploring',
    origin: 'Personal',
    problem: 'Retrieval and generation quality are currently judged by review outcomes rather than measured.',
    systemType: 'Evaluation tooling',
    summary:
      'Building a scored regression suite over internal engineering questions so retrieval and generation changes can be evaluated offline instead of in production. Actively in progress — not yet a shipped system.',
    contribution: ['Ongoing personal work; scoped and in progress.'],
    tech: ['Evaluation', 'RAG', 'Python'],
  },

  /* ----------------------------- ARCHIVE --------------------------------- */
  {
    slug: 'aws-eks-iac',
    name: 'Cloud-Native Infrastructure as Code',
    category: 'Cloud Platforms',
    tier: 'archive',
    status: 'Shipped',
    origin: 'Personal',
    problem: 'Standing up Kubernetes by hand is slow, error-prone and impossible to reproduce.',
    systemType: 'Infrastructure-as-code project',
    summary:
      'Provisions an Amazon EKS cluster declaratively with eksctl and Terraform — cluster manifests and variables codified for repeatable, version-controlled deployments.',
    contribution: ['Sole author.'],
    tech: ['AWS EKS', 'Terraform', 'Kubernetes', 'eksctl'],
    github: 'https://github.com/TadakaSuryaTeja/aws_eks',
  },
  {
    slug: 'serverless-crud-api',
    name: 'Serverless REST API on AWS Lambda',
    category: 'Cloud Platforms',
    tier: 'archive',
    status: 'Shipped',
    origin: 'Personal',
    problem: 'Always-on servers are overkill and costly for spiky CRUD workloads.',
    systemType: 'Serverless backend',
    summary:
      'A pay-per-use CRUD REST API on AWS Lambda in Python, with custom JSON serialization and a Postman test collection.',
    contribution: ['Sole author.'],
    tech: ['AWS Lambda', 'Python', 'API Gateway'],
    github: 'https://github.com/TadakaSuryaTeja/sample_CRUD_in_AWS',
  },
  {
    slug: 'broadcom-installer',
    name: 'Broadcom Driver Installer',
    category: 'Developer Tools',
    tier: 'archive',
    status: 'Shipped',
    origin: 'Personal · Open source',
    problem: 'Enabling Broadcom Wi-Fi on fresh Linux installs is a notorious, repetitive pain point.',
    systemType: 'Open-source CLI utility',
    summary:
      'A shell utility automating Broadcom driver enablement on Linux, adopted by the community with 42 stars and 27 forks.',
    contribution: ['Sole author and maintainer.'],
    tech: ['Bash', 'Linux', 'Shell'],
    github: 'https://github.com/TadakaSuryaTeja/BroadcomInstaller2021',
  },
  {
    slug: 'nlp-text-classification-service',
    name: 'NLP Text-Classification Service',
    category: 'Product Engineering',
    tier: 'archive',
    status: 'Archived',
    origin: 'Personal',
    problem: 'A trained NLP model is useless until it is served behind an interface users can hit.',
    systemType: 'ML serving application',
    summary:
      'A Django web service serving an NLP text-classification model end-to-end — training to inference to a usable web interface.',
    contribution: ['Sole author.'],
    tech: ['Python', 'Django', 'NLP', 'NLTK'],
    github: 'https://github.com/TadakaSuryaTeja/nlp_webapp',
  },
  {
    slug: 'personalized-cancer-diagnosis',
    name: 'Personalized Cancer Diagnosis',
    category: 'Product Engineering',
    tier: 'archive',
    status: 'Archived',
    origin: 'Personal',
    problem: 'Classifying genetic mutations from dense clinical literature is a high-dimensional NLP problem.',
    systemType: 'Applied ML pipeline',
    summary:
      'A machine-learning pipeline classifying genetic mutations into clinical categories from text — feature engineering, multiclass modeling and evaluation on a real genomics dataset.',
    contribution: ['Sole author.'],
    tech: ['Python', 'scikit-learn', 'NLP', 'Pandas'],
    github: 'https://github.com/TadakaSuryaTeja/PersonalizedCancerDiagnosis',
  },
  {
    slug: 'world-countries-api',
    name: 'World Countries REST API',
    category: 'Product Engineering',
    tier: 'archive',
    status: 'Archived',
    origin: 'Personal',
    problem: 'Apps need clean, queryable reference data exposed over a stable API.',
    systemType: 'REST API',
    summary: 'A Django REST API exposing world-countries data with clean resource modeling and queryable endpoints.',
    contribution: ['Sole author.'],
    tech: ['Python', 'Django', 'REST APIs'],
    github: 'https://github.com/TadakaSuryaTeja/API_django',
  },
];

export const featuredSystems = systems.filter((s) => s.tier === 'featured');
export const labSystems = systems.filter((s) => s.tier === 'lab');
export const archiveSystems = systems.filter((s) => s.tier === 'archive');

/** Systems with enough depth to justify a dedicated case-study page. */
export const caseStudySystems = systems.filter((s) => s.caseStudy);

export function getSystem(slug: string) {
  return systems.find((s) => s.slug === slug);
}
