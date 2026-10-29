import { apiClient } from "@/lib/api/client";
import type { StoreSettings } from "./types";

/**
 * Fetches active store profile and operational configuration.
 * Route: GET /stores/current
 */
export async function getCurrentStore(): Promise<StoreSettings> {
  const response = await apiClient.get<StoreSettings>("/stores/current");
  return response.data;
}

/**
 * Updates store profile, address, contact, and locale configurations.
 * Route: PUT /stores/current
 */
export async function updateCurrentStore(
  data: Partial<StoreSettings>
): Promise<StoreSettings> {
  const response = await apiClient.put<StoreSettings>("/stores/current", data);
  return response.data;
}

