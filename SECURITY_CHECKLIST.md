# CartX Merchant Dashboard — Security Checklist

**Module:** Merchant Dashboard  
**Tenancy Model:** Multi-Tenant SaaS (Single shared database, tenant isolation via `storeId`)  
**Security Standard:** Strict Separation of Concerns & Zero-Trust Client  

---

## 1. Tenancy & Isolation Checklist

| Control | Implementation Rule | Status |
|---|---|---|
| **Authoritative Store Context** | `X-Store-Id` header is validated on the backend against session store memberships. Client claims are never trusted blindly. | **DESIGNED** (Client sends `X-Store-Id`) |
| **Cross-Tenant Data Leakage** | All backend Prisma queries must filter by `storeId`. Frontend stores never fetch data across tenant boundaries. | **POLICY DEFINED** |
| **Store Switch Authorization** | When a merchant switches stores via Topbar, the backend must verify the user's role and membership in the target store. | **DESIGNED** (`switchStore`) |

---

## 2. Secrets & Environment Handling

| Control | Implementation Rule | Status |
|---|---|---|
| **Public vs Secret Variables** | Only public variables (`NEXT_PUBLIC_*`) exist in the frontend. Secrets (`DATABASE_URL`, payment provider keys, signing secrets) must NEVER be exposed. | **ENFORCED** (Verified in `.env.example`) |
| **Git Hygiene** | `.gitignore` ignores all `.env*` files except `.env.example`. No credentials committed to git history. | **ENFORCED** |
| **Payment & Courier Credentials** | Payment gateway (bKash, Nagad) and courier API keys are stored encrypted on backend servers; never held in client state. | **POLICY DEFINED** |

---

## 3. Authentication & Session Security

| Control | Implementation Rule | Status |
|---|---|---|
| **Token Handling** | Short-lived JWT access tokens + HTTP-only secure refresh cookie strategy recommended for production deployment. | **INTEGRATION BOUNDARY READY** |
| **No Insecure Storage of Secrets** | Sensitive payment credentials, passwords, or full database tokens must never be written to `localStorage` or `sessionStorage`. | **COMPLIANT** |
| **Automatic Session Expiry** | Expired tokens trigger automatic 401 handling, attempting refresh or redirecting to login. | **PLANNED** in API client |

---

## 4. Authorization & Role-Based Access Control (RBAC)

| Role | Permitted Actions | Restricted Actions |
|---|---|---|
| **Store Owner** | Full store authority, billing, team, deletion | Platform-level Super Admin controls |
| **Store Admin** | Products, orders, customers, marketing, storefront | Billing, ownership transfer, store closure |
| **Order Manager** | View/update orders, shipping labels, customer info | Products editing, billing, settings |
| **Product Manager**| Product CRUD, categories, variants, inventory | Orders, finances, team access |
| **Inventory Manager**| Stock levels, inventory adjustments, reports | Financial records, customer private data |
| **Accountant** | Financial summaries, payment logs, tax reports | Product creation, customer contact details |
| **Support Staff** | View customer contact, order notes | Payment gateway credentials, billing |

> **Crucial Rule:** The frontend `PermissionGuard` is a UI enhancement. All backend routes must validate user permissions before executing business logic.

