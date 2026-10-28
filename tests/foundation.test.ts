import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";
import { hasPermission, hasAnyPermission, DEFAULT_ROLE_PERMISSIONS } from "@/lib/permissions/rbac";
import { ApiClientError } from "@/lib/api/client";

describe("Foundation Architecture Utilities", () => {
  describe("cn (Class Merging Utility)", () => {
    it("should merge basic class names correctly", () => {
      const result = cn("px-4", "py-2", "bg-primary");
      expect(result).toBe("px-4 py-2 bg-primary");
    });

    it("should resolve conflicting tailwind classes", () => {
      const result = cn("p-4", "p-2");
      expect(result).toBe("p-2");
    });

    it("should handle conditional class names properly", () => {
      const isVisible = false;
      const isActive = true;
      const result = cn("base-class", isVisible && "hidden", isActive && "active");
      expect(result).toBe("base-class active");
    });
  });

  describe("RBAC Permissions Helpers", () => {
    it("should confirm owner has full admin permissions", () => {
      const ownerPermissions = DEFAULT_ROLE_PERMISSIONS.owner;
      expect(hasPermission(ownerPermissions, "products.create")).toBe(true);
      expect(hasPermission(ownerPermissions, "orders.cancel")).toBe(true);
      expect(hasPermission(ownerPermissions, "billing.manage")).toBe(true);
    });

    it("should restrict support staff from billing management", () => {
      const supportPermissions = DEFAULT_ROLE_PERMISSIONS.support;
      expect(hasPermission(supportPermissions, "orders.view")).toBe(true);
      expect(hasPermission(supportPermissions, "billing.manage")).toBe(false);
    });

    it("should correctly evaluate hasAnyPermission", () => {
      const inventoryPermissions = DEFAULT_ROLE_PERMISSIONS.inventory_manager;
      expect(
        hasAnyPermission(inventoryPermissions, ["billing.manage", "inventory.view"])
      ).toBe(true);
      expect(
        hasAnyPermission(inventoryPermissions, ["billing.manage", "orders.cancel"])
      ).toBe(false);
    });
  });

  describe("API Client Error Handling", () => {
    it("should create structured ApiClientError with status and code", () => {
      const err = new ApiClientError(
        "Unauthorized access to tenant",
        403,
        "TENANT_FORBIDDEN",
        { storeId: "store-123" },
        "req-abc-999"
      );
      expect(err.message).toBe("Unauthorized access to tenant");
      expect(err.status).toBe(403);
      expect(err.code).toBe("TENANT_FORBIDDEN");
      expect(err.requestId).toBe("req-abc-999");
      expect(err.name).toBe("ApiClientError");
    });
  });
});

