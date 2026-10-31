# CartX Merchant Dashboard — Feature Status Matrix

**Document Purpose:** Living feature status tracking across all 16 dashboard modules defined in `CARTX_MERCHANT_DASHBOARD.md`.  
**Last Updated:** October 31, 2026 (Phase 4 Final Audit & Repository Verification)  

| # | Module / Capability | Documented Route | Planned Phase | Current Status | Notes |
|---|---|---|---|---|---|
| **00** | **Project Setup & Architecture** | `/` | **Phase 1** | **COMPLETED** | `src/` modular layout, Tailwind v4 tokens, shadcn/ui, API client, auth context, layout shell. |
| **01** | **Overview (Dashboard Home)** | `/dashboard` | **Phase 1 / 2** | **COMPLETED** | Layout shell, collapsible sidebar (21st.dev inspired), status KPI cards, setup checklist. Real metrics in Phase 4. |
| **02** | **Store Onboarding Wizard** | `/onboarding/*` | **Phase 2** | **COMPLETED** | 7-step wizard (identity, business, storefront, products, payments, shipping, publish) with debounced slug check. |
| **03** | **Settings & Store Profile** | `/dashboard/settings` | **Phase 2** | **COMPLETED** | Store profile, business info, contacts, BDT locale, RBAC permission guards, and TanStack Query sync. |
| **04** | **Products Management** | `/dashboard/products` | **Phase 3** | **COMPLETED (Demo Mode)** | Full CRUD, categories, collections, variants, SKU generator, CSV import/export, local persistence. |
| **05** | **Stocks & Inventory** | `/dashboard/inventory` | **Phase 3** | **COMPLETED (Demo Mode)** | Stock adjustments (restock, damaged, lost, correction), health meters, movement audit logs. |
| **06** | **Sales & Orders** | `/dashboard/orders` | **Phase 4** | **COMPLETED (Demo Mode)** | Order listing, details, fulfillment lifecycle, timeline, printable invoice, status state machine. |
| **07** | **Customers Database** | `/dashboard/customers` | **Phase 4** | **COMPLETED (Demo Mode)** | Customer profiles, tags, groups, lifetime value metrics, purchase history, and notes. |
| **08** | **Payments & Finance** | `/dashboard/payments` | **Phase 5** | **COMPLETED (Demo Mode)** | bKash, Nagad, SSLCommerz, COD adapters, transactions ledger, refunds, payment method configuration. |
| **09** | **Shipping & Delivery** | `/dashboard/shipping` | **Phase 5** | **COMPLETED (Demo Mode)** | Steadfast, Pathao, RedX courier adapters, consignments, live tracking stepper, shipping rates & zones. |
| **10** | **Online Store & Themes** | `/dashboard/store` | Phase 6 | Pending | Theme customizer, pages, custom domain, navigation. |
| **11** | **Marketing & Promotions** | `/dashboard/marketing` | Phase 7 | Pending | Coupons, automatic discounts, flash sales. |
| **12** | **Analytics & Reports** | `/dashboard/analytics` | Phase 7 | Pending | Sales analytics, product report, CSV export. |
| **13** | **Team & Permissions** | `/dashboard/team` | Phase 8 | Pending | Team invitations, role assignments (RBAC). |
| **14** | **Subscription & Billing** | `/dashboard/billing` | Phase 8 | Pending | CartX SaaS subscription plans, usage limits. |
| **15** | **Support & Help Center** | `/dashboard/support` | Phase 8 | Pending | Ticket management, guides, contact support. |
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

## Demo Mode Disclosures & Future Backend Integration

1. **Storage Mode**: Products, categories, inventory, orders, customers, payment transactions, refunds, and shipments are persisted in browser `localStorage` (`cartx_demo_*`) with in-memory fallbacks for SSR/testing.
2. **Backend Replacement Boundary**: All data operations are encapsulated in typed feature services (`mockProducts.ts`, `mockOrders.ts`, `mockCustomers.ts`, `mockPayments.ts`, `mockShipping.ts`) behind React Query hooks. When the shared Express API is deployed, these services can be connected to real HTTP endpoints without altering UI components.
3. **Payment & Courier Credentials**: Zero-trust architecture strictly prevents storing secret API passwords, signing keys, or private tokens in browser storage or client bundles. Real gateway connections require the shared backend proxy endpoints.
