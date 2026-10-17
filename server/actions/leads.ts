'use server';

/**
 * ==============================================================================
 * VARAH SYSTEMS — SERVER ACTIONS: LEADS & CRM
 * Inbound lead processing, Kanban pipeline mutations, notes, and activity tracking
 * ==============================================================================
 */

import { getSession } from '@/lib/auth/session';
import { assertPermission } from '@/lib/rbac/permissions';
import type {
  Lead,
  LeadStage,
  LeadPriority,
  LeadNote,
  LeadStatusHistory,
  KanbanState,
  KanbanColumn,
  LeadTag,
} from '@/types/admin';

// Live Pipeline Storage — Pre-seeded with 18 High-Growth Target Accounts
const INITIAL_TARGET_LEADS: Lead[] = [
  {
    id: 'lead_hexclad',
    name: 'Daniel Wiesenfeld',
    email: 'd.wiesenfeld@hexclad.com',
    phone: '+1 (310) 844-7920',
    company: 'HexClad',
    website: 'https://hexclad.com',
    budgetRange: '$60,000 - $110,000',
    serviceInterest: 'Autonomous Tier-1/2 CX Agent',
    message: 'Deflect 68% of WISMO and return tickets across global storefronts while executing instant exchanges autonomously.',
    stage: 'PROPOSAL_SENT',
    priority: 'URGENT',
    isSpam: false,
    utmSource: 'outbound_prospecting',
    utmMedium: 'linkedin_sales_nav',
    utmCampaign: 'q4_enterprise_cx',
    convertedOnPage: '/solutions/ai-customer-support.html',
    referrerUrl: 'https://hexclad.com',
    assignedToId: 'usr_dhruv',
    assignedToName: 'Dhruv (Founder)',
    assignedToAvatar: null,
    lastContactedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    tags: [{ id: 't_ecom', name: 'E-Commerce / D2C', colorHex: '#00f0ff' }, { id: 't_tier1', name: 'Tier 1 Priority', colorHex: '#10b981' }],
    notesCount: 2,
    attachmentsCount: 1,
  },
  {
    id: 'lead_guardian_dentistry',
    name: 'Dr. Hitesh Patel',
    email: 'hpatel@guardiandentistry.com',
    phone: '+1 (305) 912-8831',
    company: 'Guardian Dentistry Partners',
    website: 'https://guardiandentistry.com',
    budgetRange: '$75,000 - $140,000',
    serviceInterest: '24/7 Voice AI Telephony Scheduler',
    message: '150+ clinics facing 25%+ missed inbound patient scheduling calls ($800 lost production/patient). Voice AI schedules directly into Dentrix PMS.',
    stage: 'QUALIFIED',
    priority: 'URGENT',
    isSpam: false,
    utmSource: 'outbound_prospecting',
    utmMedium: 'cold_email',
    utmCampaign: 'healthcare_dso_telephony',
    convertedOnPage: '/solutions/ai-voice.html',
    referrerUrl: 'https://guardiandentistry.com',
    assignedToId: 'usr_dhruv',
    assignedToName: 'Dhruv (Founder)',
    assignedToAvatar: null,
    lastContactedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    tags: [{ id: 't_health', name: 'Healthcare / DSO', colorHex: '#10b981' }, { id: 't_voice', name: 'Voice AI', colorHex: '#00f0ff' }],
    notesCount: 2,
    attachmentsCount: 0,
  },
  {
    id: 'lead_rentvine',
    name: 'David Bitton',
    email: 'dbitton@rentvine.com',
    phone: '+1 (888) 388-7368',
    company: 'Rentvine',
    website: 'https://rentvine.com',
    budgetRange: '$50,000 - $95,000',
    serviceInterest: 'Cognitive OCR & Migration Ingestion Pipeline',
    message: '4,600% growth causing customer onboarding bottlenecks. Automated extraction and cleanup of legacy chart-of-accounts from AppFolio/Buildium.',
    stage: 'CONTACTED',
    priority: 'HIGH',
    isSpam: false,
    utmSource: 'outbound_prospecting',
    utmMedium: 'inc_5000_research',
    utmCampaign: 'proptech_migrations',
    convertedOnPage: '/solutions/document-intelligence.html',
    referrerUrl: 'https://rentvine.com',
    assignedToId: 'usr_dhruv',
    assignedToName: 'Dhruv (Founder)',
    assignedToAvatar: null,
    lastContactedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    tags: [{ id: 't_prop', name: 'PropTech', colorHex: '#f59e0b' }, { id: 't_ocr', name: 'Document OCR', colorHex: '#8b5cf6' }],
    notesCount: 1,
    attachmentsCount: 0,
  },
  {
    id: 'lead_atomix',
    name: 'Austin Kreinz',
    email: 'akreinz@atomixlogistics.com',
    phone: '+1 (414) 208-4100',
    company: 'Atomix Logistics',
    website: 'https://atomixlogistics.com',
    budgetRange: '$45,000 - $85,000',
    serviceInterest: 'Multi-Agent Order Dispatcher & Real-time OMS Sync',
    message: 'Ranked #10 on Inc 5000 with 11,400% growth. Autonomous multi-node inventory routing during viral order spikes without manual warehouse intervention.',
    stage: 'CONTACTED',
    priority: 'HIGH',
    isSpam: false,
    utmSource: 'outbound_prospecting',
    utmMedium: 'inc_5000_honoree',
    utmCampaign: '3pl_warehouse_automation',
    convertedOnPage: '/solutions/ai-agents.html',
    referrerUrl: 'https://atomixlogistics.com',
    assignedToId: 'usr_dhruv',
    assignedToName: 'Dhruv (Founder)',
    assignedToAvatar: null,
    lastContactedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    tags: [{ id: 't_log', name: 'Logistics / 3PL', colorHex: '#00f0ff' }, { id: 't_agents', name: 'Multi-Agent', colorHex: '#ec4899' }],
    notesCount: 1,
    attachmentsCount: 0,
  },
  {
    id: 'lead_aprio',
    name: 'Richard Kopelman',
    email: 'rkopelman@aprio.com',
    phone: '+1 (404) 892-9651',
    company: 'Aprio',
    website: 'https://aprio.com',
    budgetRange: '$80,000 - $160,000',
    serviceInterest: 'Cognitive Document Intelligence & Ledger Verification',
    message: 'Addressing CPA talent shortage by automating seasonal K-1, W-2, and trial balance ingestion with 99.4% OCR extraction accuracy.',
    stage: 'QUALIFIED',
    priority: 'URGENT',
    isSpam: false,
    utmSource: 'outbound_prospecting',
    utmMedium: 'cpa_top_100_research',
    utmCampaign: 'cpa_advisory_scale',
    convertedOnPage: '/solutions/document-intelligence.html',
    referrerUrl: 'https://aprio.com',
    assignedToId: 'usr_dhruv',
    assignedToName: 'Dhruv (Founder)',
    assignedToAvatar: null,
    lastContactedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    tags: [{ id: 't_cpa', name: 'CPA / Accounting', colorHex: '#10b981' }, { id: 't_tier1', name: 'Enterprise', colorHex: '#3b82f6' }],
    notesCount: 2,
    attachmentsCount: 1,
  },
  {
    id: 'lead_arrive_logistics',
    name: 'J. Michael Meredith',
    email: 'm.meredith@arrivelogistics.com',
    phone: '+1 (888) 995-7695',
    company: 'Arrive Logistics',
    website: 'https://arrivelogistics.com',
    budgetRange: '$90,000 - $180,000',
    serviceInterest: 'Multi-Agent Carrier Sourcing & Rate Parser',
    message: 'Replaces manual carrier rate quote copying from emails into TMS with autonomous multi-agent parsing and instant margin validation.',
    stage: 'NEW',
    priority: 'HIGH',
    isSpam: false,
    utmSource: 'outbound_prospecting',
    utmMedium: 'freight_brokerage_list',
    utmCampaign: 'freight_rate_parsing',
    convertedOnPage: '/solutions/ai-agents.html',
    referrerUrl: 'https://arrivelogistics.com',
    assignedToId: 'usr_dhruv',
    assignedToName: 'Dhruv (Founder)',
    assignedToAvatar: null,
    lastContactedAt: null,
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    tags: [{ id: 't_log', name: 'Logistics / 3PL', colorHex: '#00f0ff' }, { id: 't_freight', name: 'Digital Freight', colorHex: '#3b82f6' }],
    notesCount: 1,
    attachmentsCount: 0,
  },
  {
    id: 'lead_vitana_pediatric',
    name: 'Rachel Simmons',
    email: 'rsimmons@vitanapartners.com',
    phone: '+1 (800) 419-5182',
    company: 'Vitana Pediatric & Orthodontic Partners',
    website: 'https://vitanapartners.com',
    budgetRange: '$40,000 - $75,000',
    serviceInterest: 'Voice AI Telephony & Multichannel Recall',
    message: 'Natural conversational voice scheduling for after-hours pediatric appointments, reducing parent bounce rates and clinic no-shows.',
    stage: 'NEW',
    priority: 'MEDIUM',
    isSpam: false,
    utmSource: 'outbound_prospecting',
    utmMedium: 'inc_5000_healthcare',
    utmCampaign: 'pediatric_voice_scheduler',
    convertedOnPage: '/solutions/ai-voice.html',
    referrerUrl: 'https://vitanapartners.com',
    assignedToId: 'usr_dhruv',
    assignedToName: 'Dhruv (Founder)',
    assignedToAvatar: null,
    lastContactedAt: null,
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    tags: [{ id: 't_health', name: 'Healthcare / DSO', colorHex: '#10b981' }],
    notesCount: 1,
    attachmentsCount: 0,
  },
  {
    id: 'lead_asset_living',
    name: 'Thomas Thorne',
    email: 'tthorne@assetliving.com',
    phone: '+1 (713) 839-8080',
    company: 'Asset Living',
    website: 'https://assetliving.com',
    budgetRange: '$70,000 - $130,000',
    serviceInterest: 'Conversational Maintenance Diagnostic & Dispatch Agent',
    message: 'Triages 500+ daily maintenance calls across 100,000+ multifamily doors, eliminating unnecessary vendor truck rolls.',
    stage: 'NEW',
    priority: 'HIGH',
    isSpam: false,
    utmSource: 'outbound_prospecting',
    utmMedium: 'multifamily_exec_list',
    utmCampaign: 'proptech_maintenance_triage',
    convertedOnPage: '/industries/real-estate.html',
    referrerUrl: 'https://assetliving.com',
    assignedToId: 'usr_dhruv',
    assignedToName: 'Dhruv (Founder)',
    assignedToAvatar: null,
    lastContactedAt: null,
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    tags: [{ id: 't_prop', name: 'PropTech', colorHex: '#f59e0b' }, { id: 't_multi', name: '100k+ Units', colorHex: '#ef4444' }],
    notesCount: 1,
    attachmentsCount: 0,
  },
  {
    id: 'lead_ridge',
    name: 'Sean Frank',
    email: 'sfrank@ridge.com',
    phone: '+1 (800) 840-0251',
    company: 'Ridge',
    website: 'https://ridge.com',
    budgetRange: '$55,000 - $95,000',
    serviceInterest: 'Multilingual CX Agent & 3PL Telemetry Sync',
    message: 'Automating European localized support and cross-border return inspections without scaling customer support headcount.',
    stage: 'CONTACTED',
    priority: 'MEDIUM',
    isSpam: false,
    utmSource: 'outbound_prospecting',
    utmMedium: 'twitter_growth_ops',
    utmCampaign: 'international_cx_scale',
    convertedOnPage: '/industries/ecommerce.html',
    referrerUrl: 'https://ridge.com',
    assignedToId: 'usr_dhruv',
    assignedToName: 'Dhruv (Founder)',
    assignedToAvatar: null,
    lastContactedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    tags: [{ id: 't_ecom', name: 'E-Commerce / D2C', colorHex: '#00f0ff' }],
    notesCount: 1,
    attachmentsCount: 0,
  },
  {
    id: 'lead_steam_logistics',
    name: 'Jason Provonsha',
    email: 'jprovonsha@steamlogistics.com',
    phone: '+1 (423) 531-7700',
    company: 'Steam Logistics',
    website: 'https://steamlogistics.com',
    budgetRange: '$65,000 - $120,000',
    serviceInterest: 'Port Telemetry Scraper & Customs Parser',
    message: 'Real-time container telemetry and automated delivery order extraction to eliminate port demurrage and detention penalties.',
    stage: 'PROPOSAL_SENT',
    priority: 'HIGH',
    isSpam: false,
    utmSource: 'outbound_prospecting',
    utmMedium: 'freightwaves_outreach',
    utmCampaign: 'demurrage_port_telemetry',
    convertedOnPage: '/solutions/ai-automation.html',
    referrerUrl: 'https://steamlogistics.com',
    assignedToId: 'usr_dhruv',
    assignedToName: 'Dhruv (Founder)',
    assignedToAvatar: null,
    lastContactedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    tags: [{ id: 't_log', name: 'Logistics / 3PL', colorHex: '#00f0ff' }, { id: 't_tier1', name: 'Demurrage AI', colorHex: '#10b981' }],
    notesCount: 2,
    attachmentsCount: 1,
  },
  {
    id: 'lead_cherry_bekaert',
    name: 'Michelle Thompson',
    email: 'mthompson@cbh.com',
    phone: '+1 (804) 673-4224',
    company: 'Cherry Bekaert',
    website: 'https://cbh.com',
    budgetRange: '$95,000 - $190,000',
    serviceInterest: 'Client Workpaper Harmonization Pipeline',
    message: 'Standardized data onboarding and trial balance consolidation across acquired regional accounting practices.',
    stage: 'QUALIFIED',
    priority: 'HIGH',
    isSpam: false,
    utmSource: 'outbound_prospecting',
    utmMedium: 'accounting_today_pe',
    utmCampaign: 'ma_accounting_data_sync',
    convertedOnPage: '/solutions/ai-knowledge.html',
    referrerUrl: 'https://cbh.com',
    assignedToId: 'usr_dhruv',
    assignedToName: 'Dhruv (Founder)',
    assignedToAvatar: null,
    lastContactedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 11 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    tags: [{ id: 't_cpa', name: 'CPA / Accounting', colorHex: '#10b981' }, { id: 't_pe', name: 'PE-Backed', colorHex: '#ec4899' }],
    notesCount: 2,
    attachmentsCount: 0,
  },
  {
    id: 'lead_evernest',
    name: 'Matthew Whitaker',
    email: 'mwhitaker@evernest.co',
    phone: '+1 (205) 940-6363',
    company: 'Evernest',
    website: 'https://evernest.co',
    budgetRange: '$50,000 - $90,000',
    serviceInterest: 'Automated Tenant Lifecycle & Renewal Workflow',
    message: 'Automates applicant vetting and lease renewal negotiations across 20,000+ single-family rental doors.',
    stage: 'NEW',
    priority: 'MEDIUM',
    isSpam: false,
    utmSource: 'outbound_prospecting',
    utmMedium: 'sfr_operator_summit',
    utmCampaign: 'sfr_tenant_automation',
    convertedOnPage: '/industries/real-estate.html',
    referrerUrl: 'https://evernest.co',
    assignedToId: 'usr_dhruv',
    assignedToName: 'Dhruv (Founder)',
    assignedToAvatar: null,
    lastContactedAt: null,
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    tags: [{ id: 't_prop', name: 'PropTech', colorHex: '#f59e0b' }],
    notesCount: 1,
    attachmentsCount: 0,
  },
  {
    id: 'lead_liquid_death',
    name: 'Mike Cessario',
    email: 'ops@liquiddeath.com',
    phone: '+1 (310) 906-0391',
    company: 'Liquid Death',
    website: 'https://liquiddeath.com',
    budgetRange: '$75,000 - $135,000',
    serviceInterest: 'Autonomous AP/AR Deduction Dispute Agent',
    message: 'Automatically matches retail distributor chargebacks (Walmart/Target) and generates automated dispute documentation.',
    stage: 'NEW',
    priority: 'MEDIUM',
    isSpam: false,
    utmSource: 'outbound_prospecting',
    utmMedium: 'cpg_operations_network',
    utmCampaign: 'retail_chargeback_automation',
    convertedOnPage: '/solutions/ai-automation.html',
    referrerUrl: 'https://liquiddeath.com',
    assignedToId: 'usr_dhruv',
    assignedToName: 'Dhruv (Founder)',
    assignedToAvatar: null,
    lastContactedAt: null,
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    tags: [{ id: 't_cpg', name: 'CPG / Retail', colorHex: '#ec4899' }, { id: 't_apar', name: 'AP/AR Dispute', colorHex: '#10b981' }],
    notesCount: 1,
    attachmentsCount: 0,
  },
  {
    id: 'lead_highfive',
    name: 'Dr. Clinton Hazen',
    email: 'chazen@highfivehc.com',
    phone: '+1 (205) 545-8120',
    company: 'HighFive Healthcare',
    website: 'https://highfivehc.com',
    budgetRange: '$60,000 - $110,000',
    serviceInterest: 'Insurance Pre-Authorization Document Agent',
    message: 'Cognitive OCR extracts clinical surgical notes and submits pre-authorizations automatically, cutting procedure cancellations.',
    stage: 'NEW',
    priority: 'HIGH',
    isSpam: false,
    utmSource: 'outbound_prospecting',
    utmMedium: 'oral_surgery_association',
    utmCampaign: 'preauth_document_intelligence',
    convertedOnPage: '/solutions/document-intelligence.html',
    referrerUrl: 'https://highfivehc.com',
    assignedToId: 'usr_dhruv',
    assignedToName: 'Dhruv (Founder)',
    assignedToAvatar: null,
    lastContactedAt: null,
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    tags: [{ id: 't_health', name: 'Healthcare / DSO', colorHex: '#10b981' }, { id: 't_preauth', name: 'Pre-Auth OCR', colorHex: '#8b5cf6' }],
    notesCount: 1,
    attachmentsCount: 0,
  },
  {
    id: 'lead_shipbots',
    name: 'Payman Taei',
    email: 'ptaei@shipbots.com',
    phone: '+1 (800) 843-7447',
    company: 'Shipbots',
    website: 'https://shipbots.com',
    budgetRange: '$35,000 - $65,000',
    serviceInterest: '3PL Dimensional Discrepancy Auditing Engine',
    message: 'Catches dimensional carrier overbilling discrepancies across 200+ D2C merchant accounts.',
    stage: 'WON',
    priority: 'MEDIUM',
    isSpam: false,
    utmSource: 'outbound_prospecting',
    utmMedium: '3pl_director_referral',
    utmCampaign: 'dimension_audit_pilot',
    convertedOnPage: '/case-studies/invoice-processing.html',
    referrerUrl: 'https://shipbots.com',
    assignedToId: 'usr_dhruv',
    assignedToName: 'Dhruv (Founder)',
    assignedToAvatar: null,
    lastContactedAt: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    tags: [{ id: 't_log', name: 'Logistics / 3PL', colorHex: '#00f0ff' }, { id: 't_won', name: 'Active Client', colorHex: '#10b981' }],
    notesCount: 3,
    attachmentsCount: 2,
  },
  {
    id: 'lead_allinone',
    name: 'Julie Keyes',
    email: 'jkeyes@allinoneaccounting.com',
    phone: '+1 (651) 289-7600',
    company: 'All In One Accounting',
    website: 'https://allinoneaccounting.com',
    budgetRange: '$40,000 - $75,000',
    serviceInterest: 'AP/AR Bank Reconciliation Engine',
    message: 'Automates receipt matching and monthly ledger closing for fractional CFO and accounting clients.',
    stage: 'WON',
    priority: 'MEDIUM',
    isSpam: false,
    utmSource: 'outbound_prospecting',
    utmMedium: 'fractional_cfo_network',
    utmCampaign: 'bank_recon_automation',
    convertedOnPage: '/case-studies/lead-qualification.html',
    referrerUrl: 'https://allinoneaccounting.com',
    assignedToId: 'usr_dhruv',
    assignedToName: 'Dhruv (Founder)',
    assignedToAvatar: null,
    lastContactedAt: new Date(Date.now() - 18 * 24 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 35 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    tags: [{ id: 't_cpa', name: 'CPA / Accounting', colorHex: '#10b981' }, { id: 't_won', name: 'Active Client', colorHex: '#10b981' }],
    notesCount: 3,
    attachmentsCount: 1,
  },
  {
    id: 'lead_realmanage',
    name: 'Christopher Acker',
    email: 'cacker@realmanage.com',
    phone: '+1 (800) 480-2100',
    company: 'RealManage',
    website: 'https://realmanage.com',
    budgetRange: '$55,000 - $105,000',
    serviceInterest: 'Semantic HOA Bylaw Search & Triage Assistant',
    message: 'Resolves architectural review committee backlogs and answers homeowner compliance questions using private RAG.',
    stage: 'NEW',
    priority: 'LOW',
    isSpam: false,
    utmSource: 'outbound_prospecting',
    utmMedium: 'hoa_management_association',
    utmCampaign: 'hoa_bylaw_rag',
    convertedOnPage: '/industries/professional-services.html',
    referrerUrl: 'https://realmanage.com',
    assignedToId: 'usr_dhruv',
    assignedToName: 'Dhruv (Founder)',
    assignedToAvatar: null,
    lastContactedAt: null,
    createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    tags: [{ id: 't_prop', name: 'PropTech', colorHex: '#f59e0b' }],
    notesCount: 1,
    attachmentsCount: 0,
  },
  {
    id: 'lead_true_classic',
    name: 'Nick Ventura',
    email: 'nventura@trueclassictees.com',
    phone: '+1 (800) 919-4980',
    company: 'True Classic',
    website: 'https://trueclassictees.com',
    budgetRange: '$65,000 - $115,000',
    serviceInterest: 'Agentic Sizing & Exchange Consultation Assistant',
    message: 'Intercepts sizing return requests and offers real-time size recommendations to convert refunds into exchanges.',
    stage: 'CONTACTED',
    priority: 'HIGH',
    isSpam: false,
    utmSource: 'outbound_prospecting',
    utmMedium: 'ecom_growth_summit',
    utmCampaign: 'sizing_exchange_retention',
    convertedOnPage: '/industries/ecommerce.html',
    referrerUrl: 'https://trueclassictees.com',
    assignedToId: 'usr_dhruv',
    assignedToName: 'Dhruv (Founder)',
    assignedToAvatar: null,
    lastContactedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    tags: [{ id: 't_ecom', name: 'E-Commerce / D2C', colorHex: '#00f0ff' }],
    notesCount: 1,
    attachmentsCount: 0,
  },
];

let leadsStore: Lead[] = [...INITIAL_TARGET_LEADS];
let notesStore: Record<string, LeadNote[]> = {
  lead_hexclad: [
    {
      id: 'n_hex_1',
      leadId: 'lead_hexclad',
      authorId: 'usr_dhruv',
      authorName: 'Dhruv (Founder)',
      authorAvatar: null,
      content: 'Sent technical proposal for Tier-1 CX Agent with direct Gorgias/Shopify OMS action integration. Proposal value: $95,000 build + $6,500/mo SLA.',
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    },
  ],
  lead_guardian_dentistry: [
    {
      id: 'n_guard_1',
      leadId: 'lead_guardian_dentistry',
      authorId: 'usr_dhruv',
      authorName: 'Dhruv (Founder)',
      authorAvatar: null,
      content: 'COO confirmed 28% of inbound calls go to voicemail across regional clusters. Scheduled 20-min technical architecture demo with their clinical IT director.',
      createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    },
  ],
  lead_aprio: [
    {
      id: 'n_aprio_1',
      leadId: 'lead_aprio',
      authorId: 'usr_dhruv',
      authorName: 'Dhruv (Founder)',
      authorAvatar: null,
      content: 'Partner review meeting set for next Wednesday. Focus on automating 1099/K-1 document ingestion to handle peak tax season capacity.',
      createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    },
  ],
};
let historyStore: Record<string, LeadStatusHistory[]> = {};

export interface LeadFilterParams {
  query?: string;
  stage?: LeadStage | 'ALL';
  priority?: LeadPriority | 'ALL';
  service?: string;
  sortBy?: 'createdAt' | 'name' | 'company' | 'budgetRange' | 'stage';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface GetLeadsResult {
  leads: Lead[];
  total: number;
  page: number;
  pageSize: number;
  kanban: KanbanState;
}

/**
 * Fetch filtered, searched, and sorted leads + computed Kanban board state
 */
export async function getLeadsAction(params: LeadFilterParams = {}): Promise<GetLeadsResult> {
  const session = assertPermission(await getSession(), 'leads', 'view');

  const {
    query = '',
    stage = 'ALL',
    priority = 'ALL',
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    pageSize = 20,
  } = params;

  let filtered = [...leadsStore];

  // Search filter across name, email, company, and message
  if (query.trim()) {
    const q = query.toLowerCase().trim();
    filtered = filtered.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        (l.company && l.company.toLowerCase().includes(q)) ||
        l.message.toLowerCase().includes(q)
    );
  }

  // Stage filter
  if (stage !== 'ALL') {
    filtered = filtered.filter((l) => l.stage === stage);
  }

  // Priority filter
  if (priority !== 'ALL') {
    filtered = filtered.filter((l) => l.priority === priority);
  }

  // Sorting
  filtered.sort((a, b) => {
    let aVal = a[sortBy] || '';
    let bVal = b[sortBy] || '';
    if (sortBy === 'createdAt') {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? aTime - bTime : bTime - aTime;
    }
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const total = filtered.length;
  const startIndex = (page - 1) * pageSize;
  const paginatedLeads = filtered.slice(startIndex, startIndex + pageSize);

  // Build Kanban state
  const stageColumns: Record<LeadStage, KanbanColumn> = {
    NEW: { id: 'NEW', title: 'New Leads', colorHex: '#00f0ff', leadIds: [] },
    CONTACTED: { id: 'CONTACTED', title: 'Contacted', colorHex: '#38bdf8', leadIds: [] },
    QUALIFIED: { id: 'QUALIFIED', title: 'Qualified', colorHex: '#10b981', leadIds: [] },
    PROPOSAL_SENT: { id: 'PROPOSAL_SENT', title: 'Proposal Sent', colorHex: '#f59e0b', leadIds: [] },
    WON: { id: 'WON', title: 'Won Deals', colorHex: '#10b981', leadIds: [] },
    LOST: { id: 'LOST', title: 'Lost / Closed', colorHex: '#f43f5e', leadIds: [] },
  };

  const leadsById: Record<string, Lead> = {};

  leadsStore.forEach((lead) => {
    leadsById[lead.id] = lead;
    if (stageColumns[lead.stage]) {
      stageColumns[lead.stage].leadIds.push(lead.id);
    }
  });

  return {
    leads: paginatedLeads,
    total,
    page,
    pageSize,
    kanban: {
      columns: stageColumns,
      leadsById,
    },
  };
}

/**
 * Fetch detailed lead record including internal notes and stage transition audit
 */
export async function getLeadDetailAction(id: string): Promise<{
  lead: Lead;
  notes: LeadNote[];
  history: LeadStatusHistory[];
} | null> {
  const session = assertPermission(await getSession(), 'leads', 'view');

  const lead = leadsStore.find((l) => l.id === id);
  if (!lead) return null;

  const notes = notesStore[id] || [];
  const history = historyStore[id] || [];

  return { lead, notes, history };
}

export interface CreateLeadInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  budgetRange?: string;
  serviceInterest?: string;
  message: string;
  priority?: LeadPriority;
  stage?: LeadStage;
}

/**
 * Manually register a new inbound lead or CRM prospect
 */
export async function createLeadAction(input: CreateLeadInput): Promise<Lead> {
  const session = assertPermission(await getSession(), 'leads', 'create');

  const newLead: Lead = {
    id: `lead_${Date.now().toString(36)}`,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim() || null,
    company: input.company?.trim() || null,
    website: input.website?.trim() || null,
    budgetRange: input.budgetRange || '$10,000 - $25,000',
    serviceInterest: input.serviceInterest || 'AI Automation Workflows',
    message: input.message.trim(),
    stage: input.stage || 'NEW',
    priority: input.priority || 'MEDIUM',
    isSpam: false,
    utmSource: 'manual_entry',
    utmMedium: 'admin_console',
    utmCampaign: null,
    convertedOnPage: '/admin/leads',
    referrerUrl: null,
    assignedToId: session.user.id,
    assignedToName: session.user.name,
    assignedToAvatar: session.user.avatarUrl,
    lastContactedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: [{ id: `tag_${Date.now()}`, name: 'Manual Add', colorHex: '#00f0ff' }],
    notesCount: 0,
    attachmentsCount: 0,
  };

  leadsStore.unshift(newLead);
  notesStore[newLead.id] = [];
  historyStore[newLead.id] = [
    {
      id: `hist_${Date.now()}`,
      leadId: newLead.id,
      fromStage: 'NEW',
      toStage: newLead.stage,
      changedById: session.user.id,
      changedByName: session.user.name,
      notes: 'Lead created via Admin Console',
      createdAt: new Date().toISOString(),
    },
  ];

  return newLead;
}

/**
 * Update a lead stage (Kanban drag-and-drop or status selector) with audit log
 */
export async function updateLeadStageAction(id: string, newStage: LeadStage): Promise<Lead> {
  const session = assertPermission(await getSession(), 'leads', 'edit');

  const leadIndex = leadsStore.findIndex((l) => l.id === id);
  if (leadIndex === -1) throw new Error('Lead not found.');

  const previousStage = leadsStore[leadIndex].stage;
  leadsStore[leadIndex] = {
    ...leadsStore[leadIndex],
    stage: newStage,
    updatedAt: new Date().toISOString(),
    lastContactedAt:
      newStage !== 'NEW' ? new Date().toISOString() : leadsStore[leadIndex].lastContactedAt,
  };

  if (!historyStore[id]) historyStore[id] = [];
  historyStore[id].unshift({
    id: `hist_${Date.now()}`,
    leadId: id,
    fromStage: previousStage,
    toStage: newStage,
    changedById: session.user.id,
    changedByName: session.user.name,
    notes: `Stage changed from ${previousStage} to ${newStage}`,
    createdAt: new Date().toISOString(),
  });

  return leadsStore[leadIndex];
}

/**
 * Append an internal operational note to a lead
 */
export async function addLeadNoteAction(leadId: string, content: string): Promise<LeadNote> {
  const session = assertPermission(await getSession(), 'leads', 'edit');

  if (!content.trim()) throw new Error('Note content cannot be empty.');

  const newNote: LeadNote = {
    id: `note_${Date.now()}`,
    leadId,
    authorId: session.user.id,
    authorName: session.user.name,
    authorAvatar: session.user.avatarUrl,
    content: content.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (!notesStore[leadId]) notesStore[leadId] = [];
  notesStore[leadId].unshift(newNote);

  // Increment lead's notesCount
  const leadIndex = leadsStore.findIndex((l) => l.id === leadId);
  if (leadIndex !== -1) {
    leadsStore[leadIndex] = {
      ...leadsStore[leadIndex],
      notesCount: (leadsStore[leadIndex].notesCount || 0) + 1,
      updatedAt: new Date().toISOString(),
    };
  }

  return newNote;
}

/**
 * Permanently delete a lead record with RBAC assertion
 */
export async function deleteLeadAction(id: string): Promise<{ success: boolean }> {
  const session = assertPermission(await getSession(), 'leads', 'delete');

  leadsStore = leadsStore.filter((l) => l.id !== id);
  delete notesStore[id];
  delete historyStore[id];

  return { success: true };
}

/**
 * Bulk updates for selected leads (e.g. bulk stage change, mark as spam)
 */
export async function bulkUpdateLeadsAction(
  ids: string[],
  updates: { stage?: LeadStage; isSpam?: boolean }
): Promise<{ success: boolean; count: number }> {
  const session = assertPermission(await getSession(), 'leads', 'edit');

  let updatedCount = 0;
  leadsStore = leadsStore.map((lead) => {
    if (ids.includes(lead.id)) {
      updatedCount++;
      return {
        ...lead,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    }
    return lead;
  });

  return { success: true, count: updatedCount };
}

/**
 * Bulk deletion of selected leads
 */
export async function bulkDeleteLeadsAction(
  ids: string[]
): Promise<{ success: boolean; count: number }> {
  const session = assertPermission(await getSession(), 'leads', 'delete');

  const initialCount = leadsStore.length;
  leadsStore = leadsStore.filter((l) => !ids.includes(l.id));
  ids.forEach((id) => {
    delete notesStore[id];
    delete historyStore[id];
  });

  return { success: true, count: initialCount - leadsStore.length };
}
