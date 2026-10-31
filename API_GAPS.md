# CartX Merchant Dashboard — API Gaps & Backend Dependencies

**Document Purpose:** Transparently record backend endpoints, contracts, or third-party provider specifications that are currently pending deployment or implementation in the shared Express.js backend.  
**Baseline:** `CARTX_MERCHANT_DASHBOARD.md` (Version 1.0)  
**Last Updated:** October 31, 2026 (Phase 4 Final Audit & Repository Verification)

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

| Planned Endpoint                 | Method   | Purpose                                | Frontend Hook / Consumer                               |
| -------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------ |
| `/api/v1/products`               | `GET`    | Paginated product listing with filters | `useProductsQuery(params)`                             |
| `/api/v1/products`               | `POST`   | Create product with validation         | `useCreateProductMutation()`                           |
| `/api/v1/products/:id`           | `GET`    | Single product detail                  | `useProductQuery(id)`                                  |
| `/api/v1/products/:id`           | `PATCH`  | Update product details                 | `useUpdateProductMutation()`                           |
| `/api/v1/products/:id`           | `DELETE` | Permanent product deletion             | `useDeleteProductMutation()`                           |
| `/api/v1/products/:id/archive`   | `POST`   | Soft-archive product                   | `useArchiveProductMutation()`                          |
| `/api/v1/products/:id/duplicate` | `POST`   | Duplicate product as draft             | `useDuplicateProductMutation()`                        |
| `/api/v1/products/bulk/archive`  | `POST`   | Bulk archive multiple products         | `useBulkArchiveMutation()`                             |
| `/api/v1/products/bulk/delete`   | `POST`   | Bulk delete multiple products          | `useBulkDeleteMutation()`                              |
| `/api/v1/categories`             | `GET`    | List store taxonomy categories         | `useCategoriesQuery()`                                 |
| `/api/v1/categories`             | `POST`   | Create new category                    | `useCreateCategoryMutation()`                          |
| `/api/v1/collections`            | `GET`    | List merchandising collections         | `useCollectionsQuery()`                                |
| `/api/v1/collections`            | `POST`   | Create merchandising collection        | `useCreateCollectionMutation()`                        |
| `/api/v1/inventory`              | `GET`    | Inventory items & stock stats          | `useInventoryItemsQuery()`, `useInventoryStatsQuery()` |
| `/api/v1/inventory/movements`    | `GET`    | Audit trail of inventory movements     | `useInventoryMovementsQuery()`                         |
| `/api/v1/inventory/adjustments`  | `POST`   | Record stock adjustment                | `useStockAdjustmentMutation()`                         |

---

## 3. Phase 4 Contracts Status (Orders & Customers)

Phase 4 features are fully operational using mock browser persistence (`mockOrders.ts` and `mockCustomers.ts`) and React Query hooks. When the shared Express backend is ready, the following endpoints will be connected to the typed client:

| Planned Endpoint              | Method  | Purpose                                          | Frontend Hook / Consumer             |
| ----------------------------- | ------- | ------------------------------------------------ | ------------------------------------ |
| `/api/v1/orders`              | `GET`   | Paginated orders listing with search and filters | `useOrdersQuery(params)`             |
| `/api/v1/orders/:id`          | `GET`   | Single order details with items and timeline     | `useOrderQuery(id)`                  |
| `/api/v1/orders/:id/status`   | `POST`  | Validated status transition                      | `useTransitionOrderStatusMutation()` |
| `/api/v1/orders/:id/cancel`   | `POST`  | Cancel order with reason and optional restock    | `useCancelOrderMutation()`           |
| `/api/v1/orders/:id/return`   | `POST`  | Return order with reason and refund              | `useReturnOrderMutation()`           |
| `/api/v1/orders/:id/payment`  | `PATCH` | Update payment status and gateway ref            | `useMarkPaymentStatusMutation()`     |
| `/api/v1/orders/:id/notes`    | `POST`  | Append private merchant staff note               | `useAddOrderNoteMutation()`          |
| `/api/v1/orders/bulk/status`  | `POST`  | Bulk transition eligible orders                  | `useBulkUpdateStatusMutation()`      |
| `/api/v1/orders/bulk/cancel`  | `POST`  | Bulk cancel eligible orders                      | `useBulkCancelOrdersMutation()`      |
| `/api/v1/orders/stats`        | `GET`   | Storewide orders KPI statistics                  | `useOrderStatsQuery()`               |
| `/api/v1/customers`           | `GET`   | Paginated customer database with filters         | `useCustomersQuery(params)`          |
| `/api/v1/customers/:id`       | `GET`   | Customer profile, addresses and lifetime metrics | `useCustomerQuery(id)`               |
| `/api/v1/customers`           | `POST`  | Create new customer record                       | `useCreateCustomerMutation()`        |
| `/api/v1/customers/:id/tags`  | `PATCH` | Update segmentation tags                         | `useUpdateCustomerTagsMutation()`    |
| `/api/v1/customers/:id/notes` | `POST`  | Append customer profile note                     | `useAddCustomerNoteMutation()`       |
| `/api/v1/customers/stats`     | `GET`   | Customer segments & LTV stats                    | `useCustomerStatsQuery()`            |

---

## 4. Phase 5 Contracts Status (Payments & Shipping Logistics)

Phase 5 frontend capabilities operate through typed adapter and service boundaries (`mockPayments.ts` and `mockShipping.ts`) backed by TanStack Query hooks. When the shared Express API is deployed, the following endpoints will replace the local service implementations:

### Payment Endpoints

