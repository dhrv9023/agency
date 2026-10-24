# VARAH SYSTEMS — Comprehensive Architectural Blueprint & Directory Map

**Status**: Active System Architecture Guide  
**Version**: 2.0.0 (Post-Hardening Pass)  
**Last Updated**: 2026-10-24  

---

## 1. System Topology: The Dual-Layer Architecture

VARAH SYSTEMS operates on a decoupled **Dual-Layer Architecture** designed to maximize front-of-funnel conversion speed while maintaining an enterprise-grade administration and lead-intake infrastructure:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           VARAH SYSTEMS ECOSYSTEM                           │
├────────────────────────────────────────┬────────────────────────────────────┤
│               LAYER A                  │              LAYER B               │
│     PUBLIC STATIC MARKETING SITE       │   ENTERPRISE ADMIN PLATFORM & API  │
│          (High Velocity / CDN)         │     (Dynamic Server & Database)    │
├────────────────────────────────────────┼────────────────────────────────────┤
│ • Pure HTML5, Vanilla CSS & Vanilla JS │ • Next.js 14 App Router            │
│ • Sub-second FCP (< 400ms) & LCP       │ • Server-Side PBKDF2/HMAC Session  │
│ • Zero hydration delay / zero FOUC     │ • PostgreSQL Database (Prisma ORM) │
│ • Cookie consent gating (Plausible EU) │ • CRM Pipeline (Kanban + Table)    │
│ • Static files in public/              │ • Authenticated API in app/api/    │
└────────────────────────────────────────┴────────────────────────────────────┘
```

---

## 2. Master Directory Organization Map

Below is the definitive reference for every top-level directory and its role within the repository:

```
AGENCY/
├── app/                  # Layer B: Next.js 14 App Router routes, layouts, and API endpoints
├── components/           # Layer B: React UI components for the internal admin platform
├── docs/                 # Documentation, decisions register, brand rules & internal dossier
│   ├── ARCHITECTURE.md   # Master architectural guide & directory map
│   ├── decisions-register.md # Single source of truth for workstream hardening
│   ├── logo-usage.md     # Vector geometry, lockups & contrast standards
│   └── strategy/         # Internal sales intelligence & prospecting lead sheets
├── lib/                  # Shared core utilities, cryptography, validations, and database
├── prisma/               # Database schema definition, migration files, and seed dataset
├── public/               # Layer A: Public static marketing site served directly to visitors
├── scripts/              # Automated build, metadata sync, audit, and Playwright test suites
├── server/               # Next.js Server Actions for authenticated admin mutations
├── templates/            # Canonical Single Sources of Truth (SSOT) JSON schemas & templates
├── types/                # Strict TypeScript type definitions and ambient declarations
├── services/             # Specialized microservices (e.g., Voice AI Telephony Scheduler)
├── fonts-src/            # Upstream font binary sources (Inter, JetBrains Mono)
└── archive/              # Archived legacy materials (historical agency blueprints)
    └── blueprint/        # Historical agency frameworks and training roadmaps
