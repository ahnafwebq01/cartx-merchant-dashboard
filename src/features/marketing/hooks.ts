import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockMarketingService } from "./services/mockMarketing";
import type {
  AnalyticsDatePreset,
  ReportFilterParams,
} from "./types";
import type {
  CouponFormValues,
  PromotionalDiscountFormValues,
  FlashSaleFormValues,
} from "./schemas";
import { toast } from "sonner";

export const MARKETING_QUERY_KEYS = {
  overview: ["marketing", "overview"] as const,
  coupons: ["marketing", "coupons"] as const,
  coupon: (id: string) => ["marketing", "coupon", id] as const,
  discounts: ["marketing", "discounts"] as const,
  discount: (id: string) => ["marketing", "discount", id] as const,
  flashSales: ["marketing", "flash-sales"] as const,
  flashSale: (id: string) => ["marketing", "flash-sale", id] as const,
  analytics: (preset: string) => ["marketing", "analytics", preset] as const,
  reports: (tab: string, search?: string) => ["marketing", "reports", tab, search] as const,
};

// --- Marketing Overview ---

export function useMarketingOverviewQuery() {
  return useQuery({
    queryKey: MARKETING_QUERY_KEYS.overview,
    queryFn: () => mockMarketingService.getMarketingOverview(),
    staleTime: 1000 * 30,
  });
}

// --- Coupons ---

export function useCouponsQuery(params?: { search?: string; status?: string; type?: string }) {
  return useQuery({
    queryKey: [...MARKETING_QUERY_KEYS.coupons, params],
    queryFn: () => mockMarketingService.getCoupons(params),
  });
}

export function useCouponQuery(id: string) {
  return useQuery({
    queryKey: MARKETING_QUERY_KEYS.coupon(id),
    queryFn: () => {
      const coupon = mockMarketingService.getCouponById(id);
      if (!coupon) throw new Error(`Coupon with ID "${id}" not found.`);
      return coupon;
    },
    enabled: Boolean(id),
  });
}

export function useCreateCouponMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CouponFormValues) =>
      Promise.resolve(mockMarketingService.createCoupon(data)),
    onSuccess: (newCoupon) => {
      queryClient.invalidateQueries({ queryKey: MARKETING_QUERY_KEYS.coupons });
      queryClient.invalidateQueries({ queryKey: MARKETING_QUERY_KEYS.overview });
      toast.success(`Coupon ${newCoupon.code} created successfully.`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create coupon.");
    },
  });
}

export function useUpdateCouponMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CouponFormValues> }) =>
      Promise.resolve(mockMarketingService.updateCoupon(id, data)),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: MARKETING_QUERY_KEYS.coupons });
      queryClient.invalidateQueries({ queryKey: MARKETING_QUERY_KEYS.coupon(updated.id) });
      queryClient.invalidateQueries({ queryKey: MARKETING_QUERY_KEYS.overview });
      toast.success(`Coupon ${updated.code} updated successfully.`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update coupon.");
    },
  });
}

export function useDeleteCouponMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      mockMarketingService.deleteCoupon(id);
      return Promise.resolve(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MARKETING_QUERY_KEYS.coupons });
      queryClient.invalidateQueries({ queryKey: MARKETING_QUERY_KEYS.overview });
      toast.success("Coupon removed from catalog.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete coupon.");
    },
  });
}

export function useToggleCouponStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "active" | "inactive" | "expired" }) =>
      Promise.resolve(mockMarketingService.toggleCouponStatus(id, status)),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: MARKETING_QUERY_KEYS.coupons });
      queryClient.invalidateQueries({ queryKey: MARKETING_QUERY_KEYS.coupon(updated.id) });
      queryClient.invalidateQueries({ queryKey: MARKETING_QUERY_KEYS.overview });
      toast.success(`Coupon ${updated.code} set to ${updated.status}.`);
    },
  });
}

// --- Discounts ---

export function useDiscountsQuery(params?: { search?: string; status?: string; scope?: string }) {
  return useQuery({
    queryKey: [...MARKETING_QUERY_KEYS.discounts, params],
    queryFn: () => mockMarketingService.getDiscounts(params),
  });
}

