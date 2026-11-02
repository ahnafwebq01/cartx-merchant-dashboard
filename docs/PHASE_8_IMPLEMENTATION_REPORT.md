# CartX Merchant Dashboard — Phase 8 Implementation Report
## Team Management, Subscription & Billing, and Support Operations

**Document Version:** 1.0.0  
**Implementation Date:** November 2, 2026  
**Author:** Antigravity AI Pair Programmer & Software Architect  
**Local Repository:** `L:\cartx-merchant-dashboard`  
**Target Environment:** Multi-Tenant E-Commerce Merchant Administration Panel (Next.js 16.4.3 App Router, React 19.3.0, TypeScript 5.x Strict, Tailwind CSS v4, shadcn/ui)  
**Primary Currency:** Bangladeshi Taka (BDT ৳)  
**Locale / Timezone:** `bn-BD` / `Asia/Dhaka`  
**Baseline Specification:** `CARTX_MERCHANT_DASHBOARD.md` (Modules 13, 14, and 15)  
**Status:** **PASS — 100% Complete (Demo Mode)**

---

## 1. Executive Summary

Phase 8 completes the core operational capabilities of the **CartX Merchant Dashboard**, implementing:
1. **Module 13: Team Management & Role-Based Access Control (RBAC)** — Staff member management, role assignment across 8 merchant roles, 26-permission matrix, invitation lifecycle (Pending, Accepted, Expired, Cancelled, Resend), owner protection safeguards, and destructive action confirmations.
2. **Module 14: Subscription & Billing** — CartX SaaS subscription plans (Starter ৳999/mo, Growth ৳2,499/mo, Pro ৳5,999/mo), annual billing discounts (17% savings / 2 months free), feature comparison matrix, dynamic usage progress meters with threshold warnings ($\ge 70\%$), filterable invoices ledger, printable tax invoice modal with CartX Bangladesh Ltd legal BIN header, and simulated payment method manager (bKash Auto-Debit, Nagad, Visa/Mastercard).
3. **Module 15: Support & Help Center** — Bangladesh e-commerce guides, categorized FAQ accordion, system uptime monitor (99.98% operational), support ticket creation with priority levels (Low, Medium, High, Urgent), filterable tickets ledger, and interactive ticket conversation view with merchant reply submission and simulated CartX agent responses.

### Key Metrics
- **Automated Tests:** **215 / 215 passing** across 9 test suites (+29 tests added in Phase 8).
- **TypeScript Strictness:** **0 compilation errors** (`tsc --noEmit`).
- **ESLint Code Quality:** **0 errors, 0 warnings** (`eslint .`).
- **Production Build:** **60 / 60 static and Partial Prerendering (PPR) routes** generated cleanly (`next build`).
- **New App Router Routes:** 9 dedicated routes across `/dashboard/team`, `/dashboard/billing`, and `/dashboard/support`.

---

## 2. Inventory of Created & Modified Files

### 2.1 UI Primitives
- `src/components/ui/progress.tsx` — Accessible, headless-compatible progress bar component styled with Tailwind CSS v4 design tokens.

### 2.2 Module A: Team Management
- `src/features/team/types.ts` — TypeScript interfaces for `TeamMember`, `TeamInvitation`, `RoleDefinition`, `TeamStats`, `InvitationStatus`, `MerchantRole`, and form values.
- `src/features/team/schemas.ts` — Zod schemas for member invitation (`inviteMemberSchema`) and member editing (`updateMemberSchema`).
- `src/features/team/constants.ts` — Baseline definitions for 8 merchant roles, 26 permissions grouped into 7 domains, initial team members (Owner, Store Manager, Order Manager, Inventory Manager), and initial pending invitations.
- `src/features/team/services/mockTeam.ts` — SSR-safe `MockTeamService` managing browser `localStorage` (`cartx_demo_team_members`, `cartx_demo_team_invitations`) with owner protection safeguards, invitation state transitions, and stats calculation.
- `src/features/team/hooks.ts` — React Query hooks (`useTeamMembersQuery`, `useTeamInvitationsQuery`, `useRoleDefinitionsQuery`, `useTeamStatsQuery`, `useInviteMemberMutation`, `useUpdateTeamMemberMutation`, `useRemoveTeamMemberMutation`, `useCancelInvitationMutation`, `useResendInvitationMutation`).
- `src/features/team/components/InviteMemberDialog.tsx` — Modal form with email validation, role selector, expandable granular permission overrides, and demo mode notes.
- `src/features/team/components/EditMemberDialog.tsx` — Modal dialog for modifying staff roles, active status, and custom permission checkboxes.
- `src/features/team/components/RolesPermissionsMatrixView.tsx` — Interactive 8-role $\times$ 26-permission matrix view mapping all system capabilities across 7 permission groups.
- `src/features/team/components/TeamMembersListView.tsx` — Main team dashboard featuring KPI summary cards, Active Members vs Pending Invitations tabs, search filters, and safe deletion confirmation dialogs.

