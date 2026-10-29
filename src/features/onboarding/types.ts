export interface StoreIdentityData {
  storeName: string;
  storeSlug: string;
  businessType: string;
  ownerName: string;
  contactEmail: string;
  contactPhone: string;
}

export interface BusinessInfoData {
  businessAddress: string;
  district: string;
  cityArea: string;
  postalCode?: string;
  businessCategory: string;
  tradeLicenseNo?: string;
}

export interface StorefrontSetupData {
  storeDescription: string;
  brandColor: string;
  themeId: string;
  logoUrl?: string;
}

export interface FirstProductData {
  productName: string;
  price: number;
  initialStock: number;
  category: string;
  imageUrl?: string;
}

export interface PaymentSetupData {
  cashOnDelivery: boolean;
  onlineProvider?: string;
  providerStatus: "unconfigured" | "connected" | "failed" | "unavailable";
}

export interface ShippingSetupData {
  insideDhakaRate: number;
  outsideDhakaRate: number;
  freeShippingThreshold?: number;
  courierPartner?: string;
}

export interface OnboardingDraft {
  storeId?: string;
  currentStep: number;
  completedSteps: number[];
  step1?: StoreIdentityData;
  step2?: BusinessInfoData;
  step3?: StorefrontSetupData;
  step4?: FirstProductData;
  step5?: PaymentSetupData;
  step6?: ShippingSetupData;
  isPublished?: boolean;
  publishedAt?: string;
  storefrontUrl?: string;
}

export interface SlugCheckResult {
  available: boolean;
  slug: string;
  message?: string;
}

export interface PublishStoreResult {
  success: boolean;
  storefrontUrl: string;
  publishedAt: string;
  message?: string;
}

export interface OnboardingStepDefinition {
  step: number;
  id: string;
  title: string;
  titleBn: string;
  description: string;
  path: string;
  isOptional?: boolean;
}

