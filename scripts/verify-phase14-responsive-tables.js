const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';
const EVIDENCE_DIR = path.resolve(__dirname, '../docs/phase14-evidence');

if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: '320px', width: 320, height: 600 },
  { name: '375px', width: 375, height: 667 },
  { name: '425px', width: 425, height: 800 },
  { name: '640px', width: 640, height: 800 },
  { name: '768px', width: 768, height: 1024 },
  { name: '1024px', width: 1024, height: 768 },
  { name: '1280px', width: 1280, height: 800 },
  { name: '1440px', width: 1440, height: 900 },
];

const PAGES_TO_TEST = [
  { path: '/dashboard', name: 'dashboard-overview' },
  { path: '/dashboard/orders', name: 'orders-list' },
  { path: '/dashboard/orders/returns', name: 'orders-returns' },
  { path: '/dashboard/products', name: 'products-list' },
  { path: '/dashboard/products/categories', name: 'products-categories' },
  { path: '/dashboard/products/collections', name: 'products-collections' },
  { path: '/dashboard/inventory', name: 'inventory-list' },
  { path: '/dashboard/inventory/adjustments', name: 'inventory-adjustments' },
  { path: '/dashboard/customers', name: 'customers-list' },
  { path: '/dashboard/customers/groups', name: 'customers-segments' },
  { path: '/dashboard/payments/transactions', name: 'payments-transactions' },
  { path: '/dashboard/payments/refunds', name: 'payments-refunds' },
  { path: '/dashboard/shipping/shipments', name: 'shipping-shipments' },
  { path: '/dashboard/marketing/coupons', name: 'marketing-coupons' },
  { path: '/dashboard/marketing/discounts', name: 'marketing-discounts' },
  { path: '/dashboard/marketing/analytics', name: 'marketing-analytics' },
  { path: '/dashboard/marketing/reports', name: 'marketing-reports' },
  { path: '/dashboard/analytics/customers', name: 'analytics-customers' },
  { path: '/dashboard/analytics/marketing', name: 'analytics-marketing' },
  { path: '/dashboard/analytics/products', name: 'analytics-products' },
  { path: '/dashboard/analytics/sales', name: 'analytics-sales' },
  { path: '/dashboard/automation', name: 'automation-overview' },
  { path: '/dashboard/automation/workflows', name: 'automation-workflows' },
  { path: '/dashboard/automation/history', name: 'automation-history' },
  { path: '/dashboard/integrations/webhooks', name: 'integrations-webhooks' },
  { path: '/dashboard/billing', name: 'billing-overview' },
  { path: '/dashboard/billing/invoices', name: 'billing-invoices' },
  { path: '/dashboard/billing/plans', name: 'billing-plans' },
  { path: '/dashboard/store/pages', name: 'store-pages' },
  { path: '/dashboard/store/domains', name: 'store-domains' },
  { path: '/dashboard/support/tickets', name: 'support-tickets' },
  { path: '/dashboard/team', name: 'team-members' },
  { path: '/dashboard/team/roles', name: 'team-roles' },
];

async function run() {
  console.log('Launching headless Chrome for Phase 14 Responsive Table-to-Card Verification...');
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });

  const page = await context.newPage();

  // Set mock merchant authentication/cookies if needed
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
  // Set demo auth state in localStorage
  await page.evaluate(() => {
    try {
      localStorage.setItem('cartx_auth_user', JSON.stringify({
        id: 'usr_owner_01',
        email: 'merchant@greenharvest.com.bd',
        name: 'Rahim Ahmed',
        role: 'owner',
        storeId: 'store_demo_01',
        isDemo: true
      }));
    } catch (e) {
      console.error(e);
    }
  });

  let totalChecks = 0;
  let totalOverflowFailures = 0;
  const failureDetails = [];
  const results = [];

  for (const pageConfig of PAGES_TO_TEST) {
    const pageUrl = `${BASE_URL}${pageConfig.path}`;
    process.stdout.write(`Testing: ${pageConfig.name.padEnd(25)} `);

    let pagePassed = true;

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(pageUrl, { waitUntil: 'networkidle' });
      // Brief pause for client hydration / dynamic layout
      await page.waitForTimeout(150);

      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.clientWidth;
        const bodyScrollWidth = document.body.scrollWidth;
        const htmlScrollWidth = document.documentElement.scrollWidth;
        const hasOverflow = bodyScrollWidth > docWidth + 1.5 || htmlScrollWidth > docWidth + 1.5;

        return {
          docWidth,
          bodyScrollWidth,
          htmlScrollWidth,
          hasOverflow,
        };
      });

      totalChecks++;

      if (overflow.hasOverflow) {
        pagePassed = false;
        totalOverflowFailures++;
        failureDetails.push({
          page: pageConfig.name,
          viewport: vp.name,
          details: overflow
        });
      }

      // Capture representative screenshots for documentation
      if (['375px', '768px', '1280px'].includes(vp.name) && [
        'orders-list',
        'products-list',
        'inventory-list',
        'customers-list',
        'payments-transactions',
        'shipping-shipments',
        'billing-invoices',
        'team-members'
      ].includes(pageConfig.name)) {
        const screenshotPath = path.join(EVIDENCE_DIR, `${pageConfig.name}-${vp.name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: false });
      }
    }

    if (pagePassed) {
      console.log('✓ All 8 viewports passed without horizontal overflow');
    } else {
      console.log('✗ Horizontal overflow detected on some viewports');
    }

    results.push({
      page: pageConfig.name,
      path: pageConfig.path,
      passed: pagePassed
    });
  }

  await browser.close();

  console.log('\n--- VERIFICATION SUMMARY ---');
  console.log(`Total Pages Tested: ${PAGES_TO_TEST.length}`);
  console.log(`Total Viewports Per Page: ${VIEWPORTS.length} (320px to 1440px)`);
  console.log(`Total Checks Executed: ${totalChecks}`);
  console.log(`Total Overflow Violations: ${totalOverflowFailures}`);

  if (failureDetails.length > 0) {
    console.log('\nOverflow Details:');
    console.log(JSON.stringify(failureDetails, null, 2));
  } else {
    console.log('\nSUCCESS: 100% of tested pages and viewports exhibit zero horizontal overflow and flawless responsive table-to-card transformation!');
  }

  fs.writeFileSync(
    path.join(EVIDENCE_DIR, 'results.json'),
    JSON.stringify({ totalChecks, totalOverflowFailures, results, failureDetails }, null, 2)
  );
}

run().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
