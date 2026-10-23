#!/usr/bin/env node

/**
 * ============================================================================
 * VARAH SYSTEMS — Comprehensive Content Hygiene & Production Gate Auditor
 * ============================================================================
 * Standards:
 *   - Zero new npm dependencies (Node.js 18+ built-ins only: fs, path, url).
 *   - Scans all public HTML files in public/ (recursive).
 *   - Enforces absence of placeholder text, dummy tokens, banned emails,
 *     banned pages (book.html), empty anchors (href="#"), javascript: protocols,
 *     and unsubstantiated marketing buzzwords.
 *   - Verifies hybrid copyright year span format (<span id="copyright-year">...</span>).
 *   - In --production mode, fails if any .invalid or domain-pending placeholder exists.
 *   - Outputs formatted telemetry report and exits 1 on any violation.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const TEMPLATES_DIR = path.join(ROOT_DIR, 'templates');
const META_FILE = path.join(TEMPLATES_DIR, 'meta.json');

const args = process.argv.slice(2);
const IS_PRODUCTION = args.includes('--production');

// Banned buzzwords
const BANNED_BUZZWORDS = [
  /\brevolutionize\b/i,
  /\bcutting-edge\b/i,
  /\bdisruptive\b/i,
  /\bmagical\b/i,
  /\bgame-changing\b/i,
  /\bsilver bullet\b/i,
  /\beffortlessly\b/i,
  /\bseamlessly\b/i,
  /\bskyrocket\b/i,
  /\b10x your\b/i,
];

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

const htmlFiles = getHtmlFiles(PUBLIC_DIR);
const violations = [];

// 1. Audit templates/meta.json
if (fs.existsSync(META_FILE)) {
  const metaRaw = fs.readFileSync(META_FILE, 'utf8');
  if (metaRaw.includes('systems@agency.ai')) {
    violations.push({
      file: 'templates/meta.json',
      line: 0,
      type: 'BANNED_EMAIL',
      detail: 'systems@agency.ai found in meta.json'
    });
  }
  if (IS_PRODUCTION && (metaRaw.includes('.invalid') || metaRaw.includes('domain-pending'))) {
    violations.push({
      file: 'templates/meta.json',
      line: 0,
      type: 'PRODUCTION_PLACEHOLDER',
      detail: 'Placeholder .invalid or domain-pending found in meta.json during production audit'
    });
  }
}

// 2. Audit all public HTML files
for (const filePath of htmlFiles) {
  const relPath = path.relative(ROOT_DIR, filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  // Skip Layer B admin dashboard and standalone internal brand identity from marketing buzzword / href checks
  const isExcluded = ['public/admin.html', 'public/brand-identity.html'].includes(relPath);

  // Check banned email systems@agency.ai sitewide (no exceptions)
  if (content.includes('systems@agency.ai')) {
    lines.forEach((line, idx) => {
      if (line.includes('systems@agency.ai')) {
        violations.push({
          file: relPath,
          line: idx + 1,
          type: 'BANNED_EMAIL',
          detail: 'systems@agency.ai must be removed everywhere'
        });
      }
    });
  }

  // Check references to deleted book.html
  if (content.includes('book.html')) {
    lines.forEach((line, idx) => {
      if (line.includes('book.html')) {
        violations.push({
          file: relPath,
          line: idx + 1,
          type: 'BANNED_PAGE_REFERENCE',
          detail: 'Reference to deleted book.html found'
        });
      }
    });
  }

  // Check production placeholder domain/email in production mode
  if (IS_PRODUCTION) {
    lines.forEach((line, idx) => {
      if (line.includes('.invalid') || line.includes('domain-pending')) {
        violations.push({
          file: relPath,
          line: idx + 1,
          type: 'PRODUCTION_PLACEHOLDER',
          detail: 'Placeholder .invalid or domain-pending found in production mode'
        });
      }
    });
  }

  if (!isExcluded) {
    // Check placeholder texts
    lines.forEach((line, idx) => {
      if (/\blorem ipsum\b/i.test(line) || /\bdolor sit amet\b/i.test(line)) {
        violations.push({
          file: relPath,
          line: idx + 1,
          type: 'PLACEHOLDER_LOREM',
          detail: 'Lorem ipsum placeholder text detected'
        });
      }

      if (/\b(TODO|FIXME|XXX)\b/.test(line)) {
        violations.push({
          file: relPath,
          line: idx + 1,
          type: 'PLACEHOLDER_MARKER',
          detail: 'Unfinished marker (TODO/FIXME/XXX) detected'
        });
      }

      // Check javascript: links
      if (/href=["']javascript:/i.test(line)) {
        violations.push({
          file: relPath,
          line: idx + 1,
          type: 'INVALID_PROTOCOL',
          detail: 'javascript: pseudo-protocol link detected'
        });
      }

      // Check href="#" empty links (exempting href="#top" or named anchors)
      if (/href=["']#["']/i.test(line)) {
        violations.push({
          file: relPath,
          line: idx + 1,
          type: 'EMPTY_ANCHOR',
          detail: 'Empty href="#" link detected'
        });
      }

      // Check banned buzzwords
      for (const pattern of BANNED_BUZZWORDS) {
        if (pattern.test(line)) {
          violations.push({
            file: relPath,
            line: idx + 1,
            type: 'BANNED_BUZZWORD',
            detail: `Unsubstantiated marketing buzzword matching ${pattern} found`
          });
        }
      }

      // Check literal copyright year without exemption span
      // Allowed: &copy; <span id="copyright-year">2026</span>
      // Banned: &copy; 2026 ... or © 2026 ... without <span id="copyright-year">
      if (/(&copy;|©)\s*(\d{4})/.test(line)) {
        if (!line.includes('<span id="copyright-year">')) {
          violations.push({
            file: relPath,
            line: idx + 1,
            type: 'UNEXEMPTED_COPYRIGHT_YEAR',
            detail: 'Literal copyright year found without <span id="copyright-year"> wrapper'
          });
        }
      }
    });

    // Check JSON-LD: if route has Organization schema, verify no invalid email / contactPoint
    if (content.includes('"@type": "Organization"') || content.includes('"@type":"Organization"')) {
      if (content.includes('"email": "contact@domain-pending.invalid"') || content.includes('contactPoint')) {
        violations.push({
          file: relPath,
          line: 0,
          type: 'INVALID_SCHEMA_CONTACT',
          detail: 'Organization JSON-LD contains invalid email or contactPoint before domain/inbox is real'
        });
      }
    }
  }
}

// Telemetry Report Output
console.log('=================================================================');
console.log('VARAH SYSTEMS — Content Hygiene & Quality Assurance Auditor');
console.log(`Environment: ${IS_PRODUCTION ? 'PRODUCTION' : 'DEVELOPMENT'}`);
console.log(`Files Audited: ${htmlFiles.length} HTML files + templates/meta.json`);
console.log('=================================================================\n');

if (violations.length === 0) {
  console.log('✓ ALL CLEAN: Zero content hygiene violations detected.');
  console.log(`  - No systems@agency.ai or deleted book.html references.`);
  console.log(`  - No lorem ipsum, unfinished markers, or empty href="#" anchors.`);
  console.log(`  - No unsubstantiated buzzwords.`);
  console.log(`  - Copyright year correctly isolated in <span id="copyright-year">.`);
  if (!IS_PRODUCTION) {
    console.log(`  - Note: Development mode allows .invalid domain placeholder.`);
  }
  process.exit(0);
} else {
  console.error(`[!] FAILED: ${violations.length} content hygiene violation(s) detected:\n`);
  violations.forEach((v, i) => {
    console.error(`  ${i + 1}. [${v.type}] ${v.file}:${v.line} — ${v.detail}`);
  });
  console.error('\nPlease resolve all content violations before proceeding.');
  process.exit(1);
}
