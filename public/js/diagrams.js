/**
 * AI SYSTEMS & AUTOMATION AGENCY — EDITORIAL INTERACTIVE JS
 * Powers the Interactive Service Index, Signature Architecture Diagram, and Workflow Wall
 */

/* 1. Services Editorial Index Data (Outcome-Driven & Business-Focused) */
const SERVICES_DATA = {
  "01": {
    badge: "01 // REVENUE AUTOMATION",
    title: "AI Lead Qualification & Booking",
    desc: "Qualify inbound website and messaging inquiries systematically. Leads are validated against ideal customer criteria and routed directly to team calendars.",
    flow: "Inbound Lead Arrives → Automated Qualification → Requirement Gating → Calendar Availability → CRM Auto-Synced",
    link: "solutions/ai-sales.html"
  },
  "02": {
    badge: "02 // 24/7 CUSTOMER OPERATIONS",
    title: "Autonomous Customer Support Agent",
    desc: "Resolve routine customer tickets across chat, messaging, and email. Handles order inquiries, FAQs, and requests with structured human escalation when required.",
    flow: "Customer Inquiry → Automated Diagnosis → Resolves Routine Inquiries → Database Update → Human Escalation If Needed",
    link: "solutions/ai-customer-support.html"
  },
  "03": {
    badge: "03 // INBOUND & OUTBOUND TELEPHONY",
    title: "AI Voice Phone Receptionist",
    desc: "Handle inbound customer calls systematically. Voice AI answers promptly, addresses common inquiries, qualifies project scope, and schedules appointments.",
    flow: "Inbound Phone Call → Low-Latency Voice AI Answers → Qualifies Client Needs → Books on Calendar → Dispatches Confirmation",
    link: "solutions/ai-voice.html"
  },
  "04": {
    badge: "04 // INTERNAL OPERATIONS",
    title: "Company SOP & Knowledge Assistant",
    desc: "Centralize documentation, employee manuals, and operational guides into an internal retrieval assistant. Team members receive verified answers with page citations.",
    flow: "Staff Asks Question in Slack → AI Searches Internal Company Docs → Provides Grounded Answer with Source Citation",
    link: "solutions/ai-knowledge.html"
  },
  "05": {
    badge: "05 // PAPERWORK AUTOMATION",
    title: "Automated Document & Invoice Intelligence",
    desc: "Eliminate manual data entry for PDF invoices and operational records. Systems extract line items, validate mathematical balances, and post directly to accounting systems.",
    flow: "Invoice PDF Uploaded → Optical Extraction → Validates Against PO → Directly Posted to ERP / Accounting",
    link: "solutions/document-intelligence.html"
  },
  "06": {
    badge: "06 // EXECUTIVE VISIBILITY",
    title: "Automated Executive Dashboards",
    desc: "Consolidate operational telemetry. Data pipelines pull metrics from payment processors, analytics, and CRM systems to generate regular executive summaries.",
    flow: "Pulls CRM & Operational Data → Aggregates Revenue Metrics → Normalizes Schema → Delivers Periodic Brief",
    link: "solutions/ai-automation.html"
  },
  "07": {
    badge: "07 // MULTI-STEP AGENTS",
    title: "Autonomous Workflow Agents",
    desc: "Coordinate multi-step business procedures: research, data enrichment, supplier communication, and cross-platform synchronization with verified validation steps.",
    flow: "Business Trigger Occurs → System Gathers Required Data → Executes Multi-Step Workflow → Updates Tools → Alerts Your Team",
    link: "solutions/ai-agents.html"
  },
  "08": {
    badge: "08 // BESPOKE SOLUTIONS",
    title: "Custom AI Business Applications",
    desc: "Custom operational dashboards and client-facing web workflows engineered specifically for your business processes and technical architecture.",
    flow: "Proprietary Workflow → Tailored AI System Architecture → Integrated with Existing Stack → Streamlined Operations",
    link: "solutions/custom-ai.html"
  }
};

