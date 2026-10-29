export type ProductStatus = "active" | "draft" | "archived";

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>; // e.g. { size: "XL", color: "Navy Blue" }
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isMain?: boolean;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  sku: string;
  barcode?: string;
  shortDescription?: string;
  description?: string;
  category: string;
  brand?: string;
  collections?: string[];
  tags?: string[];
  price: number; // Regular price in BDT
  salePrice?: number; // Discount price in BDT
  costPrice?: number; // Cost per item in BDT
  taxRate?: number; // Tax / VAT %
  stock: number; // Available to sell
  lowStockThreshold: number; // Low stock alert threshold (default 5)
  trackInventory: boolean;
  allowBackorders: boolean;
  status: ProductStatus;
  images: ProductImage[];
  variants?: ProductVariant[];
  weight?: number; // in kg
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  productCount: number;
  sortOrder: number;
}

export interface ProductCollection {
  id: string;
  title: string;
  slug: string;
  description?: string;
  productCount: number;
  published?: boolean;
}

export type ProductSortBy =
  | "createdAt-desc"
  | "createdAt-asc"
  | "price-asc"
  | "price-desc"
  | "title-asc"
  | "title-desc"
  | "stock-asc"
  | "stock-desc";

export interface ProductFilterParams {
  search?: string;
  category?: string;
  status?: ProductStatus | "all";
  stockStatus?: "all" | "in_stock" | "low_stock" | "out_of_stock";
  minPrice?: number;
  maxPrice?: number;
  sortBy?: ProductSortBy;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

