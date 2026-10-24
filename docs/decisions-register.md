# VARAH SYSTEMS — Comprehensive Decisions Register
**Status**: Authoritative Reference (Step 0 Single Source of Truth)  
**Compiled**: 2026-10-24  
**Scope**: Workstreams 1 through 12 Hardening Decisions, Constraints & Defect Classifications

---

## Document Precedence & Authority

1. **`docs/decisions-register.md`**: The master compilation of Step 0 decisions across all twelve hardening workstreams. Any code, configuration, or runtime behavior contradicting this register is classified as a defect.
2. **`docs/logo-usage.md`**: Authoritative **solely** for the brand mark, vector construction, contrast minimums, and logo usage guidelines.
3. **`templates/*.json`** (`meta.json`, `form-rules.json`, `security-headers.json`, `analytics-config.json`): Machine-readable canonical single sources of truth for metadata, schema validation rules, HTTP headers, and analytics gating.
4. **`docs/target_prospects_strategy_dossier.md` & `docs/target_prospects_lead_sheet.csv`**: **NON-AUTHORITATIVE** for site decisions. These documents contain sales strategy, company targeting criteria, and outreach templates. They must **never** be placed under `public/`, linked on the site, indexed in `sitemap.xml`, or included in production deployment artifacts.
5. **Other Authoritative Docs in `docs/`**: **None**.

---

## Workstream Step 0 Decisions & Architectural Standards

### Workstream 1: Responsiveness, Breakpoints & Horizontal Overflow Backstop
- **Target Matrix**: 11 portrait viewports (320px minimum up to 1440px) and 2 landscape viewports.
- **Rule**: Zero horizontal scroll (`scrollWidth === clientWidth`) across all public pages at every viewport width.
- **Fail-Safe Mechanism**: Global CSS backstop (`html, body { overflow-x: hidden; width: 100%; max-width: 100vw; }`) is verified via dual-pass audit (`check:overflow` pass 1 with backstop, pass 2 unconstrained).
- **Tooling**: Playwright Chromium test automation (`scripts/check-overflow.js`).

### Workstream 2: Navigation Drawer, Sticky Mobile CTA & Accessibility
- **Target Breakpoint**: Mobile navigation drawer active below `1024px` desktop breakpoint.
- **Interactions**:
  - ARIA state reflection (`aria-expanded`, `aria-hidden`) synchronized with hamburger toggle.
  - Active focus trap when drawer is open (`Tab` / `Shift+Tab` cycling confined inside nav menu).
  - Dismissal triggers: `Escape` key press, backdrop click, link navigation, window resize to `≥ 1024px`.
  - Body scroll lock (`overflow: hidden`) while drawer is expanded.
- **Sticky Mobile CTA**: Appears strictly on mobile viewports (`< 768px`) after scrolling past hero CTA; suppresses when footer contact form or bottom CTA is in viewport.

### Workstream 3: Link Integrity, Internal Asset Anchors & Protocol Safety
- **Single Source of Truth**: Physical filesystem resolution in `public/` directory.
- **Standards**:
  - Zero internal broken links (404s).
  - Zero missing `#anchor` targets across both internal and cross-page links.
  - Zero placeholder anchors (`href="#"` or `javascript:void(0)` prohibited).
  - All external hyperlinks (`target="_blank"`) enforce `rel="noopener noreferrer"`.
  - Case-sensitivity strictly audited against Linux filesystem naming.

### Workstream 4: SEO Metadata, OpenGraph & XML Sitemap Architecture
- **Single Source of Truth**: `templates/meta.json` (propagated via `scripts/sync-meta.js`).
- **Standards**:
  - Every indexable page has exactly one `<h1>`, `<title>` (50–60 characters), and `<meta name="description">` (140–160 characters).
  - Canonical URLs must be fully qualified absolute URLs.
  - OpenGraph (`og:image`, `og:title`, `og:description`) and Twitter Card metadata generated for all routes.
  - `sitemap.xml` strictly lists canonical, indexable public pages; dev fixtures and `noindex` pages excluded.
  - `robots.txt` references absolute sitemap URL and prohibits crawling of `/admin` or `/api/`.

### Workstream 5: Brand Identity & Vector Logo System
- **Single Source of Truth**: `docs/logo-usage.md` and `templates/logo-*.html`.
- **Standards**:
  - Core mark: Binary Convergent "V" (Dual Routing Nexus) with inbound `#94a3b8`, outbound `#ffffff`, and `#00f0ff` central nexus core.
  - Format: Strictly scalable vector SVG without raster elements, blur filters, or external font dependencies.
  - Minimum digital resolution: 160×32px for horizontal lockup, 16×16px for favicon mark.

### Workstream 6: Brand Copy, Casing & Anti-Placeholder Compliance
- **Standards**:
  - Exact brand casing: `VARAH SYSTEMS` (short form: `VARAH`).
  - Strict prohibition of lorem ipsum, draft markers (`TODO`, `FIXME`, `[[INPUT-NEEDED]]`), and dead marketing buzzwords.
  - Legal copyright format: Dynamic hybrid span (`© <span id="copyright-year">2026</span> VARAH SYSTEMS`).
  - Pre-launch domain agnosticism: Site URL and contact emails remain `.invalid` placeholders (`https://domain-pending.invalid`, `contact@domain-pending.invalid`) until domain attachment.

### Workstream 7: Form Validation Rules & Zod Parity
- **Single Source of Truth**: `templates/form-rules.json`.
- **Standards**:
  - Layer A (HTML5 attributes in `public/contact.html`) and Layer B (Zod schema in `lib/validations/contact.ts`) must have 100% field, length, regex, and constraint parity.
  - Honeypot: Silent anti-bot honeypot field (`website_hp`) returns synthetic HTTP 200 to confound scrapers without executing downstream mutations.
  - Rate limiting: Client IP rate limited to 5 submissions per 15-minute rolling window.

