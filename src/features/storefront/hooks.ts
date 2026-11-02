"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockStorefrontService } from "./services/mockStorefront";
import type {
  PageFilterParams,
  StorefrontStatus,
  ThemeCustomizationSettings,
} from "./types";
import type { StorePageFormValues, CustomDomainFormValues } from "./schemas";
import { toast } from "sonner";

export const STOREFRONT_OVERVIEW_QUERY_KEY = ["storefront", "overview"] as const;
export const THEMES_QUERY_KEY = ["storefront", "themes"] as const;
export const DOMAINS_QUERY_KEY = ["storefront", "domains"] as const;
export const PAGES_QUERY_KEY = ["storefront", "pages"] as const;

export function useStorefrontOverviewQuery() {
  return useQuery({
    queryKey: STOREFRONT_OVERVIEW_QUERY_KEY,
    queryFn: () => mockStorefrontService.getOverview(),
  });
}

export function useUpdateStorefrontStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: StorefrontStatus) =>
      Promise.resolve(mockStorefrontService.updateStatus(status)),
    onSuccess: (status) => {
      queryClient.invalidateQueries({ queryKey: STOREFRONT_OVERVIEW_QUERY_KEY });
      toast.success(`Storefront status updated to ${status.toUpperCase()}`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update storefront status");
    },
  });
}

export function useThemesQuery() {
  return useQuery({
    queryKey: THEMES_QUERY_KEY,
    queryFn: () => mockStorefrontService.getThemes(),
  });
}

export function useActiveThemeQuery() {
  return useQuery({
    queryKey: [...THEMES_QUERY_KEY, "active"],
    queryFn: () => mockStorefrontService.getActiveTheme(),
  });
}

export function useUpdateThemeCustomizationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      themeId,
      settings,
    }: {
      themeId: string;
      settings: ThemeCustomizationSettings;
    }) => Promise.resolve(mockStorefrontService.updateThemeCustomization(themeId, settings)),
    onSuccess: (theme) => {
      queryClient.invalidateQueries({ queryKey: THEMES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: STOREFRONT_OVERVIEW_QUERY_KEY });
      toast.success(`Customization saved for ${theme.name}`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to save theme customizations");
    },
  });
}

export function useActivateThemeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (themeId: string) =>
      Promise.resolve(mockStorefrontService.activateTheme(themeId)),
    onSuccess: (theme) => {
      queryClient.invalidateQueries({ queryKey: THEMES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: STOREFRONT_OVERVIEW_QUERY_KEY });
      toast.success(`${theme.name} is now your active storefront theme`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to activate theme");
    },
  });
}

export function useResetThemeCustomizationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (themeId: string) =>
      Promise.resolve(mockStorefrontService.resetThemeCustomization(themeId)),
    onSuccess: (theme) => {
      queryClient.invalidateQueries({ queryKey: THEMES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: STOREFRONT_OVERVIEW_QUERY_KEY });
      toast.info(`Reset ${theme.name} to default styles`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to reset theme");
    },
  });
}

export function useDomainsQuery() {
  return useQuery({
    queryKey: DOMAINS_QUERY_KEY,
    queryFn: () => mockStorefrontService.getDomains(),
  });
}

export function useAddCustomDomainMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CustomDomainFormValues) =>
      Promise.resolve(mockStorefrontService.addCustomDomain(input)),
    onSuccess: (domain) => {
      queryClient.invalidateQueries({ queryKey: DOMAINS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: STOREFRONT_OVERVIEW_QUERY_KEY });
      toast.success(
        `Added ${domain.domain}. Note: Domain is in demo mode pending backend verification.`
      );
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to configure custom domain");
    },
  });
}

export function useRemoveCustomDomainMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (domainId: string) =>
      Promise.resolve(mockStorefrontService.removeDomain(domainId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOMAINS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: STOREFRONT_OVERVIEW_QUERY_KEY });
      toast.info("Custom domain removed");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to remove domain");
    },
  });
}

export function useVerifyDomainMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (domainId: string) =>
      Promise.resolve(mockStorefrontService.checkDomainVerification(domainId)),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: DOMAINS_QUERY_KEY });
      toast.info(result.message);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Verification check failed");
    },
  });
}

export function usePagesQuery(params: PageFilterParams = {}) {
  return useQuery({
    queryKey: [...PAGES_QUERY_KEY, params],
    queryFn: () => mockStorefrontService.getPages(params),
  });
}

export function usePageQuery(id: string) {
  return useQuery({
    queryKey: [...PAGES_QUERY_KEY, "detail", id],
    queryFn: () => mockStorefrontService.getPageById(id),
    enabled: Boolean(id),
  });
}

export function useCreatePageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: StorePageFormValues) =>
      Promise.resolve(mockStorefrontService.createPage(input)),
    onSuccess: (page) => {
      queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: STOREFRONT_OVERVIEW_QUERY_KEY });
      toast.success(`Created page "${page.title}"`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create page");
    },
  });
}

export function useUpdatePageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Partial<StorePageFormValues>;
    }) => Promise.resolve(mockStorefrontService.updatePage(id, input)),
    onSuccess: (page) => {
      queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: STOREFRONT_OVERVIEW_QUERY_KEY });
      toast.success(`Updated page "${page.title}"`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update page");
    },
  });
}

export function useDeletePageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      Promise.resolve(mockStorefrontService.deletePage(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: STOREFRONT_OVERVIEW_QUERY_KEY });
      toast.info("Page deleted successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete page");
    },
  });
}

export function useResetStorefrontDemoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => Promise.resolve(mockStorefrontService.resetDemoData()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storefront"] });
      toast.success("Storefront demo data reset to default presets");
    },
  });
}

