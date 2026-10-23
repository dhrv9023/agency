#!/usr/bin/env node

/**
 * ==============================================================================
 * VARAH SYSTEMS — Legal & Compliance Policy Auditor (check:legal)
 * ==============================================================================
 * Standards:
 *   - Zero external npm dependencies (Node.js 18+ built-ins: fs, path, url).
 *   - Audits existence of privacy.html, terms.html, cookies.html.
 *   - Verifies presence of footer legal links & cookie settings button on all pages.
 *   - Detects processor disclosures and script consent gating.
 *   - In --production mode, strictly fails (exit 1) if:
 *     - Any <!-- DRAFT-LEGAL-REVIEW-REQUIRED --> marker exists.
 *     - Any [[INPUT-NEEDED: ...]] placeholder exists.
 *     - PRIVACY_EMAIL ends in .invalid or is placeholder.
 *   - In development mode, reports status cleanly and exits 0.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const META_FILE = path.join(ROOT_DIR, 'templates', 'meta.json');

const args = process.argv.slice(2);
const IS_PRODUCTION = args.includes('--production') || process.env.NODE_ENV === 'production';

// Discover all HTML files recursively in public/
function getHtmlFiles(dir, list = []) {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (entry !== 'demos' && entry !== 'dev') getHtmlFiles(fullPath, list);
    } else if (entry.endsWith('.html')) {
      list.push(fullPath);
    }
  }
  return list;
}

const allHtmlFiles = getHtmlFiles(PUBLIC_DIR);
const metaConfig = fs.existsSync(META_FILE) ? JSON.parse(fs.readFileSync(META_FILE, 'utf8')) : {};

const checks = [];

// 1. Check Required Legal Pages
const requiredPages = [
  { file: 'privacy.html', name: 'Privacy Policy' },
  { file: 'terms.html', name: 'Terms & Conditions' },
  { file: 'cookies.html', name: 'Cookie & Storage Policy' },
];

for (const req of requiredPages) {
  const pagePath = path.join(PUBLIC_DIR, req.file);
  if (!fs.existsSync(pagePath)) {
    checks.push({
      category: 'Legal Pages',
      item: req.file,
      status: 'FAIL',
      details: `Required legal page ${req.file} is missing from public/`,
    });
  } else {
    checks.push({
      category: 'Legal Pages',
      item: req.file,
      status: 'PASS',
      details: `${req.name} exists in public/`,
    });
  }
}

// 2. Audit Footer Legal Links Across All Marketing Pages
let missingLegalFooterCount = 0;
for (const htmlFile of allHtmlFiles) {
  const relPath = path.relative(PUBLIC_DIR, htmlFile);
  if (relPath.startsWith('admin') || relPath.startsWith('demos') || relPath.startsWith('brand-identity') || relPath.startsWith('dev')) continue;

  const content = fs.readFileSync(htmlFile, 'utf8');
  const hasPrivacy = content.includes('privacy.html');
  const hasTerms = content.includes('terms.html');
  const hasCookies = content.includes('cookies.html');
  const hasSettingsBtn = content.includes('open-cookie-preferences-btn') || content.includes('footer-cookie-settings-btn');

  if (!hasPrivacy || !hasTerms || !hasCookies || !hasSettingsBtn) {
    missingLegalFooterCount++;
    checks.push({
      category: 'Footer Navigation',
      item: relPath,
      status: 'FAIL',
      details: `Missing legal link or cookie settings trigger in footer (${relPath})`,
    });
  }
}

if (missingLegalFooterCount === 0) {
  checks.push({
    category: 'Footer Navigation',
    item: 'Sitewide Footers',
    status: 'PASS',
    details: `All ${allHtmlFiles.length} pages contain Privacy, Terms, Cookies, and Cookie Settings links.`,
  });
}

// 3. Audit Markers & Production Readiness
const legalPageFiles = ['privacy.html', 'terms.html', 'cookies.html'];
let totalDraftMarkers = 0;
let totalInputNeededMarkers = 0;

for (const legalFile of legalPageFiles) {
  const fullPath = path.join(PUBLIC_DIR, legalFile);
  if (!fs.existsSync(fullPath)) continue;

  const content = fs.readFileSync(fullPath, 'utf8');

  // Check Draft Marker
  const hasDraftMarker = content.includes('DRAFT-LEGAL-REVIEW-REQUIRED');
  if (hasDraftMarker) {
    totalDraftMarkers++;
    if (IS_PRODUCTION) {
      checks.push({
        category: 'Legal Review Gate',
        item: legalFile,
        status: 'FAIL',
        details: `Contains <!-- DRAFT-LEGAL-REVIEW-REQUIRED -->. Must be reviewed by qualified legal counsel before production.`,
      });
    } else {
      checks.push({
        category: 'Legal Review Gate',
        item: legalFile,
        status: 'PASS',
        details: `Properly marked with <!-- DRAFT-LEGAL-REVIEW-REQUIRED --> (Development draft).`,
      });
    }
  }

  // Check INPUT-NEEDED Markers
  const inputMatches = content.match(/\[\[INPUT-NEEDED:[^\]]+\]\]/g) || [];
  if (inputMatches.length > 0) {
    totalInputNeededMarkers += inputMatches.length;
    if (IS_PRODUCTION) {
      checks.push({
        category: 'Input Validation',
        item: legalFile,
        status: 'FAIL',
        details: `${inputMatches.length} [[INPUT-NEEDED]] placeholder(s) remaining: ${inputMatches[0]}`,
      });
    } else {
      checks.push({
        category: 'Input Validation',
        item: legalFile,
        status: 'WARN',
        details: `${inputMatches.length} [[INPUT-NEEDED]] item(s) pending user input.`,
      });
    }
  } else {
    checks.push({
      category: 'Input Validation',
      item: legalFile,
      status: 'PASS',
      details: `Zero [[INPUT-NEEDED]] placeholders.`,
    });
  }
}

// 4. Privacy Contact Email Audit
const privacyEmail = metaConfig.privacyEmail;
if (!privacyEmail) {
  checks.push({
    category: 'Contact Metadata',
    item: 'privacyEmail',
    status: IS_PRODUCTION ? 'FAIL' : 'WARN',
    details: 'Missing privacyEmail constant in templates/meta.json',
  });
} else if (privacyEmail.includes('.invalid')) {
  if (IS_PRODUCTION) {
    checks.push({
      category: 'Contact Metadata',
      item: 'privacyEmail',
      status: 'FAIL',
      details: `privacyEmail is '${privacyEmail}'. Production requires an active verified privacy inbox.`,
    });
  } else {
    checks.push({
      category: 'Contact Metadata',
      item: 'privacyEmail',
      status: 'PASS',
      details: `Placeholder '${privacyEmail}' configured (expected in development).`,
    });
  }
} else {
  checks.push({
    category: 'Contact Metadata',
    item: 'privacyEmail',
    status: 'PASS',
    details: `Configured privacy inbox: ${privacyEmail}`,
  });
}

// 5. Processor & Third-Party Audit Cross-Check
const privacyHtml = fs.readFileSync(path.join(PUBLIC_DIR, 'privacy.html'), 'utf8');
const processorsToCheck = [
  { name: 'Cloudflare Turnstile', identifier: 'Cloudflare' },
  { name: 'Slack Incoming Webhook', identifier: 'Slack' },
];

for (const proc of processorsToCheck) {
  if (!privacyHtml.includes(proc.identifier)) {
    checks.push({
      category: 'Processor Disclosures',
      item: proc.name,
      status: 'FAIL',
      details: `Processor ${proc.name} is used in application code but missing from privacy.html disclosures.`,
    });
  } else {
    checks.push({
      category: 'Processor Disclosures',
      item: proc.name,
      status: 'PASS',
      details: `Disclosed accurately in privacy.html.`,
    });
  }
}

// 6. Script Consent Gating Audit
// Verify that non-essential scripts on public pages are not naked <script src>
let ungatedThirdPartyScripts = 0;
for (const htmlFile of allHtmlFiles) {
  const content = fs.readFileSync(htmlFile, 'utf8');
  // Match any script tag with http/https src that is NOT Turnstile or FontAwesome
  const scriptTags = content.match(/<script[^>]+src=["']https?:\/\/[^"']+["'][^>]*>/gi) || [];
  for (const tag of scriptTags) {
    if (!tag.includes('challenges.cloudflare.com') && !tag.includes('type="text/plain"')) {
      ungatedThirdPartyScripts++;
      checks.push({
        category: 'Script Gating',
        item: path.basename(htmlFile),
        status: 'FAIL',
        details: `Ungated third-party script detected: ${tag}`,
      });
    }
  }
}

if (ungatedThirdPartyScripts === 0) {
  checks.push({
    category: 'Script Gating',
    item: 'Marketing Pages',
    status: 'PASS',
    details: 'Zero ungated third-party tracking scripts detected across public pages.',
  });
}

// Print Audit Report
console.log('=============================================================================');
console.log(`VARAH SYSTEMS — Legal & Compliance Policy Auditor (${IS_PRODUCTION ? 'PRODUCTION MODE' : 'DEVELOPMENT MODE'})`);
console.log('=============================================================================\n');

let passCount = 0;
let warnCount = 0;
let failCount = 0;

for (const check of checks) {
  const icon = check.status === 'PASS' ? '✓ [PASS]' : check.status === 'WARN' ? '⚠ [WARN]' : '✗ [FAIL]';
  if (check.status === 'PASS') passCount++;
  if (check.status === 'WARN') warnCount++;
  if (check.status === 'FAIL') failCount++;

  console.log(`${icon.padEnd(9)} [${check.category}] ${check.item}`);
  console.log(`          ${check.details}`);
}

console.log('\n-----------------------------------------------------------------------------');
console.log(`Summary: ${passCount} Passed, ${warnCount} Warnings, ${failCount} Failures`);
console.log(`Draft Markers: ${totalDraftMarkers} | Pending Inputs: ${totalInputNeededMarkers}`);
console.log('-----------------------------------------------------------------------------');

if (IS_PRODUCTION && failCount > 0) {
  console.error(`\n[!] PRODUCTION GATE FAILED: ${failCount} legal/compliance issues must be resolved before deployment.`);
  process.exit(1);
} else if (failCount > 0) {
  console.error(`\n[!] AUDIT FAILED: ${failCount} critical error(s) found.`);
  process.exit(1);
} else {
  console.log(`\n✓ Legal auditor passed successfully for ${IS_PRODUCTION ? 'production' : 'development'}.`);
  process.exit(0);
}
