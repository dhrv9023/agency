/**
 * AI SYSTEMS & AUTOMATION AGENCY — EDITORIAL INTERACTIVE JS
 * Powers the Interactive Service Index, Signature Architecture Diagram, and Workflow Wall
 */

/* 1. Services Editorial Index Data */
const SERVICES_DATA = {
  "01": {
    badge: "01 // AUTOMATION PIPELINES",
    title: "AI Automation",
    desc: "Connect disparate SaaS platforms, databases, and APIs into self-healing, event-driven pipelines that eliminate repetitive manual handoffs.",
    flow: "Webhook Trigger → Schema Sanitization → Policy Guardrail → Idempotent Tool Execution → Real-time State Reconciliation",
    link: "solutions/ai-automation.html"
  },
  "02": {
    badge: "02 // AUTONOMOUS REASONING",
    title: "Autonomous AI Agents",
    desc: "Deploy task-oriented agents capable of dynamic reasoning, multi-step problem solving, database querying, and tool execution with deterministic boundaries.",
    flow: "Goal Dispatch → Context Retrieval → ReAct Reasoning Loop → Action Execution → Verification Log",
    link: "solutions/ai-agents.html"
  },
  "03": {
    badge: "03 // REAL-TIME TELEPHONY",
    title: "AI Voice Systems",
    desc: "Ultra-low latency conversational telephony for 24/7 inbound dispatching, emergency triage, appointment booking, and automated phone outreach.",
    flow: "SIP/PSTN Stream → Neural Audio Turn Detection → Tool Execution → Sub-500ms TTS Response",
    link: "solutions/ai-voice.html"
  },
  "04": {
    badge: "04 // CUSTOMER OPERATIONS",
    title: "AI Customer Support",
    desc: "Resolve repetitive tier-1 support requests deterministically, execute order changes via API, and intelligently route complex cases with full context.",
    flow: "Customer Inquiry → Sentiment & Intent Classify → Knowledge RAG → API Mutation → Instant CRM Update",
    link: "solutions/ai-customer-support.html"
  },
  "05": {
    badge: "05 // REVENUE ENGINE",
    title: "AI Sales Systems",
    desc: "Qualify inbound inquiries in seconds, enrich buyer firmographics, automate personalized multi-channel follow-ups, and eliminate CRM data entry.",
    flow: "Lead Webhook → Domain Enrichment → ICP Gating Matrix → Meeting Booking Link → CRM Hygiene Sync",
    link: "solutions/ai-sales.html"
  },
  "06": {
    badge: "06 // NEURAL RETRIEVAL",
    title: "AI Knowledge Systems (RAG)",
    desc: "Unify company documentation, Notion workspaces, and databases into a grounded, verified semantic retrieval engine with strict citations.",
    flow: "Employee Query → Hybrid BM25 + Vector Search → Cross-Encoder Re-Rank → Strict Citation Gate",
    link: "solutions/ai-knowledge.html"
  },
  "07": {
    badge: "07 // MULTI-MODAL OCR",
    title: "Document Intelligence",
    desc: "Convert complex PDFs, invoices, contracts, and financial records into type-safe, validated JSON data structured for automated downstream systems.",
    flow: "Document Ingestion → Multi-Modal OCR → Deterministic Math Check → 3-Way PO Matching → ERP Write-Back",
    link: "solutions/document-intelligence.html"
  },
  "08": {
    badge: "08 // BESPOKE ENGINEERING",
    title: "Custom AI Applications",
    desc: "Bespoke internal web applications, operational cockpits, and specialized software engineered specifically for your proprietary business workflows.",
    flow: "Full-Stack Application → Role-Based Auth → Isolated Private VPC → Bespoke AI Middleware Engine",
    link: "solutions/custom-ai.html"
  }
};

