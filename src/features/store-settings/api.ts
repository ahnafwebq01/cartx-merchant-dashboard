import { apiClient } from "@/lib/api/client";
import { env } from "@/config/env";
import type { StoreSettings } from "./types";
import { mockStoreSettingsService } from "./services/mockStoreSettings";

function isMixedContentBlocked(): boolean {
  if (typeof window !== "undefined") {
    if (window.location.protocol === "https:" && env.apiBaseUrl.startsWith("http://localhost")) {
      return true;
    }
  }
  return false;
}

/**
 * Fetches active store profile and operational configuration with automatic Demo Mode fallback.
 * Route: GET /stores/current
 */
export async function getCurrentStore(): Promise<StoreSettings> {
  if (isMixedContentBlocked()) {
    return mockStoreSettingsService.getSettings();
  }
  try {
    const response = await apiClient.get<StoreSettings>("/stores/current");
    return response.data;
  } catch {
    return mockStoreSettingsService.getSettings();
  }
}

/**
 * Updates store profile, address, contact, and locale configurations with automatic Demo Mode fallback.
 * Route: PUT /stores/current
 */
export async function updateCurrentStore(
  data: Partial<StoreSettings>
): Promise<StoreSettings> {
  if (isMixedContentBlocked()) {
    return mockStoreSettingsService.updateSettings(data);
  }
  try {
    const response = await apiClient.put<StoreSettings>("/stores/current", data);
    return response.data;
  } catch {
    return mockStoreSettingsService.updateSettings(data);
  }
}
