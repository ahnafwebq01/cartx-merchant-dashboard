# CartX Merchant Dashboard — Feature Status Matrix

**Document Purpose:** Living feature status tracking across all 16 dashboard modules defined in `CARTX_MERCHANT_DASHBOARD.md`.  
**Last Updated:** October 31, 2026 (Phase 4 Final Audit & Repository Verification)  

| # | Module / Capability | Documented Route | Planned Phase | Current Status | Notes |
|---|---|---|---|---|---|
| **00** | **Project Setup & Architecture** | `/` | **Phase 1** | **COMPLETED** | `src/` modular layout, Tailwind v4 tokens, shadcn/ui, API client, auth context, layout shell. |
| **01** | **Overview (Dashboard Home)** | `/dashboard` | **Phase 1 / 2** | **COMPLETED** | Layout shell, collapsible sidebar (21st.dev inspired), status KPI cards, setup checklist. Real metrics in Phase 4. |
| **02** | **Store Onboarding Wizard** | `/onboarding/*` | **Phase 2** | **COMPLETED (Demo Mode)** | 7-step wizard (identity, business, storefront, products, payments, shipping, publish) with debounced slug check, simulated registry, and localStorage persistence. |
| **03** | **Settings & Store Profile** | `/dashboard/settings` | **Phase 2** | **COMPLETED (Demo Mode)** | Store profile, business info, contacts, BDT locale, RBAC permission guards, and TanStack Query sync with Demo Mode fallback. |
| **04** | **Products Management** | `/dashboard/products` | **Phase 3** | **COMPLETED (Demo Mode)** | Full CRUD, categories, collections, variants, SKU generator, CSV import/export, local persistence. |
| **05** | **Stocks & Inventory** | `/dashboard/inventory` | **Phase 3** | **COMPLETED (Demo Mode)** | Stock adjustments (restock, damaged, lost, correction), health meters, movement audit logs. |
| **06** | **Sales & Orders** | `/dashboard/orders` | **Phase 4** | **COMPLETED (Demo Mode)** | Order listing, details, fulfillment lifecycle, timeline, printable invoice, status state machine. |
| **07** | **Customers Database** | `/dashboard/customers` | **Phase 4** | **COMPLETED (Demo Mode)** | Customer profiles, tags, groups, lifetime value metrics, purchase history, and notes. |
| **08** | **Payments & Finance** | `/dashboard/payments` | **Phase 5** | **COMPLETED (Demo Mode)** | bKash, Nagad, SSLCommerz, COD adapters, transactions ledger, refunds, payment method configuration. |
| **09** | **Shipping & Delivery** | `/dashboard/shipping` | **Phase 5** | **COMPLETED (Demo Mode)** | Steadfast, Pathao, RedX courier adapters, consignments, live tracking stepper, shipping rates & zones. |
| **10** | **Online Store & Themes** | `/dashboard/store` | **Phase 6** | **COMPLETED (Demo Mode)** | Theme library, visual customizer, custom domain setup, DNS instructions, CMS pages, legal templates. |
| **11** | **Marketing & Promotions** | `/dashboard/marketing` | **Phase 7** | **COMPLETED (Demo Mode)** | Coupons, automatic discounts, flash sales with countdowns, marketing overview. |
| **12** | **Analytics & Reports** | `/dashboard/marketing/analytics`, `/dashboard/marketing/reports` | **Phase 7** | **COMPLETED (Demo Mode)** | Attribution analytics, trend charts, 4 report ledgers, RFC-4180 UTF-8 CSV exports. |
| **13** | **Team & Permissions** | `/dashboard/team` | **Phase 8** | **COMPLETED (Demo Mode)** | Team members, invitations lifecycle, role assignments (8 roles x 26 permissions matrix). |
| **14** | **Subscription & Billing** | `/dashboard/billing` | **Phase 8** | **COMPLETED (Demo Mode)** | CartX SaaS subscription plans, usage limit meters, invoices PDF view, simulated payments. |
| **15** | **Support & Help Center** | `/dashboard/support` | **Phase 8** | **COMPLETED (Demo Mode)** | Bangladesh e-commerce guides, categorized FAQs, support tickets CRUD, simulated chat thread. |
| **16** | **Mobile App Builder** | `/dashboard/mobile-app` | Phase 9 | Pending | White-label merchant app branding and push alerts. |

---

## Detailed Phase 3 Implementation Deliverables (Products & Inventory)

