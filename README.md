# VARAH SYSTEMS — Enterprise Admin Platform & Operations Console

> A world-class, high-density SaaS operations dashboard engineered for AI automation agencies. Built to the design standards and engineering rigor of Linear, Vercel, and Stripe.

---

## ⚡ Overview & Architectural Philosophy

VARAH SYSTEMS is an enterprise-grade administration console purpose-built to operate high-velocity AI automation agencies. It unifies lead ingestion, multi-stage CRM pipelines, client project delivery, technical CMS authoring, asset CDN management, traffic telemetry, audience dispatching, and cryptographic audit logging under a single cohesive interface.

### Key Architectural Highlights
- **Design Aesthetic:** Dark technical minimalism inspired by aerospace telemetry interfaces. Obsidian canvases (`#050608`), cybernetic cyan (`#00f0ff`), enterprise emerald (`#10b981`), high-density typography (Inter + JetBrains Mono), and zero-FOUC theme hydration.
- **Strict Type Safety:** 100% strict TypeScript across the entire codebase (`npx tsc --noEmit` exits code 0 with **zero `any`**).
- **Edge-Ready Cryptography:** Session authentication and password verification powered by the standard **Web Crypto API** (`crypto.subtle` PBKDF2 & HMAC-SHA256), fully compatible with Vercel Edge Runtime and Cloudflare Workers without native binary dependencies.
- **Pure SVG Visualization:** Area charts, segmented donut charts, and conversion funnels rendered via pure SVG with responsive viewBox mathematics — zero heavy chart libraries, zero layout shifts.
- **Optimistic Drag-and-Drop:** 6-column CRM Kanban pipeline with instant visual feedback and atomic rollback on mutation failure.
- **Resilient Multi-Environment Storage:** Fully configured for production PostgreSQL via Prisma ORM while providing zero-config in-memory mock stores for instantaneous local preview and demonstration.

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 App Router | React Server Components, Server Actions, streaming layouts, and nested error boundaries. |
| **Language** | TypeScript 5.6 (Strict) | Compile-time guarantees across all 8 modules, entities, and server actions. |
| **Styling** | Vanilla CSS + Tailwind Tokens | 8px atomic grid system, semantic design tokens, and smooth hardware-accelerated transitions. |
| **Database & ORM** | PostgreSQL + Prisma ORM | Relational integrity, full-text search, cascading relations, and automated migrations. |
| **Security & Auth** | Web Crypto PBKDF2 / HMAC | Edge runtime compatible session cookies, constant-time comparisons, and strict RBAC. |
| **Icons & Media** | FontAwesome 6 Pro CDN | Consistent technical iconography across all controls and status indicators. |

---

## 📦 Core Operational Modules

### 1. Dashboard Overview (`/admin`)
- **Dynamic Date Filtering:** Real-time recalibration across `7d`, `30d`, `90d`, `YTD`, and `ALL`.
- **KPI Metrics:** Total Pipeline Value, Inbound Leads, Win Rate, Active Projects, Telemetry Pageviews, and SLA compliance.
- **Telemetry Charts:** Pure SVG Area Chart (daily lead velocity) and Segmented Donut Chart (lead acquisition channels).
- **Conversion Funnel:** Visual progression across all 6 pipeline stages.
- **Needs Attention SLA Queue:** Real-time prioritization of unanswered enterprise leads older than 24 hours.
- **Live Activity Feed:** Chronological operational event stream.

### 2. CRM & Lead Pipeline (`/admin/leads`)
- **Dual Console Modes:** Seamless toggle between multi-column sortable **Table View** and 6-stage **Kanban Board**.
- **Interactive Drag & Drop:** HTML5 native drag-and-drop between stages (`NEW`, `CONTACTED`, `QUALIFIED`, `PROPOSAL_SENT`, `WON`, `LOST`).
- **Lead Slide-Over Dossier:** Deep-dive side panel featuring client metadata, UTM attribution sources, timestamped internal notes, and status transition history.
- **Template Email Composer:** Variable-interpolated email modal (`{{name}}`, `{{company}}`, `{{service}}`).
- **Bulk Operations:** Multi-select batch status updates and RFC 4180 CSV export.

### 3. Content Management System (CMS) (`/admin/cms`)
- **Technical Articles Studio:** Full-screen dual-pane Markdown authoring editor with real-time rendered preview, reading time estimator, syntax tags, and live Google SERP preview.
- **High-ROI Case Studies Editor:** Structured builder for quantified enterprise metrics (e.g. `4.2x speedup`, `$1.4M saved`), tech stack tagging, and testimonial linking.
- **Multi-Tab Registry:** Unified dashboard switching between articles and customer case studies.

