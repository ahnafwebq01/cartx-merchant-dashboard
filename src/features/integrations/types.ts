export type IntegrationCategory =
  | "payments"
  | "shipping"
  | "marketing"
  | "analytics"
  | "notifications"
  | "storefront";

export type IntegrationStatus = "connected" | "disconnected" | "error" | "demo_connected";

export interface IntegrationConfigField {
  key: string;
  label: string;
  type: "text" | "select" | "toggle";
  placeholder?: string;
  required?: boolean;
  value?: string;
  options?: { label: string; value: string }[];
  helpText?: string;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  iconEmoji?: string;
  isEnabled: boolean;
  configuredAt?: string;
  lastActivityAt?: string;
  configFields: IntegrationConfigField[];
  demoMode: boolean;
}

export interface IntegrationStats {
  totalIntegrations: number;
  connectedCount: number;
  disconnectedCount: number;
  categoryCounts: Record<IntegrationCategory, number>;
}

// Webhook Types
export type WebhookEvent =
  | "order.created"
  | "order.updated"
  | "order.cancelled"
  | "inventory.low_stock"
  | "customer.created"
  | "coupon.redeemed";

export type WebhookDeliveryStatus = "simulated_success" | "simulated_failure" | "pending";

export interface WebhookEndpoint {
  id: string;
  url: string;
  description: string;
  events: WebhookEvent[];
  isActive: boolean;
  secretPlaceholder: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookDeliveryAttempt {
  id: string;
  webhookId: string;
  webhookUrl: string;
  event: WebhookEvent;
  status: WebhookDeliveryStatus;
  statusCode?: number;
  responseTime?: number;
  payload: Record<string, unknown>;
  attemptedAt: string;
  retryCount: number;
}

export interface WebhookStats {
  totalEndpoints: number;
  activeEndpoints: number;
  totalDeliveries: number;
  successRate: number;
}

