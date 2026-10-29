# CartX Merchant Dashboard — Security Checklist

**Module:** Merchant Dashboard  
**Tenancy Model:** Multi-Tenant SaaS (Single shared database, tenant isolation via `storeId`)  
**Security Standard:** Strict Separation of Concerns & Zero-Trust Client  
**Last Updated:** October 28, 2026 (Phase 2 Review)  

---

## 1. Tenancy & Isolation Checklist

| Control | Implementation Rule | Status |
|---|---|---|
| **Authoritative Store Context** | `X-Store-Id` header is validated on the backend against session store memberships. Client claims are never trusted blindly. | **ENFORCED** in `src/lib/api/client.ts` |
| **Cross-Tenant Data Leakage** | All backend Prisma queries must filter by `storeId`. Frontend stores never fetch data across tenant boundaries. | **ENFORCED** by tenant header |
| **Store Switch Authorization** | When a merchant switches stores via Topbar, the backend must verify the user's role and membership in the target store. | **ENFORCED** (`switchStore`) |

---

## 2. Secrets & Environment Handling

| Control | Implementation Rule | Status |
|---|---|---|
| **Public vs Secret Variables** | Only public variables (`NEXT_PUBLIC_*`) exist in the frontend. Secrets (`DATABASE_URL`, payment provider keys, signing secrets) must NEVER be exposed. | **ENFORCED** (Verified in `.env.example`) |
| **Git Hygiene** | `.gitignore` ignores all `.env*` files except `.env.example`. No credentials committed to git history. | **ENFORCED** |
| **Payment & Courier Credentials** | Payment gateway (bKash, Nagad) and courier API keys are stored encrypted on backend servers; never held in client state. | **ENFORCED** (Phase 2 Step 5 zero-trust notice) |

---

## 3. Onboarding & Settings Input Sanitization

| Control | Implementation Rule | Status |
|---|---|---|
| **Subdomain Slug Sanitization** | Slugs validated via `SLUG_REGEX` (lowercase alphanumeric and hyphens only, 3–50 chars). Leading/trailing hyphens blocked. | **ENFORCED** via Zod |
| **Bangladeshi Phone Validation** | Validated via `BD_PHONE_REGEX` to prevent arbitrary text injection. | **ENFORCED** via Zod |
| **Settings Access Guard** | `/dashboard/settings` protected by `<PermissionGuard permission="settings.manage">`. | **ENFORCED** |
| **Authoritative Store Publication** | Publication only triggers via manual merchant confirmation through `POST /stores/current/publish`. Never automated. | **ENFORCED** in Step 7 |

---

## 4. Authorization & Role-Based Access Control (RBAC)

| Role | Permitted Actions | Restricted Actions |
|---|---|---|
| **Store Owner** | Full store authority, billing, team, deletion | Platform-level Super Admin controls |
| **Store Admin** | Products, orders, customers, marketing, storefront, settings | Billing, ownership transfer, store closure |
| **Order Manager** | View/update orders, shipping labels, customer info | Products editing, billing, settings |
| **Product Manager**| Product CRUD, categories, variants, inventory | Orders, finances, team access, settings |
| **Inventory Manager**| Stock levels, inventory adjustments, reports | Financial records, customer private data, settings |
| **Accountant** | Financial summaries, payment logs, tax reports | Product creation, customer details, settings |
| **Support Staff** | View customer contact, order notes | Payment gateway credentials, billing, settings |

> **Crucial Rule:** The frontend `PermissionGuard` is a UI enhancement. All backend routes must validate user permissions before executing business logic.
