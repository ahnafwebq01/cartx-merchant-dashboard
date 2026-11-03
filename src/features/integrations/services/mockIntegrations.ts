import type {
  Integration,
  IntegrationCategory,
  IntegrationStats,
  WebhookEndpoint,
  WebhookDeliveryAttempt,
  WebhookStats,
  WebhookEvent,
} from "../types";
import type { WebhookEndpointFormValues, IntegrationConfigValues } from "../schemas";
import {
  INITIAL_INTEGRATIONS,
  INITIAL_WEBHOOK_ENDPOINTS,
  INITIAL_WEBHOOK_DELIVERIES,
  SAMPLE_WEBHOOK_PAYLOADS,
} from "../constants";

export const INTEGRATIONS_STORAGE_KEY = "cartx_demo_integrations_v1";
export const WEBHOOKS_STORAGE_KEY = "cartx_demo_webhooks_v1";
export const WEBHOOK_DELIVERIES_STORAGE_KEY = "cartx_demo_webhook_deliveries_v1";

export class MockIntegrationsService {
  private memoryIntegrations: Integration[] = JSON.parse(
    JSON.stringify(INITIAL_INTEGRATIONS)
  );
  private memoryWebhooks: WebhookEndpoint[] = JSON.parse(
    JSON.stringify(INITIAL_WEBHOOK_ENDPOINTS)
  );
  private memoryDeliveries: WebhookDeliveryAttempt[] = JSON.parse(
    JSON.stringify(INITIAL_WEBHOOK_DELIVERIES)
  );

