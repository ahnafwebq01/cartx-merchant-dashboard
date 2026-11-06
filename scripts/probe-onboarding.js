const { chromium } = require('playwright-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';

async function run() {
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const page = await browser.newPage();

  for (const w of [320, 375, 425]) {
    await page.setViewportSize({ width: w, height: 600 });
    await page.goto(`${BASE_URL}/onboarding`, { waitUntil: 'networkidle' });
    const check = await page.evaluate(() => {
      const docW = document.documentElement.clientWidth;
      const scrollW = document.body.scrollWidth;
      const elements = Array.from(document.querySelectorAll('*')).filter(el => {
        const r = el.getBoundingClientRect();
        return r.right > docW + 1;
      }).map(el => ({
        tag: el.tagName,
        className: el.className,
        right: Math.round(el.getBoundingClientRect().right),
        width: Math.round(el.getBoundingClientRect().width)
      }));
      return { docW, scrollW, overflow: scrollW > docW, culprits: elements.slice(0, 8) };
    });
    console.log(`Width ${w}:`, check);
  }

  await browser.close();
}

run();

