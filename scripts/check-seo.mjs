#!/usr/bin/env node

/**
 * ============================================================================
 * VARAH SYSTEMS — Zero-Dependency Comprehensive SEO Integrity Auditor
 * ============================================================================
 * Standards:
 *   - Node.js 18+ built-ins only (fs, path, url).
 *   - Fails with code 1 on:
 *       * Missing or duplicate <title>
 *       * Title length out of range (50-60 chars on indexable pages)
 *       * Missing or duplicate meta description
 *       * Description length out of range (140-160 chars on indexable pages)
 *       * Missing canonical or non-absolute canonical
 *       * Multiple or zero <h1> tags
 *       * Missing <html lang> attribute
 *       * Missing og:image or og:image file missing on disk
 *       * Invalid JSON-LD structured data syntax
 *       * Sitemap URL that is noindex or missing on disk
 *       * robots.txt missing Sitemap reference
 *       * --production: Fails if domain placeholder (.invalid) exists.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const CONFIG_FILE = path.join(ROOT_DIR, 'templates', 'meta.json');
const SITEMAP_FILE = path.join(PUBLIC_DIR, 'sitemap.xml');
const ROBOTS_FILE = path.join(PUBLIC_DIR, 'robots.txt');

const args = process.argv.slice(2);
const IS_PRODUCTION = args.includes('--production');

if (!fs.existsSync(CONFIG_FILE)) {
  console.error(`[ERROR] Configuration file missing: ${CONFIG_FILE}`);
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
const { siteUrl, routes } = config;

console.log('=================================================================');
console.log('VARAH SYSTEMS — Comprehensive SEO & Metadata Auditor');
console.log(`Environment: ${IS_PRODUCTION ? 'PRODUCTION STRICT' : 'DEVELOPMENT'}`);
console.log(`Target Site URL: ${siteUrl}`);
console.log('=================================================================\n');

const issues = [];
const titlesSeen = new Map();
const descsSeen = new Map();
const canonicalsSeen = new Map();

// 1. Production Domain Guard
if (IS_PRODUCTION) {
  if (siteUrl.includes('.invalid') || siteUrl.includes('localhost') || siteUrl.includes('127.0.0.1')) {
    issues.push({
      file: 'templates/meta.json',
      type: 'production-domain',
      message: `Production check failed: siteUrl is set to placeholder "${siteUrl}". Attach confirmed domain before production deploy.`
    });
  }
}

// 2. Discover all HTML files
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

// 3. Per-Page Checks
for (const file of htmlFiles) {
  const relFile = path.relative(ROOT_DIR, file);
  const routeRelPath = path.relative(PUBLIC_DIR, file);
  const content = fs.readFileSync(file, 'utf8');

  // Strip HTML comments before scanning DOM elements
  const cleanContent = content.replace(/<!--[\s\S]*?-->/g, '');

  // Find corresponding route config if exists
  const routeEntry = Object.values(routes).find((r) => r.file === routeRelPath);
  const isIndexable = routeEntry ? routeEntry.index : !/noindex/i.test(content);

  // A. Check <html lang>
  const langMatch = content.match(/<html\b[^>]*\blang=["']([^"']*)["']/i);
  if (!langMatch || !langMatch[1]) {
    issues.push({ file: relFile, type: 'lang', message: 'Missing or empty <html lang> attribute.' });
  }

  // B. Check Charset & Viewport
  if (!/<meta\s+charset=["']UTF-8["']/i.test(content)) {
    issues.push({ file: relFile, type: 'charset', message: 'Missing standard <meta charset="UTF-8">.' });
  }
  if (!/<meta\s+name=["']viewport["']/i.test(content)) {
    issues.push({ file: relFile, type: 'viewport', message: 'Missing <meta name="viewport">.' });
  }

  // C. Check <title>
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    issues.push({ file: relFile, type: 'title', message: 'Missing or empty <title> tag.' });
  } else {
    const title = titleMatch[1].trim();
    if (titlesSeen.has(title)) {
      issues.push({ file: relFile, type: 'title-duplicate', message: `Duplicate title with ${titlesSeen.get(title)}: "${title}"` });
    } else {
      titlesSeen.set(title, relFile);
    }

    if (isIndexable) {
      if (title.length < 50 || title.length > 60) {
        issues.push({ file: relFile, type: 'title-length', message: `Title length (${title.length} chars) out of range (50-60 chars): "${title}"` });
      }
    }
  }

  // D. Check Meta Description
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
                    content.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
  if (!descMatch || !descMatch[1].trim()) {
    issues.push({ file: relFile, type: 'description', message: 'Missing or empty meta description.' });
  } else {
    const desc = descMatch[1].trim();
    if (descsSeen.has(desc)) {
      issues.push({ file: relFile, type: 'description-duplicate', message: `Duplicate description with ${descsSeen.get(desc)}: "${desc.slice(0, 40)}..."` });
    } else {
      descsSeen.set(desc, relFile);
    }

    if (isIndexable) {
      if (desc.length < 140 || desc.length > 160) {
        issues.push({ file: relFile, type: 'description-length', message: `Description length (${desc.length} chars) out of range (140-160 chars): "${desc.slice(0, 50)}..."` });
      }
    }
  }

  // E. Check Canonical
  const canonMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i) ||
                     content.match(/<link\s+href=["']([^"']*)["']\s+rel=["']canonical["']/i);
  if (!canonMatch || !canonMatch[1].trim()) {
    issues.push({ file: relFile, type: 'canonical', message: 'Missing <link rel="canonical"> tag.' });
  } else {
    const canon = canonMatch[1].trim();
    if (!canon.startsWith('http://') && !canon.startsWith('https://')) {
      issues.push({ file: relFile, type: 'canonical-relative', message: `Canonical URL must be absolute: "${canon}"` });
    }
    if (canonicalsSeen.has(canon)) {
      issues.push({ file: relFile, type: 'canonical-duplicate', message: `Duplicate canonical with ${canonicalsSeen.get(canon)}: "${canon}"` });
    } else {
      canonicalsSeen.set(canon, relFile);
    }
  }

  // F. Check <h1> count (must be exactly 1 in active DOM)
  const h1Matches = cleanContent.match(/<h1\b[^>]*>/gi) || [];
  if (h1Matches.length === 0) {
    issues.push({ file: relFile, type: 'h1', message: 'Missing <h1> tag. Exactly one <h1> is required per document.' });
  } else if (h1Matches.length > 1) {
    issues.push({ file: relFile, type: 'h1', message: `Multiple <h1> tags found (${h1Matches.length}). Exactly one <h1> is required.` });
  }

  // G. Check og:image and verify physical file on disk
  const ogImgMatch = content.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i);
  if (!ogImgMatch || !ogImgMatch[1].trim()) {
    issues.push({ file: relFile, type: 'og-image', message: 'Missing <meta property="og:image"> tag.' });
  } else {
    const ogUrl = ogImgMatch[1].trim();
    const relativeAssetPath = ogUrl.replace(/^https?:\/\/[^\/]+\//, '');
    const physicalAssetPath = path.join(PUBLIC_DIR, relativeAssetPath);
    if (!fs.existsSync(physicalAssetPath)) {
      issues.push({ file: relFile, type: 'og-image-file', message: `og:image file missing on disk: "${relativeAssetPath}"` });
    }
  }

  // H. Check JSON-LD syntax
  const jsonLdRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  let jsonLdMatch;
  while ((jsonLdMatch = jsonLdRegex.exec(content)) !== null) {
    const rawJson = jsonLdMatch[1].trim();
    try {
      JSON.parse(rawJson);
    } catch (err) {
      issues.push({ file: relFile, type: 'json-ld', message: `Malformed JSON-LD JSON: ${err.message}` });
    }
  }
}

// 4. Validate robots.txt
if (!fs.existsSync(ROBOTS_FILE)) {
  issues.push({ file: 'public/robots.txt', type: 'robots', message: 'robots.txt file is missing on disk.' });
} else {
  const robotsContent = fs.readFileSync(ROBOTS_FILE, 'utf8');
  if (!/Sitemap:\s*https?:\/\/[^\s]+/i.test(robotsContent)) {
    issues.push({ file: 'public/robots.txt', type: 'robots-sitemap', message: 'robots.txt is missing a valid Sitemap reference line.' });
  }
}

// 5. Validate sitemap.xml
if (!fs.existsSync(SITEMAP_FILE)) {
  issues.push({ file: 'public/sitemap.xml', type: 'sitemap', message: 'sitemap.xml file is missing on disk.' });
} else {
  const sitemapContent = fs.readFileSync(SITEMAP_FILE, 'utf8');
  const locRegex = /<loc>([^<]+)<\/loc>/gi;
  let locMatch;
  const sitemapUrls = [];
  while ((locMatch = locRegex.exec(sitemapContent)) !== null) {
    sitemapUrls.push(locMatch[1].trim());
  }

  if (sitemapUrls.length === 0) {
    issues.push({ file: 'public/sitemap.xml', type: 'sitemap-empty', message: 'sitemap.xml contains zero <loc> URLs.' });
  }

  for (const url of sitemapUrls) {
    const relPath = url.replace(/^https?:\/\/[^\/]+\/?/, '');
    const diskPath = relPath === '' ? path.join(PUBLIC_DIR, 'index.html') : path.join(PUBLIC_DIR, relPath);

    if (!fs.existsSync(diskPath)) {
      issues.push({ file: 'public/sitemap.xml', type: 'sitemap-missing-file', message: `Sitemap URL points to non-existent file on disk: "${url}"` });
      continue;
    }

    const pageContent = fs.readFileSync(diskPath, 'utf8');
    if (/noindex/i.test(pageContent)) {
      issues.push({ file: 'public/sitemap.xml', type: 'sitemap-noindex', message: `Sitemap includes URL marked with noindex: "${url}" (${path.relative(ROOT_DIR, diskPath)})` });
    }
  }
}

// 6. Report Table
console.log('---------------------------------------------------------------------------------------------------------');
console.log('| FILE / RESOURCE                   | TYPE                | ISSUE');
console.log('---------------------------------------------------------------------------------------------------------');

if (issues.length === 0) {
  console.log('| ALL AUDITED FILES                 | SEO & METADATA      | ✓ 100% CLEAN: Zero SEO violations detected');
} else {
  issues.forEach((iss) => {
    const pFile = iss.file.padEnd(35).slice(0, 35);
    const pType = iss.type.padEnd(19).slice(0, 19);
    console.log(`| ${pFile} | ${pType} | ${iss.message}`);
  });
}

console.log('---------------------------------------------------------------------------------------------------------\n');

console.log('=== AUDIT TELEMETRY ===');
console.log(`HTML Files Audited:       ${htmlFiles.length}`);
console.log(`Unique Titles:            ${titlesSeen.size}`);
console.log(`Unique Descriptions:      ${descsSeen.size}`);
console.log(`Unique Canonicals:        ${canonicalsSeen.size}`);
console.log(`Total Violations Found:   ${issues.length}`);

if (issues.length > 0) {
  console.error(`\n❌ SEO AUDIT FAILED: ${issues.length} violation(s) detected.`);
  process.exit(1);
} else {
  console.log(`\n✓ SUCCESS: All pages, tags, sitemap, and robots.txt passed comprehensive SEO audit!`);
  process.exit(0);
}