/* 2. Signature System Architecture Data */
const ARCHITECTURE_DATA = {
  input: {
    title: "STAGE 01: INGESTION & EVENT TRIGGERING",
    desc: "Ingests raw events from webhooks, Kafka queues, IMAP email streams, telephony SIP channels, or REST APIs into high-throughput asynchronous workers."
  },
  understand: {
    title: "STAGE 02: CONTEXTUAL PARSING & EXTRACTION",
    desc: "Normalizes unstructured content, parses multi-modal document layouts (OCR), and extracts semantic entities with confidence score gating."
  },
  reason: {
    title: "STAGE 03: CONTEXTUAL REASONING & RAG",
    desc: "Retrieves company policies, past cases, and live database state to evaluate constraints and operational edge-cases without hallucination."
  },
  decide: {
    title: "STAGE 04: POLICY ENFORCEMENT & DECISION ARBITRATION",
    desc: "Validates proposed actions against permission hierarchies, budget limits, and risk scoring matrices before initiating any tool call."
  },
  act: {
    title: "STAGE 05: TRANSACTIONAL TOOL DISPATCH",
    desc: "Executes authenticated mutations across enterprise tools: updating CRMs, issuing invoices, dispatching webhooks, and calling internal APIs."
  },
  verify: {
    title: "STAGE 06: RECONCILIATION & OBSERVABILITY",
    desc: "Verifies external state changes, confirms HTTP 200 responses, checks database consistency, and records full end-to-end OpenTelemetry traces."
  },
  done: {
    title: "STAGE 07A: AUTONOMOUS COMPLETION",
    desc: "Task completed successfully with full transaction audit log, telemetry metrics recorded, and zero human intervention required."
  },
  escalate: {
    title: "STAGE 07B: HUMAN-IN-THE-LOOP ESCALATION",
    desc: "Low-confidence or policy-flagged edge cases are packaged with suggested responses and routed to human specialists via Slack or dashboard."
  },
  human: {
    title: "GOVERNANCE: HUMAN SUPERVISION",
    desc: "Human operators define policy constraints, review anomaly queues, and approve high-value transactions above confidence thresholds."
  }
};

/* 3. Workflow Wall Data */
const WALL_DATA = {
  leads: {
    term: "LEADS",
    problem: "Sales reps spend 65% of time sorting non-viable inquiries.",
    system: "Incoming inquiry → AI qualification → Domain enrichment → CRM sync → Direct booking",
    outcome: "< 30s response time, 100% CRM data hygiene."
  },
  support: {
    term: "SUPPORT",
    problem: "Repetitive order status, returns, and reset tickets overwhelm staff.",
    system: "Customer ticket → Sentiment triage → Order database query → Automated refund → Zendesk update",
    outcome: "60-80% autonomous resolution, instant 24/7 response SLA."
  },
  documents: {
    term: "DOCUMENTS",
    problem: "Accounts payable manually keys PDF line-items into ERP.",
    system: "PDF invoice → Multi-modal OCR → Math validation check → 3-way PO matching → QuickBooks post",
    outcome: "90% reduction in manual bookkeeping errors."
  },
  sales: {
    term: "SALES",
    problem: "Reps forget to log deal notes, leaving pipeline data blank.",
    system: "Meeting recording → AI transcript analysis → Action extraction → Deal stage update → Follow-up draft",
    outcome: "100% complete CRM deal history with zero rep overhead."
  },
  operations: {
    term: "OPERATIONS",
    problem: "Manual spreadsheet copying between 10+ disjointed SaaS tools.",
    system: "Event webhook → Schema sanitization → Asynchronous queue → Database mutation → Slack alert",
    outcome: "Self-healing real-time synchronization with zero data loss."
  },
  research: {
    term: "RESEARCH",
    problem: "Compiling weekly market and competitor telemetry takes 12 hours.",
    system: "Automated scraper → Regulatory & news ingestion → Semantic synthesis → Executive brief",
    outcome: "Automated Monday morning briefs delivered directly to leadership."
  },
  reporting: {
    term: "REPORTING",
    problem: "Manual cross-channel ad and financial KPI compilation.",
    system: "API connector → Metric aggregation → Delta calculations → Automated PDF report generator",
    outcome: "Client reporting completed in minutes rather than days."
  },
  booking: {
    term: "BOOKING",
    problem: "Multi-day email threads to schedule client discovery calls.",
    system: "Inbound request → Conversational calendar agent → Real-time availability negotiation → Calendar invite",
    outcome: "Zero lead decay, 35% higher attendance rate."
  },
  data: {
    term: "DATA",
    problem: "Unstructured legacy records require manual formatting.",
    system: "Legacy export → Schema mapping model → Deterministic validation → PostgreSQL load",
    outcome: "Fast, reliable data normalization pipelines."
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initServicesIndex();
  initSystemDiagram();
  initWorkflowWall();
  initEditorialAccordion();
});

