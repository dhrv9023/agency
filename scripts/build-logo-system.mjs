#!/usr/bin/env node
/**
 * scripts/build-logo-system.mjs
 * 
 * Generates the official production SVG logo suite for VARAH SYSTEMS:
 * - Mark: Concept 1 — The Binary Convergent "V" (Dual Routing Nexus)
 * - Wordmark: Extracted real vector glyphs from official Inter-Bold (SIL OFL)
 *             and JetBrains Mono (SIL OFL) via opentype.js.
 * - Outlined <path> letterforms only — NO live <text> elements.
 * - Zero gradients, zero glow filters, zero raster elements, zero badge containers.
 * - Pure token palette: #040508 (obsidian), #00f0ff (cyan), #ffffff (white), #94a3b8 (slate).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Load Fonts
const interTtfPath = path.join(rootDir, 'fonts-src', 'Inter-Bold.ttf');
const jbTtfPath = path.join(rootDir, 'fonts-src', 'JetBrainsMono-Variable.ttf');

const interBuffer = fs.readFileSync(interTtfPath);
const interFont = opentype.parse(interBuffer.buffer);

const jbBuffer = fs.readFileSync(jbTtfPath);
const jbFont = opentype.parse(jbBuffer.buffer);

console.log('✓ Loaded official font source files: Inter-Bold & JetBrainsMono-Variable');

// 2. Glyph Extraction Helper with deliberate kerning and optical tuning
function extractOutlinedWord(font, word, targetHeight, baselineY, trackingPx, kerningMap = {}) {
  let x = 0;
  const paths = [];
  
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    const glyph = font.charToGlyph(char);
    
    // Apply manual kerning pair if defined
    if (i > 0) {
      const pair = word[i - 1] + char;
      if (kerningMap[pair]) {
        x += kerningMap[pair];
      }
    }
    
    // Extract glyph outline
    const pathObj = glyph.getPath(x, baselineY, targetHeight);
    paths.push({
      char,
      d: pathObj.toPathData(2),
      x,
      width: glyph.advanceWidth * (targetHeight / font.unitsPerEm)
    });
    
    x += glyph.advanceWidth * (targetHeight / font.unitsPerEm) + trackingPx;
  }
  
  const totalWidth = x - trackingPx;
  return { paths, totalWidth };
}

// 3. Extract VARAH (Inter-Bold) and SYSTEMS (JetBrains Mono)
const varahKerning = {
  'VA': -2.2,
  'AR': 0.6,
  'RA': -1.6,
  'AH': 0.6
};

// Horizontal layout: VARAH height 26px, baseline at 34px (vertically centered with 48px mark)
const horizontalVarah = extractOutlinedWord(interFont, 'VARAH', 26, 34, 2.4, varahKerning);

// Horizontal layout: SYSTEMS height 11px, baseline at 33px, tracked wide
const horizontalSystems = extractOutlinedWord(jbFont, 'SYSTEMS', 11, 33, 3.2);

console.log(`✓ Extracted outlined wordmarks: VARAH (w=${horizontalVarah.totalWidth.toFixed(1)}px), SYSTEMS (w=${horizontalSystems.totalWidth.toFixed(1)}px)`);

// 4. Mark Geometry Definitions
function getMarkVectors(colors) {
  return `<!-- Inbound Beam (Left / Slate) -->
    <polygon points="2,4 16,4 27,39 16,39" fill="${colors.left}" />
    <!-- Outbound Beam (Right / Pure White) -->
    <polygon points="46,4 32,4 21,39 32,39" fill="${colors.right}" />
    <!-- Central Transform Nexus (Bottom Diamond / Electric Cyan) -->
    <polygon points="19.5,38 24,45 28.5,38 24,31" fill="${colors.core}" />
    <!-- Nexus Synchronization Channel -->
    <rect x="22.5" y="8" width="3" height="20" rx="1.5" fill="${colors.channel}" />`;
}

function getMonoWhiteVectors() {
  return `<polygon points="2,4 16,4 27,39 16,39" fill="#ffffff" />
    <polygon points="46,4 32,4 21,39 32,39" fill="#ffffff" />
    <polygon points="19.5,38 24,45 28.5,38 24,31" fill="#ffffff" />
    <rect x="22.5" y="8" width="3" height="20" rx="1.5" fill="#ffffff" />`;
}

function getMonoBlackVectors() {
  return `<polygon points="2,4 16,4 27,39 16,39" fill="#000000" />
    <polygon points="46,4 32,4 21,39 32,39" fill="#000000" />
    <polygon points="19.5,38 24,45 28.5,38 24,31" fill="#000000" />
    <rect x="22.5" y="8" width="3" height="20" rx="1.5" fill="#000000" />`;
}

function renderWordmarkGroup(offsetX, varahColor, systemsOffsetX, systemsColor) {
  const varahPaths = horizontalVarah.paths.map(p => `<path d="${p.d}" />`).join('\n      ');
  const systemsPaths = horizontalSystems.paths.map(p => `<path d="${p.d}" />`).join('\n      ');
  
  return `  <!-- VARAH Outlined Wordmark (Inter-Bold) -->
  <g transform="translate(${offsetX}, 0)" fill="${varahColor}">
      ${varahPaths}
  </g>
  <!-- SYSTEMS Outlined Wordmark (JetBrains Mono Bold) -->
  <g transform="translate(${systemsOffsetX}, 0)" fill="${systemsColor}">
      ${systemsPaths}
  </g>`;
}

// 5. Build SVG Files
const outDir = path.join(rootDir, 'public', 'assets', 'logo');
fs.mkdirSync(outDir, { recursive: true });

// A. Standalone Mark (public/assets/logo/logo-mark.svg)
const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" fill="none">
  <title>VARAH SYSTEMS Mark</title>
  ${getMarkVectors({ left: '#94a3b8', right: '#ffffff', core: '#00f0ff', channel: '#00f0ff' })}
</svg>`;
fs.writeFileSync(path.join(outDir, 'logo-mark.svg'), markSvg.trim() + '\n');
fs.writeFileSync(path.join(rootDir, 'public', 'assets', 'logo.svg'), markSvg.trim() + '\n');

// B. Horizontal Full-Color Dark (public/assets/logo/logo-horizontal.svg)
const varahX = 60;
const systemsX = Math.round(varahX + horizontalVarah.totalWidth + 14);
const totalHWidth = Math.round(systemsX + horizontalSystems.totalWidth + 4);

const horizontalSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalHWidth} 48" width="${totalHWidth}" height="48" fill="none">
  <title>VARAH SYSTEMS</title>
  <!-- Mark Nexus -->
  <g>
    ${getMarkVectors({ left: '#94a3b8', right: '#ffffff', core: '#00f0ff', channel: '#00f0ff' })}
  </g>
${renderWordmarkGroup(varahX, '#ffffff', systemsX, '#00f0ff')}
</svg>`;
fs.writeFileSync(path.join(outDir, 'logo-horizontal.svg'), horizontalSvg.trim() + '\n');
fs.writeFileSync(path.join(rootDir, 'public', 'assets', 'logo-full.svg'), horizontalSvg.trim() + '\n');

// C. Horizontal Full-Color Light (public/assets/logo/logo-horizontal-light.svg)
const horizontalLightSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalHWidth} 48" width="${totalHWidth}" height="48" fill="none">
  <title>VARAH SYSTEMS</title>
  <!-- Mark Nexus (Light Mode Contrast Tuning) -->
  <g>
    ${getMarkVectors({ left: '#64748b', right: '#040508', core: '#0090a8', channel: '#0090a8' })}
  </g>
${renderWordmarkGroup(varahX, '#040508', systemsX, '#0090a8')}
</svg>`;
fs.writeFileSync(path.join(outDir, 'logo-horizontal-light.svg'), horizontalLightSvg.trim() + '\n');
fs.writeFileSync(path.join(rootDir, 'public', 'assets', 'logo-full-light.svg'), horizontalLightSvg.trim() + '\n');

// D. Stacked Full-Color Dark (public/assets/logo/logo-stacked.svg)
const stackedVarah = extractOutlinedWord(interFont, 'VARAH', 26, 78, 2.4, varahKerning);
const stackedSystems = extractOutlinedWord(jbFont, 'SYSTEMS', 10, 96, 3.2);

const stackedVarahX = Math.round((180 - stackedVarah.totalWidth) / 2);
const stackedSystemsX = Math.round((180 - stackedSystems.totalWidth) / 2);
const stackedMarkX = Math.round((180 - 48) / 2);

const stackedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 110" width="180" height="110" fill="none">
  <title>VARAH SYSTEMS</title>
  <!-- Mark Nexus Centered -->
  <g transform="translate(${stackedMarkX}, 6)">
    ${getMarkVectors({ left: '#94a3b8', right: '#ffffff', core: '#00f0ff', channel: '#00f0ff' })}
  </g>
  <!-- VARAH Wordmark Centered -->
  <g transform="translate(${stackedVarahX}, 0)" fill="#ffffff">
    ${stackedVarah.paths.map(p => `<path d="${p.d}" />`).join('\n    ')}
  </g>
  <!-- SYSTEMS Wordmark Centered -->
  <g transform="translate(${stackedSystemsX}, 0)" fill="#00f0ff">
    ${stackedSystems.paths.map(p => `<path d="${p.d}" />`).join('\n    ')}
  </g>
</svg>`;
fs.writeFileSync(path.join(outDir, 'logo-stacked.svg'), stackedSvg.trim() + '\n');

// E. Monochrome White (Utility Exception: Pure #FFFFFF)
const monoWhiteSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalHWidth} 48" width="${totalHWidth}" height="48" fill="none">
  <title>VARAH SYSTEMS (Monochrome White)</title>
  <g>
    ${getMonoWhiteVectors()}
  </g>
${renderWordmarkGroup(varahX, '#ffffff', systemsX, '#ffffff')}
</svg>`;
fs.writeFileSync(path.join(outDir, 'logo-mono-white.svg'), monoWhiteSvg.trim() + '\n');
fs.writeFileSync(path.join(rootDir, 'public', 'assets', 'logo-monochrome.svg'), monoWhiteSvg.trim() + '\n');

// F. Monochrome Black (Utility Exception: Pure #000000)
const monoBlackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalHWidth} 48" width="${totalHWidth}" height="48" fill="none">
  <title>VARAH SYSTEMS (Monochrome Black)</title>
  <g>
    ${getMonoBlackVectors()}
  </g>
${renderWordmarkGroup(varahX, '#000000', systemsX, '#000000')}
</svg>`;
fs.writeFileSync(path.join(outDir, 'logo-mono-black.svg'), monoBlackSvg.trim() + '\n');

// G. Favicon (16x16 / 32x32 Grid Aligned public/assets/logo/logo-favicon.svg & public/icon.svg)
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none">
  <title>VARAH SYSTEMS Icon</title>
  <rect width="32" height="32" rx="6" fill="#040508" />
  <g transform="translate(1, 1)">
    <!-- Scaled high-legibility nexus -->
    <polygon points="2,3 11,3 18,25 10,25" fill="#94a3b8" />
    <polygon points="28,3 19,3 12,25 20,25" fill="#ffffff" />
    <polygon points="12,24 15,28 18,24 15,20" fill="#00f0ff" />
    <rect x="14" y="6" width="2" height="13" rx="1" fill="#00f0ff" />
  </g>
</svg>`;
fs.writeFileSync(path.join(outDir, 'logo-favicon.svg'), faviconSvg.trim() + '\n');
fs.writeFileSync(path.join(rootDir, 'public', 'icon.svg'), faviconSvg.trim() + '\n');

// 6. Build Reusable HTML Partials
const templatesDir = path.join(rootDir, 'templates');
fs.mkdirSync(templatesDir, { recursive: true });

fs.writeFileSync(path.join(templatesDir, 'logo-mark.html'), markSvg.trim() + '\n');
fs.writeFileSync(path.join(templatesDir, 'logo-full.html'), horizontalSvg.trim() + '\n');
fs.writeFileSync(path.join(templatesDir, 'logo-stacked.html'), stackedSvg.trim() + '\n');

// Remove redundant old build-logo-system.js if present
if (fs.existsSync(path.join(rootDir, 'scripts', 'build-logo-system.js'))) {
  fs.unlinkSync(path.join(rootDir, 'scripts', 'build-logo-system.js'));
}

console.log('✓ Successfully generated all 7 SVG production logos and 3 HTML partials in public/assets/logo/ and templates/');
