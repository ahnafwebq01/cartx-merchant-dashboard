# CartX Merchant Dashboard — API Gaps & Backend Dependencies

**Document Purpose:** Transparently record backend endpoints, contracts, or third-party provider specifications that are currently pending implementation in the shared Express.js backend.  
**Baseline:** `CARTX_MERCHANT_DASHBOARD.md` (Version 1.0)  

---

## 1. Authentication & Session Management Gaps

| Pending Contract | Description | Impact on Frontend | Required Resolution |
|---|---|---|---|
| **`/api/v1/auth/me` Endpoint** | Backend endpoint returning the active user profile, tenant memberships, and assigned roles. | Frontend currently uses default initialized state (`user: null`, ready for login flow). | Express API must expose `/auth/me` supporting session cookie or Bearer token verification. |
| **Refresh Token Strategy** | Formalization of whether refresh tokens are delivered via HttpOnly SameSite cookie or JSON body. | Determines interceptor implementation in `src/lib/api/client.ts`. | Recommended: HttpOnly cookie with CSRF header protection. |

---

## 2. Onboarding & Store Creation Contracts (Required for Phase 2)

| Pending Contract | Description | Impact on Frontend | Required Resolution |
|---|---|---|---|
| **`/api/v1/stores/onboarding`** | Multi-step progress persistence endpoint for merchant onboarding wizard. | Phase 2 multi-step form requires saving draft state per step. | Define step-wise request schemas in Express API. |
| **Store Slug Uniqueness Check** | Endpoint `/api/v1/stores/check-slug?slug=:slug` to validate merchant store subdomains in real-time. | Needed for Step 1 of onboarding wizard. | Add debounced slug availability endpoint. |

---

## 3. Storage & File Upload Contracts (Required for Phase 3)

| Pending Contract | Description | Impact on Frontend | Required Resolution |
|---|---|---|---|
| **Presigned URL Uploads** | Endpoint `/api/v1/uploads/presigned-url` for direct client upload of product images and store logos to S3/Cloudinary. | Product and store branding modules require secure image handling without overloading the Express server. | Backend to generate presigned S3/Cloudinary upload URLs with content-type restrictions. |

---

## 4. Local Integrations Contracts (Required for Phase 5)

| Pending Contract | Description | Impact on Frontend | Required Resolution |
|---|---|---|---|
| **Bangladesh Payment Providers** | Formalized webhook and callback specifications for bKash, Nagad, and SSLCommerz. | Prevents fake connection status; ensures real callback validation. | Shared API to provide provider proxy endpoints and credential verification. |
| **Bangladesh Courier Providers** | API contracts for Steadfast, Pathao, and RedX consignment creation and tracking sync. | Required for live parcel tracking in order management. | Shared API to encapsulate courier API tokens and tracking webhooks. |

