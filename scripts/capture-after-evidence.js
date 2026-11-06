const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'docs', 'responsive-testing');

async function captureEvidence() {
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const page = await browser.newPage();

  // Onboarding home
  await page.goto(`${BASE_URL}/onboarding`, { waitUntil: 'networkidle' });
  await page.setViewportSize({ width: 320, height: 568 });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'after-onboarding-320px.png') });
  await page.setViewportSize({ width: 375, height: 667 });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'after-onboarding-375px.png') });

  // Onboarding payments
  await page.goto(`${BASE_URL}/onboarding/payments`, { waitUntil: 'networkidle' });
  await page.setViewportSize({ width: 320, height: 568 });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'after-onboarding-payments-320px.png') });
  await page.setViewportSize({ width: 375, height: 667 });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'after-onboarding-payments-375px.png') });
  await page.setViewportSize({ width: 425, height: 900 });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'after-onboarding-payments-425px.png') });

  // Onboarding storefront
  await page.goto(`${BASE_URL}/onboarding/storefront`, { waitUntil: 'networkidle' });
  await page.setViewportSize({ width: 320, height: 568 });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'after-onboarding-storefront-320px.png') });

  // Onboarding publish
  await page.goto(`${BASE_URL}/onboarding/publish`, { waitUntil: 'networkidle' });
  await page.setViewportSize({ width: 320, height: 568 });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'after-onboarding-publish-320px.png') });

  await browser.close();
  console.log('After-fix evidence screenshots captured successfully.');
}

captureEvidence().catch(console.error);

