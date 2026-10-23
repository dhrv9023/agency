#!/usr/bin/env node

/**
 * ==============================================================================
 * VARAH SYSTEMS — Semantic Feedback Token Contrast Auditor (WCAG 2.1 AA/AAA)
 * ==============================================================================
 * Computes exact relative luminance and contrast ratios across base backgrounds
 * and alpha-blended tint surfaces in both Light and Dark themes.
 */

function sRGBtoLin(colorVal) {
  return colorVal <= 0.04045 ? colorVal / 12.92 : Math.pow((colorVal + 0.055) / 1.055, 2.4);
}

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const num = parseInt(hex, 16);
  return [num >> 16, (num >> 8) & 255, num & 255];
}

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(v => v / 255);
  return 0.2126 * sRGBtoLin(r) + 0.7152 * sRGBtoLin(g) + 0.0722 * sRGBtoLin(b);
}

function contrast(hex1, hex2) {
  const l1 = luminance(hex1);
  const l2 = luminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function blend(fgHex, fgAlpha, bgHex) {
  const [r1, g1, b1] = hexToRgb(fgHex);
  const [r2, g2, b2] = hexToRgb(bgHex);
  const r = Math.round(r1 * fgAlpha + r2 * (1 - fgAlpha));
  const g = Math.round(g1 * fgAlpha + g2 * (1 - fgAlpha));
  const b = Math.round(b1 * fgAlpha + b2 * (1 - fgAlpha));
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

console.log('=================================================================');
console.log('VARAH SYSTEMS — Semantic Token Contrast Audit');
console.log('=================================================================\n');

const lightBg = '#F3F3F0';
const darkBg = '#050608';

const tokens = {
  light: {
    base: lightBg,
    errorText: '#b91c1c', // Red-700
    errorSurface: blend('#b91c1c', 0.08, lightBg),
    errorBorder: '#b91c1c',
    successText: '#166534', // Green-800
    successSurface: blend('#166534', 0.08, lightBg),
    successBorder: '#166534'
  },
  dark: {
    base: darkBg,
    errorText: '#fca5a5', // Red-300
    errorSurface: blend('#ef4444', 0.12, darkBg),
    errorBorder: '#ef4444',
    successText: '#86efac', // Green-300
    successSurface: blend('#22c55e', 0.12, darkBg),
    successBorder: '#22c55e'
  }
};

const checks = [
  { theme: 'LIGHT', name: 'Error text on base (#F3F3F0)', fg: tokens.light.errorText, bg: tokens.light.base },
  { theme: 'LIGHT', name: 'Error text on surface tint', fg: tokens.light.errorText, bg: tokens.light.errorSurface },
  { theme: 'LIGHT', name: 'Success text on base (#F3F3F0)', fg: tokens.light.successText, bg: tokens.light.base },
  { theme: 'LIGHT', name: 'Success text on surface tint', fg: tokens.light.successText, bg: tokens.light.successSurface },
  { theme: 'DARK',  name: 'Error text on base (#050608)', fg: tokens.dark.errorText, bg: tokens.dark.base },
  { theme: 'DARK',  name: 'Error text on surface tint', fg: tokens.dark.errorText, bg: tokens.dark.errorSurface },
  { theme: 'DARK',  name: 'Success text on base (#050608)', fg: tokens.dark.successText, bg: tokens.dark.base },
  { theme: 'DARK',  name: 'Success text on surface tint', fg: tokens.dark.successText, bg: tokens.dark.successSurface }
];

let allPassed = true;
checks.forEach(c => {
  const ratio = contrast(c.fg, c.bg);
  const ratioStr = ratio.toFixed(2) + ':1';
  const pass = ratio >= 4.5;
  if (!pass) allPassed = false;
  console.log(`[${c.theme}] ${c.name.padEnd(35)} -> ${ratioStr.padStart(8)} | ${pass ? '✓ PASS (WCAG AA)' : '❌ FAIL'}`);
});

console.log('\nAudit Result: ' + (allPassed ? 'ALL TOKENS PASS WCAG 2.1 AA' : 'FAILED'));
process.exit(allPassed ? 0 : 1);