/**
 * Initializes the Interactive Service Index (Section 3)
 */
function initServicesIndex() {
  const serviceRows = document.querySelectorAll('.service-index-row');
  const previewBadge = document.getElementById('service-preview-badge');
  const previewTitle = document.getElementById('service-preview-title');
  const previewDesc = document.getElementById('service-preview-desc');
  const previewFlow = document.getElementById('service-preview-flow');
  const previewLink = document.getElementById('service-preview-link');

  if (!serviceRows.length || !previewTitle) return;

  function updatePreview(id) {
    const data = SERVICES_DATA[id];
    if (!data) return;

    serviceRows.forEach(r => r.classList.remove('is-active'));
    const activeRow = document.querySelector(`.service-index-row[data-service="${id}"]`);
    if (activeRow) activeRow.classList.add('is-active');

    previewBadge.textContent = data.badge;
    previewTitle.textContent = data.title;
    previewDesc.textContent = data.desc;
    previewFlow.textContent = data.flow;
    if (previewLink) previewLink.setAttribute('href', data.link);
  }

  serviceRows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      const id = row.getAttribute('data-service');
      updatePreview(id);
    });
    row.addEventListener('focus', () => {
      const id = row.getAttribute('data-service');
      updatePreview(id);
    });
  });
}

/**
 * Initializes the Signature System Architecture Diagram (Section 4)
 */
function initSystemDiagram() {
  const diagNodes = document.querySelectorAll('.diag-node');
  const inspectorTitle = document.getElementById('diag-inspector-title');
  const inspectorDesc = document.getElementById('diag-inspector-desc');

  if (!diagNodes.length || !inspectorTitle) return;

  diagNodes.forEach(node => {
    node.addEventListener('click', () => {
      const nodeKey = node.getAttribute('data-node');
      const data = ARCHITECTURE_DATA[nodeKey];
      if (!data) return;

      diagNodes.forEach(n => n.classList.remove('is-active'));
      node.classList.add('is-active');

      inspectorTitle.textContent = data.title;
      inspectorDesc.textContent = data.desc;
    });
  });
}

/**
 * Initializes the Interactive Workflow Wall (Section 5)
 */
function initWorkflowWall() {
  const wallButtons = document.querySelectorAll('.wall-term-btn');
  const termDisplay = document.getElementById('wall-active-term');
  const probDisplay = document.getElementById('wall-active-problem');
  const flowDisplay = document.getElementById('wall-active-system');
  const outDisplay = document.getElementById('wall-active-outcome');

  if (!wallButtons.length || !termDisplay) return;

  function updateWall(key) {
    const data = WALL_DATA[key];
    if (!data) return;

    wallButtons.forEach(b => b.classList.remove('is-active'));
    const activeBtn = document.querySelector(`.wall-term-btn[data-wall="${key}"]`);
    if (activeBtn) activeBtn.classList.add('is-active');

    termDisplay.textContent = `// ${data.term} WORKFLOW`;
    probDisplay.textContent = data.problem;
    flowDisplay.textContent = data.system;
    outDisplay.textContent = data.outcome;
  }

  wallButtons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      const key = btn.getAttribute('data-wall');
      updateWall(key);
    });
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-wall');
      updateWall(key);
    });
  });
}

/**
 * Clean Editorial FAQ Accordion Handler
 */
function initEditorialAccordion() {
  const triggers = document.querySelectorAll('.editorial-faq-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const parent = trigger.closest('.editorial-faq-item');
      if (!parent) return;

      const isOpen = parent.classList.contains('is-open');

      document.querySelectorAll('.editorial-faq-item').forEach(item => {
        item.classList.remove('is-open');
        const btn = item.querySelector('.editorial-faq-trigger');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        parent.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}
