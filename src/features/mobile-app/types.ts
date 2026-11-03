export type ThemeMode = "light" | "dark" | "auto";
export type MobileAppStatus = "draft" | "configured" | "published_demo";

export interface HomepageSection {
  id: string;
  type: "hero_banner" | "featured_products" | "categories" | "promotions" | "new_arrivals" | "testimonials";
  title: string;
  enabled: boolean;
  order: number;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  enabled: boolean;
}

export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

export interface PushNotificationPrefs {
  orderUpdates: boolean;
  promotions: boolean;
  shipping: boolean;
  general: boolean;
}

export interface PlatformSettings {
  android: {
    packageName: string;
    versionName: string;
  };
  ios: {
    bundleId: string;
    versionString: string;
  };
}

export interface MobileAppConfig {
  id: string;
  displayName: string;
  description: string;
  appIcon: string;
  appLogo: string;
  splashScreen: string;
  brandColors: BrandColors;
  theme: ThemeMode;
  homepageLayout: HomepageSection[];
  navigationItems: NavigationItem[];
  pushNotificationPrefs: PushNotificationPrefs;
  platformSettings: PlatformSettings;
  status: MobileAppStatus;
  lastSavedAt: string;
  createdAt: string;
}

export interface MobileAppStats {
  sectionsConfigured: number;
  navigationItemsEnabled: number;
  pushNotificationsEnabled: number;
  platformsConfigured: number;
  lastSavedAt: string;
  status: MobileAppStatus;
}

export type AppPreviewDevice = "android" | "ios";

