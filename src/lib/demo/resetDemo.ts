import { mockOnboardingService } from "@/features/onboarding/services/mockOnboarding";
import { mockStoreSettingsService } from "@/features/store-settings/services/mockStoreSettings";
import { mockProductService } from "@/features/products/services/mockProducts";
import { mockMarketingService } from "@/features/marketing/services/mockMarketing";
import { mockStorefrontService } from "@/features/storefront/services/mockStorefront";

export const ALL_DEMO_STORAGE_KEYS = [
  "cartx_demo_onboarding_draft_v1",
  "cartx_demo_store_settings_v1",
  "cartx_demo_auth_session_v1",
  "cartx_demo_customers_v1",
  "cartx_demo_orders_v1",
  "cartx_demo_products_v1",
  "cartx_demo_categories_v1",
  "cartx_demo_collections_v1",
  "cartx_demo_movements_v1",
  "cartx_demo_payments_v1",
  "cartx_demo_refunds_v1",
  "cartx_demo_payment_methods_v1",
  "cartx_demo_shipments_v1",
  "cartx_demo_couriers_v1",
  "cartx_demo_shipping_rates_v1",
  "cartx_demo_storefront_status_v1",
  "cartx_demo_themes_v1",
  "cartx_demo_domains_v1",
  "cartx_demo_pages_v1",
  "cartx_demo_storefront_activities_v1",
  "cartx_demo_marketing_coupons_v1",
  "cartx_demo_marketing_discounts_v1",
  "cartx_demo_marketing_flash_sales_v1",
  "cartx_demo_marketing_activities_v1",
  "cartx_demo_team_members_v1",
  "cartx_demo_team_invitations_v1",
  "cartx_demo_billing_subscription_v1",
  "cartx_demo_billing_invoices_v1",
  "cartx_demo_support_tickets_v1",
];

/**
 * Resets all demo storage and service states back to initial baseline presets.
 */
export function resetAllDemoData(): void {
  if (typeof window !== "undefined") {
    try {
      // 1. Remove all known demo keys
      ALL_DEMO_STORAGE_KEYS.forEach((key) => {
        window.localStorage.removeItem(key);
      });

      // 2. Clear any additional demo keys dynamically
      const keysToRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith("cartx_demo_")) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => window.localStorage.removeItem(k));
    } catch (e) {
      console.warn("[DemoReset] Error clearing localStorage:", e);
    }
  }

  // 3. Reset in-memory services
  try {
    mockOnboardingService.resetOnboarding();
    mockStoreSettingsService.resetSettings();
    mockProductService.resetDemoData();
    mockMarketingService.resetDemoData();
    mockStorefrontService.resetDemoData();
  } catch (e) {
    console.warn("[DemoReset] Error resetting in-memory services:", e);
  }
}

