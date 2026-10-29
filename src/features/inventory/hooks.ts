import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockProductService } from "../products/services/mockProducts";
import type { StockAdjustment } from "./types";
import { PRODUCT_QUERY_KEYS } from "../products/hooks";
import { toast } from "sonner";

export const INVENTORY_QUERY_KEYS = {
  all: ["inventory"] as const,
  stats: ["inventory", "stats"] as const,
  items: ["inventory", "items"] as const,
  movements: ["inventory", "movements"] as const,
};

export function useInventoryStatsQuery() {
  return useQuery({
    queryKey: INVENTORY_QUERY_KEYS.stats,
    queryFn: () => mockProductService.getInventoryStats(),
  });
}

export function useInventoryItemsQuery() {
  return useQuery({
    queryKey: INVENTORY_QUERY_KEYS.items,
    queryFn: () => mockProductService.getInventoryItems(),
  });
}

export function useInventoryMovementsQuery() {
  return useQuery({
    queryKey: INVENTORY_QUERY_KEYS.movements,
    queryFn: () => mockProductService.getInventoryMovements(),
  });
}

export function useStockAdjustmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (adjustment: StockAdjustment) =>
      Promise.resolve(mockProductService.adjustStock(adjustment)),
    onSuccess: (movement) => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });

      const sign = movement.quantityChange > 0 ? `+${movement.quantityChange}` : `${movement.quantityChange}`;
      toast.success("Stock adjusted successfully", {
        description: `${movement.productName}: ${sign} units (${movement.beforeQuantity} → ${movement.afterQuantity}).`,
      });
    },
    onError: (err: Error) => {
      toast.error("Failed to adjust stock", {
        description: err.message,
      });
    },
  });
}
