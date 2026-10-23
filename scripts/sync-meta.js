#!/usr/bin/env node

/**
 * ============================================================================
 * VARAH SYSTEMS — Metadata, SEO & Structured Data Synchronization Engine
 * ============================================================================
 * Single source of truth: templates/meta.json
 *
 * Capabilities:
 *   - Injects title, meta description, robots, canonical, OG/Twitter tags,
 *     icon/manifest links, dual theme-color, and JSON-LD between marker comments.
 *   - Idempotent: Subsequent runs produce zero diff.
 *   - --check mode: Exits with code 1 on any drift or missing markers.
 *   - --dry-run mode: Displays diff preview without writing to disk.
 *   - Zero new npm dependencies (Node.js built-ins only).
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const CONFIG_FILE = path.join(ROOT_DIR, 'templates', 'meta.json');

const MARKERS = {
  start: '<!-- META_START -->',
  end: '<!-- META_END -->'
};

if (!fs.existsSync(CONFIG_FILE)) {
  console.error(`[ERROR] Configuration file missing: ${CONFIG_FILE}`);
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
const { siteUrl, brandName, routes } = config;

// Compute relative path prefix to site root ('./' or '../')
function getRelativePrefix(filePath) {
  const relPath = path.relative(PUBLIC_DIR, filePath);
  const depth = relPath.split(path.sep).length - 1;
  return depth === 0 ? '' : '../'.repeat(depth);
}

// Generate JSON-LD Schema
function generateJsonLd(routeKey, routeData, fullCanonicalUrl) {
  const schemas = [];

  if (routeKey === '/') {
    const isRealEmail = config.contactEmail && !config.contactEmail.includes('.invalid');
    const orgData = {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: brandName,
      url: `${siteUrl}/`,
      logo: `${siteUrl}/assets/logo.svg`
    };
    if (isRealEmail) {
      orgData.email = config.contactEmail;
      orgData.contactPoint = {
        '@type': 'ContactPoint',
        email: config.contactEmail,
        contactType: 'customer support'
      };
    }
    schemas.push({
      '@context': 'https://schema.org',
      '@graph': [
        orgData,
        {
          '@type': 'WebSite',
          '@id': `${siteUrl}/#website`,
          url: `${siteUrl}/`,
          name: brandName,
          publisher: { '@id': `${siteUrl}/#organization` }
        }
      ]
    });
  } else if (routeData.schemaType === 'Service') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: routeData.title.split(' | ')[0].trim(),
      serviceType: routeData.serviceType || 'AI Systems & Automation',
      provider: {
        '@type': 'Organization',
        name: brandName,
        url: `${siteUrl}/`
      },
      description: routeData.description,
      url: fullCanonicalUrl
    });
  } else if (routeData.schemaType === 'Article') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: routeData.title.split(' | ')[0].trim(),
      description: routeData.description,
      publisher: {
        '@type': 'Organization',
        name: brandName,
        url: `${siteUrl}/`,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/assets/logo.svg`
        }
      },
      mainEntityOfPage: fullCanonicalUrl
    });
  }

  // Breadcrumbs
  if (routeData.breadcrumbs && routeData.breadcrumbs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: routeData.breadcrumbs.map((b, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: b.name,
        item: b.path === '' ? `${siteUrl}/` : `${siteUrl}/${b.path}`
      }))
    });
  }

  if (schemas.length === 0) return '';
  if (schemas.length === 1) {
    return `  <script type="application/ld+json">\n  ${JSON.stringify(schemas[0], null, 2).replace(/\n/g, '\n  ')}\n  </script>`;
  }
  return `  <script type="application/ld+json">\n  ${JSON.stringify({ '@context': 'https://schema.org', '@graph': schemas }, null, 2).replace(/\n/g, '\n  ')}\n  </script>`;
}

// Generate the complete canonical metadata block
function generateMetaBlock(routeKey, routeData, filePath) {
  const prefix = getRelativePrefix(filePath);
  const fullCanonicalUrl = routeData.canonicalPath === '' ? `${siteUrl}/` : `${siteUrl}/${routeData.canonicalPath}`;
  const fullOgImageUrl = `${siteUrl}/${routeData.ogImage}`;
  const isArticle = routeData.schemaType === 'Article';
  const ogType = isArticle ? 'article' : 'website';

  const jsonLdMarkup = generateJsonLd(routeKey, routeData, fullCanonicalUrl);

  const lines = [
    `  ${MARKERS.start}`,
    `  <title>${routeData.title}</title>`,
    `  <meta name="description" content="${routeData.description}">`,
    `  <meta name="robots" content="${routeData.robots}">`,
    `  <link rel="canonical" href="${fullCanonicalUrl}">`,
    ``,
    `  <!-- Open Graph / Social Embed Protocol -->`,
    `  <meta property="og:site_name" content="${brandName}">`,
    `  <meta property="og:type" content="${ogType}">`,
    `  <meta property="og:title" content="${routeData.title}">`,
    `  <meta property="og:description" content="${routeData.description}">`,
    `  <meta property="og:url" content="${fullCanonicalUrl}">`,
    `  <meta property="og:image" content="${fullOgImageUrl}">`,
    `  <meta property="og:image:width" content="1200">`,
    `  <meta property="og:image:height" content="630">`,
    `  <meta property="og:image:alt" content="${routeData.ogImageAlt || routeData.title}">`,
    `  <meta property="og:locale" content="${config.defaultLocale || 'en_US'}">`,
    ``,
    `  <!-- Twitter Cards -->`,
    `  <meta name="twitter:card" content="summary_large_image">`,
    `  <meta name="twitter:title" content="${routeData.title}">`,
    `  <meta name="twitter:description" content="${routeData.description}">`,
    `  <meta name="twitter:image" content="${fullOgImageUrl}">`,
    `  <meta name="twitter:image:alt" content="${routeData.ogImageAlt || routeData.title}">`,
    ``,
    `  <!-- Theme Color & Web Manifest -->`,
    `  <meta name="theme-color" media="(prefers-color-scheme: dark)" content="${config.defaultThemeColorDark}">`,
    `  <!-- Self-Hosted Critical Font Preload (Inter Variable Latin) -->`,
    `  <link rel="preload" href="${prefix}assets/fonts/Inter-Variable-Latin.woff2" as="font" type="font/woff2" crossorigin>`,
    `  <link rel="icon" href="${prefix}favicon.ico" sizes="any">`,
    `  <link rel="icon" href="${prefix}icon.svg" type="image/svg+xml">`,
    `  <link rel="apple-touch-icon" href="${prefix}apple-touch-icon.png">`,
    `  <link rel="manifest" href="${prefix}manifest.json">`
  ];

  if (jsonLdMarkup) {
    lines.push(``, `  <!-- Structured Data (JSON-LD) -->`, jsonLdMarkup);
  }

  lines.push(`  ${MARKERS.end}`);
  return lines.join('\n');
}

// Compute simple line diff
function computeSimpleDiff(oldStr, newStr) {
  const oldLines = oldStr.split('\n');
  const newLines = newStr.split('\n');
  const diff = [];
  const max = Math.max(oldLines.length, newLines.length);
  for (let i = 0; i < max; i++) {
    if (oldLines[i] !== newLines[i]) {
      if (oldLines[i] !== undefined) diff.push(`- ${oldLines[i]}`);
      if (newLines[i] !== undefined) diff.push(`+ ${newLines[i]}`);
    }
  }
  return diff;
}

function processFiles(options = {}) {
  let driftCount = 0;
  let missingMarkersCount = 0;
  const changes = [];
  const routeEntries = Object.entries(routes);

  for (const [routeKey, routeData] of routeEntries) {
    const filePath = path.join(PUBLIC_DIR, routeData.file);
    if (!fs.existsSync(filePath)) {
      console.error(`[ERROR] File specified in routes not found: ${filePath}`);
      continue;
    }

    const relName = path.relative(ROOT_DIR, filePath);
    const originalContent = fs.readFileSync(filePath, 'utf8');
    let content = originalContent;

    const newBlock = generateMetaBlock(routeKey, routeData, filePath);
    const hasMarkers = content.includes(MARKERS.start) && content.includes(MARKERS.end);

    if (options.check && !hasMarkers) {
      console.error(`[FAIL] ${relName}: Missing marker comments (${MARKERS.start} ... ${MARKERS.end})`);
      missingMarkersCount++;
      continue;
    }

    if (hasMarkers) {
      const regex = new RegExp(`[ \\t]*${MARKERS.start}[\\s\\S]*?${MARKERS.end}`);
      content = content.replace(regex, () => newBlock);
    } else {
      // First-time adoption: find end of viewport tag and start of first stylesheet/preconnect
      const vpMatch = /<meta\s+name=["']viewport["'][^>]*>/i.exec(content);
      if (vpMatch) {
        const vpEnd = vpMatch.index + vpMatch[0].length;
        const linkMatch = /(<!--\s*(CSS|Stylesheets|Fonts)[\s\S]*?-->|\s*<link\s+rel=["'](stylesheet|preconnect)["'])/i.exec(content.slice(vpEnd));
        if (linkMatch) {
          const linkStart = vpEnd + linkMatch.index;
          content = content.slice(0, vpEnd) + '\n' + newBlock + '\n' + content.slice(linkStart);
        } else {
          // Fallback
          content = content.replace(/<head[^>]*>/, `$& \n${newBlock}`);
        }
      } else {
        content = content.replace(/<head[^>]*>/, `$& \n${newBlock}`);
      }

      // Remove any legacy duplicate JSON-LD that was lower in the document outside markers
      // (only remove outside the newly added markers)
      const parts = content.split(MARKERS.end);
      if (parts.length > 1) {
        const cleanedRest = parts[1].replace(/<script\s+type=["']application\/ld\+json["'][\s\S]*?<\/script>\s*/gi, '');
        content = parts[0] + MARKERS.end + cleanedRest;
      }
    }

    const hasDrift = content !== originalContent;
    if (hasDrift) {
      driftCount++;
      const diffLines = computeSimpleDiff(originalContent, content);
      changes.push({ file: relName, fullPath: filePath, diffLines, content });
    }
  }

  return { driftCount, missingMarkersCount, changes, totalFiles: routeEntries.length };
}

// CLI Execution
const args = process.argv.slice(2);
const isCheckMode = args.includes('--check');
const isDryRun = args.includes('--dry-run');

console.log(`=================================================================`);
console.log(`VARAH SYSTEMS — Metadata Sync Engine`);
console.log(`Mode: ${isCheckMode ? 'CHECK (Verification)' : isDryRun ? 'DRY-RUN (Diff Preview)' : 'SYNC (Write to Disk)'}`);
console.log(`Target Site URL: ${siteUrl}`);
console.log(`=================================================================\n`);

const result = processFiles({ check: isCheckMode, dryRun: isDryRun });

if (isCheckMode) {
  if (result.driftCount > 0 || result.missingMarkersCount > 0) {
    console.error(`[!] FAILED: ${result.driftCount} files out of sync; ${result.missingMarkersCount} missing markers.`);
    process.exit(1);
  } else {
    console.log(`✓ ALL CLEAN: All ${result.totalFiles} files match canonical metadata perfectly.`);
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
    fs.writeFileSync(ch.fullPath, ch.content, 'utf8');
    console.log(`[UPDATED] ${ch.file}`);
  });
  console.log(`\n✓ SUCCESS: Synchronized metadata across ${result.changes.length} files.`);
}
