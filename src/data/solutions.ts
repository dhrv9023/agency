export interface SolutionItem {
  id: string;
  slug: string;
  number: string;
  badge: string;
  title: string;
  tagline: string;
  description: string;
  flow: string;
  features: string[];
  deliverables: string[];
  techStack: string[];
}

export const SOLUTIONS: SolutionItem[] = [
  {
    id: "01",
    slug: "ai-automation",
    number: "01",
    badge: "01 // AUTOMATION PIPELINES",
    title: "AI Automation",
    tagline: "End-to-end event-driven orchestration across legacy systems and modern APIs.",
    description: "Connect disparate SaaS platforms, proprietary databases, and enterprise APIs into self-healing, event-driven pipelines that eliminate repetitive manual handoffs.",
    flow: "Webhook Trigger → Schema Sanitization → Policy Guardrail → Idempotent Tool Execution → Real-time State Reconciliation",
    features: [
      "Event-driven webhook ingestion with retry queues and dead-letter channels",
      "Strict JSON schema validation and zero-loss error boundaries",
      "Bi-directional synchronization between legacy ERPs and modern CRMs",
      "Self-healing automation loops that flag exceptions for human review"
    ],
    deliverables: [
      "Production-ready orchestration pipeline",
      "Monitoring cockpit with latency and failure alerts",
      "End-to-end integration documentation and API contracts",
      "SLA-backed maintenance and patch guarantee"
    ],
    techStack: ["Node.js / Python", "Temporal / Inngest", "PostgreSQL", "Redis Queues", "REST / GraphQL APIs"]
  },
  {
    id: "02",
    slug: "ai-agents",
    number: "02",
    badge: "02 // AUTONOMOUS REASONING",
    title: "Autonomous AI Agents",
    tagline: "Deterministic goal-directed agents capable of dynamic tool use and verification.",
    description: "Deploy task-oriented agents capable of dynamic reasoning, multi-step problem solving, database querying, and tool execution with deterministic boundaries.",
    flow: "Goal Dispatch → Context Retrieval → ReAct Reasoning Loop → Action Execution → Verification Log",
    features: [
      "ReAct (Reason + Act) loop with explicit step verification",
      "Sandboxed tool execution preventing unintended state mutations",
      "Context compaction and structured memory across long operational sessions",
      "Configurable autonomy thresholds with human-in-the-loop escalation"
    ],
    deliverables: [
      "Custom agent runtime configured for your domain logic",
      "API tool harness and secure credentials vault",
      "Audit trail database recording 100% of agent reasoning steps",
      "Evaluation benchmark suite measuring accuracy and safety"
    ],
    techStack: ["LangGraph / CrewAI", "FastAPI", "Claude 3.5 Sonnet / GPT-4o", "Vector DB", "Docker Sandboxes"]
  },
  {
    id: "03",
    slug: "ai-voice",
    number: "03",
    badge: "03 // REAL-TIME TELEPHONY",
    title: "AI Voice Systems",
    tagline: "Sub-500ms conversational phone agents for high-throughput enterprise communications.",
    description: "Ultra-low latency conversational telephony for 24/7 inbound dispatching, emergency triage, appointment booking, and automated phone outreach.",
    flow: "SIP/PSTN Stream → Neural Audio Turn Detection → Tool Execution → Sub-500ms TTS Response",
    features: [
      "Ultra-low latency audio pipeline with real-time interrupt handling",
      "Seamless phone system (Twilio / Telnyx / Vonage) SIP trunking",
      "Deterministic live database lookup during active calls",
      "Instant call transcription, sentiment telemetry, and CRM logging"
    ],
    deliverables: [
      "Deployed telephony agent connected to your direct phone numbers",
      "Live call monitoring dashboard with audio playback and transcripts",
      "Custom voice cloning or curated studio neural voice profiles",
      "Compliance recording and HIPAA/GDPR data masking pipeline"
    ],
    techStack: ["LiveKit / Daily.co", "Deepgram Nova-2", "Cartesia / ElevenLabs", "Twilio SIP", "WebSockets"]
  },
  {
    id: "04",
    slug: "ai-customer-support",
    number: "04",
    badge: "04 // CUSTOMER OPERATIONS",
    title: "AI Customer Support",
    tagline: "Autonomous tier-1 and tier-2 customer operations that execute live actions.",
    description: "Resolve repetitive customer requests deterministically, execute order changes via API, and intelligently route complex edge cases with full context.",
    flow: "Customer Inquiry → Sentiment & Intent Classify → Knowledge RAG → API Mutation → Instant CRM Update",
    features: [
      "Action-taking resolution engine (cancellations, refunds, status lookups)",
      "Strict policy guardrails preventing hallucinations or unauthorized concessions",
      "Omnichannel parity across Email, Intercom, Zendesk, and WhatsApp",
      "Automatic ticket classification, routing, and internal notes summarization"
    ],
    deliverables: [
      "Integrated helpdesk AI resolver with custom brand persona",
      "Safe API mutation gateway with authorization checks",
      "Weekly automated drift analysis and prompt improvement pipeline",
      "Executive resolution rate analytics and deflection reports"
    ],
    techStack: ["Zendesk / Intercom APIs", "Qdrant Vector DB", "Function Calling LLMs", "PostgreSQL", "Next/React UI"]
  },
  {
    id: "05",
    slug: "ai-sales",
    number: "05",
    badge: "05 // REVENUE ENGINE",
    title: "AI Sales Systems",
    tagline: "Instant inbound qualification, automated research, and multi-channel pipeline velocity.",
    description: "Qualify inbound inquiries in seconds, enrich buyer firmographics, automate personalized multi-channel follow-ups, and eliminate CRM data entry.",
    flow: "Lead Webhook → Domain Enrichment → ICP Gating Matrix → Meeting Booking Link → CRM Hygiene Sync",
    features: [
      "Sub-60-second inbound speed-to-lead response via email or SMS",
      "Deep enrichment using Clearbit, Apollo, LinkedIn, and website scrapers",
      "Dynamic ICP scoring matrix that prioritizes high-value opportunities",
      "Automated calendar booking and pre-call research briefing generation"
    ],
    deliverables: [
      "Fully integrated inbound revenue pipeline",
      "Custom lead scoring logic tuned to your historical win rates",
      "Automated executive pre-meeting intelligence dossier generator",
      "HubSpot / Salesforce real-time bidirectional data hygiene bridge"
    ],
    techStack: ["HubSpot / Salesforce APIs", "Clay / Apollo Encoders", "OpenAI / Claude", "SendGrid", "Webhook Gateways"]
  },
  {
    id: "06",
    slug: "ai-knowledge",
    number: "06",
    badge: "06 // NEURAL RETRIEVAL",
    title: "AI Knowledge Systems (RAG)",
    tagline: "Deterministic internal search and synthesis grounded in verified company truth.",
    description: "Unify company documentation, Notion workspaces, Confluence, and databases into a grounded, verified semantic retrieval engine with strict citations.",
    flow: "Employee Query → Hybrid BM25 + Vector Search → Cross-Encoder Re-Rank → Strict Citation Gate",
    features: [
      "Hybrid retrieval combining dense embeddings and sparse keyword matching",
      "Strict citation enforcement with line-level source attribution",
      "Role-based access control (RBAC) reflecting native document permissions",
      "Automated document synchronization from Google Drive, Notion, and Slack"
    ],
    deliverables: [
      "Internal knowledge assistant accessible via Web, Slack, or Teams",
      "Automated document ingestion and chunking pipeline",
      "Data privacy assurance: zero public model training on proprietary data",
      "Admin telemetry tracking unanswered queries and knowledge gaps"
    ],
    techStack: ["Qdrant / Pinecone", "Cohere Re-Rank", "LlamaIndex", "Slack Bolt SDK", "FastAPI"]
  },
  {
    id: "07",
    slug: "document-intelligence",
    number: "07",
    badge: "07 // MULTI-MODAL OCR",
    title: "Document Intelligence",
    tagline: "Convert unstructured PDFs, contracts, and invoices into type-safe ERP records.",
    description: "Convert complex PDFs, invoices, contracts, and financial records into type-safe, validated JSON data structured for automated downstream systems.",
    flow: "Document Ingestion → Multi-Modal OCR → Deterministic Math Check → 3-Way PO Matching → ERP Write-Back",
    features: [
      "High-accuracy extraction from skewed, photographed, or multi-page documents",
      "Algorithmic line-item math verification and currency reconciliation",
      "Automated 3-way matching between Purchase Order, Bill of Lading, and Invoice",
      "Confidence scoring with automated exception queues for human sign-off"
    ],
    deliverables: [
      "End-to-end document parsing engine with ERP integration",
      "Custom human-in-the-loop review interface for borderline confidence cases",
      "Audited parsing accuracy report exceeding 99.4% precision",
      "Exportable CSV / JSON / SQL sync utilities"
    ],
    techStack: ["Gemini 1.5 Flash / Pro", "Claude Vision", "PyMuPDF", "Pydantic Schemas", "SAP / NetSuite APIs"]
  },
  {
    id: "08",
    slug: "custom-ai",
    number: "08",
    badge: "08 // BESPOKE ENGINEERING",
    title: "Custom AI Applications",
    tagline: "Tailored operational cockpits and full-stack software built for unique workflows.",
    description: "Bespoke internal web applications, operational cockpits, and specialized software engineered specifically for your proprietary business workflows.",
    flow: "Discovery Audit → System Architecture → Prototype Deployment → Production Hardening → SLA Handover",
    features: [
      "Custom React / TypeScript user interfaces engineered for speed",
      "Enterprise security: SSO, SOC2 compliance patterns, and encrypted storage",
      "Scalable cloud architecture deployed on AWS, GCP, or on-premise",
      "Full IP ownership transferred to your business upon delivery"
    ],
    deliverables: [
      "Full-stack custom software platform with source code ownership",
      "Comprehensive architectural blueprint and developer documentation",
      "Infrastructure as Code (Terraform) for reproducible deployment",
      "Post-launch technical support and engineering enablement"
    ],
    techStack: ["React / Vite / Next.js", "TypeScript", "Python / Go", "PostgreSQL", "Docker / AWS"]
  }
];
