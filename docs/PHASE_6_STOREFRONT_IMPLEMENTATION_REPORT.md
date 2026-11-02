# CartX Merchant Dashboard — Phase 6: Storefront & Domain Management Implementation Report

**Document Version:** 1.0.0  
**Completion Date:** November 2, 2026  
**Status:** Completed (High-Fidelity Demo Mode)  
**Authoritative Specification:** `CARTX_MERCHANT_DASHBOARD.md` (Module 09 / Phase 6)  
**Primary Currency:** Bangladeshi Taka (BDT ৳)  
**Locale Baseline:** `bn-BD` / `Asia/Dhaka`

---

## 1. Executive Summary

Phase 6 introduces full **Storefront & Domain Management** capabilities into the **CartX Merchant Dashboard**, giving merchants end-to-end control over their online public shopping presence, branding identity, visual layout, custom domains, and legal compliance pages.

All Phase 6 capabilities are built adhering to the established CartX architecture:
- **Next.js 16.4.3 (App Router)** with Partial Prerendering (PPR)
- **React 19.3.0** with React Compiler compliance (`useWatch` for real-time reactivity)
- **TypeScript 5.x Strict Mode** (0 compiler errors)
- **Tailwind CSS v4.0** with CartX design tokens
- **shadcn/ui** accessible primitives with Radix UI compliance
- **TanStack Query v5** reactive cache synchronization
- **React Hook Form + Zod** schemas
- **Zero-Trust & Truthful Demo Mode Architecture**: strictly prevents fabricating DNS nameserver resolution or SSL certificate issuance in client-side code when the shared Express.js backend is pending.

---

## 2. Features Implemented

### 2.1 Storefront Overview (`/dashboard/store`)
- **Publishing Status Controls:** Merchants can switch operational state between `Active` (online to shoppers), `Draft Mode`, `Maintenance Mode`, and `Offline`.
- **Live URL Banner:** Displays the default CartX URL (`https://green-harvest.cartx.com.bd`) with one-click clipboard copying and external preview shortcut.
- **Active Theme Snapshot Card:** Visual thumbnail preview, current version badge, active color swatches (Primary, Secondary, Accent, Footer), typography information, and quick shortcut to the visual customizer.
- **4 Storefront KPI Cards:** Storefront Operational State, Current Active Theme, Published CMS Pages count, and Domain Connection state.
- **Customization Shortcuts:** Quick cards directing to Theme Customizer, Pages & Policies, Domain Configuration, and General Store Settings.
- **Domain Configuration Summary:** Status breakdown for platform default subdomain (`Connected & Active`) and custom domain (`Demo Mode — Verification Pending`).
- **Recent Storefront Changes Trail:** Tamper-evident audit log displaying recent changes (theme customizations, page publications, domain registrations) with actor and localized timestamp attribution.
- **Reset Demo Data:** Destructive reset protected by an `AlertDialog` confirmation restoring baseline presets.

### 2.2 Theme Library & Visual Customizer (`/dashboard/store/themes`, `/dashboard/store/themes/customize`)
- **Theme Library Gallery:**
  - 4 Curated Themes built specifically for Bangladesh e-commerce retail niches:
    1. **Modern Commerce** (Clean, spacious grid layout designed for high-conversion retail and supermarkets - Active baseline).
    2. **Minimal Boutique** (Editorial typography and generous whitespace for fashion, apparel, and lifestyle).
    3. **Express Superstore** (High-density product catalog layout optimized for electronics, gadgets, and wholesale).
    4. **Artisan Craft** (Warm earth tones and story cards designed for traditional handicrafts, jute, and pottery).
  - Feature badges, version tags, color swatch previews, and "Activate Theme" mutation.
  - Interactive "Theme Preview Modal" showing full feature breakdown and typography details before activation.
  - Reset to Defaults action protected by `AlertDialog`.