### 2.3 Module B: Billing & Subscription
- `src/features/billing/types.ts` — TypeScript interfaces for `SubscriptionPlan`, `StoreSubscription`, `PlanUsageMetric`, `Invoice`, `BillingSettings`, `PaymentMethod`, and form values.
- `src/features/billing/schemas.ts` — Zod schemas for plan changes (`changePlanSchema`), billing profile settings (`billingSettingsSchema`), and simulated payment methods (`paymentMethodSchema`).
- `src/features/billing/constants.ts` — Specifications for Starter (৳999), Growth (৳2,499), and Pro (৳5,999) tiers, 23-row technical comparison matrix, initial active subscription, initial invoices (Paid, Pending, Failed), and billing settings.
- `src/features/billing/services/mockBilling.ts` — SSR-safe `MockBillingService` managing `cartx_demo_subscription`, `cartx_demo_invoices`, and `cartx_demo_billing_settings` with accurate 17% annual discount calculations, usage threshold evaluation ($\ge 70\%$), and invoice payment settlement.
- `src/features/billing/hooks.ts` — React Query hooks (`useStoreSubscriptionQuery`, `usePlanUsageMetricsQuery`, `useInvoicesQuery`, `useInvoiceQuery`, `useBillingSettingsQuery`, `useChangePlanMutation`, `usePayInvoiceMutation`, `useUpdateBillingSettingsMutation`, `useAddPaymentMethodMutation`, `useRemovePaymentMethodMutation`, `useSetDefaultPaymentMethodMutation`).
- `src/features/billing/components/UpgradePlanDialog.tsx` — Interactive dialog for switching between Starter, Growth, and Pro tiers with monthly/annual cycle toggle and simulated plan adjustment.
- `src/features/billing/components/PaymentMethodDialog.tsx` — Dialog for connecting simulated bKash Auto-Debit, Nagad, or Credit/Debit Card instruments.
- `src/features/billing/components/InvoiceDetailDialog.tsx` — Printable formal tax invoice modal with CartX Bangladesh Ltd corporate BIN header, merchant details, line items, and VAT breakdown.
- `src/features/billing/components/BillingOverviewView.tsx` — Current tier hero card, 4 usage progress meters, near-capacity warning alert, and recent invoices ledger.
- `src/features/billing/components/PlansComparisonView.tsx` — Pricing cards with annual discount toggle and full feature comparison matrix.
- `src/features/billing/components/InvoicesListView.tsx` — Complete billing invoices table with status filters, view invoice modal, and simulated pay/retry actions.
- `src/features/billing/components/BillingSettingsView.tsx` — Payment methods manager, billing contact details, and merchant tax BIN form.

### 2.4 Module C: Support & Operations
- `src/features/support/types.ts` — TypeScript interfaces for `HelpArticle`, `FAQItem`, `SupportTicket`, `TicketMessage`, and form values.
- `src/features/support/schemas.ts` — Zod schemas for ticket creation (`createTicketSchema`) and replies (`replyTicketSchema`).
- `src/features/support/constants.ts` — 8 Bangladesh-specific knowledge base guides, 8 categorized FAQs, and 4 baseline support tickets with conversation history.
- `src/features/support/services/mockSupport.ts` — SSR-safe `MockSupportService` managing `cartx_demo_support_tickets` with search, category filtering, ticket CRUD, reply append, auto-reopen on reply, and simulated agent responses.
- `src/features/support/hooks.ts` — React Query hooks (`useHelpArticlesQuery`, `useFAQItemsQuery`, `useSupportTicketsQuery`, `useSupportTicketQuery`, `useCreateTicketMutation`, `useReplyTicketMutation`, `useUpdateTicketStatusMutation`).
- `src/features/support/components/HelpArticleModal.tsx` — Reader modal displaying full article content, category badge, and feedback buttons.
- `src/features/support/components/CreateTicketDialog.tsx` — Ticket creator modal with category, priority, and rich description fields.
- `src/features/support/components/TicketDetailView.tsx` — Complete ticket conversation view with status controls, timeline, merchant reply composer, and simulated agent reply generator.
- `src/features/support/components/TicketsListView.tsx` — Filterable ticket ledger with status tabs, priority indicators, and search.
- `src/features/support/components/HelpCenterView.tsx` — Hero search bar, system uptime status card (99.98%), categorized guide cards, and FAQ accordion.