### 4. Media CDN Library (`/admin/media`)
- **Taxonomy Organization:** Virtual folders (`brand-assets`, `case-studies`, `technical-diagrams`, `team`).
- **Drag & Drop Upload:** Client-side file staging with size validation and preview generation.
- **Asset Inspection Drawer:** High-resolution preview, aspect ratio telemetry, 1-click CDN link copying, and deletion safety checks.
- **Cross-Module Picker:** Universal media picker modal embedded in all CMS and Case Study editors.

### 5. Traffic Telemetry & Analytics (`/admin/analytics`)
- **Visitor Telemetry:** Pageviews, unique visitor sessions, and conversion event tracking.
- **Device & Referrer Attribution:** Desktop/Mobile/Tablet distribution alongside top inbound referrer channels.
- **Telemetry Export:** CSV download of raw traffic events.

### 6. Newsletter & Audience Engine (`/admin/newsletter`)
- **Subscriber Directory:** Status filtering (`SUBSCRIBED`, `UNSUBSCRIBED`, `BOUNCED`), acquisition source tracking, and segment tags.
- **Broadcast Composer:** Target audience filtering (All, Enterprise AI, Voice AI) and scheduled dispatching.
- **Historical Broadcast Ledger:** Delivery telemetry, open rates, and click metrics.

### 7. Settings, RBAC & Integrations (`/admin/settings`)
- **General & SEO:** Site identity, default OpenGraph images, contact emails, and robots.txt.
- **4-Tier RBAC Management:** Operator invitation, role elevation, and 2FA status monitoring.
- **Webhooks & Relays:** Slack alerts, Calendly synchronization, Stripe billing, and SMTP relays.

### 8. System Audit Log (`/admin/settings/audit-log`)
- **Immutable Ledger:** Complete historical audit trail capturing every system mutation.
- **Side-by-Side Diff Inspector:** Modal visualizer rendering exact before/after JSON state snapshots.
- **Audit Filtering:** Full-text instant search and RFC 4180 CSV export.

---

## 🔒 Role-Based Access Control (RBAC) Matrix

| Permission / Action | OWNER | ADMIN | EDITOR | VIEWER |
| :--- | :---: | :---: | :---: | :---: |
| **View Dashboard & Telemetry** | ✅ | ✅ | ✅ | ✅ |
| **Manage CRM Leads & Pipeline** | ✅ | ✅ | ✅ | ❌ (Read Only) |
| **Author & Publish CMS Articles**| ✅ | ✅ | ✅ | ❌ (Read Only) |
| **Manage Media Library Assets** | ✅ | ✅ | ✅ | ❌ (Read Only) |
| **Dispatch Newsletter Broadcasts**| ✅ | ✅ | ❌ | ❌ |
| **Export Data (CSV)** | ✅ | ✅ | ❌ | ❌ |
| **Manage Integrations & Webhooks**| ✅ | ✅ | ❌ | ❌ |
| **Manage Team Operators & Roles**| ✅ | ❌ | ❌ | ❌ |
| **Inspect Immutable Audit Log** | ✅ | ✅ | ❌ | ❌ |

---

## 🚀 Quickstart & Local Setup

### 1. Prerequisites
- **Node.js:** v18.17.0 or higher
- **npm:** v9.0.0 or higher
- **PostgreSQL Database:** (Optional for local development; in-memory fallback enabled by default)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/varah-systems/agency-platform.git
cd agency-platform
npm install
```

### 3. Configure Environment Variables
Copy the example environment configuration:
```bash
cp .env.example .env.local
```
Fill in the minimal required variables:
```env
# Master Database Connection (PostgreSQL / Supabase)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/varah_agency?schema=public"

# Session Security (Generate with: openssl rand -base64 32)
AUTH_SECRET="your-32-byte-hex-or-base64-secret-key-here"

# Domain Configuration
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_ADMIN_URL="http://localhost:3000/admin"
```

### 4. Database Setup & Seeding
Push the schema to your PostgreSQL instance and seed realistic enterprise operations data:
```bash
# Push Prisma schema to database
npm run prisma:push

# Seed all 8 modules (Operators, Leads, Projects, CMS, Media, Subscribers, Audit Logs)
npm run prisma:seed
```

### 5. Launch the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000/admin` in your browser.

---

## 🧪 Demo Credentials & 1-Click Role Switcher

For rapid local testing and client presentations, the login portal at `/admin/login` provides a **1-Click RBAC Role Switcher**:

| Role | Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- |
| **Owner** | `dhruv@varah.ai` | `admin123` | Complete system ownership, team RBAC, audit ledger |
| **Admin** | `sarah.chen@varah.ai` | `admin123` | Pipeline management, integrations, broadcasts, CSV export |
| **Editor** | `marcus.vance@varah.ai`| `admin123` | CMS authoring, case studies, media uploads |
| **Viewer** | `elena.rostova@varah.ai`| `admin123` | Read-only telemetry, overview inspection |

