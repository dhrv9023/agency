#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, 'public');
const cssDir = path.join(publicDir, 'css');
const templatesDir = path.join(projectRoot, 'templates');

function walk(dir, exts = ['.html', '.css', '.js', '.json']) {
  let res = [];
  if (!fs.existsSync(dir)) return res;
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (['node_modules', '.next', '.git', 'archive', 'dist', 'dev', 'demos'].includes(item.name)) continue;
      res.push(...walk(p, exts));
    } else if (exts.some(e => item.name.endsWith(e))) {
      if (item.name.startsWith('admin') || item.name.includes('admin-portal') || item.name === 'brand-identity.html') continue;
      res.push(p);
    }
  }
  return res;
}

const files = walk(publicDir).concat(walk(templatesDir));

// Regex definitions
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
const emDashRegex = /—| -- /;
const t15Regex = /\b(not just|isn't|it's not|not only|more than a|no [a-zA-Z]+, no [a-zA-Z]+)\b/i;

const violations = [];

for (const file of files) {
  const rel = path.relative(projectRoot, file);
  const isCss = file.endsWith('.css');
  const isHtml = file.endsWith('.html');
  const isMeta = file.endsWith('meta.json');

  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    // Skip CSS comment lines
    if (isCss && (trimmed.startsWith('/*') || trimmed.startsWith('*'))) return;

    // T01: Gradients (in public css or inline styles)
    if (isCss && /(linear-gradient|radial-gradient|conic-gradient|background-clip:\s*text)/i.test(line)) {
      violations.push({ rule: 'T01', sev: '🔴', count: 1, loc: `${rel}:${lineNum}`, desc: 'Decorative gradient found' });
    }

    // T02: FontAwesome or generic icons
    if ((isHtml || isCss) && /(fa-[a-z0-9-]+|font-awesome|<i class=["'][^"']*fa-)/i.test(line)) {
      violations.push({ rule: 'T02', sev: '🔴', count: 1, loc: `${rel}:${lineNum}`, desc: 'FontAwesome / generic icon found' });
    }

    // T05: Drop shadows and glows (excluding explicit resets like : none)
    if (isCss && /(box-shadow|filter:\s*drop-shadow|text-shadow)/i.test(line) && !/:\s*none\s*;?/i.test(line)) {
      violations.push({ rule: 'T05', sev: '🔴', count: 1, loc: `${rel}:${lineNum}`, desc: 'Drop shadow or glow effect found' });
    }

    // T07: Emojis
    if ((isHtml || isMeta) && emojiRegex.test(line)) {
      violations.push({ rule: 'T07', sev: '🔴', count: 1, loc: `${rel}:${lineNum}`, desc: 'Unicode emoji found in visible text or metadata' });
    }

    // T08: Liquid glass / backdrop-filter blur
    if (isCss && /backdrop-filter:\s*blur/i.test(line)) {
      violations.push({ rule: 'T08', sev: '🔴', count: 1, loc: `${rel}:${lineNum}`, desc: 'Glassmorphism backdrop-filter blur found' });
    }

    // T09: Em dashes (U+2014 or " -- ")
    if ((isHtml || isMeta) && emDashRegex.test(line)) {
      violations.push({ rule: 'T09', sev: '🔴', count: 1, loc: `${rel}:${lineNum}`, desc: 'Em dash (—) or double hyphen (--) found' });
    }

    // T12: Colored left stripe
    if (isCss && /border-left:\s*[0-9]+px\s+solid\s+(var\(--accent\)|#[0-9a-fA-F]+)/i.test(line)) {
      violations.push({ rule: 'T12', sev: '🔴', count: 1, loc: `${rel}:${lineNum}`, desc: 'Colored left stripe border found' });
    }

    // T14: Fake terminal chrome
    if (isHtml && /(terminal-dots|window-dots|mac-dots)/i.test(line)) {
      violations.push({ rule: 'T14', sev: '🔴', count: 1, loc: `${rel}:${lineNum}`, desc: 'Fake terminal window mockup found' });
    }

    // T15: "It's not X, it's Y" copy
    if (isHtml && t15Regex.test(line)) {
      violations.push({ rule: 'T15', sev: '🔴', count: 1, loc: `${rel}:${lineNum}`, desc: 'AI contrast trope ("not just / it\'s not") found' });
    }

    // T16: Checkmark bullets
    if (isHtml && /(&check;|fa-check|<span class=["']out-check["']>)/i.test(line)) {
      violations.push({ rule: 'T16', sev: '🔴', count: 1, loc: `${rel}:${lineNum}`, desc: 'Checkmark bullet glyph found' });
    }

    // T22: Dot grids / linear grid backgrounds
    if (isCss && /(radial-gradient\(circle.*transparent\s*70%\)|grid-line-bg)/i.test(line)) {
      violations.push({ rule: 'T22', sev: '🔴', count: 1, loc: `${rel}:${lineNum}`, desc: 'Dot grid or decorative grid background found' });
    }

    // T23: Sparkle / magic wand icons
    if ((isHtml || isCss) && /(fa-sparkles|sparkle-icon|ai-star|fa-wand)/i.test(line)) {
      violations.push({ rule: 'T23', sev: '🔴', count: 1, loc: `${rel}:${lineNum}`, desc: 'Sparkle / magic wand icon found' });
    }

    // T24: Sliding / animated hover arrows
    if (isCss && /transform:\s*translateX/i.test(line) && /hover/i.test(line)) {
      violations.push({ rule: 'T24', sev: '🔴', count: 1, loc: `${rel}:${lineNum}`, desc: 'Sliding hover arrow animation found' });
    }

    // T27: Hover lift / scale animations
    if (isCss && /:hover[^{]*\{[^}]*translateY\(-/i.test(line)) {
      violations.push({ rule: 'T27', sev: '🔴', count: 1, loc: `${rel}:${lineNum}`, desc: 'Hover translateY card lift animation found' });
    }

    // T28: Neon color glows
    if (isCss && /box-shadow:.*(#00f0ff|rgba\(0,\s*240,\s*255)/i.test(line)) {
      violations.push({ rule: 'T28', sev: '🔴', count: 1, loc: `${rel}:${lineNum}`, desc: 'High-chroma neon glow effect found' });
    }
  });
}

console.log('================================================================');
console.log('           VARAH SYSTEMS — AI-TELL SCAN ENFORCEMENT             ');
console.log('================================================================');

if (violations.length === 0) {
  console.log('✅ PASS: Zero AI-tell violations detected across site assets.');
  process.exit(0);
} else {
  console.log(`Rule | Severity | Count | Location | Description`);
  console.log(`----------------------------------------------------------------`);
  violations.slice(0, 50).forEach(v => {
    console.log(`${v.rule} | ${v.sev} | ${v.count} | ${v.loc} | ${v.desc}`);
  });
  if (violations.length > 50) {
    console.log(`... and ${violations.length - 50} more violations.`);
  }
  console.log(`----------------------------------------------------------------`);
  const redViolations = violations.filter(v => v.sev === '🔴');
  console.log(`Total Violations: ${violations.length} (${redViolations.length} 🔴 critical build-blockers)`);
  if (process.argv.includes('--strict')) {
    process.exit(1);
  }
}