### 2.5 App Router Routes
- `src/app/dashboard/team/page.tsx` — Team management dashboard route (`○ /dashboard/team`).
- `src/app/dashboard/team/roles/page.tsx` — Roles & permissions matrix route (`○ /dashboard/team/roles`).
- `src/app/dashboard/billing/page.tsx` — Subscription overview & usage route (`○ /dashboard/billing`).
- `src/app/dashboard/billing/plans/page.tsx` — Plans & feature comparison route (`○ /dashboard/billing/plans`).
- `src/app/dashboard/billing/invoices/page.tsx` — Invoices ledger route (`○ /dashboard/billing/invoices`).
- `src/app/dashboard/billing/settings/page.tsx` — Billing & payment settings route (`○ /dashboard/billing/settings`).
- `src/app/dashboard/support/page.tsx` — Help center landing route (`○ /dashboard/support`).
- `src/app/dashboard/support/tickets/page.tsx` — Support tickets ledger route (`○ /dashboard/support/tickets`).
- `src/app/dashboard/support/tickets/[ticketId]/page.tsx` — Ticket conversation dynamic route (`◐ /dashboard/support/tickets/[ticketId]`).

### 2.6 Navigation & Layout Updates
- `src/config/navigation.ts` — Integrated 3 new navigation groups: `team` ("Team & Access"), `billing` ("Subscription & Billing"), and `support` ("Help & Support") with active subroute matching.
- `src/components/layout/Topbar.tsx` — Added direct links to Help Center and Support Tickets in the Topbar help dialog.

### 2.7 Automated Test Suites
- `tests/phase8-team-billing-operations.test.ts` — 27 automated tests covering team member CRUD, owner protection safeguards, invitation state transitions, subscription pricing, usage threshold calculations, invoice settlement, and ticket conversation flows.
- `tests/sidebar-navigation.test.ts` — 16 automated tests verifying all 11 navigation groups, 60 routes, and RBAC permission mappings.

### 2.8 Project Documentation Updates
- `README.md` — Section 4 updated with Phase 8 features, Section 5 route tree updated with 9 new routes, Section 8 test suites list updated, and Section 10 documentation references added.
- `IMPLEMENTATION_PLAN.md` — Phase 8 marked COMPLETED (Demo Mode), DoD table updated with 215 tests and 60 routes.
- `FEATURE_STATUS.md` — Modules 13, 14, 15 marked COMPLETED (Demo Mode), detailed Phase 8 deliverables itemized.
- `API_GAPS.md` — Section 7 added documenting 25 planned REST endpoints for Team, Billing, and Support.
- `docs/PHASE_8_IMPLEMENTATION_REPORT.md` — This comprehensive implementation and verification report.

---

## 3. Implemented Routes & Feature Breakdown

### 3.1 Module A: Team Management & Access Control
- **Team Listing & Stats (`/dashboard/team`)**:
  - Displays 4 KPI cards: Total Staff, Active Members, Pending Invites, and Security Admins.
  - Tabbed interface separating active staff from pending invitations.
  - Search by staff name and email address.
  - Role badges rendered with distinct colors (Owner in amber, Admin in red, Store Manager in blue, etc.).
- **Invite Member Workflow**:
  - Invites staff members via email and initial role assignment.
  - Option to grant custom permissions beyond the default role template.
  - Tracks invitation states: `pending`, `accepted`, `expired`, `cancelled`.
  - Actions to copy invitation link, resend invitation email, or revoke pending invitations.
- **Member Modification & Protection**:
  - Edit member role, operational status (Active, Inactive, Suspended), and granular permissions.
  - **Owner Protection Rule**: Store Owner role cannot be demoted or deleted. Attempting to delete or demote the owner triggers an explicit error dialog and cannot be submitted.
  - Destructive member deletion requires confirmation via `AlertDialog`.
- **Roles & Permissions Matrix (`/dashboard/team/roles`)**:
  - Visual matrix mapping 8 roles against 26 permissions grouped into 7 domains (Products & Inventory, Orders & Customers, Payments & Shipping, Storefront, Marketing & Analytics, Team & Access, Billing & Operations).
  - Clear visual indicator of granted vs ungranted permissions for each role.

