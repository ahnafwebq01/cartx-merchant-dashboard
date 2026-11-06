const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'docs', 'responsive-testing');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

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

// Screenshot viewports to keep disk space reasonable while covering key breakpoints
const SCREENSHOT_VIEWPORTS = ['small-mobile', 'mobile', 'tablet', 'desktop'];

const ROUTES = [
  // Public
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

  // Dashboard Core
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

  // Finance & Logistics
  { path: '/dashboard/payments', name: 'payments' },
  { path: '/dashboard/payments/transactions', name: 'payments-transactions' },
  { path: '/dashboard/payments/methods', name: 'payments-methods' },
  { path: '/dashboard/payments/refunds', name: 'payments-refunds' },
  { path: '/dashboard/payments/settings', name: 'payments-settings' },
  { path: '/dashboard/shipping', name: 'shipping' },
  { path: '/dashboard/shipping/shipments', name: 'shipping-shipments' },
  { path: '/dashboard/shipping/couriers', name: 'shipping-couriers' },
  { path: '/dashboard/shipping/settings', name: 'shipping-settings' },

  // Marketing & Sales
  { path: '/dashboard/marketing', name: 'marketing' },
  { path: '/dashboard/marketing/coupons', name: 'marketing-coupons' },
  { path: '/dashboard/marketing/coupons/new', name: 'marketing-coupons-new' },
  { path: '/dashboard/marketing/discounts', name: 'marketing-discounts' },
  { path: '/dashboard/marketing/flash-sales', name: 'marketing-flash-sales' },
  { path: '/dashboard/marketing/segments', name: 'marketing-segments' },
  { path: '/dashboard/marketing/analytics', name: 'marketing-analytics' },
  { path: '/dashboard/marketing/reports', name: 'marketing-reports' },

  // Admin & Org
  { path: '/dashboard/team', name: 'team' },
  { path: '/dashboard/team/roles', name: 'team-roles' },
  { path: '/dashboard/billing', name: 'billing' },
  { path: '/dashboard/billing/invoices', name: 'billing-invoices' },
  { path: '/dashboard/billing/plans', name: 'billing-plans' },
  { path: '/dashboard/billing/settings', name: 'billing-settings' },

  // Analytics & Store
  { path: '/dashboard/analytics', name: 'analytics' },
  { path: '/dashboard/analytics/sales', name: 'analytics-sales' },
  { path: '/dashboard/analytics/products', name: 'analytics-products' },
  { path: '/dashboard/analytics/customers', name: 'analytics-customers' },
  { path: '/dashboard/analytics/marketing', name: 'analytics-marketing' },
  { path: '/dashboard/store', name: 'store' },
  { path: '/dashboard/store/themes', name: 'store-themes' },
  { path: '/dashboard/store/themes/customize', name: 'store-themes-customize' },
  { path: '/dashboard/store/pages', name: 'store-pages' },
  { path: '/dashboard/store/domains', name: 'store-domains' },

  // Support & Settings
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
];

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
        // Skip hidden or zero-size elements
        if (el.offsetWidth === 0 && el.offsetHeight === 0) continue;
        const rect = el.getBoundingClientRect();
        if (rect.right > docWidth + 1) {
          culprits.push({
            tag: el.tagName.toLowerCase(),
            id: el.id || undefined,
            className: (typeof el.className === 'string') ? el.className.split(' ').slice(0, 5).join(' ') : '',
            right: Math.round(rect.right),
            width: Math.round(rect.width),
            docWidth,
            diff: Math.round(rect.right - docWidth)
          });
        }
      }
      // Sort culprits by greatest overflow
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

async function main() {
  console.log(`Starting Phase 13 Responsive Browser Audit with Chrome...`);
  console.log(`Testing ${ROUTES.length} routes across ${VIEWPORTS.length} viewports.`);

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  const context = await browser.newContext({
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();

  const results = [];
  const errors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push({ type: 'console-error', text: msg.text(), url: page.url() });
    }
  });

  page.on('pageerror', err => {
    errors.push({ type: 'uncaught-error', text: err.message, url: page.url() });
  });

  for (const route of ROUTES) {
    const url = `${BASE_URL}${route.path}`;
    console.log(`\nTesting Route: ${route.path} (${route.name})`);

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      // Allow animations and client hydration to settle
      await page.waitForTimeout(500);
    } catch (err) {
      console.error(`Failed to load ${url}:`, err.message);
      results.push({
        route: route.path,
        name: route.name,
        loadError: err.message
      });
      continue;
    }

    const routeResult = {
      route: route.path,
      name: route.name,
      viewports: {}
    };

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(200);

      const overflow = await checkOverflow(page);
      routeResult.viewports[vp.name] = {
        width: vp.width,
        height: vp.height,
        isOverflowing: overflow.isOverflowing,
        bodyScrollWidth: overflow.bodyScrollWidth,
        docWidth: overflow.docWidth,
        culprits: overflow.culprits
      };

      if (overflow.isOverflowing) {
        console.warn(`  [FAIL] ${vp.name} (${vp.width}px): OVERFLOW detected by ${overflow.bodyScrollWidth - overflow.docWidth}px!`);
        console.warn(`    Top culprits:`, overflow.culprits);
      }

      // Save screenshot for key viewports
      if (SCREENSHOT_VIEWPORTS.includes(vp.name)) {
        const vpDir = path.join(SCREENSHOT_DIR, vp.name);
        if (!fs.existsSync(vpDir)) fs.mkdirSync(vpDir, { recursive: true });
        const screenshotPath = path.join(vpDir, `${route.name}.png`);
        try {
          await page.screenshot({ path: screenshotPath, fullPage: false });
        } catch (e) {
          // ignore screenshot errors
        }
      }
    }

    results.push(routeResult);
  }

  // Save audit results to JSON
  const reportPath = path.join(__dirname, '..', 'docs', 'responsive-testing', 'audit-results.json');
  fs.writeFileSync(reportPath, JSON.stringify({ results, errors, timestamp: new Date().toISOString() }, null, 2));

  console.log(`\nAudit completed! Results saved to ${reportPath}`);

  // Summary analysis
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  const failingRoutes = new Set();

  for (const r of results) {
    if (r.loadError) continue;
    for (const [vpName, vpData] of Object.entries(r.viewports)) {
      totalTests++;
      if (vpData.isOverflowing) {
        failedTests++;
        failingRoutes.add(`${r.route} @ ${vpName}`);
      } else {
        passedTests++;
      }
    }
  }

  console.log(`\n==========================================`);
  console.log(`SUMMARY: Total Viewport Checks: ${totalTests}`);
  console.log(`PASS: ${passedTests}`);
  console.log(`FAIL: ${failedTests}`);
  if (failedTests > 0) {
    console.log(`Failing Route / Viewport combinations:`);
    for (const item of failingRoutes) {
      console.log(` - ${item}`);
    }
  }
  console.log(`==========================================\n`);

  await browser.close();
}

main().catch(err => {
  console.error('Fatal error in audit suite:', err);
  process.exit(1);
});

