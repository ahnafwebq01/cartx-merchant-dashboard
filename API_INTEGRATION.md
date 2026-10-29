# CartX Merchant Dashboard — API Integration Specification

**Product:** CartX Merchant Dashboard  
**Backend Architecture:** Shared Express.js + TypeScript API  
**Database:** PostgreSQL with Prisma ORM  
**Base URL:** Configured via `NEXT_PUBLIC_API_BASE_URL` (default: `http://localhost:5000/api/v1`)  

---

## 1. Architectural Boundary & Security Rules

1. **Shared Backend**: The backend is an authoritative external service. The frontend never contains database models, Prisma clients, or direct database queries.
2. **Authoritative Authorization**: Frontend checks (`hasPermission`, `PermissionGuard`) exist exclusively for UI user experience. All mutations, queries, stock validations, and calculations must be authoritatively verified by the backend API using the authenticated session.
3. **Tenant Context**: The `X-Store-Id` header is sent with client requests to declare active store intent. The backend authoritatively verifies that the session token has legitimate membership in the specified store.

---

## 2. Standard Envelope Formats

### 2.1 Standard Success Envelope
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 120,
    "totalPages": 6
  }
}
```

### 2.2 Standard Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Invalid store slug provided",
    "details": [
      {
        "field": "slug",
        "message": "Store slug already exists"
      }
    ],
    "requestId": "req-9842a-102"
  }
}
```

---

## 3. Endpoints Matrix & Contracts

### 3.1 Onboarding & Store Creation (Phase 2 Integrated)

#### `GET /stores/onboarding`
- **Purpose**: Fetches active onboarding progress and draft form data.
- **Headers**: `Authorization: Bearer <token>`, optional `X-Store-Id`
- **Response**: `ApiResponse<OnboardingDraft>`

#### `PATCH /stores/onboarding/:step`
- **Purpose**: Persists data for a specific onboarding step (1 to 6).
- **Parameters**: `step` (integer 1..6)
- **Request Body Examples**:
  - Step 1: `{ storeName, storeSlug, businessType, ownerName, contactEmail, contactPhone }`
  - Step 2: `{ businessAddress, district, cityArea, postalCode, businessCategory, tradeLicenseNo }`
  - Step 3: `{ storeDescription, brandColor, themeId, logoUrl }`
  - Step 4: `{ productName, price, initialStock, category, imageUrl }`
  - Step 5: `{ cashOnDelivery, onlineProvider, providerStatus }`
  - Step 6: `{ insideDhakaRate, outsideDhakaRate, freeShippingThreshold, courierPartner }`
- **Response**: `ApiResponse<OnboardingDraft>`

#### `GET /stores/check-slug?slug=...`
- **Purpose**: Validates availability of a requested subdomain slug.
- **Query Params**: `slug` (string, min 3 chars)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "available": true,
      "slug": "dhaka-crafts",
      "message": "Subdomain is available"
    }
  }
  ```

#### `POST /stores/current/publish`
- **Purpose**: Validates all prerequisite steps and publishes the store to the public storefront domain.
- **Headers**: `Authorization: Bearer <token>`, `X-Store-Id: <storeId>`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "success": true,
      "storefrontUrl": "https://dhaka-crafts.cartx.com.bd",
      "publishedAt": "2026-10-28T14:48:00.000Z"
    }
  }
  ```

---

### 3.2 Store Profile & Settings (Phase 2 Integrated)

#### `GET /stores/current`
- **Purpose**: Fetches active store configuration, address, contacts, and locale settings.
- **Headers**: `Authorization: Bearer <token>`, `X-Store-Id: <storeId>`
- **Response**: `ApiResponse<StoreSettings>`

#### `PUT /stores/current`
- **Purpose**: Updates store profile and configuration.
- **Request Body**: Partial or full `StoreSettings` (`name`, `description`, `businessCategory`, `businessAddress`, `district`, `cityArea`, `postalCode`, `ownerName`, `contactEmail`, `contactPhone`, `currency`, `locale`, `timezone`).
- **Response**: `ApiResponse<StoreSettings>`

---

### 3.3 Planned Endpoints (Phase 3–5)
| Module | Endpoint Group | Description |
|---|---|---|
| **Products** | `/products` | CRUD, categories, variants, inventory items |
| **Orders** | `/orders` | Order processing, status state machine, invoices |
| **Customers** | `/customers` | Customer records, groups, order history |
| **Payments** | `/payments` | Transactions, gateway credentials, refund requests |
| **Shipping** | `/shipping` | Shipping zones, rates, courier integration webhooks |