- **Interactive Theme Customizer:**
  - **Split-Pane Architecture:** Controls on left, Live Interactive Storefront Preview canvas on right.
  - **Responsive Viewport Switchers:** Instant canvas switching between **Desktop (100% / 1080px)**, **Tablet (768px)**, and **Mobile (375px)**.
  - **4 Customization Control Tabs:**
    1. *Colors & Presets:* Primary, Secondary, Accent, Background, Text, and Footer background colors with 8 one-click presets (CartX Blue, Emerald Green, Royal Purple, Ruby Rose, Amber Gold, Slate Dark, Deep Indigo, Crimson Red) and HTML5 color pickers.
    2. *Typography:* Heading font picker (`Inter`, `Noto Sans Bengali`, `Poppins`, `Hind Siliguri`), body font picker, and base font size scale (Small, Medium, Large).
    3. *Homepage Sections:* Modular toggles and bilingual text inputs for Announcement Bar, Hero Banner (with Split, Centered, Full-bleed layouts), Featured Categories, Best Sellers, Promotional Discount Bar (with coupon code), and Trust Badges.
    4. *Header & Navigation:* Store brand title, announcement bar settings, sticky navigation toggle, search bar toggle, and cart counter badge.
  - **Real-Time Live Canvas Preview:** Uses `useWatch` to instantaneously rerender the simulated customer storefront as the merchant edits colors or section titles without requiring page reloads.
  - Save Changes and Reset Defaults buttons with user feedback.

### 2.3 Domain Management & DNS Guide (`/dashboard/store/domains`)
- **Default Subdomain Card:** Shows `green-harvest.cartx.com.bd` with permanent `Active` badge, wildcard SSL coverage, and copy/visit actions.
- **Custom Domain Registration Form:**
  - Zod FQDN validation: rejects protocols (`http://`, `https://`), slashes (`/`), invalid characters, spaces, and default CartX platform domains.
- **Domain Routing Table:** Displays Domain Name, Routing Type (Platform Default vs Custom FQDN), Connection Status, SSL Status, and Target Value.
- **Truthful Status Presentation:**
  - Custom domains are explicitly labeled as **"Demo Mode — Verification Pending"**.
  - SSL status is explicitly labeled as **"Demo / Not Active"**.
  - Prominent security callout explaining that DNS verification against live authoritative nameservers and SSL certificate generation via Let's Encrypt / Cloudflare are handled exclusively on the backend server upon live domain resolution.
- **Interactive DNS Configuration Modal:**
  - Step-by-step instructions for Bangladesh merchants configuring cPanel, Cloudflare, Namecheap, or BTCL registrar DNS.
  - Copyable CNAME row (`cname.cartx.com.bd`) and A record row (`104.21.45.120`).
- **Domain Verification Check:** Triggering "Verify" produces a truthful demo response clarifying that authoritative DNS queries require the Express.js backend API.
- **Custom Domain Removal:** Protected by `AlertDialog` confirmation (preventing accidental deletion, while default CartX subdomain is permanently protected from removal).

### 2.4 CMS Pages & Legal Policies (`/dashboard/store/pages`, `/dashboard/store/pages/new`, `/dashboard/store/pages/[pageId]/edit`)
- **Pages Listing:**
  - Filter tabs: All Pages, Published, Drafts, Legal Policies.
  - Search input filtering across title, slug, and Bengali titles.
  - Table showing Title, Classification (Legal Policy vs Standard CMS), URL Slug, Status Badge (Published vs Draft), and Last Updated date.
  - Row actions: Live Preview Modal, Edit Page link, and Delete Page dialog.
- **4 Localized Bangladesh Legal Page Templates:**
  1. **Privacy Policy (গোপনীয়তা নীতি):** Explains customer data collection, order fulfillment, MFS payment processing (bKash/Nagad/SSLCommerz), and data security.
  2. **Terms & Conditions (ব্যবহারের শর্তাবলী):** Order confirmation rules, BDT pricing integrity, delivery timelines inside/outside Dhaka, and governing Bangladesh law.
  3. **Refund & Return Policy (ফেরত ও রিফান্ড নীতি):** 7-day return guidelines, damaged goods procedure, perishable items rules, and MFS refund turnaround (3–5 business days).
  4. **Shipping & Delivery Policy (শিপিং ও ডেলিভারি নীতি):** Flat delivery charge (৳60 inside Dhaka, ৳120 outside Dhaka), free shipping threshold (৳2,000+), partner couriers (Steadfast, Pathao, RedX), and tracking IDs.
