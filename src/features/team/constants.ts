import type { MerchantRole, Permission } from "@/types/auth";
import type { TeamMember, TeamInvitation, RoleDefinition } from "./types";
import { DEFAULT_ROLE_PERMISSIONS } from "@/lib/permissions/rbac";

export const ROLE_DEFINITIONS: Record<MerchantRole, RoleDefinition> = {
  owner: {
    role: "owner",
    label: "Store Owner",
    description: "Full authoritative control across all store operations, billing, subscriptions, team members, integrations, and ownership settings.",
    defaultPermissions: DEFAULT_ROLE_PERMISSIONS.owner,
    isSystemProtected: true,
  },
  admin: {
    role: "admin",
    label: "Store Administrator",
    description: "Manage day-to-day store operations, catalog, orders, shipping, marketing, and team members. Restricted from owner-only billing and ownership transfer.",
    defaultPermissions: DEFAULT_ROLE_PERMISSIONS.admin,
  },
  order_manager: {
    role: "order_manager",
    label: "Order Manager",
    description: "Manage incoming orders, update fulfillment statuses, handle return requests, inspect customer details, and dispatch courier shipments.",
    defaultPermissions: DEFAULT_ROLE_PERMISSIONS.order_manager,
  },
  product_manager: {
    role: "product_manager",
    label: "Product Manager",
    description: "Create and update catalog products, manage categories, collections, variants, pricing, and inventory stock allocations.",
    defaultPermissions: DEFAULT_ROLE_PERMISSIONS.product_manager,
  },
  inventory_manager: {
    role: "inventory_manager",
    label: "Inventory Manager",
    description: "Monitor warehouse stock levels, execute stock adjustments, manage restocks, and review inventory movement history.",
    defaultPermissions: DEFAULT_ROLE_PERMISSIONS.inventory_manager,
  },
  marketing_manager: {
    role: "marketing_manager",
    label: "Marketing Manager",
    description: "Manage promotional campaigns, coupon codes, automatic discounts, flash sales, banner promotions, and marketing analytics.",
    defaultPermissions: DEFAULT_ROLE_PERMISSIONS.marketing_manager,
  },
  accountant: {
    role: "accountant",
    label: "Accountant / Finance",
    description: "Access transaction ledgers, payment method statuses, refunds, order settlement reports, and financial summaries.",
    defaultPermissions: DEFAULT_ROLE_PERMISSIONS.accountant,
  },
  support: {
    role: "support",
    label: "Support Staff",
    description: "View customer profiles, track shipments, inspect order details, and assist shoppers with support inquiries.",
    defaultPermissions: DEFAULT_ROLE_PERMISSIONS.support,
  },
};

