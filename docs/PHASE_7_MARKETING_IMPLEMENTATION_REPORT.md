# CartX Merchant Dashboard — Phase 7: Marketing, Promotions & Analytics Implementation Report

**Document Version:** 1.0.0  
**Completion Date:** November 2, 2026  
**Status:** Completed (High-Fidelity Demo Mode)  
**Authoritative Specification:** `CARTX_MERCHANT_DASHBOARD.md` (Module 08 & 14 / Phase 7)  
**Primary Currency:** Bangladeshi Taka (BDT ৳)  
**Locale Baseline:** `bn-BD` / `Asia/Dhaka`

---

## 1. Executive Summary

Phase 7 introduces end-to-end **Marketing, Promotions & Analytics** into the **CartX Merchant Dashboard**, empowering Bangladesh online merchants to deploy voucher campaigns, automated cart-level price reductions, urgent time-boxed flash sales drops, promotion attribution intelligence, and multi-ledger exportable reports.

Built strictly in accordance with CartX architecture:
- **Next.js 16.4.3 (App Router)** with Partial Prerendering (PPR)
- **React 19.3.0** with full React Compiler purity compliance (`useState` initialization, zero impure renders)
- **TypeScript 5.x Strict Mode** (0 compiler errors across 51 routes)
- **Tailwind CSS v4.0** with CartX design tokens (`#2563EB`, `#10B981`, `#F59E0B`, `#E11D48`, etc.)
- **shadcn/ui** accessible components and Radix UI primitives
- **TanStack Query v5** reactive cache invalidation & query keys
- **React Hook Form + Zod** schemas with custom superRefine business constraints
- **RFC-4180 CSV Engine with UTF-8 BOM (`\uFEFF`)**: natively supports Bengali characters (`শাড়ি`, `মধু`, `পোশাক`, `৳`) in Microsoft Excel and Google Sheets without encoding glitches.
- **Truthful Demo Architecture**: zero simulated live telemetry; all metrics, attribution charts, and logs are derived from deterministic browser `localStorage` records with in-memory SSR fallbacks.

---

## 2. All Created Application Routes

| Route | Page File | Component View | RBAC Permission | Prerender Type |
|---|---|---|---|---|
| `/dashboard/marketing` | `src/app/dashboard/marketing/page.tsx` | `MarketingOverviewView` | `marketing.view` | Static (○) |
| `/dashboard/marketing/coupons` | `src/app/dashboard/marketing/coupons/page.tsx` | `CouponsListView` | `discounts.manage` | Static (○) |
| `/dashboard/marketing/coupons/new` | `src/app/dashboard/marketing/coupons/new/page.tsx` | `CouponEditorView` | `discounts.manage` | Static (○) |
| `/dashboard/marketing/coupons/[couponId]/edit` | `src/app/dashboard/marketing/coupons/[couponId]/edit/page.tsx` | `CouponEditorView` | `discounts.manage` | Partial Prerender (◐) |
| `/dashboard/marketing/discounts` | `src/app/dashboard/marketing/discounts/page.tsx` | `DiscountsListView` | `discounts.manage` | Static (○) |
| `/dashboard/marketing/flash-sales` | `src/app/dashboard/marketing/flash-sales/page.tsx` | `FlashSalesView` | `discounts.manage` | Static (○) |
| `/dashboard/marketing/analytics` | `src/app/dashboard/marketing/analytics/page.tsx` | `MarketingAnalyticsView` | `marketing.view` | Static (○) |
| `/dashboard/marketing/reports` | `src/app/dashboard/marketing/reports/page.tsx` | `MarketingReportsView` | `reports.view` | Static (○) |

---

## 3. Files Created and Modified

