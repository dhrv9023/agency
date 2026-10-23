#!/usr/bin/env node

/**
 * ============================================================================
 * VARAH SYSTEMS — Zero-Dependency Sitemap Generator
 * ============================================================================
 * Standards:
 *   - Reads templates/meta.json.
 *   - Only indexable, 200-status canonical URLs (no 404, 500, noindex, or utility).
 *   - Absolute https URLs derived from siteUrl.
 *   - Real lastmod date from git commit history (with fs.stat fallback).
 *   - Discrepancy checks: Fails if an indexable route in meta.json is missing on disk.
 *   - Zero new npm dependencies (Node.js built-ins only).
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const CONFIG_FILE = path.join(ROOT_DIR, 'templates', 'meta.json');
const SITEMAP_FILE = path.join(PUBLIC_DIR, 'sitemap.xml');

if (!fs.existsSync(CONFIG_FILE)) {
  console.error(`[ERROR] Configuration file missing: ${CONFIG_FILE}`);
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
const { siteUrl, routes } = config;

// Retrieve real last modified date via git log with file mtime fallback
function getRealLastMod(filePath) {
  try {
    const gitDate = execSync(`git log -1 --format="%cI" -- "${filePath}"`, {
      cwd: ROOT_DIR,
      stdio: ['pipe', 'pipe', 'ignore'],
      encoding: 'utf8'
    }).trim();
    if (gitDate) {
      return gitDate.split('T')[0]; // YYYY-MM-DD
    }
  } catch {
    // Fall through to mtime
  }

  const stat = fs.statSync(filePath);
  return stat.mtime.toISOString().split('T')[0];
}

console.log('=================================================================');
console.log('VARAH SYSTEMS — XML Sitemap Generator');
console.log(`Target Site URL: ${siteUrl}`);
console.log('=================================================================\n');

const urlEntries = [];
let missingFiles = 0;

for (const [routeKey, routeData] of Object.entries(routes)) {
  const filePath = path.join(PUBLIC_DIR, routeData.file);

  if (!fs.existsSync(filePath)) {
    console.error(`[ERROR] File missing on disk for route ${routeKey}: ${filePath}`);
    missingFiles++;
    continue;
  }

  // Only indexable pages are included in the XML sitemap
  if (!routeData.index) {
    continue;
  }

  const canonicalUrl = routeData.canonicalPath === '' ? `${siteUrl}/` : `${siteUrl}/${routeData.canonicalPath}`;
  const lastmod = getRealLastMod(filePath);
  const changefreq = routeData.changefreq || 'monthly';
  const priority = routeData.priority || '0.8';

  urlEntries.push({
    loc: canonicalUrl,
    lastmod,
    changefreq,
    priority,
    file: routeData.file
  });
}

if (missingFiles > 0) {
  console.error(`\n❌ SITEMAP GENERATION FAILED: ${missingFiles} route file(s) missing on disk.`);
  process.exit(1);
}

// Build XML
const xmlLines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
];

urlEntries.forEach((entry) => {
  xmlLines.push('  <url>');
  xmlLines.push(`    <loc>${entry.loc}</loc>`);
  xmlLines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
  xmlLines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
  xmlLines.push(`    <priority>${entry.priority}</priority>`);
  xmlLines.push('  </url>');
});

xmlLines.push('</urlset>');
const sitemapXml = xmlLines.join('\n') + '\n';

fs.writeFileSync(SITEMAP_FILE, sitemapXml, 'utf8');

console.log(`✓ SITEMAP CREATED: ${urlEntries.length} canonical URLs written to public/sitemap.xml`);
console.log(`  - Noindex/Utility pages excluded: ${Object.keys(routes).length - urlEntries.length}`);
console.log(`  - Real lastmod dates extracted from git/mtime metadata.`);
