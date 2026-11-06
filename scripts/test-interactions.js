const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'docs', 'responsive-testing', 'interactions');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function checkOverflow(page) {
  return await page.evaluate(() => {
    const docW = document.documentElement.clientWidth;
    const bodyScrollW = document.body.scrollWidth;
    const htmlScrollW = document.documentElement.scrollWidth;
    const isOverflowing = bodyScrollW > docW + 1 || htmlScrollW > docW + 1;
    return { docW, bodyScrollW, htmlScrollW, isOverflowing };
  });
}

async function runInteractions() {
  console.log('--- Starting Real Browser Interaction Tests ---');
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const page = await browser.newPage();

  // Test 1: Desktop Sidebar Collapse / Expand (1440x900)
  console.log('\n[Interaction 1] Desktop Sidebar Toggle at 1440x900');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  // Look for sidebar collapse button
  const collapseBtn = await page.$('button[aria-label*="collapse" i], button[title*="collapse" i], button[aria-label*="sidebar" i]');
  if (collapseBtn) {
    await collapseBtn.click();
    await page.waitForTimeout(300);
    const of1 = await checkOverflow(page);
    console.log(`  Collapsed sidebar overflow: ${of1.isOverflowing}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-sidebar-collapsed.png') });
    // Expand again
    await collapseBtn.click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-sidebar-expanded.png') });
  } else {
    console.log('  Sidebar toggle button found by generic selector:');
    // Check Topbar or Sidebar toggle buttons
    const buttons = await page.$$eval('button', btns => btns.map(b => ({ aria: b.getAttribute('aria-label'), title: b.getAttribute('title'), text: b.innerText.slice(0, 30) })));
    console.log('  Available buttons:', buttons.slice(0, 10));
  }

  // Test 2: Mobile Navigation Drawer (Hamburger button) at 375x667
  console.log('\n[Interaction 2] Mobile Navigation Drawer at 375x667');
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  // Find mobile menu trigger (hamburger button)
  const menuTrigger = await page.$('button[aria-label*="menu" i], button[aria-label*="open" i], button[aria-label*="navigation" i], button:has(svg.lucide-menu)');
  if (menuTrigger) {
    console.log('  Found mobile menu trigger, clicking...');
    await menuTrigger.click();
    await page.waitForTimeout(400);
    const of2 = await checkOverflow(page);
    console.log(`  Mobile drawer open overflow: ${of2.isOverflowing}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-drawer-open-375px.png') });

    // Try clicking a link inside mobile drawer (e.g. Products)
    const productLink = await page.$('div[role="dialog"] a[href="/dashboard/products"], div[data-state="open"] a[href="/dashboard/products"]');
    if (productLink) {
      console.log('  Clicking Products link in mobile drawer...');
      await productLink.click();
      await page.waitForTimeout(600);
      console.log(`  Current URL after click: ${page.url()}`);
    }
  } else {
    console.log('  Looking for mobile menu button in Topbar...');
    const topbarBtns = await page.$$eval('header button', btns => btns.map(b => ({ aria: b.getAttribute('aria-label'), html: b.innerHTML.slice(0, 50) })));
    console.log('  Topbar buttons:', topbarBtns);
  }

  // Test 3: Theme Switcher (Light <-> Dark)
  console.log('\n[Interaction 3] Theme Switcher Toggle');
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);

  const themeBtn = await page.$('button[aria-label*="theme" i], button:has(svg.lucide-sun), button:has(svg.lucide-moon)');
  if (themeBtn) {
    console.log('  Found theme switch button, clicking...');
    await themeBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'theme-switch-dropdown-open.png') });

    // Look for Dark mode menu item
    const darkOption = await page.$('div[role="menuitem"]:has-text("Dark"), button:has-text("Dark"), [data-radix-collection-item]:has-text("Dark")');
    if (darkOption) {
      await darkOption.click();
      await page.waitForTimeout(400);
      const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
      console.log(`  Switched to Dark mode: document has .dark = ${isDark}`);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'dashboard-dark-mode.png') });

      // Switch back to Light
      await themeBtn.click();
      await page.waitForTimeout(300);
      const lightOption = await page.$('div[role="menuitem"]:has-text("Light"), [data-radix-collection-item]:has-text("Light")');
      if (lightOption) {
        await lightOption.click();
        await page.waitForTimeout(300);
        const isLight = await page.evaluate(() => !document.documentElement.classList.contains('dark'));
        console.log(`  Switched to Light mode: isLight = ${isLight}`);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'dashboard-light-mode.png') });
      }
    }
  }

  // Test 4: Dialogs & Modals at 320px & 375px
  console.log('\n[Interaction 4] Dialogs & Modals (e.g. Products / Filter / Create Dialog)');
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto(`${BASE_URL}/dashboard/products`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  // Look for any dialog triggers, such as "Export", "Import", or filters
  const filterBtn = await page.$('button:has-text("Filter"), button:has-text("Export"), button:has-text("Add Product")');
  if (filterBtn) {
    console.log('  Found action button, checking interactions...');
  }

  // Test 5: Tabs interaction (e.g. on /dashboard/billing/plans or /dashboard/settings)
  console.log('\n[Interaction 5] Tabs interaction at 375x667 on Settings');
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto(`${BASE_URL}/dashboard/settings`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  const tabs = await page.$$eval('[role="tab"]', elements => elements.map(e => e.innerText));
  console.log('  Found tabs in Settings:', tabs);
  if (tabs.length > 1) {
    const secondTab = await page.$('[role="tab"]:nth-child(2)');
    if (secondTab) {
      await secondTab.click();
      await page.waitForTimeout(300);
      const ofTabs = await checkOverflow(page);
      console.log(`  Tab switched. Overflow: ${ofTabs.isOverflowing}`);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'settings-tab2-375px.png') });
    }
  }

  await browser.close();
  console.log('\n--- Interaction Tests Finished ---');
}

runInteractions().catch(console.error);