### Created Files
- `src/features/marketing/types.ts`: Comprehensive domain types for Coupons, PromotionalDiscounts, FlashSales, MarketingAnalytics, Reports, and Activities.
- `src/features/marketing/schemas.ts`: Zod schemas for coupon creation, discount campaigns, and flash sale limits.
- `src/features/marketing/constants.ts`: Deterministic baseline presets (`EID2026`, `BOISHAKHI500`, `WELCOME10`, etc.).
- `src/features/marketing/services/mockMarketing.ts`: SSR-safe browser `localStorage` service, discount math engine, and RFC-4180 CSV export with UTF-8 BOM.
- `src/features/marketing/hooks.ts`: TanStack Query hooks for queries, mutations, and cache synchronization.
- `src/features/marketing/components/CampaignPerformanceChart.tsx`: Pure SVG interactive time-series chart with hover tooltips and dual revenue/savings metrics.
- `src/features/marketing/components/FlashSaleCountdown.tsx`: Live second-by-second countdown clock with quota progress indicators and status badges.
- `src/features/marketing/components/MarketingOverviewView.tsx`: Executive summary view with 4 KPI cards, quick actions, chart, and recent activity log.
- `src/features/marketing/components/CouponsListView.tsx`: Paginated coupons data table with clipboard copy, status filters, and deletion alert dialog.
- `src/features/marketing/components/CouponEditorView.tsx`: Full voucher configuration form with preset code prefixes and live checkout card preview.
- `src/features/marketing/components/DiscountsListView.tsx`: Automated storewide and category markdown manager with conflict warnings.
- `src/features/marketing/components/FlashSalesView.tsx`: Flash sales drops manager with real-time countdowns, inventory bounds, and stock meters.
- `src/features/marketing/components/MarketingAnalyticsView.tsx`: Attributed sales, redemption velocities, conversion rates, and top-ranking campaigns.
- `src/features/marketing/components/MarketingReportsView.tsx`: 4 tabbed report ledgers with search and direct CSV download.
- `src/app/dashboard/marketing/page.tsx`: Overview page entry point.
- `src/app/dashboard/marketing/coupons/page.tsx`: Coupons listing route.
- `src/app/dashboard/marketing/coupons/new/page.tsx`: Coupon creator route.
- `src/app/dashboard/marketing/coupons/[couponId]/edit/page.tsx`: Dynamic parameterized coupon editor route.
- `src/app/dashboard/marketing/discounts/page.tsx`: Discounts route.
- `src/app/dashboard/marketing/flash-sales/page.tsx`: Flash sales route.
- `src/app/dashboard/marketing/analytics/page.tsx`: Marketing analytics route.
- `src/app/dashboard/marketing/reports/page.tsx`: Reports route.
- `tests/phase7-marketing.test.ts`: Dedicated Vitest unit and integration suite (31 tests).
- `docs/PHASE_7_MARKETING_IMPLEMENTATION_REPORT.md`: This comprehensive implementation report.

### Modified Files
- `src/types/auth.ts`: Added `marketing.view` and `marketing.manage` permissions.
- `src/lib/permissions/rbac.ts`: Updated role-to-permission mappings for `owner`, `admin`, and `marketing_manager`.
- `src/config/navigation.ts`: Added collapsible `Marketing` navigation group with 6 verified child routes.
- `src/app/dashboard/page.tsx`: Updated architecture status card to "Phase 7 Active".
- `tests/sidebar-navigation.test.ts`: Updated route inventory assertions (8 groups, 32 verified routes).
- `README.md`: Documented Phase 7 completion, feature summaries, and route catalog.
- `FEATURE_STATUS.md`: Marked Modules 11 and 12 complete and logged Phase 7 deliverables.
- `IMPLEMENTATION_PLAN.md`: Updated roadmap status and Definition of Done verification metrics.
- `API_GAPS.md`: Documented all required Express REST contracts for marketing, promotions, flash sales, and reports.

---

## 4. Marketing Features Implemented

### 4.1 Marketing Overview (`/dashboard/marketing`)
- 4 Primary KPI metric tiles: Total Active Campaigns, Active Coupons Ready for Checkout, Attributed Sales Volume (৳), and Merchant Discount Savings Given (৳).
- Informational notice clearly disclosing Demo Mode local storage and BDT currency standard.
- 4 Quick-action navigational cards linking to Coupons, Discounts, Flash Sales, and Reports.
- Interactive SVG campaign performance trend chart comparing daily revenue against discount savings.
- Audit trail activity log attributing campaign creations and redemptions to actors with localized timestamps.
- Destructive Reset Demo Data dialog restoring factory presets.

