import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockPaymentService } from "./services/mockPayments";
import type { PaymentFilterParams, RefundStatus } from "./types";
import type {
  InitiatePaymentInput,
  VerifyPaymentInput,
  RequestRefundInput,
  ConfigurePaymentMethodInput,
} from "./schemas";
import { toast } from "sonner";
import { ORDERS_QUERY_KEY } from "../orders/hooks";

export const PAYMENTS_QUERY_KEY = ["payments"] as const;
export const PAYMENT_KPIS_QUERY_KEY = ["payments", "kpis"] as const;
export const PAYMENT_METHODS_QUERY_KEY = ["payments", "methods"] as const;
export const REFUNDS_QUERY_KEY = ["payments", "refunds"] as const;

export function usePaymentTransactionsQuery(params: PaymentFilterParams = {}) {
  return useQuery({
    queryKey: [...PAYMENTS_QUERY_KEY, params],
    queryFn: () => mockPaymentService.getTransactions(params),
  });
}

export function usePaymentTransactionQuery(id: string) {
  return useQuery({
    queryKey: [...PAYMENTS_QUERY_KEY, "detail", id],
    queryFn: () => mockPaymentService.getTransactionById(id),
    enabled: Boolean(id),
  });
}

export function usePaymentKPIsQuery() {
  return useQuery({
    queryKey: PAYMENT_KPIS_QUERY_KEY,
    queryFn: () => mockPaymentService.getPaymentKPIs(),
  });
}

export function usePaymentMethodsQuery() {
  return useQuery({
    queryKey: PAYMENT_METHODS_QUERY_KEY,
    queryFn: () => mockPaymentService.getPaymentMethods(),
  });
}

export function useUpdatePaymentMethodMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ConfigurePaymentMethodInput) =>
      Promise.resolve(mockPaymentService.updatePaymentMethod(input)),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_METHODS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PAYMENT_KPIS_QUERY_KEY });
      toast.success(`${updated.name} settings updated successfully.`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update payment method.");
    },
  });
}

export function useInitiatePaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: InitiatePaymentInput) =>
      mockPaymentService.initiatePayment(input),
    onSuccess: (tx) => {
      queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PAYMENT_KPIS_QUERY_KEY });
      toast.success(`Payment session initialized for ${tx.orderNumber}.`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to initiate payment.");
    },
  });
}

export function useVerifyPaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: VerifyPaymentInput) =>
      mockPaymentService.verifyPayment(input),
    onSuccess: (tx) => {
      queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PAYMENT_KPIS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      toast.success(
        `Payment verified: ${tx.provider.toUpperCase()} TrxID ${tx.gatewayTransactionId || tx.id}`
      );
    },
    onError: (err: Error) => {
      toast.error(err.message || "Payment verification failed.");
    },
  });
}

export function useRefundsQuery(params: {
  search?: string;
  status?: RefundStatus | "all";
  page?: number;
  limit?: number;
} = {}) {
  return useQuery({
    queryKey: [...REFUNDS_QUERY_KEY, params],
    queryFn: () => mockPaymentService.getRefunds(params),
  });
}

export function useRequestRefundMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RequestRefundInput) =>
      mockPaymentService.requestRefund(input),
    onSuccess: (refund) => {
      queryClient.invalidateQueries({ queryKey: REFUNDS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PAYMENT_KPIS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      toast.success(`Refund of ৳${refund.amount} processed for ${refund.orderNumber}.`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to process refund.");
    },
  });
}

export function useResetDemoPaymentsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => Promise.resolve(mockPaymentService.resetDemoPayments()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PAYMENT_KPIS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PAYMENT_METHODS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: REFUNDS_QUERY_KEY });
      toast.info("Payments demo data restored to default baseline.");
    },
  });
}

