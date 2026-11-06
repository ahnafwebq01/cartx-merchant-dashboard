const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';

const VIEWPORTS = [
  { name: 'small-mobile', width: 320, height: 568 },
  { name: 'mobile', width: 375, height: 667 },
  { name: 'large-mobile', width: 425, height: 900 },
  { name: 'small-tablet', width: 640, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'small-laptop', width: 1024, height: 768 },
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'large-desktop', width: 1920, height: 1080 },
];

async function checkOverflow(page) {
  return await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const bodyScrollWidth = document.body.scrollWidth;
    const htmlScrollWidth = document.documentElement.scrollWidth;
    const isOverflowing = bodyScrollWidth > docWidth || htmlScrollWidth > docWidth;

    const overflowingElements = [];
    if (isOverflowing) {
      const all = document.querySelectorAll('*');
      for (const el of all) {
        const rect = el.getBoundingClientRect();
        if (rect.right > docWidth + 1) { // 1px tolerance for subpixel rounding
          overflowingElements.push({
            tag: el.tagName.toLowerCase(),
            id: el.id,
            className: (el.className && typeof el.className === 'string') ? el.className.slice(0, 100) : '',
            right: Math.round(rect.right),
            width: Math.round(rect.width),
            docWidth
          });
        }
      }
    }

    return {
      docWidth,
      bodyScrollWidth,
      htmlScrollWidth,
      isOverflowing,
      overflowingElements: overflowingElements.slice(0, 5) // top 5
    };
  });
}

async function run() {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Testing initial page: /');
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForTimeout(300);
    const overflow = await checkOverflow(page);
    console.log(`Viewport ${vp.name} (${vp.width}x${vp.height}): overflow=${overflow.isOverflowing} (body: ${overflow.bodyScrollWidth}, doc: ${overflow.docWidth})`);
    if (overflow.isOverflowing) {
      console.log('  Overflow elements:', overflow.overflowingElements);
    }
  }

  await browser.close();
}

run().catch(console.error);

