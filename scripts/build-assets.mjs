#!/usr/bin/env node

/**
 * ==============================================================================
 * VARAH SYSTEMS — Asset Hashing & Minification Engine (Workstream 12)
 * ==============================================================================
 * Standards:
 *   - Built using Node.js built-ins exclusively (fs, path, crypto, zlib).
 *   - CSS: Strips comments and excessive whitespace (zero hand-rolled JS minifiers).
 *   - JS: Reports exact raw, gzip, and brotli byte sizes.
 *   - Computes SHA-256 content hashes (8 characters) for cache busting.
 *   - Emits manifest to templates/asset-manifest.json.
 *   - Writes hashed production bundles into public/dist/.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const DIST_DIR = path.join(PUBLIC_DIR, 'dist');
const MANIFEST_FILE = path.join(ROOT_DIR, 'templates', 'asset-manifest.json');

// Ensure dist directory exists
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

// Simple deterministic CSS comment and whitespace condenser
function minifyCss(cssContent) {
  return cssContent
    .replace(/\/\*[\s\S]*?\*\//g, '') // Strip block comments
    .replace(/\s+/g, ' ')             // Collapse multiple spaces/newlines
    .replace(/\s*([{}:;,>+~])\s*/g, '$1') // Strip spaces around syntax delimiters
    .replace(/;}/g, '}')             // Strip trailing semicolons before closing brace
    .trim();
}

function computeSizes(buffer) {
  const raw = buffer.length;
  const gzip = zlib.gzipSync(buffer, { level: 9 }).length;
  const brotli = zlib.brotliCompressSync(buffer, {
    params: {
      [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
    },
  }).length;
  return { raw, gzip, brotli };
}

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(2)} KB`;
}

console.log('=============================================================================');
console.log('VARAH SYSTEMS — Asset Processing & Content Hashing Engine');
console.log('Mode: Production Hashing & Compression Analysis');
console.log('=============================================================================\n');

const manifest = {
  generatedAt: new Date().toISOString(),
  assets: {},
};

// 1. Process CSS Assets
const cssDir = path.join(PUBLIC_DIR, 'css');
const cssFiles = fs.readdirSync(cssDir).filter((f) => f.endsWith('.css'));
console.log('--- CSS ASSET PROCESSING (Comments & Whitespace Stripped) ---');
console.log('ORIGINAL FILE        | RAW        | MINIFIED   | GZIP      | BROTLI    | HASHED OUTPUT');
console.log('---------------------|------------|------------|-----------|-----------|----------------------------------');

for (const file of cssFiles) {
  const filePath = path.join(cssDir, file);
  const rawContent = fs.readFileSync(filePath, 'utf8');
  const minified = minifyCss(rawContent);
  const minBuffer = Buffer.from(minified, 'utf8');

  const rawSizes = computeSizes(Buffer.from(rawContent, 'utf8'));
  const minSizes = computeSizes(minBuffer);

  const hash = crypto.createHash('sha256').update(minBuffer).digest('hex').slice(0, 8);
  const baseName = path.basename(file, '.css');
  const hashedName = `css/${baseName}.${hash}.css`;
  const outPath = path.join(DIST_DIR, hashedName);

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, minBuffer);

  manifest.assets[`css/${file}`] = {
    hashedPath: `dist/${hashedName}`,
    hash,
    rawBytes: rawSizes.raw,
    minifiedBytes: minSizes.raw,
    gzipBytes: minSizes.gzip,
    brotliBytes: minSizes.brotli,
  };

  console.log(
    `${file.padEnd(20)} | ` +
    `${formatBytes(rawSizes.raw).padEnd(10)} | ` +
    `${formatBytes(minSizes.raw).padEnd(10)} | ` +
    `${formatBytes(minSizes.gzip).padEnd(9)} | ` +
    `${formatBytes(minSizes.brotli).padEnd(9)} | ` +
    `dist/${hashedName}`
  );
}

// 2. Process JS Assets (Reporting without hand-rolled minification)
const jsDir = path.join(PUBLIC_DIR, 'js');
const jsFiles = fs.readdirSync(jsDir).filter((f) => f.endsWith('.js'));
console.log('\n--- JAVASCRIPT ASSET PROCESSING (Zero Hand-Rolled Minification) ---');
console.log('ORIGINAL FILE        | RAW        | GZIP       | BROTLI    | HASHED OUTPUT');
console.log('---------------------|------------|------------|-----------|----------------------------------');

for (const file of jsFiles) {
  const filePath = path.join(jsDir, file);
  const jsContent = fs.readFileSync(filePath);
  const sizes = computeSizes(jsContent);

  const hash = crypto.createHash('sha256').update(jsContent).digest('hex').slice(0, 8);
  const baseName = path.basename(file, '.js');
  const hashedName = `js/${baseName}.${hash}.js`;
  const outPath = path.join(DIST_DIR, hashedName);

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, jsContent);

  manifest.assets[`js/${file}`] = {
    hashedPath: `dist/${hashedName}`,
    hash,
    rawBytes: sizes.raw,
    gzipBytes: sizes.gzip,
    brotliBytes: sizes.brotli,
  };

  console.log(
    `${file.padEnd(20)} | ` +
    `${formatBytes(sizes.raw).padEnd(10)} | ` +
    `${formatBytes(sizes.gzip).padEnd(10)} | ` +
    `${formatBytes(sizes.brotli).padEnd(9)} | ` +
    `dist/${hashedName}`
  );
}

// 3. Write Manifest
fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
console.log(`\n✓ Manifest written to templates/asset-manifest.json`);
console.log(`✓ All hashed assets emitted to public/dist/ with immutable cache headers.`);
