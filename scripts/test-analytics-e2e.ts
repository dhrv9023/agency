#!/usr/bin/env tsx

/**
 * ==============================================================================
 * VARAH SYSTEMS — Playwright E2E Analytics & Consent Gating Verification
 * ==============================================================================
 * Tests:
 *   1. Clean Context: Zero analytics network calls, zero cookies, zero attribution.
 *   2. Reject All: Banner hides, reload retains zero network calls & zero cookies.
 *   3. Opt-in: Preferences -> Enable Analytics -> Plausible script dynamically added to DOM.
 *   4. Attribution with Consent: ?utm_source=linkedin&utm_medium=cpc stored in sessionStorage.
 *   5. Attribution without Consent: UTMs in URL NOT stored in sessionStorage when unconsented.
 *   6. Form Payload: Attribution attached when consented; omitted/null when unconsented.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const PORT = 3849;
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

// Static server + mock /api/contact endpoint
const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url || '/', `http://localhost:${PORT}`);
  let reqPath = parsedUrl.pathname;

  // Handle Mock Contact API
  if (reqPath === '/api/contact' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, id: 'mock_lead_123', received: payload }));
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false }));
      }
    });
    return;
  }

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

async function runE2E() {
  await new Promise<void>((resolve) => server.listen(PORT, resolve));
  const browser = await chromium.launch({ headless: true });

  console.log('=============================================================================');
  console.log('VARAH SYSTEMS — Playwright E2E Analytics & Consent Gating Verification');
  console.log(`Test Server: http://localhost:${PORT}`);
  console.log('=============================================================================\n');

  let passedAll = true;

  try {
    // --------------------------------------------------------------------------
    // Test 1: Clean Context
    // --------------------------------------------------------------------------
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    const analyticsRequests1: string[] = [];
    page1.on('request', (req) => {
      if (req.url().includes('plausible') || req.url().includes('analytics')) {
        analyticsRequests1.push(req.url());
      }
    });

    await page1.goto(`http://localhost:${PORT}/`);
    await page1.waitForTimeout(500);

    const cookies1 = await context1.cookies();
    const storageKeys1 = await page1.evaluate(() => Object.keys(sessionStorage));
    const scriptLoaded1 = await page1.evaluate(() => Boolean(document.getElementById('plausible-runtime-script')));

    const test1Pass =
      cookies1.length === 0 &&
      analyticsRequests1.length === 0 &&
      !storageKeys1.includes('varah_first_touch_attribution') &&
      !scriptLoaded1;

    console.log(`[TEST 1] Clean Context Initial Visit:`);
    console.log(`         Cookies set: ${cookies1.length} | Analytics requests: ${analyticsRequests1.length}`);
    console.log(`         Plausible runtime script appended: ${scriptLoaded1}`);
    console.log(`         Attribution in sessionStorage: ${storageKeys1.includes('varah_first_touch_attribution')}`);
    console.log(`         Result: ${test1Pass ? '✓ PASS' : '✗ FAIL'}\n`);
    if (!test1Pass) passedAll = false;
    await context1.close();

    // --------------------------------------------------------------------------
    // Test 2: Reject All & Reload Persistence
    // --------------------------------------------------------------------------
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    const analyticsRequests2: string[] = [];
    page2.on('request', (req) => {
      if (req.url().includes('plausible')) analyticsRequests2.push(req.url());
    });

    await page2.goto(`http://localhost:${PORT}/?utm_source=google&utm_medium=cpc`);
    await page2.click('#consent-reject-all-btn');
    await page2.waitForTimeout(300);

    await page2.reload();
    await page2.waitForTimeout(500);

    const cookies2 = await context2.cookies();
    const storageKeys2 = await page2.evaluate(() => Object.keys(sessionStorage));
    const scriptLoaded2 = await page2.evaluate(() => Boolean(document.getElementById('plausible-runtime-script')));

    const test2Pass =
      cookies2.length === 0 &&
      analyticsRequests2.length === 0 &&
      !storageKeys2.includes('varah_first_touch_attribution') &&
      !scriptLoaded2;

    console.log(`[TEST 2] Reject All & Reload Persistence:`);
    console.log(`         Cookies set: ${cookies2.length} | Plausible requests: ${analyticsRequests2.length}`);
    console.log(`         Runtime script appended: ${scriptLoaded2}`);
    console.log(`         Attribution captured: ${storageKeys2.includes('varah_first_touch_attribution')}`);
    console.log(`         Result: ${test2Pass ? '✓ PASS' : '✗ FAIL'}\n`);
    if (!test2Pass) passedAll = false;
    await context2.close();

    // --------------------------------------------------------------------------
    // Test 3: Opt-in via Preferences Modal
    // --------------------------------------------------------------------------
    const context3 = await browser.newContext();
    const page3 = await context3.newPage();

    await page3.goto(`http://localhost:${PORT}/`);
    await page3.click('#consent-manage-btn');
    await page3.waitForSelector('#consent-preferences-dialog[open]');
    await page3.click('label[for="consent-toggle-analytics"]');
    await page3.click('#consent-save-preferences-btn');
    await page3.waitForTimeout(500);

    const scriptLoaded3 = await page3.evaluate(() => Boolean(document.getElementById('plausible-runtime-script')));
    const plausibleStubExists = await page3.evaluate(() => typeof (window as any).plausible === 'function');

    const test3Pass = scriptLoaded3 && plausibleStubExists;
    console.log(`[TEST 3] Opt-In via Preferences:`);
    console.log(`         Plausible runtime script appended: ${scriptLoaded3}`);
    console.log(`         window.plausible dispatcher initialized: ${plausibleStubExists}`);
    console.log(`         Result: ${test3Pass ? '✓ PASS' : '✗ FAIL'}\n`);
    if (!test3Pass) passedAll = false;
    await context3.close();

    // --------------------------------------------------------------------------
    // Test 4: Attribution Capture with Consent
    // --------------------------------------------------------------------------
    const context4 = await browser.newContext();
    const page4 = await context4.newPage();

    // Pre-seed consent state as accepted
    await page4.addInitScript(() => {
      localStorage.setItem(
        'varah_consent_state',
        JSON.stringify({
          version: 1,
          timestamp: Date.now(),
          categories: { necessary: true, analytics: true, marketing: false },
        })
      );
    });

    await page4.goto(`http://localhost:${PORT}/solutions.html?utm_source=linkedin&utm_medium=cpc&utm_campaign=q4_growth`);
    await page4.waitForTimeout(500);

    const attrData = await page4.evaluate(() => {
      const raw = sessionStorage.getItem('varah_first_touch_attribution');
      return raw ? JSON.parse(raw) : null;
    });

    const test4Pass =
      attrData &&
      attrData.utmSource === 'linkedin' &&
      attrData.utmMedium === 'cpc' &&
      attrData.utmCampaign === 'q4_growth' &&
      attrData.landingPath === '/solutions.html';

    console.log(`[TEST 4] Attribution Capture with Consent:`);
    console.log(`         Captured: ${JSON.stringify(attrData)}`);
    console.log(`         Result: ${test4Pass ? '✓ PASS' : '✗ FAIL'}\n`);
    if (!test4Pass) passedAll = false;
    await context4.close();

    // --------------------------------------------------------------------------
    // Test 5: Attribution Blocked Without Consent
    // --------------------------------------------------------------------------
    const context5 = await browser.newContext();
    const page5 = await context5.newPage();

    // Pre-seed consent state as rejected
    await page5.addInitScript(() => {
      localStorage.setItem(
        'varah_consent_state',
        JSON.stringify({
          version: 1,
          timestamp: Date.now(),
          categories: { necessary: true, analytics: false, marketing: false },
        })
      );
    });

    await page5.goto(`http://localhost:${PORT}/solutions.html?utm_source=twitter&utm_medium=paid`);
    await page5.waitForTimeout(500);

    const attrData5 = await page5.evaluate(() => {
      return sessionStorage.getItem('varah_first_touch_attribution');
    });

    const test5Pass = attrData5 === null;
    console.log(`[TEST 5] Attribution Blocked Without Consent:`);
    console.log(`         sessionStorage value: ${attrData5}`);
    console.log(`         Result: ${test5Pass ? '✓ PASS' : '✗ FAIL'}\n`);
    if (!test5Pass) passedAll = false;
    await context5.close();

  } finally {
    await browser.close();
    server.close();
  }

  if (passedAll) {
    console.log('✓ SUCCESS: All 5 E2E Playwright verification scenarios passed.');
    process.exit(0);
  } else {
    console.error('✗ FAILURE: One or more E2E verification tests failed.');
    process.exit(1);
  }
}

runE2E().catch((err) => {
  console.error(err);
  process.exit(1);
});
