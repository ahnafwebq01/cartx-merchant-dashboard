# CartX Merchant Dashboard — Feature Status Matrix

**Document Purpose:** Living feature status tracking across all 16 dashboard modules defined in `CARTX_MERCHANT_DASHBOARD.md`.  
**Last Updated:** October 28, 2026 (Phase 1 Baseline Closure)  

| # | Module / Capability | Documented Route | Planned Phase | Current Status | Notes |
|---|---|---|---|---|---|
| **00** | **Project Setup & Architecture** | `/` | **Phase 1** | **COMPLETED** | `src/` modular layout, Tailwind v4 tokens, shadcn/ui, API client, auth context, layout shell. |
| **01** | **Overview (Dashboard Home)** | `/dashboard` | Phase 1 / 4 | **SHELL READY** | Base page, layout, KPI cards placeholder, onboarding roadmap. Live metrics require Phase 4. |
| **02** | **Store Onboarding Wizard** | `/onboarding/*` | Phase 2 | Pending | 7-step onboarding flow for new merchants. Up next. |
| **03** | **Settings & Store Profile** | `/dashboard/settings` | Phase 2 | Pending | Store info, currency (BDT), locale, business contacts. |
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

## Foundation Architecture Status (Phase 1 Deliverables)

- [x] Next.js 16 App Router configuration
- [x] TypeScript Strict Mode & `@/*` Path Mapping
- [x] Tailwind CSS v4 CSS-first design tokens (Hex palette per Section 5.2)
- [x] Google Fonts (`Inter` + `Noto Sans Bengali`)
- [x] shadcn/ui component foundation (`Button`, `Card`, `Badge`, `Input`, `DropdownMenu`, `Sheet`, `Separator`, `Avatar`, `Skeleton`)
- [x] Reusable Layout Shell (`Sidebar`, `Topbar`, `Breadcrumbs`, `PageHeader`)
- [x] Reusable Feedback States (`EmptyState`, `ErrorState`, `LoadingSkeleton`)
- [x] Environment schema & `.env.example`
- [x] Type-Safe API Client (`src/lib/api/client.ts`) with tenant context header
- [x] Authentication & Store Membership context (`src/lib/auth/context.tsx`)
- [x] Role-Based Access Control engine (`src/lib/permissions/rbac.ts`)
- [x] Client-side `PermissionGuard`
- [x] Automated Unit Test Suite (`tests/foundation.test.ts` via Vitest)

