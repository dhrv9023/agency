/**
 * ==============================================================================
 * VARAH SYSTEMS — ENTERPRISE DATABASE SEED SCRIPT
 * High-fidelity realistic dataset for AI Agency SaaS operations:
 * - 4-Tier RBAC operators (Owner, Admin, Editor, Viewer)
 * - Inbound CRM Pipeline with 6-stage lifecycle, UTMs & internal notes
 * - Converted Clients, Active Projects & Milestone deliverables
 * - 6 Core AI Engineering Solution modules
 * - High-ROI Case Studies with quantified impact metrics
 * - Technical Articles with full Markdown specifications
 * - Segmented Newsletter Subscribers & Delivery Logs
 * - Media CDN Library with organized Folder Taxonomy
 * - Operational Audit Ledger
 * ==============================================================================
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 [VARAH SEED] Initializing enterprise database seeding...');

  // 1. SITE SETTINGS
  console.log('⚙️  [1/10] Seeding global site settings...');
  await prisma.siteSetting.upsert({
    where: { id: 'global_config' },
    update: {
      siteName: 'VARAH SYSTEMS',
      siteUrl: 'https://varah.ai',
      logoUrl: '/assets/logo.svg',
      contactEmail: 'contact@varah.ai',
      supportEmail: 'ops@varah.ai',
      phone: '+1 (415) 890-4289',
      socialLinks: {
        twitter: 'https://twitter.com/varah_ai',
        linkedin: 'https://linkedin.com/company/varah-systems',
        github: 'https://github.com/varah-systems',
      },
      defaultMetaTitle: 'VARAH SYSTEMS // Autonomous AI Automation & Multi-Agent Engineering',
      defaultMetaDesc: 'Production AI automation systems, sub-second realtime telephony, and custom multi-agent swarms engineered for immediate enterprise ROI.',
      defaultOgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      sitemapEnabled: true,
      robotsTxt: 'User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://varah.ai/sitemap.xml',
    },
    create: {
      id: 'global_config',
      siteName: 'VARAH SYSTEMS',
      siteUrl: 'https://varah.ai',
      logoUrl: '/assets/logo.svg',
      contactEmail: 'contact@varah.ai',
      supportEmail: 'ops@varah.ai',
      phone: '+1 (415) 890-4289',
      socialLinks: {
        twitter: 'https://twitter.com/varah_ai',
        linkedin: 'https://linkedin.com/company/varah-systems',
        github: 'https://github.com/varah-systems',
      },
      defaultMetaTitle: 'VARAH SYSTEMS // Autonomous AI Automation & Multi-Agent Engineering',
      defaultMetaDesc: 'Production AI automation systems, sub-second realtime telephony, and custom multi-agent swarms engineered for immediate enterprise ROI.',
      defaultOgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      sitemapEnabled: true,
      robotsTxt: 'User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://varah.ai/sitemap.xml',
    },
  });

  // 2. TEAM OPERATORS (4-TIER RBAC)
  console.log('👥 [2/10] Seeding 4-tier RBAC operators...');
  const users = [
    {
      id: 'usr_owner_01',
      name: 'Dhruv',
      email: 'dhruv@varah.ai',
      role: 'OWNER' as const,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      isActive: true,
      twoFactorEnabled: true,
    },
    {
      id: 'usr_admin_02',
      name: 'Sarah Chen',
      email: 'sarah.chen@varah.ai',
      role: 'ADMIN' as const,
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
      isActive: true,
      twoFactorEnabled: true,
    },
    {
      id: 'usr_editor_03',
      name: 'Marcus Vance',
      email: 'marcus.vance@varah.ai',
      role: 'EDITOR' as const,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      isActive: true,
      twoFactorEnabled: false,
    },
    {
      id: 'usr_viewer_04',
      name: 'Elena Rostova',
      email: 'elena.rostova@varah.ai',
      role: 'VIEWER' as const,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
      isActive: true,
      twoFactorEnabled: false,
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        role: u.role,
        avatarUrl: u.avatarUrl,
        isActive: u.isActive,
        twoFactorEnabled: u.twoFactorEnabled,
      },
      create: {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        avatarUrl: u.avatarUrl,
        isActive: u.isActive,
        twoFactorEnabled: u.twoFactorEnabled,
        passwordHash: 'argon2id$v=19$m=65536,t=3,p=4$local_dev_hash', // Simulated secure hash
      },
    });
  }

  // 3. INTEGRATIONS & WEBHOOKS
  console.log('🔌 [3/10] Seeding enterprise integrations & webhooks...');
  const integrations = [
    {
      type: 'SLACK_WEBHOOK' as const,
      name: 'Production Ops Relays (#ops-alerts)',
      description: 'Dispatches high-urgency lead notifications and system anomalies to Slack engineering channels',
      isEnabled: true,
      config: { webhookUrl: 'https://hooks.slack.com/services/T00/B00/VARAH_OPS', channel: '#ops-alerts' },
      apiKey: 'sec_slack_relay_098271',
    },
    {
      type: 'CALENDLY' as const,
      name: 'Executive Discovery Scheduler',
      description: 'Automated consultation slot synchronization directly on qualified lead conversion',
      isEnabled: true,
      config: { eventType: 'executive-ai-discovery-30m', orgId: 'varah-systems' },
      apiKey: 'sec_calendly_oauth_live',
    },
    {
      type: 'STRIPE' as const,
      name: 'Retainer & Sprint Billing Gateway',
      description: 'Automated invoice settlement, retainers, and enterprise SLA subscriptions',
      isEnabled: true,
      config: { webhookEndpoint: 'https://varah.ai/api/webhooks/stripe', currency: 'usd' },
      apiKey: 'rk_live_varah_stripe_billing',
    },
    {
      type: 'SMTP' as const,
      name: 'Transactional Mail Relay (Resend / Postmark)',
      description: 'Zero-latency transactional email dispatch for proposals and newsletters',
      isEnabled: true,
      config: { host: 'smtp.resend.com', port: 465, secure: true, fromEmail: 'inbound@varah.ai' },
      apiKey: 're_live_8917239127391',
    },
  ];

  for (const item of integrations) {
    await prisma.integration.upsert({
      where: { id: item.name },
      update: {
        isEnabled: item.isEnabled,
        description: item.description,
        config: item.config,
      },
      create: {
        type: item.type,
        name: item.name,
        description: item.description,
        isEnabled: item.isEnabled,
        config: item.config,
        apiKey: item.apiKey,
      },
    });
  }

  // 4. CRM TAGS & INBOUND LEADS
  console.log('📈 [4/10] Seeding CRM tags, leads & interaction timelines...');
  const tags = [
    { name: 'Enterprise AI', colorHex: '#00f0ff' },
    { name: 'Voice Telephony', colorHex: '#10b981' },
    { name: 'Autonomous Swarm', colorHex: '#a855f7' },
    { name: 'SAP / ERP Sync', colorHex: '#f59e0b' },
    { name: 'High Budget', colorHex: '#ec4899' },
    { name: 'Urgent SLA', colorHex: '#ef4444' },
  ];

  for (const t of tags) {
    await prisma.leadTag.upsert({
      where: { name: t.name },
      update: { colorHex: t.colorHex },
      create: { name: t.name, colorHex: t.colorHex },
    });
  }

  const leads = [
    {
      id: 'lead_seed_01',
      name: 'Marcus Vance',
      email: 'm.vance@acmesupply.com',
      phone: '+1 (555) 389-1024',
      company: 'Acme Supply Chain Logistics',
      website: 'https://acmesupply.com',
      budgetRange: '$25,000 - $50,000',
      serviceInterest: 'Autonomous Workflows',
      message: 'We process 1,200 supplier invoices and bills of lading weekly across SAP and QuickBooks. We need an automated extraction agent that parses multi-format PDFs, reconciles line items, and flags discrepancies before batch payment.',
      stage: 'NEW' as const,
      priority: 'HIGH' as const,
      utmSource: 'google_search',
      utmMedium: 'cpc',
      utmCampaign: 'enterprise_ai_automation',
      convertedOnPage: '/solutions',
      referrerUrl: 'https://google.com/search?q=enterprise+workflow+automation',
    },
    {
      id: 'lead_seed_02',
      name: 'Dr. Evelyn Reed',
      email: 'ereed@apexmedhealth.org',
      phone: '+1 (555) 721-9943',
      company: 'Apex Health Systems',
      website: 'https://apexmedhealth.org',
      budgetRange: '$50,000 - $100,000',
      serviceInterest: 'Realtime Telephony Cluster',
      message: 'Looking to deploy an autonomous conversational voice agent for patient triage and post-operative follow-up across our 4 regional clinic networks. Needs sub-500ms voice response and strict HIPAA compliance.',
      stage: 'QUALIFIED' as const,
      priority: 'URGENT' as const,
      utmSource: 'linkedin',
      utmMedium: 'social',
      utmCampaign: 'healthtech_voice_ai',
      convertedOnPage: '/book',
      referrerUrl: 'https://linkedin.com/posts/varah-systems_realtime-voice',
    },
    {
      id: 'lead_seed_03',
      name: 'Tariq Al-Mansoor',
      email: 't.mansoor@qf-capital.ae',
      phone: '+971 4 829 1100',
      company: 'Quantum Flow Capital',
      website: 'https://qf-capital.ae',
      budgetRange: '$100,000+',
      serviceInterest: 'Multi-Agent Orchestration Swarm',
      message: 'We manage a sovereign tech portfolio and require an automated research pipeline that aggregates SEC filings, earnings calls, and global patent registries into predictive thesis briefs daily by 06:00 GST.',
      stage: 'PROPOSAL_SENT' as const,
      priority: 'HIGH' as const,
      utmSource: 'direct',
      utmMedium: 'referral',
      utmCampaign: 'partner_network',
      convertedOnPage: '/calculator',
      referrerUrl: 'https://techcrunch.com/features/varah-ai',
    },
    {
      id: 'lead_seed_04',
      name: 'Claire Beauchamp',
      email: 'claire@omnistore-retail.com',
      phone: '+44 20 7946 0912',
      company: 'OmniStore Global Direct',
      website: 'https://omnistore-retail.com',
      budgetRange: '$50,000 - $100,000',
      serviceInterest: 'Autonomous Revenue Engine',
      message: 'Looking to overhaul our multi-brand Shopify Plus and Klaviyo pipeline with autonomous customer lifecycle agents that handle dynamic personalized churn prevention.',
      stage: 'WON' as const,
      priority: 'HIGH' as const,
      utmSource: 'twitter',
      utmMedium: 'organic',
      utmCampaign: 'founder_threads',
      convertedOnPage: '/case-studies',
      referrerUrl: 'https://x.com/varah_ai',
    },
    {
      id: 'lead_seed_05',
      name: 'Dmitri Volkov',
      email: 'd.volkov@hyperion-cyber.io',
      phone: '+1 (555) 438-9210',
      company: 'Hyperion Cyber Defense',
      website: 'https://hyperion-cyber.io',
      budgetRange: '$10,000 - $25,000',
      serviceInterest: 'Vector Knowledge Architecture',
      message: 'Need automated security incident summarization across Splunk and Crowdstrike telemetry logs.',
      stage: 'CONTACTED' as const,
      priority: 'MEDIUM' as const,
      utmSource: 'google_search',
      utmMedium: 'organic',
      utmCampaign: 'seo_knowledge_engine',
      convertedOnPage: '/solutions/neural-retrieval',
    },
    {
      id: 'lead_seed_06',
      name: 'Arthur Pendelton',
      email: 'arthur@legacy-distribution.co.uk',
      phone: '+44 161 496 0123',
      company: 'Pendelton & Sons Distribution',
      website: 'https://pendelton-dist.co.uk',
      budgetRange: '< $5,000',
      serviceInterest: 'General AI Advice',
      message: 'Can someone send me a free PowerPoint on how ChatGPT can run my warehouse?',
      stage: 'LOST' as const,
      priority: 'LOW' as const,
      utmSource: 'direct',
      utmMedium: 'none',
      convertedOnPage: '/contact',
    },
  ];

  for (const l of leads) {
    await prisma.lead.upsert({
      where: { email: l.email },
      update: {
        stage: l.stage,
        priority: l.priority,
        budgetRange: l.budgetRange,
      },
      create: {
        id: l.id,
        name: l.name,
        email: l.email,
        phone: l.phone,
        company: l.company,
        website: l.website,
        budgetRange: l.budgetRange,
        serviceInterest: l.serviceInterest,
        message: l.message,
        stage: l.stage,
        priority: l.priority,
        utmSource: l.utmSource,
        utmMedium: l.utmMedium,
        utmCampaign: l.utmCampaign,
        convertedOnPage: l.convertedOnPage,
        referrerUrl: l.referrerUrl,
      },
    });

    // Seed Notes for active leads
    if (l.stage === 'QUALIFIED' || l.stage === 'PROPOSAL_SENT' || l.stage === 'WON') {
      await prisma.leadNote.create({
        data: {
          leadId: l.id,
          authorId: 'usr_owner_01',
          content: `Initial discovery session conducted with ${l.name}. Architecture blueprint validated and legal NDA countersigned. Target deployment window scheduled for Q4.`,
        },
      });
    }
  }

  // 5. CONVERTED CLIENT & ACTIVE PROJECTS
  console.log('💼 [5/10] Seeding converted client & active client projects...');
  const client = await prisma.client.upsert({
    where: { email: 'claire@omnistore-retail.com' },
    update: {
      company: 'OmniStore Global Direct',
      name: 'Claire Beauchamp',
    },
    create: {
      id: 'cli_omnistore_01',
      name: 'Claire Beauchamp',
      company: 'OmniStore Global Direct',
      email: 'claire@omnistore-retail.com',
      phone: '+44 20 7946 0912',
      billingAddress: '42 Old Broad Street, London EC2N 1HN, United Kingdom',
      notes: 'Strategic retail automation partner. Enterprise Tier-1 SLA with 99.9% uptime commitment.',
      convertedFromLeadId: 'lead_seed_04',
    },
  });

  const project = await prisma.project.upsert({
    where: { code: 'PRJ-OMNI-01' },
    update: {
      status: 'ACTIVE' as const,
      contractValue: 85000.00,
    },
    create: {
      id: 'prj_omni_autonomous_revenue',
      clientId: client.id,
      title: 'Autonomous Multi-Brand Revenue Engine',
      code: 'PRJ-OMNI-01',
      description: 'End-to-end autonomous customer intelligence pipeline integrating Klaviyo, Shopify Plus, and Snowflake for real-time customer lifetime value optimization.',
      status: 'ACTIVE' as const,
      contractValue: 85000.00,
      startDate: new Date('2026-09-01'),
      targetEndDate: new Date('2026-12-15'),
      repositoryUrl: 'https://github.com/varah-systems/omnistore-revenue-swarm',
      documentationUrl: 'https://docs.varah.ai/projects/PRJ-OMNI-01',
    },
  });

  const milestones = [
    { title: 'Architecture Blueprint & Data Schema Design', order: 1, status: 'COMPLETED' as const },
    { title: 'Sub-second Data Ingestion Pipeline & Webhooks', order: 2, status: 'COMPLETED' as const },
    { title: 'Autonomous Swarm Behavioral Calibration', order: 3, status: 'IN_PROGRESS' as const },
    { title: 'Load Testing, Failover Verification & Production Handover', order: 4, status: 'PENDING' as const },
  ];

  for (const m of milestones) {
    await prisma.projectMilestone.create({
      data: {
        projectId: project.id,
        title: m.title,
        order: m.order,
        status: m.status,
      },
    });
  }

  // 6. CORE SERVICES & AI SYSTEM INDEX MODULES
  console.log('⚡ [6/10] Seeding 6 core AI engineering system modules...');
  const services = [
    {
      slug: 'autonomous-revenue-engine',
      title: 'Autonomous Revenue Engine',
      shortDesc: 'Self-directing pipeline that captures, qualifies, and orchestrates enterprise deal progression.',
      longDesc: 'Autonomous deal capture engine utilizing predictive multi-touch intent signals, dynamic lead qualification scoring, and automated follow-up sequences integrated with your CRM.',
      icon: 'fa-funnel-dollar',
      features: ['Real-time intent telemetry', 'Dynamic objection analysis', 'Multi-channel personalized cadence', 'CRM bi-directional sync'],
      connectedStack: ['HubSpot', 'Salesforce', 'OpenAI GPT-4o', 'Resend', 'PostgreSQL'],
      pricingTier: 'From $12,500 / deployment',
      order: 1,
      status: 'PUBLISHED' as const,
    },
    {
      slug: 'realtime-voice-telephony-cluster',
      title: 'Realtime Telephony & Voice Agent Cluster',
      shortDesc: 'Sub-300ms conversational voice agents handling phone support, triage, and qualification.',
      longDesc: 'Ultra-low latency conversational voice cluster running on WebRTC and custom SIP gateways with streaming neural TTS and uninterrupted barge-in comprehension.',
      icon: 'fa-phone-volume',
      features: ['< 300ms speech-to-speech latency', 'Barge-in interruption handling', 'Custom phonetic voice cloning', 'HIPAA & PCI compliant redaction'],
      connectedStack: ['Twilio SIP', 'LiveKit WebRTC', 'Deepgram Nova-2', 'Cartesia Sonic', 'Groq LPU'],
      pricingTier: 'From $18,000 / deployment',
      order: 2,
      status: 'PUBLISHED' as const,
    },
    {
      slug: 'multi-agent-orchestration-swarm',
      title: 'Multi-Agent Orchestration Swarm',
      shortDesc: 'Autonomous worker swarms executing complex, multi-system operational workflows.',
      longDesc: 'Hierarchical multi-agent networks featuring supervisor-worker patterns, automated self-correction loops, consensus validation, and state persistence.',
      icon: 'fa-network-wired',
      features: ['Deterministic DAG execution', 'Dynamic task decomposition', 'Automated anomaly self-healing', 'Cryptographic audit ledger'],
      connectedStack: ['LangGraph', 'Temporal.io', 'Claude 3.5 Sonnet', 'Redis', 'Docker'],
      pricingTier: 'From $25,000 / deployment',
      order: 3,
      status: 'PUBLISHED' as const,
    },
    {
      slug: 'vector-knowledge-neural-retrieval',
      title: 'Vector Knowledge & Neural Retrieval',
      shortDesc: 'Enterprise-wide unified cognitive index eliminating institutional data silos.',
      longDesc: 'Hybrid dense-sparse retrieval augmented generation platform indexing documentation, Slack archives, Notion wikis, and ERP databases with reranking models.',
      icon: 'fa-database',
      features: ['Hybrid semantic + BM25 keyword search', 'Cohere Rerank v3 integration', 'Zero data leakage RBAC filters', 'Automatic stale document invalidation'],
      connectedStack: ['Pinecone', 'Qdrant', 'Cohere', 'LlamaIndex', 'Unstructured.io'],
      pricingTier: 'From $15,000 / deployment',
      order: 4,
      status: 'PUBLISHED' as const,
    },
    {
      slug: 'workflow-synthesis-operations',
      title: 'Automated Operations & Workflow Synthesis',
      shortDesc: 'Zero-touch back-office automation replacing manual human data reconciliation.',
      longDesc: 'End-to-end ingestion and synthesis pipelines that parse complex multi-page financial ledgers, freight invoices, and customs paperwork with 99.8% field accuracy.',
      icon: 'fa-gears',
      features: ['Vision-language model table extraction', 'Cross-system ERP reconciliation', 'Human-in-the-loop exception routing', 'Sub-minute processing SLA'],
      connectedStack: ['SAP S/4HANA', 'NetSuite', 'AWS Textract', 'FastAPI', 'Celery'],
      pricingTier: 'From $16,500 / deployment',
      order: 5,
      status: 'PUBLISHED' as const,
    },
    {
      slug: 'custom-tool-integration-pipeline',
      title: 'Custom Autonomous Tool Integration',
      shortDesc: 'Direct neural connectivity between LLMs and bespoke proprietary enterprise APIs.',
      longDesc: 'Deterministic API abstraction layers enabling autonomous agents to safely trigger mutations, issue refunds, provision infrastructure, and execute financial wires with strict RBAC guards.',
      icon: 'fa-code-branch',
      features: ['OpenAPI / Swagger auto-generation', 'Idempotency key enforcement', 'Cryptographic signature verification', 'Granular rate limit fencing'],
      connectedStack: ['Node.js', 'Go', 'GraphQL', 'AWS KMS', 'PostgreSQL'],
      pricingTier: 'From $14,000 / deployment',
      order: 6,
      status: 'PUBLISHED' as const,
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        title: s.title,
        shortDesc: s.shortDesc,
        longDesc: s.longDesc,
        features: s.features,
        connectedStack: s.connectedStack,
        pricingTier: s.pricingTier,
        status: s.status,
      },
      create: {
        slug: s.slug,
        title: s.title,
        shortDesc: s.shortDesc,
        longDesc: s.longDesc,
        icon: s.icon,
        features: s.features,
        connectedStack: s.connectedStack,
        pricingTier: s.pricingTier,
        order: s.order,
        status: s.status,
      },
    });
  }

  // 7. HIGH-ROI CASE STUDIES
  console.log('🏆 [7/10] Seeding high-ROI enterprise case studies...');
  const caseStudies = [
    {
      slug: 'apex-logistics-document-intelligence',
      title: 'Autonomous Ingestion Pipeline for Global Freight Reconciliation',
      clientName: 'Apex Global Logistics',
      industry: 'Supply Chain & Freight Forwarding',
      challenge: 'Apex was manually processing over 18,000 international bills of lading and customs declarations every month across 28 global hubs, creating an 8-day billing backlog and $320,000 in monthly payment disputes.',
      solution: 'VARAH SYSTEMS deployed a vision-augmented multi-agent pipeline with deterministic line-item cross-checking against SAP and OCR discrepancy arbitration.',
      results: [
        { metric: 'Reconciliation Speed', value: '4.2x faster', change: '+320%' },
        { metric: 'Manual Review Rate', value: '2.1%', change: '-94%' },
        { metric: 'Annualized OpEx Savings', value: '$1.4M', change: '+100%' },
      ],
      techStack: ['Python', 'FastAPI', 'Claude 3.5 Sonnet', 'SAP S/4HANA', 'PostgreSQL'],
      heroImageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
      featured: true,
      order: 1,
      status: 'PUBLISHED' as const,
    },
    {
      slug: 'bionexus-clinical-retrieval-engine',
      title: 'Sub-Second Hybrid Neural Retrieval Across 1.4M Clinical Trial Files',
      clientName: 'BioNexus Therapeutics',
      industry: 'Biotechnology & Pharmaceuticals',
      challenge: 'Research oncologists spent an average of 14 hours per week scouring fragmented clinical research papers and internal laboratory trial registries.',
      solution: 'Engineered a sovereign, hybrid vector-sparse RAG architecture with Cohere reranking and citation-guaranteed mathematical answers.',
      results: [
        { metric: 'Mean Query Latency', value: '380ms', change: '-92%' },
        { metric: 'Citation Accuracy', value: '99.9%', change: '+100%' },
        { metric: 'Research Velocity', value: '3.6x', change: '+260%' },
      ],
      techStack: ['Qdrant', 'Cohere Rerank', 'Next.js 14', 'TypeScript', 'Docker'],
      heroImageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80',
      featured: true,
      order: 2,
      status: 'PUBLISHED' as const,
    },
  ];

  for (const cs of caseStudies) {
    await prisma.caseStudy.upsert({
      where: { slug: cs.slug },
      update: {
        title: cs.title,
        clientName: cs.clientName,
        industry: cs.industry,
        results: cs.results,
        techStack: cs.techStack,
        featured: cs.featured,
        status: cs.status,
      },
      create: {
        slug: cs.slug,
        title: cs.title,
        clientName: cs.clientName,
        industry: cs.industry,
        challenge: cs.challenge,
        solution: cs.solution,
        results: cs.results,
        techStack: cs.techStack,
        heroImageUrl: cs.heroImageUrl,
        featured: cs.featured,
        order: cs.order,
        status: cs.status,
      },
    });
  }

  // 8. TECHNICAL ARTICLES & ENGINEERING BRIEFS
  console.log('✍️  [8/10] Seeding technical engineering articles...');
  const posts = [
    {
      slug: 'benchmarking-hybrid-rag-architectures',
      title: 'Benchmarking Hybrid RAG: Dense Vector Search vs Sparse BM25 + Cross-Encoder Reranking',
      excerpt: 'An empirical evaluation of semantic retrieval accuracy across 2.5 million technical documents under high-concurrency production loads.',
      content: `# Benchmarking Hybrid RAG Architectures at Production Scale

In enterprise deployments, naive dense vector search frequently fails on exact serial numbers, product SKUs, and specialized domain acronyms.

## The Problem with Pure Cosine Distance

While embedding models excel at thematic intent, they project distinct tokens into dense high-dimensional clusters where precision is lost.

\`\`\`python
# Hybrid score fusion using Reciprocal Rank Fusion (RRF)
def reciprocal_rank_fusion(dense_ranks, sparse_ranks, k=60):
    scores = {}
    for doc_id, rank in dense_ranks.items():
        scores[doc_id] = scores.get(doc_id, 0) + (1.0 / (k + rank))
    for doc_id, rank in sparse_ranks.items():
        scores[doc_id] = scores.get(doc_id, 0) + (1.0 / (k + rank))
    return sorted(scores.items(), key=lambda x: x[1], reverse=True)
\`\`\`

## Empirical Production Findings

1. **Reranker Impact:** Cohere Rerank v3 improved top-3 MRR from 0.62 to 0.89.
2. **Latency Budget:** Sparse BM25 introduces < 8ms overhead when pre-indexed in memory.
3. **Chunking Topology:** Dynamic semantic boundary chunking outperformed fixed 512-token windows by 34% in clinical retrieval evaluations.`,
      coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      authorId: 'usr_owner_01',
      tags: ['RAG', 'Vector Search', 'Cohere', 'Architecture'],
      readingTimeMin: 7,
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2026-09-20'),
    },
    {
      slug: 'sub-300ms-conversational-voice-webrtc-groq',
      title: 'Achieving Sub-300ms Conversational Latency in Realtime Telephony Voice Clusters',
      excerpt: 'How we eliminate conversational jitter and pipeline delay using WebRTC media streaming, Deepgram Nova-2, and Groq LPUs.',
      content: `# Achieving Sub-300ms Conversational Latency in Realtime Voice

Human conversation feels sluggish when total turnaround latency exceeds 400ms. Achieving instantaneous responsiveness requires optimizing every millisecond in the audio loop.

## Architectural Bottlenecks

- **HTTP Request Overhead:** Discarded in favor of duplex WebRTC data and media channels.
- **Speculative Execution:** Streaming tokens directly to neural TTS before sentence completion.
- **Interruption Gate:** Acoustic echo cancellation combined with local VAD (Voice Activity Detection).`,
      coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      authorId: 'usr_admin_02',
      tags: ['Voice AI', 'WebRTC', 'Groq', 'Telephony'],
      readingTimeMin: 5,
      status: 'PUBLISHED' as const,
      publishedAt: new Date('2026-10-02'),
    },
  ];

  for (const p of posts) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        status: p.status,
      },
      create: {
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        coverImage: p.coverImage,
        authorId: p.authorId,
        tags: p.tags,
        readingTimeMin: p.readingTimeMin,
        status: p.status,
        publishedAt: p.publishedAt,
      },
    });
  }

  // 9. MEDIA LIBRARY & FOLDERS
  console.log('🖼️  [9/10] Seeding media library folders and CDN assets...');
  const folders = [
    { name: 'Brand Assets', slug: 'brand-assets' },
    { name: 'Case Studies', slug: 'case-studies' },
    { name: 'Technical Diagrams', slug: 'technical-diagrams' },
    { name: 'Executive Team', slug: 'team' },
  ];

  for (const f of folders) {
    await prisma.mediaFolder.upsert({
      where: { slug: f.slug },
      update: { name: f.name },
      create: { name: f.name, slug: f.slug },
    });
  }

  // 10. NEWSLETTER SUBSCRIBERS & AUDIT LOGS
  console.log('📜 [10/10] Seeding newsletter subscribers & operational audit ledger...');
  const subscribers = [
    { email: 'alex.rivera@scalevp.com', source: 'footer', status: 'SUBSCRIBED' as const },
    { email: 'j.lindqvist@nordictech.io', source: 'blog_inline', status: 'SUBSCRIBED' as const },
    { email: 'samantha.wu@sequoia.com', source: 'calculator', status: 'SUBSCRIBED' as const },
    { email: 'k.patel@horizon-ai.org', source: 'case_studies', status: 'SUBSCRIBED' as const },
  ];

  for (const sub of subscribers) {
    await prisma.newsletterSubscriber.upsert({
      where: { email: sub.email },
      update: { status: sub.status },
      create: { email: sub.email, source: sub.source, status: sub.status },
    });
  }

  // Seed baseline audit event
  await prisma.auditLog.create({
    data: {
      userId: 'usr_owner_01',
      action: 'SYSTEM.INITIALIZE_DATABASE',
      entityType: 'System',
      metadata: { environment: 'production', version: '2.0.0-enterprise' },
      createdAt: new Date(),
    },
  });

  console.log('✅ [VARAH SEED] Database seeding finished successfully! All 8 modules primed.');
}

main()
  .catch((e) => {
    console.error('❌ [VARAH SEED ERROR]:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
