const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'docs', 'responsive-testing');

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

const BATCHES = {
  batch1: [
    { path: '/', name: 'landing' },
    { path: '/login', name: 'login' },
    { path: '/register', name: 'register' },
    { path: '/onboarding', name: 'onboarding' },
    { path: '/onboarding/store', name: 'onboarding-store' },
    { path: '/onboarding/business', name: 'onboarding-business' },
    { path: '/onboarding/products', name: 'onboarding-products' },
    { path: '/onboarding/payments', name: 'onboarding-payments' },
    { path: '/onboarding/shipping', name: 'onboarding-shipping' },
    { path: '/onboarding/storefront', name: 'onboarding-storefront' },
    { path: '/onboarding/publish', name: 'onboarding-publish' },
  ],
  batch2: [
    { path: '/dashboard', name: 'dashboard' },
    { path: '/dashboard/products', name: 'products' },
    { path: '/dashboard/products/new', name: 'products-new' },
    { path: '/dashboard/products/categories', name: 'products-categories' },
    { path: '/dashboard/products/collections', name: 'products-collections' },
    { path: '/dashboard/inventory', name: 'inventory' },
    { path: '/dashboard/inventory/adjustments', name: 'inventory-adjustments' },
    { path: '/dashboard/orders', name: 'orders' },
    { path: '/dashboard/orders/returns', name: 'orders-returns' },
    { path: '/dashboard/customers', name: 'customers' },
    { path: '/dashboard/customers/groups', name: 'customers-groups' },
  ],
  batch3: [
    { path: '/dashboard/payments', name: 'payments' },
    { path: '/dashboard/payments/transactions', name: 'payments-transactions' },
    { path: '/dashboard/payments/methods', name: 'payments-methods' },
    { path: '/dashboard/payments/refunds', name: 'payments-refunds' },
    { path: '/dashboard/payments/settings', name: 'payments-settings' },
    { path: '/dashboard/shipping', name: 'shipping' },
    { path: '/dashboard/shipping/shipments', name: 'shipping-shipments' },
    { path: '/dashboard/shipping/couriers', name: 'shipping-couriers' },
    { path: '/dashboard/shipping/settings', name: 'shipping-settings' },
  ],
  batch4: [
    { path: '/dashboard/marketing', name: 'marketing' },
    { path: '/dashboard/marketing/coupons', name: 'marketing-coupons' },
    { path: '/dashboard/marketing/coupons/new', name: 'marketing-coupons-new' },
    { path: '/dashboard/marketing/discounts', name: 'marketing-discounts' },
    { path: '/dashboard/marketing/flash-sales', name: 'marketing-flash-sales' },
    { path: '/dashboard/marketing/segments', name: 'marketing-segments' },
    { path: '/dashboard/marketing/analytics', name: 'marketing-analytics' },
    { path: '/dashboard/marketing/reports', name: 'marketing-reports' },
    { path: '/dashboard/team', name: 'team' },
    { path: '/dashboard/team/roles', name: 'team-roles' },
  ],
  batch5: [
    { path: '/dashboard/billing', name: 'billing' },
    { path: '/dashboard/billing/invoices', name: 'billing-invoices' },
    { path: '/dashboard/billing/plans', name: 'billing-plans' },
    { path: '/dashboard/billing/settings', name: 'billing-settings' },
    { path: '/dashboard/analytics', name: 'analytics' },
    { path: '/dashboard/analytics/sales', name: 'analytics-sales' },
    { path: '/dashboard/analytics/products', name: 'analytics-products' },
    { path: '/dashboard/analytics/customers', name: 'analytics-customers' },
    { path: '/dashboard/analytics/marketing', name: 'analytics-marketing' },
  ],
  batch6: [
    { path: '/dashboard/store', name: 'store' },
    { path: '/dashboard/store/themes', name: 'store-themes' },
    { path: '/dashboard/store/themes/customize', name: 'store-themes-customize' },
    { path: '/dashboard/store/pages', name: 'store-pages' },
    { path: '/dashboard/store/domains', name: 'store-domains' },
    { path: '/dashboard/support', name: 'support' },
    { path: '/dashboard/support/tickets', name: 'support-tickets' },
    { path: '/dashboard/settings', name: 'settings' },
    { path: '/dashboard/integrations', name: 'integrations' },
    { path: '/dashboard/integrations/webhooks', name: 'integrations-webhooks' },
    { path: '/dashboard/automation', name: 'automation' },
    { path: '/dashboard/automation/workflows', name: 'automation-workflows' },
    { path: '/dashboard/mobile-app', name: 'mobile-app' },
    { path: '/dashboard/mobile-app/branding', name: 'mobile-app-branding' },
    { path: '/dashboard/mobile-app/preview', name: 'mobile-app-preview' },
    { path: '/dashboard/mobile-app/settings', name: 'mobile-app-settings' },
  ]
};

