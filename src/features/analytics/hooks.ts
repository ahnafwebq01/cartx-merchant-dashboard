import { useQuery } from "@tanstack/react-query";
import { mockAnalyticsService } from "./services/mockAnalytics";
import type { DateRange } from "./types";

export const ANALYTICS_QUERY_KEYS = {
  all: ["analytics"] as const,
  sales: (range: DateRange) => ["analytics", "sales", range] as const,
  customers: (range: DateRange) => ["analytics", "customers", range] as const,
  products: (range: DateRange) => ["analytics", "products", range] as const,
  marketing: (range: DateRange) => ["analytics", "marketing", range] as const,
  overview: (range: DateRange) => ["analytics", "overview", range] as const,
};

export function useSalesAnalyticsQuery(range: DateRange) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.sales(range),
    queryFn: () => mockAnalyticsService.getSalesAnalytics(range),
  });
}

export function useCustomerAnalyticsQuery(range: DateRange) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.customers(range),
    queryFn: () => mockAnalyticsService.getCustomerAnalytics(range),
  });
}

export function useProductAnalyticsQuery(range: DateRange) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.products(range),
    queryFn: () => mockAnalyticsService.getProductAnalytics(range),
  });
}

export function useMarketingAnalyticsQuery(range: DateRange) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.marketing(range),
    queryFn: () => mockAnalyticsService.getMarketingAnalytics(range),
  });
}

export function useAnalyticsOverviewQuery(range: DateRange) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.overview(range),
    queryFn: () => mockAnalyticsService.getAnalyticsOverview(range),
  });
}