### 3.2 Module B: Subscription & Billing
- **Plan Overview & Meters (`/dashboard/billing`)**:
  - Hero card highlighting the current active plan (`Growth Plan - ৳2,499/mo`), renewal date, and billing cycle.
  - 4 Usage Capacity Meters powered by accessible `Progress` bars:
    - Products: 142 / 1,000 items (14%)
    - Monthly Orders: 384 / 2,000 orders (19%)
    - Staff Accounts: 4 / 5 accounts (80% — triggers warning alert)
    - File Storage: 1.2 GB / 5.0 GB (24%)
  - **Capacity Warning Banner**: Automatically alerts merchants when any metric reaches $\ge 70\%$ utilization.
- **Plans & Comparison Matrix (`/dashboard/billing/plans`)**:
  - 3 Tiers: Starter (৳999/mo), Growth (৳2,499/mo), Pro (৳5,999/mo).
  - Annual billing switcher displaying 17% automatic discount (e.g., Growth billed annually at ৳2,074/mo or ৳24,890/year).
  - 23-row technical comparison table covering all platform features and resource limits.
  - Upgrade/Downgrade Plan Dialog with instant tier adjustment simulation and demo mode disclosure.
- **Invoices Ledger & PDF Modal (`/dashboard/billing/invoices`)**:
  - Historical billing records with status badges (`Paid`, `Pending`, `Failed`).
  - Formal Bangladesh VAT-compliant invoice view (`InvoiceDetailDialog`) with CartX Bangladesh Ltd company registration, merchant BIN (`123456789-0101`), line items, 15% VAT calculation, and printable styling (`window.print()`).
  - Simulated payment settlement actions for `Pending` or `Failed` invoices.
- **Billing Settings & Payment Instruments (`/dashboard/billing/settings`)**:
  - Simulated payment instrument management: bKash Auto-Debit, Nagad, Visa/Mastercard.
  - Action to set default auto-renewal payment method or remove instruments.
  - Legal company name, tax BIN, billing email, and physical address settings.

### 3.3 Module C: Support & Help Center
- **Help Center Landing (`/dashboard/support`)**:
  - Hero search bar with real-time filtering across article titles and content.
  - System Uptime Status Card displaying live operational status (99.98% uptime).
  - 8 Bangladesh e-commerce guides (Steadfast Courier API integration, bKash Merchant account configuration, custom domain DNS setup, Bangladesh VAT and tax invoice rules, etc.).
  - Categorized FAQ accordion (Shipping, Payments, Domains, Invoicing).
- **Support Tickets Ledger (`/dashboard/support/tickets`)**:
  - Tabbed ticket ledger: All, Open, In Progress, Resolved, Closed.
  - Priority indicators: Low, Medium, High, Urgent.
  - Category tags: Technical, Billing, Shipping, Payments, Storefront, General.
  - Create Ticket Modal with React Hook Form and Zod validation.
- **Support Ticket Conversation View (`/dashboard/support/tickets/[ticketId]`)**:
  - Dynamic route displaying the complete chronological message thread.
  - Client reply composer with auto-reopen functionality for resolved tickets.
  - Simulated CartX Agent response generator ("Simulate Agent Response" button) to demonstrate live ticket conversation dynamics.
  - Manual ticket status selector (Open, In Progress, Resolved, Closed).

---

## 4. Architectural & Implementation Decisions

1. **Strict Separation of Concerns**:
   - Feature boundaries are organized into `types.ts`, `schemas.ts`, `constants.ts`, `services/mock*.ts`, `hooks.ts`, and `components/*.tsx`.
   - UI views never import `localStorage` directly; all state mutations flow through typed service methods encapsulated by TanStack Query hooks.
2. **SSR-Safe Browser Persistence**:
   - All mock services check `typeof window !== 'undefined'` before accessing `localStorage`.
   - In-memory data structures are maintained as fallbacks during server-side rendering and Vitest headless test execution.
3. **Owner Role Immutable Invariant**:
   - The Store Owner cannot be deleted or have their role altered. This domain invariant is enforced at both the service layer (`MockTeamService.removeMember` and `MockTeamService.updateMember`) and the UI layer (disabled controls in `TeamMembersListView` and `EditMemberDialog`).
4. **Capacity Threshold Calculation**:
   - The usage percentage is computed using standard integer division with a 100% clamp: `Math.min(100, Math.round((current / limit) * 100))`.
   - If any metric has `isNearLimit === true` ($\ge 70\%$), a prominent warning banner is rendered at the top of the Billing Overview.
5. **Printable Tax Invoice Structure**:
   - The invoice modal follows standard Bangladesh tax requirements, displaying the merchant BIN, CartX Bangladesh Ltd company registration, date of issuance, line items, and a 15% VAT calculation.
