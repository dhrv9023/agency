#!/usr/bin/env node

/**
 * ============================================================================
 * VARAH SYSTEMS — Vector & Raster Icon, Favicon & OG Social Asset Generator
 * ============================================================================
 * Standards:
 *   - Official Concept 1: The Binary Convergent "V" (Dual Routing Nexus)
 *   - Playwright Chromium (devDependency) for pixel-perfect raster rendering.
 *   - Zero new npm packages.
 *   - deviceScaleFactor: 1.
 *   - Native Node.js Buffer-based multi-resolution ICO packing (16, 32, 48).
 *   - Maskable icon with #040508 background and safe zone bounding.
 *   - All OG images strictly < 300KB.
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const ASSETS_DIR = path.join(PUBLIC_DIR, 'assets');

// 1. Vector SVG Favicon with dark/light mode preference
const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" fill="none">
  <title>VARAH SYSTEMS Icon</title>
  <style>
    @media (prefers-color-scheme: light) {
      .beam-left { fill: #64748b; }
      .beam-right { fill: #040508; }
      .nexus-core { fill: #0090a8; }
    }
    @media (prefers-color-scheme: dark) {
      .beam-left { fill: #94a3b8; }
      .beam-right { fill: #ffffff; }
      .nexus-core { fill: #00f0ff; }
    }
  </style>
  <polygon class="beam-left" points="2,4 16,4 27,39 16,39" fill="#94a3b8" />
  <polygon class="beam-right" points="46,4 32,4 21,39 32,39" fill="#ffffff" />
  <polygon class="nexus-core" points="19.5,38 24,45 28.5,38 24,31" fill="#00f0ff" />
  <rect class="nexus-core" x="22.5" y="8" width="3" height="20" rx="1.5" fill="#00f0ff" />
</svg>`;

// 2. Generate Master OG SVG (1200x630, brand colors, typographic layout, flat design)
function generateOgSvg(headline, subline, badge = 'SYSTEM ARCHITECTURE 2.0') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <style>
      .bg { fill: #040508; }
      .rule { stroke: rgba(255, 255, 255, 0.1); stroke-width: 1; }
      .brand { font-family: 'Inter', -apple-system, sans-serif; font-size: 26px; font-weight: 800; fill: #ffffff; letter-spacing: 0.12em; }
      .eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 700; fill: #00f0ff; letter-spacing: 0.16em; }
      .title { font-family: 'Inter', -apple-system, sans-serif; font-size: 52px; font-weight: 800; fill: #ffffff; letter-spacing: -0.03em; line-height: 1.15; }
      .desc { font-family: 'Inter', -apple-system, sans-serif; font-size: 24px; font-weight: 400; fill: #94a3b8; line-height: 1.5; }
      .badge { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; fill: #94a3b8; letter-spacing: 0.08em; }
    </style>
  </defs>

  <!-- Deep Obsidian Background -->
  <rect width="1200" height="630" class="bg" />

  <!-- Top Header Row -->
  <g transform="translate(100, 100)">
    <!-- Official Concept 1 Mark -->
    <g transform="translate(0, -8) scale(0.85)">
      <polygon points="2,4 16,4 27,39 16,39" fill="#94a3b8" />
      <polygon points="46,4 32,4 21,39 32,39" fill="#ffffff" />
      <polygon points="19.5,38 24,45 28.5,38 24,31" fill="#00f0ff" />
      <rect x="22.5" y="8" width="3" height="20" rx="1.5" fill="#00f0ff" />
    </g>
    <text x="56" y="24" class="brand">VARAH SYSTEMS</text>
    <text x="1000" y="22" text-anchor="end" class="badge">${badge}</text>
  </g>

  <!-- Hairline Divider -->
  <line x1="100" y1="160" x2="1100" y2="160" class="rule" />

  <!-- Core Typographic Content (Central Zone) -->
  <g transform="translate(100, 260)">
    <text x="0" y="0" class="title">${headline}</text>
    <text x="0" y="80" class="desc">${subline}</text>
  </g>

  <!-- Bottom Capability Strip -->
  <line x1="100" y1="480" x2="1100" y2="480" class="rule" />
  <g transform="translate(100, 520)">
    <text x="0" y="0" class="eyebrow">WORKFLOWS  •  AGENTS  •  VOICE TELEPHONY  •  DOC INTELLIGENCE</text>
  </g>
</svg>`;
}

// 3. Multi-resolution ICO Packer (zero-dependency Buffer builder)
function createIco(pngBuffers) {
  const count = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let offset = headerSize + count * dirEntrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(count, 4); // image count

  const entries = [];
  for (const img of pngBuffers) {
    const entry = Buffer.alloc(dirEntrySize);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // image size
    entry.writeUInt32LE(offset, 12); // image offset
    entries.push(entry);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers.map((b) => b.buffer)]);
}

// Concept 1 Mark renderer for square icons
function getIconMarkSvg(size, paddingRatio = 0.15) {
  const scale = (size * (1 - paddingRatio * 2)) / 48;
  const offset = size * paddingRatio;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <rect width="${size}" height="${size}" fill="#040508" />
    <g transform="translate(${offset}, ${offset}) scale(${scale})">
      <polygon points="2,4 16,4 27,39 16,39" fill="#94a3b8" />
      <polygon points="46,4 32,4 21,39 32,39" fill="#ffffff" />
      <polygon points="19.5,38 24,45 28.5,38 24,31" fill="#00f0ff" />
      <rect x="22.5" y="8" width="3" height="20" rx="1.5" fill="#00f0ff" />
    </g>
  </svg>`;
}

async function main() {
  console.log('=================================================================');
  console.log('VARAH SYSTEMS — Asset & Icon Generation Pipeline');
  console.log('=================================================================\n');

  // 1. Write vector icon.svg
  fs.writeFileSync(path.join(PUBLIC_DIR, 'icon.svg'), ICON_SVG, 'utf8');
  console.log('✓ Created public/icon.svg (Adaptive Dark/Light Vector Favicon)');

  // 2. Write Web App Manifest
  const manifest = {
    name: 'VARAH SYSTEMS — Intelligent Systems That Scale Your Business',
    short_name: 'VARAH',
    start_url: '/',
    display: 'standalone',
    background_color: '#040508',
    theme_color: '#040508',
    icons: [
      {
        src: 'icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: 'icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: 'maskable-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ]
  };
  fs.writeFileSync(path.join(PUBLIC_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
  console.log('✓ Created public/manifest.json');

  // 3. Write OG SVG Templates
  const ogDefaultSvg = generateOgSvg(
    'Intelligent Systems That Scale Your Business',
    'We eliminate repetitive operational bottlenecks with AI automation.'
  );
  fs.writeFileSync(path.join(ASSETS_DIR, 'og-default.svg'), ogDefaultSvg, 'utf8');

  const ogLeadSvg = generateOgSvg(
    'Autonomous Inbound Lead Qualification',
    'Case Study 01: 60-second response times and 22% recovered pipeline.',
    'CASE STUDY // 01'
  );
  fs.writeFileSync(path.join(ASSETS_DIR, 'og-lead-qualification.svg'), ogLeadSvg, 'utf8');

  const ogInvoiceSvg = generateOgSvg(
    '3-Way Invoice Reconciliation & Extraction',
    'Case Study 02: 2,400+ monthly vendor bills parsed with ERP line matching.',
    'CASE STUDY // 02'
  );
  fs.writeFileSync(path.join(ASSETS_DIR, 'og-invoice-processing.svg'), ogInvoiceSvg, 'utf8');

  const ogKnowledgeSvg = generateOgSvg(
    'Enterprise Grounded Knowledge Assistant',
    'Case Study 03: Internal vector RAG connecting SOPs and codebases with zero hallucination.',
    'CASE STUDY // 03'
  );
  fs.writeFileSync(path.join(ASSETS_DIR, 'og-knowledge-assistant.svg'), ogKnowledgeSvg, 'utf8');

  console.log('✓ Created 4 SVG templates in public/assets/');

  // 4. Render Raster Images using Playwright Chromium
  console.log('\nLaunching Chromium to render raster assets...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ deviceScaleFactor: 1 });

  const interFontBase64 = fs.readFileSync(path.join(PUBLIC_DIR, 'assets', 'fonts', 'Inter-Variable-Latin.woff2')).toString('base64');
  const jbFontBase64 = fs.readFileSync(path.join(PUBLIC_DIR, 'assets', 'fonts', 'JetBrainsMono-Variable-Latin.woff2')).toString('base64');

  async function renderSvgToPng(svgContent, width, height, outputPath) {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @font-face {
      font-family: 'Inter';
      src: url('data:font/woff2;base64,${interFontBase64}') format('woff2');
      font-weight: 100 900;
    }
    @font-face {
      font-family: 'JetBrains Mono';
      src: url('data:font/woff2;base64,${jbFontBase64}') format('woff2');
      font-weight: 100 800;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: ${width}px; height: ${height}px; overflow: hidden; background: #040508; }
    svg { width: ${width}px; height: ${height}px; display: block; }
  </style>
</head>
<body>
  ${svgContent}
</body>
</html>`;

    await page.setViewportSize({ width, height });
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: outputPath, type: 'png' });
  }

  // Render OG Images
  await renderSvgToPng(ogDefaultSvg, 1200, 630, path.join(ASSETS_DIR, 'og-default.png'));
  await renderSvgToPng(ogLeadSvg, 1200, 630, path.join(ASSETS_DIR, 'og-lead-qualification.png'));
  await renderSvgToPng(ogInvoiceSvg, 1200, 630, path.join(ASSETS_DIR, 'og-invoice-processing.png'));
  await renderSvgToPng(ogKnowledgeSvg, 1200, 630, path.join(ASSETS_DIR, 'og-knowledge-assistant.png'));
  console.log('✓ Rendered 4 OG images (1200x630 PNG) in public/assets/');

  // 180x180 apple-touch-icon
  await renderSvgToPng(getIconMarkSvg(180, 0.12), 180, 180, path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
  console.log('✓ Rendered public/apple-touch-icon.png (180x180)');

  // 192x192 icon
  await renderSvgToPng(getIconMarkSvg(192, 0.12), 192, 192, path.join(PUBLIC_DIR, 'icon-192.png'));
  console.log('✓ Rendered public/icon-192.png (192x192)');

  // 512x512 icon
  await renderSvgToPng(getIconMarkSvg(512, 0.12), 512, 512, path.join(PUBLIC_DIR, 'icon-512.png'));
  console.log('✓ Rendered public/icon-512.png (512x512)');

  // 512x512 maskable-icon
  await renderSvgToPng(getIconMarkSvg(512, 0.18), 512, 512, path.join(PUBLIC_DIR, 'maskable-icon.png'));
  console.log('✓ Rendered public/maskable-icon.png (512x512, 80% safe zone bounded)');

  // Favicon resolutions (16, 32, 48)
  await page.setViewportSize({ width: 16, height: 16 });
  await page.setContent(getIconMarkSvg(16, 0.08));
  const buf16 = await page.screenshot({ type: 'png' });

  await page.setViewportSize({ width: 32, height: 32 });
  await page.setContent(getIconMarkSvg(32, 0.08));
  const buf32 = await page.screenshot({ type: 'png' });

  await page.setViewportSize({ width: 48, height: 48 });
  await page.setContent(getIconMarkSvg(48, 0.08));
  const buf48 = await page.screenshot({ type: 'png' });

  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: buf16 },
    { width: 32, height: 32, buffer: buf32 },
    { width: 48, height: 48, buffer: buf48 }
  ]);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), icoBuffer);
  console.log('✓ Created public/favicon.ico (Multi-resolution 16/32/48 container)');

  await browser.close();

  // Verify file sizes
  const ogStats = fs.statSync(path.join(ASSETS_DIR, 'og-default.png'));
  const ogKb = (ogStats.size / 1024).toFixed(1);
  console.log(`\nVerified og-default.png size: ${ogKb} KB (< 300KB limit: ${ogStats.size < 300 * 1024})`);
  console.log('\n✓ Asset generation complete!');
}

main().catch((err) => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
