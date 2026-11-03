export type DatePreset = "today" | "7d" | "30d" | "90d" | "custom";
export type AnalyticsTab = "sales" | "customers" | "products" | "marketing";

export interface DateRange {
  from: string;
  to: string;
  preset: DatePreset;
}

export interface DailyRevenuePoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface SalesAnalytics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  previousPeriodRevenue: number;
  previousPeriodOrders: number;
  revenueChange: number;
  ordersChange: number;
  dailyRevenue: DailyRevenuePoint[];
}

export interface SegmentDistributionItem {
  segment: string;
  label: string;
  count: number;
  percentage: number;
}

export interface TopCustomerItem {
  id: string;
  name: string;
  spend: number;
  orders: number;
  aov: number;
  city: string;
}

export interface CustomerAnalytics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  highValueCustomers: number;
  customerAcquisitionRate: number;
  retentionRate: number;
  segmentDistribution: SegmentDistributionItem[];
  topCustomers: TopCustomerItem[];
}

export interface TopProductItem {
  id: string;
  name: string;
  sku: string;
  sales: number;
  revenue: number;
  category: string;
}

export interface LowStockItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  threshold: number;
}

export interface CategoryPerformanceItem {
  category: string;
  products: number;
  revenue: number;
}

export interface ProductAnalytics {
  totalProducts: number;
  activeProducts: number;
  topSellingProducts: TopProductItem[];
  lowStockProducts: LowStockItem[];
  categoryPerformance: CategoryPerformanceItem[];
}

export interface CampaignPerformanceItem {
  name: string;
  type: string;
  revenue: number;
  redemptions: number;
}

export interface MarketingAnalytics {
  activeCampaigns: number;
  totalCouponsRedeemed: number;
  attributedRevenue: number;
  discountExpenditure: number;
  campaignPerformance: CampaignPerformanceItem[];
}

export interface AnalyticsOverview {
  sales: SalesAnalytics;
  customers: CustomerAnalytics;
  products: ProductAnalytics;
  marketing: MarketingAnalytics;
}

export interface ExportableReport {
  title: string;
  headers: string[];
  rows: (string | number)[][];
}

