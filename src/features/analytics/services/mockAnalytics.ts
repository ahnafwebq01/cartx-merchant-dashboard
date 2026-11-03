import type {
  DateRange,
  SalesAnalytics,
  CustomerAnalytics,
  ProductAnalytics,
  MarketingAnalytics,
  AnalyticsOverview,
  ExportableReport,
  DailyRevenuePoint,
  SegmentDistributionItem,
  TopCustomerItem,
  TopProductItem,
  LowStockItem,
  CategoryPerformanceItem,
  CampaignPerformanceItem,
} from "../types";
import type { Product } from "@/features/products/types";
import { mockCustomerService } from "@/features/customers/services/mockCustomers";
import { mockProductService } from "@/features/products/services/mockProducts";
import { mockOrderService } from "@/features/orders/services/mockOrders";
import { mockMarketingService } from "@/features/marketing/services/mockMarketing";
import { escapeCsvField } from "@/features/marketing/services/mockMarketing";

export class MockAnalyticsService {
  private getOrders() {
    return mockOrderService.getOrders({ limit: 100 }).orders;
  }

  private getCustomers() {
    return mockCustomerService.getCustomers({ limit: 100 }).customers;
  }

  private getProducts(): Product[] {
    return mockProductService.getProducts({ limit: 100 }).items;
  }

