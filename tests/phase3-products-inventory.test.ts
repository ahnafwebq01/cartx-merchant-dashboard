import { describe, it, expect, beforeEach } from "vitest";
import {
  productFormSchema,
  categoryFormSchema,
} from "@/features/products/schemas";
import { stockAdjustmentFormSchema } from "@/features/inventory/schemas";
import { mockProductService } from "@/features/products/services/mockProducts";

describe("Phase 3: Products & Inventory Specification & Service Tests", () => {
  beforeEach(() => {
    mockProductService.resetDemoData();
  });

  describe("1. Zod Validation Schemas", () => {
    it("validates a complete, compliant product", () => {
      const validProduct = {
        title: "Dhakai Muslin Saree",
        slug: "dhakai-muslin-saree",
        sku: "MSL-001",
        category: "Women's Fashion",
        price: 25000,
        salePrice: 22000,
        costPrice: 15000,
        stock: 5,
        lowStockThreshold: 2,
        trackInventory: true,
        allowBackorders: false,
        status: "active" as const,
        weight: 0.4,
      };

      const result = productFormSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it("rejects invalid slugs with uppercase or special characters", () => {
      const invalidSlug = {
        title: "Test Product",
        slug: "Test_Product!",
        sku: "TST-01",
        category: "Fashion",
        price: 100,
        stock: 10,
        lowStockThreshold: 5,
        trackInventory: true,
        allowBackorders: false,
        status: "active" as const,
      };

      const result = productFormSchema.safeParse(invalidSlug);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes("slug"))).toBe(true);
      }
    });

    it("rejects non-positive price and negative stock", () => {
      const invalidNumbers = {
        title: "Test Product",
        slug: "test-product",
        sku: "TST-02",
        category: "Fashion",
        price: -500,
        stock: -2,
        lowStockThreshold: 5,
        trackInventory: true,
        allowBackorders: false,
        status: "active" as const,
      };

      const result = productFormSchema.safeParse(invalidNumbers);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes("price"))).toBe(true);
        expect(result.error.issues.some((i) => i.path.includes("stock"))).toBe(true);
      }
    });

    it("rejects promotional sale price greater than regular price", () => {
      const invalidSalePrice = {
        title: "Dhakai Jamdani Saree",
        slug: "dhakai-jamdani-saree",
        sku: "JMD-099",
        category: "Women's Fashion",
        price: 5000,
        salePrice: 6000, // Invalid: sale price > regular price
        stock: 10,
        lowStockThreshold: 2,
        trackInventory: true,
        allowBackorders: false,
        status: "active" as const,
      };

      const result = productFormSchema.safeParse(invalidSalePrice);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes("salePrice"))).toBe(true);
      }
    });

    it("validates category form schemas", () => {
      const validCategory = {
        name: "Traditional Jewelry",
        slug: "traditional-jewelry",
        description: "Bengali nakshi ornaments",
        sortOrder: 1,
      };
      expect(categoryFormSchema.safeParse(validCategory).success).toBe(true);

      const invalidCategory = {
        name: "A",
        slug: "INVALID SLUG",
        sortOrder: 0,
      };
      expect(categoryFormSchema.safeParse(invalidCategory).success).toBe(false);
    });

    it("validates stock adjustment schemas including manual correction to 0 units", () => {
      const validAdjustment = {
        productId: "prod-001",
        type: "restock" as const,
        quantity: 15,
        reason: "Received new supplier lot",
        referenceId: "PO-991",
      };
      expect(stockAdjustmentFormSchema.safeParse(validAdjustment).success).toBe(true);

      // Manual correction can legitimately set stock to 0 (e.g. physical count 0 units)
      const validZeroManualCorrection = {
        productId: "prod-001",
        type: "manual_correction" as const,
        quantity: 0,
        reason: "Warehouse physical count reconciliation",
      };
      expect(stockAdjustmentFormSchema.safeParse(validZeroManualCorrection).success).toBe(true);

      // But manual correction cannot be negative
      const invalidNegativeCorrection = {
        productId: "prod-001",
        type: "manual_correction" as const,
        quantity: -5,
        reason: "Invalid correction",
      };
      expect(stockAdjustmentFormSchema.safeParse(invalidNegativeCorrection).success).toBe(false);

      // Damaged/restock cannot have quantity 0
      const invalidRestockZero = {
        productId: "prod-001",
        type: "restock" as const,
        quantity: 0,
        reason: "Test",
      };
      expect(stockAdjustmentFormSchema.safeParse(invalidRestockZero).success).toBe(false);

      const invalidAdjustment = {
        productId: "",
        type: "damaged" as const,
        quantity: 0,
        reason: "",
      };
      const result = stockAdjustmentFormSchema.safeParse(invalidAdjustment);
      expect(result.success).toBe(false);
    });
  });

  describe("2. Product Service CRUD & Filtering", () => {
    it("loads initial Bangladesh catalog of 12 products", () => {
      const result = mockProductService.getProducts();
      expect(result.total).toBe(12);
      expect(result.items.length).toBeLessThanOrEqual(10); // default limit 10
      expect(result.totalPages).toBe(2);
    });

    it("filters products by category correctly", () => {
      const result = mockProductService.getProducts({
        category: "Women's Fashion",
      });
      expect(result.items.length).toBe(3);
      expect(result.items.every((p) => p.category === "Women's Fashion")).toBe(true);
    });

    it("filters products by stock status (in_stock, low_stock, out_of_stock)", () => {
      const outOfStock = mockProductService.getProducts({
        stockStatus: "out_of_stock",
      });
      expect(outOfStock.items.length).toBe(1);
      expect(outOfStock.items[0].sku).toBe("WLT-LTH-005");

      const lowStock = mockProductService.getProducts({
        stockStatus: "low_stock",
      });
      expect(lowStock.items.length).toBe(2); // Tangail Saree (3 <= 5) and Jute Bag (2 <= 5)
    });

    it("searches products across title, SKU, category, and brand", () => {
      const searchBySku = mockProductService.getProducts({ search: "JMD-SLK-001" });
      expect(searchBySku.total).toBe(1);
      expect(searchBySku.items[0].title).toContain("Jamdani");

      const searchByBrand = mockProductService.getProducts({ search: "Radhuni" });
      expect(searchByBrand.total).toBe(1);
      expect(searchByBrand.items[0].title).toContain("Mustard Oil");
    });

    it("sorts products by price ascending and descending", () => {
      const asc = mockProductService.getProducts({ sortBy: "price-asc" });
      const firstPrice = asc.items[0].salePrice ?? asc.items[0].price;
      const secondPrice = asc.items[1].salePrice ?? asc.items[1].price;
      expect(firstPrice).toBeLessThanOrEqual(secondPrice);

      const desc = mockProductService.getProducts({ sortBy: "price-desc" });
      const topPrice = desc.items[0].salePrice ?? desc.items[0].price;
      const secondTopPrice = desc.items[1].salePrice ?? desc.items[1].price;
      expect(topPrice).toBeGreaterThanOrEqual(secondTopPrice);
    });

    it("creates, updates, duplicates, and deletes products", () => {
      // 1. Create
      const newProd = mockProductService.createProduct({
        title: "Nakshi Kantha Bedspread",
        slug: "nakshi-kantha-bedspread",
        sku: "KAN-001",
        category: "Home & Living",
        price: 3500,
        stock: 8,
        lowStockThreshold: 3,
        trackInventory: true,
        allowBackorders: false,
        status: "active",
        images: [],
      });
      expect(newProd.id).toBeDefined();
      expect(mockProductService.getProductById(newProd.id)).not.toBeNull();

      // 2. Update
      const updated = mockProductService.updateProduct(newProd.id, {
        price: 3800,
        title: "Heritage Nakshi Kantha Bedspread",
      });
      expect(updated.price).toBe(3800);
      expect(updated.title).toBe("Heritage Nakshi Kantha Bedspread");

      // 3. Duplicate
      const duplicate = mockProductService.duplicateProduct(newProd.id);
      expect(duplicate.title).toContain("(Copy)");
      expect(duplicate.status).toBe("draft");
      expect(duplicate.sku).toContain("-CPY");

      // 4. Archive & Unarchive
      const archived = mockProductService.archiveProduct(newProd.id);
      expect(archived.status).toBe("archived");

      const unarchived = mockProductService.unarchiveProduct(newProd.id);
      expect(unarchived.status).toBe("active");

      const toggled = mockProductService.toggleArchiveProduct(newProd.id);
      expect(toggled.status).toBe("archived");

      // 5. Delete
      mockProductService.deleteProduct(newProd.id);
      expect(mockProductService.getProductById(newProd.id)).toBeNull();
    });

    it("safely clamps page to totalPages when requested page exceeds totalPages", () => {
      // Catalog has 12 items, at limit 10 there are 2 pages.
      // Requesting page 5 should safely clamp to page 2 instead of returning empty slice
      const result = mockProductService.getProducts({ page: 5, limit: 10 });
      expect(result.page).toBe(2);
      expect(result.totalPages).toBe(2);
      expect(result.items.length).toBe(2);
      expect(result.total).toBe(12);
    });

    it("dynamically synchronizes category product counts when products are created or deleted", () => {
      const categoriesBefore = mockProductService.getCategories();
      const wfBefore = categoriesBefore.find((c) => c.name === "Women's Fashion")!;
      const countBefore = wfBefore.productCount; // 3

      const newProduct = mockProductService.createProduct({
        title: "Katan Silk Festive Saree",
        slug: "katan-silk-festive-saree",
        sku: "KTN-001",
        category: "Women's Fashion",
        price: 8500,
        stock: 5,
        lowStockThreshold: 2,
        trackInventory: true,
        allowBackorders: false,
        status: "active",
        images: [],
      });

      const categoriesAfterCreate = mockProductService.getCategories();
      const wfAfterCreate = categoriesAfterCreate.find((c) => c.name === "Women's Fashion")!;
      expect(wfAfterCreate.productCount).toBe(countBefore + 1);

      mockProductService.deleteProduct(newProduct.id);
      const categoriesAfterDelete = mockProductService.getCategories();
      const wfAfterDelete = categoriesAfterDelete.find((c) => c.name === "Women's Fashion")!;
      expect(wfAfterDelete.productCount).toBe(countBefore);
    });

    it("performs bulk archive and bulk delete operations", () => {
      const initialTotal = mockProductService.getProducts().total;
      const targetIds = ["prod-001", "prod-002"];

      // Bulk archive
      const archivedCount = mockProductService.bulkArchive(targetIds);
      expect(archivedCount).toBe(2);
      expect(mockProductService.getProductById("prod-001")?.status).toBe("archived");
      expect(mockProductService.getProductById("prod-002")?.status).toBe("archived");

      // Bulk delete
      const deletedCount = mockProductService.bulkDelete(targetIds);
      expect(deletedCount).toBe(2);
      expect(mockProductService.getProducts().total).toBe(initialTotal - 2);
    });
  });

  describe("3. Stocks & Inventory Adjustments", () => {
    it("computes accurate inventory overview stats", () => {
      const stats = mockProductService.getInventoryStats();
      expect(stats.totalTrackedProducts).toBeGreaterThan(0);
      expect(stats.totalUnitsAvailable).toBeGreaterThan(0);
      expect(stats.lowStockCount).toBe(2); // Tangail Saree & Jute Bag
      expect(stats.outOfStockCount).toBe(1); // Leather Wallet
    });

    it("adjusts stock upwards on restock and logs tamper-evident movement", () => {
      const initialProduct = mockProductService.getProductById("prod-001")!;
      const initialStock = initialProduct.stock; // 12

      const movement = mockProductService.adjustStock({
        productId: "prod-001",
        type: "restock",
        quantityChange: 10,
        reason: "Factory replenishment from Narayanganj",
        referenceId: "PO-7782",
      });

      expect(movement.beforeQuantity).toBe(initialStock);
      expect(movement.afterQuantity).toBe(initialStock + 10);
      expect(movement.quantityChange).toBe(10);
      expect(movement.type).toBe("restock");

      const afterProduct = mockProductService.getProductById("prod-001")!;
      expect(afterProduct.stock).toBe(initialStock + 10);
    });

    it("adjusts stock downwards on damaged goods without negative bounds", () => {
      const initialProduct = mockProductService.getProductById("prod-003")!;
      const initialStock = initialProduct.stock;

      const movement = mockProductService.adjustStock({
        productId: "prod-003",
        type: "damaged",
        quantityChange: 5,
        reason: "Stitching defect found during QC inspection",
      });

      expect(movement.beforeQuantity).toBe(initialStock);
      expect(movement.afterQuantity).toBe(initialStock - 5);
      expect(movement.quantityChange).toBe(-5);
    });

    it("handles manual correction to exact stock balance and zero units", () => {
      const movement = mockProductService.adjustStock({
        productId: "prod-005", // Out of stock (0)
        type: "manual_correction",
        quantityChange: 20, // sets to 20
        reason: "Physical warehouse count reconciliation",
      });

      expect(movement.beforeQuantity).toBe(0);
      expect(movement.afterQuantity).toBe(20);
      expect(movement.quantityChange).toBe(20);

      const updated = mockProductService.getProductById("prod-005")!;
      expect(updated.stock).toBe(20);

      // Now manual correction back to 0 units
      const zeroMovement = mockProductService.adjustStock({
        productId: "prod-005",
        type: "manual_correction",
        quantityChange: 0,
        reason: "Stock depleted and verified zero count",
      });
      expect(zeroMovement.beforeQuantity).toBe(20);
      expect(zeroMovement.afterQuantity).toBe(0);
      expect(zeroMovement.quantityChange).toBe(-20);
      expect(mockProductService.getProductById("prod-005")!.stock).toBe(0);
    });

    it("adjustStock logs exactly one movement and avoids duplicate movement records", () => {
      const movementsBefore = mockProductService.getInventoryMovements().length;

      const movement = mockProductService.adjustStock({
        productId: "prod-001",
        type: "restock",
        quantityChange: 5,
        reason: "Single lot delivery verification",
      });

      const movementsAfter = mockProductService.getInventoryMovements();
      // Must be exactly one additional movement logged
      expect(movementsAfter.length).toBe(movementsBefore + 1);
      expect(movementsAfter[0].id).toBe(movement.id);
      expect(movementsAfter[0].reason).toBe("Single lot delivery verification");
    });
  });

  describe("4. CSV Bulk Export & Import", () => {
    it("exports current catalog to structured CSV string", () => {
      const csv = mockProductService.exportProductsCSV();
      expect(csv).toContain("SKU,Title,Category,Regular Price (BDT)");
      expect(csv).toContain("JMD-SLK-001");
      expect(csv).toContain("TEA-SYL-004");
    });

    it("imports valid CSV products, unescapes quotes, and detects duplicate SKUs", () => {
      const testCsv = `SKU,Title,Category,Regular Price (BDT),Sale Price (BDT),Stock,Low Stock Threshold,Status,Brand
NEW-ITEM-01,"Silk ""Premium"" Scarf",Women's Fashion,1200,999,20,5,active,Aarong
NEW-ITEM-02,"Handmade Brass Utensil",Home & Living,2500,,10,3,active,Dhamrai`;

      const result = mockProductService.importProductsCSV(testCsv);
      expect(result.imported).toBe(2);
      expect(result.errors.length).toBe(0);
      const importedScarf = mockProductService.getProducts({ search: "NEW-ITEM-01" }).items[0];
      expect(importedScarf.title).toBe('Silk "Premium" Scarf');

      // Attempt importing duplicate SKU
      const duplicateCsv = `SKU,Title,Category,Regular Price (BDT),Sale Price (BDT),Stock,Low Stock Threshold,Status,Brand
NEW-ITEM-01,"Duplicate Jamdani",Women's Fashion,1500,,5,2,active,Test`;

      const dupResult = mockProductService.importProductsCSV(duplicateCsv);
      expect(dupResult.imported).toBe(0);
      expect(dupResult.errors.some((e) => e.includes("Duplicate SKU"))).toBe(true);
    });

    it("rejects CSV row if promotional sale price exceeds regular price", () => {
      const invalidSaleCsv = `SKU,Title,Category,Regular Price (BDT),Sale Price (BDT),Stock,Low Stock Threshold,Status,Brand
INV-SALE-01,"Faulty Discount Dress",Women's Fashion,1000,1500,10,3,active,Test`;

      const result = mockProductService.importProductsCSV(invalidSaleCsv);
      expect(result.imported).toBe(0);
      expect(result.errors.some((e) => e.includes("cannot exceed regular price"))).toBe(true);
    });
  });

  describe("5. Collections Persistence & Safe Storage Engine", () => {
    it("persists collections, supports collection creation, and restores on resetDemoData", () => {
      const initialCollections = mockProductService.getCollections();
      expect(initialCollections.length).toBeGreaterThan(0);
      expect(initialCollections.some((c) => c.slug === "eid-collection")).toBe(true);

      // Create new collection
      const newCol = mockProductService.createCollection({
        title: "Pohela Boishakh Festive",
        slug: "pohela-boishakh-festive",
        description: "Red and white traditional sarees and panjabis",
        published: true,
      });

      expect(newCol.id).toBeDefined();
      expect(newCol.title).toBe("Pohela Boishakh Festive");
      expect(mockProductService.getCollections().length).toBe(initialCollections.length + 1);
      expect(mockProductService.getCollections()[0].title).toBe("Pohela Boishakh Festive");

      // Reset Demo Data
      mockProductService.resetDemoData();
      expect(mockProductService.getCollections().length).toBe(initialCollections.length);
    });

    it("safely handles corrupted or malformed JSON in localStorage without throwing", () => {
      const originalWindow = (global as unknown as { window?: unknown }).window;
      const fakeStorage: Record<string, string> = {
        cartx_demo_products_v1: "INVALID_JSON_CORRUPTED{",
        cartx_demo_categories_v1: "null",
        cartx_demo_inventory_movements_v1: '"string-instead-of-array"',
        cartx_demo_collections_v1: "undefined",
      };

      (global as unknown as { window: { localStorage: Storage } }).window = {
        localStorage: {
          getItem: (key: string) => fakeStorage[key] || null,
          setItem: (key: string, val: string) => {
            fakeStorage[key] = val;
          },
          removeItem: (key: string) => {
            delete fakeStorage[key];
          },
          clear: () => {},
          length: 4,
          key: () => null,
        },
      };

      expect(() => mockProductService.getProducts()).not.toThrow();
      expect(mockProductService.getProducts().total).toBe(12);

      expect(() => mockProductService.getCategories()).not.toThrow();
      expect(mockProductService.getCategories().length).toBeGreaterThan(0);

      expect(() => mockProductService.getInventoryMovements()).not.toThrow();
      expect(mockProductService.getInventoryMovements().length).toBeGreaterThan(0);

      expect(() => mockProductService.getCollections()).not.toThrow();
      expect(mockProductService.getCollections().length).toBeGreaterThan(0);

      if (originalWindow) {
        (global as unknown as { window?: unknown }).window = originalWindow;
      } else {
        delete (global as unknown as { window?: unknown }).window;
      }
    });
  });
});

