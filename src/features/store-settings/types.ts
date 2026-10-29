export interface StoreSettings {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: "active" | "setup_incomplete" | "suspended";
  storefrontUrl?: string;
  businessCategory: string;
  businessAddress: string;
  district: string;
  cityArea: string;
  postalCode?: string;
  tradeLicenseNo?: string;
  contactEmail: string;
  contactPhone: string;
  ownerName: string;
  currency: string;
  locale: string;
  timezone: string;
  updatedAt?: string;
}

export interface UpdateStoreResponse {
  success: boolean;
  data: StoreSettings;
  message?: string;
}