- [x] **Products Data Table & Management** (`/dashboard/products`):
  - [x] Responsive data table with row selection checkboxes, product thumbnail, SKU badge, BDT pricing with discount display, stock badge, status badge, updated date, and dropdown actions.
  - [x] Status filter tabs (All, Active, Draft, Archived).
  - [x] Search input filtering across title, SKU, category, and brand.
  - [x] Category dropdown filter and Stock level filter (In Stock, Low Stock, Out of Stock).
  - [x] Multi-column sorting (Newest, Oldest, Price: Low-High, Price: High-Low, Stock: Low-High, Title: A-Z).
  - [x] Pagination controls with rows-per-page selector (5, 10, 20, 50).
  - [x] Bulk actions bar (Bulk Archive, Bulk Delete with alert dialog confirmation).
  - [x] Quick View modal (`ProductDetailsModal`) showing full specifications, images, and variants.
  - [x] CSV Catalog Export & CSV Bulk Import parser with duplicate SKU detection and error reporting.
  - [x] Reset Demo Data confirmation dialog restoring baseline 12 Bangladeshi products.
- [x] **Product Creation & Editing Forms** (`/dashboard/products/new`, `/dashboard/products/[productId]/edit`):
  - [x] 8-section form: Basic Information, Media (with 8 curated Bangladesh demo presets), BDT Pricing & profit margin calculator, Inventory tracking & SKU auto-generator, Variants matrix, Shipping weight, SEO metadata, and Publishing status.
  - [x] Zod validation schema + React Hook Form.
  - [x] Route wrapped in `<Suspense>` for seamless Next.js 16 Partial Prerendering (PPR).
- [x] **Categories & Collections Management** (`/dashboard/products/categories`, `/dashboard/products/collections`):
  - [x] Taxonomy listing table with product counts, slugs, and descriptions.
  - [x] Add Category dialog with auto-slug generator.
  - [x] Collections manager for seasonal and promotional merchandising groups (Eid Collection, New Arrivals, Best Sellers).
- [x] **Stocks & Inventory Overview** (`/dashboard/inventory`):
  - [x] 4 KPI Metric Cards (Total Tracked Products, Units in Stock, Low Stock Alerts, Out of Stock Items).
  - [x] Stock Table with 21st.dev-inspired visual stock health / capacity meter bars (green/amber/red).
  - [x] Reorder threshold monitors and status badges.
- [x] **Stock Adjustments & Audit Trail** (`/dashboard/inventory/adjustments`):
  - [x] Tamper-evident movement log recording timestamp, product, SKU, adjustment type, quantity change (+/-), before/after stock balance, reason, reference ID, and actor.
  - [x] Quick Stock Adjustment modal (`StockAdjustmentDialog`) with live calculation preview and 5 adjustment types (Restock, Return Restock, Damaged, Lost, Manual Correction).
- [x] **Collapsible Sidebar Layout (21st.dev reference pattern)**:
  - [x] Enhanced `Sidebar.tsx` and `DashboardLayout.tsx` supporting smooth collapse between `w-64` and `w-16`.
  - [x] Icon-only collapsed mode with shadcn `Tooltip` overlays showing titles and nested subitems.
  - [x] Collapse/expand toggle button in sidebar footer.
- [x] **Unit Testing & QA**:
  - [x] Created `tests/phase3-products-inventory.test.ts` (25 automated tests covering schemas, CRUD, stock adjustments, pagination clamping, dynamic categories, collections persistence, safe storage parsing, and CSV import/export).
  - [x] 44/44 tests passing across Phase 3 baseline.

---

## Detailed Phase 4 Implementation Deliverables (Sales & Orders, Customers)