| Planned Endpoint                    | Method  | Purpose                                                                | Frontend Hook / Consumer              |
| ----------------------------------- | ------- | ---------------------------------------------------------------------- | ------------------------------------- |
| `/api/v1/payments/transactions`     | `GET`   | Paginated transactions ledger with search, gateway, and status filters | `usePaymentTransactionsQuery(params)` |
| `/api/v1/payments/transactions/:id` | `GET`   | Single transaction detail with gateway references and timeline         | `usePaymentTransactionQuery(id)`      |
| `/api/v1/payments/initiate`         | `POST`  | Initialize bKash / Nagad / SSLCommerz checkout session                 | `useInitiatePaymentMutation()`        |
| `/api/v1/payments/verify`           | `POST`  | Authoritative server-side verification of payment execution            | `useVerifyPaymentMutation()`          |
| `/api/v1/payments/refunds`          | `GET`   | Paginated refund requests and settled reversals                        | `useRefundsQuery(params)`             |
| `/api/v1/payments/refunds`          | `POST`  | Idempotent refund request with balance validation                      | `useRequestRefundMutation()`          |
| `/api/v1/payments/methods`          | `GET`   | Configured payment gateway statuses and environments                   | `usePaymentMethodsQuery()`            |
| `/api/v1/payments/methods/:id`      | `PATCH` | Update gateway environment and merchant ID (zero secrets)              | `useUpdatePaymentMethodMutation()`    |
| `/api/v1/payments/stats`            | `GET`   | Storewide payment KPI metrics (gross volume, pending, refunds)         | `usePaymentKPIsQuery()`               |

### Shipping & Courier Endpoints

| Planned Endpoint                               | Method  | Purpose                                                                        | Frontend Hook / Consumer               |
| ---------------------------------------------- | ------- | ------------------------------------------------------------------------------ | -------------------------------------- |
| `/api/v1/shipping/shipments`                   | `GET`   | Paginated shipments ledger with courier and transit status filters             | `useShipmentsQuery(params)`            |
| `/api/v1/shipping/shipments/:id`               | `GET`   | Single consignment detail with live tracking timeline                          | `useShipmentQuery(id)`                 |
| `/api/v1/shipping/shipments/by-order/:orderId` | `GET`   | Active shipment linked to a specific order                                     | `useShipmentByOrderQuery(orderId)`     |
| `/api/v1/shipping/shipments`                   | `POST`  | Create courier consignment (Steadfast, Pathao, RedX) with duplicate prevention | `useCreateShipmentMutation()`          |
| `/api/v1/shipping/shipments/:id/cancel`        | `POST`  | Cancel courier consignment before pickup                                       | `useCancelShipmentMutation()`          |
| `/api/v1/shipping/couriers`                    | `GET`   | Configured courier connection statuses and pickup hubs                         | `useCourierConnectionsQuery()`         |
| `/api/v1/shipping/couriers/:id`                | `PATCH` | Update courier pickup address and store client code                            | `useUpdateCourierConnectionMutation()` |
| `/api/v1/shipping/rates`                       | `GET`   | Store shipping rules (inside/outside Dhaka, free threshold)                    | `useShippingRatesQuery()`              |
| `/api/v1/shipping/rates`                       | `PUT`   | Update store delivery charges and COD fees                                     | `useUpdateShippingRatesMutation()`     |
| `/api/v1/shipping/stats`                       | `GET`   | Logistics KPI statistics (in transit, delivered, COD receivables)              | `useShippingKPIsQuery()`               |

---

## 5. Storage & File Upload Contracts

| Pending Contract          | Description                                                                                                           | Impact on Frontend                                                                                                              | Required Resolution                                                                              |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Presigned URL Uploads** | Endpoint `/api/v1/uploads/presigned-url` for direct client upload of product images and store logos to S3/Cloudinary. | Product creation currently accepts web image URLs and local demo presets. Direct binary file upload requires presigned S3 URLs. | Backend to generate presigned S3/Cloudinary upload URLs with content-type and size restrictions. |

---

## 6. Authentication & Session Management Gaps

| Pending Contract               | Description                                                                                      | Impact on Frontend                                                                      | Required Resolution                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **`/api/v1/auth/me` Endpoint** | Backend endpoint returning the active user profile, tenant memberships, and assigned roles.      | Frontend currently uses default initialized state (`user: null`, ready for login flow). | Express API must expose `/auth/me` supporting session cookie or Bearer token verification. |
| **Refresh Token Strategy**     | Formalization of whether refresh tokens are delivered via HttpOnly SameSite cookie or JSON body. | Determines interceptor implementation in `src/lib/api/client.ts`.                       | Recommended: HttpOnly cookie with CSRF header protection.                                  |

---

## 7. Third-Party Gateway & Courier Proxies (Required for Live Mode)

| Pending Contract                       | Description                                                                                                                             | Impact on Frontend                                                                                                     | Required Resolution                                                                         |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Bangladesh Payment Gateways Proxy**  | Backend proxy endpoints to execute bKash Tokenized, Nagad Direct, and SSLCommerz APIs without exposing merchant secrets in the browser. | Frontend runs in high-fidelity sandbox simulation mode. Live transactions require authoritative server-side execution. | Express API to securely manage merchant API credentials and verify IPN callback signatures. |
| **Bangladesh Courier Providers Proxy** | Backend proxy endpoints to create consignments and sync tracking webhooks with Steadfast, Pathao, and RedX.                             | Consignment booking currently operates in sandbox simulation mode with consistent consignment numbers.                 | Express API to store courier bearer tokens and receive real-time courier tracking webhooks. |
