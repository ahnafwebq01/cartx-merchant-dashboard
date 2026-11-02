import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  Users,
  CreditCard,
  Truck,
  Settings,
  Rocket,
  Globe,
  type LucideIcon,
} from "lucide-react";
import type { Permission } from "@/types/auth";

export interface NavSubItem {
  title: string;
  href: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "outline" | "success" | "warning";
  permission?: Permission;
}

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "outline" | "success" | "warning";
  permission?: Permission;
  exactMatch?: boolean;
  children?: NavSubItem[];
}

export interface NavGroup {
  id: string;
  title: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  items: NavItem[];
}

/**
 * Helper to determine if a route is active.
 * Prevents false positives like /dashboard matching everything.
 */
export function isRouteActive(
  pathname: string,
  targetHref: string,
  exactMatch?: boolean
): boolean {
  if (exactMatch || targetHref === "/dashboard") {
    return pathname === targetHref;
  }
  if (pathname === targetHref) {
    return true;
  }
  return pathname.startsWith(`${targetHref}/`);
}

/**
 * Helper to determine if a parent item or any of its children is active.
 */
export function isParentItemActive(item: NavItem, pathname: string): boolean {
  if (isRouteActive(pathname, item.href, item.exactMatch)) {
    return true;
  }
  if (item.children && item.children.length > 0) {
    return item.children.some((child) => isRouteActive(pathname, child.href, true));
  }
  return false;
}

/**
 * 100% Implemented Dashboard Navigation Hierarchy.
 * Organized into logical, collapsible groups containing only verified existing routes.
 * 
 * Unimplemented Phase 6–9 roadmap modules (Analytics, Marketing, Themes, Apps,
 * Mobile App, Team RBAC, Billing, Support) are intentionally excluded to prevent 404s.
 */
export const NAVIGATION_GROUPS: NavGroup[] = [
  {
    id: "overview",
    title: "Overview",
    collapsible: false,
    defaultOpen: true,
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        exactMatch: true,
      },
    ],
  },
  {
    id: "catalog",
    title: "Catalog",
    collapsible: true,
    defaultOpen: true,
    items: [
      {
        title: "Products",
        href: "/dashboard/products",
        icon: Package,
        permission: "products.view",
        children: [
          { title: "All Products", href: "/dashboard/products", permission: "products.view" },
          { title: "Add Product", href: "/dashboard/products/new", permission: "products.create" },
          { title: "Categories", href: "/dashboard/products/categories", permission: "products.view" },
          { title: "Collections", href: "/dashboard/products/collections", permission: "products.view" },
        ],
      },
      {
        title: "Inventory",
        href: "/dashboard/inventory",
        icon: Boxes,
        permission: "inventory.view",
        children: [
          { title: "Inventory Overview", href: "/dashboard/inventory", permission: "inventory.view" },
          { title: "Stock Adjustments", href: "/dashboard/inventory/adjustments", permission: "inventory.view" },
        ],
      },
    ],
  },
  {
    id: "sales",
    title: "Sales",
    collapsible: true,
    defaultOpen: true,
    items: [
      {
        title: "Orders",
        href: "/dashboard/orders",
        icon: ShoppingCart,
        permission: "orders.view",
        children: [
          { title: "All Orders", href: "/dashboard/orders", permission: "orders.view" },
          { title: "Returns & Refunds", href: "/dashboard/orders/returns", permission: "orders.view" },
        ],
      },
      {
        title: "Customers",
        href: "/dashboard/customers",
        icon: Users,
        permission: "customers.view",
        children: [
          { title: "All Customers", href: "/dashboard/customers", permission: "customers.view" },
          { title: "Customer Groups", href: "/dashboard/customers/groups", permission: "customers.view" },
        ],
      },
    ],
  },
  {
    id: "payments-finance",
    title: "Payments & Finance",
    collapsible: true,
    defaultOpen: true,
    items: [
      {
        title: "Payments",
        href: "/dashboard/payments",
        icon: CreditCard,
        permission: "payments.view",
        children: [
          { title: "Payment Overview", href: "/dashboard/payments", permission: "payments.view" },
          { title: "Transactions", href: "/dashboard/payments/transactions", permission: "payments.view" },
          { title: "Payment Methods", href: "/dashboard/payments/methods", permission: "payments.manage" },
          { title: "Refunds", href: "/dashboard/payments/refunds", permission: "refunds.request" },
          { title: "Payment Settings", href: "/dashboard/payments/settings", permission: "payments.manage" },
        ],
      },
    ],
  },
  {
    id: "shipping-logistics",
    title: "Shipping & Logistics",
    collapsible: true,
    defaultOpen: true,
    items: [
      {
        title: "Shipping",
        href: "/dashboard/shipping",
        icon: Truck,
        permission: "shipping.view",
        children: [
          { title: "Shipping Overview", href: "/dashboard/shipping", permission: "shipping.view" },
          { title: "Shipments & Tracking", href: "/dashboard/shipping/shipments", permission: "shipping.view" },
          { title: "Courier Integrations", href: "/dashboard/shipping/couriers", permission: "shipping.manage" },
          { title: "Shipping Settings", href: "/dashboard/shipping/settings", permission: "shipping.manage" },
        ],
      },
    ],
  },
  {
    id: "storefront",
    title: "Storefront",
    collapsible: true,
    defaultOpen: true,
    items: [
      {
        title: "Storefront",
        href: "/dashboard/store",
        icon: Globe,
        permission: "storefront.manage",
        children: [
          { title: "Store Overview", href: "/dashboard/store", permission: "storefront.manage" },
          { title: "Themes & Customization", href: "/dashboard/store/themes", permission: "storefront.manage" },
          { title: "Pages", href: "/dashboard/store/pages", permission: "storefront.manage" },
          { title: "Domains", href: "/dashboard/store/domains", permission: "storefront.manage" },
        ],
      },
    ],
  },
  {
    id: "store-management",
    title: "Store Management",
    collapsible: true,
    defaultOpen: true,
    items: [
      {
        title: "Store Profile & Settings",
        href: "/dashboard/settings",
        icon: Settings,
        permission: "settings.manage",
      },
      {
        title: "Onboarding Wizard",
        href: "/onboarding",
        icon: Rocket,
        permission: "settings.manage",
      },
    ],
  },
];

/**
 * Backwards-compatible flattened list of navigation items.
 */
export const NAVIGATION_ITEMS: NavItem[] = NAVIGATION_GROUPS.flatMap((group) => group.items);
