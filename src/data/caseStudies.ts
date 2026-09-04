export interface CaseStudyItem {
  id: string;
  slug: string;
  number: string;
  client: string;
  industry: string;
  title: string;
  subtitle: string;
  summary: string;
  challenge: string;
  architecture: string[];
  beforeFlow: string[];
  afterFlow: string[];
  results: { metric: string; label: string; context: string }[];
  quote: { text: string; author: string; role: string };
}

export const CASE_STUDIES: CaseStudyItem[] = [
  {
    id: "invoice-processing",
    slug: "invoice-processing",
    number: "01",
    client: "Global Logistics Group",
    industry: "Supply Chain & Freight Forwarding",
    title: "Autonomous Invoice Ingestion & 3-Way Reconciliation",
    subtitle: "Eliminating 18,000 monthly manual data entry touchpoints across 4 continents.",
    summary: "Replaced an 11-person manual accounts payable triage team with an automated multi-modal parsing and validation pipeline that integrates directly with SAP S/4HANA.",
    challenge: "The client was processing over 18,000 international invoices monthly across 40+ currencies and varying vendor templates. Processing latency averaged 4.2 days per invoice with a 3.8% manual transcription error rate.",
    architecture: [
      "Inbound email webhook & SFTP document listener",
      "Multi-modal vision extraction model (Gemini 1.5 Pro / Claude 3.5 Sonnet)",
      "Deterministic math verification engine (line item sum vs grand total)",
      "Automated SAP purchase order lookup & tolerance verification",
      "Auto-approval gate (<$10k with 100% PO match) or Human-in-the-Loop review queue"
    ],
    beforeFlow: [
      "Supplier emails PDF invoice",
      "Clerk downloads and renames file",
      "Clerk manually enters 24 fields into SAP",
      "Clerk searches for PO in separate system",
      "Manual comparison of line items",
      "Delayed payment cycle (avg: 12 days)"
    ],
    afterFlow: [
      "Supplier emails invoice to dedicated address",
      "Autonomous parser extracts and validates structured JSON",
      "Deterministic engine confirms 3-way PO match",
      "Direct API reconciliation write-back to SAP",
      "Instant invoice payment approval (avg: 14 seconds)"
    ],
    results: [
      { metric: "93%", label: "Latency Reduction", context: "From 4.2 days to under 30 seconds" },
      { metric: "$380,000", label: "Annual Labor Savings", context: "Redirected 11 FTEs to vendor strategy" },
      { metric: "99.8%", label: "Field Extraction Precision", context: "Zero catastrophic ledger balance errors" }
    ],
    quote: {
      text: "Valence didn't sell us a chatbot. They engineered a mission-critical pipeline that has handled 100,000+ invoices without a single dropped ledger entry.",
      author: "David Hensley",
      role: "VP of Global Supply Operations"
    }
  },
  {
    id: "knowledge-assistant",
    slug: "knowledge-assistant",
    number: "02",
    client: "Vanguard Legal Advisory",
    industry: "Corporate Law & Compliance",
    title: "Grounded Enterprise RAG & Contract Precedent Engine",
    subtitle: "Giving 250+ attorneys instant, line-cited access to 15 years of proprietary deal history.",
    summary: "Engineered a secure, air-gapped semantic search and citation assistant that allows associates to query thousands of historical contracts, regulatory filings, and M&A clauses in seconds.",
    challenge: "Attorneys were losing an estimated 8 to 12 billable hours weekly searching through scattered SharePoint archives, outdated intranet drives, and legacy contract repositories.",
    architecture: [
      "Air-gapped document chunking with metadata tagging",
      "Hybrid dense-sparse vector indexing (Qdrant + BM25)",
      "Cross-encoder re-ranking for strict precision",
      "Zero-retention LLM inference ensuring attorney-client privilege",
      "Line-level citation gating requiring clickable source PDF verification"
    ],
    beforeFlow: [
      "Associate receives novel M&A covenant question",
      "Searches SharePoint with clumsy keywords",
      "Opens 15 PDF contracts manually",
      "Skims 400 pages over 6 hours",
      "Drafts response with potential omissions"
    ],
    afterFlow: [
      "Associate queries knowledge engine in natural language",
      "Hybrid engine surfaces top 3 exact precedent clauses",
      "Assistant generates side-by-side comparative analysis",
      "All statements link to verified original PDF pages",
      "Completed in under 45 seconds with 100% auditability"
    ],
    results: [
      { metric: "11.5 hrs", label: "Saved Per Attorney / Week", context: "Reclaimed billable associate research time" },
      { metric: "0%", label: "Hallucination Tolerance", context: "Strict citation gate rejects ungrounded claims" },
      { metric: "100%", label: "Data Sovereignty", context: "Zero external training on confidential client data" }
    ],
    quote: {
      text: "The precision and citation rigor are unmatched. Our associates trust it because every single assertion is backed by a verified link to the original executed agreement.",
      author: "Rachel Sterling, Esq.",
      role: "Managing Partner"
    }
  },
  {
    id: "lead-qualification",
    slug: "lead-qualification",
    number: "03",
    client: "Apex SaaS Technologies",
    industry: "Enterprise B2B Software",
    title: "Autonomous Inbound Triage & Speed-to-Lead Engine",
    subtitle: "Compressing inbound enterprise qualification and calendar booking from 6 hours to 45 seconds.",
    summary: "Built an intelligent inbound routing agent that enriches company domain data, analyzes buyer intent, qualifies against strict ICP criteria, and books executive demos in real time.",
    challenge: "Inbound demo requests took an average of 4.5 hours to be touched by a human SDR, during which 35% of qualified enterprise prospects went cold or booked with competitors.",
    architecture: [
      "Real-time form webhook ingestion",
      "Automated firmographic enrichment (Clearbit + LinkedIn scraping)",
      "Deterministic ICP scoring matrix (ARR, employee count, tech stack)",
      "Autonomous conversational email outreach or instant calendar booking",
      "Bi-directional CRM hygiene bridge updating Salesforce in real time"
    ],
    beforeFlow: [
      "Buyer submits demo request form",
      "Lead sits in unassigned SDR queue for 3–6 hours",
      "SDR manually searches LinkedIn for buyer title",
      "SDR sends generic scheduling email",
      "3-day back-and-forth email ping-pong",
      "35% drop-off before call occurs"
    ],
    afterFlow: [
      "Buyer submits demo request",
      "Pipeline enriches domain firmographics in 8 seconds",
      "Deterministic model validates ICP qualification criteria",
      "Calendar booking page dynamically customized for buyer's timezone",
      "Executive briefed with pre-meeting dossier (avg speed: 42s)"
    ],
    results: [
      { metric: "45 sec", label: "Average Speed-to-Lead", context: "Down from 4.5 hours manual delay" },
      { metric: "+41%", label: "Demo Show-Up Rate", context: "Frictionless instant booking pipeline" },
      { metric: "$1.4M", label: "Net-New Pipeline Generated", context: "In first 90 days post-deployment" }
    ],
    quote: {
      text: "Speed to lead is everything in enterprise sales. This pipeline gave us an unfair advantage—our prospects are booked into an executive demo before our competitors even see the notification.",
      author: "Tyler Vance",
      role: "Chief Revenue Officer"
    }
  }
];
