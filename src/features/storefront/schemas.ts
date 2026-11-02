import { z } from "zod";

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
const domainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/;
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const themeColorsSchema = z.object({
  primary: z.string().regex(hexColorRegex, "Invalid primary hex color (e.g. #2563EB)"),
  secondary: z.string().regex(hexColorRegex, "Invalid secondary hex color"),
  accent: z.string().regex(hexColorRegex, "Invalid accent hex color"),
  background: z.string().regex(hexColorRegex, "Invalid background hex color"),
  text: z.string().regex(hexColorRegex, "Invalid text hex color"),
  headerBg: z.string().regex(hexColorRegex, "Invalid header background hex color"),
  footerBg: z.string().regex(hexColorRegex, "Invalid footer background hex color"),
});

export const themeTypographySchema = z.object({
  headingFont: z.enum(["Inter", "Noto Sans Bengali", "Poppins", "Hind Siliguri"]),
  bodyFont: z.enum(["Inter", "Noto Sans Bengali", "Roboto", "Open Sans"]),
  baseFontSize: z.enum(["sm", "md", "lg"]),
});

export const headerSettingsSchema = z.object({
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  logoText: z.string().min(1, "Logo text / Store title is required"),
  sticky: z.boolean(),
  showSearch: z.boolean(),
  showCart: z.boolean(),
  announcementEnabled: z.boolean(),
  announcementText: z.string().max(200, "Announcement cannot exceed 200 characters"),
  announcementBg: z.string().regex(hexColorRegex, "Invalid announcement background color"),
});

export const heroSectionSchema = z.object({
  enabled: z.boolean(),
  headline: z.string().min(2, "Hero headline is required").max(100),
  headlineBn: z.string().max(100).optional(),
  subheading: z.string().max(250).optional(),
  subheadingBn: z.string().max(250).optional(),
  buttonText: z.string().min(1, "CTA button text is required").max(40),
  buttonLink: z.string().min(1, "CTA button link is required"),
  bannerStyle: z.enum(["split", "centered", "full"]),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export const featuredCategoriesSchema = z.object({
  enabled: z.boolean(),
  title: z.string().min(1, "Section title is required"),
  titleBn: z.string().optional(),
  layout: z.enum(["grid", "carousel"]),
});

export const featuredProductsSchema = z.object({
  enabled: z.boolean(),
  title: z.string().min(1, "Section title is required"),
  titleBn: z.string().optional(),
  productCount: z.number().int().min(2).max(24),
});

export const promoBannerSchema = z.object({
  enabled: z.boolean(),
  headline: z.string().max(120),
  couponCode: z.string().max(30),
  discountText: z.string().max(60),
});

export const trustBadgeItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  titleBn: z.string(),
  description: z.string(),
  icon: z.enum(["truck", "shield-check", "rotate-ccw", "credit-card", "headphones"]),
});

export const trustBadgesSchema = z.object({
  enabled: z.boolean(),
  items: z.array(trustBadgeItemSchema),
});

export const footerSettingsSchema = z.object({
  copyrightText: z.string().min(1, "Copyright notice is required"),
  showNewsletter: z.boolean(),
  showSocialLinks: z.boolean(),
  showPaymentMethods: z.boolean(),
});

export const themeCustomizationSchema = z.object({
  colors: themeColorsSchema,
  typography: themeTypographySchema,
  header: headerSettingsSchema,
  hero: heroSectionSchema,
  categories: featuredCategoriesSchema,
  products: featuredProductsSchema,
  promo: promoBannerSchema,
  trustBadges: trustBadgesSchema,
  footer: footerSettingsSchema,
});

export type ThemeCustomizationFormValues = z.infer<typeof themeCustomizationSchema>;

export const customDomainSchema = z.object({
  domain: z
    .string()
    .trim()
    .toLowerCase()
    .min(4, "Domain name must be at least 4 characters")
    .max(253, "Domain name cannot exceed 253 characters")
    .refine((val) => !val.startsWith("http://") && !val.startsWith("https://"), {
      message: "Do not include http:// or https:// (e.g. use shop.mybrand.com)",
    })
    .refine((val) => !val.includes("/"), {
      message: "Domain cannot include paths or slashes (e.g. use shop.mybrand.com)",
    })
    .refine((val) => domainRegex.test(val), {
      message: "Enter a valid domain name (e.g. shop.greenharvest.com.bd or mybrand.com)",
    })
    .refine((val) => !val.endsWith(".cartx.com.bd") && val !== "cartx.com.bd", {
      message: "Cannot add default CartX platform domains as custom domains",
    }),
});

export type CustomDomainFormValues = z.infer<typeof customDomainSchema>;

export const storePageSchema = z.object({
  title: z
    .string()
    .min(2, "Page title is required (কমপক্ষে ২ অক্ষর)")
    .max(120, "Title cannot exceed 120 characters"),
  titleBn: z.string().max(120).optional(),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "Slug must be at least 2 characters")
    .max(100, "Slug cannot exceed 100 characters")
    .regex(slugRegex, "Slug must be lowercase alphanumeric with hyphens (e.g. privacy-policy)"),
  content: z
    .string()
    .min(10, "Page content must be at least 10 characters long (পৃষ্ঠার বিষয়বস্তু আবশ্যক)"),
  contentBn: z.string().optional(),
  pageType: z.enum(["legal_policy", "standard_cms"]),
  policyType: z.enum(["privacy", "terms", "refund", "shipping"]).optional(),
  status: z.enum(["published", "draft"]),
  metaTitle: z.string().max(70, "Meta title recommended under 70 characters").optional(),
  metaDescription: z.string().max(160, "Meta description recommended under 160 characters").optional(),
});

export type StorePageFormValues = z.infer<typeof storePageSchema>;

export const storefrontStatusSchema = z.object({
  status: z.enum(["active", "draft", "maintenance", "offline"]),
});

export type StorefrontStatusFormValues = z.infer<typeof storefrontStatusSchema>;
