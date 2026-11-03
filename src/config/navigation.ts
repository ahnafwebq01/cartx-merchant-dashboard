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
  Megaphone,
  ShieldCheck,
  Receipt,
  LifeBuoy,
  Smartphone,
  BarChart3,
  Plug,
  Zap,
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
 * 100% Implemented Dashboard Navigation Hierarchy (Phases 1 through 9).
 * Organized into logical, collapsible groups containing only verified existing routes.
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
    id: "mobile-app",
    title: "Mobile App",
    collapsible: true,
    defaultOpen: true,
    items: [
      {
        title: "Mobile App",
        href: "/dashboard/mobile-app",
        icon: Smartphone,
        permission: "storefront.manage",
        children: [
          { title: "App Overview", href: "/dashboard/mobile-app", permission: "storefront.manage" },
          { title: "Branding & Colors", href: "/dashboard/mobile-app/branding", permission: "storefront.manage" },
          { title: "Content & Layout", href: "/dashboard/mobile-app/content", permission: "storefront.manage" },
          { title: "Platform Preview", href: "/dashboard/mobile-app/preview", permission: "storefront.manage" },
          { title: "Push & Settings", href: "/dashboard/mobile-app/settings", permission: "storefront.manage" },
        ],
      },
    ],
  },
  {
    id: "marketing",
    title: "Marketing",
    collapsible: true,
    defaultOpen: true,
    items: [
      {
        title: "Marketing",
        href: "/dashboard/marketing",
        icon: Megaphone,
        permission: "marketing.view",
        children: [
          { title: "Marketing Overview", href: "/dashboard/marketing", permission: "marketing.view" },
          { title: "Customer Segments", href: "/dashboard/marketing/segments", permission: "marketing.view" },
          { title: "Coupons", href: "/dashboard/marketing/coupons", permission: "discounts.manage" },
          { title: "Discounts", href: "/dashboard/marketing/discounts", permission: "discounts.manage" },
          { title: "Flash Sales", href: "/dashboard/marketing/flash-sales", permission: "discounts.manage" },
          { title: "Marketing Analytics", href: "/dashboard/marketing/analytics", permission: "marketing.view" },
          { title: "Reports", href: "/dashboard/marketing/reports", permission: "reports.view" },
        ],
      },
    ],
  },
  {
    id: "analytics",
    title: "Analytics & Insights",
    collapsible: true,
    defaultOpen: true,
    items: [
      {
        title: "Analytics Hub",
        href: "/dashboard/analytics",
        icon: BarChart3,
        permission: "reports.view",
        children: [
          { title: "Overview", href: "/dashboard/analytics", permission: "reports.view" },
          { title: "Sales Trends", href: "/dashboard/analytics/sales", permission: "reports.view" },
          { title: "Customer Cohorts", href: "/dashboard/analytics/customers", permission: "reports.view" },
          { title: "Product Performance", href: "/dashboard/analytics/products", permission: "reports.view" },
          { title: "Marketing ROI", href: "/dashboard/analytics/marketing", permission: "reports.view" },
        ],
      },
    ],
  },
  {
    id: "integrations",
    title: "Integrations & APIs",
    collapsible: true,
    defaultOpen: true,
    items: [
      {
        title: "Integrations",
        href: "/dashboard/integrations",
        icon: Plug,
        permission: "integrations.manage",
        children: [
          { title: "Service Catalog", href: "/dashboard/integrations", permission: "integrations.manage" },
          { title: "Webhooks", href: "/dashboard/integrations/webhooks", permission: "integrations.manage" },
        ],
      },
    ],
  },
  {
    id: "automation",
    title: "Automations",
    collapsible: true,
    defaultOpen: true,
    items: [
      {
        title: "Workflows",
        href: "/dashboard/automation",
        icon: Zap,
        permission: "integrations.manage",
        children: [
          { title: "Automation Overview", href: "/dashboard/automation", permission: "integrations.manage" },
          { title: "Workflow Recipes", href: "/dashboard/automation/workflows", permission: "integrations.manage" },
          { title: "Create Recipe", href: "/dashboard/automation/workflows/new", permission: "integrations.manage" },
          { title: "Execution History", href: "/dashboard/automation/history", permission: "integrations.manage" },
        ],
      },
    ],
  },
  {
    id: "team",
    title: "Team & Access",
    collapsible: true,
    defaultOpen: true,
    items: [
      {
        title: "Team Management",
        href: "/dashboard/team",
        icon: ShieldCheck,
        permission: "team.manage",
        children: [
          { title: "Team Members", href: "/dashboard/team", permission: "team.manage" },
          { title: "Roles & Permissions", href: "/dashboard/team/roles", permission: "team.manage" },
        ],
      },
    ],
  },
  {
    id: "billing",
    title: "Subscription & Billing",
    collapsible: true,
    defaultOpen: true,
    items: [
      {
        title: "Billing & Plans",
        href: "/dashboard/billing",
        icon: Receipt,
        permission: "billing.manage",
        children: [
          { title: "Plan & Usage", href: "/dashboard/billing", permission: "billing.manage" },
          { title: "Plans & Pricing", href: "/dashboard/billing/plans", permission: "billing.manage" },
          { title: "Invoices", href: "/dashboard/billing/invoices", permission: "billing.manage" },
          { title: "Billing Settings", href: "/dashboard/billing/settings", permission: "billing.manage" },
        ],
      },
    ],
  },
  {
    id: "support",
    title: "Help & Support",
    collapsible: true,
    defaultOpen: true,
    items: [
      {
        title: "Support Center",
        href: "/dashboard/support",
        icon: LifeBuoy,
        children: [
          { title: "Help Center", href: "/dashboard/support" },
          { title: "Support Tickets", href: "/dashboard/support/tickets" },
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