  private safeGetItem<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  }

  private safeSetItem<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`[MockIntegrationsService] Failed to set localStorage key "${key}":`, e);
    }
  }

  // --- Integrations Methods ---

  public async getIntegrations(params?: {
    category?: string;
    search?: string;
  }): Promise<Integration[]> {
    const list = this.safeGetItem<Integration[]>(
      INTEGRATIONS_STORAGE_KEY,
      this.memoryIntegrations
    );
    this.memoryIntegrations = list;

    return list.filter((item) => {
      if (params?.category && params.category !== "all" && item.category !== params.category) {
        return false;
      }
      if (params?.search) {
        const q = params.search.toLowerCase().trim();
        const matches =
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }

  public async getIntegrationById(id: string): Promise<Integration | null> {
    const list = await this.getIntegrations();
    return list.find((i) => i.id === id) || null;
  }

  public async updateIntegrationConfig(
    id: string,
    values: IntegrationConfigValues
  ): Promise<Integration> {
    const list = await this.getIntegrations();
    const index = list.findIndex((i) => i.id === id);
    if (index === -1) {
      throw new Error(`Integration with ID "${id}" was not found.`);
    }

    const current = list[index];
    const updatedFields = current.configFields.map((field) => {
      if (values[field.key] !== undefined) {
        return { ...field, value: String(values[field.key]) };
      }
      return field;
    });

    const updated: Integration = {
      ...current,
      configFields: updatedFields,
      isEnabled: true,
      status: "demo_connected",
      configuredAt: current.configuredAt || new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
    };

    list[index] = updated;
    this.memoryIntegrations = list;
    this.safeSetItem(INTEGRATIONS_STORAGE_KEY, list);

    return updated;
  }

  public async toggleIntegration(id: string): Promise<Integration> {
    const list = await this.getIntegrations();
    const index = list.findIndex((i) => i.id === id);
    if (index === -1) {
      throw new Error(`Integration with ID "${id}" was not found.`);
    }

    const current = list[index];
    const updated: Integration = {
      ...current,
      isEnabled: !current.isEnabled,
      status: !current.isEnabled ? "demo_connected" : "disconnected",
      lastActivityAt: new Date().toISOString(),
    };

    list[index] = updated;
    this.memoryIntegrations = list;
    this.safeSetItem(INTEGRATIONS_STORAGE_KEY, list);

    return updated;
  }

  public async disconnectIntegration(id: string): Promise<Integration> {
    const list = await this.getIntegrations();
    const index = list.findIndex((i) => i.id === id);
    if (index === -1) {
      throw new Error(`Integration with ID "${id}" was not found.`);
    }

    const updated: Integration = {
      ...list[index],
      isEnabled: false,
      status: "disconnected",
      configFields: list[index].configFields.map((f) => ({ ...f, value: "" })),
      lastActivityAt: new Date().toISOString(),
    };

    list[index] = updated;
    this.memoryIntegrations = list;
    this.safeSetItem(INTEGRATIONS_STORAGE_KEY, list);

    return updated;
  }

  public async getIntegrationStats(): Promise<IntegrationStats> {
    const list = await this.getIntegrations();
    const totalIntegrations = list.length;
    const connectedCount = list.filter((i) => i.isEnabled).length;
    const disconnectedCount = totalIntegrations - connectedCount;

    const categoryCounts: Record<IntegrationCategory, number> = {
      payments: list.filter((i) => i.category === "payments").length,
      shipping: list.filter((i) => i.category === "shipping").length,
      marketing: list.filter((i) => i.category === "marketing").length,
      analytics: list.filter((i) => i.category === "analytics").length,
      notifications: list.filter((i) => i.category === "notifications").length,
      storefront: list.filter((i) => i.category === "storefront").length,
    };

    return {
      totalIntegrations,
      connectedCount,
      disconnectedCount,
      categoryCounts,
    };
  }

  // --- Webhooks Methods ---

  public async getWebhooks(): Promise<WebhookEndpoint[]> {
    const list = this.safeGetItem<WebhookEndpoint[]>(
      WEBHOOKS_STORAGE_KEY,
      this.memoryWebhooks
    );
    this.memoryWebhooks = list;
    return list;
  }

  public async getWebhookById(id: string): Promise<WebhookEndpoint | null> {
    const list = await this.getWebhooks();
    return list.find((w) => w.id === id) || null;
  }

  public async createWebhook(values: WebhookEndpointFormValues): Promise<WebhookEndpoint> {
    const list = await this.getWebhooks();
    const now = new Date().toISOString();

    const newEndpoint: WebhookEndpoint = {
      id: `wh_${Date.now()}`,
      url: values.url,
      description: values.description || "",
      events: values.events,
      isActive: values.isActive ?? true,
      secretPlaceholder: `whsec_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newEndpoint, ...list];
    this.memoryWebhooks = updated;
    this.safeSetItem(WEBHOOKS_STORAGE_KEY, updated);

    return newEndpoint;
  }

  public async updateWebhook(
    id: string,
    values: WebhookEndpointFormValues
  ): Promise<WebhookEndpoint> {
    const list = await this.getWebhooks();
    const index = list.findIndex((w) => w.id === id);
    if (index === -1) {
      throw new Error(`Webhook endpoint "${id}" was not found.`);
    }

    const updated: WebhookEndpoint = {
      ...list[index],
      url: values.url,
      description: values.description || "",
      events: values.events,
      isActive: values.isActive ?? list[index].isActive,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updated;
    this.memoryWebhooks = list;
    this.safeSetItem(WEBHOOKS_STORAGE_KEY, list);

    return updated;
  }

  public async deleteWebhook(id: string): Promise<void> {
    const list = await this.getWebhooks();
    const filtered = list.filter((w) => w.id !== id);
    this.memoryWebhooks = filtered;
    this.safeSetItem(WEBHOOKS_STORAGE_KEY, filtered);
  }

  public async toggleWebhook(id: string): Promise<WebhookEndpoint> {
    const list = await this.getWebhooks();
    const index = list.findIndex((w) => w.id === id);
    if (index === -1) {
      throw new Error(`Webhook endpoint "${id}" was not found.`);
    }

    list[index].isActive = !list[index].isActive;
    list[index].updatedAt = new Date().toISOString();

    this.memoryWebhooks = list;
    this.safeSetItem(WEBHOOKS_STORAGE_KEY, list);

    return list[index];
  }

  public async getWebhookDeliveries(webhookId?: string): Promise<WebhookDeliveryAttempt[]> {
    const list = this.safeGetItem<WebhookDeliveryAttempt[]>(
      WEBHOOK_DELIVERIES_STORAGE_KEY,
      this.memoryDeliveries
    );
    this.memoryDeliveries = list;

    if (webhookId) {
      return list.filter((d) => d.webhookId === webhookId);
    }
    return list;
  }

  public async simulateDelivery(
    webhookId: string,
    event: WebhookEvent
  ): Promise<WebhookDeliveryAttempt> {
    const webhook = await this.getWebhookById(webhookId);
    if (!webhook) {
      throw new Error(`Webhook with ID "${webhookId}" was not found.`);
    }

    const payload = SAMPLE_WEBHOOK_PAYLOADS[event] || { event, timestamp: new Date().toISOString() };
    const isSuccess = Math.random() > 0.15; // 85% success simulation

    const newDelivery: WebhookDeliveryAttempt = {
      id: `del_${Date.now()}`,
      webhookId,
      webhookUrl: webhook.url,
      event,
      status: isSuccess ? "simulated_success" : "simulated_failure",
      statusCode: isSuccess ? 200 : 504,
      responseTime: Math.floor(Math.random() * 200) + 60,
      payload,
      attemptedAt: new Date().toISOString(),
      retryCount: 0,
    };

    const deliveries = await this.getWebhookDeliveries();
    const updated = [newDelivery, ...deliveries];
    this.memoryDeliveries = updated;
    this.safeSetItem(WEBHOOK_DELIVERIES_STORAGE_KEY, updated);

    return newDelivery;
  }

  public async retryDelivery(deliveryId: string): Promise<WebhookDeliveryAttempt> {
    const deliveries = await this.getWebhookDeliveries();
    const index = deliveries.findIndex((d) => d.id === deliveryId);
    if (index === -1) {
      throw new Error(`Delivery attempt "${deliveryId}" not found.`);
    }

    const current = deliveries[index];
    const updated: WebhookDeliveryAttempt = {
      ...current,
      status: "simulated_success",
      statusCode: 200,
      responseTime: 110,
      retryCount: current.retryCount + 1,
      attemptedAt: new Date().toISOString(),
    };

    deliveries[index] = updated;
    this.memoryDeliveries = deliveries;
    this.safeSetItem(WEBHOOK_DELIVERIES_STORAGE_KEY, deliveries);

    return updated;
  }

  public async getWebhookStats(): Promise<WebhookStats> {
    const webhooks = await this.getWebhooks();
    const deliveries = await this.getWebhookDeliveries();

    const totalEndpoints = webhooks.length;
    const activeEndpoints = webhooks.filter((w) => w.isActive).length;
    const totalDeliveries = deliveries.length;
    const successfulDeliveries = deliveries.filter((d) => d.status === "simulated_success").length;
    const successRate = totalDeliveries > 0 ? Math.round((successfulDeliveries / totalDeliveries) * 100) : 100;

    return {
      totalEndpoints,
      activeEndpoints,
      totalDeliveries,
      successRate,
    };
  }

  public resetToDefaults(): void {
    this.memoryIntegrations = JSON.parse(JSON.stringify(INITIAL_INTEGRATIONS));
    this.memoryWebhooks = JSON.parse(JSON.stringify(INITIAL_WEBHOOK_ENDPOINTS));
    this.memoryDeliveries = JSON.parse(JSON.stringify(INITIAL_WEBHOOK_DELIVERIES));

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(INTEGRATIONS_STORAGE_KEY);
      window.localStorage.removeItem(WEBHOOKS_STORAGE_KEY);
      window.localStorage.removeItem(WEBHOOK_DELIVERIES_STORAGE_KEY);
    }
  }
}

export const mockIntegrationsService = new MockIntegrationsService();