async function checkOverflow(page) {
  return await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const bodyScrollWidth = document.body.scrollWidth;
    const htmlScrollWidth = document.documentElement.scrollWidth;
    const isOverflowing = bodyScrollWidth > docWidth + 1 || htmlScrollWidth > docWidth + 1;

    let culprits = [];
    if (isOverflowing) {
      const allElements = document.querySelectorAll('*');
      for (const el of allElements) {
        if (el.offsetWidth === 0 && el.offsetHeight === 0) continue;
        const rect = el.getBoundingClientRect();
        if (rect.right > docWidth + 1) {
          culprits.push({
            tag: el.tagName.toLowerCase(),
            id: el.id || undefined,
            className: (typeof el.className === 'string') ? el.className.split(' ').slice(0, 4).join(' ') : '',
            right: Math.round(rect.right),
            width: Math.round(rect.width),
            docWidth,
            diff: Math.round(rect.right - docWidth)
          });
        }
      }
      culprits.sort((a, b) => b.right - a.right);
      culprits = culprits.slice(0, 5);
    }

    return {
      docWidth,
      bodyScrollWidth,
      htmlScrollWidth,
      isOverflowing,
      culprits
    };
  });
}

async function runBatch(batchKey) {
  const routes = BATCHES[batchKey];
  if (!routes) {
    console.error(`Invalid batch key: ${batchKey}`);
    process.exit(1);
  }

  console.log(`\n======================================================`);
  console.log(`Running ${batchKey.toUpperCase()} (${routes.length} routes) across 9 viewports...`);
  console.log(`======================================================`);

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  const page = await browser.newPage();
  const results = [];
  const failures = [];

  for (const r of routes) {
    const url = `${BASE_URL}${r.path}`;
    console.log(`\nTesting ${r.path} [${r.name}]...`);

    let loaded = false;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });
        await page.waitForTimeout(400);
        loaded = true;
        break;
      } catch (e) {
        console.warn(`  Attempt ${attempt} load warning for ${r.path}:`, e.message);
        await page.waitForTimeout(1000);
      }
    }

    if (!loaded) {
      console.error(`  [ERROR] Could not load ${url}`);
      failures.push({ route: r.path, error: 'Load timeout' });
      continue;
    }

    const routeViewports = {};

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(200);

      const overflow = await checkOverflow(page);
      routeViewports[vp.name] = {
        width: vp.width,
        height: vp.height,
        isOverflowing: overflow.isOverflowing,
        bodyScrollWidth: overflow.bodyScrollWidth,
        docWidth: overflow.docWidth,
        culprits: overflow.culprits
      };

      if (overflow.isOverflowing) {
        console.log(`  ❌ OVERFLOW at ${vp.name} (${vp.width}px): ${overflow.bodyScrollWidth}px > ${overflow.docWidth}px (+${overflow.bodyScrollWidth - overflow.docWidth}px)`);
        console.log(`     Culprits:`, overflow.culprits.map(c => `<${c.tag}> .${c.className} (r=${c.right})`));
        failures.push({
          route: r.path,
          name: r.name,
          viewport: vp.name,
          width: vp.width,
          diff: overflow.bodyScrollWidth - overflow.docWidth,
          culprits: overflow.culprits
        });
      }

      // Capture screenshot for key viewports: 320, 375, 768, 1440
      if (['small-mobile', 'mobile', 'tablet', 'desktop'].includes(vp.name)) {
        const vpDir = path.join(SCREENSHOT_DIR, vp.name);
        if (!fs.existsSync(vpDir)) fs.mkdirSync(vpDir, { recursive: true });
        try {
          await page.screenshot({ path: path.join(vpDir, `${r.name}.png`) });
        } catch (e) {}
      }
    }

    results.push({ route: r.path, name: r.name, viewports: routeViewports });
  }

  await browser.close();

  // Save batch results
  const outFile = path.join(SCREENSHOT_DIR, `results-${batchKey}.json`);
  fs.writeFileSync(outFile, JSON.stringify({ results, failures, timestamp: new Date().toISOString() }, null, 2));

  console.log(`\nBatch ${batchKey} finished.`);
  console.log(`Total Failures: ${failures.length}`);
  return { results, failures };
}

const targetBatch = process.argv[2] || 'batch1';
runBatch(targetBatch).catch(console.error);

