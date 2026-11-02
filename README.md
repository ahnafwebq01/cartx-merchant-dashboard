# CartX Merchant Dashboard

> A multi-tenant e-commerce merchant administration panel tailored for Bangladesh online businesses, built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, and shadcn/ui.

---

## 1. Project Overview

**CartX Merchant Dashboard** is the centralized management hub for store owners on the CartX e-commerce SaaS platform. It enables merchants to configure online stores, organize product catalogs, track inventory movements, process customer orders through localized fulfillment lifecycles, and maintain comprehensive customer databases with automated segmentation.

- **Primary Currency:** Bangladeshi Taka (BDT ৳)
- **Target Market:** Bangladesh (`bn-BD` locale, `Asia/Dhaka` timezone)
- **Architecture:** Multi-tenant SaaS with tenant boundary isolation (`X-Store-Id`)
- **Authoritative Specification:** [`CARTX_MERCHANT_DASHBOARD.md`](./CARTX_MERCHANT_DASHBOARD.md)

---

## 2. Current Implementation Status (Demo Mode)

The project currently operates in **high-fidelity client-side demo mode** (Phases 1 through 7 complete, with comprehensive onboarding and public production deployment). All features use localized in-memory and browser `localStorage` persistence (`mockOnboarding`, `mockStoreSettings`, `mockOrders`, `mockCustomers`, `mockProducts`, `mockPayments`, `mockShipping`, `mockStorefront`, `mockMarketing`) with SSR-safe fallbacks and TanStack Query state synchronization. No external backend or credentials are required to run and test the complete dashboard.

