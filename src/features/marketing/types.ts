export type CouponDiscountType = "percentage" | "fixed";

export type CouponCustomerEligibility = "all" | "first_time" | "vip" | "returning";

export type CouponStatus = "active" | "inactive" | "expired";

export interface Coupon {
  id: string;
  code: string;
  campaignName: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountCap?: number | null;
  usageLimit?: number | null;
  perCustomerLimit?: number | null;
  usedCount: number;
  startDate: string;
  endDate: string;
  applicableProducts?: string[];
  applicableCategories?: string[];
  customerEligibility: CouponCustomerEligibility;
  status: CouponStatus;
  totalDiscountGiven: number;
  createdAt: string;
  updatedAt: string;
}

export type DiscountScope = "storewide" | "category" | "product";

export type CampaignStatus = "draft" | "scheduled" | "active" | "ended";

export interface PromotionalDiscount {
  id: string;
  name: string;
  description?: string;
  discountType: CouponDiscountType;
  discountValue: number;
  scope: DiscountScope;
  targetCategories?: string[];
  targetProducts?: string[];
  minOrderAmount?: number;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  ordersCount: number;
  revenueAttributed: number;
  totalDiscountGiven: number;
  createdAt: string;
  updatedAt: string;
}

export interface FlashSale {
  id: string;
  title: string;
  description?: string;
  productId: string;
  productTitle: string;
  productSku: string;
  productImage?: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  allocatedStock: number;
  claimedStock: number;
  perCustomerLimit: number;
  startTime: string;
  endTime: string;
  status: CampaignStatus;
  revenue: number;
  createdAt: string;
  updatedAt: string;
}

export interface MarketingActivity {
  id: string;
  type:
    | "coupon_created"
    | "coupon_redeemed"
    | "discount_activated"
    | "flash_sale_started"
    | "flash_sale_ended";
  title: string;
  description: string;
  timestamp: string;
  actor: string;
}

export interface MarketingOverviewKPIs {
  totalActiveCampaigns: number;
  activeCouponCount: number;
  totalDiscountAmount: number;
  totalAttributedRevenue: number;
  overallConversionRate: number;
  totalCouponRedemptions: number;
  recentActivities: MarketingActivity[];
}

export interface MarketingTimelinePoint {
  date: string;
  label: string;
  revenue: number;
  discounts: number;
  redemptions: number;
}

export interface TopCampaignMetric {
  id: string;
  name: string;
  type: "coupon" | "discount" | "flash_sale";
  orders: number;
  revenue: number;
  discountGiven: number;
  conversionRate: number;
}

export interface TopCouponMetric {
  id: string;
  code: string;
  campaignName: string;
  discountDisplay: string;
  usedCount: number;
  totalSavings: number;
  revenueAttributed: number;
}

export type AnalyticsDatePreset = "today" | "7d" | "30d" | "90d" | "custom";

export interface MarketingAnalyticsData {
  preset: AnalyticsDatePreset;
  startDate: string;
  endDate: string;
  revenueGenerated: number;
  couponRedemptionRate: number;
  totalCouponUsage: number;
  discountExpenditure: number;
  campaignConversionRate: number;
  timeline: MarketingTimelinePoint[];
  topCampaigns: TopCampaignMetric[];
  topCoupons: TopCouponMetric[];
}

export interface ProductPerformanceReportItem {
  id: string;
  title: string;
  sku: string;
  category: string;
  unitsSold: number;
  grossRevenue: number;
  discountAmount: number;
  netRevenue: number;
  campaignAttributedOrders: number;
}

export interface CampaignPerformanceReportItem {
  id: string;
  name: string;
  type: "Coupon" | "Discount" | "Flash Sale";
  status: string;
  startDate: string;
  endDate: string;
  orders: number;
  revenue: number;
  discountGiven: number;
  averageOrderValue: number;
}

export interface CouponUsageReportItem {
  id: string;
  code: string;
  campaignName: string;
  discountType: string;
  discountValue: string;
  redemptions: number;
  totalDiscountGiven: number;
  averageOrderValue: number;
  lastUsedDate: string;
}

export interface DiscountPerformanceReportItem {
  id: string;
  name: string;
  scope: string;
  discountValue: string;
  status: string;
  ordersCount: number;
  totalSavings: number;
  revenueGenerated: number;
}

export interface ReportFilterParams {
  tab: "products" | "campaigns" | "coupons" | "discounts";
  search?: string;
  datePreset?: AnalyticsDatePreset;
  startDate?: string;
  endDate?: string;
}

