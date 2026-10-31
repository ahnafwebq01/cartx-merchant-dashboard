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
import type { CustomerFilterParams, CustomerSegment } from "../types";
import { Search, X } from "lucide-react";

interface CustomerFilterToolbarProps {
  filters: CustomerFilterParams;
  onFilterChange: (updates: Partial<CustomerFilterParams>) => void;
  onResetFilters: () => void;
}

const SEGMENT_TABS: { id: CustomerSegment | "all"; label: string }[] = [
  { id: "all", label: "All Customers" },
  { id: "new", label: "New" },
  { id: "repeat", label: "Repeat Buyers" },
  { id: "high_value", label: "High-Value / VIP" },
  { id: "inactive", label: "Inactive" },
];

export function CustomerFilterToolbar({
  filters,
  onFilterChange,
  onResetFilters,
}: CustomerFilterToolbarProps) {
  const currentSegment = filters.segment || "all";
  const hasActiveFilters = Boolean(
    filters.search || filters.segment !== "all" || filters.city || filters.tag
  );

  return (
    <div className="space-y-3 bg-card border border-border rounded-lg p-3 shadow-xs">
      {/* Segment Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-border/60 scrollbar-none">
        {SEGMENT_TABS.map((tab) => {
          const isActive = currentSegment === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onFilterChange({ segment: tab.id, page: 1 })}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search and Dropdowns */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer name, phone, email, city..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
            className="pl-8 text-xs h-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* City */}
          <Select
            value={filters.city || "all"}
            onValueChange={(val) =>
              onFilterChange({ city: val === "all" ? undefined : val, page: 1 })
            }
          >
            <SelectTrigger className="h-9 text-xs w-[120px]">
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              <SelectItem value="Dhaka">Dhaka</SelectItem>
              <SelectItem value="Chattogram">Chattogram</SelectItem>
              <SelectItem value="Sylhet">Sylhet</SelectItem>
              <SelectItem value="Rajshahi">Rajshahi</SelectItem>
              <SelectItem value="Khulna">Khulna</SelectItem>
              <SelectItem value="Barishal">Barishal</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select
            value={filters.sortBy || "spend_desc"}
            onValueChange={(val) =>
              onFilterChange({
                sortBy: val as CustomerFilterParams["sortBy"],
                page: 1,
              })
            }
          >
            <SelectTrigger className="h-9 text-xs w-[140px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spend_desc">Top Spend</SelectItem>
              <SelectItem value="orders_desc">Most Orders</SelectItem>
              <SelectItem value="date_desc">Recent Activity</SelectItem>
              <SelectItem value="name_asc">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>

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

