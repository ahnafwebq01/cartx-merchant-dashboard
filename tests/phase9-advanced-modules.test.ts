import { describe, it, expect, beforeEach } from "vitest";
import { mockMobileAppService } from "@/features/mobile-app/services/mockMobileApp";
import {
  mobileAppBrandingSchema,
  mobileAppSettingsSchema,
} from "@/features/mobile-app/schemas";
import { mockSegmentationService } from "@/features/segmentation/services/mockSegmentation";
import { mockAnalyticsService } from "@/features/analytics/services/mockAnalytics";
import { getDateRangeFromPreset } from "@/features/analytics/constants";
import { mockIntegrationsService } from "@/features/integrations/services/mockIntegrations";
import { webhookEndpointSchema } from "@/features/integrations/schemas";
import { mockAutomationService } from "@/features/automation/services/mockAutomation";
import { workflowSchema } from "@/features/automation/schemas";
import { resetAllDemoData } from "@/lib/demo/resetDemo";
import { DEFAULT_ROLE_PERMISSIONS, hasPermission } from "@/lib/permissions/rbac";

describe("Phase 9: Mobile App, Advanced Segmentation, Analytics, Integrations & Automation", () => {
  beforeEach(() => {
    resetAllDemoData();
  });

  describe("Module A — Mobile App Management", () => {
    it("should validate valid mobile app branding schemas", () => {
      const valid = {
        displayName: "Aarong Artisan BD",
        description: "Traditional handicrafts and festive designer wear",
        appIcon: "https://example.com/icon.png",
        appLogo: "https://example.com/logo.png",
        splashScreen: "https://example.com/splash.png",
        brandColors: {
          primary: "#2563EB",
          secondary: "#1D4ED8",
          accent: "#38BDF8",
          background: "#FFFFFF",
        },
        theme: "light" as const,
      };

      const result = mobileAppBrandingSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("should reject invalid color hex codes in branding", () => {
      const invalid = {
        displayName: "Test Store",
        appIcon: "https://example.com/icon.png",
        appLogo: "https://example.com/logo.png",
        splashScreen: "https://example.com/splash.png",
        brandColors: {
          primary: "blue", // not hex
          secondary: "#1D4ED8",
          accent: "#38BDF8",
          background: "#FFFFFF",
        },
        theme: "light",
      };

      const result = mobileAppBrandingSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("should validate Android package name and iOS bundle identifier regex", () => {
      const valid = {
        pushNotificationPrefs: {
          orderUpdates: true,
          promotions: true,
          shipping: true,
          general: false,
        },
        platformSettings: {
          android: {
            packageName: "com.cartx.greenharvest",
            versionName: "1.0.0",
          },
          ios: {
            bundleId: "bd.com.cartx.greenharvest",
            versionString: "1.0.0",
          },
        },
      };

      expect(mobileAppSettingsSchema.safeParse(valid).success).toBe(true);

      const invalidAndroid = {
        ...valid,
        platformSettings: {
          ...valid.platformSettings,
          android: { packageName: "invalid-package-no-dot", versionName: "1.0.0" },
        },
      };
      expect(mobileAppSettingsSchema.safeParse(invalidAndroid).success).toBe(false);
    });

    it("should persist and update mobile app branding and content in demo mode", async () => {
      const updated = await mockMobileAppService.updateBranding({
        displayName: "Bengal Organic Harvest",
        description: "Fresh goods in Dhaka",
        appIcon: "https://example.com/new-icon.png",
        appLogo: "https://example.com/new-logo.png",
        splashScreen: "https://example.com/new-splash.png",
        brandColors: {
          primary: "#16A34A",
          secondary: "#15803D",
          accent: "#4ADE80",
          background: "#F0FDF4",
        },
        theme: "dark",
      });

      expect(updated.displayName).toBe("Bengal Organic Harvest");
      expect(updated.theme).toBe("dark");

      const stats = await mockMobileAppService.getStats();
      expect(stats.sectionsConfigured).toBeGreaterThan(0);
      expect(stats.platformsConfigured).toBe(2);
    });
  });

  describe("Module B — Advanced Customer Segmentation", () => {
    it("should deterministically evaluate VIP customer conditions (spend >= 10,000)", async () => {
      const preview = mockSegmentationService.evaluateSegment([
        {
          id: "grp_1",
          logic: "AND",
          conditions: [
            {
              id: "c_1",
              field: "total_spend",
              operator: "greater_than_or_equal",
              value: 10000,
            },
          ],
        },
      ]);

      // In INITIAL_CUSTOMERS: Tanvir (26580), Nusrat (12320), Rashedul (14120) = 3 customers
      expect(preview.matchingCount).toBe(3);
      expect(preview.matchingCustomerIds).toContain("cust-001");
      expect(preview.matchingCustomerIds).toContain("cust-002");
      expect(preview.matchingCustomerIds).toContain("cust-008");
    });

    it("should deterministically evaluate district conditions (city equals Dhaka)", async () => {
      const preview = mockSegmentationService.evaluateSegment([
        {
          id: "grp_1",
          logic: "AND",
          conditions: [
            {
              id: "c_city",
              field: "customer_city",
              operator: "equals",
              value: "Dhaka",
            },
          ],
        },
      ]);

      // In INITIAL_CUSTOMERS: Tanvir, Nusrat, Mahmudul = 3 customers
      expect(preview.matchingCount).toBe(3);
      expect(preview.matchingCustomerIds).toContain("cust-001");
      expect(preview.matchingCustomerIds).toContain("cust-002");
      expect(preview.matchingCustomerIds).toContain("cust-007");
    });

    it("should handle compound AND/OR multi-group logic", async () => {
      // Group 1: City is Dhaka
      // Group 2: Total orders >= 2
      // groupLogic: AND -> Should match Tanvir and Nusrat (both in Dhaka with >= 2 orders)
      const previewAnd = mockSegmentationService.evaluateSegment(
        [
          {
            id: "grp_1",
            logic: "AND",
            conditions: [
              { id: "c_1", field: "customer_city", operator: "equals", value: "Dhaka" },
            ],
          },
          {
            id: "grp_2",
            logic: "AND",
            conditions: [
              { id: "c_2", field: "total_orders", operator: "greater_than_or_equal", value: 2 },
            ],
          },
        ],
        "AND"
      );

      expect(previewAnd.matchingCount).toBe(2);
      expect(previewAnd.matchingCustomerIds).toEqual(["cust-001", "cust-002"]);
    });

    it("should create, duplicate, and delete segment recipes", async () => {
      const newSegment = await mockSegmentationService.createSegment({
        name: "Sylhet Loyal Shoppers",
        description: "Customers in Sylhet",
        groupLogic: "AND",
        isActive: true,
        conditionGroups: [
          {
            id: "grp_sylhet",
            logic: "AND",
            conditions: [
              { id: "c_sylhet", field: "customer_city", operator: "equals", value: "Sylhet" },
            ],
          },
        ],
      });

      expect(newSegment.id).toBeDefined();
      expect(newSegment.matchingCustomerCount).toBe(1); // Farhana Akter

      const duplicated = await mockSegmentationService.duplicateSegment(newSegment.id);
      expect(duplicated.name).toBe("Sylhet Loyal Shoppers (Copy)");

      await mockSegmentationService.deleteSegment(duplicated.id);
      const afterDelete = await mockSegmentationService.getSegmentById(duplicated.id);
      expect(afterDelete).toBeNull();
    });
  });

  describe("Module C — Advanced Analytics Hub", () => {
    it("should compute revenue and orders accurately from demo orders", () => {
      const dateRange = getDateRangeFromPreset("90d");
      const sales = mockAnalyticsService.getSalesAnalytics(dateRange);

      expect(sales.totalRevenue).toBeGreaterThan(0);
      expect(sales.totalOrders).toBeGreaterThan(0);
      expect(sales.averageOrderValue).toBe(Math.round(sales.totalRevenue / sales.totalOrders));
      expect(Array.isArray(sales.dailyRevenue)).toBe(true);
    });

    it("should compute customer cohort retention metrics accurately", () => {
      const dateRange = getDateRangeFromPreset("30d");
      const customers = mockAnalyticsService.getCustomerAnalytics(dateRange);

      expect(customers.totalCustomers).toBe(8);
      expect(customers.retentionRate).toBeGreaterThan(0);
      expect(customers.segmentDistribution.length).toBe(4);
      expect(customers.topCustomers.length).toBe(5);
    });

    it("should compute product performance and low stock metrics", () => {
      const dateRange = getDateRangeFromPreset("30d");
      const products = mockAnalyticsService.getProductAnalytics(dateRange);

      expect(products.totalProducts).toBeGreaterThan(0);
      expect(products.activeProducts).toBeGreaterThan(0);
      expect(products.topSellingProducts.length).toBeGreaterThan(0);
    });

    it("should generate compliant RFC-4180 CSV export with UTF-8 BOM", async () => {
      const dateRange = getDateRangeFromPreset("30d");
      const report = await mockAnalyticsService.exportReport("sales", dateRange);
      const csv = mockAnalyticsService.generateCSV(report);

      expect(csv.startsWith("\uFEFF")).toBe(true);
      expect(csv).toContain("Revenue (BDT)");
      expect(csv).toContain("Date");
    });
  });

  describe("Module D & F — Integrations Center & Webhooks", () => {
    it("should list default Bangladesh payment and courier integrations as demo connected", async () => {
      const integrations = await mockIntegrationsService.getIntegrations();
      expect(integrations.length).toBeGreaterThanOrEqual(10);

      const bkash = integrations.find((i) => i.id === "int_bkash");
      expect(bkash).toBeDefined();
      expect(bkash?.status).toBe("demo_connected");
      expect(bkash?.isEnabled).toBe(true);

      const steadfast = integrations.find((i) => i.id === "int_steadfast");
      expect(steadfast).toBeDefined();
      expect(steadfast?.status).toBe("demo_connected");
    });

    it("should update and disconnect integration configuration safely", async () => {
      const updated = await mockIntegrationsService.updateIntegrationConfig("int_ga4", {
        measurement_id: "G-DEMO12345",
      });

      expect(updated.isEnabled).toBe(true);
      expect(updated.status).toBe("demo_connected");

      const disconnected = await mockIntegrationsService.disconnectIntegration("int_ga4");
      expect(disconnected.isEnabled).toBe(false);
      expect(disconnected.status).toBe("disconnected");
    });

    it("should validate webhook endpoint URLs strictly", () => {
      const valid = {
        url: "https://api.merchant.com.bd/hooks",
        description: "ERP sync",
        events: ["order.created" as const, "order.updated" as const],
        isActive: true,
      };
      expect(webhookEndpointSchema.safeParse(valid).success).toBe(true);

      const invalidUrl = {
        ...valid,
        url: "not-a-url",
      };
      expect(webhookEndpointSchema.safeParse(invalidUrl).success).toBe(false);
    });

    it("should simulate webhook event delivery attempts without network side effects", async () => {
      const webhooks = await mockIntegrationsService.getWebhooks();
      expect(webhooks.length).toBeGreaterThan(0);

      const delivery = await mockIntegrationsService.simulateDelivery(webhooks[0].id, "order.created");
      expect(delivery.id).toBeDefined();
      expect(["simulated_success", "simulated_failure"]).toContain(delivery.status);
      expect(delivery.payload.event).toBe("order.created");

      const stats = await mockIntegrationsService.getWebhookStats();
      expect(stats.totalDeliveries).toBeGreaterThan(0);
    });
  });

  describe("Module E — Automation & Workflow Builder", () => {
    it("should validate workflow schemas with trigger, condition, and actions", () => {
      const valid = {
        name: "Express Order Processing",
        description: "Automatic courier assignment",
        status: "active" as const,
        trigger: {
          id: "trg_1",
          type: "order_created" as const,
          label: "New Order",
          description: "On order",
          config: {},
        },
        conditions: [
          {
            id: "cnd_1",
            type: "order_amount" as const,
            operator: "greater_than" as const,
            value: 2000,
            label: "Amount > 2000",
          },
        ],
        actions: [
          {
            id: "act_1",
            type: "add_notification" as const,
            label: "Notify",
            config: { message: "Order processed" },
          },
        ],
      };

      expect(workflowSchema.safeParse(valid).success).toBe(true);
    });

    it("should require at least one action in workflow schema", () => {
      const invalid = {
        name: "Empty Action Workflow",
        trigger: {
          id: "trg_1",
          type: "order_created",
          label: "New Order",
          description: "On order",
          config: {},
        },
        conditions: [],
        actions: [], // empty!
        status: "active",
      };

      expect(workflowSchema.safeParse(invalid).success).toBe(false);
    });

    it("should simulate execution of active workflows and record audit trail", async () => {
      const workflows = await mockAutomationService.getWorkflows();
      expect(workflows.length).toBeGreaterThan(0);

      const target = workflows[0];
      const initialExecCount = target.executionCount;

      const exec = await mockAutomationService.simulateExecution(target.id);
      expect(exec.id).toBeDefined();
      expect(exec.workflowName).toBe(target.name);
      expect(["success", "failed"]).toContain(exec.status);

      const updated = await mockAutomationService.getWorkflowById(target.id);
      expect(updated?.executionCount).toBe(initialExecCount + 1);

      const executions = await mockAutomationService.getExecutions(target.id);
      expect(executions.some((e) => e.id === exec.id)).toBe(true);
    });

    it("should duplicate and toggle workflows", async () => {
      const workflows = await mockAutomationService.getWorkflows();
      const first = workflows[0];
      const initialStatus = first.status;

      const duplicated = await mockAutomationService.duplicateWorkflow(first.id);
      expect(duplicated.name).toBe(`${first.name} (Copy)`);
      expect(duplicated.status).toBe("draft");

      const toggled = await mockAutomationService.toggleWorkflow(first.id);
      expect(toggled.status).toBe(initialStatus === "active" ? "inactive" : "active");
    });
  });

  describe("RBAC & Permissions Verification", () => {
    it("should ensure owner has access to all Phase 9 modules", () => {
      const ownerPerms = DEFAULT_ROLE_PERMISSIONS.owner;
      expect(hasPermission(ownerPerms, "storefront.manage")).toBe(true); // Mobile App
      expect(hasPermission(ownerPerms, "marketing.view")).toBe(true); // Customer Segments
      expect(hasPermission(ownerPerms, "reports.view")).toBe(true); // Analytics
      expect(hasPermission(ownerPerms, "integrations.manage")).toBe(true); // Integrations & Automation
    });

    it("should ensure marketing manager has access to segments and analytics but not integrations", () => {
      const mktPerms = DEFAULT_ROLE_PERMISSIONS.marketing_manager;
      expect(hasPermission(mktPerms, "marketing.view")).toBe(true);
      expect(hasPermission(mktPerms, "reports.view")).toBe(true);
      expect(hasPermission(mktPerms, "integrations.manage")).toBe(false);
    });
  });

  describe("Global Demo Reset Integration", () => {
    it("should reset all Phase 9 data back to factory defaults when resetAllDemoData is invoked", async () => {
      // Mutate state in mobile app
      await mockMobileAppService.updateBranding({
        displayName: "Modified Store Name",
        description: "Modified",
        appIcon: "https://example.com/mod.png",
        appLogo: "https://example.com/mod.png",
        splashScreen: "https://example.com/mod.png",
        brandColors: { primary: "#000000", secondary: "#000000", accent: "#000000", background: "#000000" },
        theme: "dark",
      });

      // Invoke global reset
      resetAllDemoData();

      const config = await mockMobileAppService.getConfig();
      expect(config.displayName).toBe("Green Harvest BD");
      expect(config.brandColors.primary).toBe("#2563EB");
    });
  });
});
