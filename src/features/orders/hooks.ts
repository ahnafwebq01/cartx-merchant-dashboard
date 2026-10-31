import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockOrderService } from "./services/mockOrders";
import type {
  OrderFilterParams,
  OrderStatus,
  PaymentStatus,
} from "./types";
import { toast } from "sonner";
import { CUSTOMERS_QUERY_KEY } from "../customers/hooks";

export const ORDERS_QUERY_KEY = ["orders"] as const;
export const ORDER_STATS_KEY = ["orders", "stats"] as const;

export function useOrdersQuery(params: OrderFilterParams = {}) {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, params],
    queryFn: () => mockOrderService.getOrders(params),
  });
}

export function useOrderQuery(id: string) {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, id],
    queryFn: () => mockOrderService.getOrderById(id),
    enabled: Boolean(id),
  });
}

export function useOrderStatsQuery() {
  return useQuery({
    queryKey: ORDER_STATS_KEY,
    queryFn: () => mockOrderService.getOrderStats(),
  });
}

export function useTransitionOrderStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      status,
      actor,
      note,
    }: {
      orderId: string;
      status: OrderStatus;
      actor?: string;
      note?: string;
    }) =>
      Promise.resolve(
        mockOrderService.transitionOrderStatus(orderId, status, actor, note)
      ),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success(
        `Order ${updated.orderNumber} status changed to ${updated.orderStatus.replace(/_/g, " ")}.`
      );
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update order status.");
    },
  });
}

export function useCancelOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      reason,
      actor,
      restockInventory = true,
    }: {
      orderId: string;
      reason: string;
      actor?: string;
      restockInventory?: boolean;
    }) =>
      Promise.resolve(
        mockOrderService.cancelOrder(orderId, reason, actor, restockInventory)
      ),
    onSuccess: (cancelled) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(`Order ${cancelled.orderNumber} has been cancelled.`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to cancel order.");
    },
  });
}

export function useReturnOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      reason,
      actor,
      restockInventory = true,
      refundAmount,
    }: {
      orderId: string;
      reason: string;
      actor?: string;
      restockInventory?: boolean;
      refundAmount?: number;
    }) =>
      Promise.resolve(
        mockOrderService.returnOrder(
          orderId,
          reason,
          actor,
          restockInventory,
          refundAmount
        )
      ),
    onSuccess: (returned) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(`Return recorded for order ${returned.orderNumber}.`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to process return.");
    },
  });
}

export function useMarkPaymentStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      paymentStatus,
      paymentReference,
      amountPaid,
      actor,
    }: {
      orderId: string;
      paymentStatus: PaymentStatus;
      paymentReference?: string;
      amountPaid?: number;
      actor?: string;
    }) =>
      Promise.resolve(
        mockOrderService.markPaymentStatus(
          orderId,
          paymentStatus,
          paymentReference,
          amountPaid,
          actor
        )
      ),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      toast.success(
        `Payment marked as "${updated.paymentStatus}" for ${updated.orderNumber}.`
      );
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update payment status.");
    },
  });
}

export function useAddOrderNoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      note,
      actor,
    }: {
      orderId: string;
      note: string;
      actor?: string;
    }) => Promise.resolve(mockOrderService.addOrderNote(orderId, note, actor)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      toast.success("Note added to order.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to add note.");
    },
  });
}

export function useBulkUpdateStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderIds,
      status,
      actor,
    }: {
      orderIds: string[];
      status: OrderStatus;
      actor?: string;
    }) => Promise.resolve(mockOrderService.bulkUpdateStatus(orderIds, status, actor)),
    onSuccess: ({ updatedCount, skippedCount }) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success(
        `Updated ${updatedCount} orders.${
          skippedCount > 0 ? ` Skipped ${skippedCount} ineligible orders.` : ""
        }`
      );
    },
  });
}

export function useBulkCancelOrdersMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderIds,
      reason,
      actor,
    }: {
      orderIds: string[];
      reason: string;
      actor?: string;
    }) => Promise.resolve(mockOrderService.bulkCancelOrders(orderIds, reason, actor)),
    onSuccess: ({ cancelledCount, skippedCount }) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(
        `Cancelled ${cancelledCount} orders.${
          skippedCount > 0 ? ` Skipped ${skippedCount} orders.` : ""
        }`
      );
    },
  });
}

export function useResetDemoOrdersMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => Promise.resolve(mockOrderService.resetDemoOrders()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      toast.info("Order demo data restored to 15 baseline records.");
    },
  });
}