---

## 📁 Repository Directory Structure

```
.
├── index.html                     # Public Agency Landing Page (Dynamic Theme, Hero, Systems)
├── contact.html                   # High-Conversion Inbound Lead Ingestion Form
├── book.html                      # Interactive Consultation Scheduling & Assessment
├── calculator.html                # Interactive ROI & Automation Savings Calculator
├── about.html                     # Agency Architecture, Mission & Leadership
├── pricing.html                   # Engagement Tiers & Investment Matrix
├── process.html                   # 4-Stage Autonomous Systems Delivery Methodology
├── brand-identity.html            # Visual Brand Architecture & Design Tokens
├── 404.html                       # Resilient Public & Static Fallback Not Found Page
├── solutions/                     # Technical Solution Pillar Subpages
│   ├── ai-agents.html             # Multi-Agent Workflow Orchestration
│   ├── ai-automation.html         # Enterprise Process & Data Automations
│   ├── ai-customer-support.html   # Autonomous Tier-1/2 Support Systems
│   ├── ai-knowledge.html          # Semantic RAG & Enterprise Knowledge Graphs
│   ├── ai-sales.html              # Autonomous Outbound & Inbound SDRs
│   ├── ai-voice.html              # Ultra-Low Latency Conversational Voice Agents
│   ├── custom-ai.html             # Custom Fine-Tuned LLMs & Private SLM Models
│   └── document-intelligence.html # Cognitive OCR & Contract Analysis
├── industries/                    # Industry-Specific Verticals & Case Studies
│   ├── ecommerce.html             # High-Volume Catalog & Retention Intelligence
│   ├── manufacturing.html         # Supply Chain Optimization & Predictive Ops
│   ├── marketing.html             # Programmatic Ad Creative & Attribution
│   ├── professional-services.html # Legal, Accounting & Consulting Acceleration
│   ├── real-estate.html           # Automated Property Valuations & Lead Triage
│   └── recruitment.html           # Candidate Screening & Automated Sourcing
├── case-studies/                  # Quantified Customer Transformation Deep Dives
│   ├── invoice-processing.html    # 98.4% Autonomous AP/AR Invoice Pipeline
│   ├── knowledge-assistant.html   # Internal Engineering RAG Knowledge Assistant
│   └── lead-qualification.html    # 3.8x Outbound Inbound Pipeline Conversion
├── css/                           # Public Site Vanilla Design System (Pure CSS)
│   ├── global.css                 # Theme variables, typography & layout resets
│   ├── navigation.css             # Floating navbar, mega-menus & drawer
│   ├── components.css             # Glass cards, buttons, badges & form controls
│   ├── sections.css               # Hero grids, bento sections & metrics bands
│   └── admin-portal.css           # Public-facing status & preview styling
├── js/                            # Public Site Interactions & Canvas Engines
│   ├── main.js                    # Mobile nav, theme switcher & form submission
│   ├── hero-network.js            # Hardware-accelerated canvas neural visualization
│   ├── orchestration.js           # Interactive system flow simulator
│   └── systems-index.js           # Searchable public index filtering
├── assets/                        # Brand Marks, Vector Logos & Graphics
│   ├── logo.svg                   # Master vector identity mark
│   └── ...                        # Supporting branding & vector icons
├── public/                        # Static Assets Directory (Served by Next.js)
│   ├── admin.css                  # Compiled Tailwind utility bundle for Admin Portal
│   ├── solutions/                 # Static subpages synced for direct routing
│   ├── industries/                # Static vertical subpages
│   ├── case-studies/              # Static case study deep dives
│   └── ...                        # Synchronized public site files & assets
├── app/                           # Next.js 14 App Router
│   ├── layout.tsx                 # Root layout & global font imports
│   ├── page.tsx                   # Root landing redirect (/ -> /index.html)
│   ├── not-found.tsx              # Resilient fallback handler
│   ├── globals.css                # Tailwind base, utilities & color tokens
│   └── admin/                     # Enterprise Admin Operations Platform
│       ├── layout.tsx             # Root admin shell layout & FontAwesome setup
│       ├── loading.tsx            # Zero-layout-shift animated skeleton loader
│       ├── error.tsx              # Resilient error boundary with diagnostic inspector
│       ├── not-found.tsx          # Technical 404 handler with command palette hint
│       ├── page.tsx               # Master operations dashboard & KPI metrics
│       ├── login/page.tsx         # Credentials login with 1-click RBAC switcher
│       ├── leads/page.tsx         # Inbound CRM console (Table & Kanban views)
│       ├── cms/                   # CMS technical studio
│       │   ├── page.tsx           # Articles & case studies directory
│       │   ├── editor/page.tsx    # Split-pane Markdown article authoring
│       │   └── case-studies/editor/page.tsx # Structured ROI case study builder
│       ├── media/page.tsx         # Media CDN manager with folder taxonomy
│       ├── analytics/page.tsx     # Traffic telemetry & conversion streams
│       ├── newsletter/page.tsx    # Subscriber segmentation & broadcast console
│       └── settings/              # Settings, team, webhooks & audit ledger
│           ├── page.tsx           # Site settings, RBAC operator matrix, webhooks
│           └── audit-log/page.tsx # Immutable audit log with state diff inspector
├── components/                    # React UI Components
│   └── admin/                     # Admin Design System & Modules
│       ├── admin-shell.tsx        # Responsive layout wrapper with light/dark support
│       ├── admin-sidebar.tsx      # Collapsible sidebar (68px/260px) + mobile drawer
│       ├── admin-topbar.tsx       # Sticky topbar with breadcrumbs & ⌘K trigger
│       ├── command-palette.tsx    # Global ⌘K search & rapid actions
│       ├── theme-provider.tsx     # Zero-FOUC theme state manager (dark/light/system)
│       ├── dashboard/             # Pure SVG charts, KPI cards & SLA queues
│       ├── leads/                 # Kanban columns, lead drawer, modals & CSV tools
│       ├── cms/                   # Markdown editor, SERP preview & ROI builder
│       ├── media/                 # Asset grid, folder picker & inspector
│       ├── newsletter/            # Broadcast composer modal
│       └── settings/              # Invite modals & side-by-side diff viewers
├── lib/                           # Core Business Utilities & Edge Cryptography
│   ├── auth/session.ts            # Web Crypto PBKDF2 & HMAC session engine
│   ├── rbac/permissions.ts        # 4-tier RBAC matrix & assertPermission guards
│   ├── export/csv.ts              # RFC 4180 CSV serialization utility
│   └── theme/tokens.ts            # 8px spacing, obsidian colors, cyan accents
├── prisma/                        # Database Architecture & Seeders
│   ├── schema.prisma              # Production relational schema (8 modules)
│   ├── schema.sql                 # Pure SQL migration file with indexes
│   └── seed.ts                    # Realistic enterprise database seeder
├── server/                        # Server Actions & API Handlers
│   └── actions/                   # Type-safe Next.js Server Actions
│       ├── auth.ts                # Session verification & login/logout
│       ├── dashboard.ts           # Dynamic date-range KPI & chart telemetry
│       ├── leads.ts               # CRM mutations, notes, Kanban re-ordering
│       ├── cms.ts                 # Post & Case Study mutations
│       ├── media.ts               # File upload simulation & folder management
│       ├── analytics.ts           # Traffic aggregation & event logging
│       ├── newsletter.ts          # Subscriber actions & broadcast dispatch
│       ├── settings.ts            # General settings & operator invitations
│       └── audit.ts               # Immutable audit ledger recording
├── types/                         # Strict TypeScript Definitions
│   ├── admin.ts                   # Strict enterprise interfaces (zero `any`)
│   ├── next.d.ts                  # Ambient Next.js App Router definitions
│   └── prisma.d.ts                # Ambient Prisma Client definitions
├── middleware.ts                  # Edge route protection & security headers
├── next.config.js                 # Next.js optimization configuration
├── tailwind.config.js             # Tailwind CSS tokens & color variables
├── postcss.config.js              # PostCSS plugins configuration
├── tsconfig.json                  # Strict TypeScript compiler options
└── package.json                   # Project scripts, dependencies & sync tooling
```

---

## 🛡️ Production Deployment Checklist

1. **Database Provisioning:**
   - Deploy a managed PostgreSQL instance (e.g. Supabase, AWS RDS, Neon).
   - Configure connection pooling via PgBouncer or Supabase Direct URL (`DIRECT_URL`).
2. **Environment Secrets:**
   - Generate high-entropy secrets for `AUTH_SECRET` (`openssl rand -base64 32`).
   - Secure external API keys for Slack, Calendly, Stripe, and SMTP.
3. **Build Validation:**
   ```bash
   npm run typecheck    # Validate 100% strict TypeScript
   npm run build        # Compile Next.js production bundle
   ```
4. **Security Headers & Edge Protection:**
   - Active `middleware.ts` automatically applies Content Security Policy, X-Frame-Options (`DENY`), X-Content-Type-Options (`nosniff`), and Strict-Transport-Security on all admin routes.

---

## 📜 License & Intellectual Property

Proprietary enterprise software developed for **VARAH SYSTEMS**. All rights reserved.
