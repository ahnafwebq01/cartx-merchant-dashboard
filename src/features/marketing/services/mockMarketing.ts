import type {
  Coupon,
  PromotionalDiscount,
  FlashSale,
  MarketingActivity,
  MarketingOverviewKPIs,
  MarketingAnalyticsData,
  AnalyticsDatePreset,
  ProductPerformanceReportItem,
  CampaignPerformanceReportItem,
  CouponUsageReportItem,
  DiscountPerformanceReportItem,
  ReportFilterParams,
  TopCampaignMetric,
  TopCouponMetric,
} from "../types";
import type {
  CouponFormValues,
  PromotionalDiscountFormValues,
  FlashSaleFormValues,
} from "../schemas";
import {
  INITIAL_COUPONS,
  INITIAL_DISCOUNTS,
  INITIAL_FLASH_SALES,
  INITIAL_ACTIVITIES,
} from "../constants";

export const COUPONS_STORAGE_KEY = "cartx_demo_marketing_coupons_v1";
export const DISCOUNTS_STORAGE_KEY = "cartx_demo_marketing_discounts_v1";
export const FLASH_SALES_STORAGE_KEY = "cartx_demo_marketing_flash_sales_v1";
export const MARKETING_ACTIVITIES_STORAGE_KEY = "cartx_demo_marketing_activities_v1";

/**
 * Escapes CSV field value according to RFC 4180:
 * Encloses in quotes if field contains commas, double quotes, or newlines.
 * Escapes internal quotes by doubling them (" -> "").
 */