/* 2. Signature System Architecture Data (Client-Friendly Governance & Execution) */
const ARCHITECTURE_DATA = {
  input: {
    title: "STAGE 01: INBOUND TRIGGER OR INQUIRY",
    desc: "A customer reaches out via messaging, web form, email, or telephony — or an operational event occurs. The system initiates workflow execution immediately."
  },
  understand: {
    title: "STAGE 02: CONTEXT & INTENT EVALUATION",
    desc: "The system parses customer intent, extracts structured parameters (budget, timeline, account ID, or location), and determines the appropriate routing pathway."
  },
  reason: {
    title: "STAGE 03: BUSINESS POLICY & SOP VERIFICATION",
    desc: "The system references your explicit business rules, pricing schedules, and documentation to determine verified actions without speculation or hallucinations."
  },
  decide: {
    title: "STAGE 04: AUTOMATED DECISION GATING",
    desc: "The system determines the next operational action: confirm booking, provide verified answer, update database, or route to human staff based on confidence thresholds."
  },
  act: {
    title: "STAGE 05: DIRECT TOOL EXECUTION",
    desc: "The system executes the action in your existing operational software: calendar management, CRM pipeline updates, or automated messaging dispatches."
  },
  verify: {
    title: "STAGE 06: DATA VALIDATION & AUDIT LOGGING",
    desc: "Validates all payloads against schema constraints, logs complete execution audit trails, and prevents duplicate records across your operational systems."
  },
  done: {
    title: "STAGE 07A: AUTONOMOUS RESOLUTION",
    desc: "The workflow completes successfully through automated paths. Records are updated and confirmation notices are dispatched."
  },
  escalate: {
    title: "STAGE 07B: HUMAN-IN-THE-LOOP SAFETY",
    desc: "Whenever an edge case, complex complaint, or high-value negotiation occurs, the system immediately routes the request to your team with full context."
  },
  human: {
    title: "GOVERNANCE: COMPLETE OPERATIONAL CONTROL",
    desc: "You define policy constraints, review audit trails, and maintain full override capability over automated workflows at all times."
  }
};

/* 3. Workflow Wall Data */
const WALL_DATA = {
  leads: {
    term: "LEADS",
    problem: "Sales representatives spend substantial time sorting non-viable inquiries.",
    system: "Incoming inquiry → Automated qualification → Domain enrichment → CRM sync → Direct booking",
    outcome: "Rapid response cadence and structured CRM record logging."
  },
  support: {
    term: "SUPPORT",
    problem: "Repetitive order status, returns, and reset tickets consume operational capacity.",
    system: "Customer ticket → Category triage → Database query → Automated resolution → Support system update",
    outcome: "Autonomous handling of routine tickets with structured human escalation."
  },
  documents: {
    term: "DOCUMENTS",
    problem: "Accounts payable manually enters PDF invoice line items into accounting software.",
    system: "PDF invoice → Structured extraction → Mathematical balance check → PO verification → Accounting post",
    outcome: "Substantial reduction in manual bookkeeping errors."
  },
  sales: {
    term: "SALES",
    problem: "Incomplete pipeline records leave revenue reporting inconsistent.",
    system: "Meeting recording → Transcript analysis → Action extraction → Deal stage update → Summary draft",
    outcome: "Structured deal histories and minimal manual data entry."
  },
  operations: {
    term: "OPERATIONS",
    problem: "Manual spreadsheet reconciliation between disjointed SaaS tools.",
    system: "Event webhook → Schema sanitization → Queue worker → Database mutation → Team alert",
    outcome: "Event-driven synchronization and auditable event delivery."
  },
  research: {
    term: "RESEARCH",
    problem: "Compiling weekly operational telemetry and industry data requires hours of manual research.",
    system: "Automated ingestion → Document synthesis → Data verification → Executive brief",
    outcome: "Consistent executive reporting delivered on scheduled cadence."
  },
  reporting: {
    term: "REPORTING",
    problem: "Manual aggregation of financial KPIs and cross-channel metrics.",
    system: "API connector → Metric aggregation → Validation check → PDF report generator",
    outcome: "Automated report compilation on scheduled cadences."
  },
  booking: {
    term: "BOOKING",
    problem: "Manual email exchanges to schedule client consultations.",
    system: "Inbound request → Qualification check → Real-time calendar availability → Confirmation dispatch",
    outcome: "Rapid scheduling response with calendar synchronization."
  },
  data: {
    term: "DATA",
    problem: "Unstructured legacy records require manual formatting.",
    system: "Legacy export → Schema mapping pipeline → Deterministic validation → Database load",
    outcome: "Consistent, validated data normalization pipelines."
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
