import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockMobileAppService } from "./services/mockMobileApp";
import type {
  MobileAppBrandingFormValues,
  MobileAppContentFormValues,
  MobileAppSettingsFormValues,
} from "./schemas";
import { toast } from "sonner";

export const MOBILE_APP_QUERY_KEYS = {
  config: ["mobile-app", "config"] as const,
  stats: ["mobile-app", "stats"] as const,
};

export function useMobileAppConfigQuery() {
  return useQuery({
    queryKey: MOBILE_APP_QUERY_KEYS.config,
    queryFn: () => mockMobileAppService.getConfig(),
  });
}

export function useMobileAppStatsQuery() {
  return useQuery({
    queryKey: MOBILE_APP_QUERY_KEYS.stats,
    queryFn: () => mockMobileAppService.getStats(),
  });
}

export function useUpdateBrandingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: MobileAppBrandingFormValues) =>
      mockMobileAppService.updateBranding(values),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["mobile-app"] });
      toast.success(`Branding updated for ${updated.displayName} (Demo Mode)`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update app branding.");
    },
  });
}

export function useUpdateContentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: MobileAppContentFormValues) =>
      mockMobileAppService.updateContent(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mobile-app"] });
      toast.success("Homepage & Navigation layout saved (Demo Mode)");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update content layout.");
    },
  });
}

export function useUpdateSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: MobileAppSettingsFormValues) =>
      mockMobileAppService.updateSettings(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mobile-app"] });
      toast.success("Mobile app settings saved (Demo Mode)");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update app settings.");
    },
  });
}

export function useResetMobileAppMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      mockMobileAppService.resetToDefaults();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mobile-app"] });
      toast.success("Mobile app configuration reset to defaults (Demo Mode)");
    },
  });
}