- **Public Production URL:** [https://cartx-merchant-dashboard.vercel.app](https://cartx-merchant-dashboard.vercel.app)
- **Deployment Platform:** Vercel (Edge Network)
- **Demo Mode Capabilities:** 100% client-executable, zero Express backend dependencies, cross-refresh browser persistence, simulated slug registry, and one-click demo data reset.

| Milestone | Status | Details |
|---|---|---|
| **Phase 1: Architecture & Foundation** | **Completed** | Modular `src/` hierarchy, design tokens, RBAC permissions, shell layouts. |
| **Phase 2: Onboarding & Store Profile** | **Completed (Demo Mode)** | 7-step wizard (`/onboarding/*`), settings management (`/dashboard/settings`), simulated subdomain availability check, localStorage draft persistence. |
| **Phase 3: Products & Inventory** | **Completed (Demo Mode)** | Product CRUD, variant matrix, SKU generation, inventory adjustments, CSV import/export. |
| **Phase 4: Sales, Orders & Customers** | **Completed (Demo Mode)** | Order fulfillment state machine, returns, printable invoice, customer CRM, segmentation. |
| **Phase 5: Payments & Shipping Logistics** | **Completed (Demo Mode)** | bKash, Nagad, SSLCommerz, COD adapters, courier consignments (Steadfast, Pathao, RedX). |
| **Phase 6: Storefront & Domain Management** | **Completed (Demo Mode)** | Theme library, visual customizer with live canvas, custom domain FQDN setup, DNS guide, CMS & legal policies. |
| **Phase 7: Marketing, Promotions & Analytics** | **Completed (Demo Mode)** | Coupons, automatic discounts, flash sales with live countdowns, promotion analytics, and UTF-8 CSV reports. |
| **Phase 8: Team, Billing & Operations** | **Completed (Demo Mode)** | Team member management, roles & granular RBAC permissions, CartX SaaS subscription plans, usage limit progress meters, tax invoices, billing settings, Help Center knowledge base, and support ticketing. |
| **Phase 9: Mobile App Builder & Advanced** | *Pending* | White-label merchant app branding, push alerts, and webhook automation per [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md). |

---

## 3. Technology Stack

- **Framework:** [Next.js 16.4.3](https://nextjs.org/) (App Router, Partial Prerendering)
- **UI & Runtime:** [React 19.3.0](https://react.dev/)
- **Language:** TypeScript 5.x (Strict mode enabled)
- **Styling:** [Tailwind CSS v4.0](https://tailwindcss.com/) (CSS-first `@theme` variables)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) with Radix UI primitives
- **Icons:** [Lucide React](https://lucide.dev/)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Server State Management:** [TanStack Query v5](https://tanstack.com/query/latest)
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/)
- **Testing Engine:** [Vitest](https://vitest.dev/) (Unit and integration suites)

---

## 4. Key Implemented Features

### Sales & Orders (`/dashboard/orders`)
- **Order Listing:** Paginated data table with search across order numbers, customer names, phone numbers, and tracking IDs.
- **Fulfillment State Machine:** Enforces valid transitions (`pending` → `confirmed` → `processing` → `ready_to_ship` → `shipped` → `delivered`).
- **Cancellation & Restock:** Reason-validated cancellation with automated inventory restocking and movement audit logs.
- **Order Details (`/dashboard/orders/[orderId]`):** Visual progress stepper, line items breakdown, customer contact details, courier dispatch timestamps, and private staff notes.
- **Returns & Refunds (`/dashboard/orders/returns`):** Tracking of return merchandise, restocked inventory reconciliation, and refund amounts.
- **Printable Invoices:** Formatted invoice modal with browser printing (`window.print()`).
- **Bulk Operations:** Multi-order status transitions and bulk cancellations.
- **Data Export:** Export selected or filtered orders directly to CSV format.

### Customer Database & CRM (`/dashboard/customers`)
- **Customer Profiles (`/dashboard/customers/[customerId]`):** Contact info, address book, lifetime spend (৳), total orders, average order value (AOV), and purchase history.
- **Automated Segmentation (`/dashboard/customers/groups`):** Real-time categorization into New, Repeat, High-Value (VIP > ৳10,000), and Inactive segments.
- **Customer CRM Actions:** Tag management modal and merchant internal notes.
- **Bi-directional Synchronization:** Customer order counts and spend automatically synchronize with order cancellations and status changes.

### Products & Inventory (`/dashboard/products`, `/dashboard/inventory`)
- Full product CRUD with categories, collections, and variant matrix.
- 4 KPI metric cards, reorder thresholds, and visual capacity meters.
- Stock adjustments audit trail (`restock`, `return_restock`, `damaged`, `lost`, `correction`).

### Store Onboarding & Settings (`/onboarding`, `/dashboard/settings`)
- 7-step guided setup wizard with debounced store slug availability checking.
- Store profile, business registration details, and locale configuration.

### Payments & Finance (`/dashboard/payments`)
- **Gateway Adapters:** Typed provider boundaries for bKash Tokenized Checkout, Nagad Direct, SSLCommerz, and Cash on Delivery.
- **Transactions Ledger (`/dashboard/payments/transactions`):** Multi-filter search, status badges, Monospace TrxID, date ranges, and CSV export.
- **Refunds Management (`/dashboard/payments/refunds`):** Idempotent refund requests with balance checking, audit attribution, and order sync.
- **Payment Methods (`/dashboard/payments/methods`):** Gateway configuration with sandbox/live modes and zero-trust credential security.

### Shipping & Courier Logistics (`/dashboard/shipping`)
- **Courier Adapters:** Typed provider boundaries for Steadfast Courier, Pathao, and RedX.
- **Shipments Ledger (`/dashboard/shipping/shipments`):** Status tracking, courier filters, and CSV export.
- **Consignment Booking:** Automated consignment creation from eligible orders with duplicate active parcel prevention.
- **Live Tracking:** Interactive timeline stepper with location and timestamp attribution.
- **Shipping Rates (`/dashboard/shipping/settings`):** Inside Dhaka (৳60), outside Dhaka (৳120), free shipping threshold, and COD fee rules.

### Storefront & Domain Management (`/dashboard/store`)
- **Storefront Overview:** Live URL banner with one-click copy, status switch (Active, Draft, Maintenance, Offline), active theme summary, and recent audit activity trail.
- **Theme Library (`/dashboard/store/themes`):** Curated catalog with 4 distinct retail designs (Modern Commerce, Minimal Boutique, Express Superstore, Artisan Craft) with live preview and instant activation.
- **Theme Customizer (`/dashboard/store/themes/customize`):** Split-pane visual customizer with responsive viewport switchers (Desktop, Tablet, Mobile) and live real-time canvas updating via `useWatch`.
- **Domain Configuration (`/dashboard/store/domains`):** Default CartX subdomain management, custom domain registration with Zod FQDN validation, and interactive DNS setup guide (CNAME & A records).
- **CMS Pages & Legal Policies (`/dashboard/store/pages`):** Full CMS page CRUD with 4 localized Bangladesh legal templates (Privacy Policy, Terms & Conditions, 7-Day Refund Policy, Shipping Policy) and consumer protection disclaimers.

### Marketing, Promotions & Analytics (`/dashboard/marketing`)
- **Marketing Overview (`/dashboard/marketing`):** KPI summary cards (Active campaigns, coupon count, attributed revenue, discount expenditure), campaign performance chart, quick navigation actions, and recent audit activity log.
- **Coupon Management (`/dashboard/marketing/coupons`, `/new`, `/[couponId]/edit`):** Unique coupon codes with one-click copy, percentage / fixed BDT discounts, spending thresholds, maximum caps, usage limits, customer eligibility, and live voucher preview card.
- **Discounts & Promotional Campaigns (`/dashboard/marketing/discounts`):** Storewide, category-specific, and product-level automatic markdowns with conflict detection and schedule parameters.
- **Flash Sales Engine (`/dashboard/marketing/flash-sales`):** Limited-time drops with real-time countdown clocks, allocated inventory stock meters, customer purchase limits, and overlap prevention.
- **Marketing Analytics (`/dashboard/marketing/analytics`):** Multi-timeframe filters (Today, 7D, 30D, 90D), sales attribution metrics, redemption rate velocities, top-performing campaigns, and top redeemed codes.
- **Product & Campaign Reports (`/dashboard/marketing/reports`):** Tabbed analytical ledgers (Products, Campaigns, Coupons, Discounts) with instant UTF-8 BOM CSV file export for Bengali script compatibility.

### Team Management & Granular Access (`/dashboard/team`)
- **Team Directory (`/dashboard/team`):** Staff list with avatars, roles, 2FA status, activity timestamps, and member editing.
- **Role Assignment & RBAC Matrix (`/dashboard/team/roles`):** Authoritative matrix mapping 8 built-in merchant roles against 26 granular permissions (Catalog, Inventory, Orders, Finance, Storefront, Admin).
- **Invitations Lifecycle:** Send invitations with 7-day expiration, resend expired/pending invites, and simulate acceptance.
- **Store Owner Protection:** Enforces non-demotion, non-suspension, and non-deletion rules for primary store owner accounts.

### CartX Subscription & Billing (`/dashboard/billing`)
- **Subscription Overview (`/dashboard/billing`):** Current tier badge, billing frequency, renewal date, and next renewal amount in BDT (৳).
- **Resource Usage & Plan Warnings:** Real-time progress bars for Products, Staff Accounts, Orders, Storage, and Custom Domains with automatic warning banners at $\ge 70\%$ capacity.
- **Tier Comparison & Switching (`/dashboard/billing/plans`):** Starter (৳999/mo), Growth (৳2,499/mo), and Pro (৳5,999/mo) with 17% annual savings toggle and comparison table.
- **Tax Invoices Ledger (`/dashboard/billing/invoices`):** Filterable receipts ledger with printable invoice modal, BIN attribution, line items, and simulated payment retry for failed invoices.
- **Billing Settings & Payment Methods (`/dashboard/billing/settings`):** bKash Auto-Debit, Nagad, and Corporate Card tokenization management with legal entity BIN configuration.

### Help Center & Support Desk (`/dashboard/support`)
- **Knowledge Base (`/dashboard/support`):** 8 searchable Bangladesh e-commerce guides covering bKash tokenization, Steadfast & Pathao APIs, DNS routing, and COD reconciliation.
- **Categorized FAQs:** Interactive accordion solving frequent questions across account, billing, delivery, and payments.
- **Support Tickets (`/dashboard/support/tickets`, `/[ticketId]`):** Ticket submission dialog with priority badges, conversation thread with simulated CartX agent replies, and status transitions (Open, In Progress, Resolved, Closed).

---

## 5. Main Application Routes

```
/                                      # Application landing & redirect
/onboarding                            # 7-step merchant onboarding wizard
  ├── /store                           # Store identity & slug check
  ├── /business                        # Business & trade license info
  ├── /storefront                      # Theme & brand palette
  ├── /products                        # Initial product catalog setup
  ├── /payments                        # Cash on Delivery & gateway setup
  ├── /shipping                        # Dhaka / Outside Dhaka delivery fees
  └── /publish                         # Store verification & publication
/dashboard                             # Merchant overview & setup checklist
  ├── /orders                          # Sales & orders listing and filter toolbar
  │   ├── /[orderId]                   # Order details, fulfillment, invoice
  │   └── /returns                     # Returns, refunds, and restock records
  ├── /customers                       # Customer database & table
  │   ├── /[customerId]                # Customer profile & purchase history
  │   └── /groups                      # Customer automated segmentation
  ├── /products                        # Product catalog & data table
  │   ├── /new                         # 8-section product creation form
  │   ├── /[productId]/edit            # Product editor
  │   ├── /categories                  # Taxonomy categories management
  │   └── /collections                 # Merchandising collections
  ├── /inventory                       # Stocks overview & health meters
  │   └── /adjustments                 # Tamper-evident inventory movement log
  ├── /payments                        # Payments overview & KPI cards
  │   ├── /transactions                # Full payment transactions ledger
  │   ├── /methods                     # Gateway connections (bKash, Nagad, etc.)
  │   ├── /refunds                     # Refund requests & processed records
  │   └── /settings                    # Currency & webhook reference
  ├── /shipping                        # Shipping overview & logistics KPIs
  │   ├── /shipments                   # Courier consignments & tracking
  │   ├── /couriers                    # Courier network setups (Steadfast, Pathao, RedX)
  │   └── /settings                    # Delivery charges & zone rules
  ├── /store                           # Storefront overview & status
  │   ├── /themes                      # Theme library & gallery
  │   │   └── /customize               # Split-pane visual customizer & preview canvas
  │   ├── /domains                     # Custom domain setup & DNS guide
  │   └── /pages                       # CMS pages & legal policy management
  │       ├── /new                     # Create new page & legal templates
  │       └── /[pageId]/edit           # Page editor & revision
  ├── /marketing                       # Marketing overview & campaign performance
  │   ├── /coupons                     # Coupon codes listing & quick copy
  │   │   ├── /new                     # Create coupon with live voucher preview
  │   │   └── /[couponId]/edit         # Edit coupon thresholds & limits
  │   ├── /discounts                   # Automatic storewide & category markdowns
  │   ├── /flash-sales                 # Time-boxed flash drops with countdown clock
  │   ├── /analytics                   # Attributed promotion revenue & conversion trends
  │   └── /reports                     # Tabbed analytical reports & UTF-8 CSV exports
   ├── /team                            # Team members listing & invitation management
   │   └── /roles                       # 8-role x 26-permission interactive matrix
   ├── /billing                         # CartX subscription tier overview & usage meters
   │   ├── /plans                       # Plan comparison matrix & upgrade/downgrade dialog
   │   ├── /invoices                    # Invoices ledger, PDF view & simulated payment
   │   └── /settings                    # Billing contact, tax BIN & payment instruments
   ├── /support                         # Knowledge base, FAQs & system uptime badge
   │   └── /tickets                     # Support tickets ledger & creation modal
   │       └── /[ticketId]              # Ticket thread, status controls & simulated replies
  └── /settings                        # Store profile & regional preferences
```

---

## 6. Project Setup & Getting Started

### Prerequisites
- Node.js 18.18+ or 20+ (tested with Node.js 22/26)
- npm 9+

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ahnafwebq01/cartx-merchant-dashboard.git
   cd cartx-merchant-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   *Note: In the current demo mode, all features work out-of-the-box without mandatory environment variables.*

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Starts the Next.js local development server with Turbopack. |
| `npm run build` | Compiles an optimized production build and prerenders all routes. |
| `npm run start` | Runs the built production application. |
| `npm run type-check` | Executes strict TypeScript compilation (`tsc --noEmit`). |
| `npm run test` | Runs the automated test suite via Vitest (`vitest run`). |
| `npm run lint` | Runs ESLint to verify code quality and style adherence. |

---

## 8. Testing

The test suite covers foundation utilities, Zod schemas, state transitions, mathematical calculations, and service layer synchronization.

To run all unit tests:
```bash
npm run test
```

### Test Suite Structure
- `tests/foundation.test.ts` — API client configuration, error classes, RBAC permission resolution.
- `tests/phase2-onboarding-settings.test.ts` — Onboarding wizard schemas, slug validation regex, settings form logic.
- `tests/phase3-products-inventory.test.ts` — Product schemas, inventory calculations, movement logging, CSV parsing.
- `tests/phase4-orders-customers.test.ts` — Order lifecycle state machine, cancellation rules, stock restocking, customer statistics recalculation, and filters.
- `tests/phase5-payments-shipping.test.ts` — Gateway and courier adapters, transactions, refunds, shipments, and live tracking.
- `tests/phase6-storefront.test.ts` — Theme customization, domain validation, CMS pages CRUD, and truthful demo boundaries.
- `tests/phase7-marketing-analytics.test.ts` — Coupon schemas, discount calculations, flash sales, analytics, and reports.
- `tests/phase8-team-billing-operations.test.ts` — Team CRUD, invitations, role permissions, billing tiers, usage alerts, invoice settlement, and support tickets.
- `tests/sidebar-navigation.test.ts` — 11 logical navigation groups and 60 implemented dashboard routes with RBAC verification.

---

## 9. Backend Integration & Future Roadmap

When the shared CartX Express.js backend API is deployed:
- The typed API client in `src/lib/api/client.ts` will connect to live REST endpoints.
- Detailed endpoint contracts, request/response models, and remaining integration requirements are documented in [`API_GAPS.md`](./API_GAPS.md).
- Phase 5 will introduce live Bangladesh payment gateway integrations (bKash, Nagad, SSLCommerz) and courier tracking APIs (Steadfast, Pathao, RedX).

---

## 10. Documentation & Audit Reports

- [`docs/PHASE_8_IMPLEMENTATION_REPORT.md`](./docs/PHASE_8_IMPLEMENTATION_REPORT.md) — Phase 8 Implementation & Quality Verification Report (Team, Billing & Operations).
- [`docs/PHASE_7_FINAL_AUDIT_REPORT.md`](./docs/PHASE_7_FINAL_AUDIT_REPORT.md) — Phase 7 Final Comprehensive Audit Report (Marketing, Discounts & Analytics).
- [`docs/PHASE_6_UX_POLISH_AUDIT_REPORT.md`](./docs/PHASE_6_UX_POLISH_AUDIT_REPORT.md) — Comprehensive Phase 6 UI/UX Polish, Accessibility & Consistency Audit Report.
- [`PHASE_5_FINAL_AUDIT_REPORT.md`](./PHASE_5_FINAL_AUDIT_REPORT.md) — Phase 5 Final Comprehensive Audit Report (Payments & Shipping Logistics).
- [`CARTX_MERCHANT_DASHBOARD.md`](./CARTX_MERCHANT_DASHBOARD.md) — Authoritative functional specification across all 16 modules.
- [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) — Multi-phase architectural delivery plan and milestone checklist.
- [`FEATURE_STATUS.md`](./FEATURE_STATUS.md) — Living feature status matrix across modules.
- [`API_GAPS.md`](./API_GAPS.md) — Express backend REST integration contracts and missing proxy endpoints.
- [`SECURITY_CHECKLIST.md`](./SECURITY_CHECKLIST.md) — Zero-trust credential security verification.
