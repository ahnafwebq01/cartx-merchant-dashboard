import { describe, it, expect, beforeEach } from "vitest";
import {
  couponFormSchema,
  promotionalDiscountFormSchema,
  flashSaleFormSchema,
} from "@/features/marketing/schemas";
import {
  MockMarketingService,
  escapeCsvField,
  generateCsvContent,
} from "@/features/marketing/services/mockMarketing";
import {
  INITIAL_COUPONS,
} from "@/features/marketing/constants";
import type { Coupon, PromotionalDiscount } from "@/features/marketing/types";

describe("Phase 7: Marketing, Promotions & Analytics Test Suite", () => {
  let service: MockMarketingService;

  beforeEach(() => {
    service = new MockMarketingService();
  });

  describe("1. Coupon Zod Validation Schema", () => {
    it("should accept valid percentage coupon", () => {
      const valid = {
        code: "EID2026",
        campaignName: "Eid Celebration",
        discountType: "percentage",
        discountValue: 15,
        minOrderAmount: 2000,
        maxDiscountCap: 1000,
        usageLimit: 500,
        perCustomerLimit: 1,
        startDate: "2026-04-01",
        endDate: "2026-04-30",
        customerEligibility: "all",
        status: "active",
      };

      const result = couponFormSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.code).toBe("EID2026");
      }
    });

    it("should accept valid fixed amount coupon", () => {
      const valid = {
        code: "SAVE500",
        campaignName: "Flat 500 Taka Off",
        discountType: "fixed",
        discountValue: 500,
        minOrderAmount: 2500,
        usageLimit: 100,
        startDate: "2026-05-01",
        endDate: "2026-05-31",
      };

      const result = couponFormSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.discountValue).toBe(500);
      }
    });

    it("should automatically trim and uppercase coupon codes", () => {
      const result = couponFormSchema.safeParse({
        code: "  ramadan-special  ",
        campaignName: "Ramadan Campaign",
        discountType: "percentage",
        discountValue: 10,
        startDate: "2026-03-01",
        endDate: "2026-03-31",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.code).toBe("RAMADAN-SPECIAL");
      }
    });

    it("should reject percentage discounts < 1 or > 100", () => {
      const resultZero = couponFormSchema.safeParse({
        code: "ZERO10",
        campaignName: "Invalid Zero",
        discountType: "percentage",
        discountValue: 0,
        startDate: "2026-04-01",
        endDate: "2026-04-30",
      });
      expect(resultZero.success).toBe(false);

      const result101 = couponFormSchema.safeParse({
        code: "OVER100",
        campaignName: "Invalid Over 100",
        discountType: "percentage",
        discountValue: 105,
        startDate: "2026-04-01",
        endDate: "2026-04-30",
      });
      expect(result101.success).toBe(false);
    });

    it("should reject fixed discount <= 0", () => {
      const resultNegative = couponFormSchema.safeParse({
        code: "NEG100",
        campaignName: "Negative Discount",
        discountType: "fixed",
        discountValue: -50,
        startDate: "2026-04-01",
        endDate: "2026-04-30",
      });
      expect(resultNegative.success).toBe(false);
    });

    it("should reject expiration date before or equal to start date", () => {
      const resultEarlier = couponFormSchema.safeParse({
        code: "TIMETRAVEL",
        campaignName: "End before start",
        discountType: "percentage",
        discountValue: 10,
        startDate: "2026-05-15",
        endDate: "2026-05-10",
      });
      expect(resultEarlier.success).toBe(false);

      const resultSame = couponFormSchema.safeParse({
        code: "SAMEDATE",
        campaignName: "Same day end",
        discountType: "percentage",
        discountValue: 10,
        startDate: "2026-05-15T10:00:00.000Z",
        endDate: "2026-05-15T10:00:00.000Z",
      });
      expect(resultSame.success).toBe(false);
    });

    it("should reject negative minOrderAmount and negative maxDiscountCap", () => {
      const result = couponFormSchema.safeParse({
        code: "NEGCAP",
        campaignName: "Negative Cap",
        discountType: "percentage",
        discountValue: 10,
        minOrderAmount: -100,
        maxDiscountCap: -50,
        startDate: "2026-04-01",
        endDate: "2026-04-30",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("2. Coupon Uniqueness & Management Service", () => {
    it("should retrieve initial baseline demo coupons", () => {
      const coupons = service.getCoupons();
      expect(coupons.length).toBeGreaterThanOrEqual(INITIAL_COUPONS.length);
      expect(coupons.some((c) => c.code === "EID2026")).toBe(true);
    });

    it("should create new coupon with unique uppercase code", () => {
      const created = service.createCoupon({
        code: "SPECIAL2026",
        campaignName: "Summer Mega Festival",
        discountType: "percentage",
        discountValue: 20,
        minOrderAmount: 1500,
        maxDiscountCap: 800,
        usageLimit: 300,
        perCustomerLimit: 1,
        startDate: "2026-06-01",
        endDate: "2026-06-30",
        customerEligibility: "all",
        status: "active",
        applicableCategories: [],
        applicableProducts: [],
      });

      expect(created.id).toBeTruthy();
      expect(created.code).toBe("SPECIAL2026");
      expect(created.usedCount).toBe(0);

      const fetched = service.getCouponByCode("special2026");
      expect(fetched?.id).toBe(created.id);
    });

    it("should reject creating a coupon with duplicate code (case-insensitive)", () => {
      expect(() => {
        service.createCoupon({
          code: "eid2026", // Already in INITIAL_COUPONS
          campaignName: "Duplicate Eid",
          discountType: "percentage",
          discountValue: 10,
          minOrderAmount: 0,
          startDate: "2026-04-01",
          endDate: "2026-04-30",
          customerEligibility: "all",
          status: "active",
          applicableCategories: [],
          applicableProducts: [],
        });
      }).toThrow(/already exists/i);
    });

    it("should allow editing a coupon and prevent renaming to another existing code", () => {
      const coupons = service.getCoupons();
      const first = coupons[0];
      const second = coupons[1];

      // Updating non-code fields succeeds
      const updated = service.updateCoupon(first.id, {
        campaignName: "Updated Name",
      });
      expect(updated.campaignName).toBe("Updated Name");

      // Renaming to second coupon code fails
      expect(() => {
        service.updateCoupon(first.id, {
          code: second.code,
        });
      }).toThrow(/already in use/i);
    });

    it("should toggle coupon status and delete coupon correctly", () => {
      const coupons = service.getCoupons();
      const target = coupons[0];

      const toggled = service.toggleCouponStatus(target.id, "inactive");
      expect(toggled.status).toBe("inactive");

      service.deleteCoupon(target.id);
      expect(service.getCouponById(target.id)).toBeUndefined();
    });
  });

  describe("3. Discount Calculation Engine", () => {
    it("should calculate percentage discount correctly", () => {
      const coupon: Coupon = {
        id: "c1",
        code: "TEST15",
        campaignName: "Test 15%",
        discountType: "percentage",
        discountValue: 15,
        minOrderAmount: 1000,
        maxDiscountCap: null,
        usedCount: 0,
        startDate: "2026-01-01",
        endDate: "2026-12-31",
        customerEligibility: "all",
        status: "active",
        totalDiscountGiven: 0,
        createdAt: "",
        updatedAt: "",
      };

      // 15% of 2,000 = 300
      expect(service.calculateCouponDiscount(coupon, 2000)).toBe(300);
      // 15% of 5,500 = 825
      expect(service.calculateCouponDiscount(coupon, 5500)).toBe(825);
    });

    it("should respect max discount cap on percentage coupon", () => {
      const couponWithCap: Coupon = {
        id: "c2",
        code: "CAP500",
        campaignName: "20% capped at 500",
        discountType: "percentage",
        discountValue: 20,
        minOrderAmount: 1000,
        maxDiscountCap: 500,
        usedCount: 0,
        startDate: "2026-01-01",
        endDate: "2026-12-31",
        customerEligibility: "all",
        status: "active",
        totalDiscountGiven: 0,
        createdAt: "",
        updatedAt: "",
      };

      // 20% of 10,000 is 2,000, but cap is 500
      expect(service.calculateCouponDiscount(couponWithCap, 10000)).toBe(500);
      // 20% of 2,000 is 400 (under cap)
      expect(service.calculateCouponDiscount(couponWithCap, 2000)).toBe(400);
    });

    it("should enforce minimum order amount", () => {
      const coupon: Coupon = {
        id: "c3",
        code: "MIN2000",
        campaignName: "Requires 2000 minimum",
        discountType: "fixed",
        discountValue: 300,
        minOrderAmount: 2000,
        usedCount: 0,
        startDate: "2026-01-01",
        endDate: "2026-12-31",
        customerEligibility: "all",
        status: "active",
        totalDiscountGiven: 0,
        createdAt: "",
        updatedAt: "",
      };

      // 1,800 is below 2,000 min -> 0 discount
      expect(service.calculateCouponDiscount(coupon, 1800)).toBe(0);
      // 2,500 meets min -> 300 discount
      expect(service.calculateCouponDiscount(coupon, 2500)).toBe(300);
    });

    it("should return 0 discount for inactive coupons", () => {
      const inactiveCoupon: Coupon = {
        id: "c4",
        code: "INACTIVE",
        campaignName: "Inactive",
        discountType: "percentage",
        discountValue: 25,
        minOrderAmount: 0,
        usedCount: 0,
        startDate: "2026-01-01",
        endDate: "2026-12-31",
        customerEligibility: "all",
        status: "inactive",
        totalDiscountGiven: 0,
        createdAt: "",
        updatedAt: "",
      };

      expect(service.calculateCouponDiscount(inactiveCoupon, 5000)).toBe(0);
    });

    it("should calculate promotional item discount correctly", () => {
      const promo: PromotionalDiscount = {
        id: "p1",
        name: "10% Markdown",
        discountType: "percentage",
        discountValue: 10,
        scope: "storewide",
        startDate: "2026-01-01",
        endDate: "2026-12-31",
        status: "active",
        ordersCount: 0,
        revenueAttributed: 0,
        totalDiscountGiven: 0,
        createdAt: "",
        updatedAt: "",
      };

      expect(service.calculateItemDiscount(12500, promo)).toBe(1250);
    });
  });

  describe("4. Promotional Discounts & Campaigns", () => {
    it("should validate category-specific discounts require target categories", () => {
      const resultNoCategory = promotionalDiscountFormSchema.safeParse({
        name: "Category Fest",
        discountType: "percentage",
        discountValue: 10,
        scope: "category",
        targetCategories: [],
        startDate: "2026-04-01",
        endDate: "2026-04-30",
      });
      expect(resultNoCategory.success).toBe(false);

      const resultValid = promotionalDiscountFormSchema.safeParse({
        name: "Category Fest",
        discountType: "percentage",
        discountValue: 10,
        scope: "category",
        targetCategories: ["Apparel & Sarees"],
        startDate: "2026-04-01",
        endDate: "2026-04-30",
      });
      expect(resultValid.success).toBe(true);
    });

    it("should validate product-specific discounts require target products", () => {
      const resultNoProd = promotionalDiscountFormSchema.safeParse({
        name: "Product Markdown",
        discountType: "fixed",
        discountValue: 100,
        scope: "product",
        targetProducts: [],
        startDate: "2026-04-01",
        endDate: "2026-04-30",
      });
      expect(resultNoProd.success).toBe(false);
    });

    it("should support full CRUD for discounts", () => {
      const created = service.createDiscount({
        name: "Noboborsho Flash 15%",
        description: "Bengali New Year markdown",
        discountType: "percentage",
        discountValue: 15,
        scope: "storewide",
        minOrderAmount: 1200,
        startDate: "2026-04-10",
        endDate: "2026-04-20",
        status: "active",
        targetCategories: [],
        targetProducts: [],
      });

      expect(created.id).toBeTruthy();
      expect(service.getDiscountById(created.id)?.name).toBe("Noboborsho Flash 15%");

      const updated = service.updateDiscount(created.id, {
        discountValue: 18,
      });
      expect(updated.discountValue).toBe(18);

      service.deleteDiscount(created.id);
      expect(service.getDiscountById(created.id)).toBeUndefined();
    });
  });

  describe("5. Flash Sales Constraints & Overlap Prevention", () => {
    it("should reject flash sale when discounted price is higher or equal to regular price", () => {
      const resultHigher = flashSaleFormSchema.safeParse({
        title: "Invalid Flash Price",
        productId: "prod-001",
        originalPrice: 1000,
        discountedPrice: 1200, // Higher than 1000
        allocatedStock: 10,
        perCustomerLimit: 1,
        startTime: "2026-05-01T10:00",
        endTime: "2026-05-01T20:00",
      });
      expect(resultHigher.success).toBe(false);

      const resultEqual = flashSaleFormSchema.safeParse({
        title: "Invalid Equal Price",
        productId: "prod-001",
        originalPrice: 1000,
        discountedPrice: 1000, // Equal
        allocatedStock: 10,
        perCustomerLimit: 1,
        startTime: "2026-05-01T10:00",
        endTime: "2026-05-01T20:00",
      });
      expect(resultEqual.success).toBe(false);
    });

    it("should reject flash sale when allocated stock exceeds available inventory", () => {
      expect(() => {
        service.createFlashSale({
          title: "Exceeds Stock",
          productId: "prod-001",
          productTitle: "Test Jamdani",
          productSku: "JMD-001",
          originalPrice: 12500,
          discountedPrice: 9500,
          allocatedStock: 50, // exceeds available 20
          availableStock: 20,
          perCustomerLimit: 1,
          startTime: "2026-06-01T00:00:00.000Z",
          endTime: "2026-06-01T23:59:59.000Z",
          status: "scheduled",
        });
      }).toThrow(/cannot exceed available inventory/i);
    });

    it("should prevent overlapping active/scheduled flash sales for the same product", () => {
      const futureStart = new Date(Date.now() + 5 * 24 * 3600 * 1000);
      const futureEnd = new Date(Date.now() + 6 * 24 * 3600 * 1000);
      const overlapStart = new Date(Date.now() + 5.5 * 24 * 3600 * 1000);
      const overlapEnd = new Date(Date.now() + 7 * 24 * 3600 * 1000);

      // Create first flash sale
      service.createFlashSale({
        title: "Future Flash Drop",
        productId: "prod-999",
        productTitle: "Test Item",
        productSku: "TST-999",
        originalPrice: 2000,
        discountedPrice: 1500,
        allocatedStock: 5,
        availableStock: 20,
        perCustomerLimit: 1,
        startTime: futureStart.toISOString(),
        endTime: futureEnd.toISOString(),
        status: "scheduled",
      });

      // Try creating overlapping flash sale for the same product
      expect(() => {
        service.createFlashSale({
          title: "Overlapping Flash",
          productId: "prod-999", // Same product
          productTitle: "Test Item",
          productSku: "TST-999",
          originalPrice: 2000,
          discountedPrice: 1400,
          allocatedStock: 5,
          availableStock: 20,
          perCustomerLimit: 1,
          startTime: overlapStart.toISOString(), // Overlaps
          endTime: overlapEnd.toISOString(),
          status: "scheduled",
        });
      }).toThrow(/already has an active or scheduled flash sale/i);
    });

    it("should dynamically calculate ended/scheduled status based on current time", () => {
      const sales = service.getFlashSales();
      const ended = sales.find((s) => s.id === "fs-304");
      expect(ended?.status).toBe("ended");
    });
  });

  describe("6. Marketing Analytics & Overview", () => {
    it("should compute accurate marketing overview KPIs", () => {
      const overview = service.getMarketingOverview();
      expect(overview.totalActiveCampaigns).toBeGreaterThan(0);
      expect(overview.activeCouponCount).toBeGreaterThan(0);
      expect(overview.totalDiscountAmount).toBeGreaterThan(0);
      expect(overview.totalAttributedRevenue).toBeGreaterThan(0);
      expect(overview.recentActivities.length).toBeGreaterThan(0);
    });

    it("should generate marketing analytics for different date presets", () => {
      const analytics30 = service.getMarketingAnalytics("30d");
      expect(analytics30.timeline.length).toBe(30);
      expect(analytics30.topCampaigns.length).toBeGreaterThan(0);
      expect(analytics30.topCoupons.length).toBeGreaterThan(0);

      const analytics7 = service.getMarketingAnalytics("7d");
      expect(analytics7.timeline.length).toBe(7);

      const analyticsToday = service.getMarketingAnalytics("today");
      expect(analyticsToday.timeline.length).toBe(1);
    });
  });

  describe("7. RFC-4180 CSV Generation & UTF-8 BOM Escaping", () => {
    it("should escape commas, quotes, and newlines correctly", () => {
      expect(escapeCsvField("SimpleText")).toBe("SimpleText");
      expect(escapeCsvField("Text with, comma")).toBe('"Text with, comma"');
      expect(escapeCsvField('Text with "quotes"')).toBe('"Text with ""quotes"""');
      expect(escapeCsvField("Line1\nLine2")).toBe('"Line1\nLine2"');
    });

    it("should prepend UTF-8 BOM (\\uFEFF) to CSV output for Bengali text support", () => {
      const headers = ["Title", "Price (৳)", "Category"];
      const rows = [
        ["শাড়ি জামদানি (Silk)", 12500, "পোশাক"],
        ["খাঁটি মধু (Sundarban)", 1250, "জৈব খাদ্য"],
      ];

      const csv = generateCsvContent(headers, rows);
      expect(csv.startsWith("\uFEFF")).toBe(true);
      expect(csv).toContain("শাড়ি জামদানি (Silk)");
      expect(csv).toContain("খাঁটি মধু (Sundarban)");
    });

    it("should generate correct reports datasets for products, campaigns, coupons, discounts", () => {
      const prods = service.getProductPerformanceReport();
      expect(prods.length).toBeGreaterThan(0);

      const campaigns = service.getCampaignPerformanceReport();
      expect(campaigns.length).toBeGreaterThan(0);

      const coupons = service.getCouponUsageReport();
      expect(coupons.length).toBeGreaterThan(0);

      const discounts = service.getDiscountPerformanceReport();
      expect(discounts.length).toBeGreaterThan(0);
    });

    it("should respect search filters in reports", () => {
      const searchProds = service.getProductPerformanceReport({
        tab: "products",
        search: "Jamdani",
      });
      expect(searchProds.length).toBe(1);
      expect(searchProds[0].sku).toBe("JMD-SLK-001");
    });
  });

  describe("8. Demo Mode Reset Behavior", () => {
    it("should reset modified demo data back to baseline initial presets", () => {
      service.createCoupon({
        code: "TEMPORARY123",
        campaignName: "Temporary",
        discountType: "percentage",
        discountValue: 10,
        startDate: "2026-01-01",
        endDate: "2026-12-31",
        customerEligibility: "all",
        status: "active",
        applicableCategories: [],
        applicableProducts: [],
      });

      expect(service.getCouponByCode("TEMPORARY123")).toBeDefined();

      service.resetDemoData();
      expect(service.getCouponByCode("TEMPORARY123")).toBeUndefined();
      expect(service.getCoupons().length).toBe(INITIAL_COUPONS.length);
    });
  });
});