### 4.2 Coupon Codes Management (`/dashboard/marketing/coupons`, `/new`, `/[couponId]/edit`)
- Data table displaying coupon codes in monospace uppercase badges with one-click clipboard copying.
- Search input matching code or campaign name, with status (Active, Inactive, Expired) and discount type filters.
- Support for percentage (1–100%) and fixed BDT discounts.
- Spending constraints: minimum cart order spend, maximum discount cap in Taka.
- Usage constraints: storewide usage limit, per-customer limit (default 1).
- Customer eligibility segmentation: All Customers, First-Time Customers, VIP / High-Value, Returning Repeat Customers.
- Interactive Coupon Editor with preset code generators (`EID`, `BOISHAKHI`, `SAVE`) and live real-time checkout card preview.

### 4.3 Discounts & Promotional Campaigns (`/dashboard/marketing/discounts`)
- Configurable markdown campaigns applied automatically in the customer checkout cart.
- Scope options: Storewide (entire catalog), Category-specific (with multi-select tag picker), Product-specific.
- Conflict detection callout: alerts merchants when an active storewide discount overlaps with product-level markdowns.
- Campaign metrics: Orders attributed, gross revenue generated, and total discount savings given.
- Create and edit campaign dialogs with start/end date bounds.

### 4.4 Flash Sales Engine (`/dashboard/marketing/flash-sales`)
- Visual card grid displaying high-demand flash sales drops with product thumbnails, SKUs, and regular vs flash pricing.
- Live `FlashSaleCountdown` ticker displaying Days, Hours, Minutes, Seconds with real-time `setInterval` re-computation.
- Visual inventory quota health meter tracking claimed units against allocated stock.
- Create Flash Sale dialog with store inventory product picker, auto-calculating discount percentage and validating warehouse inventory bounds.
- Overlap prevention algorithm rejecting duplicate active/scheduled flash drops for the same product during overlapping timeframes.

### 4.5 Marketing Analytics (`/dashboard/marketing/analytics`)
- 4 Core KPI cards: Attributed Revenue, Redemption Rate (%), Total Redemptions, and Discount Expenditure.
- Timeframe preset switchers: Today, Last 7 Days, Last 30 Days, Last 90 Days.
- Daily trend trajectory chart comparing attributed sales vs savings provided.
- Best-performing campaigns ranking table with checkout conversion rates.
- Top redeemed coupon codes leaderboard.
- Attribution methodology disclosure detailing first-touch order attribution and simulated conversion baselines.

### 4.6 Product & Campaign Reports with CSV Export (`/dashboard/marketing/reports`)
- 4 Tabbed report ledgers:
  1. **Product Performance Report**: SKU, title, category, units sold, gross sales, discounts, net sales, and promo orders.
  2. **Campaign Performance Report**: Campaign title, type, validity window, orders, revenue, discount given, and average order value.
  3. **Coupon Usage Report**: Voucher code, campaign, discount rate, redemptions, savings given, AOV, and last used date.
  4. **Discount Performance Report**: Rule name, scope, rate, status, orders, savings, and revenue.
- Export to CSV Engine:
  - Generates downloadable `.csv` file via dynamic client-side Object URLs.
  - Implements full RFC-4180 escaping (commas, double quotes, newlines).
  - Prepends UTF-8 Byte Order Mark (`\uFEFF`) ensuring flawless Bengali text rendering (`শাড়ি`, `মধু`, `৳`).
  - Respects active search query and active tab filters.

---

## 5. Business Rules & Validation Engine

1. **Coupon Constraints (`couponFormSchema`):**
   - Code must be 3–20 characters, uppercase alphanumeric, hyphens, and underscores.
   - Code must be unique across the tenant store (checked in schema and service).
   - Percentage discounts must be strictly between 1% and 100%.
   - Fixed discounts must be strictly positive (> ৳0).
   - Expiration date must be strictly after start date.
   - Minimum order spend and maximum discount cap cannot be negative.
   - Maximum discount cap is only allowed on percentage discounts.
2. **Promotional Discounts (`promotionalDiscountFormSchema`):**
   - Category-specific discounts require at least one target category.
   - Product-specific discounts require at least one target product.
   - End date must be strictly after start date.
3. **Flash Sales Rules (`flashSaleFormSchema`):**
   - Flash sale price must be strictly lower than regular product price.
   - Flash sale allocated stock cannot exceed available product inventory in warehouse.
   - End time must be strictly after start time.
   - Product cannot have overlapping active or scheduled flash sales.
   - Stock is not decremented from physical inventory until actual customer purchase.

---

## 6. Demo-Mode Limitations & Backend Replacement Strategy

