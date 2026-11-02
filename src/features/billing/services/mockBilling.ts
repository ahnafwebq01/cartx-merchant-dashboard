import type {
  StoreSubscription,
  SubscriptionPlanId,
  BillingCycle,
  PlanUsageMetric,
  Invoice,
  BillingSettings,
  PaymentMethod,
} from "../types";
import type {
  BillingSettingsFormValues,
  PaymentMethodFormValues,
} from "../schemas";
import {
  SUBSCRIPTION_PLANS,
  INITIAL_SUBSCRIPTION,
  INITIAL_INVOICES,
  INITIAL_BILLING_SETTINGS,
} from "../constants";

export const SUBSCRIPTION_STORAGE_KEY = "cartx_demo_subscription_v1";
export const INVOICES_STORAGE_KEY = "cartx_demo_invoices_v1";
export const BILLING_SETTINGS_STORAGE_KEY = "cartx_demo_billing_settings_v1";

export function calculatePlanPricing(
  planId: SubscriptionPlanId,
  cycle: BillingCycle
): {
  billedAmount: number;
  monthlyEquivalent: number;
  annualSavingsAmount: number;
  annualSavingsPercent: number;
} {
  const plan = SUBSCRIPTION_PLANS[planId];
  if (cycle === "annual") {
    const fullAnnualAtMonthlyRate = plan.monthlyPriceBDT * 12;
    const billedAmount = plan.annualPriceBDT;
    const annualSavingsAmount = fullAnnualAtMonthlyRate - billedAmount;
    const monthlyEquivalent = Math.round(billedAmount / 12);
    return {
      billedAmount,
      monthlyEquivalent,
      annualSavingsAmount,
      annualSavingsPercent: plan.annualSavingsPercent,
    };
  }

  return {
    billedAmount: plan.monthlyPriceBDT,
    monthlyEquivalent: plan.monthlyPriceBDT,
    annualSavingsAmount: 0,
    annualSavingsPercent: 0,
  };
}

export function calculateUsageMetric(
  id: string,
  label: string,
  current: number,
  limit: number,
  unit: string
): PlanUsageMetric {
  if (limit === -1) {
    return {
      id,
      label,
      current,
      limit: -1,
      unit,
      percentUsed: 0,
      status: "normal",
    };
  }

  const rawPercent = (current / limit) * 100;
  const percentUsed = Math.min(100, Math.round(rawPercent));

  let status: "normal" | "warning" | "critical" = "normal";
  if (percentUsed >= 90) {
    status = "critical";
  } else if (percentUsed >= 70) {
    status = "warning";
  }

  return {
    id,
    label,
    current,
    limit,
    unit,
    percentUsed,
    status,
  };
}