  public getSalesAnalytics(dateRange: DateRange): SalesAnalytics {
    const orders = this.getOrders();
    const fromTime = new Date(`${dateRange.from}T00:00:00.000Z`).getTime();
    const toTime = new Date(`${dateRange.to}T23:59:59.999Z`).getTime();
    const duration = toTime - fromTime;
    const prevFromTime = fromTime - duration;
    const prevToTime = fromTime;

    const currentOrders = orders.filter((o) => {
      const t = new Date(o.createdAt).getTime();
      return t >= fromTime && t <= toTime && o.orderStatus !== "cancelled";
    });

    const previousOrders = orders.filter((o) => {
      const t = new Date(o.createdAt).getTime();
      return t >= prevFromTime && t < prevToTime && o.orderStatus !== "cancelled";
    });

    const totalRevenue = currentOrders.reduce((sum, o) => sum + o.grandTotal, 0);
    const totalOrders = currentOrders.length;
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    const previousPeriodRevenue = previousOrders.reduce((sum, o) => sum + o.grandTotal, 0);
    const previousPeriodOrders = previousOrders.length;

    const revenueChange =
      previousPeriodRevenue > 0
        ? Math.round(((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100)
        : totalRevenue > 0
        ? 100
        : 0;

    const ordersChange =
      previousPeriodOrders > 0
        ? Math.round(((totalOrders - previousPeriodOrders) / previousPeriodOrders) * 100)
        : totalOrders > 0
        ? 100
        : 0;

    // Daily breakdown
    const dailyMap = new Map<string, { revenue: number; orders: number }>();
    currentOrders.forEach((o) => {
      const dateKey = o.createdAt.split("T")[0];
      const existing = dailyMap.get(dateKey) || { revenue: 0, orders: 0 };
      dailyMap.set(dateKey, {
        revenue: existing.revenue + o.grandTotal,
        orders: existing.orders + 1,
      });
    });

    const dailyRevenue: DailyRevenuePoint[] = Array.from(dailyMap.entries())
      .map(([date, val]) => ({ date, ...val }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      previousPeriodRevenue,
      previousPeriodOrders,
      revenueChange,
      ordersChange,
      dailyRevenue,
    };
  }

  public getCustomerAnalytics(_dateRange: DateRange): CustomerAnalytics {
    void _dateRange;
    const customers = this.getCustomers();
    const totalCustomers = customers.length;

    const newCustomers = customers.filter((c) => c.segment === "new").length;
    const returningCustomers = customers.filter((c) => c.segment === "repeat").length;
    const highValueCustomers = customers.filter((c) => c.segment === "high_value").length;
    const inactiveCustomers = customers.filter((c) => c.segment === "inactive").length;

    const customerAcquisitionRate =
      totalCustomers > 0 ? Math.round((newCustomers / totalCustomers) * 100) : 0;
    const retentionRate =
      totalCustomers > 0
        ? Math.round(((returningCustomers + highValueCustomers) / totalCustomers) * 100)
        : 0;

    const segmentDistribution: SegmentDistributionItem[] = [
      {
        segment: "high_value",
        label: "VIP High-Value",
        count: highValueCustomers,
        percentage: totalCustomers > 0 ? Math.round((highValueCustomers / totalCustomers) * 100) : 0,
      },
      {
        segment: "repeat",
        label: "Repeat Shoppers",
        count: returningCustomers,
        percentage: totalCustomers > 0 ? Math.round((returningCustomers / totalCustomers) * 100) : 0,
      },
      {
        segment: "new",
        label: "New Registrations",
        count: newCustomers,
        percentage: totalCustomers > 0 ? Math.round((newCustomers / totalCustomers) * 100) : 0,
      },
      {
        segment: "inactive",
        label: "Inactive Churn Risk",
        count: inactiveCustomers,
        percentage: totalCustomers > 0 ? Math.round((inactiveCustomers / totalCustomers) * 100) : 0,
      },
    ];

    const topCustomers: TopCustomerItem[] = [...customers]
      .sort((a, b) => b.totalSpend - a.totalSpend)
      .slice(0, 5)
      .map((c) => ({
        id: c.id,
        name: c.name,
        spend: c.totalSpend,
        orders: c.totalOrders,
        aov: c.averageOrderValue,
        city: c.city || "Dhaka",
      }));

    return {
      totalCustomers,
      newCustomers,
      returningCustomers,
      highValueCustomers,
      customerAcquisitionRate,
      retentionRate,
      segmentDistribution,
      topCustomers,
    };
  }

  public getProductAnalytics(_dateRange: DateRange): ProductAnalytics {
    void _dateRange;
    const products = this.getProducts();
    const orders = this.getOrders();

    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.status === "active").length;

    // Calculate sales per product from order line items
    const salesMap = new Map<string, { name: string; sku: string; sales: number; revenue: number; category: string }>();

    orders.forEach((ord) => {
      if (ord.orderStatus === "cancelled") return;
      ord.items.forEach((item) => {
        const existing = salesMap.get(item.productId) || {
          name: item.title,
          sku: item.sku,
          sales: 0,
          revenue: 0,
          category: "Catalog",
        };
        salesMap.set(item.productId, {
          ...existing,
          sales: existing.sales + item.quantity,
          revenue: existing.revenue + item.total,
        });
      });
    });

    const topSellingProducts: TopProductItem[] = Array.from(salesMap.entries())
      .map(([id, val]) => ({ id, ...val }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const lowStockProducts: LowStockItem[] = products
      .filter((p) => p.stock <= (p.lowStockThreshold || 10))
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        name: p.title,
        sku: p.sku,
        stock: p.stock,
        threshold: p.lowStockThreshold || 10,
      }));

    // Group products by category
    const categoryMap = new Map<string, { count: number; revenue: number }>();
    products.forEach((p) => {
      const cat = p.category || "Uncategorized";
      const existing = categoryMap.get(cat) || { count: 0, revenue: 0 };
      categoryMap.set(cat, {
        count: existing.count + 1,
        revenue: existing.revenue + (salesMap.get(p.id)?.revenue || 0),
      });
    });

    const categoryPerformance: CategoryPerformanceItem[] = Array.from(categoryMap.entries())
      .map(([category, val]) => ({ category, products: val.count, revenue: val.revenue }))
      .sort((a, b) => b.revenue - a.revenue);

    return {
      totalProducts,
      activeProducts,
      topSellingProducts,
      lowStockProducts,
      categoryPerformance,
    };
  }

  public async getMarketingAnalytics(_dateRange: DateRange): Promise<MarketingAnalytics> {
    void _dateRange;
    const coupons = await mockMarketingService.getCoupons();
    const discounts = await mockMarketingService.getDiscounts();
    const flashSales = await mockMarketingService.getFlashSales();

    const activeCoupons = coupons.filter((c) => c.status === "active").length;
    const activeDiscounts = discounts.filter((d) => d.status === "active").length;
    const activeFlashSales = flashSales.filter((f) => f.status === "active").length;
    const activeCampaigns = activeCoupons + activeDiscounts + activeFlashSales;

    const totalCouponsRedeemed = coupons.reduce((sum, c) => sum + c.usedCount, 0);
    const discountExpenditure = coupons.reduce((sum, c) => sum + c.usedCount * 150, 0); // simulated voucher savings
    const attributedRevenue = coupons.reduce((sum, c) => sum + c.usedCount * 1250, 0);

    const campaignPerformance: CampaignPerformanceItem[] = [
      ...coupons.map((c) => ({
        name: `Coupon: ${c.code}`,
        type: "Coupon Code",
        revenue: c.usedCount * 1250,
        redemptions: c.usedCount,
      })),
      ...discounts.map((d) => ({
        name: d.name,
        type: "Automatic Discount",
        revenue: d.revenueAttributed || 0,
        redemptions: d.ordersCount || 0,
      })),
    ].sort((a, b) => b.revenue - a.revenue);

    return {
      activeCampaigns,
      totalCouponsRedeemed,
      attributedRevenue,
      discountExpenditure,
      campaignPerformance,
    };
  }

  public async getAnalyticsOverview(dateRange: DateRange): Promise<AnalyticsOverview> {
    const sales = this.getSalesAnalytics(dateRange);
    const customers = this.getCustomerAnalytics(dateRange);
    const products = this.getProductAnalytics(dateRange);
    const marketing = await this.getMarketingAnalytics(dateRange);

    return {
      sales,
      customers,
      products,
      marketing,
    };
  }

  public async exportReport(tab: string, dateRange: DateRange): Promise<ExportableReport> {
    switch (tab) {
      case "sales": {
        const sales = this.getSalesAnalytics(dateRange);
        return {
          title: `CartX_Sales_Analytics_${dateRange.from}_to_${dateRange.to}`,
          headers: ["Date", "Revenue (BDT)", "Orders Count"],
          rows: sales.dailyRevenue.map((d) => [d.date, d.revenue, d.orders]),
        };
      }
      case "customers": {
        const cust = this.getCustomerAnalytics(dateRange);
        return {
          title: `CartX_Customer_Performance_${dateRange.from}_to_${dateRange.to}`,
          headers: ["Customer ID", "Customer Name", "Total Spend (BDT)", "Total Orders", "AOV (BDT)", "District"],
          rows: cust.topCustomers.map((c) => [c.id, c.name, c.spend, c.orders, c.aov, c.city]),
        };
      }
      case "products": {
        const prod = this.getProductAnalytics(dateRange);
        return {
          title: `CartX_Product_Performance_${dateRange.from}_to_${dateRange.to}`,
          headers: ["SKU", "Product Title", "Units Sold", "Attributed Revenue (BDT)"],
          rows: prod.topSellingProducts.map((p) => [p.sku, p.name, p.sales, p.revenue]),
        };
      }
      case "marketing": {
        const mkt = await this.getMarketingAnalytics(dateRange);
        return {
          title: `CartX_Marketing_Performance_${dateRange.from}_to_${dateRange.to}`,
          headers: ["Campaign Name", "Campaign Type", "Redemptions", "Attributed Revenue (BDT)"],
          rows: mkt.campaignPerformance.map((c) => [c.name, c.type, c.redemptions, c.revenue]),
        };
      }
      default:
        throw new Error(`Unsupported analytics tab: ${tab}`);
    }
  }

  public generateCSV(report: ExportableReport): string {
    const headerRow = report.headers.map((h) => escapeCsvField(h)).join(",");
    const bodyRows = report.rows
      .map((row) => row.map((cell) => escapeCsvField(cell)).join(","))
      .join("\r\n");

    // Prepend UTF-8 BOM (\uFEFF) for Bengali compatibility
    return `\uFEFF${headerRow}\r\n${bodyRows}`;
  }
}

export const mockAnalyticsService = new MockAnalyticsService();