- **Prominent Legal Disclaimer:** Every legal policy template and editor view includes a clear disclaimer banner:
  > *⚠️ আইনি বিজ্ঞপ্তি / Legal Disclaimer: এই খসড়া টেমপ্লেটটি শুধুমাত্র একটি নমুনা কাঠামো এবং এটি কোনো আনুষ্ঠানিক আইনি পরামর্শ নয়।*
- **Page Editor (`/new` and `/[pageId]/edit`):**
  - Page title, optional Bengali title, auto-generated URL slug with live normalization, Markdown content editor with live preview modal, publishing status selector (Published vs Draft), page classification selector, and SEO meta tags (Meta Title, Meta Description).
  - Delete page action with confirmation dialog.

### 2.5 Sidebar Navigation & RBAC Integration
- **Storefront Navigation Group:**
  - Added new collapsible `Storefront` group in `src/config/navigation.ts` with 4 verified subroutes:
    1. *Store Overview* -> `/dashboard/store`
    2. *Themes & Customization* -> `/dashboard/store/themes`
    3. *Pages* -> `/dashboard/store/pages`
    4. *Domains* -> `/dashboard/store/domains`
  - Protected under `storefront.manage` RBAC permission.
  - Enhanced `Sidebar.tsx` to support deep subroute matching (e.g. `/dashboard/store/themes/customize` keeps *Themes & Customization* active, and `/dashboard/store/pages/new` keeps *Pages* active).
  - Zero broken links, zero duplicate route targets, and full collapsed tooltip support.

---

## 3. Routes Created & Verified

| Route | Type | Description |
|---|---|---|
| `/dashboard/store` | Static Prerendered | Storefront management overview, status toggle, active theme card, shortcuts |
| `/dashboard/store/themes` | Static Prerendered | Theme library, 4-theme gallery, activation modal, preview dialog |
| `/dashboard/store/themes/customize` | Static Prerendered | Split-pane visual customizer, 4 control tabs, responsive live canvas |
| `/dashboard/store/domains` | Static Prerendered | Subdomain status, custom domain registration form, DNS guide modal |
| `/dashboard/store/pages` | Static Prerendered | CMS pages & legal policies list, filter tabs, search, delete dialog |
| `/dashboard/store/pages/new` | Static Prerendered | Create page form, legal template loader, auto-slug generator |
| `/dashboard/store/pages/[pageId]/edit` | Partial Prerendered | Edit existing page, revision tracking, preview modal, delete page |

---

## 4. Components Created & Reused

### Newly Created Components (`src/features/storefront/`)
- `StoreOverviewView.tsx` — Overview dashboard with KPI cards, status dropdown, shortcuts, domain summary, and activity audit log.
- `ThemeLibraryView.tsx` — Theme catalog gallery cards, version badges, feature pills, preview dialog, and activation mutation.
- `ThemeCustomizerView.tsx` — Split-pane customizer with colors, typography, homepage sections, and header controls.
- `StorefrontLivePreview.tsx` — Responsive simulated storefront canvas supporting Desktop (1080px), Tablet (768px), and Mobile (375px) viewports with real-time styling updates.
- `DomainManagementView.tsx` — Default subdomain card, custom domain form, domain routing table, and interactive DNS instructions modal.
- `PagesListView.tsx` — CMS pages table, status tabs, search filter, page preview modal, and delete alert dialog.
- `PageEditorView.tsx` — Page creation and editor form with legal template quick-loaders, markdown textarea, and SEO fields.

### Reused Foundation & UI Components
- `PageHeader.tsx` — Standardized top header with native `breadcrumbs`, `description`, and `actions` slot.
- `PermissionGuard.tsx` — RBAC access control wrapping all 7 storefront views under `storefront.manage`.
- `LoadingSkeleton.tsx` — Standardized fallback skeleton loader for Suspense boundaries.
- `ErrorState.tsx` — Accessible error alert with retry trigger.
- `EmptyState.tsx` — Accessible empty table state with actionable button.
- `Sidebar.tsx` — Collapsible 21st.dev-inspired navigation shell with parent-group auto-expansion.
- `shadcn/ui` primitives: `Card`, `Button`, `Input`, `Label`, `Textarea`, `Select`, `Switch`, `Badge`, `Table`, `Dialog`, `AlertDialog`, `Tabs`.

