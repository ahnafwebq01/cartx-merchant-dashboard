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
| **08** | **Payments & Finance** | `/dashboard/payments` | Phase 5 | Pending | Gateway settings (bKash, Nagad), transaction logs. |
| **09** | **Shipping & Delivery** | `/dashboard/shipping` | Phase 5 | Pending | Courier setups (Steadfast, Pathao), tracking, zones. |
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
  - [x] **69 / 69 unit tests passing** across entire repository test suite (100% pass rate).
  - [x] **0 ESLint errors**; **0 TypeScript errors**; **27 / 27 routes** prerendered cleanly via Turbopack build.

---

## Demo Mode Disclosures & Future Backend Integration

1. **Storage Mode**: Products, categories, and inventory movements are persisted in `localStorage` under `cartx_demo_products_v1`, `cartx_demo_categories_v1`, and `cartx_demo_inventory_movements_v1` with an in-memory fallback for SSR/testing.
2. **Backend Replacement Boundary**: All data operations are encapsulated in `src/features/products/services/mockProducts.ts` behind typed React Query hooks (`useProductsQuery`, `useCreateProductMutation`, `useStockAdjustmentMutation`). When the shared Express API is deployed, this service can be swapped with real HTTP calls without altering UI components.
3. **Image Uploads**: Media accepts image URLs and local demo presets. Direct binary image upload to S3/Cloudinary will be enabled once the presigned URL backend endpoint (`POST /uploads/presigned-url`) is deployed.
