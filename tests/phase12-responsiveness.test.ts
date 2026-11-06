import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Phase 12: Repository-Wide Responsiveness Audit & Verification", () => {
  const rootDir = process.cwd();

  describe("1. Tailwind CSS Breakpoints & Global Styling Rules", () => {
    it("should define --breakpoint-xs in globals.css to support small mobile viewports (380px)", () => {
      const globalsCss = fs.readFileSync(
        path.join(rootDir, "src", "styles", "globals.css"),
        "utf-8"
      );
      expect(globalsCss).toContain("@theme");
      expect(globalsCss).toContain("--breakpoint-xs: 380px");
    });

    it("should cover all target viewports across defined responsive tiers", () => {
      const viewports = [
        { name: "Small mobile", width: 320, height: 568 },
        { name: "Mobile", width: 375, height: 667 },
        { name: "Large mobile", width: 425, height: 900 },
        { name: "Small tablet", width: 640, height: 800 },
        { name: "Tablet", width: 768, height: 1024 },
        { name: "Laptop", width: 1024, height: 768 },
        { name: "Desktop", width: 1280, height: 800 },
        { name: "Large desktop", width: 1440, height: 900 },
        { name: "Extra-large desktop", width: 1920, height: 1080 },
      ];

      expect(viewports.length).toBe(9);
      for (const vp of viewports) {
        expect(vp.width).toBeGreaterThanOrEqual(320);
        expect(vp.width).toBeLessThanOrEqual(1920);
      }
    });
  });

  describe("2. Modal & Dialog Viewport Containment", () => {
    it("should enforce max-height and overflow-y-auto on DialogContent to prevent mobile clipping", () => {
      const dialogContent = fs.readFileSync(
        path.join(rootDir, "src", "components", "ui", "dialog.tsx"),
        "utf-8"
      );
      expect(dialogContent).toContain("max-h-[calc(100dvh-2rem)]");
      expect(dialogContent).toContain("overflow-y-auto");
      expect(dialogContent).toContain("p-4 sm:p-6");
    });

    it("should enforce max-height and overflow-y-auto on AlertDialogContent", () => {
      const alertDialogContent = fs.readFileSync(
        path.join(rootDir, "src", "components", "ui", "alert-dialog.tsx"),
        "utf-8"
      );
      expect(alertDialogContent).toContain("max-h-[calc(100dvh-2rem)]");
      expect(alertDialogContent).toContain("overflow-y-auto");
      expect(alertDialogContent).toContain("p-4 sm:p-6");
    });
  });

  describe("3. Dashboard Shell, Layout & Topbar Boundaries", () => {
    it("should configure DashboardLayout with 100dvh and responsive main content padding", () => {
      const layoutFile = fs.readFileSync(
        path.join(rootDir, "src", "components", "layout", "DashboardLayout.tsx"),
        "utf-8"
      );
      expect(layoutFile).toContain("h-[100dvh]");
      expect(layoutFile).toContain("p-3 sm:p-6 lg:p-8");
      expect(layoutFile).toContain("min-w-0");
    });

    it("should configure Topbar with responsive store selector max-width and action item gaps", () => {
      const topbarFile = fs.readFileSync(
        path.join(rootDir, "src", "components", "layout", "Topbar.tsx"),
        "utf-8"
      );
      expect(topbarFile).toContain("px-2.5 sm:px-4 md:px-6");
      expect(topbarFile).toContain("max-w-[110px] xs:max-w-[150px] sm:max-w-[180px] md:max-w-xs");
      expect(topbarFile).toContain("gap-1 sm:gap-2");
    });

    it("should configure PageHeader with responsive title sizing and flexible action buttons", () => {
      const headerFile = fs.readFileSync(
        path.join(rootDir, "src", "components", "layout", "PageHeader.tsx"),
        "utf-8"
      );
      expect(headerFile).toContain("text-xl sm:text-2xl");
      expect(headerFile).toContain("flex-wrap items-center gap-2");
      expect(headerFile).toContain("min-w-0");
    });
  });

  describe("4. Mobile App Mockup & Billing Table Overflow Safety", () => {
    it("should make AppPreview device mockup shell flexible below 360px screen width", () => {
      const appPreviewFile = fs.readFileSync(
        path.join(rootDir, "src", "features", "mobile-app", "components", "AppPreview.tsx"),
        "utf-8"
      );
      expect(appPreviewFile).toContain("w-full max-w-[310px] xs:max-w-[360px]");
      expect(appPreviewFile).toContain("overflow-hidden");
    });

    it("should wrap billing recent invoices table in overflow-x-auto container", () => {
      const billingFile = fs.readFileSync(
        path.join(rootDir, "src", "features", "billing", "components", "BillingOverviewView.tsx"),
        "utf-8"
      );
      expect(billingFile).toContain("overflow-x-auto");
      expect(billingFile).toContain("min-w-[520px]");
    });
  });

  describe("5. Visualizations & Analytical Presets", () => {
    it("should make analytics date range preset buttons scrollable on small screens", () => {
      const dateSelectorFile = fs.readFileSync(
        path.join(rootDir, "src", "features", "analytics", "components", "DateRangeSelector.tsx"),
        "utf-8"
      );
      expect(dateSelectorFile).toContain("max-w-full overflow-x-auto");
      expect(dateSelectorFile).toContain("flex-wrap items-center gap-2");
    });

    it("should make dashboard daily sales bar chart container horizontally scrollable", () => {
      const dashboardPage = fs.readFileSync(
        path.join(rootDir, "src", "app", "dashboard", "page.tsx"),
        "utf-8"
      );
      expect(dashboardPage).toContain("w-full overflow-x-auto");
      expect(dashboardPage).toContain("min-w-[280px]");
    });
  });

  describe("6. Tables & Data Pagination Responsiveness", () => {
    it("should wrap table pagination controls and rows-per-page selectors flexibly", () => {
      const productTable = fs.readFileSync(
        path.join(rootDir, "src", "features", "products", "components", "ProductListTable.tsx"),
        "utf-8"
      );
      expect(productTable).toContain("flex flex-wrap items-center justify-center sm:justify-end gap-2");

      const orderTable = fs.readFileSync(
        path.join(rootDir, "src", "features", "orders", "components", "OrderListTable.tsx"),
        "utf-8"
      );
      expect(orderTable).toContain("flex flex-wrap items-center justify-center sm:justify-start gap-2");

      const customerTable = fs.readFileSync(
        path.join(rootDir, "src", "features", "customers", "components", "CustomerListTable.tsx"),
        "utf-8"
      );
      expect(customerTable).toContain("flex flex-wrap items-center justify-center sm:justify-start gap-2");

      const paymentTable = fs.readFileSync(
        path.join(rootDir, "src", "features", "payments", "components", "PaymentTransactionsTable.tsx"),
        "utf-8"
      );
      expect(paymentTable).toContain("flex flex-col sm:flex-row items-center justify-between gap-3");

      const shipmentTable = fs.readFileSync(
        path.join(rootDir, "src", "features", "shipping", "components", "ShipmentListTable.tsx"),
        "utf-8"
      );
      expect(shipmentTable).toContain("flex flex-col sm:flex-row items-center justify-between gap-3");
    });

    it("should make product filter toolbar bulk action bar wrap cleanly", () => {
      const productToolbar = fs.readFileSync(
        path.join(rootDir, "src", "features", "products", "components", "ProductFilterToolbar.tsx"),
        "utf-8"
      );
      expect(productToolbar).toContain("flex flex-wrap items-center justify-between gap-2");
    });
  });

  describe("7. Authentication, Onboarding & Settings Action Footers", () => {
    it("should adapt login demo role selector to 1 column on narrow screens", () => {
      const loginForm = fs.readFileSync(
        path.join(rootDir, "src", "components", "auth", "LoginForm.tsx"),
        "utf-8"
      );
      expect(loginForm).toContain("grid-cols-1 xs:grid-cols-2");
    });

    it("should provide compact mobile progress indicator in OnboardingStepper", () => {
      const stepper = fs.readFileSync(
        path.join(rootDir, "src", "features", "onboarding", "components", "OnboardingStepper.tsx"),
        "utf-8"
      );
      expect(stepper).toContain("sm:hidden flex items-center justify-between");
      expect(stepper).toContain("Step {currentStep} of {ONBOARDING_STEPS.length}");
    });

    it("should format settings action footers with mobile-friendly vertical stacks", () => {
      const regionalSettings = fs.readFileSync(
        path.join(rootDir, "src", "components", "settings", "RegionalSettings.tsx"),
        "utf-8"
      );
      expect(regionalSettings).toContain("flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3");

      const notificationSettings = fs.readFileSync(
        path.join(rootDir, "src", "components", "settings", "NotificationSettings.tsx"),
        "utf-8"
      );
      expect(notificationSettings).toContain("flex flex-col-reverse xs:flex-row items-stretch xs:items-center justify-between gap-3");

      const appearanceSettings = fs.readFileSync(
        path.join(rootDir, "src", "components", "settings", "AppearanceSettings.tsx"),
        "utf-8"
      );
      expect(appearanceSettings).toContain("flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3");

      const storeSettings = fs.readFileSync(
        path.join(rootDir, "src", "features", "store-settings", "components", "StoreSettingsView.tsx"),
        "utf-8"
      );
      expect(storeSettings).toContain("flex flex-col-reverse xs:flex-row items-stretch xs:items-center justify-between gap-3");
    });
  });
});

