import type { MerchantRole, Permission } from "@/types/auth";

/**
 * Standard default permissions associated with built-in roles (Section 3.1)
 * NOTE: Frontend checks are strictly for UI optimization (hiding actions/routes).
 * The shared Express API authoritatively enforces role permissions on every request.
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<MerchantRole, Permission[]> = {
  owner: [
    "products.view",
    "products.create",
    "products.update",
    "products.archive",
    "inventory.view",
    "inventory.adjust",
    "orders.view",
    "orders.update_status",
    "orders.cancel",
    "refunds.request",
    "refunds.approve",
    "customers.view",
    "customers.export",
    "discounts.manage",
    "reports.view",
    "storefront.manage",
    "integrations.manage",
    "team.manage",
    "billing.manage",
    "settings.manage",
  ],
  admin: [
    "products.view",
    "products.create",
    "products.update",
    "products.archive",
    "inventory.view",
    "inventory.adjust",
    "orders.view",
    "orders.update_status",
    "orders.cancel",
    "refunds.request",
    "refunds.approve",
    "customers.view",
    "customers.export",
    "discounts.manage",
    "reports.view",
    "storefront.manage",
    "integrations.manage",
    "team.manage",
    "settings.manage",
  ],
  order_manager: [
    "orders.view",
    "orders.update_status",
    "orders.cancel",
    "refunds.request",
    "customers.view",
  ],
  product_manager: [
    "products.view",
    "products.create",
    "products.update",
    "products.archive",
    "inventory.view",
    "inventory.adjust",
  ],
  inventory_manager: [
    "inventory.view",
    "inventory.adjust",
    "products.view",
    "reports.view",
  ],
  marketing_manager: [
    "discounts.manage",
    "storefront.manage",
    "reports.view",
  ],
  accountant: [
    "orders.view",
    "refunds.request",
    "reports.view",
  ],
  support: [
    "orders.view",
    "orders.update_status",
    "customers.view",
  ],
};

/**
 * Checks if a user has a specific permission.
 */
export function hasPermission(
  userPermissions: Permission[],
  requiredPermission: Permission
): boolean {
  return userPermissions.includes(requiredPermission);
}

/**
 * Checks if a user has at least one of the specified permissions.
 */
export function hasAnyPermission(
  userPermissions: Permission[],
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.some((perm) => userPermissions.includes(perm));
}

/**
 * Checks if a user has all of the specified permissions.
 */
export function hasAllPermissions(
  userPermissions: Permission[],
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.every((perm) => userPermissions.includes(perm));
}

