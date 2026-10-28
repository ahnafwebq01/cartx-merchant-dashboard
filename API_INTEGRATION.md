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

## 3. Endpoints Matrix (Planned by Phase)

### Auth & Store Context (Phase 1 / Phase 2 Baseline)
| Method | Endpoint | Description | Status |
|---|---|---|---|
| `POST` | `/auth/login` | Merchant credentials authentication | Contract Planned |
| `POST` | `/auth/refresh` | Refresh short-lived access token | Contract Planned |
| `GET` | `/auth/me` | Fetch active user profile and store memberships | Contract Planned |
| `POST` | `/auth/logout` | Revoke session and invalidate tokens | Contract Planned |

### Onboarding & Store Profile (Phase 2)
| Method | Endpoint | Description | Status |
|---|---|---|---|
| `POST` | `/stores/onboarding` | Initialize new store wizard draft | Contract Planned |
| `PATCH` | `/stores/onboarding/:step` | Save onboarding step progress | Contract Planned |
| `GET` | `/stores/current` | Get active store profile and settings | Contract Planned |
| `PUT` | `/stores/current` | Update store business information | Contract Planned |
| `POST` | `/stores/current/publish` | Complete onboarding and publish storefront | Contract Planned |

### Commerce Operations (Phases 3–5)
| Module | Endpoint Group | Description |
|---|---|---|
| **Products** | `/products` | CRUD, categories, variants, inventory items |
| **Orders** | `/orders` | Order processing, status state machine, invoices |
| **Customers** | `/customers` | Customer records, groups, order history |
| **Payments** | `/payments` | Transactions, gateway credentials, refund requests |
| **Shipping** | `/shipping` | Shipping zones, rates, courier integration webhooks |

---

## 4. Frontend API Client Usage

The frontend uses the centralized singleton `apiClient` located at `src/lib/api/client.ts`:

```ts
import { apiClient } from "@/lib/api/client";

// Example GET with automatic tenant header injection
const response = await apiClient.get<StoreSummary>("/stores/current");
console.log(response.data.name);

// Example POST with typed request body
const result = await apiClient.post<Product>("/products", {
  name: "Sample Product",
  price: 1500,
});
```

