# CartX Merchant Dashboard — Feature Status Matrix

**Document Purpose:** Living feature status tracking across all 16 dashboard modules defined in `CARTX_MERCHANT_DASHBOARD.md`.  
**Last Updated:** October 28, 2026 (Phase 2 Baseline Closure)  

| # | Module / Capability | Documented Route | Planned Phase | Current Status | Notes |
|---|---|---|---|---|---|
| **00** | **Project Setup & Architecture** | `/` | **Phase 1** | **COMPLETED** | `src/` modular layout, Tailwind v4 tokens, shadcn/ui, API client, auth context, layout shell. |
| **01** | **Overview (Dashboard Home)** | `/dashboard` | **Phase 1 / 2** | **COMPLETED** | Layout shell, status KPI cards, and live backend-driven setup checklist. Real metrics scheduled for Phase 4. |
| **02** | **Store Onboarding Wizard** | `/onboarding/*` | **Phase 2** | **COMPLETED** | 7-step wizard (identity, business, storefront, products, payments, shipping, publish) with debounced slug check. |
| **03** | **Settings & Store Profile** | `/dashboard/settings` | **Phase 2** | **COMPLETED** | Store profile, business info, contacts, BDT locale, RBAC permission guards, and TanStack Query sync. |
| **04** | **Products Management** | `/dashboard/products` | Phase 3 | Pending | Product CRUD, categories, collections, variants. |
| **05** | **Stocks & Inventory** | `/dashboard/inventory` | Phase 3 | Pending | Stock adjustments, low stock alerts, movement log. |
| **06** | **Sales & Orders** | `/dashboard/orders` | Phase 4 | Pending | Order listing, details, fulfillment, invoice printing. |
| **07** | **Customers Database** | `/dashboard/customers` | Phase 4 | Pending | Customer profiles, tags, groups, purchase history. |
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

## Detailed Phase 2 Implementation Deliverables

- [x] **Step 1: Store & Account Identity** (`/onboarding/store`): Name, subdomain slug with live debounced validation, business structure, owner name, email, BD phone.
- [x] **Step 2: Business Information** (`/onboarding/business`): Physical address, 24 Bangladesh districts select, city/area, postal code, business category.
- [x] **Step 3: Storefront Setup** (`/onboarding/storefront`): Store description, brand color palette picker, 3 theme selections, honest image upload notice.
- [x] **Step 4: First Product** (`/onboarding/products`): Minimum product name, BDT positive price, stock quantity, category.
- [x] **Step 5: Payment Setup** (`/onboarding/payments`): Cash on Delivery toggle, digital payment provider status, zero-trust credential notice.
- [x] **Step 6: Shipping & Delivery** (`/onboarding/shipping`): Inside Dhaka rate, Outside Dhaka rate, optional free delivery threshold.
- [x] **Step 7: Preview & Publish** (`/onboarding/publish`): Comprehensive review grid, required steps validation gate, manual publish confirmation, live storefront URL.
- [x] **Settings Tabs** (`/dashboard/settings`): Profile, Business, Contacts, Locale & Timezone with TanStack Query mutations and dirty-state discard.
- [x] **Dashboard Checklist**: Derived from real backend state with percentage progress bar and truthful offline alerts.
- [x] **Unit Testing**: 19 automated tests passing via Vitest (`tests/foundation.test.ts` & `tests/phase2-onboarding-settings.test.ts`).
