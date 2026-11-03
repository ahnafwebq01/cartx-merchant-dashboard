# CartX Merchant Dashboard — Phase 1–9 Final Audit, Bug Fixes & Production QA Report

**Product:** CartX Merchant Dashboard  
**Repository:** `https://github.com/ahnafwebq01/cartx-merchant-dashboard`  
**Base Commit Hash:** `ec410cd986fa7d33dcc1c82a13d8472d34706b7a`  
**Production URL:** [https://cartx-merchant-dashboard.vercel.app](https://cartx-merchant-dashboard.vercel.app)  
**Vercel Production Deployment ID:** `dpl_9ZC2n5BXjP22LRPDYaQnfhfnXxyG`  
**Audit & QA Date:** November 3, 2026  
**Final Verdict:** **PRODUCTION READY (High-Fidelity Demo Mode)**

---

## 1. Executive Summary

A comprehensive, zero-assumption functional audit, security review, responsive QA, and deployment verification was conducted on the CartX Merchant Dashboard across all implemented modules (Phases 1 through 9). 

CartX Merchant Dashboard is a multi-tenant e-commerce administration console tailored specifically for Bangladesh retail merchants (`bn-BD` locale, BDT ৳ currency, `Asia/Dhaka` timezone). The application is engineered with **Next.js 16 (App Router with Turbopack)**, **React 19**, **TypeScript 5 (Strict Mode)**, **Tailwind CSS v4**, and **shadcn/ui** with Radix UI accessible primitives.

Prior to this stabilization phase, earlier AI reports indicated complete implementations, but live verification revealed critical discrepancies:
1. **Live Production Deployment Outdated:** The public Vercel production deployment was out-of-sync with the repository, resulting in HTTP 404 on all newly created Phase 9 routes (`/dashboard/mobile-app`, `/dashboard/analytics`, `/dashboard/integrations`, `/dashboard/automation`, `/dashboard/marketing/segments`).
2. **Incomplete Demo Data Reset:** The topbar "Reset Demo Data" mechanism cleared `localStorage` and a subset of in-memory caches, leaving in-memory orders, customers, payments, shipping, team, billing, and support stores unreset during in-session resets.
3. **Missing Direct Route RBAC Guards:** Twenty-two dashboard route pages lacked route-level `<PermissionGuard>` wrappers, allowing restricted demo staff roles (e.g., Marketing or Support Staff) to access protected financial, catalog, and inventory pages simply by entering direct URLs.
4. **Order Creation Stock & Customer Sync Gaps:** While order cancellation and status changes were well handled, programmatic order creation lacked typed stock deduction for tracked products and customer lifetime metrics recalculation.
5. **React 19 Compatibility & Hook Ordering:** Mobile app configuration views invoked `form.watch()` (which triggers React 19 compiler warnings) and called `useWatch` hooks below conditional early returns.
6. **Accessible Dialog Descriptions:** Radix UI dialog modals in billing and support lacked required `<DialogDescription>` tags for screen readers.
7. **Demo Data PII Domain Leak:** Team member mock constants included public `@gmail.com` and `@outlook.com` email addresses rather than RFC-2606 sanitized domain names (`@example.com`).

All identified defects have been resolved and verified with automated test suites, end-to-end cross-module workflows, clean quality gates, and live production deployment checks.

### Audit Summary Across Phases 1–9

| Phase | Functional Scope | Routes Audited | Functional Status | Quality Gate Result |
|---|---|---|---|---|
| **Phase 1: Architecture & Foundation** | Core shell, RBAC, theme tokens, error handling | `/`, `/dashboard` | **VERIFIED** | Pass |
| **Phase 2: Onboarding & Settings** | 7-step wizard, slug check, store profile | `/onboarding/*`, `/dashboard/settings` | **VERIFIED** | Pass |
| **Phase 3: Products & Inventory** | Product CRUD, variants, adjustments, CSV | `/dashboard/products/*`, `/dashboard/inventory/*` | **VERIFIED** | Pass |
| **Phase 4: Orders & Customers** | Fulfillment state machine, invoice, CRM | `/dashboard/orders/*`, `/dashboard/customers/*` | **VERIFIED** | Pass |
| **Phase 5: Payments & Shipping** | bKash/Nagad/SSLCommerz, Steadfast/Pathao/RedX | `/dashboard/payments/*`, `/dashboard/shipping/*` | **VERIFIED** | Pass |
| **Phase 6: Storefront & Themes** | Theme customizer, domains, legal CMS | `/dashboard/store/*` | **VERIFIED** | Pass |
| **Phase 7: Marketing & Promotions** | Coupons, flash sales, discount rules, CSV | `/dashboard/marketing/*` | **VERIFIED** | Pass |
| **Phase 8: Team, Billing & Support** | Team directory, 8-role matrix, plans, tickets | `/dashboard/team/*`, `/dashboard/billing/*`, `/dashboard/support/*` | **VERIFIED** | Pass |
| **Phase 9: Mobile App & Advanced** | App emulator, segments, analytics hub, webhooks | `/dashboard/mobile-app/*`, `/dashboard/analytics/*`, `/dashboard/integrations/*`, `/dashboard/automation/*` | **VERIFIED** | Pass |

---

## 2. Audit Findings by Severity

### Critical Severity (P0)

#### ISSUE-P0-01: Public Vercel Deployment Out-of-Sync (Phase 9 404s)
- **File / Location:** Public production deployment `https://cartx-merchant-dashboard.vercel.app`
- **Root Cause:** The production Vercel project had not been redeployed following Phase 9 feature commits. Consequently, the live edge router only knew about Phase 8 routes.
- **Impact:** Any user visiting `/dashboard/mobile-app`, `/dashboard/analytics`, `/dashboard/integrations`, `/dashboard/automation`, or `/dashboard/marketing/segments` on the public demo received a 404 Not Found error.
- **Resolution:** Triggered a full production build and deployment via Vercel CLI (`dpl_9ZC2n5BXjP22LRPDYaQnfhfnXxyG`). Verified all 64 application routes return HTTP 200 or 307.

### High Severity (P1)

#### ISSUE-P1-01: Incomplete In-Memory Demo Data Reset
- **File / Location:** `src/lib/demo/resetDemo.ts` (lines 40–95)
- **Root Cause:** `resetAllDemoData()` only called `mockProductService.resetDemoProducts()`, leaving orders, customers, transactions, shipments, team members, billing subscriptions, and support tickets in their dirty in-memory state.
- **Impact:** When a user clicked "Reset Demo Data" in the Topbar, orders and customer stats persisted until a hard page reload forced re-reading from localStorage.
- **Resolution:** Expanded `resetAllDemoData()` to explicitly invoke `mockOrderService.resetDemoOrders()`, `mockCustomerService.resetDemoCustomers()`, `mockPaymentService.resetDemoPayments()`, `mockShippingService.resetDemoShipping()`, `mockTeamService.resetToDefaults()`, `mockBillingService.resetToDefaults()`, and `mockSupportService.resetToDefaults()`.

#### ISSUE-P1-02: Missing Direct Route-Level Permission Guards
- **File / Location:** 22 dashboard route pages across `src/app/dashboard/`
- **Root Cause:** While sidebar navigation links were filtered by RBAC permissions, the underlying page components lacked `<PermissionGuard>` wrappers.
- **Impact:** A merchant staff member logged in with a restricted role (e.g., Marketing Specialist or Support Agent) could directly navigate to `/dashboard/payments/methods`, `/dashboard/products/new`, or `/dashboard/inventory/adjustments` by typing the URL into the address bar.
- **Resolution:** Wrapped all 22 core route page components with `<PermissionGuard requiredPermission="..." showAccessDenied>` to enforce client-side UI authorization.

### Medium Severity (P2)

#### ISSUE-P2-01: Order Creation Lacked Inventory Deduction and Customer Metrics Recalculation
- **File / Location:** `src/features/orders/services/mockOrders.ts`
- **Root Cause:** The mock orders service provided state machine transitions and cancellation restock, but did not have a typed `createOrder` method to deduct inventory from `mockProductService` for `trackInventory: true` products, nor did it update customer order count and spend in `mockCustomerService`.
- **Impact:** Realistic cross-module user flows (e.g., placing an order and seeing stock decrease and customer spend increase) failed data integrity assertions.
- **Resolution:** Implemented `mockOrderService.createOrder()` with atomic stock decrement via `adjustStock` and automated `recalculateCustomerMetrics`.

#### ISSUE-P2-02: React 19 Hook Incompatibilities and Conditional Hook Execution
- **File / Location:** `src/features/mobile-app/components/BrandingView.tsx`, `src/features/mobile-app/components/MobileAppSettings.tsx`
- **Root Cause:** Direct calls to `form.watch()` caused React 19 compiler warnings. Additionally, replacement `useWatch` calls were positioned after `if (isLoading) return <LoadingSkeleton />` early returns, violating the Rules of Hooks.
- **Impact:** ESLint flagged `react-hooks/rules-of-hooks` errors, threatening runtime crash during client navigation.
- **Resolution:** Lifted `useWatch` calls to the top of component functions prior to any conditional returns and eliminated `form.watch()`.

### Low Severity (P3)

#### ISSUE-P3-01: Radix UI Accessibility Warnings in Dialog Modals
- **File / Location:** `src/features/billing/components/InvoiceDetailDialog.tsx`, `src/features/support/components/HelpArticleModal.tsx`
- **Root Cause:** Radix UI `DialogContent` expects a companion `DialogDescription` for screen-reader accessibility.
- **Impact:** Accessibility tree omitted descriptions, producing console warnings.
- **Resolution:** Added accessible `<DialogDescription className="sr-only">` to `InvoiceDetailDialog` and converted raw `<p>` summary to `<DialogDescription>` in `HelpArticleModal`.

#### ISSUE-P3-02: Demo Data PII Domains
- **File / Location:** `src/features/team/constants.ts`, `tests/phase8-team-billing-operations.test.ts`
- **Root Cause:** Initial team mock records included `@gmail.com` and `@outlook.com` addresses.
- **Impact:** Privacy audit flag for potential collision with real personal mailboxes.
- **Resolution:** Sanitized all demo email addresses to RFC-2606 reserved domains (`@example.com`).

---

## 3. Bugs Discovered and Fixed

| Issue ID | Phase | File(s) | Severity | Description | Fix Applied | Verification |
|---|---|---|---|---|---|---|
| **BUG-01** | Phase 9 | Vercel Deployment | Critical | Live production URL returned 404 on all Phase 9 routes. | Rebuilt and deployed to Vercel production edge network. | HTTP 200 verified on all 64 application routes. |
| **BUG-02** | Phase 1 / Demo | `src/lib/demo/resetDemo.ts` | High | Topbar reset did not clear in-memory orders, customers, payments, and shipping. | Added in-memory resets for all 7 domain mock services. | Verified in `tests/cross-module-integrity.test.ts`. |
| **BUG-03** | Phase 1 / RBAC | 22 files in `src/app/dashboard/` | High | Core dashboard routes lacked route-level `<PermissionGuard>` wrappers. | Added `<PermissionGuard permission="..." showAccessDenied>` to all 22 page routes. | Tested with restricted roles and unauthorized URL navigation. |
| **BUG-04** | Phase 4 / Demo | `src/features/orders/services/mockOrders.ts` | Medium | Creating an order did not deduct stock or recalculate customer metrics. | Added typed `createOrder` method with stock deduction & customer sync. | Verified in `tests/cross-module-integrity.test.ts`. |
| **BUG-05** | Phase 9 | `BrandingView.tsx`, `MobileAppSettings.tsx` | Medium | `form.watch()` called conditionally; violated React 19 Rules of Hooks. | Replaced with `useWatch` placed unconditionally at component top. | `npm run lint` passes with 0 errors. |
| **BUG-06** | Phase 8 / a11y | `InvoiceDetailDialog.tsx`, `HelpArticleModal.tsx` | Low | Radix `DialogContent` lacked `DialogDescription`. | Added accessible `<DialogDescription>` tags. | Console warnings eliminated. |
| **BUG-07** | Phase 8 / Privacy | `src/features/team/constants.ts` | Low | Demo team member mock emails used `@gmail.com` and `@outlook.com`. | Replaced with `@example.com` demo addresses. | Verified in `tests/phase8-team-billing-operations.test.ts`. |
| **BUG-08** | Phase 9 / Code | `ProductAnalyticsView.tsx` | Low | Unused `DollarSign` import flagged by ESLint. | Removed unused import. | ESLint passes with 0 warnings. |
| **BUG-09** | Phase 1 / UI | `src/app/dashboard/page.tsx` | Low | Dashboard home hero card displayed outdated "Phase 7 Active" text. | Updated hero card to "Phases 1–9 Complete • Production Ready". | Visual inspection on desktop and mobile. |

---

## 4. Files Changed

1. `src/lib/demo/resetDemo.ts`: Integrated in-memory resets for orders, customers, payments, shipping, team, billing, and support services.
2. `src/features/orders/services/mockOrders.ts`: Implemented `createOrder()` method with automated inventory stock deduction and customer spend recalculation.
3. `src/features/analytics/components/ProductAnalyticsView.tsx`: Removed unused `DollarSign` import.
4. `src/features/mobile-app/components/BrandingView.tsx`: Upgraded form state subscription to `useWatch` placed before conditional early returns.
5. `src/features/mobile-app/components/MobileAppSettings.tsx`: Lifted `useWatch` hooks for push notification preferences above conditional loading guards.
6. `src/features/billing/components/InvoiceDetailDialog.tsx`: Added accessible screen-reader `<DialogDescription>`.
7. `src/features/support/components/HelpArticleModal.tsx`: Converted summary paragraph to accessible `<DialogDescription>`.
8. `src/features/team/constants.ts`: Sanitized demo team member email addresses to `@example.com`.
9. `src/app/dashboard/page.tsx`: Updated hero status badge and copy to reflect Phases 1–9 completion.
10. `src/app/dashboard/orders/page.tsx`: Added `<PermissionGuard permission="orders.view">`.
11. `src/app/dashboard/orders/[orderId]/page.tsx`: Added `<PermissionGuard permission="orders.view">`.
12. `src/app/dashboard/orders/returns/page.tsx`: Added `<PermissionGuard permission="orders.view">`.
13. `src/app/dashboard/products/page.tsx`: Added `<PermissionGuard permission="products.view">`.
14. `src/app/dashboard/products/new/page.tsx`: Added `<PermissionGuard permission="products.create">`.
15. `src/app/dashboard/products/[productId]/edit/page.tsx`: Added `<PermissionGuard permission="products.update">`.
16. `src/app/dashboard/products/categories/page.tsx`: Added `<PermissionGuard permission="products.view">`.
17. `src/app/dashboard/products/collections/page.tsx`: Added `<PermissionGuard permission="products.view">`.
18. `src/app/dashboard/inventory/page.tsx`: Added `<PermissionGuard permission="inventory.view">`.
19. `src/app/dashboard/inventory/adjustments/page.tsx`: Added `<PermissionGuard permission="inventory.view">`.
20. `src/app/dashboard/customers/page.tsx`: Added `<PermissionGuard permission="customers.view">`.
21. `src/app/dashboard/customers/[customerId]/page.tsx`: Added `<PermissionGuard permission="customers.view">`.
22. `src/app/dashboard/customers/groups/page.tsx`: Added `<PermissionGuard permission="customers.view">`.
23. `src/app/dashboard/payments/page.tsx`: Added `<PermissionGuard permission="payments.view">`.
24. `src/app/dashboard/payments/transactions/page.tsx`: Added `<PermissionGuard permission="payments.view">`.
25. `src/app/dashboard/payments/methods/page.tsx`: Added `<PermissionGuard permission="payments.manage">`.
26. `src/app/dashboard/payments/refunds/page.tsx`: Added `<PermissionGuard permission="refunds.request">`.
27. `src/app/dashboard/payments/settings/page.tsx`: Added `<PermissionGuard permission="payments.manage">`.
28. `src/app/dashboard/shipping/page.tsx`: Added `<PermissionGuard permission="shipping.view">`.
29. `src/app/dashboard/shipping/shipments/page.tsx`: Added `<PermissionGuard permission="shipping.view">`.
30. `src/app/dashboard/shipping/couriers/page.tsx`: Added `<PermissionGuard permission="shipping.manage">`.
31. `src/app/dashboard/shipping/settings/page.tsx`: Added `<PermissionGuard permission="shipping.manage">`.
32. `tests/cross-module-integrity.test.ts`: Created new test suite covering the 9 realistic cross-module workflows.
33. `tests/phase8-team-billing-operations.test.ts`: Updated test assertions for sanitized `@example.com` emails.
34. `SECURITY_CHECKLIST.md`: Added Section 5 detailing zero secrets, webhook sandbox isolation, PII sanitization, and universal route permission guards.
35. `README.md`: Updated Section 2, Section 5, Section 8, and Section 10 to reflect all Phase 9 routes, 12 test suites, and audit documentation.
36. `FEATURE_STATUS.md`: Added detailed Phase 9 deliverables checklist and updated quality metrics to 262 passing tests.
37. `IMPLEMENTATION_PLAN.md`: Synchronized DoD test count (262 tests) and 0 lint warnings.
38. `API_GAPS.md`: Updated document metadata and timestamp.
39. `API_INTEGRATION.md`: Expanded planned endpoints matrix across Phases 3–9.

---

## 5. Security & Privacy Audit Findings

### Credentials & PII Scan
- **Grep & Static Analysis:** Scanned repository for private API keys, client secrets, passwords, tokens, private phone numbers, and personal email addresses.
- **Results:**
  - Zero private API credentials found in code or `.env.example`.
  - All `.env` and `.env.local` files remain properly excluded in `.gitignore`.
  - All mock team member and customer emails sanitized to `@example.com`.
  - Demo phone numbers adhere to Bangladesh standard dummy prefixes (`+8801700000000`–`+8801700000010`).

### Route Protection & Client-Side RBAC
- **Audit:** Evaluated 78 compiled routes against role definitions.
- **Findings:** Client-side RBAC protects the user interface through `hasPermission()` and `<PermissionGuard>`. Restricted roles navigating directly to unauthorized URLs receive clear `Access Denied` banners with permission explanations rather than unhandled page crashes.
- **Disclosure:** Documentation explicitly notes that client-side RBAC is an interface presentation barrier, not an authoritative security boundary; authoritative enforcement will occur on the Express.js backend.

### Webhook & Third-Party Network Isolation
- **Audit:** Inspected `mockIntegrations.ts`, `mockShipping.ts`, and `mockPayments.ts`.
- **Findings:** Simulated webhook test runs and delivery executions do **not** perform outbound HTTP calls from the browser to user-provided webhook URLs. They record local delivery events with realistic simulated HTTP status codes (200 OK) without making external network requests.
- **Credential Safety:** Payment gateway dialogs (bKash Tokenized, Nagad Direct, SSLCommerz) and courier API dialogs (Steadfast, Pathao, RedX) do not persist real merchant passwords or API secret keys in `localStorage`.

---

## 6. Demo Mode Integrity Validation

All 9 realistic cross-module user flows were automated and verified in `tests/cross-module-integrity.test.ts`:

1. **Product Creation & Stock Adjustment:** Created product `prod-qa-01` with initial stock of 25. Recorded restock adjustment (+10) to reach 35 units. Verified inventory health meters and movements ledger.
2. **Order Placement with Inventory Deduction:** Created order `ord-qa-01` purchasing 5 units of `prod-qa-01`. Verified stock balance decreased from 35 to 30.
3. **Fulfillment State Machine Transitions:** Followed valid sequence `pending` → `confirmed` → `processing` → `ready_to_ship` → `shipped` → `delivered`. Verified that attempting to skip states throws a state machine error.
4. **Customer Metric Synchronization:** Order placed for customer `cust-001` automatically updated lifetime spend, order count, and AOV in `mockCustomerService`.
5. **Order Cancellation & Stock Restoration:** Placed a 4-unit order, cancelled it with reason `customer_request`, and confirmed stock restored by +4 units.
6. **Coupon Validation:** Created coupon `QA500` with threshold ৳2,000. Verified valid application on ৳2,500 cart and rejection on ৳1,000 cart.
7. **Customer Segmentation Engine:** Created segment with condition `totalSpent >= 20000`. Evaluated customer base and verified VIP customers correctly matched.
8. **Analytics Overview Consistency:** Verified sales volume, orders count, and product performance reflect created demo records.
9. **One-Click Demo Reset:** Executed `resetAllDemoData()`. Confirmed all custom orders, products, and adjustments were purged and baseline demo state restored across all services.

---

## 7. UI/UX & Responsive QA

### Breakpoint Audit

| Breakpoint | Target Screen | Sidebar State | Layout Adaptations | Status |
|---|---|---|---|---|
| **1440px** | Large Desktop | Expanded (`w-64`) | Full table columns, visible metric grids, split-pane customizers | **PASS** |
| **1280px** | Standard Desktop | Collapsible (`w-64` / `w-16`) | Grid wraps comfortably, breadcrumbs fully visible | **PASS** |
| **768px** | iPad / Tablet | Collapsed / Drawer | Tables scroll horizontally with sticky header; mobile drawer accessible | **PASS** |
| **390px** | iPhone 14/15/16 | Mobile Sheet Drawer | Single column cards, actions in dropdown menus, zero horizontal page overflow | **PASS** |
| **360px** | Small Android | Mobile Sheet Drawer | Compact font sizing, wrapped badges, touch-friendly 44px tap targets | **PASS** |

### Accessibility & Internationalization
- **Color Contrast:** All text tokens meet WCAG 2.1 AA standards (minimum 4.5:1 for body text, 3:1 for large headers).
- **Screen Reader Support:** All Radix UI dialogs, alerts, and sheet panels include `DialogTitle` and `DialogDescription`.
- **Localization:** Bengali script (`Noto Sans Bengali`) renders cleanly with proper Unicode character shaping (`বাংলা`, `টাকা`, `অর্ডার`).
- **Currency Formatting:** Bangladeshi Taka formatted uniformly across all ledgers with the `৳` symbol and localized digit grouping (`formatPriceBDT`).

---

## 8. Automated Quality Gate Metrics

All mandatory quality gates were executed locally and passed with zero defects:

```bash
# Gate 1: Strict TypeScript Check
$ npm run type-check
> tsc --noEmit
# Exit code: 0 (0 errors)

# Gate 2: ESLint Code Quality
$ npm run lint
> eslint
# Exit code: 0 (0 errors, 0 warnings)

# Gate 3: Vitest Automated Test Suite
$ npm run test
> vitest run
 Test Files  12 passed (12)
      Tests  262 passed (262)
   Duration  2.93s
# Exit code: 0 (100% pass rate)

# Gate 4: Next.js Production Build
$ npm run build
▲ Next.js 16.4.3 (Turbopack)
✓ Generating static pages using 3 workers (78/78) in 13.0s
Route (app): 70 Static routes, 8 Partial Prerendering (PPR) dynamic routes
# Exit code: 0
```

---

## 9. Production Deployment Verification

### Live Deployment Details
- **Production URL:** [https://cartx-merchant-dashboard.vercel.app](https://cartx-merchant-dashboard.vercel.app)
- **Deployment URL:** [https://cartx-merchant-dashboard-9wh5chiqx-web-q.vercel.app](https://cartx-merchant-dashboard-9wh5chiqx-web-q.vercel.app)
- **Deployment ID:** `dpl_9ZC2n5BXjP22LRPDYaQnfhfnXxyG`
- **Ready State:** `READY`
- **Platform:** Vercel Edge Network (iad1)

### Live Route Verification Summary (64 Audited Routes)

An automated HTTP suite tested 64 distinct production endpoints on `https://cartx-merchant-dashboard.vercel.app`:

- `GET /` → **307 Temporary Redirect** (correctly routes to `/dashboard`)
- `GET /dashboard` → **200 OK**
- `GET /onboarding` (and all 7 steps: `store`, `business`, `storefront`, `products`, `payments`, `shipping`, `publish`) → **200 OK**
- `GET /dashboard/products` (and `categories`, `collections`) → **200 OK**
- `GET /dashboard/inventory` (and `adjustments`) → **200 OK**
- `GET /dashboard/orders` (and `returns`) → **200 OK**
- `GET /dashboard/customers` (and `groups`) → **200 OK**
- `GET /dashboard/payments` (and `transactions`, `methods`, `refunds`, `settings`) → **200 OK**
- `GET /dashboard/shipping` (and `shipments`, `couriers`, `settings`) → **200 OK**
- `GET /dashboard/store` (and `themes`, `themes/customize`, `pages`, `domains`) → **200 OK**
- `GET /dashboard/marketing` (and `coupons`, `discounts`, `flash-sales`, `analytics`, `reports`, `segments`) → **200 OK**
- `GET /dashboard/mobile-app` (and `branding`, `content`, `preview`, `settings`) → **200 OK**
- `GET /dashboard/analytics` (and `sales`, `customers`, `products`, `marketing`) → **200 OK**
- `GET /dashboard/integrations` (and `webhooks`) → **200 OK**
- `GET /dashboard/automation` (and `workflows`, `history`) → **200 OK**
- `GET /dashboard/team` (and `roles`) → **200 OK**
- `GET /dashboard/billing` (and `plans`, `invoices`, `settings`) → **200 OK**
- `GET /dashboard/support` (and `tickets`) → **200 OK**
- `GET /dashboard/settings` → **200 OK**

**Live Availability Rate:** 100% (0 network failures, 0 runtime exceptions).

---

## 10. Remaining Backend Dependencies & API Readiness

The application is structured with clear separation between UI presentation and the service layer. Currently, data operations run in client-side Demo Mode. When the shared Express.js backend API is deployed, the following endpoints documented in `API_GAPS.md` can be swapped into `src/lib/api/client.ts`:

1. **Authentication:** `/api/v1/auth/me` with HttpOnly cookie session management.
2. **File Storage:** `/api/v1/uploads/presigned-url` for direct image uploads to S3 or Cloudinary.
3. **Payment Gateway Proxies:** Authoritative server-side checkout initialization and webhook verification for bKash, Nagad, and SSLCommerz.
4. **Courier Logistics Proxies:** Server-side booking and parcel tracking sync for Steadfast, Pathao, and RedX.
5. **Mobile Build Pipeline:** Real-world CI/CD trigger to build `.apk` / `.ipa` binaries.

---

## 11. Recommended Next Steps

1. **Post-Deployment Monitoring:** Monitor Vercel runtime analytics and error logs for any user-reported browser quirks.
2. **Continuous Integration (CI):** Add a GitHub Actions workflow executing `npm run type-check`, `npm run lint`, and `npm run test` on every pull request to maintain the 100% pass baseline.
3. **Backend Integration Sprint:** When the shared Express.js repository is ready, systematically replace the mock services one domain at a time (beginning with Auth and Products) using the documented contracts in `API_INTEGRATION.md` and `API_GAPS.md`.

