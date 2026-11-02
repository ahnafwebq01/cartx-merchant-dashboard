export type StorefrontStatus = "active" | "draft" | "maintenance" | "offline";

export type ViewportMode = "desktop" | "tablet" | "mobile";

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  headerBg: string;
  footerBg: string;
}

export type HeadingFont = "Inter" | "Noto Sans Bengali" | "Poppins" | "Hind Siliguri";
export type BodyFont = "Inter" | "Noto Sans Bengali" | "Roboto" | "Open Sans";
export type FontSizeScale = "sm" | "md" | "lg";

export interface ThemeTypography {
  headingFont: HeadingFont;
  bodyFont: BodyFont;
  baseFontSize: FontSizeScale;
}

export interface HeaderSettings {
  logoUrl?: string;
  logoText: string;
  sticky: boolean;
  showSearch: boolean;
  showCart: boolean;
  announcementEnabled: boolean;
  announcementText: string;
  announcementBg: string;
}

export interface HeroSectionSettings {
  enabled: boolean;
  headline: string;
  headlineBn?: string;
  subheading?: string;
  subheadingBn?: string;
  buttonText: string;
  buttonLink: string;
  bannerStyle: "split" | "centered" | "full";
  imageUrl?: string;
}

export interface FeaturedCategoriesSettings {
  enabled: boolean;
  title: string;
  titleBn?: string;
  layout: "grid" | "carousel";
}

export interface FeaturedProductsSettings {
  enabled: boolean;
  title: string;
  titleBn?: string;
  productCount: number;
}

export interface PromoBannerSettings {
  enabled: boolean;
  headline: string;
  couponCode: string;
  discountText: string;
}

export interface TrustBadgeItem {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  icon: "truck" | "shield-check" | "rotate-ccw" | "credit-card" | "headphones";
}

export interface TrustBadgesSettings {
  enabled: boolean;
  items: TrustBadgeItem[];
}

export interface FooterSettings {
  copyrightText: string;
  showNewsletter: boolean;
  showSocialLinks: boolean;
  showPaymentMethods: boolean;
}

export interface ThemeCustomizationSettings {
  colors: ThemeColors;
  typography: ThemeTypography;
  header: HeaderSettings;
  hero: HeroSectionSettings;
  categories: FeaturedCategoriesSettings;
  products: FeaturedProductsSettings;
  promo: PromoBannerSettings;
  trustBadges: TrustBadgesSettings;
  footer: FooterSettings;
}

export interface StoreTheme {
  id: string;
  name: string;
  nameBn: string;
  description: string;
  tag: "Recommended" | "Popular" | "Catalog" | "Artisan";
  thumbnail: string;
  version: string;
  author: string;
  features: string[];
  isActive: boolean;
  defaultSettings: ThemeCustomizationSettings;
  currentSettings: ThemeCustomizationSettings;
  lastEditedAt?: string;
}

export type DomainConnectionStatus =
  | "active"
  | "demo_pending_verification"
  | "not_connected"
  | "failed";

export type DomainSslStatus =
  | "active"
  | "demo_not_active"
  | "pending_issuance"
  | "expired";

export interface DnsRecordInstruction {
  type: "CNAME" | "A";
  name: string;
  target: string;
  ttl: string;
  description: string;
}

export interface StoreDomain {
  id: string;
  domain: string;
  isDefaultSubdomain: boolean;
  isPrimary: boolean;
  status: DomainConnectionStatus;
  verificationMethod: "cname" | "a_record";
  targetValue: string;
  sslStatus: DomainSslStatus;
  sslIssuer?: string;
  dnsRecords: DnsRecordInstruction[];
  lastCheckedAt?: string;
  createdAt: string;
  verifiedAt?: string;
}

export type PageType = "legal_policy" | "standard_cms";
export type LegalPolicyType = "privacy" | "terms" | "refund" | "shipping";
export type PageStatus = "published" | "draft";

export interface StorePage {
  id: string;
  title: string;
  titleBn?: string;
  slug: string;
  content: string;
  contentBn?: string;
  pageType: PageType;
  policyType?: LegalPolicyType;
  status: PageStatus;
  metaTitle?: string;
  metaDescription?: string;
  viewsCount: number;
  isTemplate?: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StorefrontActivity {
  id: string;
  action:
    | "theme_updated"
    | "theme_activated"
    | "page_created"
    | "page_updated"
    | "page_published"
    | "page_deleted"
    | "domain_added"
    | "domain_removed"
    | "status_changed";
  description: string;
  actor: string;
  timestamp: string;
}

export interface StorefrontOverview {
  status: StorefrontStatus;
  storeName: string;
  defaultUrl: string;
  customDomain?: string;
  activeTheme: StoreTheme;
  totalThemes: number;
  totalPublishedPages: number;
  totalDraftPages: number;
  isCustomDomainConfigured: boolean;
  domainStatus: DomainConnectionStatus;
  sslStatus: DomainSslStatus;
  recentActivities: StorefrontActivity[];
}

export interface PageFilterParams {
  search?: string;
  status?: "all" | "published" | "draft";
  type?: "all" | "legal_policy" | "standard_cms";
}
