import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockCustomerService } from "./services/mockCustomers";
import type { CustomerFilterParams } from "./types";
import type { CustomerFormValues } from "./schemas";
import { toast } from "sonner";

export const CUSTOMERS_QUERY_KEY = ["customers"] as const;
export const CUSTOMER_STATS_KEY = ["customers", "stats"] as const;

export function useCustomersQuery(params: CustomerFilterParams = {}) {
  return useQuery({
    queryKey: [...CUSTOMERS_QUERY_KEY, params],
    queryFn: () => mockCustomerService.getCustomers(params),
  });
}

export function useCustomerQuery(id: string) {
  return useQuery({
    queryKey: [...CUSTOMERS_QUERY_KEY, id],
    queryFn: () => mockCustomerService.getCustomerById(id),
    enabled: Boolean(id),
  });
}

export function useCustomerStatsQuery() {
  return useQuery({
    queryKey: CUSTOMER_STATS_KEY,
    queryFn: () => mockCustomerService.getCustomerStats(),
  });
}

export function useCreateCustomerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CustomerFormValues) =>
      Promise.resolve(mockCustomerService.createCustomer(values)),
    onSuccess: (newCustomer) => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      toast.success(`Customer "${newCustomer.name}" added successfully.`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create customer.");
    },
  });
}

export function useUpdateCustomerTagsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, tags }: { id: string; tags: string[] }) =>
      Promise.resolve(mockCustomerService.updateCustomerTags(id, tags)),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      toast.success(`Tags updated for ${updated.name}.`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update tags.");
    },
  });
}

export function useAddCustomerNoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      Promise.resolve(mockCustomerService.addCustomerNote(id, note)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      toast.success("Note added to customer profile.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to add note.");
    },
  });
}

export function useResetDemoCustomersMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => Promise.resolve(mockCustomerService.resetDemoCustomers()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      toast.info("Customer demo data has been reset to baseline.");
    },
  });
}