export function escapeCsvField(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '""';
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generates RFC-compliant CSV string with UTF-8 BOM for Bengali & English compatibility.
 */
export function generateCsvContent(headers: string[], rows: (string | number | null | undefined)[][]): string {
  const headerLine = headers.map(escapeCsvField).join(",");
  const rowLines = rows.map((row) => row.map(escapeCsvField).join(","));
  return `\uFEFF${[headerLine, ...rowLines].join("\r\n")}`;
}

/**
 * Client-side file downloader for CSV exports
 */
export function downloadCsvFile(filename: string, csvContent: string): void {
  if (typeof window === "undefined") return;
  try {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("[MockMarketingService] CSV download failed:", error);
  }
}

export type CreateCouponInput = Omit<CouponFormValues, "minOrderAmount" | "perCustomerLimit"> & {
  minOrderAmount?: number;
  perCustomerLimit?: number | null;
};

export class MockMarketingService {
  private memoryCoupons: Coupon[] = JSON.parse(JSON.stringify(INITIAL_COUPONS));
  private memoryDiscounts: PromotionalDiscount[] = JSON.parse(JSON.stringify(INITIAL_DISCOUNTS));
  private memoryFlashSales: FlashSale[] = JSON.parse(JSON.stringify(INITIAL_FLASH_SALES));
  private memoryActivities: MarketingActivity[] = JSON.parse(JSON.stringify(INITIAL_ACTIVITIES));

  private safeGetItem<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  }

  private safeSetItem<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`[MockMarketingService] LocalStorage set error for key ${key}:`, e);
    }
  }

  // --- Coupon Operations ---

  public getCoupons(params?: { search?: string; status?: string; type?: string }): Coupon[] {
    let coupons = this.safeGetItem(COUPONS_STORAGE_KEY, this.memoryCoupons);

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      coupons = coupons.filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          c.campaignName.toLowerCase().includes(q)
      );
    }

    if (params?.status && params.status !== "all") {
      coupons = coupons.filter((c) => c.status === params.status);
    }

    if (params?.type && params.type !== "all") {
      coupons = coupons.filter((c) => c.discountType === params.type);
    }

    return coupons;
  }

  public getCouponById(id: string): Coupon | undefined {
    const coupons = this.getCoupons();
    return coupons.find((c) => c.id === id);
  }

  public getCouponByCode(code: string): Coupon | undefined {
    const coupons = this.getCoupons();
    return coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
  }

  public createCoupon(data: CreateCouponInput): Coupon {
    const existing = this.getCouponByCode(data.code);
    if (existing) {
      throw new Error(`Coupon code "${data.code}" already exists. Please choose a unique code.`);
    }

    const coupons = this.getCoupons();
    const newCoupon: Coupon = {
      id: `cpn-${Date.now()}`,
      code: data.code.toUpperCase().trim(),
      campaignName: data.campaignName,
      discountType: data.discountType,
      discountValue: data.discountValue,
      minOrderAmount: data.minOrderAmount || 0,
      maxDiscountCap: data.discountType === "percentage" ? data.maxDiscountCap ?? null : null,
      usageLimit: data.usageLimit ?? null,
      perCustomerLimit: data.perCustomerLimit ?? 1,
      usedCount: 0,
      startDate: data.startDate,
      endDate: data.endDate,
      applicableProducts: data.applicableProducts || [],
      applicableCategories: data.applicableCategories || [],
      customerEligibility: data.customerEligibility || "all",
      status: data.status || "active",
      totalDiscountGiven: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    coupons.unshift(newCoupon);
    this.memoryCoupons = coupons;
    this.safeSetItem(COUPONS_STORAGE_KEY, coupons);

    this.recordActivity({
      type: "coupon_created",
      title: `Coupon ${newCoupon.code} Created`,
      description: `Created ${newCoupon.discountType === "percentage" ? `${newCoupon.discountValue}%` : `৳${newCoupon.discountValue}`} discount coupon for ${newCoupon.campaignName}.`,
      actor: "Marketing Manager",
    });

    return newCoupon;
  }

  public updateCoupon(id: string, data: Partial<CouponFormValues>): Coupon {
    const coupons = this.getCoupons();
    const index = coupons.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Coupon with ID "${id}" not found.`);
    }

    if (data.code) {
      const codeUpper = data.code.toUpperCase().trim();
      const existing = coupons.find((c) => c.code === codeUpper && c.id !== id);
      if (existing) {
        throw new Error(`Coupon code "${data.code}" already in use by another coupon.`);
      }
    }

    const current = coupons[index];
    const updated: Coupon = {
      ...current,
      ...data,
      code: data.code ? data.code.toUpperCase().trim() : current.code,
      updatedAt: new Date().toISOString(),
    };

    coupons[index] = updated;
    this.memoryCoupons = coupons;
    this.safeSetItem(COUPONS_STORAGE_KEY, coupons);
    return updated;
  }

  public toggleCouponStatus(id: string, status: "active" | "inactive" | "expired"): Coupon {
    return this.updateCoupon(id, { status });
  }

  public deleteCoupon(id: string): void {
    const coupons = this.getCoupons();
    const filtered = coupons.filter((c) => c.id !== id);
    this.memoryCoupons = filtered;
    this.safeSetItem(COUPONS_STORAGE_KEY, filtered);
  }

  /**
   * Reusable coupon discount calculation
   */
  public calculateCouponDiscount(coupon: Coupon, orderSubtotal: number): number {
    if (coupon.status !== "active") return 0;
    if (orderSubtotal < coupon.minOrderAmount) return 0;

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (orderSubtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountCap && coupon.maxDiscountCap > 0) {
        discount = Math.min(discount, coupon.maxDiscountCap);
      }
    } else {
      discount = Math.min(coupon.discountValue, orderSubtotal);
    }

    return Math.round(discount);
  }

  // --- Promotional Discount Operations ---

  public getDiscounts(params?: { search?: string; status?: string; scope?: string }): PromotionalDiscount[] {
    let discounts = this.safeGetItem(DISCOUNTS_STORAGE_KEY, this.memoryDiscounts);

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      discounts = discounts.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.description?.toLowerCase().includes(q)
      );
    }

    if (params?.status && params.status !== "all") {
      discounts = discounts.filter((d) => d.status === params.status);
    }

    if (params?.scope && params.scope !== "all") {
      discounts = discounts.filter((d) => d.scope === params.scope);
    }

    return discounts;
  }

  public getDiscountById(id: string): PromotionalDiscount | undefined {
    const discounts = this.getDiscounts();
    return discounts.find((d) => d.id === id);
  }

  public createDiscount(data: PromotionalDiscountFormValues): PromotionalDiscount {
    const discounts = this.getDiscounts();
    const newDiscount: PromotionalDiscount = {
      id: `disc-${Date.now()}`,
      name: data.name,
      description: data.description || "",
      discountType: data.discountType,
      discountValue: data.discountValue,
      scope: data.scope,
      targetCategories: data.targetCategories || [],
      targetProducts: data.targetProducts || [],
      minOrderAmount: data.minOrderAmount || 0,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status || "active",
      ordersCount: 0,
      revenueAttributed: 0,
      totalDiscountGiven: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    discounts.unshift(newDiscount);
    this.memoryDiscounts = discounts;
    this.safeSetItem(DISCOUNTS_STORAGE_KEY, discounts);

    this.recordActivity({
      type: "discount_activated",
      title: `Discount ${newDiscount.name} Created`,
      description: `Configured ${newDiscount.scope} promotion with ${newDiscount.discountType === "percentage" ? `${newDiscount.discountValue}%` : `৳${newDiscount.discountValue}`} markdown.`,
      actor: "Marketing Manager",
    });

    return newDiscount;
  }

  public updateDiscount(id: string, data: Partial<PromotionalDiscountFormValues>): PromotionalDiscount {
    const discounts = this.getDiscounts();
    const index = discounts.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new Error(`Discount with ID "${id}" not found.`);
    }

    const current = discounts[index];
    const updated: PromotionalDiscount = {
      ...current,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    discounts[index] = updated;
    this.memoryDiscounts = discounts;
    this.safeSetItem(DISCOUNTS_STORAGE_KEY, discounts);
    return updated;
  }

  public toggleDiscountStatus(id: string, status: "draft" | "scheduled" | "active" | "ended"): PromotionalDiscount {
    return this.updateDiscount(id, { status });
  }

  public deleteDiscount(id: string): void {
    const discounts = this.getDiscounts();
    const filtered = discounts.filter((d) => d.id !== id);
    this.memoryDiscounts = filtered;
    this.safeSetItem(DISCOUNTS_STORAGE_KEY, filtered);
  }

  /**
   * Reusable product discount calculation
   */
  public calculateItemDiscount(itemPrice: number, discount: PromotionalDiscount): number {
    if (discount.status !== "active") return 0;
    let savings = 0;
    if (discount.discountType === "percentage") {
      savings = (itemPrice * discount.discountValue) / 100;
    } else {
      savings = Math.min(discount.discountValue, itemPrice);
    }
    return Math.round(savings);
  }

  // --- Flash Sale Operations ---

  public getFlashSales(params?: { status?: string; search?: string }): FlashSale[] {
    let sales = this.safeGetItem(FLASH_SALES_STORAGE_KEY, this.memoryFlashSales);

    // Dynamic status adjustment based on time
    const now = Date.now();
    sales = sales.map((sale) => {
      const start = new Date(sale.startTime).getTime();
      const end = new Date(sale.endTime).getTime();

      let currentStatus = sale.status;
      if (sale.status !== "draft") {
        if (now < start) {
          currentStatus = "scheduled";
        } else if (now >= start && now <= end) {
          currentStatus = "active";
        } else if (now > end) {
          currentStatus = "ended";
        }
      }
      return { ...sale, status: currentStatus };
    });

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      sales = sales.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.productTitle.toLowerCase().includes(q) ||
          s.productSku.toLowerCase().includes(q)
      );
    }

    if (params?.status && params.status !== "all") {
      sales = sales.filter((s) => s.status === params.status);
    }

    return sales;
  }

  public getFlashSaleById(id: string): FlashSale | undefined {
    const sales = this.getFlashSales();
    return sales.find((s) => s.id === id);
  }

  public createFlashSale(
    data: FlashSaleFormValues & { productTitle: string; productSku: string; productImage?: string; availableStock: number }
  ): FlashSale {
    // 1. Stock constraint: cannot exceed available inventory
    if (data.allocatedStock > data.availableStock) {
      throw new Error(
        `Flash sale stock (${data.allocatedStock}) cannot exceed available inventory (${data.availableStock}).`
      );
    }

    // 2. Prevent overlapping active or scheduled flash sales for same product
    const existingSales = this.getFlashSales();
    const newStart = new Date(data.startTime).getTime();
    const newEnd = new Date(data.endTime).getTime();

    const hasOverlap = existingSales.some((s) => {
      if (s.productId !== data.productId || s.status === "ended" || s.status === "draft") {
        return false;
      }
      const sStart = new Date(s.startTime).getTime();
      const sEnd = new Date(s.endTime).getTime();
      return (newStart <= sEnd && newEnd >= sStart);
    });

    if (hasOverlap) {
      throw new Error(
        `Product "${data.productTitle}" already has an active or scheduled flash sale during this timeframe.`
      );
    }

    const discountPercentage = Number(
      (((data.originalPrice - data.discountedPrice) / data.originalPrice) * 100).toFixed(1)
    );

    const newSale: FlashSale = {
      id: `fs-${Date.now()}`,
      title: data.title,
      description: data.description || "",
      productId: data.productId,
      productTitle: data.productTitle,
      productSku: data.productSku,
      productImage: data.productImage,
      originalPrice: data.originalPrice,
      discountedPrice: data.discountedPrice,
      discountPercentage,
      allocatedStock: data.allocatedStock,
      claimedStock: 0,
      perCustomerLimit: data.perCustomerLimit || 1,
      startTime: data.startTime,
      endTime: data.endTime,
      status: data.status || "scheduled",
      revenue: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    existingSales.unshift(newSale);
    this.memoryFlashSales = existingSales;
    this.safeSetItem(FLASH_SALES_STORAGE_KEY, existingSales);

    this.recordActivity({
      type: "flash_sale_started",
      title: `Flash Sale Scheduled: ${newSale.title}`,
      description: `Flash price ৳${newSale.discountedPrice} (${newSale.discountPercentage}% off) with ${newSale.allocatedStock} units.`,
      actor: "Marketing Manager",
    });

    return newSale;
  }

  public updateFlashSale(id: string, data: Partial<FlashSaleFormValues>): FlashSale {
    const sales = this.getFlashSales();
    const index = sales.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Flash sale with ID "${id}" not found.`);
    }

    const current = sales[index];
    const originalPrice = data.originalPrice ?? current.originalPrice;
    const discountedPrice = data.discountedPrice ?? current.discountedPrice;
    const discountPercentage = Number(
      (((originalPrice - discountedPrice) / originalPrice) * 100).toFixed(1)
    );

    const updated: FlashSale = {
      ...current,
      ...data,
      discountPercentage,
      updatedAt: new Date().toISOString(),
    };

    sales[index] = updated;
    this.memoryFlashSales = sales;
    this.safeSetItem(FLASH_SALES_STORAGE_KEY, sales);
    return updated;
  }

  public deleteFlashSale(id: string): void {
    const sales = this.getFlashSales();
    const filtered = sales.filter((s) => s.id !== id);
    this.memoryFlashSales = filtered;
    this.safeSetItem(FLASH_SALES_STORAGE_KEY, filtered);
  }

  // --- Marketing Overview KPIs ---

  public getMarketingOverview(): MarketingOverviewKPIs {
    const coupons = this.getCoupons();
    const discounts = this.getDiscounts();
    const flashSales = this.getFlashSales();
    const activities = this.getActivities();

    const activeCoupons = coupons.filter((c) => c.status === "active");
    const activeDiscounts = discounts.filter((d) => d.status === "active");
    const activeFlashSales = flashSales.filter((f) => f.status === "active");

    const totalActiveCampaigns =
      activeCoupons.length + activeDiscounts.length + activeFlashSales.length;

    const totalDiscountAmount =
      coupons.reduce((sum, c) => sum + (c.totalDiscountGiven || 0), 0) +
      discounts.reduce((sum, d) => sum + (d.totalDiscountGiven || 0), 0) +
      flashSales.reduce((sum, f) => sum + (f.claimedStock * (f.originalPrice - f.discountedPrice)), 0);

    const totalAttributedRevenue =
      discounts.reduce((sum, d) => sum + (d.revenueAttributed || 0), 0) +
      flashSales.reduce((sum, f) => sum + (f.revenue || 0), 0) +
      coupons.reduce((sum, c) => sum + (c.usedCount * 3200), 0); // realistic AOV ৳3,200 for coupon orders

    const totalCouponRedemptions = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);

    return {
      totalActiveCampaigns,
      activeCouponCount: activeCoupons.length,
      totalDiscountAmount,
      totalAttributedRevenue,
      overallConversionRate: 8.6,
      totalCouponRedemptions,
      recentActivities: activities.slice(0, 5),
    };
  }

  // --- Marketing Analytics ---

  public getMarketingAnalytics(preset: AnalyticsDatePreset = "30d"): MarketingAnalyticsData {
    const coupons = this.getCoupons();
    const overview = this.getMarketingOverview();

    // Timeline generator for daily trends
    const days = preset === "today" ? 1 : preset === "7d" ? 7 : preset === "90d" ? 90 : 30;
    const timeline = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const label = `${monthNames[d.getMonth()]} ${d.getDate()}`;

      // Deterministic realistic daily variation
      const factor = ((i * 7) % 11) / 10 + 0.5;
      const revenue = Math.round(18000 * factor);
      const dailyDiscounts = Math.round(2400 * factor);
      const redemptions = Math.round(6 * factor);

      timeline.push({
        date: dateStr,
        label,
        revenue,
        discounts: dailyDiscounts,
        redemptions,
      });
    }

    const topCampaigns: TopCampaignMetric[] = [
      {
        id: "disc-201",
        name: "Spring Storewide Shopping Spree (10% Off)",
        type: "discount",
        orders: 94,
        revenue: 268000,
        discountGiven: 26800,
        conversionRate: 11.2,
      },
      {
        id: "cpn-101",
        name: "EID2026 — Eid Ul Fitr Mega Celebration",
        type: "coupon",
        orders: 142,
        revenue: 454400,
        discountGiven: 124500,
        conversionRate: 14.8,
      },
      {
        id: "fs-301",
        name: "Midnight Flash: Premium Silk Jamdani Saree",
        type: "flash_sale",
        orders: 11,
        revenue: 107800,
        discountGiven: 29700,
        conversionRate: 19.5,
      },
      {
        id: "disc-202",
        name: "Heritage Silk & Sarees Promotion",
        type: "discount",
        orders: 48,
        revenue: 195000,
        discountGiven: 23400,
        conversionRate: 9.4,
      },
      {
        id: "fs-302",
        name: "Rush Hour Deal: Full Grain Leather Duffle",
        type: "flash_sale",
        orders: 18,
        revenue: 62982,
        discountGiven: 18018,
        conversionRate: 16.2,
      },
    ];

    const topCoupons: TopCouponMetric[] = coupons
      .map((c) => ({
        id: c.id,
        code: c.code,
        campaignName: c.campaignName,
        discountDisplay: c.discountType === "percentage" ? `${c.discountValue}%` : `৳${c.discountValue}`,
        usedCount: c.usedCount,
        totalSavings: c.totalDiscountGiven,
        revenueAttributed: c.usedCount * 3200,
      }))
      .sort((a, b) => b.usedCount - a.usedCount);

    return {
      preset,
      startDate: timeline[0]?.date || new Date().toISOString(),
      endDate: timeline[timeline.length - 1]?.date || new Date().toISOString(),
      revenueGenerated: overview.totalAttributedRevenue,
      couponRedemptionRate: 14.2,
      totalCouponUsage: overview.totalCouponRedemptions,
      discountExpenditure: overview.totalDiscountAmount,
      campaignConversionRate: overview.overallConversionRate,
      timeline,
      topCampaigns,
      topCoupons,
    };
  }

  // --- Reports & Export ---

  public getProductPerformanceReport(params?: ReportFilterParams): ProductPerformanceReportItem[] {
    const raw: ProductPerformanceReportItem[] = [
      {
        id: "prod-001",
        title: "Premium Silk Jamdani Saree (Navy & Gold)",
        sku: "JMD-SLK-001",
        category: "Apparel & Fashion",
        unitsSold: 38,
        grossRevenue: 475000,
        discountAmount: 56400,
        netRevenue: 418600,
        campaignAttributedOrders: 29,
      },
      {
        id: "prod-002",
        title: "Handcrafted Full Grain Leather Travel Duffle",
        sku: "LTH-DUF-002",
        category: "Leather Goods",
        unitsSold: 42,
        grossRevenue: 189000,
        discountAmount: 24500,
        netRevenue: 164500,
        campaignAttributedOrders: 31,
      },
      {
        id: "prod-003",
        title: "Pure Sundarban Wild Raw Honey (1kg)",
        sku: "ORG-HNY-003",
        category: "Organic & Groceries",
        unitsSold: 95,
        grossRevenue: 118750,
        discountAmount: 11200,
        netRevenue: 107550,
        campaignAttributedOrders: 44,
      },
      {
        id: "prod-004",
        title: "Organic Cold-Pressed Mustard Oil (2L)",
        sku: "ORG-OIL-004",
        category: "Organic & Groceries",
        unitsSold: 84,
        grossRevenue: 63000,
        discountAmount: 6200,
        netRevenue: 56800,
        campaignAttributedOrders: 38,
      },
      {
        id: "prod-005",
        title: "Traditional Brass Nakshi Pitha Die Mold Set",
        sku: "CRS-BRS-005",
        category: "Heritage Crafts",
        unitsSold: 26,
        grossRevenue: 44200,
        discountAmount: 4100,
        netRevenue: 40100,
        campaignAttributedOrders: 18,
      },
    ];

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      return raw.filter((r) => r.title.toLowerCase().includes(q) || r.sku.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
    }
    return raw;
  }

  public getCampaignPerformanceReport(params?: ReportFilterParams): CampaignPerformanceReportItem[] {
    const discounts = this.getDiscounts();
    const flashSales = this.getFlashSales();
    const coupons = this.getCoupons();

    const items: CampaignPerformanceReportItem[] = [
      ...coupons.map((c) => ({
        id: c.id,
        name: `${c.code} — ${c.campaignName}`,
        type: "Coupon" as const,
        status: c.status.toUpperCase(),
        startDate: c.startDate.split("T")[0],
        endDate: c.endDate.split("T")[0],
        orders: c.usedCount,
        revenue: c.usedCount * 3200,
        discountGiven: c.totalDiscountGiven,
        averageOrderValue: 3200,
      })),
      ...discounts.map((d) => ({
        id: d.id,
        name: d.name,
        type: "Discount" as const,
        status: d.status.toUpperCase(),
        startDate: d.startDate.split("T")[0],
        endDate: d.endDate.split("T")[0],
        orders: d.ordersCount,
        revenue: d.revenueAttributed,
        discountGiven: d.totalDiscountGiven,
        averageOrderValue: d.ordersCount > 0 ? Math.round(d.revenueAttributed / d.ordersCount) : 0,
      })),
      ...flashSales.map((f) => ({
        id: f.id,
        name: f.title,
        type: "Flash Sale" as const,
        status: f.status.toUpperCase(),
        startDate: f.startTime.split("T")[0],
        endDate: f.endTime.split("T")[0],
        orders: f.claimedStock,
        revenue: f.revenue,
        discountGiven: f.claimedStock * (f.originalPrice - f.discountedPrice),
        averageOrderValue: f.claimedStock > 0 ? Math.round(f.revenue / f.claimedStock) : f.discountedPrice,
      })),
    ];

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      return items.filter((i) => i.name.toLowerCase().includes(q));
    }
    return items;
  }

  public getCouponUsageReport(params?: ReportFilterParams): CouponUsageReportItem[] {
    const coupons = this.getCoupons();
    const items: CouponUsageReportItem[] = coupons.map((c) => ({
      id: c.id,
      code: c.code,
      campaignName: c.campaignName,
      discountType: c.discountType === "percentage" ? "Percentage" : "Fixed BDT",
      discountValue: c.discountType === "percentage" ? `${c.discountValue}%` : `৳${c.discountValue}`,
      redemptions: c.usedCount,
      totalDiscountGiven: c.totalDiscountGiven,
      averageOrderValue: 3200,
      lastUsedDate: c.updatedAt.split("T")[0],
    }));

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      return items.filter((i) => i.code.toLowerCase().includes(q) || i.campaignName.toLowerCase().includes(q));
    }
    return items;
  }

  public getDiscountPerformanceReport(params?: ReportFilterParams): DiscountPerformanceReportItem[] {
    const discounts = this.getDiscounts();
    const items: DiscountPerformanceReportItem[] = discounts.map((d) => ({
      id: d.id,
      name: d.name,
      scope: d.scope.charAt(0).toUpperCase() + d.scope.slice(1),
      discountValue: d.discountType === "percentage" ? `${d.discountValue}%` : `৳${d.discountValue}`,
      status: d.status.toUpperCase(),
      ordersCount: d.ordersCount,
      totalSavings: d.totalDiscountGiven,
      revenueGenerated: d.revenueAttributed,
    }));

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      return items.filter((i) => i.name.toLowerCase().includes(q) || i.scope.toLowerCase().includes(q));
    }
    return items;
  }

  // --- Activities ---

  public getActivities(): MarketingActivity[] {
    return this.safeGetItem(MARKETING_ACTIVITIES_STORAGE_KEY, this.memoryActivities);
  }

  public recordActivity(activity: Omit<MarketingActivity, "id" | "timestamp">): void {
    const activities = this.getActivities();
    const newAct: MarketingActivity = {
      ...activity,
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    activities.unshift(newAct);
    this.memoryActivities = activities;
    this.safeSetItem(MARKETING_ACTIVITIES_STORAGE_KEY, activities);
  }

  // --- Reset Demo Data ---

  public resetDemoData(): void {
    this.memoryCoupons = JSON.parse(JSON.stringify(INITIAL_COUPONS));
    this.memoryDiscounts = JSON.parse(JSON.stringify(INITIAL_DISCOUNTS));
    this.memoryFlashSales = JSON.parse(JSON.stringify(INITIAL_FLASH_SALES));
    this.memoryActivities = JSON.parse(JSON.stringify(INITIAL_ACTIVITIES));

    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(COUPONS_STORAGE_KEY);
        window.localStorage.removeItem(DISCOUNTS_STORAGE_KEY);
        window.localStorage.removeItem(FLASH_SALES_STORAGE_KEY);
        window.localStorage.removeItem(MARKETING_ACTIVITIES_STORAGE_KEY);
      } catch (e) {
        console.warn("[MockMarketingService] Reset storage error:", e);
      }
    }
  }
}

export const mockMarketingService = new MockMarketingService();
