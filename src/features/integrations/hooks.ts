import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockIntegrationsService } from "./services/mockIntegrations";
import type { WebhookEndpointFormValues, IntegrationConfigValues } from "./schemas";
import type { WebhookEvent } from "./types";
import { toast } from "sonner";

export const INTEGRATIONS_QUERY_KEYS = {
  integrations: (params?: { category?: string; search?: string }) =>
    ["integrations", "list", params] as const,
  integration: (id: string) => ["integrations", "detail", id] as const,
  integrationStats: ["integrations", "stats"] as const,
  webhooks: ["webhooks", "list"] as const,
  webhook: (id: string) => ["webhooks", "detail", id] as const,
  webhookDeliveries: (webhookId?: string) => ["webhooks", "deliveries", webhookId] as const,
  webhookStats: ["webhooks", "stats"] as const,
};

export function useIntegrationsQuery(params?: { category?: string; search?: string }) {
  return useQuery({
    queryKey: INTEGRATIONS_QUERY_KEYS.integrations(params),
    queryFn: () => mockIntegrationsService.getIntegrations(params),
  });
}

export function useIntegrationQuery(id: string) {
  return useQuery({
    queryKey: INTEGRATIONS_QUERY_KEYS.integration(id),
    queryFn: () => mockIntegrationsService.getIntegrationById(id),
    enabled: Boolean(id),
  });
}

export function useIntegrationStatsQuery() {
  return useQuery({
    queryKey: INTEGRATIONS_QUERY_KEYS.integrationStats,
    queryFn: () => mockIntegrationsService.getIntegrationStats(),
  });
}

export function useUpdateIntegrationConfigMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: IntegrationConfigValues }) =>
      mockIntegrationsService.updateIntegrationConfig(id, values),
    onSuccess: (integration) => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      toast.success(`Configured ${integration.name} (Demo Mode)`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update integration configuration.");
    },
  });
}

export function useToggleIntegrationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mockIntegrationsService.toggleIntegration(id),
    onSuccess: (integration) => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      toast.success(
        `${integration.name} is now ${integration.isEnabled ? "Enabled" : "Disabled"} (Demo Mode)`
      );
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to toggle integration.");
    },
  });
}

export function useDisconnectIntegrationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mockIntegrationsService.disconnectIntegration(id),
    onSuccess: (integration) => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      toast.success(`Disconnected ${integration.name} (Demo Mode)`);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to disconnect integration.");
    },
  });
}

// Webhook Hooks
export function useWebhooksQuery() {
  return useQuery({
    queryKey: INTEGRATIONS_QUERY_KEYS.webhooks,
    queryFn: () => mockIntegrationsService.getWebhooks(),
  });
}

export function useWebhookDeliveriesQuery(webhookId?: string) {
  return useQuery({
    queryKey: INTEGRATIONS_QUERY_KEYS.webhookDeliveries(webhookId),
    queryFn: () => mockIntegrationsService.getWebhookDeliveries(webhookId),
  });
}

export function useWebhookStatsQuery() {
  return useQuery({
    queryKey: INTEGRATIONS_QUERY_KEYS.webhookStats,
    queryFn: () => mockIntegrationsService.getWebhookStats(),
  });
}

export function useCreateWebhookMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: WebhookEndpointFormValues) =>
      mockIntegrationsService.createWebhook(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      toast.success("Webhook endpoint registered (Demo Mode)");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create webhook.");
    },
  });
}

export function useUpdateWebhookMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: WebhookEndpointFormValues }) =>
      mockIntegrationsService.updateWebhook(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      toast.success("Webhook endpoint updated (Demo Mode)");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update webhook.");
    },
  });
}

export function useToggleWebhookMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mockIntegrationsService.toggleWebhook(id),
    onSuccess: (webhook) => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      toast.success(
        `Webhook is now ${webhook.isActive ? "Active" : "Paused"} (Demo Mode)`
      );
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to toggle webhook.");
    },
  });
}

export function useDeleteWebhookMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mockIntegrationsService.deleteWebhook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      toast.success("Webhook endpoint deleted (Demo Mode)");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete webhook.");
    },
  });
}

export function useSimulateDeliveryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ webhookId, event }: { webhookId: string; event: WebhookEvent }) =>
      mockIntegrationsService.simulateDelivery(webhookId, event),
    onSuccess: (delivery) => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      if (delivery.status === "simulated_success") {
        toast.success(`Dispatched simulated "${delivery.event}" payload (Status 200)`);
      } else {
        toast.error(`Simulated delivery failed with status ${delivery.statusCode} (Gateway Timeout)`);
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || "Simulation failed.");
    },
  });
}

export function useRetryDeliveryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (deliveryId: string) => mockIntegrationsService.retryDelivery(deliveryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      toast.success("Simulated retry successful (Status 200 OK)");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Retry failed.");
    },
  });
}
