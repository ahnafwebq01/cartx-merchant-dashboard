import type { CustomerAddress } from "../orders/types";

export type CustomerSegment = "new" | "repeat" | "high_value" | "inactive";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  city: string;
  division: string;
  defaultAddress: CustomerAddress;
  totalOrders: number;
  totalSpend: number;
  averageOrderValue: number;
  lastOrderDate?: string;
  tags: string[];
  segment: CustomerSegment;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFilterParams {
  search?: string;
  segment?: CustomerSegment | "all";
  city?: string;
  tag?: string;
  page?: number;
  limit?: number;
  sortBy?: "spend_desc" | "orders_desc" | "date_desc" | "name_asc";
}

export interface CustomerOverviewStats {
  totalCustomers: number;
  newCustomers: number;
  repeatCustomers: number;
  highValueCustomers: number;
  totalRevenue: number;
  averageCustomerLifetimeValue: number;
}

export interface PaginatedCustomersResult {
  customers: Customer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

