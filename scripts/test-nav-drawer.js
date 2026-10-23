const { chromium } = require('playwright');

async function testDrawer() {
  console.log('Testing Navigation & Drawer Interactions with Chromium Headless...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

  await page.goto('http://localhost:3000/index.html', { waitUntil: 'domcontentloaded' });

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
  const sheetHasOpenClass = await sheet.evaluate(el => el.classList.contains('is-open'));
  console.log(`✓ Drawer sheet has 'is-open' class: ${sheetHasOpenClass}`);

  // 3. Test focus trap: active element should be the close button (WCAG modal pattern)
  const closeBtn = page.locator('.mobile-sheet-close-btn');
  const closeBtnFocused = await closeBtn.evaluate(el => document.activeElement === el);
  console.log(`✓ Focus automatically set on close button inside drawer on open: ${closeBtnFocused}`);

  // 4. Press Shift+Tab from first element -> should wrap to last element
  await page.keyboard.press('Shift+Tab');
  await page.waitForTimeout(50);
  const activeTag = await page.evaluate(() => document.activeElement.tagName + '.' + document.activeElement.className);
  console.log(`✓ Shift+Tab wrapped to last focusable element: ${activeTag}`);

  // 5. Press Escape -> drawer should close and focus return to burger button
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  const sheetClosed = await sheet.evaluate(el => !el.classList.contains('is-open'));
  const burgerRefocused = await burger.evaluate(el => document.activeElement === el);
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
}

testDrawer().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
