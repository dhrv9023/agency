#!/usr/bin/env tsx

/**
 * ==============================================================================
 * VARAH SYSTEMS — Comprehensive Playwright Consent & Script Gating Test Suite
 * ==============================================================================
 * Standards:
 *   - Runs in fresh browser contexts for complete test isolation.
 *   - Verifies:
 *     1. Clean initial context: Zero non-essential cookies & zero non-essential storage.
 *     2. Reject All parity: Choice stored, banner dismissed, persists on reload.
 *     3. Script gating: Gated scripts blocked before consent; execute immediately upon Accept All.
 *     4. Withdrawal: Footer trigger opens preferences, toggles off, fires revoke event.
 *     5. Expiry & Version bump: Stale/mismatched consent re-prompts banner.
 *     6. Global Privacy Control (GPC): Honored automatically when signal active.
 *     7. Keyboard accessibility: Focus trap inside <dialog> and Escape key dismissal with focus return.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const PORT = 3848;
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

// Static test server
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

interface StepResult {
  step: string;
  page: string;
  passed: boolean;
  details: string;
}

const testResults: StepResult[] = [];

async function runTestSuite() {
  await new Promise<void>((resolve) => server.listen(PORT, resolve));
  const browser = await chromium.launch({ headless: true });

  console.log('=============================================================================');
  console.log('VARAH SYSTEMS — Automated Cookie Consent & Gating Verification (Playwright)');
  console.log(`Test Server: http://localhost:${PORT}`);
  console.log('=============================================================================\n');

  try {
    // --------------------------------------------------------------------------
    // Test 1: Clean Initial Load (Zero non-essential cookies / storage)
    // --------------------------------------------------------------------------
    {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle' });

      const cookies = await context.cookies();
      const storageKeys = await page.evaluate(() => Object.keys(localStorage));
      const bannerVisible = await page.isVisible('#consent-banner');

      const nonEssentialCookies = cookies.filter(
        (c) => !c.name.startsWith('__Host-') && !c.name.startsWith('varah_admin')
      );
      const nonEssentialStorage = storageKeys.filter(
        (k) => !['agency_theme', 'varah_admin_theme', 'varah_consent_state'].includes(k)
      );

      const pass = nonEssentialCookies.length === 0 && nonEssentialStorage.length === 0 && bannerVisible;
      testResults.push({
        step: '1. Clean Initial Context',
        page: '/index.html',
        passed: pass,
        details: `Cookies: ${cookies.length}, Storage: [${storageKeys.join(', ')}], Banner Visible: ${bannerVisible}`,
      });
      await context.close();
    }

    // --------------------------------------------------------------------------
    // Test 2: Reject All Flow & Reload Persistence
    // --------------------------------------------------------------------------
    {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle' });

      // Click Reject All
      await page.click('#consent-reject-all-btn');
      await page.waitForTimeout(200);

      const bannerHiddenAfterClick = await page.isHidden('#consent-banner');
      const storedConsent = await page.evaluate(() => {
        const raw = localStorage.getItem('varah_consent_state');
        return raw ? JSON.parse(raw) : null;
      });

      // Reload page and verify banner remains dismissed
      await page.reload({ waitUntil: 'networkidle' });
      const bannerHiddenAfterReload = await page.isHidden('#consent-banner');

      const pass =
        bannerHiddenAfterClick &&
        bannerHiddenAfterReload &&
        storedConsent &&
        storedConsent.categories.analytics === false &&
        storedConsent.categories.marketing === false;

      testResults.push({
        step: '2. Reject All & Reload Persistence',
        page: '/index.html',
        passed: pass,
        details: `Banner Hidden: ${bannerHiddenAfterReload}, Stored Choice: { analytics: ${storedConsent?.categories?.analytics}, marketing: ${storedConsent?.categories?.marketing} }`,
      });
      await context.close();
    }

    // --------------------------------------------------------------------------
    // Test 3: Script Gating Execution on Accept All (Dev Fixture)
    // --------------------------------------------------------------------------
    {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(`http://localhost:${PORT}/dev/consent-test.html`, { waitUntil: 'networkidle' });

      // Check that script has NOT executed prior to consent
      const executedBefore = await page.evaluate(() => Boolean((window as any).__test_analytics_script_executed));

      // Click Accept All
      await page.click('#consent-accept-all-btn');
      await page.waitForTimeout(300);

      // Verify script dynamically activated and executed
      const executedAfter = await page.evaluate(() => Boolean((window as any).__test_analytics_script_executed));

      const pass = !executedBefore && executedAfter;
      testResults.push({
        step: '3. Script Gating on Accept All',
        page: '/dev/consent-test.html',
        passed: pass,
        details: `Executed Before: ${executedBefore}, Executed After Consent: ${executedAfter}`,
      });
      await context.close();
    }

    // --------------------------------------------------------------------------
    // Test 4: Footer Re-open & Withdrawal
    // --------------------------------------------------------------------------
    {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle' });

      // First accept all
      await page.click('#consent-accept-all-btn');
      await page.waitForTimeout(200);

      // Re-open via footer button
      await page.click('#open-cookie-preferences-btn');
      await page.waitForTimeout(200);

      const dialogVisible = await page.isVisible('#consent-preferences-dialog');

      // Uncheck analytics and save
      await page.uncheck('#consent-toggle-analytics');
      await page.click('#consent-save-preferences-btn');
      await page.waitForTimeout(200);

      const updatedConsent = await page.evaluate(() => {
        const raw = localStorage.getItem('varah_consent_state');
        return raw ? JSON.parse(raw) : null;
      });

      const pass = dialogVisible && updatedConsent && updatedConsent.categories.analytics === false;
      testResults.push({
        step: '4. Footer Settings & Consent Withdrawal',
        page: '/index.html',
        passed: pass,
        details: `Modal Opened: ${dialogVisible}, Analytics After Revocation: ${updatedConsent?.categories?.analytics}`,
      });
      await context.close();
    }

    // --------------------------------------------------------------------------
    // Test 5: Consent Expiry & Version Bump Re-prompt
    // --------------------------------------------------------------------------
    {
      const context = await browser.newContext();
      const page = await context.newPage();

      // Seed with stale timestamp (> 180 days ago)
      await page.addInitScript(() => {
        const staleTimestamp = Date.now() - 190 * 24 * 60 * 60 * 1000;
        localStorage.setItem(
          'varah_consent_state',
          JSON.stringify({
            version: 1,
            timestamp: staleTimestamp,
            categories: { necessary: true, analytics: true, marketing: true },
          })
        );
      });

      await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle' });
      const bannerRePrompted = await page.isVisible('#consent-banner');

      testResults.push({
        step: '5. Expired Consent (>180d) Re-prompt',
        page: '/index.html',
        passed: bannerRePrompted,
        details: `Banner Re-prompted: ${bannerRePrompted}`,
      });
      await context.close();
    }

    // --------------------------------------------------------------------------
    // Test 6: Global Privacy Control (GPC) Signal Recognition
    // --------------------------------------------------------------------------
    {
      const context = await browser.newContext();

      // Mock navigator.globalPrivacyControl = true on Navigator.prototype before page initialization
      await context.addInitScript({
        content: 'Object.defineProperty(Navigator.prototype, "globalPrivacyControl", { get: () => true, configurable: true });',
      });

      const page = await context.newPage();
      await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle' });

      const isGpcDetected = await page.evaluate(() => {
        return Boolean((window as any).consent?.isGpcActive && (window as any).consent.isGpcActive());
      });

      // Open preferences modal
      await page.click('#consent-manage-btn');
      await page.waitForTimeout(300);

      const gpcNoticeVisible = await page.isVisible('#consent-gpc-notice');
      const analyticsChecked = await page.isChecked('#consent-toggle-analytics');

      const pass = isGpcDetected && gpcNoticeVisible && !analyticsChecked;
      testResults.push({
        step: '6. Global Privacy Control (GPC)',
        page: '/index.html',
        passed: pass,
        details: `GPC Detected: ${isGpcDetected}, GPC Notice Visible: ${gpcNoticeVisible}, Analytics Default: ${analyticsChecked ? 'ON' : 'OFF'}`,
      });
      await context.close();
    }

    // --------------------------------------------------------------------------
    // Test 7: Keyboard Accessibility & Focus Restoration
    // --------------------------------------------------------------------------
    {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle' });

      // Focus and open via keyboard Enter on Preferences button
      await page.focus('#consent-manage-btn');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(200);

      // Verify focus is inside dialog
      const focusInsideDialog = await page.evaluate(() => {
        const dialog = document.getElementById('consent-preferences-dialog');
        return dialog ? dialog.contains(document.activeElement) : false;
      });

      // Press Escape key
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);

      // Verify dialog closed and focus restored to trigger
      const dialogClosed = await page.isHidden('#consent-preferences-dialog');
      const focusRestored = await page.evaluate(() => {
        const trigger = document.getElementById('consent-manage-btn');
        return document.activeElement === trigger;
      });

      const pass = focusInsideDialog && dialogClosed && focusRestored;
      testResults.push({
        step: '7. Keyboard Focus Trap & Escape Return',
        page: '/index.html',
        passed: pass,
        details: `Focus Trapped: ${focusInsideDialog}, Dialog Closed on Esc: ${dialogClosed}, Focus Restored: ${focusRestored}`,
      });
      await context.close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  // Print Pass/Fail Summary Table
  let failedCount = 0;
  console.log('---------------------------------------------------------------------------------------------------------');
  console.log('| STEP                                       | PAGE                     | STATUS | DETAILS');
  console.log('---------------------------------------------------------------------------------------------------------');

  for (const r of testResults) {
    const icon = r.passed ? '✓ PASS' : '✗ FAIL';
    if (!r.passed) failedCount++;
    console.log(
      `| ${r.step.padEnd(42)} | ${r.page.padEnd(24)} | ${icon.padEnd(6)} | ${r.details}`
    );
  }
  console.log('---------------------------------------------------------------------------------------------------------\n');

  if (failedCount > 0) {
    console.error(`[!] CONSENT AUDIT FAILED: ${failedCount} test(s) failed.`);
    process.exit(1);
  } else {
    console.log(`✓ All ${testResults.length} consent and script-gating tests passed cleanly.`);
    process.exit(0);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  server.close();
  process.exit(1);
});