```

---

## 3. Directory Breakdown & Subsystem Roles

### 3.1 [`app/`](file:///home/dhruv/AGENCY/app/) — Next.js 14 App Router
- **[`app/admin/`](file:///home/dhruv/AGENCY/app/admin/)**: The internal operations console.
  - `page.tsx`: Executive dashboard featuring real-time KPI metrics, SVG area charts, and SLA alerts.
  - `leads/`: Inbound CRM pipeline with 6-stage lifecycle, drag-and-drop Kanban, and table sorting.
  - `analytics/`: Telemetry reports, acquisition breakdown, and device distribution.
  - `cms/`: Technical Markdown article studio and high-ROI case study editor.
  - `media/`: Virtual CDN file browser with category taxonomy.
  - `newsletter/`: Audience segmentation and delivery telemetry.
  - `settings/`: Team RBAC role management and audit logs.
  - `login/`: Console authentication view.
- **[`app/api/`](file:///home/dhruv/AGENCY/app/api/)**:
  - `contact/route.ts`: Public inbound lead ingestion endpoint. Handles IP rate limiting, honeypot spam trapping, Cloudflare Turnstile verification, Zod schema parsing, consent-gated attribution, and PostgreSQL persistence with loud production failure modes.
- **[`middleware.ts`](file:///home/dhruv/AGENCY/middleware.ts)**: Edge security middleware enforcing route protection on `/admin/*` and setting strict security headers.

### 3.2 [`public/`](file:///home/dhruv/AGENCY/public/) — Layer A Static Website
The production-facing static pages served to potential clients:
- **Core Marketing**: `index.html` (Homepage), `solutions.html`, `industries.html`, `case-studies.html`, `process.html`, `pricing.html`, `about.html`, `contact.html`, `calculator.html`, `book.html`, `thank-you.html`.
- **Specialized Verticals**: `industries/ecommerce.html`, `industries/real-estate.html`, `solutions/ai-voice.html`, `solutions/document-intelligence.html`, etc.
- **Compliance Pages**: `privacy.html`, `terms.html`, `cookies.html`.
- **System Error Pages**: `404.html`, `500.html`.
- **Client Scripts (`public/js/`)**:
  - `nav.js`: Responsive navigation drawer, focus trap, and mobile sticky CTA controller.
  - `form.js`: Client-side validation, inline errors, and Turnstile callback handlers.
  - `consent.js`: Accessible cookie banner, GPC detection, and preference manager.
  - `track.js`: Zero-PII analytics event tracker (strictly gated behind user consent).
- **Styles (`public/css/`)**: Global reset, design tokens, responsive typography, and component classes.
- **Assets (`public/assets/`)**: SVG brand logos, icons, web fonts (`.woff2`), and web manifest.

### 3.3 [`templates/`](file:///home/dhruv/AGENCY/templates/) — Single Sources of Truth (SSOT)
Machine-readable JSON files that govern code generation and prevent configuration drift:
- [`templates/meta.json`](file:///home/dhruv/AGENCY/templates/meta.json): Canonical URLs, titles, descriptions, and OpenGraph parameters for all 34 public pages.
- [`templates/form-rules.json`](file:///home/dhruv/AGENCY/templates/form-rules.json): Form validation constraints, character lengths, regex patterns, and SLAs.
- [`templates/security-headers.json`](file:///home/dhruv/AGENCY/templates/security-headers.json): Canonical HTTP headers (CSP, HSTS, X-Frame-Options, Cache-Control).
- [`templates/analytics-config.json`](file:///home/dhruv/AGENCY/templates/analytics-config.json): Plausible analytics domain, provider metadata, and retention specs.
- [`templates/asset-manifest.json`](file:///home/dhruv/AGENCY/templates/asset-manifest.json): Asset hashes and font paths.
- [`templates/logo-*.html`](file:///home/dhruv/AGENCY/templates/): Vector geometry definitions for brand lockups.

### 3.4 [`lib/`](file:///home/dhruv/AGENCY/lib/) — Core Runtime Logic
- `auth/session.ts`: Edge-compatible Web Crypto session management (PBKDF2 SHA-256 with 600,000 iterations, constant-time comparison, HMAC signed cookies).
- `security/rate-limit.ts`: IP rate limiting using HMAC-SHA256 hashed IPs with zero-PII retention.
- `security/turnstile.ts`: Cloudflare Turnstile token verification with production test-key prohibition.
- `validations/contact.ts`: Zod schema for inbound lead intake (100% parity with `templates/form-rules.json`).
- `notifications/`: Dry-run email logging and non-silent Slack alert dispatchers.
- `prisma.ts`: Connection-pool-safe Prisma client singleton and database health check.
- `rbac/permissions.ts`: Role-Based Access Control matrix (`OWNER`, `ADMIN`, `EDITOR`, `VIEWER`).

### 3.5 [`server/`](file:///home/dhruv/AGENCY/server/) — Server Actions
- `actions/auth.ts`: Authenticated admin login, credential checking, rate limiting, and logout actions.
- `actions/leads.ts`: Lead status updates, note creation, and stage transitions.
- `actions/cms.ts`: Technical article and case study authoring mutations.
- `actions/analytics.ts`: Telemetry aggregation with strict 10-minute cache TTL and zero synthetic multipliers.
- `actions/settings.ts`: Team member role assignment and audit logging.

### 3.6 [`components/`](file:///home/dhruv/AGENCY/components/) — Admin UI Components
- `admin-shell.tsx`: Full-viewport administrative shell matching agency aesthetics, featuring a fail-closed unauthenticated wall.
- `command-palette.tsx`: Global `⌘K` / `Ctrl+K` operational search palette.
- `theme-provider.tsx`: Zero-FOUC dark/light mode toggle with localStorage persistence.

### 3.7 [`prisma/`](file:///home/dhruv/AGENCY/prisma/) — Data Layer
- `schema.prisma`: Strongly typed PostgreSQL database schema covering 9 distinct operational models (`User`, `Session`, `AuditLog`, `Lead`, `Project`, `Client`, `Service`, `CaseStudy`, `RateLimitRecord`).
- `seed.ts`: Realistic development dataset pre-seeding pipeline leads, CMS items, and RBAC users.

### 3.8 [`docs/`](file:///home/dhruv/AGENCY/docs/) — Documentation & Knowledge
- [`decisions-register.md`](file:///home/dhruv/AGENCY/docs/decisions-register.md): **Master SSOT** compiling Step 0 requirements across all 12 workstreams.
- [`ARCHITECTURE.md`](file:///home/dhruv/AGENCY/docs/ARCHITECTURE.md): Comprehensive system & directory blueprint.
- [`logo-usage.md`](file:///home/dhruv/AGENCY/docs/logo-usage.md): Brand mark guidelines, vector construction math, and contrast minimums.
- **[`strategy/`](file:///home/dhruv/AGENCY/docs/strategy/)**: Internal sales intelligence (`target_prospects_strategy_dossier.md`) and outreach prospecting lead sheets (`target_prospects_lead_sheet.csv`).

### 3.9 [`archive/`](file:///home/dhruv/AGENCY/archive/) — Archived Materials
- **`blueprint/`**: Historical agency training curriculum, roadmap builders, and markdown guides from initial development phases.

### 3.10 [`types/`](file:///home/dhruv/AGENCY/types/) — TypeScript System
- `admin.ts`: Strict types covering admin entities, session payloads, and UI filters (100% strict, zero `any`).
- `prisma.d.ts`: Ambient types providing compile-time type safety for Prisma delegates.

---

## 4. Script Catalog & Automation Suite

The [`scripts/`](file:///home/dhruv/AGENCY/scripts/) directory houses 28 specialized Node.js and TypeScript automation scripts grouped into three primary workflows:

### A. Build & Synchronization Scripts
| Command / Script | Purpose |
| :--- | :--- |
| `npm run build:nav` (`sync-nav.js`) | Injects desktop navigation and mobile drawer into all 34 HTML files from `templates/meta.json`. |
| `npm run build:meta` (`sync-meta.js`) | Synchronizes titles, descriptions, canonicals, and OpenGraph tags into all HTML files. |
| `npm run build:sitemap` (`build-sitemap.js`) | Generates `public/sitemap.xml` with real last-modified dates from Git history. |
| `npm run build:css` | Compiles Tailwind CSS admin styling into `public/admin.css`. |
| `scripts/build-assets.mjs` | Converts font sources to `.woff2` and compiles asset manifests. |
| `scripts/seed-admin.ts` | Creates local/staging admin accounts using real PBKDF2 600,000 iterations from env vars. |

### B. Quality Assurance & Compliance Audits (`check:*`)
| Command / Script | Purpose |
| :--- | :--- |
| `npm run check:overflow` (`check-overflow.js`) | Audits 13 pages across 13 device viewports (169 combinations) for zero horizontal overflow. |
| `npm run check:links` (`check-links.mjs`) | Verifies all internal hyperlinks, asset paths, and `#anchor` targets against disk. |
| `npm run check:seo` (`check-seo.mjs`) | Enforces unique titles, descriptions, character count limits, H1 counts, and sitemap parity. |
| `npm run check:content` (`check-content.mjs`) | Audits brand casing (`VARAH SYSTEMS`), copyright year tags, and bans placeholder text. |
| `npm run check:form-rules` (`check-form-rules.ts`) | Verifies 100% parity between `templates/form-rules.json` and `lib/validations/contact.ts`. |
| `npm run check:env` (`check-env.mjs`) | Audits environment secrets, API keys, and database URLs for dev vs production readiness. |
| `npm run check:legal` (`check-legal.mjs`) | Audits `privacy.html`, `terms.html`, `cookies.html`, and third-party processor disclosures. |
| `npm run check:consent` (`check-consent.ts`) | Playwright test suite for cookie banner gating, GPC, Reject All, and focus traps. |
| `npm run check:analytics` (`check-analytics.ts`) | Audits script gating, zero PII regex stripping, and UTM attribution consent rules. |
| `npm run check:headers` (`check-headers.ts`) | Validates CSP, HSTS, and cache immutability in `next.config.js`. |
| `npm run check:perf` (`check-perf.ts`) | Executes real Lighthouse audits against local Chromium engine for Core Web Vitals. |

### C. Interaction & End-to-End Tests (`test:*`)
| Command / Script | Purpose |
| :--- | :--- |
| `npm run test:nav` (`test-nav-drawer.js`) | Playwright headless test for burger button, drawer opening, focus trap, and Escape key. |
| `npm run test:contact` (`test-contact-api.ts`) | Integration test suite for `/api/contact` (honeypot, rate limit, validation, Turnstile). |
| `scripts/test-sticky-cta.ts` | Playwright test verifying sticky mobile CTA behavior across scroll thresholds. |
| `scripts/test-analytics-e2e.ts` | End-to-end browser test verifying Plausible network event firing post-consent. |

---

## 5. Build & Deployment Lifecycle

When executing `npm run build`:
1. `build:nav`: Navigation drawer markup is synchronized across all static pages.
2. `build:meta`: SEO tags and canonical URLs are updated from `templates/meta.json`.
3. `build:sitemap`: XML sitemap is dynamically generated.
4. `build:css`: Admin utility CSS is compiled.
5. `next build`: Next.js compiles server actions, API routes, and optimizes administrative static/dynamic pages.
