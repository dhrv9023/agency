#!/usr/bin/env tsx

/**
 * ==============================================================================
 * VARAH SYSTEMS — Playwright Sticky Mobile CTA Verification (Workstream 12)
 * ==============================================================================
 * Tests:
 *   1. Mobile Viewport (390x844):
 *      - Sticky CTA is visible at screen bottom.
 *      - Link points to contact.html with text "Start a Project".
 *      - Dismiss button has >= 44x44 hit area and accessible aria-label.
 *      - body has .has-sticky-cta class and bottom padding.
 *   2. Dismissal Action:
 *      - Clicking dismiss button hides the bar and collapses body padding.
 *      - Stores varah_cta_dismissed in sessionStorage.
 *   3. Session Persistence:
 *      - On reload, sticky bar remains dismissed.
 *   4. Desktop Viewport (1280x800):
 *      - Sticky CTA is display: none.
 *   5. Contact Page Suppression:
 *      - Sticky CTA is suppressed on contact.html.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const PORT = 3850;
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url || '/', `http://localhost:${PORT}`);
  let reqPath = parsedUrl.pathname;
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  const fullPath = path.join(PUBLIC_DIR, reqPath);
  if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }

  const ext = path.extname(fullPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(fullPath).pipe(res);
});

async function runTest() {
  await new Promise<void>((resolve) => server.listen(PORT, resolve));
  const browser = await chromium.launch({ headless: true });

  console.log('=============================================================================');
  console.log('VARAH SYSTEMS — Sticky Mobile CTA Playwright Test Suite');
  console.log(`Test Server: http://localhost:${PORT}`);
  console.log('=============================================================================\n');

  let allPassed = true;

  try {
    // --------------------------------------------------------------------------
    // Test 1: Mobile Display & Dimensions
    // --------------------------------------------------------------------------
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 }, // iPhone 14 dimensions
    });
    const page = await context.newPage();
    await page.goto(`http://localhost:${PORT}/solutions.html`);
    await page.waitForTimeout(300);

    const ctaVisible = await page.isVisible('#sticky-mobile-cta');
    const ctaText = await page.textContent('.sticky-mobile-cta-btn');
    const ctaHref = await page.getAttribute('.sticky-mobile-cta-btn', 'href');
    const dismissBox = await page.locator('#sticky-cta-dismiss-btn').boundingBox();
    const dismissLabel = await page.getAttribute('#sticky-cta-dismiss-btn', 'aria-label');
    const bodyHasClass = await page.evaluate(() => document.body.classList.contains('has-sticky-cta'));

    const test1Pass =
      ctaVisible &&
      ctaText?.trim() === 'Start a Project' &&
      ctaHref?.includes('contact.html') &&
      dismissBox !== null &&
      dismissBox.width >= 44 &&
      dismissBox.height >= 44 &&
      Boolean(dismissLabel) &&
      bodyHasClass;

    console.log(`[TEST 1] Mobile Display & Hit Target:`);
    console.log(`         Visible: ${ctaVisible} | CTA Text: "${ctaText?.trim()}" | Href: ${ctaHref}`);
    console.log(`         Dismiss Box: ${dismissBox?.width}x${dismissBox?.height}px (>= 44x44) | Aria-label: "${dismissLabel}"`);
    console.log(`         Body has padding class: ${bodyHasClass}`);
    console.log(`         Result: ${test1Pass ? '✓ PASS' : '✗ FAIL'}\n`);
    if (!test1Pass) allPassed = false;

    // --------------------------------------------------------------------------
    // Test 2: Dismissal & Padding Collapse
    // --------------------------------------------------------------------------
    await page.click('#sticky-cta-dismiss-btn');
    await page.waitForTimeout(200);

    const ctaVisibleAfterDismiss = await page.isVisible('#sticky-mobile-cta');
    const bodyClassAfterDismiss = await page.evaluate(() => document.body.classList.contains('has-sticky-cta'));
    const dismissedInStorage = await page.evaluate(() => sessionStorage.getItem('varah_cta_dismissed'));

    const test2Pass = !ctaVisibleAfterDismiss && !bodyClassAfterDismiss && dismissedInStorage === 'true';
    console.log(`[TEST 2] Dismissal & Padding Collapse:`);
    console.log(`         Visible after dismiss: ${ctaVisibleAfterDismiss}`);
    console.log(`         Body has-sticky-cta class: ${bodyClassAfterDismiss}`);
    console.log(`         sessionStorage['varah_cta_dismissed']: ${dismissedInStorage}`);
    console.log(`         Result: ${test2Pass ? '✓ PASS' : '✗ FAIL'}\n`);
    if (!test2Pass) allPassed = false;

    // --------------------------------------------------------------------------
    // Test 3: Reload Persistence
    // --------------------------------------------------------------------------
    await page.reload();
    await page.waitForTimeout(300);

    const ctaVisibleOnReload = await page.isVisible('#sticky-mobile-cta');
    const bodyClassOnReload = await page.evaluate(() => document.body.classList.contains('has-sticky-cta'));

    const test3Pass = !ctaVisibleOnReload && !bodyClassOnReload;
    console.log(`[TEST 3] Reload Persistence:`);
    console.log(`         Visible on reload: ${ctaVisibleOnReload}`);
    console.log(`         Body has padding class on reload: ${bodyClassOnReload}`);
    console.log(`         Result: ${test3Pass ? '✓ PASS' : '✗ FAIL'}\n`);
    if (!test3Pass) allPassed = false;
    await context.close();

    // --------------------------------------------------------------------------
    // Test 4: Desktop Hidden
    // --------------------------------------------------------------------------
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
    });
    const desktopPage = await desktopContext.newPage();
    await desktopPage.goto(`http://localhost:${PORT}/solutions.html`);
    await desktopPage.waitForTimeout(300);

    const desktopVisible = await desktopPage.isVisible('#sticky-mobile-cta');
    const test4Pass = !desktopVisible;
    console.log(`[TEST 4] Desktop Viewport Hidden (>768px):`);
    console.log(`         Visible on desktop: ${desktopVisible}`);
    console.log(`         Result: ${test4Pass ? '✓ PASS' : '✗ FAIL'}\n`);
    if (!test4Pass) allPassed = false;
    await desktopContext.close();

    // --------------------------------------------------------------------------
    // Test 5: Contact Page Suppression
    // --------------------------------------------------------------------------
    const contactContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
    });
    const contactPage = await contactContext.newPage();
    await contactPage.goto(`http://localhost:${PORT}/contact.html`);
    await contactPage.waitForTimeout(300);

    const contactVisible = await contactPage.isVisible('#sticky-mobile-cta');
    const test5Pass = !contactVisible;
    console.log(`[TEST 5] Contact Page Suppression:`);
    console.log(`         Visible on contact.html: ${contactVisible}`);
    console.log(`         Result: ${test5Pass ? '✓ PASS' : '✗ FAIL'}\n`);
    if (!test5Pass) allPassed = false;
    await contactContext.close();

  } finally {
    await browser.close();
    server.close();
  }

  if (allPassed) {
    console.log('✓ SUCCESS: All 5 Sticky Mobile CTA verification scenarios passed cleanly.');
    process.exit(0);
  } else {
    console.error('✗ FAIL: One or more Sticky Mobile CTA tests failed.');
    process.exit(1);
  }
}

runTest().catch((err) => {
  console.error(err);
  process.exit(1);
});
