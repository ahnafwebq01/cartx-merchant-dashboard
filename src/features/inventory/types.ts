export type StockAdjustmentType =
  | "restock"
  | "damaged"
  | "lost"
  | "manual_correction"
  | "return_restock";

export interface StockAdjustment {
  productId: string;
  variantId?: string;
  type: StockAdjustmentType;
  quantityChange: number; // positive or negative
  reason: string;
  referenceId?: string;
  note?: string;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: StockAdjustmentType;
  quantityChange: number;
  beforeQuantity: number;
  afterQuantity: number;
  reason: string;
  referenceId?: string;
  note?: string;
  actor: string;
  timestamp: string;
}

export interface InventoryOverviewStats {
  totalTrackedProducts: number;
  totalUnitsAvailable: number;
  lowStockCount: number;
  outOfStockCount: number;
  recentAdjustmentCount: number;
}

export interface InventoryItem {
  id: string;
  title: string;
  sku: string;
  category: string;
  stock: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  status: "in_stock" | "low_stock" | "out_of_stock";
  lastAdjustedAt?: string;
  imageUrl?: string;
}