| Feature | Demo Mode Implementation | Production Express API Requirement |
|---|---|---|
| **Coupon Validation** | Client-side check against `localStorage` | Authoritative server-side validation during checkout session creation |
| **Inventory Decrement** | Quota tracking in memory | Atomic database row locking (`SELECT FOR UPDATE`) on product stock |
| **Attributed Analytics** | Deterministic daily curve generator | Aggregated SQL analytical queries across completed order line items |
| **CSV Generation** | Client-side Blob creation (`\uFEFF` UTF-8) | Streamed CSV / background worker export for large order catalogs |

---

## 7. Required Backend API Contracts

All endpoints required for backend integration are documented in `API_GAPS.md` under Section 6:
- `GET /api/v1/marketing/coupons`
- `POST /api/v1/marketing/coupons`
- `GET /api/v1/marketing/coupons/:id`
- `PATCH /api/v1/marketing/coupons/:id`
- `DELETE /api/v1/marketing/coupons/:id`
- `POST /api/v1/marketing/coupons/validate`
- `GET /api/v1/marketing/discounts`
- `POST /api/v1/marketing/discounts`
- `PATCH /api/v1/marketing/discounts/:id`
- `DELETE /api/v1/marketing/discounts/:id`
- `GET /api/v1/marketing/flash-sales`
- `POST /api/v1/marketing/flash-sales`
- `PATCH /api/v1/marketing/flash-sales/:id`
- `DELETE /api/v1/marketing/flash-sales/:id`
- `GET /api/v1/marketing/overview`
- `GET /api/v1/marketing/analytics`
- `GET /api/v1/marketing/reports/:type`

---

## 8. RBAC Permissions Matrix

| Permission | Role Assignments | Protected Views |
|---|---|---|
| `marketing.view` | `owner`, `admin`, `marketing_manager` | `/dashboard/marketing`, `/dashboard/marketing/analytics` |
| `marketing.manage` | `owner`, `admin`, `marketing_manager` | Mutation actions across marketing entities |
| `discounts.manage` | `owner`, `admin`, `marketing_manager` | `/dashboard/marketing/coupons/*`, `/dashboard/marketing/discounts`, `/dashboard/marketing/flash-sales` |
| `reports.view` | `owner`, `admin`, `marketing_manager`, `accountant`, `inventory_manager` | `/dashboard/marketing/reports` |

---

## 9. Verification & Quality Gates Results

### 9.1 Vitest Automated Test Suite (`npm run test`)
```
✓ tests/phase4-orders-customers.test.ts (25 tests)
✓ tests/phase7-marketing.test.ts (31 tests)
✓ tests/phase5-payments-shipping.test.ts (38 tests)
✓ tests/phase2-onboarding-settings.test.ts (12 tests)
✓ tests/phase3-products-inventory.test.ts (25 tests)
✓ tests/phase6-storefront.test.ts (34 tests)
✓ tests/foundation.test.ts (7 tests)
✓ tests/sidebar-navigation.test.ts (14 tests)

Test Files  8 passed (8)
     Tests  186 passed (186) - 100% Pass Rate
```

### 9.2 TypeScript Compilation (`npm run type-check`)
```
> tsc --noEmit
Exit Code: 0 (0 errors)
```

### 9.3 ESLint Quality Rules (`npm run lint`)
```
> eslint
Exit Code: 0 (0 errors, 0 warnings)
```

### 9.4 Production Build (`npm run build`)
```
▲ Next.js 16.4.3 (Turbopack)
✓ Compiled successfully in 8.4s
✓ Running TypeScript (0 errors)
✓ Generating static pages (51/51) in 9.5s
Exit Code: 0 (51 static/PPR routes generated cleanly)
```

---

## 10. Remaining Limitations & Next Phase Roadmap

- **External Marketing Pixels (Meta Pixel, Google Tag Manager)**: Pixels and marketing script integrations will be handled in Phase 8 (Apps & Integrations).
- **Automated Customer Segmentation Sync**: Customer segments (VIP, First-Time) are queried from `mockCustomers`; full bidirectional event triggers will integrate when the backend event bus is connected.
- **Phases 8–9**: Team RBAC invitations, SaaS subscription billing, and merchant mobile app builder remain planned for future roadmap milestones per `IMPLEMENTATION_PLAN.md`.

