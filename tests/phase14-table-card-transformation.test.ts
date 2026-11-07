import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Phase 14: Responsive Table-to-Card Transformation Verification", () => {
  const readComponent = (relativePath: string) => {
    const fullPath = path.resolve(process.cwd(), relativePath);
    return fs.readFileSync(fullPath, "utf-8");
  };

  describe("1. Core Dashboard & Overview", () => {
    it("should transform recent orders table on dashboard overview into mobile cards", () => {
      const code = readComponent("src/app/dashboard/page.tsx");
      expect(code).toContain("hidden md:block");
      expect(code).toContain("block md:hidden");
      expect(code).toContain("divide-y divide-border/60");
    });
  });

  describe("2. Orders & Returns Management", () => {
    it("should transform OrderListTable into mobile cards with checkbox and action menu at < lg", () => {
      const code = readComponent("src/features/orders/components/OrderListTable.tsx");
      expect(code).toContain("hidden lg:block");
      expect(code).toContain("block lg:hidden");
      expect(code).toContain("dropdown-menu");
    });

    it("should transform returns table into mobile cards at < md", () => {
      const code = readComponent("src/app/dashboard/orders/returns/page.tsx");
      expect(code).toContain("hidden md:block");
      expect(code).toContain("block md:hidden");
    });
  });

  describe("3. Products, Categories & Collections", () => {
    it("should transform ProductListTable into mobile cards at < lg", () => {
      const code = readComponent("src/features/products/components/ProductListTable.tsx");
      expect(code).toContain("hidden lg:block");
      expect(code).toContain("block lg:hidden");
      expect(code).toContain("Image");
    });

    it("should transform categories table into mobile cards at < md", () => {
      const code = readComponent("src/app/dashboard/products/categories/page.tsx");
      expect(code).toContain("hidden md:block");
      expect(code).toContain("block md:hidden");
    });

    it("should transform collections table into mobile cards at < md", () => {
      const code = readComponent("src/app/dashboard/products/collections/page.tsx");
      expect(code).toContain("hidden md:block");
      expect(code).toContain("block md:hidden");
    });
  });

  describe("4. Inventory & Stock Audit", () => {
    it("should transform InventoryTable with stock progress into mobile cards at < md", () => {
      const code = readComponent("src/features/inventory/components/InventoryTable.tsx");
      expect(code).toContain("hidden md:block");
      expect(code).toContain("block md:hidden");
    });

    it("should transform InventoryMovementHistory into mobile cards at < md", () => {
      const code = readComponent("src/features/inventory/components/InventoryMovementHistory.tsx");
      expect(code).toContain("hidden md:block");
      expect(code).toContain("block md:hidden");
    });
  });

  describe("5. Customers & Segmentation", () => {
    it("should transform CustomerListTable into mobile cards at < lg", () => {
      const code = readComponent("src/features/customers/components/CustomerListTable.tsx");
      expect(code).toContain("hidden lg:block");
      expect(code).toContain("block lg:hidden");
    });

    it("should transform CustomerOrdersTable into mobile cards at < md", () => {
      const code = readComponent("src/features/customers/components/CustomerOrdersTable.tsx");
      expect(code).toContain("hidden md:block");
      expect(code).toContain("block md:hidden");
    });

    it("should transform SegmentsListView into mobile cards at < md", () => {
      const code = readComponent("src/features/segmentation/components/SegmentsListView.tsx");
      expect(code).toContain("hidden md:block");
      expect(code).toContain("block md:hidden");
    });
  });

  describe("6. Payments, Refunds & Shipping", () => {
    it("should transform PaymentTransactionsTable into mobile cards at < lg", () => {
      const code = readComponent("src/features/payments/components/PaymentTransactionsTable.tsx");
      expect(code).toContain("hidden lg:block");
      expect(code).toContain("block lg:hidden");
    });

    it("should transform RefundsTable into mobile cards at < lg", () => {
      const code = readComponent("src/features/payments/components/RefundsTable.tsx");
      expect(code).toContain("hidden lg:block");
      expect(code).toContain("block lg:hidden");
    });

    it("should transform ShipmentListTable into mobile cards at < lg", () => {
      const code = readComponent("src/features/shipping/components/ShipmentListTable.tsx");
      expect(code).toContain("hidden lg:block");
      expect(code).toContain("block lg:hidden");
    });
  });

  describe("7. Marketing, Coupons & Discounts", () => {
    it("should transform CouponsListView into mobile cards at < lg", () => {
      const code = readComponent("src/features/marketing/components/CouponsListView.tsx");
      expect(code).toContain("hidden lg:block");
      expect(code).toContain("block lg:hidden");
    });

    it("should transform DiscountsListView into mobile cards at < lg", () => {
      const code = readComponent("src/features/marketing/components/DiscountsListView.tsx");
      expect(code).toContain("hidden lg:block");
      expect(code).toContain("block lg:hidden");
    });

    it("should transform MarketingAnalyticsView campaigns and coupons into mobile cards", () => {
      const code = readComponent("src/features/marketing/components/MarketingAnalyticsView.tsx");
      expect(code).toContain("hidden md:block");
      expect(code).toContain("block md:hidden");
    });

    it("should transform MarketingReportsView tabs into mobile cards at < lg", () => {
      const code = readComponent("src/features/marketing/components/MarketingReportsView.tsx");
      expect(code).toContain("hidden lg:block");
      expect(code).toContain("block lg:hidden");
    });
  });

  describe("8. Analytics & Deep Dive Reports", () => {
    it("should transform CustomerAnalyticsView into mobile cards", () => {
      const code = readComponent("src/features/analytics/components/CustomerAnalyticsView.tsx");
      expect(code).toContain("hidden md:block");
      expect(code).toContain("block md:hidden");
    });

    it("should transform SalesAnalyticsView into mobile cards", () => {
      const code = readComponent("src/features/analytics/components/SalesAnalyticsView.tsx");
      expect(code).toContain("hidden md:block");
      expect(code).toContain("block md:hidden");
    });

    it("should transform ProductAnalyticsView tables into mobile cards", () => {
      const code = readComponent("src/features/analytics/components/ProductAnalyticsView.tsx");
      expect(code).toContain("hidden md:block");
      expect(code).toContain("block md:hidden");
    });

    it("should transform marketing promotions table into mobile cards", () => {
      const code = readComponent("src/features/analytics/components/MarketingAnalyticsView.tsx");
      expect(code).toContain("hidden md:block");
      expect(code).toContain("block md:hidden");
    });
  });

  describe("9. Automation & Execution Auditing", () => {
    it("should transform AutomationOverview recent executions into mobile cards", () => {
      const code = readComponent("src/features/automation/components/AutomationOverview.tsx");
      expect(code).toContain("hidden md:block");
      expect(code).toContain("block md:hidden");
    });

    it("should transform WorkflowsListView into mobile cards", () => {
      const code = readComponent("src/features/automation/components/WorkflowsListView.tsx");
      expect(code).toContain("hidden md:block");
      expect(code).toContain("block md:hidden");
    });

    it("should transform ExecutionHistoryView into mobile cards", () => {
      const code = readComponent("src/features/automation/components/ExecutionHistoryView.tsx");
      expect(code).toContain("hidden md:block");
      expect(code).toContain("block md:hidden");
    });
  });

  describe("10. Integrations & Webhooks", () => {
    it("should transform WebhooksListView endpoints and delivery history into mobile cards", () => {
      const code = readComponent("src/features/integrations/components/WebhooksListView.tsx");
      expect(code).toContain("hidden md:block");
      expect(code).toContain("block md:hidden");
    });
  });

  describe("11. Billing, Subscriptions & Invoices", () => {
    it("should transform InvoicesListView into mobile cards at < md", () => {
      const code = readComponent("src/features/billing/components/InvoicesListView.tsx");
      expect(code).toContain("hidden md:block");
      expect(code).toContain("block md:hidden");
    });

    it("should transform BillingOverviewView recent invoices into mobile cards", () => {
      const code = readComponent("src/features/billing/components/BillingOverviewView.tsx");
      expect(code).toContain("hidden md:block");
      expect(code).toContain("block md:hidden");
    });

    it("should transform PlansComparisonView feature matrix into mobile cards at < md", () => {
      const code = readComponent("src/features/billing/components/PlansComparisonView.tsx");
      expect(code).toContain("hidden md:block");
      expect(code).toContain("block md:hidden");
    });
  });

  describe("12. Storefront CMS & Domain Management", () => {
    it("should transform PagesListView into mobile cards at < md", () => {
      const code = readComponent("src/features/storefront/components/PagesListView.tsx");
      expect(code).toContain("hidden md:block");
      expect(code).toContain("block md:hidden");
    });

    it("should transform DomainManagementView routing table and DNS guide into mobile cards", () => {
      const code = readComponent("src/features/storefront/components/DomainManagementView.tsx");
      expect(code).toContain("hidden md:block");
      expect(code).toContain("block md:hidden");
      expect(code).toContain("block sm:hidden");
    });
  });

  describe("13. Support & Ticketing", () => {
    it("should transform TicketsListView into mobile cards at < md", () => {
      const code = readComponent("src/features/support/components/TicketsListView.tsx");
      expect(code).toContain("hidden md:block");
      expect(code).toContain("block md:hidden");
    });
  });

  describe("14. Team & RBAC Permissions Matrix", () => {
    it("should transform TeamMembersListView members and invitations into mobile cards at < lg", () => {
      const code = readComponent("src/features/team/components/TeamMembersListView.tsx");
      expect(code).toContain("hidden lg:block");
      expect(code).toContain("block lg:hidden");
    });

    it("should transform RolesPermissionsMatrixView into mobile cards at < lg", () => {
      const code = readComponent("src/features/team/components/RolesPermissionsMatrixView.tsx");
      expect(code).toContain("hidden lg:block");
      expect(code).toContain("block lg:hidden");
    });
  });
});
