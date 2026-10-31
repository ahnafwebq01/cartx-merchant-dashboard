/**
 * Merchant Dashboard Roles defined in CARTX_MERCHANT_DASHBOARD.md (Section 3.1)
 */
export type MerchantRole =
  | "owner"
  | "admin"
  | "order_manager"
  | "product_manager"
  | "inventory_manager"
  | "marketing_manager"
  | "accountant"
  | "support";

/**
 * Granular permissions supported by the CartX Permission Engine (Section 3.2)
 */
export type Permission =
  | "products.view"
  | "products.create"
  | "products.update"
  | "products.archive"
  | "inventory.view"
  | "inventory.adjust"
  | "orders.view"
  | "orders.update_status"
  | "orders.cancel"
  | "refunds.request"
  | "refunds.approve"
  | "customers.view"
  | "customers.export"
  | "discounts.manage"
  | "reports.view"
  | "storefront.manage"
  | "integrations.manage"
  | "team.manage"
  | "billing.manage"
  | "settings.manage"
  | "payments.view"
  | "payments.manage"
  | "shipping.view"
  | "shipping.manage";

/**
 * Basic user profile representation
 */
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
}

/**
 * Minimal summary of a store for context switching
 */
export interface StoreSummary {
  id: string;
  name: string;
  slug: string;
  currency: string;
  status: "active" | "setup_incomplete" | "suspended";
  logoUrl?: string;
}

/**
 * Association between a user and an authorized store
 */
export interface StoreMembership {
  storeId: string;
  store: StoreSummary;
  role: MerchantRole;
  customPermissions?: Permission[];
}

/**
 * Authentication and store context state representation
 */
export interface AuthState {
  user: User | null;
  currentStore: StoreSummary | null;
  currentRole: MerchantRole | null;
  permissions: Permission[];
  isAuthenticated: boolean;
  isLoading: boolean;
}

