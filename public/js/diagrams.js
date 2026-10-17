/**
 * AI SYSTEMS & AUTOMATION AGENCY — EDITORIAL INTERACTIVE JS
 * Powers the Interactive Service Index, Signature Architecture Diagram, and Workflow Wall
 */

/* 1. Services Editorial Index Data (Outcome-Driven & Business-Focused) */
const SERVICES_DATA = {
  "01": {
    badge: "01 // REVENUE AUTOMATION",
    title: "AI Lead Qualification & Booking",
    desc: "Turn website and WhatsApp traffic into qualified sales calls in 60 seconds. Inbound leads are instantly scored, asked qualifying questions, and scheduled directly onto your calendar 24/7.",
    flow: "Inbound Lead Arrives → Instant 45s WhatsApp Response → Budget & ICP Gated → Direct Calendar Booking → CRM Auto-Synced",
    link: "solutions/ai-sales.html"
  },
  "02": {
    badge: "02 // 24/7 CUSTOMER OPERATIONS",
    title: "Autonomous Customer Support Agent",
    desc: "Resolve 70%+ of customer tickets instantly across WhatsApp, Website Chat, and Email. Handles order status, FAQs, refunds, and booking without human staff, with graceful escalation when needed.",
    flow: "Customer Inquiry → Instant AI Diagnosis → Resolves Common Issues via Database → Instant Update → Human Escalation If Needed",
    link: "solutions/ai-customer-support.html"
  },
  "03": {
    badge: "03 // INBOUND & OUTBOUND TELEPHONY",
    title: "AI Voice Phone Receptionist",
    desc: "Never miss a high-ticket customer phone call again. Our Voice AI picks up the phone in 1 ring, answers common questions naturally, qualifies buyer budget, and books appointments while your team is on-site or asleep.",
    flow: "Inbound Phone Call → Sub-Second Natural Voice AI Answers → Qualifies Client Needs → Books on Calendar → Sends SMS Confirmation",
    link: "solutions/ai-voice.html"
  },
  "04": {
    badge: "04 // INTERNAL OPERATIONS",
    title: "Company SOP & Knowledge Assistant",
    desc: "Turn your scattered Notion docs, employee manuals, contracts, and PDF guides into an instant internal AI copilot. Your team gets verified answers in Slack or Teams in 2 seconds with zero executive interruptions.",
    flow: "Staff Asks Question in Slack → AI Searches Internal Company Docs → Provides Accurate Answer with Page Source Citation",
    link: "solutions/ai-knowledge.html"
  },
  "05": {
    badge: "05 // PAPERWORK AUTOMATION",
    title: "Automated Document & Invoice Intelligence",
    desc: "Stop manually re-typing PDF invoices, receipts, and client forms into spreadsheets. Our systems extract complex line-items, verify mathematical totals, and post directly to QuickBooks, Xero, or your ERP.",
    flow: "Invoice PDF Uploaded → AI Reads Tables & Totals → Validates Against PO → Directly Posted to QuickBooks / Accounting",
    link: "solutions/document-intelligence.html"
  },
  "06": {
    badge: "06 // EXECUTIVE VISIBILITY",
    title: "Automated Executive Dashboards",
    desc: "Eliminate Friday reporting panic. Autonomous data pipelines pull data from your ad accounts, Stripe, and CRM every week to generate a clean, executive summary delivered directly to your inbox.",
    flow: "Auto-Pulls CRM & Stripe Data → Aggregates Revenue & Ad Spend → Formats Clean Metrics → Delivers Monday Morning Brief",
    link: "solutions/ai-automation.html"
  },
  "07": {
    badge: "07 // MULTI-STEP AGENTS",
    title: "Autonomous Workflow Agents",
    desc: "Automate complex multi-step business procedures that previously required 3 people: research, data enrichment, supplier communications, and cross-platform synchronizations executed flawlessly.",
    flow: "Business Trigger Occurs → AI Gathers Required Data → Executes Multi-Step Workflow → Updates Tools → Alerts Your Team",
    link: "solutions/ai-agents.html"
  },
  "08": {
    badge: "08 // BESPOKE SOLUTIONS",
    title: "Custom AI Business Applications",
    desc: "Bespoke operational cockpits and client-facing web tools engineered specifically for your proprietary business model, built to give you an unassailable competitive advantage.",
    flow: "Your Proprietary Workflow → Custom Tailored AI System → Integrated with Your Existing Tools → 10x Operational Speed",
    link: "solutions/custom-ai.html"
  }
};

/* 2. Signature System Architecture Data (Client-Friendly Governance & Execution) */
const ARCHITECTURE_DATA = {
  input: {
    title: "STAGE 01: INBOUND TRIGGER OR INQUIRY",
    desc: "A customer reaches out via WhatsApp, website form, email, or phone call — or a business event occurs (like a new sale or invoice upload). The system responds in under 60 seconds."
  },
  understand: {
    title: "STAGE 02: INSTANT CONTEXT & INTENT",
    desc: "The AI instantly understands the customer's specific need, extracts vital details (budget, dates, order number, or location), and determines the fastest path to resolution."
  },
  reason: {
    title: "STAGE 03: BUSINESS POLICY & SOP VERIFICATION",
    desc: "The system references your exact company rules, pricing matrices, and documentation to craft the right response without guesswork, speculation, or hallucinations."
  },
  decide: {
    title: "STAGE 04: AUTOMATED DECISION GATING",
    desc: "The AI determines the exact next step: confirm appointment, answer question, update database, or trigger a human alert based on strict confidence thresholds."
  },
  act: {
    title: "STAGE 05: SEAMLESS TOOL EXECUTION",
    desc: "The system performs the action directly in your existing software: booking your Google/Outlook calendar, updating HubSpot/Salesforce, or sending a WhatsApp confirmation."
  },
  verify: {
    title: "STAGE 06: ACCURACY & DATA RECONCILIATION",
    desc: "Double-checks all actions for 100% accuracy, logs full transaction records, and ensures zero data loss or duplicate entries across your CRM."
  },
  done: {
    title: "STAGE 07A: 100% AUTONOMOUS SUCCESS",
    desc: "The task is completed in seconds with zero manual staff hours needed. The lead is booked or the customer query is resolved."
  },
  escalate: {
    title: "STAGE 07B: HUMAN-IN-THE-LOOP SAFETY",
    desc: "Whenever an edge case, complex complaint, or high-value negotiation occurs, the system instantly alerts your team with complete notes for personal human handling."
  },
  human: {
    title: "GOVERNANCE: YOU REMAIN IN COMPLETE CONTROL",
    desc: "You define the rules, view real-time transparency dashboards, and can adjust or override any automation at any time."
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
