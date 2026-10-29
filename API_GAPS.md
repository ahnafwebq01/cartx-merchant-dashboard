# CartX Merchant Dashboard — API Gaps & Backend Dependencies

**Document Purpose:** Transparently record backend endpoints, contracts, or third-party provider specifications that are currently pending deployment or implementation in the shared Express.js backend.  
**Baseline:** `CARTX_MERCHANT_DASHBOARD.md` (Version 1.0)  
**Last Updated:** October 29, 2026 (Phase 3 Baseline Closure)  

---

## 1. Phase 2 Contracts Status (Onboarding & Settings)

The frontend integration boundary for Phase 2 has been fully implemented and typed:
- `GET /stores/onboarding` (Draft restoration)
- `PATCH /stores/onboarding/:step` (Step persistence)
- `GET /stores/check-slug?slug=...` (Subdomain check)
- `GET /stores/current` (Store profile fetch)
- `PUT /stores/current` (Store settings update)
- `POST /stores/current/publish` (Store publication)

---

## 2. Phase 3 Contracts Status (Products & Inventory)

Phase 3 frontend features are fully functional using a local storage service (`src/features/products/services/mockProducts.ts`) and React Query hooks. When the shared Express backend is ready, the following endpoints will be hooked into the typed client:

| Planned Endpoint | Method | Purpose | Frontend Hook / Consumer |
|---|---|---|---|
| `/api/v1/products` | `GET` | Paginated product listing with filters | `useProductsQuery(params)` |
| `/api/v1/products` | `POST` | Create product with validation | `useCreateProductMutation()` |
| `/api/v1/products/:id` | `GET` | Single product detail | `useProductQuery(id)` |
| `/api/v1/products/:id` | `PATCH` | Update product details | `useUpdateProductMutation()` |
| `/api/v1/products/:id` | `DELETE` | Permanent product deletion | `useDeleteProductMutation()` |
| `/api/v1/products/:id/archive` | `POST` | Soft-archive product | `useArchiveProductMutation()` |
| `/api/v1/products/:id/duplicate` | `POST` | Duplicate product as draft | `useDuplicateProductMutation()` |
| `/api/v1/products/bulk/archive` | `POST` | Bulk archive multiple products | `useBulkArchiveMutation()` |
| `/api/v1/products/bulk/delete` | `POST` | Bulk delete multiple products | `useBulkDeleteMutation()` |
| `/api/v1/categories` | `GET` | List store taxonomy categories | `useCategoriesQuery()` |
| `/api/v1/categories` | `POST` | Create new category | `useCreateCategoryMutation()` |
| `/api/v1/collections` | `GET` | List merchandising collections | `useCollectionsQuery()` |
| `/api/v1/collections` | `POST` | Create merchandising collection | `useCreateCollectionMutation()` |
| `/api/v1/inventory` | `GET` | Inventory items & stock stats | `useInventoryItemsQuery()`, `useInventoryStatsQuery()` |
| `/api/v1/inventory/movements` | `GET` | Audit trail of inventory movements | `useInventoryMovementsQuery()` |
| `/api/v1/inventory/adjustments` | `POST` | Record stock adjustment | `useStockAdjustmentMutation()` |

---

## 3. Storage & File Upload Contracts

| Pending Contract | Description | Impact on Frontend | Required Resolution |
|---|---|---|---|
| **Presigned URL Uploads** | Endpoint `/api/v1/uploads/presigned-url` for direct client upload of product images and store logos to S3/Cloudinary. | Product creation currently accepts web image URLs and local demo presets. Direct binary file upload requires presigned S3 URLs. | Backend to generate presigned S3/Cloudinary upload URLs with content-type and size restrictions. |

---

## 4. Authentication & Session Management Gaps

| Pending Contract | Description | Impact on Frontend | Required Resolution |
|---|---|---|---|
| **`/api/v1/auth/me` Endpoint** | Backend endpoint returning the active user profile, tenant memberships, and assigned roles. | Frontend currently uses default initialized state (`user: null`, ready for login flow). | Express API must expose `/auth/me` supporting session cookie or Bearer token verification. |
| **Refresh Token Strategy** | Formalization of whether refresh tokens are delivered via HttpOnly SameSite cookie or JSON body. | Determines interceptor implementation in `src/lib/api/client.ts`. | Recommended: HttpOnly cookie with CSRF header protection. |

---

## 5. Local Integrations Contracts (Required for Phase 5)

| Pending Contract | Description | Impact on Frontend | Required Resolution |
|---|---|---|---|
| **Bangladesh Payment Providers** | Formalized webhook and callback specifications for bKash, Nagad, and SSLCommerz. | Prevents fake connection status; ensures real callback validation. | Shared API to provide provider proxy endpoints and credential verification. |
| **Bangladesh Courier Providers** | API contracts for Steadfast, Pathao, and RedX consignment creation and tracking sync. | Required for live parcel tracking in order management. | Shared API to encapsulate courier API tokens and tracking webhooks. |
