import { z } from "zod";

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export const brandColorsSchema = z.object({
  primary: z.string().regex(hexColorRegex, "Invalid HEX color code"),
  secondary: z.string().regex(hexColorRegex, "Invalid HEX color code"),
  accent: z.string().regex(hexColorRegex, "Invalid HEX color code"),
  background: z.string().regex(hexColorRegex, "Invalid HEX color code"),
});

export const mobileAppBrandingSchema = z.object({
  displayName: z.string().min(2, "App name must be at least 2 characters").max(50, "App name cannot exceed 50 characters"),
  description: z.string().max(250, "Description cannot exceed 250 characters"),
  appIcon: z.string().url("Must be a valid URL").or(z.string().min(1, "App icon is required")),
  appLogo: z.string().url("Must be a valid URL").or(z.string().min(1, "App logo is required")),
  splashScreen: z.string().url("Must be a valid URL").or(z.string().min(1, "Splash screen is required")),
  brandColors: brandColorsSchema,
  theme: z.enum(["light", "dark", "auto"]),
});

export type MobileAppBrandingFormValues = z.infer<typeof mobileAppBrandingSchema>;

export const homepageSectionSchema = z.object({
  id: z.string(),
  type: z.enum(["hero_banner", "featured_products", "categories", "promotions", "new_arrivals", "testimonials"]),
  title: z.string().min(1, "Title is required"),
  enabled: z.boolean(),
  order: z.number(),
});

export const navigationItemSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Label is required"),
  icon: z.string(),
  route: z.string().min(1, "Route is required"),
  enabled: z.boolean(),
});

export const mobileAppContentSchema = z.object({
  homepageLayout: z.array(homepageSectionSchema).min(1, "At least one section must be configured"),
  navigationItems: z.array(navigationItemSchema).min(2, "At least two navigation items must be configured"),
});

export type MobileAppContentFormValues = z.infer<typeof mobileAppContentSchema>;

export const pushNotificationPrefsSchema = z.object({
  orderUpdates: z.boolean(),
  promotions: z.boolean(),
  shipping: z.boolean(),
  general: z.boolean(),
});

export const platformSettingsSchema = z.object({
  android: z.object({
    packageName: z.string().regex(/^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+[0-9a-z_]$/i, "Invalid Android package name (e.g. com.cartx.store)"),
    versionName: z.string().min(1, "Version name is required"),
  }),
  ios: z.object({
    bundleId: z.string().regex(/^[a-zA-Z0-9.-]+$/, "Invalid iOS bundle identifier (e.g. bd.com.cartx.store)"),
    versionString: z.string().min(1, "Version string is required"),
  }),
});

export const mobileAppSettingsSchema = z.object({
  pushNotificationPrefs: pushNotificationPrefsSchema,
  platformSettings: platformSettingsSchema,
});

export type MobileAppSettingsFormValues = z.infer<typeof mobileAppSettingsSchema>;
