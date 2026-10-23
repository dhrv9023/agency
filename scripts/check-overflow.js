#!/usr/bin/env node

/**
 * ============================================================================
 * VARAH SYSTEMS — Comprehensive Cross-Device Responsiveness & Overflow Test Suite
 * ============================================================================
 * Tests all key pages across 11 portrait widths + 2 landscape viewports.
 * Dual-pass verification:
 *   Pass 1: Production state with backstop (verifies zero horizontal scrolling)
 *   Pass 2: Unconstrained state without backstop (detects latent root-cause offenders)
 *
 * Supported engines: Playwright (Chromium) with built-in zero-dependency fallback.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

// Viewport Matrix
const VIEWPORTS = [
  { name: '320px  (iPhone SE min)', width: 320, height: 568 },
  { name: '360px  (Android base)',  width: 360, height: 740 },
  { name: '390px  (iPhone 12/13/14)', width: 390, height: 844 },
  { name: '414px  (iPhone Plus/Max)', width: 414, height: 896 },
  { name: '768px  (iPad Portrait)', width: 768, height: 1024 },
  { name: '834px  (iPad Pro 11")',  width: 834, height: 1194 },
  { name: '1024px (iPad Pro 12.9")', width: 1024, height: 1366 },
  { name: '1200px (Desktop Container)', width: 1200, height: 900 },
  { name: '1280px (Standard Laptop)', width: 1280, height: 800 },
  { name: '1440px (MacBook Pro 15")', width: 1440, height: 900 },
  { name: '1920px (FHD Desktop)',   width: 1920, height: 1080 },
  { name: '844x390 (Phone Landscape 1)', width: 844, height: 390 },
  { name: '896x414 (Phone Landscape 2)', width: 896, height: 414 },
];

const PAGES = [
  '/',
  '/about.html',
  '/solutions.html',
  '/industries.html',
  '/case-studies.html',
  '/process.html',
  '/pricing.html',
  '/contact.html',
  '/book.html',
  '/calculator.html',
  '/case-studies/lead-qualification.html',
  '/solutions/ai-automation.html',
  '/industries/ecommerce.html',
];

const ZERO_DEP_CONSOLE_SNIPPET = `
/* VARAH Zero-Dependency DevTools Console Overflow Detector */
(() => {
  const docWidth = document.documentElement.clientWidth;
  const scrollWidth = document.documentElement.scrollWidth;
  console.log("%c[Overflow Check] Client: " + docWidth + "px | Scroll: " + scrollWidth + "px", "font-weight: bold; color: #00f0ff; background: #000; padding: 4px 8px;");
  
  // Temporarily disable backstop to find root cause
  const prevHtml = document.documentElement.style.overflowX;
  const prevBody = document.body.style.overflowX;
  document.documentElement.style.overflowX = 'visible';
  document.body.style.overflowX = 'visible';
  
  const offenders = [];
  document.querySelectorAll('*').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.right > docWidth + 1 || rect.width > docWidth + 1) {
      offenders.push({
        element: el,
        tag: el.tagName.toLowerCase(),
        id: el.id ? '#' + el.id : '',
        class: el.className ? '.' + String(el.className).trim().split(/\\s+/).slice(0, 3).join('.') : '',
        right: Math.round(rect.right),
        width: Math.round(rect.width),
        overflow: Math.round(rect.right - docWidth)
      });
    }
  });

  // Restore backstop
  document.documentElement.style.overflowX = prevHtml;
  document.body.style.overflowX = prevBody;

  if (offenders.length === 0) {
    console.log("%c✓ ZERO OVERFLOW DETECTED: Page layout is 100% clean!", "color: #10b981; font-weight: bold; font-size: 14px;");
  } else {
    console.warn("Found " + offenders.length + " overflowing elements (without backstop):", offenders);
  }
})();
`;

// Simple static server for public directory
function startStaticServer(publicDir) {
  return new Promise((resolve) => {
    const mimeTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'text/javascript',
      '.json': 'application/json',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.webp': 'image/webp',
      '.mp4': 'video/mp4',
      '.woff2': 'font/woff2',
      '.woff': 'font/woff',
    };

    const server = http.createServer((req, res) => {
      let reqPath = req.url.split('?')[0];
      if (reqPath === '/') reqPath = '/index.html';
      const filePath = path.join(publicDir, reqPath);

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
    });

    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      resolve({ server, port });
    });
  });
}

async function run() {
  const args = process.argv.slice(2);
  if (args.includes('--console')) {
    console.log('\n================ ZERO-DEPENDENCY CONSOLE SCRIPT ================');
    console.log('Copy and paste this into any browser DevTools console:');
    console.log(ZERO_DEP_CONSOLE_SNIPPET);
    console.log('=================================================================\n');
    return;
  }

  let playwright;
  try {
    playwright = require('playwright');
  } catch (err) {
    console.warn('\nPlaywright not found. Falling back to zero-dependency console script instructions:');
    console.log(ZERO_DEP_CONSOLE_SNIPPET);
    return;
  }

  const publicDir = path.resolve(__dirname, '../public');
  const { server, port } = await startStaticServer(publicDir);
  const baseUrl = `http://127.0.0.1:${port}`;

  console.log(`\n=================================================================`);
  console.log(`VARAH SYSTEMS — Responsive & Layout Overflow Test Matrix`);
  console.log(`Target: ${baseUrl} (${PAGES.length} pages × ${VIEWPORTS.length} viewports = ${PAGES.length * VIEWPORTS.length} combinations)`);
  console.log(`Engines: Chromium Headless (devDependency only)`);
  console.log(`=================================================================\n`);

  const browser = await playwright.chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  let totalTests = 0;
  let passCount = 0;
  let failCount = 0;
  const issues = [];

  const matrixResults = {};

  for (const pagePath of PAGES) {
    matrixResults[pagePath] = {};
    const pageUrl = `${baseUrl}${pagePath}`;
    const context = await browser.newContext();
    const page = await context.newPage();

    for (const vp of VIEWPORTS) {
      totalTests++;
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(pageUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(60); // Allow styles and flex/grid reflows

      // Pass 1: Test with backstop enabled
      const backstopCheck = await page.evaluate((expectedWidth) => {
        const docEl = document.documentElement;
        const scrollW = docEl.scrollWidth;
        const clientW = docEl.clientWidth;
        const winW = window.innerWidth;
        const canScrollX = scrollW > winW || window.scrollX > 0;
        return {
          scrollWidth: scrollW,
          clientWidth: clientW,
          innerWidth: winW,
          canScrollX,
          passed: scrollW <= winW + 1,
        };
      }, vp.width);

      // Pass 2: Test unconstrained (remove overflow-x: clip/hidden temporarily to find root cause offenders)
      const unconstrainedCheck = await page.evaluate((expectedWidth) => {
        const prevHtml = document.documentElement.style.overflowX;
        const prevBody = document.body.style.overflowX;
        document.documentElement.style.overflowX = 'visible';
        document.body.style.overflowX = 'visible';

        const docWidth = window.innerWidth;
        const offenders = [];
        const allElements = document.querySelectorAll('*');

        for (let i = 0; i < allElements.length; i++) {
          const el = allElements[i];
          const rect = el.getBoundingClientRect();
          if (rect.right > docWidth + 1.5) {
            const tag = el.tagName.toLowerCase();
            const id = el.id ? '#' + el.id : '';
            const className = el.className && typeof el.className === 'string'
              ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
              : '';
            offenders.push({
              selector: `${tag}${id}${className}`,
              right: Math.round(rect.right),
              excess: Math.round(rect.right - docWidth),
            });
            if (offenders.length >= 3) break; // Limit reporting per viewport
          }
        }

        // Restore backstop
        document.documentElement.style.overflowX = prevHtml;
        document.body.style.overflowX = prevBody;

        return {
          passed: offenders.length === 0,
          offenders,
        };
      }, vp.width);

      const passed = backstopCheck.passed && unconstrainedCheck.passed;
      if (passed) {
        passCount++;
        matrixResults[pagePath][vp.width] = 'PASS';
      } else {
        failCount++;
        matrixResults[pagePath][vp.width] = 'FAIL';
        issues.push({
          page: pagePath,
          viewport: `${vp.width}x${vp.height} (${vp.name})`,
          backstopPassed: backstopCheck.passed,
          unconstrainedPassed: unconstrainedCheck.passed,
          scrollWidth: backstopCheck.scrollWidth,
          innerWidth: backstopCheck.innerWidth,
          offenders: unconstrainedCheck.offenders,
        });
      }
    }

    await context.close();
  }

  await browser.close();
  server.close();

  // Print Summary Table
  console.log('-------------------------------------------------------------------------------------------------------------------------');
  console.log('PAGE \\ WIDTH MATRIX'.padEnd(32) + VIEWPORTS.map(v => String(v.width).padEnd(6)).join(' '));
  console.log('-------------------------------------------------------------------------------------------------------------------------');
  for (const pagePath of PAGES) {
    const row = matrixResults[pagePath];
    const statusRow = VIEWPORTS.map(v => {
      const st = row[v.width];
      return st === 'PASS' ? '  ✓   ' : '  ✗   ';
    }).join(' ');
    console.log(pagePath.padEnd(32) + statusRow);
  }
  console.log('-------------------------------------------------------------------------------------------------------------------------\n');

  console.log(`Total Checks: ${totalTests}`);
  console.log(`Passed:       ${passCount} / ${totalTests}`);
  console.log(`Failed:       ${failCount} / ${totalTests}`);

  if (issues.length > 0) {
    console.warn(`\n[!] OVERFLOW OFFENDERS DETECTED:`);
    issues.forEach((iss, idx) => {
      console.warn(`\n#${idx + 1} Page: ${iss.page} @ ${iss.viewport}`);
      console.warn(`    Backstop Pass: ${iss.backstopPassed} (scrollWidth=${iss.scrollWidth}, innerWidth=${iss.innerWidth})`);
      console.warn(`    Unconstrained Pass: ${iss.unconstrainedPassed}`);
      if (iss.offenders && iss.offenders.length > 0) {
        console.warn(`    Offending Elements:`);
        iss.offenders.forEach(o => console.warn(`      - ${o.selector} (right=${o.right}px, +${o.excess}px over viewport)`));
      }
    });
    process.exit(1);
  } else {
    console.log(`\n✓ SUCCESS: Zero horizontal overflow detected across all 13 viewports and all pages!`);
    process.exit(0);
  }
}

run().catch((err) => {
  console.error('Test suite error:', err);
  process.exit(1);
});
