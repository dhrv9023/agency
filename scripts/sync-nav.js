#!/usr/bin/env node

/**
 * ============================================================================
 * VARAH SYSTEMS — Navigation & Header/Footer Synchronization Engine
 * ============================================================================
 * Single source of truth for site-wide navigation (Layer A marketing site).
 *
 * Capabilities:
 *   - Injects canonical header, mobile drawer, and footer inside marker comments.
 *   - Resolves relative paths based on directory depth (root vs subfolders).
 *   - Automatically marks active link with `aria-current="page"` and `active` class.
 *   - Supports --check mode (exits 1 on drift or missing markers).
 *   - Supports --dry-run mode (outputs unified diff without writing to disk).
 *   - 100% idempotent: subsequent runs produce zero diff.
 *   - Pure Node.js built-ins only (fs, path).
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const META_FILE = path.join(ROOT_DIR, 'templates', 'meta.json');
const metaConfig = JSON.parse(fs.readFileSync(META_FILE, 'utf8'));
const CONTACT_EMAIL = metaConfig.contactEmail || 'contact@domain-pending.invalid';
const PRIVACY_EMAIL = metaConfig.privacyEmail || 'privacy@domain-pending.invalid';
const analyticsConfig = metaConfig.analytics || {};
const ANALYTICS_DOMAIN = analyticsConfig.domain || 'domain-pending.invalid';
const ANALYTICS_API_HOST = analyticsConfig.apiHost || 'https://plausible.io';

// 5 Approved Top-Level Nav Items
const NAV_ITEMS = [
  { key: 'solutions', label: 'Solutions', href: 'solutions.html' },
  { key: 'industries', label: 'Industries', href: 'industries.html' },
  { key: 'case-studies', label: 'Case Studies', href: 'case-studies.html' },
  { key: 'pricing', label: 'Pricing', href: 'pricing.html' },
  { key: 'about', label: 'About', href: 'about.html' },
];

// Contextual Mobile Drawer Items
const DRAWER_ITEMS = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'solutions', label: 'Solutions', href: 'solutions.html' },
  { key: 'industries', label: 'Industries', href: 'industries.html' },
  { key: 'case-studies', label: 'Case Studies', href: 'case-studies.html' },
  { key: 'pricing', label: 'Pricing', href: 'pricing.html' },
  { key: 'about', label: 'About', href: 'about.html' },
];

const MARKERS = {
  headerStart: '<!-- HEADER_START -->',
  headerEnd: '<!-- HEADER_END -->',
  footerStart: '<!-- FOOTER_START -->',
  footerEnd: '<!-- FOOTER_END -->',
};

// Compute relative path prefix to site root ('./' or '../')
function getRelativePrefix(filePath) {
  const relPath = path.relative(PUBLIC_DIR, filePath);
  const depth = relPath.split(path.sep).length - 1;
  return depth === 0 ? '' : '../'.repeat(depth);
}

// Identify active navigation key from file path
function getActiveNavKey(filePath) {
  const relPath = path.relative(PUBLIC_DIR, filePath);
  if (relPath === 'index.html') return 'home';
  if (relPath.startsWith('solutions')) return 'solutions';
  if (relPath.startsWith('industries')) return 'industries';
  if (relPath.startsWith('case-studies')) return 'case-studies';
  if (relPath.startsWith('pricing')) return 'pricing';
  if (relPath.startsWith('about')) return 'about';
  if (relPath.startsWith('process')) return 'process';
  if (relPath.startsWith('contact')) return 'contact';
  if (relPath.startsWith('book')) return 'book';
  if (relPath.startsWith('calculator')) return 'calculator';
  return '';
}

// Generate canonical Header and Mobile Drawer markup
function generateHeaderMarkup(filePath) {
  const prefix = getRelativePrefix(filePath);
  const activeKey = getActiveNavKey(filePath);
  const isHomePage = activeKey === 'home';

  const logoHref = isHomePage ? '#top' : '/';
  const logoAriaCurrent = isHomePage ? ' aria-current="page"' : '';

  const navLinksHtml = NAV_ITEMS.map((item) => {
    const isActive = activeKey === item.key;
    const activeClass = isActive ? ' class="nav-link active"' : ' class="nav-link"';
    const ariaCurrent = isActive ? ' aria-current="page"' : '';
    return `          <li class="nav-item"><a href="${prefix}${item.href}"${activeClass}${ariaCurrent}>${item.label}</a></li>`;
  }).join('\n');

  const drawerLinksHtml = DRAWER_ITEMS.map((item) => {
    const isActive = activeKey === item.key;
    const activeClass = isActive ? ' class="mobile-nav-link active"' : ' class="mobile-nav-link"';
    const ariaCurrent = isActive ? ' aria-current="page"' : '';
    const linkHref = item.href === '/' ? '/' : `${prefix}${item.href}`;
    return `      <li><a href="${linkHref}"${activeClass}${ariaCurrent}>${item.label}</a></li>`;
  }).join('\n');

  return `${MARKERS.headerStart}
  <!-- Flat Minimalist Header (Hairline Border • Token Architecture) -->
  <header class="site-header" role="banner">
    <div class="nav-wrapper container">
      <!-- 1. Semantic Logo -->
      <a href="${logoHref}" class="site-logo-link" aria-label="VARAH SYSTEMS - home"${logoAriaCurrent}>
        <svg class="site-logo-mark" viewBox="0 0 48 48" width="32" height="32" aria-hidden="true" fill="none">
          <polygon points="2,4 16,4 27,39 16,39" fill="var(--slate-400, #94a3b8)" />
          <polygon points="46,4 32,4 21,39 32,39" fill="var(--text, #ffffff)" />
          <polygon points="19.5,38 24,45 28.5,38 24,31" fill="var(--cyan, #00f0ff)" />
          <rect x="22.5" y="8" width="3" height="20" rx="1.5" fill="var(--cyan, #00f0ff)" />
        </svg>
        <span class="site-logo-text">VARAH</span>
      </a>

      <!-- 2. Flat Desktop Navigation -->
      <nav class="main-nav" aria-label="Main Navigation">
        <ul class="nav-list">
${navLinksHtml}
        </ul>
      </nav>

      <!-- 3. Header Actions & Theme Toggle -->
      <div class="header-actions">
        <a href="${prefix}contact.html" class="btn btn-primary btn-sm">Start a Project</a>
        <button id="theme-toggle-btn" class="theme-toggle-btn" type="button" aria-label="Toggle Theme Mode" title="Toggle Theme Mode">
          <i class="fa-solid fa-moon theme-icon-dark" aria-hidden="true"></i>
          <i class="fa-solid fa-sun theme-icon-light" aria-hidden="true"></i>
        </button>
        <!-- Accessible Mobile Menu Toggle Button -->
        <button class="mobile-burger-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-drawer">
          <span class="burger-bar" aria-hidden="true"></span>
          <span class="burger-bar" aria-hidden="true"></span>
          <span class="burger-bar" aria-hidden="true"></span>
        </button>
      </div>
    </div>
  </header>

  <!-- Accessible Mobile Navigation Drawer (Focus Trapped • Inert Guarded) -->
  <div class="mobile-menu-backdrop" aria-hidden="true"></div>
  <div id="mobile-drawer" class="mobile-menu-sheet" role="dialog" aria-modal="true" aria-label="Site Navigation">
    <div class="mobile-sheet-header">
      <span class="mobile-sheet-title">Navigation</span>
      <button class="mobile-sheet-close-btn" type="button" aria-label="Close menu">&times;</button>
    </div>
    <ul class="mobile-nav-list">
${drawerLinksHtml}
    </ul>
    <div class="mobile-theme-switch-row">
      <span class="mobile-theme-label">Theme Mode:</span>
      <button id="mobile-theme-toggle-btn" class="mobile-theme-switch-btn" type="button">
        <span id="mobile-theme-state">Dark</span> Mode
        <i class="fa-solid fa-circle-half-stroke" aria-hidden="true"></i>
      </button>
    </div>
    <div class="mobile-contact-summary">
      <span class="mobile-contact-label">Direct Inquiry:</span>
      <a href="mailto:${CONTACT_EMAIL}" class="mobile-contact-email">${CONTACT_EMAIL}</a>
    </div>
    <a href="${prefix}contact.html" class="mobile-cta-btn">Start a Project</a>
  </div>
  <!-- No-JS Fallback Anchor -->
  <noscript>
    <a href="#site-footer" class="no-js-nav-fallback">Jump to Site Navigation &darr;</a>
  </noscript>
  ${MARKERS.headerEnd}`;
}

// Generate canonical Footer markup
function generateFooterMarkup(filePath) {
  const prefix = getRelativePrefix(filePath);

  return `${MARKERS.footerStart}
  <!-- Substantial Editorial Site Footer (Single Source of Truth) -->
  <footer id="site-footer" class="site-footer" role="contentinfo">
    <div class="container">
      <div class="footer-statement-massive">BUILD SYSTEMS THAT WORK WHILE YOU WORK.</div>
      <div class="footer-nav-grid">
        <div class="footer-brand-col">
          <div class="footer-logo-row">
            <svg class="footer-logo-mark" viewBox="0 0 48 48" width="28" height="28" aria-hidden="true" fill="none">
              <polygon points="2,4 16,4 27,39 16,39" fill="#94a3b8" />
              <polygon points="46,4 32,4 21,39 32,39" fill="#ffffff" />
              <polygon points="19.5,38 24,45 28.5,38 24,31" fill="#00f0ff" />
              <rect x="22.5" y="8" width="3" height="20" rx="1.5" fill="#00f0ff" />
            </svg>
            <span class="footer-brand-name">VARAH // SYSTEMS</span>
          </div>
          <p class="footer-desc-text">
            Intelligent systems that scale your business.<br>
            We eliminate repetitive operational bottlenecks and build systems that work while you work.
          </p>
        </div>

        <div>
          <h4 class="footer-col-heading">Solutions</h4>
          <ul class="footer-link-list">
            <li class="footer-link-item"><a href="${prefix}solutions/ai-automation.html">Workflow Automation</a></li>
            <li class="footer-link-item"><a href="${prefix}solutions/ai-agents.html">Autonomous AI Agents</a></li>
            <li class="footer-link-item"><a href="${prefix}solutions/ai-voice.html">Voice AI Telephony</a></li>
            <li class="footer-link-item"><a href="${prefix}solutions/ai-customer-support.html">Customer Support</a></li>
            <li class="footer-link-item"><a href="${prefix}solutions/ai-knowledge.html">Knowledge Systems (RAG)</a></li>
            <li class="footer-link-item"><a href="${prefix}solutions/document-intelligence.html">Document Intelligence</a></li>
            <li class="footer-link-item"><a href="${prefix}solutions.html">All Solutions &rarr;</a></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-col-heading">Industries</h4>
          <ul class="footer-link-list">
            <li class="footer-link-item"><a href="${prefix}industries/real-estate.html">Real Estate</a></li>
            <li class="footer-link-item"><a href="${prefix}industries/ecommerce.html">E-Commerce</a></li>
            <li class="footer-link-item"><a href="${prefix}industries/recruitment.html">Recruitment</a></li>
            <li class="footer-link-item"><a href="${prefix}industries/marketing.html">Marketing Agencies</a></li>
            <li class="footer-link-item"><a href="${prefix}industries/professional-services.html">Professional Services</a></li>
            <li class="footer-link-item"><a href="${prefix}industries/manufacturing.html">Manufacturing &amp; Logistics</a></li>
            <li class="footer-link-item"><a href="${prefix}industries.html">All Industries &rarr;</a></li>
          </ul>
        </div>

        <div>
          <h4 class="footer-col-heading">Company</h4>
          <ul class="footer-link-list">
            <li class="footer-link-item"><a href="${prefix}case-studies.html">Case Studies</a></li>
            <li class="footer-link-item"><a href="${prefix}process.html">Our Process</a></li>
            <li class="footer-link-item"><a href="${prefix}pricing.html">Pricing &amp; Scope</a></li>
            <li class="footer-link-item"><a href="${prefix}calculator.html">ROI Calculator</a></li>
            <li class="footer-link-item"><a href="${prefix}about.html">About Us</a></li>
            <li class="footer-link-item"><a href="${prefix}contact.html">Contact Us</a></li>
            <li class="footer-link-item"><a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom-bar">
        <div class="footer-copyright">
          &copy; <span id="copyright-year">${new Date().getFullYear()}</span> VARAH SYSTEMS. All rights reserved.
        </div>
        <!-- Workstream 10: Legal Pages Slot -->
        <div class="footer-bottom-links">
          <a href="${prefix}privacy.html">Privacy</a>
          <a href="${prefix}terms.html">Terms</a>
          <a href="${prefix}cookies.html">Cookies</a>
          <button type="button" id="open-cookie-preferences-btn" class="footer-cookie-settings-btn">Cookie Settings</button>
          <a href="${prefix}calculator.html">Calculator</a>
          <a href="${prefix}pricing.html">Pricing</a>
          <a href="${prefix}contact.html">Contact</a>
          <!-- Relocated Layer B Operations Portal Link -->
          <a href="/admin" rel="nofollow" class="footer-admin-link">Operations Portal</a>
        </div>
      </div>
    </div>
  </footer>

  <!-- Sticky Mobile Action Bar (Workstream 12) -->
  <aside id="sticky-mobile-cta" class="sticky-mobile-cta" aria-label="Quick Action Bar">
    <div class="sticky-mobile-cta-inner">
      <a href="${prefix}contact.html" class="btn btn-primary sticky-mobile-cta-btn" data-track-cta="Start a Project" data-track-location="sticky-cta">Start a Project</a>
      <button type="button" id="sticky-cta-dismiss-btn" class="sticky-mobile-cta-dismiss" aria-label="Dismiss quick action bar" title="Dismiss quick action bar">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  </aside>

  <!-- Cookie & Privacy Consent Banner (Workstream 10) -->
  <div id="consent-banner" class="consent-banner" role="region" aria-label="Privacy and Cookie Consent" hidden>
    <div class="consent-banner-inner">
      <p class="consent-banner-text">
        <strong>Privacy &amp; Cookies:</strong> We use functional storage to preserve your theme and submission preferences. Optional analytics remain blocked until granted. Read our <a href="${prefix}privacy.html" class="consent-banner-link">Privacy Policy</a> and <a href="${prefix}cookies.html" class="consent-banner-link">Cookie Policy</a>.
      </p>
      <div class="consent-banner-actions">
        <button type="button" id="consent-reject-all-btn" class="consent-btn-action">Reject All</button>
        <button type="button" id="consent-accept-all-btn" class="consent-btn-action">Accept All</button>
        <button type="button" id="consent-manage-btn" class="consent-btn-text">Preferences</button>
      </div>
    </div>
  </div>

  <!-- Accessible Preferences Modal Dialog (<dialog>) -->
  <dialog id="consent-preferences-dialog" class="consent-dialog" aria-labelledby="consent-dialog-title" aria-describedby="consent-dialog-desc">
    <div class="consent-dialog-card">
      <div class="consent-dialog-header">
        <h3 id="consent-dialog-title" class="consent-dialog-title">Consent Preferences</h3>
        <button type="button" id="consent-dialog-close-btn" class="consent-dialog-close" aria-label="Close preferences modal">&times;</button>
      </div>
      <div class="consent-dialog-body">
        <p id="consent-dialog-desc" class="consent-dialog-intro">
          Customize which categories of client-side storage and scripts you permit. Strictly necessary storage cannot be deactivated as it is required for site operation.
        </p>

        <!-- Global Privacy Control (GPC) Notice -->
        <div id="consent-gpc-notice" class="consent-gpc-badge" hidden>
          <i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
          <span>Global Privacy Control (GPC) signal detected: Non-essential tracking disabled.</span>
        </div>

        <div class="consent-category-list">
          <!-- Necessary Category -->
          <div class="consent-category-item">
            <div class="consent-category-top">
              <span class="consent-category-label">
                Strictly Necessary
                <span class="consent-badge-locked">Always Active</span>
              </span>
              <label class="consent-switch-label" aria-label="Strictly Necessary storage (locked)">
                <input type="checkbox" class="consent-switch-input" checked disabled>
                <span class="consent-switch-track"><span class="consent-switch-thumb"></span></span>
              </label>
            </div>
            <p class="consent-category-desc">
              Essential for core functions including security verification (Cloudflare Turnstile), UI theme persistence, and inquiry session gating.
            </p>
          </div>

          <!-- Analytics Category -->
          <div class="consent-category-item">
            <div class="consent-category-top">
              <span class="consent-category-label">Performance &amp; Analytics</span>
              <label class="consent-switch-label" for="consent-toggle-analytics" aria-label="Toggle Performance and Analytics">
                <input type="checkbox" id="consent-toggle-analytics" class="consent-switch-input">
                <span class="consent-switch-track"><span class="consent-switch-thumb"></span></span>
              </label>
            </div>
            <p class="consent-category-desc">
              Helps us understand aggregated visitor interaction to improve site navigation and technical performance. No personal tracking is installed today.
            </p>
          </div>

          <!-- Marketing Category -->
          <div class="consent-category-item">
            <div class="consent-category-top">
              <span class="consent-category-label">Marketing &amp; Targeting</span>
              <label class="consent-switch-label" for="consent-toggle-marketing" aria-label="Toggle Marketing and Targeting">
                <input type="checkbox" id="consent-toggle-marketing" class="consent-switch-input">
                <span class="consent-switch-track"><span class="consent-switch-thumb"></span></span>
              </label>
            </div>
            <p class="consent-category-desc">
              Third-party advertising pixels and campaign conversion attribution. We do not currently run or permit marketing trackers.
            </p>
          </div>
        </div>
      </div>
      <div class="consent-dialog-footer">
        <button type="button" id="consent-modal-reject-all-btn" class="consent-btn-action">Reject All</button>
        <button type="button" id="consent-modal-accept-all-btn" class="consent-btn-action">Accept All</button>
        <button type="button" id="consent-save-preferences-btn" class="consent-btn-action" style="background-color: var(--text); color: var(--surface);">Save Choices</button>
      </div>
    </div>
  </dialog>

  <!-- Consent Engine Script -->
  <script src="${prefix}js/consent.js"></script>
  <!-- Workstream 11: Privacy-Compliant Analytics (Consent Gated) -->
  <script type="text/plain" data-consent="analytics" data-analytics-provider="plausible" data-domain="${ANALYTICS_DOMAIN}" data-api-host="${ANALYTICS_API_HOST}" data-src="${prefix}js/analytics.js"></script>
  <script src="${prefix}js/track.js"></script>
  ${MARKERS.footerEnd}`;
}

// Find all HTML files in public
function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'demos' && file !== 'dev') results = results.concat(getHtmlFiles(fullPath));
    } else if (file.endsWith('.html') && !['admin.html', 'brand-identity.html'].includes(file)) {
      results.push(fullPath);
    }
  }
  return results;
}

// Simple line-based diff generator for dry-run
function computeSimpleDiff(oldStr, newStr) {
  const oldLines = oldStr.split('\n');
  const newLines = newStr.split('\n');
  const diff = [];
  let i = 0, j = 0;
  while (i < oldLines.length || j < newLines.length) {
    if (i < oldLines.length && j < newLines.length && oldLines[i] === newLines[j]) {
      i++; j++;
    } else {
      if (i < oldLines.length) {
        diff.push(`- ${oldLines[i]}`);
        i++;
      }
      if (j < newLines.length) {
        diff.push(`+ ${newLines[j]}`);
        j++;
      }
    }
  }
  return diff;
}

// Main processing logic
function processFiles(options = {}) {
  const files = getHtmlFiles(PUBLIC_DIR);
  let driftCount = 0;
  let missingMarkersCount = 0;
  const changes = [];

  for (const file of files) {
    const originalContent = fs.readFileSync(file, 'utf8');
    let content = originalContent;
    const relName = path.relative(ROOT_DIR, file);

    const newHeader = generateHeaderMarkup(file);
    const newFooter = generateFooterMarkup(file);

    let hasHeaderMarkers = content.includes(MARKERS.headerStart) && content.includes(MARKERS.headerEnd);
    let hasFooterMarkers = content.includes(MARKERS.footerStart) && content.includes(MARKERS.footerEnd);

    if (options.check && (!hasHeaderMarkers || !hasFooterMarkers)) {
      console.error(`[FAIL] ${relName}: Missing marker comments (header: ${hasHeaderMarkers}, footer: ${hasFooterMarkers})`);
      missingMarkersCount++;
      continue;
    }

    // Replace Header
    if (hasHeaderMarkers) {
      const headerRegex = new RegExp(`${MARKERS.headerStart}[\\s\\S]*?${MARKERS.headerEnd}`);
      content = content.replace(headerRegex, newHeader);
    } else {
      // First-time adoption: wrap existing header/drawer
      const existingHeaderRegex = /<!-- Site Header[\s\S]*?<\/header>(\s*<!-- Mobile[\s\S]*?<\/div>(\s*<div class="mobile-menu-sheet"[\s\S]*?<\/div>)?)/;
      const simpleHeaderRegex = /<header class="site-header"[\s\S]*?<\/header>(\s*<div class="mobile-menu-backdrop"[\s\S]*?<\/div>\s*<div class="mobile-menu-sheet"[\s\S]*?<\/div>)?/;
      if (existingHeaderRegex.test(content)) {
        content = content.replace(existingHeaderRegex, newHeader);
      } else if (simpleHeaderRegex.test(content)) {
        content = content.replace(simpleHeaderRegex, newHeader);
      } else {
        console.warn(`[WARN] Could not identify header pattern in ${relName}`);
      }
    }

    // Replace Footer
    if (hasFooterMarkers) {
      const footerRegex = new RegExp(`${MARKERS.footerStart}[\\s\\S]*?${MARKERS.footerEnd}`);
      content = content.replace(footerRegex, newFooter);
    } else {
      // First-time adoption: wrap existing footer
      const existingFooterRegex = /<footer class="site-footer"[\s\S]*?<\/footer>/;
      if (existingFooterRegex.test(content)) {
        content = content.replace(existingFooterRegex, newFooter);
      } else {
        console.warn(`[WARN] Could not identify footer pattern in ${relName}`);
      }
    }

    // Ensure js/nav.js script tag is loaded before js/main.js
    const prefix = getRelativePrefix(file);
    const navScriptTag = `<script src="${prefix}js/nav.js"></script>`;
    if (!content.includes('js/nav.js')) {
      const escapedPrefix = prefix.replace(/\./g, '\\.');
      const mainScriptRegex = new RegExp(`(<script src="${escapedPrefix}js/main\\.js"><\\/script>)`);
      if (mainScriptRegex.test(content)) {
        content = content.replace(mainScriptRegex, `${navScriptTag}\n  $1`);
      }
    }

    function normalizeYearExempt(str) {
      return str.replace(/<span id="copyright-year">\d{4}<\/span>/g, '<span id="copyright-year">EXEMPT_YEAR</span>');
    }

    const hasDrift = options.check
      ? normalizeYearExempt(content) !== normalizeYearExempt(originalContent)
      : content !== originalContent;

    if (hasDrift) {
      driftCount++;
      const diffLines = computeSimpleDiff(originalContent, content);
      changes.push({ file: relName, diffLines, content });
    }
  }

  return { driftCount, missingMarkersCount, changes, totalFiles: files.length };
}

// CLI Execution
const args = process.argv.slice(2);
const isCheckMode = args.includes('--check');
const isDryRun = args.includes('--dry-run');

console.log(`\n=================================================================`);
console.log(`VARAH SYSTEMS — Navigation Sync Engine (Option A)`);
console.log(`Mode: ${isCheckMode ? 'CHECK (Verification)' : isDryRun ? 'DRY-RUN (Diff Preview)' : 'SYNC (Write to Disk)'}`);
console.log(`=================================================================\n`);

const result = processFiles({ check: isCheckMode, dryRun: isDryRun });

if (isCheckMode) {
  if (result.driftCount > 0 || result.missingMarkersCount > 0) {
    console.error(`[!] FAILED: ${result.driftCount} files out of sync; ${result.missingMarkersCount} missing markers.`);
    process.exit(1);
  } else {
    console.log(`✓ ALL CLEAN: All ${result.totalFiles} files match canonical navigation perfectly.`);
    process.exit(0);
  }
} else if (isDryRun) {
  console.log(`Audited ${result.totalFiles} HTML files. Files needing sync: ${result.driftCount}\n`);
  result.changes.forEach((ch, idx) => {
    console.log(`--- [${idx + 1}/${result.changes.length}] ${ch.file} ---`);
    console.log(`Changes: ${ch.diffLines.length} line diffs generated.`);
  });
  console.log(`\n[DRY RUN COMPLETE] Zero files modified on disk.`);
} else {
  // Sync mode: write to disk
  result.changes.forEach((ch) => {
    const fullPath = path.join(ROOT_DIR, ch.file);
    fs.writeFileSync(fullPath, ch.content, 'utf8');
    console.log(`[UPDATED] ${ch.file}`);
  });
  console.log(`\n✓ SUCCESS: Synchronized navigation across ${result.changes.length} files.`);
}
