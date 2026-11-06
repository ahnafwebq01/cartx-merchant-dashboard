const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'docs', 'responsive-testing', 'dialogs');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function checkOverflow(page) {
  return await page.evaluate(() => {
    const docW = document.documentElement.clientWidth;
    const bodyScrollW = document.body.scrollWidth;
    const isOverflowing = bodyScrollW > docW + 1;
    return { docW, bodyScrollW, isOverflowing };
  });
}

async function testDialogs() {
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const page = await browser.newPage();

  // Test Topbar dropdowns at 320px
  console.log('Testing Topbar popovers at 320x568...');
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  // Store selector popover
  const storeSelector = await page.$('header button:has(svg.lucide-chevron-down), header button:has-text("Store")');
  if (storeSelector) {
    await storeSelector.click();
    await page.waitForTimeout(300);
    const ofStore = await checkOverflow(page);
    console.log(`  Store selector popover open. Overflow: ${ofStore.isOverflowing}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'store-selector-popover-320px.png') });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
  }

  // Notification button popover
  const notifBtn = await page.$('header button:has(svg.lucide-bell)');
  if (notifBtn) {
    await notifBtn.click();
    await page.waitForTimeout(300);
    const ofNotif = await checkOverflow(page);
    console.log(`  Notification popover open. Overflow: ${ofNotif.isOverflowing}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'notifications-popover-320px.png') });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
  }

  // User menu popover
  const userBtn = await page.$('header button:has(span.relative)');
  if (userBtn) {
    await userBtn.click();
    await page.waitForTimeout(300);
    const ofUser = await checkOverflow(page);
    console.log(`  User profile popover open. Overflow: ${ofUser.isOverflowing}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'user-menu-popover-320px.png') });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
  }

  // Test Team "Invite Member" Dialog at 320x568
  console.log('\nTesting Team Invite dialog at 320x568...');
  await page.goto(`${BASE_URL}/dashboard/team`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  const inviteBtn = await page.$('button:has-text("Invite Member"), button:has-text("Add Member"), button:has-text("Invite")');
  if (inviteBtn) {
    await inviteBtn.click();
    await page.waitForTimeout(400);
    const ofInvite = await checkOverflow(page);
    console.log(`  Team invite dialog open. Overflow: ${ofInvite.isOverflowing}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'team-invite-dialog-320px.png') });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
  }

  // Test Support "New Ticket" Dialog at 320x568
  console.log('\nTesting Support New Ticket dialog at 320x568...');
  await page.goto(`${BASE_URL}/dashboard/support`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  const ticketBtn = await page.$('button:has-text("New Ticket"), button:has-text("Create Ticket")');
  if (ticketBtn) {
    await ticketBtn.click();
    await page.waitForTimeout(400);
    const ofTicket = await checkOverflow(page);
    console.log(`  Support ticket dialog open. Overflow: ${ofTicket.isOverflowing}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'support-ticket-dialog-320px.png') });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
  }

  // Test Custom Domain Dialog at 320x568
  console.log('\nTesting Store Custom Domain dialog at 320x568...');
  await page.goto(`${BASE_URL}/dashboard/store/domains`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  const domainBtn = await page.$('button:has-text("Connect Domain"), button:has-text("Add Domain")');
  if (domainBtn) {
    await domainBtn.click();
    await page.waitForTimeout(400);
    const ofDomain = await checkOverflow(page);
    console.log(`  Domain dialog open. Overflow: ${ofDomain.isOverflowing}`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'custom-domain-dialog-320px.png') });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
  }

  await browser.close();
  console.log('Dialog tests completed.');
}

testDialogs().catch(console.error);