export class MockBillingService {
  private memorySubscription: StoreSubscription = JSON.parse(JSON.stringify(INITIAL_SUBSCRIPTION));
  private memoryInvoices: Invoice[] = JSON.parse(JSON.stringify(INITIAL_INVOICES));
  private memorySettings: BillingSettings = JSON.parse(JSON.stringify(INITIAL_BILLING_SETTINGS));

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
      console.warn(`[MockBillingService] Failed to set localStorage key "${key}":`, e);
    }
  }

  public async getSubscription(): Promise<StoreSubscription> {
    const sub = this.safeGetItem<StoreSubscription>(
      SUBSCRIPTION_STORAGE_KEY,
      this.memorySubscription
    );
    this.memorySubscription = sub;
    return sub;
  }

  public async getUsageMetrics(): Promise<PlanUsageMetric[]> {
    const sub = await this.getSubscription();
    const plan = SUBSCRIPTION_PLANS[sub.planId];

    return [
      calculateUsageMetric(
        "products",
        "Active Catalog Products",
        18,
        plan.limits.maxProducts,
        "products"
      ),
      calculateUsageMetric(
        "staff",
        "Staff Accounts",
        4, // Tariqul, Shamima, Kamrul, Farhana (4 of 5 used -> 80% warning)
        plan.limits.maxStaffAccounts,
        "members"
      ),
      calculateUsageMetric(
        "orders",
        "Monthly Order Volume",
        142,
        plan.limits.maxMonthlyOrders,
        "orders"
      ),
      calculateUsageMetric(
        "storage",
        "Asset Storage & Media",
        1.2,
        plan.limits.storageGB,
        "GB"
      ),
      calculateUsageMetric(
        "domains",
        "Custom Domains Active",
        1,
        plan.limits.customDomains,
        "domain"
      ),
    ];
  }

  public async getInvoices(status?: string): Promise<Invoice[]> {
    const invoices = this.safeGetItem<Invoice[]>(INVOICES_STORAGE_KEY, this.memoryInvoices);
    this.memoryInvoices = invoices;

    if (!status || status === "all") {
      return invoices;
    }
    return invoices.filter((inv) => inv.status === status);
  }

  public async getInvoiceById(id: string): Promise<Invoice | null> {
    const invoices = await this.getInvoices();
    return invoices.find((inv) => inv.id === id || inv.invoiceNumber === id) || null;
  }

  public async upgradeSubscription(
    planId: SubscriptionPlanId,
    cycle: BillingCycle
  ): Promise<StoreSubscription> {
    const currentSub = await this.getSubscription();
    const plan = SUBSCRIPTION_PLANS[planId];
    const pricing = calculatePlanPricing(planId, cycle);

    const now = new Date();
    const nextBill = new Date(
      cycle === "annual"
        ? now.getTime() + 365 * 24 * 60 * 60 * 1000
        : now.getTime() + 30 * 24 * 60 * 60 * 1000
    );

    const updatedSub: StoreSubscription = {
      ...currentSub,
      planId,
      billingCycle: cycle,
      currentPriceBDT: pricing.billedAmount,
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: nextBill.toISOString(),
      nextBillingDate: nextBill.toISOString(),
      status: "active",
    };

    this.memorySubscription = updatedSub;
    this.safeSetItem(SUBSCRIPTION_STORAGE_KEY, updatedSub);

    // Generate simulated paid invoice for the upgrade/downgrade event
    const invoices = await this.getInvoices();
    const invoiceNum = `INV-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      invoices.length + 1
    ).padStart(3, "0")}`;

    const newInvoice: Invoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber: invoiceNum,
      date: now.toISOString(),
      dueDate: now.toISOString(),
      planId,
      planName: `${plan.name} (${cycle === "annual" ? "Annual" : "Monthly"})`,
      billingCycle: cycle,
      subtotalBDT: pricing.billedAmount,
      vatAmountBDT: 0,
      totalBDT: pricing.billedAmount,
      status: "paid",
      paymentMethod: currentSub.paymentMethodSummary,
      transactionId: `TXN-DEMO-${Date.now()}`,
      lineItems: [
        {
          description: `${plan.name} Subscription (${cycle === "annual" ? "1-Year License" : "1-Month Access"})`,
          amountBDT: pricing.billedAmount,
        },
      ],
    };

    const updatedInvoices = [newInvoice, ...invoices];
    this.memoryInvoices = updatedInvoices;
    this.safeSetItem(INVOICES_STORAGE_KEY, updatedInvoices);

    return updatedSub;
  }

  public async payInvoice(invoiceId: string): Promise<Invoice> {
    const invoices = await this.getInvoices();
    const index = invoices.findIndex((i) => i.id === invoiceId || i.invoiceNumber === invoiceId);
    if (index === -1) {
      throw new Error(`Invoice "${invoiceId}" not found.`);
    }

    const current = invoices[index];
    const updated: Invoice = {
      ...current,
      status: "paid",
      transactionId: `TXN-RETRY-${Date.now()}`,
      date: new Date().toISOString(),
    };

    invoices[index] = updated;
    this.memoryInvoices = invoices;
    this.safeSetItem(INVOICES_STORAGE_KEY, invoices);

    return updated;
  }

  public async getBillingSettings(): Promise<BillingSettings> {
    const settings = this.safeGetItem<BillingSettings>(
      BILLING_SETTINGS_STORAGE_KEY,
      this.memorySettings
    );
    this.memorySettings = settings;
    return settings;
  }

  public async updateBillingSettings(data: BillingSettingsFormValues): Promise<BillingSettings> {
    const current = await this.getBillingSettings();
    const updated: BillingSettings = {
      ...current,
      billingEmail: data.billingEmail,
      companyName: data.companyName,
      businessIdentificationNumber: data.businessIdentificationNumber || current.businessIdentificationNumber,
      taxRegistrationNumber: data.taxRegistrationNumber || current.taxRegistrationNumber,
      street: data.street,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country || "Bangladesh",
    };

    this.memorySettings = updated;
    this.safeSetItem(BILLING_SETTINGS_STORAGE_KEY, updated);
    return updated;
  }

  public async addPaymentMethod(data: PaymentMethodFormValues): Promise<PaymentMethod> {
    const settings = await this.getBillingSettings();

    const newPm: PaymentMethod = {
      id: `pm_${Date.now()}`,
      type: data.type,
      label: data.label,
      identifier: data.identifier,
      accountHolderName: data.accountHolderName,
      isDefault: data.isDefault,
    };

    let updatedPms = [...settings.paymentMethods];
    if (newPm.isDefault) {
      updatedPms = updatedPms.map((pm) => ({ ...pm, isDefault: false }));
    }
    updatedPms.push(newPm);

    const updatedSettings: BillingSettings = {
      ...settings,
      paymentMethods: updatedPms,
    };

    this.memorySettings = updatedSettings;
    this.safeSetItem(BILLING_SETTINGS_STORAGE_KEY, updatedSettings);

    return newPm;
  }

  public async setDefaultPaymentMethod(id: string): Promise<void> {
    const settings = await this.getBillingSettings();
    const updatedPms = settings.paymentMethods.map((pm) => ({
      ...pm,
      isDefault: pm.id === id,
    }));

    const updatedSettings = {
      ...settings,
      paymentMethods: updatedPms,
    };

    this.memorySettings = updatedSettings;
    this.safeSetItem(BILLING_SETTINGS_STORAGE_KEY, updatedSettings);
  }

  public async removePaymentMethod(id: string): Promise<void> {
    const settings = await this.getBillingSettings();
    const target = settings.paymentMethods.find((pm) => pm.id === id);
    if (!target) throw new Error("Payment method not found.");
    if (target.isDefault) {
      throw new Error("Default auto-renewal payment method cannot be removed. Set another payment method as default first.");
    }

    const filtered = settings.paymentMethods.filter((pm) => pm.id !== id);
    const updatedSettings = {
      ...settings,
      paymentMethods: filtered,
    };

    this.memorySettings = updatedSettings;
    this.safeSetItem(BILLING_SETTINGS_STORAGE_KEY, updatedSettings);
  }

  public resetToDefaults(): void {
    this.memorySubscription = JSON.parse(JSON.stringify(INITIAL_SUBSCRIPTION));
    this.memoryInvoices = JSON.parse(JSON.stringify(INITIAL_INVOICES));
    this.memorySettings = JSON.parse(JSON.stringify(INITIAL_BILLING_SETTINGS));
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(SUBSCRIPTION_STORAGE_KEY);
      window.localStorage.removeItem(INVOICES_STORAGE_KEY);
      window.localStorage.removeItem(BILLING_SETTINGS_STORAGE_KEY);
    }
  }
}

export const mockBillingService = new MockBillingService();