- [x] **Orders Data Table & Workflow** (`/dashboard/orders`):
  - [x] Responsive data table with selection checkboxes, order number monospace link, BD date/time, customer details, line item previews, payment badges, fulfillment badges, BDT total (৳), and row actions.
  - [x] Order status tabs (All, Pending, Processing, In Transit, Delivered, Cancelled / Returns).
  - [x] Multi-field search (order ID, customer name, phone, courier tracking ID, item title/SKU).
  - [x] Filters for payment status (Paid, Unpaid, Pending, Refunded), payment method (COD, bKash, Nagad, SSLCommerz, Bank), courier (Steadfast, Pathao, RedX, Paperfly), and date timeframe presets.
  - [x] Multi-column sorting (Date, Total, Order #) and pagination controls with rows-per-page selector (5, 10, 20, 50).
  - [x] Bulk actions bar (Mark as Confirmed, Mark as Processing, Export CSV, Bulk Cancel with confirmation dialog).
  - [x] CSV Catalog Export for orders.
  - [x] Reset Demo Data dialog restoring baseline 15 Bangladeshi orders.
- [x] **Order Details & Fulfillment Lifecycle** (`/dashboard/orders/[orderId]`):
  - [x] Dynamic route wrapped in `<Suspense>` for Next.js 16 Partial Prerendering (PPR).
  - [x] 21st.dev-inspired visual fulfillment journey stepper (Placed -> Confirmed -> Processing -> Packed -> Shipped -> Delivered) and vertical audit trail event log.
  - [x] Ordered items card with product thumbnail fallback, SKU badge, variant display, unit price, quantity, and line total.
  - [x] Financial summary card with subtotal, discount, courier shipping fee, grand total, amount paid, and amount due.
  - [x] Customer details card with phone dial link, email, delivery address, and direct link to customer profile.
  - [x] Logistics card with courier name, tracking number, estimated delivery, and dispatch timestamps.
  - [x] Private internal staff notes card with note addition form and actor/timestamp attribution.
  - [x] Strict status transition engine enforcing valid lifecycle transitions, restock rules, and cancellation reason validation.
  - [x] Professional Bangladesh merchant printable invoice modal (`window.print()`).
- [x] **Returns & Refunds Management** (`/dashboard/orders/returns`):
  - [x] Dedicated return tracking table displaying return reasons, refund status, restocked inventory counts, and return value.
- [x] **Customer Database & Segmentation** (`/dashboard/customers`, `/dashboard/customers/[customerId]`, `/dashboard/customers/groups`):
  - [x] Customer listing table with avatars, phone numbers, total orders, lifetime spend (৳), AOV (৳), last order date, tags, and profile navigation.
  - [x] 21st.dev-inspired customer profile card (#7093) with contact shortcuts, addresses, metrics tiles, customer tags management modal, and private staff notes.
  - [x] Order history table linking customer directly to their placed orders.
  - [x] Automated segmentation into New, Repeat, High-Value / VIP, and Inactive customer groups.
  - [x] Real-time customer metric recalculation synchronized with order lifecycle events (total orders, total spend, AOV).
- [x] **Automated Testing & Quality Gates**:
  - [x] Created `tests/phase4-orders-customers.test.ts` with 25 unit tests covering Zod schemas, state machine transitions, cancellation restock rules, customer sync, search, filters, sorting, clamped pagination, CSV export, and demo reset.
  - [x] **69 / 69 unit tests passing** across Phase 4 baseline.

---

## Detailed Phase 5 Implementation Deliverables (Payments & Logistics)

- [x] **Payments & Finance Dashboard** (`/dashboard/payments`, `/dashboard/payments/transactions`, `/dashboard/payments/methods`, `/dashboard/payments/refunds`, `/dashboard/payments/settings`):
  - [x] 4 KPI Cards: Gross Settled Volume (৳), Pending Payments, Refunds Processed (৳), Active Gateways.
  - [x] Paginated transactions table with search, status tabs (All, Successful, Pending, Failed, Refunded), gateway filter (bKash, Nagad, SSLCommerz, COD), date presets, and CSV export.
  - [x] Transaction details modal (`PaymentTransactionDetailsModal`) with TrxID, order link, customer info, and demo verification trigger.
  - [x] Payment methods configuration (`PaymentMethodCard`, `ConfigurePaymentMethodDialog`) with environment toggles (Sandbox/Live) and zero-trust credential notice.
  - [x] Refunds management table (`RefundsTable`) and request refund dialog (`RequestRefundDialog`) with available balance validation and idempotency protection.
  - [x] Payment settings view with platform currency rules (BDT ৳) and official IPN/webhook callback endpoints.
- [x] **Payment Provider Adapters Architecture**:
  - [x] bKash Tokenized Checkout adapter (`BkashPaymentAdapter`) simulating createPayment, executePayment, and demo OTP/PIN callbacks.
  - [x] Nagad Direct Checkout adapter (`NagadPaymentAdapter`) with payment reference ID and challenge URL boundaries.
  - [x] SSLCommerz Gateway adapter (`SslcommerzPaymentAdapter`) with session keys, gateway redirect URLs, and Order Validation IPN handling.
  - [x] Cash on Delivery adapter (`CodPaymentAdapter`) preserving core Bangladesh COD fulfillment workflows.
  - [x] Central adapter registry (`paymentAdapterRegistry`).
- [x] **Shipping & Courier Logistics Dashboard** (`/dashboard/shipping`, `/dashboard/shipping/shipments`, `/dashboard/shipping/couriers`, `/dashboard/shipping/settings`):
  - [x] 4 KPI Cards: In Transit Parcels, Successfully Delivered, Pending Pickup, Active COD to Collect (৳).
  - [x] Paginated shipments table with status tabs, courier filter (Steadfast, Pathao, RedX), search, pagination, and CSV export.
  - [x] Consignment details and tracking timeline modal (`ShipmentDetailsModal`) with interactive transit stepper and cancellation safety.
  - [x] Consignment creation workflow (`CreateShipmentDialog`) pre-filled from eligible orders with duplicate active parcel prevention.
  - [x] Courier connection settings (`CourierCard`, `ConfigureCourierDialog`) with default warehouse pickup addresses.
  - [x] Shipping zones & delivery rates settings (`ShippingRatesForm`) for Dhaka (৳60), Outside Dhaka (৳120), free shipping threshold, and COD fee.
- [x] **Courier Provider Adapters Architecture**:
  - [x] Steadfast Courier adapter (`SteadfastCourierAdapter`) normalizing raw statuses (`in_review`, `in_transit`, `delivered`, `cancelled`).
  - [x] Pathao Courier adapter (`PathaoCourierAdapter`) normalizing Merchant API statuses (`Pickup_Requested`, `Picked_Up`, `In_Transit`, `Delivered`).
  - [x] RedX Delivery adapter (`RedxCourierAdapter`) normalizing Parcel API statuses (`ready_for_pickup`, `pickup_done`, `in_transit`, `delivered`).
  - [x] Central adapter registry (`courierAdapterRegistry`).
- [x] **Cross-Module Order Integration**:
  - [x] Order details (`/dashboard/orders/[orderId]`) logistics card enhanced with live shipment tracking and consignment creation shortcut.
  - [x] Financial summary card integrated with transaction references, refund status, and gateway refund trigger.
  - [x] Strict invariant preservation: payment verification does NOT imply delivery; consignment creation does NOT imply delivery.
- [x] **Automated Testing & Quality Gates**:
  - [x] Created `tests/phase5-payments-shipping.test.ts` with 37 tests covering schemas, adapters, duplicate prevention, idempotency, refunds, status normalization, cancellation rules, and order integration.
  - [x] **106 / 106 automated tests passing** across entire repository test suite (100% pass rate).
  - [x] **0 ESLint errors**; **0 TypeScript errors**; **36 / 36 routes** prerendered cleanly via Turbopack build.

---

## Detailed Phase 6 Implementation Deliverables (Storefront & Domain Management)

- [x] **Storefront Overview Dashboard** (`/dashboard/store`):
  - [x] Storefront publishing state selector (Active, Draft, Maintenance, Offline).
  - [x] Store URL preview banner with one-click copy and live storefront external link.
  - [x] Active theme preview card with thumbnail, version badge, color palette swatches, typography, and customization shortcut.
  - [x] 4 KPI Cards: Storefront State, Current Theme, Published CMS Pages, Custom Domain status.
  - [x] Navigation shortcuts to Theme Customizer, Pages, Domains, and Store Settings.
  - [x] Domain configuration summary and recent storefront activity audit log.
  - [x] Reset Demo Data dialog with AlertDialog confirmation.
- [x] **Theme Library & Visual Customizer** (`/dashboard/store/themes`, `/dashboard/store/themes/customize`):
  - [x] Curated 4-theme gallery (Modern Commerce, Minimal Boutique, Express Superstore, Artisan Craft) with responsive cards, tags, and feature pills.
  - [x] Theme preview modal with full feature list and typography/color breakdown.
  - [x] Instant theme activation with query cache invalidation and toast feedback.
  - [x] Theme Customizer interface with 4 control tabs: Colors & Presets, Typography (Bengali & English fonts), Homepage Sections (Announcement, Hero, Categories, Products, Promo Banner, Trust Badges), and Header/Logo.
  - [x] Split-pane interactive Live Storefront Preview canvas with responsive viewport switchers: Desktop (100%), Tablet (768px), and Mobile (375px).
  - [x] Real-time preview synchronization via React Hook Form `useWatch`.
  - [x] Reset customizations to theme defaults with alert confirmation.
- [x] **Domain Management & DNS Guide** (`/dashboard/store/domains`):
  - [x] Default CartX storefront subdomain (`green-harvest.cartx.com.bd`) with permanent Active status and wildcard SSL.
  - [x] Custom domain registration form with Zod FQDN validation (rejects protocols, paths, spaces, and reserved domains).
  - [x] Domain routing data table displaying domain name, type, connection status, SSL status, and target value.
  - [x] Truthful Demo Mode Presentation: custom domains remain explicitly labeled as *Demo Mode — Verification Pending* and SSL as *Demo / Not Active*.
  - [x] Explicit security callout: DNS checks and SSL certificates are never fabricated without authoritative Express backend integration.
  - [x] Interactive DNS instructions modal with copyable CNAME (`cname.cartx.com.bd`) and A record (`104.21.45.120`) rows and Bangladesh registrar advice.
  - [x] Custom domain removal with `AlertDialog` confirmation.
- [x] **CMS Pages & Legal Policies** (`/dashboard/store/pages`, `/dashboard/store/pages/new`, `/dashboard/store/pages/[pageId]/edit`):
  - [x] CMS pages listing table with status tabs (All, Published, Draft, Legal Policies), search, and row actions.
  - [x] 4 Pre-configured Bangladesh E-Commerce Legal Templates: Privacy Policy, Terms & Conditions, 7-Day Refund & Return Policy, and Shipping Policy.
  - [x] Mandatory Legal Disclaimer Notice prominently featured in all legal policies.
  - [x] Full page editor supporting title, auto-slug generator, Markdown content, publishing toggle, and SEO metadata.
  - [x] Page preview modal with rendered Markdown styling.
  - [x] Destructive page deletion with `AlertDialog` confirmation.
- [x] **Sidebar Navigation & RBAC**:
  - [x] Integrated Storefront navigation group with 4 nested items (Store Overview, Themes & Customization, Pages, Domains).
  - [x] Protected under `storefront.manage` permission boundary.
  - [x] Active subroute highlighting for deep routes (`/themes/customize`, `/pages/new`, `/pages/[pageId]/edit`).
- [x] **Automated Testing & Verification**:
  - [x] Created `tests/phase6-storefront.test.ts` with 34 tests covering domain validation, page CRUD, theme customization, truthful demo boundaries, and legal disclaimers.
  - [x] Updated `tests/sidebar-navigation.test.ts` covering 7 logical navigation groups and 26 implemented dashboard routes.
  - [x] **154 / 154 automated unit tests passing** (100% pass rate).
  - [x] **0 ESLint errors**; **0 TypeScript errors**; **43 / 43 routes** compiled and prerendered cleanly.

---

## Detailed Phase 7 Implementation Deliverables (Marketing, Promotions & Analytics)

- [x] **Marketing Overview Dashboard** (`/dashboard/marketing`):
  - [x] 4 KPI Cards: Total Active Campaigns, Active Coupon Count, Attributed Sales Revenue (৳), and Total Discount Savings Given (৳).
  - [x] Demo mode informational banner detailing local browser persistence and BDT currency rules.
  - [x] Quick action navigation cards for Coupons, Discounts, Flash Sales, and Reports.
  - [x] Interactive SVG campaign trend chart comparing attributed revenue vs merchant discount savings.
  - [x] Recent marketing activities log with actor, action type, and localized timestamps.
  - [x] Reset demo data modal protected by `AlertDialog` restoring baseline presets.
- [x] **Coupon Codes Management** (`/dashboard/marketing/coupons`, `/new`, `/[couponId]/edit`):
  - [x] Responsive data table with uppercase code badge, one-click clipboard copy with toast feedback, discount value, min spend, max discount cap, usage counts, and validity windows.
  - [x] Filter toolbar with real-time search across code/campaign, status filter (All, Active, Inactive, Expired), and discount type filter (Percentage vs Fixed).
  - [x] Coupon editor (`/new` and `/[couponId]/edit`) with preset code generators (`EID`, `BOISHAKHI`, `SAVE`).
  - [x] Live interactive simulated coupon ticket preview updating in real-time.
  - [x] Strict Zod validation: uppercase alphanumeric code uniqueness, 1–100% percentage limits, positive fixed discounts, expiration > start date, and non-negative thresholds.
  - [x] Status activation toggles and destructive delete confirmation alert dialog.
- [x] **Discounts & Automatic Markdown Campaigns** (`/dashboard/marketing/discounts`):
  - [x] Storewide, category-specific, and product-level promotional markdowns applied dynamically at checkout.
  - [x] Promotional campaign creation & edit dialogs with category tag selectors.
  - [x] Conflict prevention callout warning merchants about overlapping storewide and product discount rules.
  - [x] Status filters (Active, Scheduled, Ended, Draft) and scope filters.
- [x] **Flash Sales Drop Engine** (`/dashboard/marketing/flash-sales`):
  - [x] Time-boxed flash deals with responsive card grid.
  - [x] Real-time live ticker countdown component (`FlashSaleCountdown`) displaying Days, Hours, Minutes, Seconds with live `setInterval` updates.
  - [x] Visual stock meter bar tracking claimed quota vs allocated units.
  - [x] Create Flash Sale dialog with product inventory picker and auto-calculated discount percentage.
  - [x] Strict business rule validation: discounted price < regular price, allocated stock <= available warehouse inventory, end time > start time, and active/scheduled product overlap prevention.
- [x] **Marketing Analytics** (`/dashboard/marketing/analytics`):
  - [x] 4 KPI Cards: Attributed Revenue (৳), Coupon Redemption Rate (%), Total Redemptions, and Discount Expenditure (৳).
  - [x] Date preset filters: Today, Last 7 Days, Last 30 Days, Last 90 Days.
  - [x] Campaign performance trend line chart with interactive tooltip inspection.
  - [x] Best-performing campaigns ranking table with checkout conversion rates.
  - [x] Top redeemed coupon codes table with cumulative customer savings.
  - [x] Attribution methodology callout clearly documenting demo-mode multi-touch attribution calculations.
- [x] **Product & Campaign Reports with CSV Export** (`/dashboard/marketing/reports`):
  - [x] Tabbed analytical reports: Product Performance, Campaign Performance, Coupon Usage, and Discount Rules.
  - [x] Real-time search across ledgers and date range context.
  - [x] RFC-4180 compliant CSV export engine with proper quotes escaping for commas, newlines, and double quotes.
  - [x] Native UTF-8 BOM (`\uFEFF`) prefix ensuring Excel & Google Sheets display Bengali product titles (`শাড়ি`, `মধু`, `৳`) correctly without corruption.
- [x] **Sidebar Navigation & RBAC Integration**:
  - [x] Added new collapsible `Marketing` navigation group with 6 implemented routes in `src/config/navigation.ts`.
  - [x] Permissions integration (`marketing.view`, `marketing.manage`, `discounts.manage`, `reports.view`).
  - [x] Active parent highlighting and deep route expansion.
- [x] **Automated Testing & Verification**:
  - [x] Created `tests/phase7-marketing.test.ts` with 31 automated tests covering coupon validation, code uniqueness, discount calculations, flash sales constraints, overlap prevention, analytics metrics, and RFC-4180 CSV generation.
  - [x] Updated `tests/sidebar-navigation.test.ts` covering 8 navigation groups and 32 implemented dashboard routes.
  - [x] **186 / 186 automated unit tests passing** (100% pass rate).
  - [x] **0 ESLint errors**; **0 TypeScript errors**; **51 / 51 routes** compiled and prerendered cleanly.

---

---

## Detailed Phase 8 Implementation Deliverables (Team, Billing & Support Operations)

- [x] **Team Management & Role-Based Access Control** (`/dashboard/team`, `/dashboard/team/roles`):
  - [x] Responsive team members data table with user avatars, emails, status badges (Active, Inactive, Suspended), role badges, joined dates, and last login timestamps.
  - [x] KPI Summary Cards: Total Staff, Active Members, Pending Invites, and Security Admins.
  - [x] Tabbed views for Active Team Members vs Pending Invitations.
  - [x] Invite Member Dialog with React Hook Form + Zod schema, email validation, role selector (8 merchant roles), and expandable granular permission overrides.
  - [x] Full invitation lifecycle management: Pending, Accepted, Expired, Cancelled, and Resend actions.
  - [x] Edit Member Dialog with role adjustment, active status toggle, and custom permission checkboxes.
  - [x] Safe member removal with destructive `AlertDialog` confirmation and Store Owner protection (owner cannot be demoted or deleted).
  - [x] Interactive Roles & Permissions matrix view (`/dashboard/team/roles`) mapping 8 roles (Owner, Admin, Store Manager, Order Manager, Inventory Manager, Support Agent, Marketing Specialist, Read-Only Staff) against 26 granular permissions grouped into 7 domains.
- [x] **Billing & Subscription Management** (`/dashboard/billing`, `/plans`, `/invoices`, `/settings`):
  - [x] Current plan overview hero card displaying tier badge, price in BDT (৳), billing cycle, renewal date, and upgrade action.
  - [x] Usage limit tracking with accessible `Progress` bars across 4 key metrics: Products, Monthly Orders, Staff Accounts, and File Storage.
  - [x] Plan usage warning banners triggered automatically when any metric exceeds the 70% capacity threshold.
  - [x] Pricing & Plan Comparison matrix (`/dashboard/billing/plans`) featuring Starter (৳999/mo), Growth (৳2,499/mo), and Pro (৳5,999/mo) plans.
  - [x] Annual billing toggle with 17% automatic discount calculation (2 months free).
  - [x] Interactive Upgrade/Downgrade Plan Dialog with billing cycle selection and simulated tier adjustment.
  - [x] Filterable Invoices Ledger (`/dashboard/billing/invoices`) with status badges (Paid, Pending, Failed) and payment/retry actions.
  - [x] Printable Tax Invoice Modal (`InvoiceDetailDialog`) with CartX Bangladesh Ltd legal header, merchant BIN, line items, and VAT breakdown.
  - [x] Billing Settings & Payment Instruments (`/dashboard/billing/settings`) for connecting simulated bKash Auto-Debit, Nagad, and Visa/Mastercard methods.
- [x] **Help Center & Operations Support** (`/dashboard/support`, `/tickets`, `/tickets/[ticketId]`):
  - [x] Knowledge Base landing page with hero search bar, system operational uptime badge (99.98% operational), and Bangladesh e-commerce guides (Courier APIs, bKash Integration, Domain DNS, VAT, etc.).
  - [x] Categorized FAQ accordion (Shipping, Payments, Domains, Invoicing).
  - [x] Create Support Ticket Dialog with React Hook Form + Zod, subject, category selector, priority levels (Low, Medium, High, Urgent), and message.
  - [x] Filterable Support Tickets Ledger (`/dashboard/support/tickets`) with status badges (Open, In Progress, Resolved, Closed), priority indicators, and search.
  - [x] Detailed Support Ticket Conversation View (`/dashboard/support/tickets/[ticketId]`) with interactive timeline, client reply input, manual status controls, and simulated CartX agent response generator.
- [x] **Sidebar Navigation & Quality Gates**:
  - [x] Added 3 new navigation groups in `src/config/navigation.ts`: Team & Access (2 items), Subscription & Billing (4 items), and Help & Support (2 items).
  - [x] Comprehensive test suite in `tests/phase8-team-billing-operations.test.ts` (27 automated tests).
  - [x] Updated `tests/sidebar-navigation.test.ts` (16 automated tests covering 11 groups and 60 routes).
  - [x] **215 / 215 automated unit tests passing** (100% pass rate across 9 test suites).
  - [x] **0 ESLint errors**; **0 TypeScript errors**; **60 / 60 routes** compiled and prerendered cleanly.

## Demo Mode Disclosures & Future Backend Integration

1. **Storage Mode**: Products, categories, inventory, orders, customers, payment transactions, refunds, and shipments are persisted in browser `localStorage` (`cartx_demo_*`) with in-memory fallbacks for SSR/testing.
2. **Backend Replacement Boundary**: All data operations are encapsulated in typed feature services (`mockProducts.ts`, `mockOrders.ts`, `mockCustomers.ts`, `mockPayments.ts`, `mockShipping.ts`, `mockStorefront.ts`, `mockMarketing.ts`, `mockTeam.ts`, `mockBilling.ts`, `mockSupport.ts`) behind React Query hooks. When the shared Express API is deployed, these services can be connected to real HTTP endpoints without altering UI components.
3. **Payment & Courier Credentials**: Zero-trust architecture strictly prevents storing secret API passwords, signing keys, or private tokens in browser storage or client bundles. Real gateway connections require the shared backend proxy endpoints.
