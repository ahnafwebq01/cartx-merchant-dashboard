"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  OrderFilterParams,
  PaymentMethod,
  PaymentStatus,
} from "../types";
import { Search, X } from "lucide-react";

interface OrderFilterToolbarProps {
  filters: OrderFilterParams;
  onFilterChange: (updates: Partial<OrderFilterParams>) => void;
  onResetFilters: () => void;
  activeStatusTab: string;
  onStatusTabChange: (tab: string) => void;
  totalOrders: number;
}

const STATUS_TABS = [
  { id: "all", label: "All Orders" },
  { id: "pending", label: "Pending" },
  { id: "processing_group", label: "Processing" },
  { id: "shipped_group", label: "In Transit" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled_group", label: "Cancelled / Returns" },
];

export function OrderFilterToolbar({
  filters,
  onFilterChange,
  onResetFilters,
  activeStatusTab,
  onStatusTabChange,
  totalOrders,
}: OrderFilterToolbarProps) {
  const hasActiveFilters = Boolean(
    filters.search ||
    filters.paymentStatus ||
    filters.paymentMethod ||
    filters.courier ||
    filters.datePreset ||
    activeStatusTab !== "all",
  );

  return (
    <div className="space-y-3 bg-card border border-border rounded-lg p-3 shadow-xs">
      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-border/60 scrollbar-none">
        {STATUS_TABS.map((tab) => {
          const isActive = activeStatusTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onStatusTabChange(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
              {tab.id === "all" && totalOrders > 0 && (
                <span className="ml-1 opacity-80 font-mono text-[11px]">
                  ({totalOrders})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search and Dropdown Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order #, customer, phone, tracking ID..."
            value={filters.search || ""}
            onChange={(e) =>
              onFilterChange({ search: e.target.value, page: 1 })
            }
            className="pl-8 text-xs h-9"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Payment Status */}
          <Select
            value={filters.paymentStatus || "all"}
            onValueChange={(val) =>
              onFilterChange({
                paymentStatus: val as PaymentStatus | "all",
                page: 1,
              })
            }
          >
            <SelectTrigger className="h-9 text-xs w-[125px]">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>

          {/* Payment Method */}
          <Select
            value={filters.paymentMethod || "all"}
            onValueChange={(val) =>
              onFilterChange({
                paymentMethod: val as PaymentMethod | "all",
                page: 1,
              })
            }
          >
            <SelectTrigger className="h-9 text-xs w-[120px]">
              <SelectValue placeholder="Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="cod">COD</SelectItem>
              <SelectItem value="bkash">bKash</SelectItem>
              <SelectItem value="nagad">Nagad</SelectItem>
              <SelectItem value="sslcommerz">SSLCommerz</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            </SelectContent>
          </Select>

          {/* Courier */}
          <Select
            value={filters.courier || "all"}
            onValueChange={(val) =>
              onFilterChange({
                courier: val,
                page: 1,
              })
            }
          >
            <SelectTrigger className="h-9 text-xs w-[120px]">
              <SelectValue placeholder="Courier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Couriers</SelectItem>
              <SelectItem value="Steadfast">Steadfast</SelectItem>
              <SelectItem value="Pathao">Pathao</SelectItem>
              <SelectItem value="RedX">RedX</SelectItem>
              <SelectItem value="Paperfly">Paperfly</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Filter */}
          <Select
            value={filters.datePreset || "all"}
            onValueChange={(val) =>
              onFilterChange({
                datePreset: val as OrderFilterParams["datePreset"],
                page: 1,
              })
            }
          >
            <SelectTrigger className="h-9 text-xs w-[120px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last7days">Last 7 Days</SelectItem>
              <SelectItem value="last30days">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="h-9 text-xs text-muted-foreground hover:text-foreground gap-1 px-2"
            >
              <X className="h-3.5 w-3.5" />
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