export function useCreateDiscountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PromotionalDiscountFormValues) =>
      Promise.resolve(mockMarketingService.createDiscount(data)),
    onSuccess: (newDiscount) => {
      queryClient.invalidateQueries({ queryKey: MARKETING_QUERY_KEYS.discounts });
      queryClient.invalidateQueries({ queryKey: MARKETING_QUERY_KEYS.overview });
      toast.success(`Campaign "${newDiscount.name}" created successfully.`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create promotional campaign.");
    },
  });
}

export function useUpdateDiscountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PromotionalDiscountFormValues> }) =>
      Promise.resolve(mockMarketingService.updateDiscount(id, data)),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: MARKETING_QUERY_KEYS.discounts });
      queryClient.invalidateQueries({ queryKey: MARKETING_QUERY_KEYS.overview });
      toast.success(`Campaign "${updated.name}" updated successfully.`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update discount campaign.");
    },
  });
}

export function useDeleteDiscountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      mockMarketingService.deleteDiscount(id);
      return Promise.resolve(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MARKETING_QUERY_KEYS.discounts });
      queryClient.invalidateQueries({ queryKey: MARKETING_QUERY_KEYS.overview });
      toast.success("Discount campaign removed.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete campaign.");
    },
  });
}

// --- Flash Sales ---

export function useFlashSalesQuery(params?: { search?: string; status?: string }) {
  return useQuery({
    queryKey: [...MARKETING_QUERY_KEYS.flashSales, params],
    queryFn: () => mockMarketingService.getFlashSales(params),
  });
}

export function useCreateFlashSaleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      data: FlashSaleFormValues & {
        productTitle: string;
        productSku: string;
        productImage?: string;
        availableStock: number;
      }
    ) => Promise.resolve(mockMarketingService.createFlashSale(data)),
    onSuccess: (newSale) => {
      queryClient.invalidateQueries({ queryKey: MARKETING_QUERY_KEYS.flashSales });
      queryClient.invalidateQueries({ queryKey: MARKETING_QUERY_KEYS.overview });
      toast.success(`Flash sale "${newSale.title}" configured successfully.`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create flash sale.");
    },
  });
}

export function useDeleteFlashSaleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      mockMarketingService.deleteFlashSale(id);
      return Promise.resolve(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MARKETING_QUERY_KEYS.flashSales });
      queryClient.invalidateQueries({ queryKey: MARKETING_QUERY_KEYS.overview });
      toast.success("Flash sale campaign removed.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete flash sale.");
    },
  });
}

// --- Marketing Analytics ---

export function useMarketingAnalyticsQuery(preset: AnalyticsDatePreset = "30d") {
  return useQuery({
    queryKey: MARKETING_QUERY_KEYS.analytics(preset),
    queryFn: () => mockMarketingService.getMarketingAnalytics(preset),
  });
}

// --- Reports ---

export function useProductPerformanceReportQuery(params?: ReportFilterParams) {
  return useQuery({
    queryKey: MARKETING_QUERY_KEYS.reports("products", params?.search),
    queryFn: () => mockMarketingService.getProductPerformanceReport(params),
  });
}

export function useCampaignPerformanceReportQuery(params?: ReportFilterParams) {
  return useQuery({
    queryKey: MARKETING_QUERY_KEYS.reports("campaigns", params?.search),
    queryFn: () => mockMarketingService.getCampaignPerformanceReport(params),
  });
}

export function useCouponUsageReportQuery(params?: ReportFilterParams) {
  return useQuery({
    queryKey: MARKETING_QUERY_KEYS.reports("coupons", params?.search),
    queryFn: () => mockMarketingService.getCouponUsageReport(params),
  });
}

export function useDiscountPerformanceReportQuery(params?: ReportFilterParams) {
  return useQuery({
    queryKey: MARKETING_QUERY_KEYS.reports("discounts", params?.search),
    queryFn: () => mockMarketingService.getDiscountPerformanceReport(params),
  });
}

// --- Reset Demo Data ---

export function useResetMarketingDemoDataMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => {
      mockMarketingService.resetDemoData();
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketing"] });
      toast.success("Marketing demo data restored to baseline presets.");
    },
  });
}
