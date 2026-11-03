import type { MobileAppConfig, HomepageSection, NavigationItem } from "./types";

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSection[] = [
  { id: "sec_hero", type: "hero_banner", title: "Eid Mega Sale Hero Banner", enabled: true, order: 1 },
  { id: "sec_categories", type: "categories", title: "Shop by Category", enabled: true, order: 2 },
  { id: "sec_featured", type: "featured_products", title: "Trending Deals in Dhaka", enabled: true, order: 3 },
  { id: "sec_promotions", type: "promotions", title: "Flash Discount Vouchers", enabled: true, order: 4 },
  { id: "sec_new", type: "new_arrivals", title: "New Bangladeshi Artisanal Arrivals", enabled: true, order: 5 },
  { id: "sec_reviews", type: "testimonials", title: "Verified Customer Reviews", enabled: false, order: 6 },
];

export const DEFAULT_NAV_ITEMS: NavigationItem[] = [
  { id: "nav_home", label: "Home", icon: "Home", route: "/home", enabled: true },
  { id: "nav_categories", label: "Categories", icon: "Grid", route: "/categories", enabled: true },
  { id: "nav_cart", label: "Cart", icon: "ShoppingCart", route: "/cart", enabled: true },
  { id: "nav_orders", label: "My Orders", icon: "Package", route: "/orders", enabled: true },
  { id: "nav_account", label: "Account", icon: "User", route: "/account", enabled: true },
];

export const INITIAL_MOBILE_APP_CONFIG: MobileAppConfig = {
  id: "app_green_harvest_01",
  displayName: "Green Harvest BD",
  description: "আপনার পছন্দের নিত্যপ্রয়োজনীয় ও অর্গানিক পণ্য ঘরে বসেই অর্ডার করুন।",
  appIcon: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=256&q=80",
  appLogo: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=512&q=80",
  splashScreen: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80",
  brandColors: {
    primary: "#2563EB",
    secondary: "#1D4ED8",
    accent: "#38BDF8",
    background: "#FFFFFF",
  },
  theme: "light",
  homepageLayout: DEFAULT_HOMEPAGE_SECTIONS,
  navigationItems: DEFAULT_NAV_ITEMS,
  pushNotificationPrefs: {
    orderUpdates: true,
    promotions: true,
    shipping: true,
    general: false,
  },
  platformSettings: {
    android: {
      packageName: "com.cartx.greenharvest",
      versionName: "1.0.0",
    },
    ios: {
      bundleId: "bd.com.cartx.greenharvest",
      versionString: "1.0.0",
    },
  },
  status: "configured",
  lastSavedAt: "2026-11-01T12:00:00.000Z",
  createdAt: "2026-10-15T10:00:00.000Z",
};

