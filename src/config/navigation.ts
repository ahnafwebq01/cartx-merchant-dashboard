import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  Users,
  CreditCard,
  Truck,
  Megaphone,
  Store,
  BarChart3,
  AppWindow,
  Smartphone,
  ShieldCheck,
  Receipt,
  HelpCircle,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { Permission } from "@/types/auth";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  permission?: Permission;
  children?: {
    title: string;
    href: string;
    permission?: Permission;
  }[];
}

/**
 * 16 Primary Navigation Groups from CARTX_MERCHANT_DASHBOARD.md (Section 4.1)
 */
export const NAVIGATION_ITEMS: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Sales & Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
    permission: "orders.view",
    children: [
      { title: "All Orders", href: "/dashboard/orders" },
      { title: "Returns & Refunds", href: "/dashboard/orders/returns" },
    ],
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: Package,
    permission: "products.view",
    children: [
      { title: "All Products", href: "/dashboard/products" },
      { title: "Categories", href: "/dashboard/products/categories" },
      { title: "Collections", href: "/dashboard/products/collections" },
    ],
  },
  {
    title: "Stocks & Inventory",
    href: "/dashboard/inventory",
    icon: Boxes,
    permission: "inventory.view",
    children: [
      { title: "Inventory Overview", href: "/dashboard/inventory" },
      { title: "Stock Adjustments", href: "/dashboard/inventory/adjustments" },
    ],
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: Users,
    permission: "customers.view",
    children: [
      { title: "All Customers", href: "/dashboard/customers" },
      { title: "Customer Groups", href: "/dashboard/customers/groups" },
    ],
  },
  {
    title: "Payments & Finance",
    href: "/dashboard/payments",
    icon: CreditCard,
    permission: "reports.view",
    children: [
      { title: "Transactions", href: "/dashboard/payments" },
      { title: "Payment Methods", href: "/dashboard/payments/methods" },
    ],
  },
  {
    title: "Shipping & Delivery",
    href: "/dashboard/shipping",
    icon: Truck,
    children: [
      { title: "Shipping Overview", href: "/dashboard/shipping" },
      { title: "Courier Integrations", href: "/dashboard/shipping/couriers" },
    ],
  },
  {
    title: "Marketing & Promotions",
    href: "/dashboard/marketing",
    icon: Megaphone,
    permission: "discounts.manage",
    children: [
      { title: "Coupons", href: "/dashboard/marketing/coupons" },
      { title: "Campaigns", href: "/dashboard/marketing/campaigns" },
    ],
  },
  {
    title: "Online Store",
    href: "/dashboard/store",
    icon: Store,
    permission: "storefront.manage",
    children: [
      { title: "Theme & Customization", href: "/dashboard/store/themes" },
      { title: "Domain Management", href: "/dashboard/store/domains" },
    ],
  },
  {
    title: "Analytics & Reports",
    href: "/dashboard/analytics",
    icon: BarChart3,
    permission: "reports.view",
  },
  {
    title: "Apps & Integrations",
    href: "/dashboard/apps",
    icon: AppWindow,
    permission: "integrations.manage",
  },
  {
    title: "Mobile App",
    href: "/dashboard/mobile-app",
    icon: Smartphone,
  },
  {
    title: "Team & Access",
    href: "/dashboard/team",
    icon: ShieldCheck,
    permission: "team.manage",
  },
  {
    title: "Subscription & Billing",
    href: "/dashboard/billing",
    icon: Receipt,
    permission: "billing.manage",
  },
  {
    title: "Support & Resources",
    href: "/dashboard/support",
    icon: HelpCircle,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    permission: "settings.manage",
  },
];

