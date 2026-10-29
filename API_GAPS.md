# CartX Merchant Dashboard — API Gaps & Backend Dependencies

**Document Purpose:** Transparently record backend endpoints, contracts, or third-party provider specifications that are currently pending deployment or implementation in the shared Express.js backend.  
**Baseline:** `CARTX_MERCHANT_DASHBOARD.md` (Version 1.0)  
**Last Updated:** October 28, 2026 (Phase 2 Closure)  

---

## 1. Phase 2 Contracts Status (Onboarding & Settings)

The frontend integration boundary for Phase 2 has been fully implemented and typed:
- `GET /stores/onboarding` (Draft restoration)
- `PATCH /stores/onboarding/:step` (Step persistence)
- `GET /stores/check-slug?slug=...` (Subdomain check)
- `GET /stores/current` (Store profile fetch)
- `PUT /stores/current` (Store settings update)
- `POST /stores/current/publish` (Store publication)

### Remaining Backend Deployment Dependencies:
1. **Local / Staging Backend Server**: The shared Express API instance must be running and listening at `NEXT_PUBLIC_API_BASE_URL` (default: `http://localhost:5000/api/v1`) with CORS configured to accept requests from `http://localhost:3000`.
2. **Session Identification**: Active user session must pass `Authorization: Bearer <token>` or session cookies with tenant validation.

---

## 2. Authentication & Session Management Gaps

| Pending Contract | Description | Impact on Frontend | Required Resolution |
|---|---|---|---|
| **`/api/v1/auth/me` Endpoint** | Backend endpoint returning the active user profile, tenant memberships, and assigned roles. | Frontend currently uses default initialized state (`user: null`, ready for login flow). | Express API must expose `/auth/me` supporting session cookie or Bearer token verification. |
| **Refresh Token Strategy** | Formalization of whether refresh tokens are delivered via HttpOnly SameSite cookie or JSON body. | Determines interceptor implementation in `src/lib/api/client.ts`. | Recommended: HttpOnly cookie with CSRF header protection. |

---

## 3. Storage & File Upload Contracts (Required for Phase 3)

| Pending Contract | Description | Impact on Frontend | Required Resolution |
|---|---|---|---|
| **Presigned URL Uploads** | Endpoint `/api/v1/uploads/presigned-url` for direct client upload of product images and store logos to S3/Cloudinary. | Product and store branding modules currently accept public image URLs; direct file uploads require presigned URL generation. | Backend to generate presigned S3/Cloudinary upload URLs with content-type and size restrictions. |

---

## 4. Local Integrations Contracts (Required for Phase 5)

| Pending Contract | Description | Impact on Frontend | Required Resolution |
|---|---|---|---|
| **Bangladesh Payment Providers** | Formalized webhook and callback specifications for bKash, Nagad, and SSLCommerz. | Prevents fake connection status; ensures real callback validation. | Shared API to provide provider proxy endpoints and credential verification. |
| **Bangladesh Courier Providers** | API contracts for Steadfast, Pathao, and RedX consignment creation and tracking sync. | Required for live parcel tracking in order management. | Shared API to encapsulate courier API tokens and tracking webhooks. |