---

## 5. Demo-Mode Limitations & Backend Integration Requirements

| Feature | Demo Mode Implementation | Backend Integration Requirements (Shared Express API) |
|---|---|---|
| **Theme Customizations** | Persisted in `localStorage` (`cartx_demo_themes_v1`) with in-memory fallbacks. | `PATCH /api/v1/storefront/themes/:id/customize` endpoint storing JSON settings in PostgreSQL database. |
| **Theme Activation** | Client-side active flag update in browser storage. | `POST /api/v1/storefront/themes/:id/activate` endpoint updating tenant active theme ID. |
| **Custom Domain Registration** | Domain string validated by Zod and saved locally. | `POST /api/v1/storefront/domains` registering domain in edge reverse proxy routing table (Cloudflare for SaaS / Traefik). |
| **Domain DNS Verification** | Responds with truthful demo message explaining backend requirement; status stays `demo_pending_verification`. | `POST /api/v1/storefront/domains/:id/verify` performing authoritative DNS query for CNAME / A records against root nameservers. |
| **SSL Certificate Issuance** | Truthfully labeled as `demo_not_active`; zero certificates fabricated in client code. | Automated server-side issuance via Let's Encrypt ACME challenge or Cloudflare SSL for SaaS. |
| **CMS Pages & Policies** | Full CRUD persisted in `localStorage` (`cartx_demo_pages_v1`). | `GET / POST / PATCH / DELETE /api/v1/storefront/pages` endpoints backed by PostgreSQL table with tenant isolation. |
| **Storefront Asset Uploads** | Curated Bangladesh demo presets and external image URLs. | Presigned S3/Cloudinary upload endpoint (`/api/v1/uploads/presigned-url`). |

---

## 6. Automated Testing & Verification Results

All automated quality gates were executed directly in the repository:

### 1. TypeScript Strict Compilation (`npm run type-check`)
```
> tsc --noEmit
Exit code: 0 (0 errors)
```

### 2. ESLint Quality Check (`npm run lint`)
```
> eslint
Exit code: 0 (0 errors, 0 warnings)
```

### 3. Automated Vitest Unit & Integration Suites (`npm run test`)
```
 RUN  v5.0.5 L:/cartx-merchant-dashboard

 ✓ tests/phase6-storefront.test.ts (34 tests)
 ✓ tests/phase4-orders-customers.test.ts (25 tests)
 ✓ tests/phase5-payments-shipping.test.ts (38 tests)
 ✓ tests/phase2-onboarding-settings.test.ts (12 tests)
 ✓ tests/phase3-products-inventory.test.ts (25 tests)
 ✓ tests/foundation.test.ts (7 tests)
 ✓ tests/sidebar-navigation.test.ts (13 tests)

 Test Files  7 passed (7)
      Tests  154 passed (154)
   Start at  11:01:11
   Duration  1.22s
```
**Result: 154 / 154 unit tests passing (100% pass rate).**

### 4. Next.js 16 Production Build (`npm run build`)
```
▲ Next.js 16.4.3 (Turbopack)
✓ Compiled successfully in 12.6s
✓ Finished TypeScript in 15.3s
✓ Generating static pages using 3 workers (43/43) in 5.1s
Route (app): 43 / 43 routes prerendered cleanly.
Exit code: 0
```

---

## 7. Remaining Work (Future Phases)

With Phase 6 complete, the dashboard roadmap progresses to:
- **Phase 7: Marketing, Promotions & Analytics:** Coupon codes, cart discounts, flash sales, sales analytics charts, product reports, CSV exports.
- **Phase 8: Team RBAC, Billing & Operations:** Team member invitations, role assignments, CartX SaaS billing plans, and support tickets.
- **Phase 9: Mobile App Builder:** White-label merchant and customer mobile apps.

