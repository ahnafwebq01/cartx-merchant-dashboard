import { describe, it, expect } from "vitest";
import { Package, ShoppingCart, Users } from "lucide-react";
import {
  NAVIGATION_GROUPS,
  NAVIGATION_ITEMS,
  isRouteActive,
  isParentItemActive,
  type NavItem,
} from "@/config/navigation";
import {
  DEFAULT_ROLE_PERMISSIONS,
  hasPermission,
} from "@/lib/permissions/rbac";

describe("Sidebar Navigation Configuration & Routing Logic", () => {
  const allSubHrefs: string[] = [];
  const allDirectHrefs: string[] = [];

  NAVIGATION_GROUPS.forEach((group) => {
    group.items.forEach((item) => {
      allDirectHrefs.push(item.href);
      if (item.children) {
        item.children.forEach((child) => {
          allSubHrefs.push(child.href);
        });
      }
    });
  });

  const allConfiguredRoutes = Array.from(
    new Set([...allDirectHrefs, ...allSubHrefs]),
  );

  describe("Route Inventory & Completeness", () => {
    it("should include all 7 required logical navigation groups", () => {
      const groupIds = NAVIGATION_GROUPS.map((g) => g.id);
      expect(groupIds).toEqual([
        "overview",
        "catalog",
        "sales",
        "payments-finance",
        "shipping-logistics",
        "storefront",
        "store-management",
      ]);
    });

    it("should provide accessible sidebar entries for 100% of implemented dashboard routes", () => {
      const expectedImplementedRoutes = [
        "/dashboard",
        "/dashboard/products",
        "/dashboard/products/new",
        "/dashboard/products/categories",
        "/dashboard/products/collections",
        "/dashboard/inventory",
        "/dashboard/inventory/adjustments",
        "/dashboard/orders",
        "/dashboard/orders/returns",
        "/dashboard/customers",
        "/dashboard/customers/groups",
        "/dashboard/payments",
        "/dashboard/payments/transactions",
        "/dashboard/payments/methods",
        "/dashboard/payments/refunds",
        "/dashboard/payments/settings",
        "/dashboard/shipping",
        "/dashboard/shipping/shipments",
        "/dashboard/shipping/couriers",
        "/dashboard/shipping/settings",
        "/dashboard/store",
        "/dashboard/store/themes",
        "/dashboard/store/pages",
        "/dashboard/store/domains",
        "/dashboard/settings",
        "/onboarding",
      ];

      expectedImplementedRoutes.forEach((route) => {
        expect(
          allConfiguredRoutes.includes(route),
          `Expected route ${route} to be present in navigation configuration`,
        ).toBe(true);
      });
    });

    it("should NOT contain any duplicate route navigation entries", () => {
      // Direct links (items without children) + all child links must have unique destinations
      const leafLinks: string[] = [];
      NAVIGATION_GROUPS.forEach((group) => {
        group.items.forEach((item) => {
          if (item.children && item.children.length > 0) {
            item.children.forEach((child) => leafLinks.push(child.href));
          } else {
            leafLinks.push(item.href);
          }
        });
      });

      const uniqueLeafLinks = new Set(leafLinks);
      expect(leafLinks.length).toBe(uniqueLeafLinks.size);
    });

    it("should NOT contain any unimplemented Phase 7-9 routes to avoid 404s", () => {
      const unimplementedRoadmapRoutes = [
        "/dashboard/analytics",
        "/dashboard/marketing",
        "/dashboard/marketing/coupons",
        "/dashboard/marketing/campaigns",
        "/dashboard/apps",
        "/dashboard/mobile-app",
        "/dashboard/team",
        "/dashboard/billing",
        "/dashboard/support",
        "/dashboard/profile",
        "/dashboard/security",
        "/dashboard/notifications",
      ];

      unimplementedRoadmapRoutes.forEach((route) => {
        expect(allConfiguredRoutes.includes(route)).toBe(false);
      });
    });

    it("should verify all navigation items have icons, titles, and valid hrefs", () => {
      NAVIGATION_GROUPS.forEach((group) => {
        expect(group.title).toBeTruthy();
        expect(group.items.length).toBeGreaterThan(0);

        group.items.forEach((item) => {
          expect(item.title).toBeTruthy();
          expect(item.href.startsWith("/")).toBe(true);
          expect(item.icon).toBeDefined();

          if (item.children) {
            item.children.forEach((child) => {
              expect(child.title).toBeTruthy();
              expect(child.href.startsWith("/")).toBe(true);
            });
          }
        });
      });
    });

    it("should export backwards-compatible NAVIGATION_ITEMS list", () => {
      expect(Array.isArray(NAVIGATION_ITEMS)).toBe(true);
      expect(NAVIGATION_ITEMS.length).toBeGreaterThan(0);
      expect(
        NAVIGATION_ITEMS.find((item) => item.href === "/dashboard"),
      ).toBeDefined();
    });
  });

  describe("Active Route Matching Logic", () => {
    it("should only match /dashboard on exact match and never for subpaths", () => {
      expect(isRouteActive("/dashboard", "/dashboard", true)).toBe(true);
      expect(isRouteActive("/dashboard/products", "/dashboard", true)).toBe(
        false,
      );
      expect(isRouteActive("/dashboard/orders", "/dashboard", true)).toBe(
        false,
      );
      expect(isRouteActive("/dashboard/settings", "/dashboard", true)).toBe(
        false,
      );
    });

    it("should correctly match nested catalog routes", () => {
      expect(
        isRouteActive("/dashboard/products/new", "/dashboard/products/new"),
      ).toBe(true);
      expect(
        isRouteActive("/dashboard/products/new", "/dashboard/products"),
      ).toBe(true);
      expect(
        isRouteActive("/dashboard/products", "/dashboard/products/new"),
      ).toBe(false);
      expect(
        isRouteActive(
          "/dashboard/products/categories",
          "/dashboard/products/categories",
        ),
      ).toBe(true);
    });

    it("should correctly match dynamic parameterized order routes to parent item", () => {
      const ordersItem: NavItem = {
        title: "Orders",
        href: "/dashboard/orders",
        icon: ShoppingCart,
        children: [
          { title: "All Orders", href: "/dashboard/orders" },
          { title: "Returns & Refunds", href: "/dashboard/orders/returns" },
        ],
      };

      // Exact listing page
      expect(isParentItemActive(ordersItem, "/dashboard/orders")).toBe(true);

      // Returns page
      expect(isParentItemActive(ordersItem, "/dashboard/orders/returns")).toBe(
        true,
      );

      // Parameterized / dynamic order details page: /dashboard/orders/[orderId]
      expect(
        isParentItemActive(ordersItem, "/dashboard/orders/ord-2026-001"),
      ).toBe(true);

      // Unrelated route
      expect(isParentItemActive(ordersItem, "/dashboard/products")).toBe(false);
    });

    it("should correctly match dynamic parameterized product edit routes to parent item", () => {
      const productsItem: NavItem = {
        title: "Products",
        href: "/dashboard/products",
        icon: Package,
        children: [
          { title: "All Products", href: "/dashboard/products" },
          { title: "Add Product", href: "/dashboard/products/new" },
        ],
      };

      expect(
        isParentItemActive(
          productsItem,
          "/dashboard/products/prod-bangladesh-saree/edit",
        ),
      ).toBe(true);
    });

    it("should correctly match dynamic customer routes to parent item", () => {
      const customersItem: NavItem = {
        title: "Customers",
        href: "/dashboard/customers",
        icon: Users,
        children: [
          { title: "All Customers", href: "/dashboard/customers" },
          { title: "Customer Groups", href: "/dashboard/customers/groups" },
        ],
      };

      expect(
        isParentItemActive(customersItem, "/dashboard/customers/cust-bd-01"),
      ).toBe(true);
    });
  });

  describe("RBAC Permission Filtering for Navigation Items", () => {
    it("should grant store owner access to all groups and items", () => {
      const ownerPermissions = DEFAULT_ROLE_PERMISSIONS.owner;
      NAVIGATION_GROUPS.forEach((group) => {
        group.items.forEach((item) => {
          if (item.permission) {
            expect(hasPermission(ownerPermissions, item.permission)).toBe(true);
          }
          if (item.children) {
            item.children.forEach((child) => {
              if (child.permission) {
                expect(hasPermission(ownerPermissions, child.permission)).toBe(
                  true,
                );
              }
            });
          }
        });
      });
    });

    it("should restrict inventory manager from managing store settings", () => {
      const inventoryPermissions = DEFAULT_ROLE_PERMISSIONS.inventory_manager;
      const settingsItem = NAVIGATION_GROUPS.find(
        (g) => g.id === "store-management",
      )?.items.find((i) => i.href === "/dashboard/settings");

      expect(settingsItem).toBeDefined();
      expect(settingsItem?.permission).toBe("settings.manage");
      expect(hasPermission(inventoryPermissions, "settings.manage")).toBe(
        false,
      );
      expect(hasPermission(inventoryPermissions, "inventory.view")).toBe(true);
    });
  });
});
