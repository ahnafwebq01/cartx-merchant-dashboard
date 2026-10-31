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

The project currently operates in **high-fidelity client-side demo mode** (Phases 1 through 4 complete). All features use localized in-memory and browser `localStorage` persistence (`mockOrders`, `mockCustomers`, `mockProducts`) with SSR-safe fallbacks and TanStack Query state synchronization. No external backend or credentials are required to run and test the complete dashboard.

| Milestone | Status | Details |
|---|---|---|
| **Phase 1: Architecture & Foundation** | **Completed** | Modular `src/` hierarchy, design tokens, RBAC permissions, shell layouts. |
| **Phase 2: Onboarding & Store Profile** | **Completed** | 7-step wizard (`/onboarding/*`), settings management (`/dashboard/settings`). |
| **Phase 3: Products & Inventory** | **Completed (Demo Mode)** | Product CRUD, variant matrix, SKU generation, inventory adjustments, CSV import/export. |
| **Phase 4: Sales, Orders & Customers** | **Completed (Demo Mode)** | Order fulfillment state machine, returns, printable invoice, customer CRM, segmentation. |
| **Phase 5: Payments & Shipping Logistics** | *Pending* | Bangladesh gateways (bKash, Nagad) and couriers (Steadfast, Pathao). |
| **Phases 6–9: Storefront, Marketing, Billing, App** | *Pending* | Future roadmap items per [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md). |

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

---

## 9. Backend Integration & Future Roadmap

When the shared CartX Express.js backend API is deployed:
- The typed API client in `src/lib/api/client.ts` will connect to live REST endpoints.
- Detailed endpoint contracts, request/response models, and remaining integration requirements are documented in [`API_GAPS.md`](./API_GAPS.md).
- Phase 5 will introduce live Bangladesh payment gateway integrations (bKash, Nagad, SSLCommerz) and courier tracking APIs (Steadfast, Pathao, RedX).
