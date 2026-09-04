export interface IndustryItem {
  id: string;
  slug: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  bottlenecks: string[];
  solutions: string[];
  metrics: { label: string; value: string }[];
}

export const INDUSTRIES: IndustryItem[] = [
  {
    id: "ecommerce",
    slug: "ecommerce",
    number: "01",
    title: "E-Commerce & Retail",
    tagline: "High-volume operations automated from cart checkout to warehouse dispatch.",
    description: "Scale transaction volumes without scaling headcount. Automate customer order inquiries, inventory reconciliation, return management, and vendor feeds.",
    bottlenecks: [
      "Tier-1 support swamped with 'where is my order' and return status queries",
      "Manual stock level syncing across Shopify, Amazon, and warehouse ERPs",
      "Delayed supplier invoice reconciliation and catalog attribute enrichment"
    ],
    solutions: [
      "Autonomous support agents with direct Shopify/Zendesk API mutation authority",
      "Event-driven multi-channel inventory sync with low-stock alerts",
      "Automated product catalog enrichment and multi-modal image categorization"
    ],
    metrics: [
      { label: "Support Deflection", value: "78%" },
      { label: "Order Processing Speed", value: "10x" },
      { label: "Inventory Sync Latency", value: "< 2s" }
    ]
  },
  {
    id: "manufacturing",
    slug: "manufacturing",
    number: "02",
    title: "Manufacturing & Logistics",
    tagline: "Streamline supply chain handoffs, bill of materials matching, and freight triage.",
    description: "Eliminate manual data re-entry across paper bills of lading, supplier spec sheets, maintenance logs, and dispatch manifests.",
    bottlenecks: [
      "Unstructured supplier quotes and physical bills of lading requiring manual entry",
      "Fragmented shipment status tracking across hundreds of carrier portals",
      "Preventive maintenance logs trapped in physical paper binders"
    ],
    solutions: [
      "Multi-modal OCR for automated 3-way matching and ERP entry",
      "Unified freight tracking pipelines aggregating real-time carrier telemetry",
      "Knowledge retrieval engines indexing legacy machinery manuals and safety SOPs"
    ],
    metrics: [
      { label: "Invoice Processing Time", value: "-92%" },
      { label: "Carrier Triage Latency", value: "< 1min" },
      { label: "Data Accuracy", value: "99.8%" }
    ]
  },
  {
    id: "professional-services",
    slug: "professional-services",
    number: "03",
    title: "Professional Services & Legal",
    tagline: "Unify contract review, client intake, and internal research without billable leakage.",
    description: "Empower legal, accounting, and consulting teams with grounded knowledge assistants, contract triage pipelines, and automated engagement onboarding.",
    bottlenecks: [
      "Hours lost searching through past deal memos, contracts, and precedent filings",
      "Repetitive client onboarding questionnaires and KYC document verification",
      "Manual time tracking categorization and billing code alignment"
    ],
    solutions: [
      "Grounded RAG retrieval engines with line-by-line citation enforcement",
      "Autonomous client onboarding workflows with automated document verification",
      "Intelligent project summary generators for partner briefings"
    ],
    metrics: [
      { label: "Research Time Saved", value: "14 hrs/wk" },
      { label: "Onboarding Cycle Time", value: "4x Faster" },
      { label: "Precedent Accuracy", value: "100%" }
    ]
  },
  {
    id: "real-estate",
    slug: "real-estate",
    number: "04",
    title: "Real Estate & Property Management",
    tagline: "Instant tenant inquiry dispatch, maintenance triage, and lease abstraction.",
    description: "Never miss a prospective tenant lead. Automate 24/7 phone inquiry dispatch, tenant maintenance ticket routing, and lease agreement data extraction.",
    bottlenecks: [
      "High inquiry drop-off due to slow response times outside office hours",
      "Emergency maintenance calls requiring manual contractor coordination",
      "Manual lease extraction into property management software (Yardi / AppFolio)"
    ],
    solutions: [
      "Sub-500ms voice agents answering property inquiries and booking viewings 24/7",
      "Automated maintenance triage categorizing urgency and dispatching contractors",
      "Lease abstraction models extracting key terms, escalations, and dates into CRM"
    ],
    metrics: [
      { label: "Speed to Lead", value: "< 30s" },
      { label: "After-Hours Booking", value: "+320%" },
      { label: "Lease Data Entry Time", value: "-85%" }
    ]
  },
  {
    id: "recruitment",
    slug: "recruitment",
    number: "05",
    title: "Recruitment & Staffing",
    tagline: "Autonomous candidate pre-screening, resume enrichment, and interview scheduling.",
    description: "Scale candidate sourcing and screening velocity without burning recruiter hours on scheduling ping-pong and manual resume formatting.",
    bottlenecks: [
      "Recruiters spending 60% of work hours screening resumes and scheduling calls",
      "High drop-off between application submission and initial contact",
      "Inconsistent candidate qualification criteria across recruiting teams"
    ],
    solutions: [
      "Interactive conversational screeners verifying technical and salary alignment",
      "Autonomous calendar coordination synchronizing recruiter and candidate availability",
      "Standardized candidate summary dossiers prepared for hiring managers"
    ],
    metrics: [
      { label: "Time-to-Screen", value: "Instant" },
      { label: "Recruiter Capacity", value: "3.5x" },
      { label: "Candidate Satisfaction", value: "94%" }
    ]
  },
  {
    id: "marketing",
    slug: "marketing",
    number: "06",
    title: "Marketing & Media Agencies",
    tagline: "Automated campaign reporting, competitive intelligence, and asset localization.",
    description: "Free creative and strategy teams from weekly manual reporting spreadsheets. Automate multi-platform data ingestion and dynamic client reporting.",
    bottlenecks: [
      "Hours wasted pulling CSVs from Meta, Google Ads, TikTok, and GA4 every Monday",
      "Fragmented client reporting dashboards that require manual commentary",
      "Slow competitor ad creative monitoring and trend analysis"
    ],
    solutions: [
      "Automated performance ETL pipelines generating executive weekly summaries",
      "Dynamic client portal with natural language query capabilities",
      "Autonomous creative competitor scrapers and visual trend monitors"
    ],
    metrics: [
      { label: "Reporting Hours Saved", value: "90%" },
      { label: "Client Retainer Retention", value: "+28%" },
      { label: "Report Generation Latency", value: "< 15s" }
    ]
  }
];