6. **Simulated Interactions with Clear Demo Disclosures**:
   - All mutations provide visible user feedback via Sonner toasts with explicit "(Demo Mode)" notices.
   - Payment method addition, invoice settlement, plan upgrades, and ticket replies disclose that no real financial transactions or external emails were dispatched.

---

## 5. Demo Mode Boundaries & Limitations

| Feature Domain | Demo Mode Behavior | Future Live Backend Requirement |
|---|---|---|
| **Team Invitations** | Invitation link is generated and state is saved to `localStorage`. | Express API will dispatch transactional emails via SendGrid/SES with cryptographically signed tokens. |
| **Owner Transfer** | Store Owner cannot be modified or removed in demo mode. | Live backend will require a dedicated owner-transfer workflow with 2FA email verification. |
| **Subscription Plan Upgrade** | Tier and cycle update immediately in browser state with simulated price adjustments. | Integration with bKash Subscription API / recurring card payments with automated webhook processing. |
| **Invoice Settlement** | Settle action transitions invoice status from `Pending` or `Failed` to `Paid` immediately. | Real payment processing via bKash/Nagad/SSLCommerz gateway with digital signature verification. |
| **Payment Method Addition** | Payment method is saved locally with masked numbers (e.g., `017***12345`). | Tokenized payment instrument vaulting (bKash Agreement ID, SSLCommerz card tokenization) via backend proxy. |
| **Support Ticket Replies** | Merchant replies append locally; agent responses can be simulated via dedicated demo button. | Live WebSocket / SSE support desk integration (e.g., Zendesk, Intercom, or custom CartX support API). |

---

## 6. Automated Quality Gate Results

### 6.1 TypeScript Strict Compilation (`npm run type-check`)
```bash
> cartx-merchant-dashboard@0.1.0 type-check
> tsc --noEmit
```
**Result: PASS (0 errors, Exit Code: 0)**

### 6.2 ESLint Static Analysis (`npm run lint`)
```bash
> cartx-merchant-dashboard@0.1.0 lint
> next lint
```
**Result: PASS (0 errors, 0 warnings, Exit Code: 0)**

### 6.3 Vitest Unit Test Suite (`npm run test`)
```bash
> cartx-merchant-dashboard@0.1.0 test
> vitest run

 ✓ tests/phase7-marketing.test.ts (31 tests)
 ✓ tests/phase6-storefront.test.ts (34 tests)
 ✓ tests/phase5-payments-shipping.test.ts (37 tests)
 ✓ tests/phase4-orders-customers.test.ts (25 tests)
 ✓ tests/phase3-products-inventory.test.ts (25 tests)
 ✓ tests/phase8-team-billing-operations.test.ts (27 tests)
 ✓ tests/phase2-onboarding-settings.test.ts (12 tests)
 ✓ tests/sidebar-navigation.test.ts (16 tests)
 ✓ tests/foundation.test.ts (8 tests)

 Test Files  9 passed (9)
      Tests  215 passed (215)
   Start at  12:42:00
   Duration  4.12s
```
**Result: PASS (215/215 tests passing, 100% pass rate, Exit Code: 0)**

### 6.4 Next.js Production Build (`npm run build`)
```bash
> cartx-merchant-dashboard@0.1.0 build
> next build

   ▲ Next.js 16.4.3 (Turbopack)
   - Environments: .env.local

   Creating an optimized production build ...
   ✓ Compiled successfully in 12.4s
   ✓ Prerendered 60 static and PPR routes
```
**Result: PASS (60/60 routes compiled cleanly, Exit Code: 0)**

---

## 7. Required Future Backend API Contracts Summary

When the shared Express.js backend API is deployed, the 25 endpoints documented in `API_GAPS.md` (Section 7) will replace the client mock services:
1. **Team Management**: `/api/v1/team/members`, `/api/v1/team/invitations`, `/api/v1/team/roles`
2. **Subscription & Billing**: `/api/v1/billing/subscription`, `/api/v1/billing/usage`, `/api/v1/billing/invoices`, `/api/v1/billing/settings`, `/api/v1/billing/payment-methods`
3. **Help Center & Support**: `/api/v1/support/articles`, `/api/v1/support/faqs`, `/api/v1/support/tickets`

---

## 8. Conclusion

Phase 8 has been delivered with complete adherence to `CARTX_MERCHANT_DASHBOARD.md`, the Phase 8 requirements, and all project architectural guidelines. The implementation provides responsive, accessible, and realistic operational workflows for Bangladesh merchants, while maintaining zero regression across Phases 1 through 7.

