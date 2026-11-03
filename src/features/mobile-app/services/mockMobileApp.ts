import type { MobileAppConfig, MobileAppStats } from "../types";
import type {
  MobileAppBrandingFormValues,
  MobileAppContentFormValues,
  MobileAppSettingsFormValues,
} from "../schemas";
import { INITIAL_MOBILE_APP_CONFIG } from "../constants";

export const MOBILE_APP_STORAGE_KEY = "cartx_demo_mobile_app_config_v1";

export class MockMobileAppService {
  private memoryConfig: MobileAppConfig = JSON.parse(
    JSON.stringify(INITIAL_MOBILE_APP_CONFIG)
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
      console.warn(`[MockMobileAppService] Failed to set localStorage key "${key}":`, e);
    }
  }

  public async getConfig(): Promise<MobileAppConfig> {
    const config = this.safeGetItem<MobileAppConfig>(
      MOBILE_APP_STORAGE_KEY,
      this.memoryConfig
    );
    this.memoryConfig = config;
    return config;
  }

  public async updateBranding(
    values: MobileAppBrandingFormValues
  ): Promise<MobileAppConfig> {
    const current = await this.getConfig();
    const updated: MobileAppConfig = {
      ...current,
      displayName: values.displayName,
      description: values.description || "",
      appIcon: values.appIcon,
      appLogo: values.appLogo,
      splashScreen: values.splashScreen,
      brandColors: values.brandColors,
      theme: values.theme,
      lastSavedAt: new Date().toISOString(),
    };
    this.memoryConfig = updated;
    this.safeSetItem(MOBILE_APP_STORAGE_KEY, updated);
    return updated;
  }

  public async updateContent(
    values: MobileAppContentFormValues
  ): Promise<MobileAppConfig> {
    const current = await this.getConfig();
    const updated: MobileAppConfig = {
      ...current,
      homepageLayout: values.homepageLayout,
      navigationItems: values.navigationItems,
      lastSavedAt: new Date().toISOString(),
    };
    this.memoryConfig = updated;
    this.safeSetItem(MOBILE_APP_STORAGE_KEY, updated);
    return updated;
  }

  public async updateSettings(
    values: MobileAppSettingsFormValues
  ): Promise<MobileAppConfig> {
    const current = await this.getConfig();
    const updated: MobileAppConfig = {
      ...current,
      pushNotificationPrefs: values.pushNotificationPrefs,
      platformSettings: values.platformSettings,
      lastSavedAt: new Date().toISOString(),
    };
    this.memoryConfig = updated;
    this.safeSetItem(MOBILE_APP_STORAGE_KEY, updated);
    return updated;
  }

  public async getStats(): Promise<MobileAppStats> {
    const config = await this.getConfig();
    const sectionsConfigured = config.homepageLayout.filter((s) => s.enabled).length;
    const navigationItemsEnabled = config.navigationItems.filter((n) => n.enabled).length;
    const pushEnabled = Object.values(config.pushNotificationPrefs).filter(Boolean).length;
    const platformsConfigured =
      (config.platformSettings.android.packageName ? 1 : 0) +
      (config.platformSettings.ios.bundleId ? 1 : 0);

    return {
      sectionsConfigured,
      navigationItemsEnabled,
      pushNotificationsEnabled: pushEnabled,
      platformsConfigured,
      lastSavedAt: config.lastSavedAt,
      status: config.status,
    };
  }

  public resetToDefaults(): void {
    this.memoryConfig = JSON.parse(JSON.stringify(INITIAL_MOBILE_APP_CONFIG));
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(MOBILE_APP_STORAGE_KEY);
    }
  }
}

export const mockMobileAppService = new MockMobileAppService();

