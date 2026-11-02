export type SubscriptionPlanId = "starter" | "growth" | "pro";

export type BillingCycle = "monthly" | "annual";

export interface SubscriptionPlanLimits {
  maxProducts: number; // -1 for unlimited
  maxStaffAccounts: number;
  maxMonthlyOrders: number; // -1 for unlimited
  storageGB: number;
  customDomains: number;
}

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  tagline: string;
  monthlyPriceBDT: number;
  annualPriceBDT: number;
  annualSavingsPercent: number;
  isPopular?: boolean;
  limits: SubscriptionPlanLimits;
  features: string[];
}

export interface StoreSubscription {
  planId: SubscriptionPlanId;
  status: "active" | "trial" | "past_due" | "cancelled";
  billingCycle: BillingCycle;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  nextBillingDate: string;
  cancelAtPeriodEnd: boolean;
  currentPriceBDT: number;
  paymentMethodSummary: string;
}

export type UsageMetricStatus = "normal" | "warning" | "critical";

export interface PlanUsageMetric {
  id: string;
  label: string;
  current: number;
  limit: number; // -1 for unlimited
  unit: string;
  percentUsed: number;
  status: UsageMetricStatus;
}

export type InvoiceStatus = "paid" | "pending" | "failed";

export interface InvoiceLineItem {
  description: string;
  amountBDT: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  planId: SubscriptionPlanId;
  planName: string;
  billingCycle: BillingCycle;
  subtotalBDT: number;
  vatAmountBDT: number;
  totalBDT: number;
  status: InvoiceStatus;
  paymentMethod: string;
  transactionId?: string;
  lineItems: InvoiceLineItem[];
}

export type PaymentMethodType = "bkash" | "nagad" | "card";

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  label: string;
  identifier: string;
  isDefault: boolean;
  accountHolderName?: string;
  expiresOn?: string;
}

export interface BillingSettings {
  billingEmail: string;
  companyName: string;
  businessIdentificationNumber?: string;
  taxRegistrationNumber?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentMethods: PaymentMethod[];
}
