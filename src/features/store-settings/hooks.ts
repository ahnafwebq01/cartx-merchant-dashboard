"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentStore, updateCurrentStore } from "./api";
import type { StoreSettings } from "./types";

export const STORE_SETTINGS_KEY = ["stores", "current"];

export function useCurrentStore() {
  return useQuery({
    queryKey: STORE_SETTINGS_KEY,
    queryFn: getCurrentStore,
    staleTime: 60 * 1000,
    retry: 1,
  });
}

export function useUpdateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<StoreSettings>) => updateCurrentStore(data),
    onSuccess: (updatedStore) => {
      queryClient.setQueryData(STORE_SETTINGS_KEY, updatedStore);
      queryClient.invalidateQueries({ queryKey: STORE_SETTINGS_KEY });
    },
  });
}