export interface PermissionGroup {
  name: string;
  permissions: {
    id: Permission;
    label: string;
    description: string;
  }[];
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    name: "Products & Catalog",
    permissions: [
      { id: "products.view", label: "View Products", description: "Browse catalog products and categories" },
      { id: "products.create", label: "Create Products", description: "Add new products and variants" },
      { id: "products.update", label: "Update Products", description: "Edit descriptions, prices, and media" },
      { id: "products.archive", label: "Archive / Delete Products", description: "Soft-archive or permanently delete items" },
    ],
  },
  {
    name: "Inventory Management",
    permissions: [
      { id: "inventory.view", label: "View Inventory", description: "Inspect stock levels across products" },
      { id: "inventory.adjust", label: "Adjust Stock", description: "Record manual stock counts and adjustments" },
    ],
  },
  {
    name: "Orders & Customers",
    permissions: [
      { id: "orders.view", label: "View Orders", description: "Inspect order details, timeline, and customer info" },
      { id: "orders.update_status", label: "Update Order Status", description: "Transition orders to processing, shipped, or delivered" },
      { id: "orders.cancel", label: "Cancel Orders", description: "Cancel orders and restock items" },
      { id: "refunds.request", label: "Request Refunds", description: "Initiate return and refund requests" },
      { id: "refunds.approve", label: "Approve Refunds", description: "Authorize monetary disbursements" },
      { id: "customers.view", label: "View Customers", description: "View customer directory and purchase history" },
      { id: "customers.export", label: "Export Customers", description: "Export customer data to CSV" },
    ],
  },
  {
    name: "Payments & Logistics",
    permissions: [
      { id: "payments.view", label: "View Payments", description: "Inspect transaction ledgers and gateway logs" },
      { id: "payments.manage", label: "Manage Payments", description: "Configure bKash, Nagad, SSLCommerz credentials" },
      { id: "shipping.view", label: "View Shipping", description: "Track courier shipments and parcels" },
      { id: "shipping.manage", label: "Manage Couriers", description: "Configure Steadfast, Pathao, RedX connections" },
    ],
  },
  {
    name: "Storefront & Marketing",
    permissions: [
      { id: "storefront.manage", label: "Manage Storefront", description: "Customize themes, domains, and CMS pages" },
      { id: "marketing.view", label: "View Marketing", description: "Inspect promotion analytics and ROI" },
      { id: "marketing.manage", label: "Manage Campaigns", description: "Configure banners and promotional settings" },
      { id: "discounts.manage", label: "Manage Coupons & Flash Sales", description: "Create and edit coupon codes and flash drops" },
      { id: "reports.view", label: "View Reports", description: "Export CSV ledgers and analytical reports" },
    ],
  },
  {
    name: "Administration & System",
    permissions: [
      { id: "team.manage", label: "Manage Team", description: "Invite, edit, and remove team members" },
      { id: "billing.manage", label: "Manage Billing", description: "Manage subscription plans and invoices" },
      { id: "settings.manage", label: "Store Settings", description: "Configure business profile and policies" },
      { id: "integrations.manage", label: "Manage Integrations", description: "Configure third-party apps and webhooks" },
    ],
  },
];

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "tm_01",
    name: "Tariqul Islam",
    email: "tariqul@greenharvest.com.bd",
    phone: "+880 1711-234567",
    role: "owner",
    status: "active",
    twoFactorEnabled: true,
    joinedAt: "2025-10-01T09:00:00.000Z",
    lastActiveAt: "2026-11-02T11:45:00.000Z",
    isOwner: true,
  },
  {
    id: "tm_02",
    name: "Shamima Akhter",
    email: "shamima@greenharvest.com.bd",
    phone: "+880 1819-876543",
    role: "admin",
    status: "active",
    twoFactorEnabled: true,
    joinedAt: "2026-01-15T10:30:00.000Z",
    lastActiveAt: "2026-11-02T11:15:00.000Z",
  },
  {
    id: "tm_03",
    name: "Kamrul Hasan",
    email: "kamrul@greenharvest.com.bd",
    phone: "+880 1912-345678",
    role: "order_manager",
    status: "active",
    twoFactorEnabled: false,
    joinedAt: "2026-03-10T14:20:00.000Z",
    lastActiveAt: "2026-11-02T10:50:00.000Z",
  },
  {
    id: "tm_04",
    name: "Farhana Yasmin",
    email: "farhana@greenharvest.com.bd",
    phone: "+880 1610-987654",
    role: "inventory_manager",
    status: "active",
    twoFactorEnabled: true,
    joinedAt: "2026-04-02T11:00:00.000Z",
    lastActiveAt: "2026-11-01T17:30:00.000Z",
  },
  {
    id: "tm_05",
    name: "Rakib Chowdhury",
    email: "rakib@greenharvest.com.bd",
    phone: "+880 1515-112233",
    role: "support",
    status: "active",
    twoFactorEnabled: false,
    joinedAt: "2026-06-20T08:45:00.000Z",
    lastActiveAt: "2026-11-02T09:20:00.000Z",
  },
];

export const INITIAL_INVITATIONS: TeamInvitation[] = [
  {
    id: "inv_01",
    email: "nusrat.mkt@gmail.com",
    name: "Nusrat Jahan",
    role: "marketing_manager",
    invitedBy: "Tariqul Islam",
    invitedAt: "2026-10-29T14:30:00.000Z",
    expiresAt: "2026-11-05T14:30:00.000Z",
    status: "pending",
  },
  {
    id: "inv_02",
    email: "mahmud.acc@outlook.com",
    name: "Mahmudur Rahman",
    role: "accountant",
    invitedBy: "Tariqul Islam",
    invitedAt: "2026-10-15T11:00:00.000Z",
    expiresAt: "2026-10-22T11:00:00.000Z",
    status: "expired",
  },
];