### Workstream 8: Environment & Security Secret Hygiene
- **Standards**:
  - Zero committed credentials, private API keys, or production connection strings.
  - Rate limiting salt: `IP_HASH_SECRET` required for GDPR-compliant one-way IP hashing.
  - Session signing: `AUTH_SECRET` required (minimum 32 characters).
  - Pre-launch state: Production checks fail cleanly if production keys or production databases are missing, preventing accidental live launch in insecure state.

### Workstream 9: Legal Compliance & Transparency Pages
- **Standards**:
  - Dedicated public legal pages: `privacy.html`, `terms.html`, `cookies.html`.
  - Disclosures: Explicit identification of third-party processors (Cloudflare Turnstile for anti-spam; Plausible Analytics for telemetry; PostgreSQL/Prisma for data processing).
  - All pages must link to Privacy Policy, Terms of Service, and a functional Cookie Preferences manager.

### Workstream 10: Cookie Consent & Script Gating
- **Standards**:
  - Zero non-essential cookies or storage writes prior to affirmative user consent.
  - Script gating: Telemetry scripts (`public/js/track.js`, `https://plausible.io/js/script.js`) must be marked `<script type="text/plain" data-consent="analytics">` and only execute upon consent grant.
  - Global Privacy Control (GPC): Honored automatically when `navigator.globalPrivacyControl === true`.
  - Modal accessibility: `<dialog>` focus trap, `Escape` key dismissal with focus return to trigger element.
  - Re-prompting: Triggered on version bump or 180-day expiration.

### Workstream 11: Privacy-Preserving Analytics & Attribution Pipeline
- **Single Source of Truth**: `templates/analytics-config.json`.
- **Standards**:
  - Analytics provider: Plausible Analytics (EU-hosted, cookieless, GDPR-compliant).
  - Attribution: First-touch UTM parameters captured in `sessionStorage['varah_attribution']` only if analytics consent is granted.
  - Zero PII: URLs, search queries, and custom event payloads must strip personal identifiers before transmission.
  - Lead attribution: UTM parameters and landing path passed to `/api/contact` only when user has affirmative analytics consent; otherwise strictly nulled.

### Workstream 12: Security Headers, Caching Architecture & Performance (CWV)
- **Single Source of Truth**: `templates/security-headers.json` (owned exclusively by `next.config.js`).
- **Standards**:
  - Headers: Strict-Transport-Security (`max-age=63072000; includeSubDomains; preload`), X-Content-Type-Options (`nosniff`), X-Frame-Options (`DENY`), Referrer-Policy (`strict-origin-when-cross-origin`), Permissions-Policy (`camera=(), microphone=(), geolocation=()`).
  - CSP: Restrictive policy permitting only required origins (`self`, `https://plausible.io`, `https://challenges.cloudflare.com`, `https://cdnjs.cloudflare.com`).
  - Caching: Static hashed assets (`/_next/static/*`, `/dist/*`) cached with `public, max-age=31536000, immutable`. Admin routes (`/admin/*`, `/api/admin/*`) enforce `no-store, no-cache` with `noindex, nofollow`.
  - Core Web Vitals: Real Lighthouse audits on desktop and mobile viewports.

---

## Known Repo Contradictions & Defects (To Be Remedied)

1. **Defect #1 — Database Failure Handling in Production (`/api/contact/route.ts`)**:
   - **Current Repo State**: When `DATABASE_URL` is unconfigured or unreachable, `isDatabaseConfigured()` fails or `prisma.lead.create` throws, the error is caught with `console.warn('[LEAD_DB_OFFLINE]')`, and the endpoint proceeds to send notifications and return HTTP 200 (`success: true`).
   - **Contradiction**: In production (`NODE_ENV=production`), missing or unreachable database storage **must fail loudly** with an HTTP non-2xx status code and a visible form error message, never faking a successful lead intake.
2. **Defect #2 — Admin Shell SSR Fallback (`app/admin/layout.tsx`)**:
   - **Current Repo State**: `const user = session?.user ?? DEFAULT_SUPER_ADMIN;` falls back to `DEFAULT_SUPER_ADMIN` on server rendering if session is absent.
   - **Contradiction**: In production, unauthenticated admin access must fail closed (redirect to `/admin/login`), never defaulting to super-admin privileges.
3. **Defect #3 — Password Verification Timing Safety (`lib/auth/session.ts`)**:
   - **Current Repo State**: `verifyPassword` compares hex hashes via standard `actualHash === expectedHash`.
   - **Contradiction**: Security best practices mandate constant-time byte comparison (`crypto.timingSafeEqual`) to prevent timing side-channel analysis.
4. **Defect #4 — PBKDF2 Iteration Count (`lib/auth/session.ts`)**:
   - **Current Repo State**: Configured with 100,000 iterations.
   - **Contradiction**: OWASP 2023/2024 guidance specifies 600,000 iterations for PBKDF2-HMAC-SHA256.
5. **Defect #5 — Public Exposure of Strategic Dossier & Prospect Lead Sheet**:
   - **Current Repo State**: `docs/target_prospects_strategy_dossier.md` and `docs/target_prospects_lead_sheet.csv` are tracked in Git on `main` within a public GitHub repository (`dhrv9023/agency`).
   - **Contradiction**: While not exposed on the live website or in `public/`, internal target prospect strategies and cold outreach copy are publicly visible on GitHub.
