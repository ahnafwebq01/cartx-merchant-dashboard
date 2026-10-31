import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockShippingService } from "./services/mockShipping";
import type { ShipmentFilterParams } from "./types";
import type {
  CreateShipmentInput,
  CancelShipmentInput,
  ShippingRatesInput,
  ConfigureCourierInput,
} from "./schemas";
import { toast } from "sonner";
import { ORDERS_QUERY_KEY } from "../orders/hooks";

export const SHIPMENTS_QUERY_KEY = ["shipping", "shipments"] as const;
export const SHIPPING_KPIS_QUERY_KEY = ["shipping", "kpis"] as const;
export const COURIERS_QUERY_KEY = ["shipping", "couriers"] as const;
export const SHIPPING_RATES_QUERY_KEY = ["shipping", "rates"] as const;

export function useShipmentsQuery(params: ShipmentFilterParams = {}) {
  return useQuery({
    queryKey: [...SHIPMENTS_QUERY_KEY, params],
    queryFn: () => mockShippingService.getShipments(params),
  });
}

export function useShipmentQuery(id: string) {
  return useQuery({
    queryKey: [...SHIPMENTS_QUERY_KEY, "detail", id],
    queryFn: () => mockShippingService.getShipmentById(id),
    enabled: Boolean(id),
  });
}

export function useShipmentByOrderQuery(orderId: string) {
  return useQuery({
    queryKey: [...SHIPMENTS_QUERY_KEY, "byOrder", orderId],
    queryFn: () => mockShippingService.getShipmentByOrderId(orderId),
    enabled: Boolean(orderId),
  });
}

export function useShippingKPIsQuery() {
  return useQuery({
    queryKey: SHIPPING_KPIS_QUERY_KEY,
    queryFn: () => mockShippingService.getShippingKPIs(),
  });
}

export function useCourierConnectionsQuery() {
  return useQuery({
    queryKey: COURIERS_QUERY_KEY,
    queryFn: () => mockShippingService.getCourierConnections(),
  });
}

export function useUpdateCourierConnectionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ConfigureCourierInput) =>
      Promise.resolve(mockShippingService.updateCourierConnection(input)),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: COURIERS_QUERY_KEY });
      toast.success(`${updated.name} settings saved successfully.`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update courier connection.");
    },
  });
}

export function useShippingRatesQuery() {
  return useQuery({
    queryKey: SHIPPING_RATES_QUERY_KEY,
    queryFn: () => mockShippingService.getShippingRates(),
  });
}

export function useUpdateShippingRatesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ShippingRatesInput) =>
      Promise.resolve(mockShippingService.updateShippingRates(input)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHIPPING_RATES_QUERY_KEY });
      toast.success("Shipping rates and rules updated successfully.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update shipping rates.");
    },
  });
}

export function useCreateShipmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateShipmentInput) =>
      mockShippingService.createShipment(input),
    onSuccess: (shp) => {
      queryClient.invalidateQueries({ queryKey: SHIPMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SHIPPING_KPIS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      toast.success(
        `Consignment ${shp.consignmentId} created via ${shp.courierName}.`
      );
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create consignment.");
    },
  });
}

export function useCancelShipmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CancelShipmentInput) =>
      mockShippingService.cancelShipment(input),
    onSuccess: (shp) => {
      queryClient.invalidateQueries({ queryKey: SHIPMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SHIPPING_KPIS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      toast.success(`Consignment ${shp.consignmentId} has been cancelled.`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to cancel shipment.");
    },
  });
}

export function useResetDemoShippingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => Promise.resolve(mockShippingService.resetDemoShipping()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHIPMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SHIPPING_KPIS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: COURIERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SHIPPING_RATES_QUERY_KEY });
      toast.info("Shipping demo data restored to default baseline.");
    },
  });
}

