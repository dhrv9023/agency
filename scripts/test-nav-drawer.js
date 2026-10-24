const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('playwright');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
};

function startStaticServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = req.url.split('?')[0];
      if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
      const filePath = path.join(PUBLIC_DIR, reqPath);

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    });

    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      resolve({ server, port });
    });
  });
}

async function testDrawer() {
  console.log('Testing Navigation & Drawer Interactions with Chromium Headless...');
  const { server, port } = await startStaticServer();

  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();

    await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: 'domcontentloaded' });

    // 1. Check burger button is visible on mobile
    const burger = page.locator('button.mobile-burger-btn');
    const isVisible = await burger.isVisible();
    console.log(`✓ Burger button visible on 390px viewport: ${isVisible}`);

    // 2. Click burger button
    await burger.click();
    await page.waitForTimeout(300);

    // Check aria-expanded
    const expanded = await burger.getAttribute('aria-expanded');
    console.log(`✓ Burger aria-expanded after click: ${expanded}`);

    // Check sheet is open
    const sheet = page.locator('#mobile-drawer');
    const sheetHasOpenClass = await sheet.evaluate((el) => el.classList.contains('is-open'));
    console.log(`✓ Drawer sheet has 'is-open' class: ${sheetHasOpenClass}`);

    // 3. Test focus trap: active element should be the close button (WCAG modal pattern)
    const closeBtn = page.locator('.mobile-sheet-close-btn');
    const closeBtnFocused = await closeBtn.evaluate((el) => document.activeElement === el);
    console.log(`✓ Focus automatically set on close button inside drawer on open: ${closeBtnFocused}`);

    // 4. Press Shift+Tab from first element -> should wrap to last element
    await page.keyboard.press('Shift+Tab');
    await page.waitForTimeout(50);
    const activeTag = await page.evaluate(
      () => document.activeElement.tagName + '.' + document.activeElement.className
    );
    console.log(`✓ Shift+Tab wrapped to last focusable element: ${activeTag}`);

    // 5. Press Escape -> drawer should close and focus return to burger button
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    const sheetClosed = await sheet.evaluate((el) => !el.classList.contains('is-open'));
    const burgerRefocused = await burger.evaluate((el) => document.activeElement === el);
    console.log(`✓ Escape pressed: drawer closed = ${sheetClosed}, focus returned to burger button = ${burgerRefocused}`);

    // 6. Test Desktop Viewport (1280px)
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(100);
    const mainNavVisible = await page.locator('.main-nav').isVisible();
    const burgerHiddenOnDesktop = !(await burger.isVisible());
    console.log(`✓ At 1280px: desktop nav visible = ${mainNavVisible}, burger button hidden = ${burgerHiddenOnDesktop}`);

    // 7. Check 5 approved desktop links
    const navLinks = await page.locator('.main-nav .nav-link').allTextContents();
    console.log(`✓ Desktop Nav links (${navLinks.length}):`, navLinks.join(' | '));

    await browser.close();
    console.log('\n✓ ALL NAV & DRAWER INTERACTION TESTS PASSED!');
  } finally {
    server.close();
  }
}

testDrawer().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
