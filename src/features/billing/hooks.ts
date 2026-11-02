import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockBillingService } from "./services/mockBilling";
import type { SubscriptionPlanId, BillingCycle } from "./types";
import type { BillingSettingsFormValues, PaymentMethodFormValues } from "./schemas";
import { toast } from "sonner";

export const BILLING_QUERY_KEYS = {
  subscription: ["billing", "subscription"] as const,
  usageMetrics: ["billing", "usage-metrics"] as const,
  invoices: (status?: string) => ["billing", "invoices", status] as const,
  invoice: (id: string) => ["billing", "invoice", id] as const,
  settings: ["billing", "settings"] as const,
};

export function useSubscriptionQuery() {
  return useQuery({
    queryKey: BILLING_QUERY_KEYS.subscription,
    queryFn: () => mockBillingService.getSubscription(),
  });
}

export function useUsageMetricsQuery() {
  return useQuery({
    queryKey: BILLING_QUERY_KEYS.usageMetrics,
    queryFn: () => mockBillingService.getUsageMetrics(),
  });
}

export function useInvoicesQuery(status?: string) {
  return useQuery({
    queryKey: BILLING_QUERY_KEYS.invoices(status),
    queryFn: () => mockBillingService.getInvoices(status),
  });
}

export function useInvoiceQuery(id: string) {
  return useQuery({
    queryKey: BILLING_QUERY_KEYS.invoice(id),
    queryFn: () => mockBillingService.getInvoiceById(id),
    enabled: Boolean(id),
  });
}

export function useBillingSettingsQuery() {
  return useQuery({
    queryKey: BILLING_QUERY_KEYS.settings,
    queryFn: () => mockBillingService.getBillingSettings(),
  });
}

export function useUpgradePlanMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ planId, cycle }: { planId: SubscriptionPlanId; cycle: BillingCycle }) =>
      mockBillingService.upgradeSubscription(planId, cycle),
    onSuccess: (sub) => {
      queryClient.invalidateQueries({ queryKey: ["billing"] });
      toast.success(
        `Subscription plan changed to ${sub.planId.toUpperCase()} (${sub.billingCycle})! (Demo Mode: No payment charged)`
      );
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to change subscription plan.");
    },
  });
}

export function usePayInvoiceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invoiceId: string) => mockBillingService.payInvoice(invoiceId),
    onSuccess: (invoice) => {
      queryClient.invalidateQueries({ queryKey: ["billing"] });
      toast.success(`Invoice ${invoice.invoiceNumber} paid successfully! (Demo Mode simulated)`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Payment retry failed.");
    },
  });
}

export function useUpdateBillingSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BillingSettingsFormValues) =>
      mockBillingService.updateBillingSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLING_QUERY_KEYS.settings });
      toast.success("Billing information updated successfully.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update billing settings.");
    },
  });
}

export function useAddPaymentMethodMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PaymentMethodFormValues) =>
      mockBillingService.addPaymentMethod(data),
    onSuccess: (pm) => {
      queryClient.invalidateQueries({ queryKey: BILLING_QUERY_KEYS.settings });
      toast.success(`Added ${pm.label} (${pm.identifier}) (Demo Mode simulated)`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to add payment method.");
    },
  });
}

export function useSetDefaultPaymentMethodMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mockBillingService.setDefaultPaymentMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLING_QUERY_KEYS.settings });
      toast.success("Default payment method updated.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update default payment method.");
    },
  });
}

export function useRemovePaymentMethodMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mockBillingService.removePaymentMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLING_QUERY_KEYS.settings });
      toast.success("Payment method removed.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to remove payment method.");
    },
  });
}
