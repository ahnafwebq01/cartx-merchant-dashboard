"use client";

import React from "react";
import Link from "next/link";
import { Search, Plus, RotateCcw, Download, Trash2, Archive, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { ProductCategory, ProductFilterParams, ProductSortBy } from "../types";

interface ProductFilterToolbarProps {
  filters: ProductFilterParams;
  onFilterChange: (updates: Partial<ProductFilterParams>) => void;
  categories: ProductCategory[];
  selectedCount: number;
  onBulkArchive: () => void;
  onBulkDelete: () => void;
  onClearSelection: () => void;
  onOpenImportExport: () => void;
  onResetDemoData: () => void;
  totalProducts?: number;
}

export function ProductFilterToolbar({
  filters,
  onFilterChange,
  categories,
  selectedCount,
  onBulkArchive,
  onBulkDelete,
  onClearSelection,
  onOpenImportExport,
  onResetDemoData,
}: ProductFilterToolbarProps) {
  const currentStatus = filters.status || "all";

  return (
    <div className="space-y-3">
      {/* Top Status Tabs & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-lg border border-border w-fit overflow-x-auto">
          {(
            [
              { label: "All Products", value: "all" },
              { label: "Active", value: "active" },
              { label: "Drafts", value: "draft" },
              { label: "Archived", value: "archived" },
            ] as const
          ).map((tab) => {
            const isActive = currentStatus === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onFilterChange({ status: tab.value, page: 1 })}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenImportExport}
            className="text-xs h-9"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" /> Import/Export
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetDemoData}
            title="Reset to default Bangladesh demo catalog"
            className="text-xs h-9 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset Demo
          </Button>

          <Button asChild size="sm" className="text-xs h-9">
            <Link href="/dashboard/products/new">
              <Plus className="h-4 w-4 mr-1.5" /> Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Bulk Actions Banner (Shown when items are selected) */}
      {selectedCount > 0 ? (
        <div className="flex items-center justify-between p-2.5 px-3 bg-primary/10 border border-primary/20 rounded-lg text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-[10px]">
              {selectedCount} selected
            </Badge>
            <span className="text-muted-foreground">Select bulk action:</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onBulkArchive}
              className="h-7 text-xs bg-background"
            >
              <Archive className="h-3 w-3 mr-1" /> Archive
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={onBulkDelete}
              className="h-7 text-xs"
            >
              <Trash2 className="h-3 w-3 mr-1" /> Delete
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="h-7 text-xs text-muted-foreground"
            >
              <X className="h-3.5 w-3.5 mr-1" /> Cancel
            </Button>
          </div>
        </div>
      ) : (
        /* Standard Search and Filter Row */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title, SKU, brand..."
              value={filters.search || ""}
              onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
              className="pl-8 text-xs h-9 bg-card"
            />
          </div>

          {/* Category Filter */}
          <Select
            value={filters.category || "all"}
            onValueChange={(val) => onFilterChange({ category: val, page: 1 })}
          >
            <SelectTrigger className="text-xs h-9 bg-card">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Stock Status Filter */}
          <Select
            value={filters.stockStatus || "all"}
            onValueChange={(val) =>
              onFilterChange({
                stockStatus: val as ProductFilterParams["stockStatus"],
                page: 1,
              })
            }
          >
            <SelectTrigger className="text-xs h-9 bg-card">
              <SelectValue placeholder="All Stock Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock Levels</SelectItem>
              <SelectItem value="in_stock">In Stock (&gt; Low)</SelectItem>
              <SelectItem value="low_stock">Low Stock (≤ Alert)</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock (0 units)</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort By Selector */}
          <Select
            value={filters.sortBy || "createdAt-desc"}
            onValueChange={(val) =>
              onFilterChange({ sortBy: val as ProductSortBy, page: 1 })
            }
          >
            <SelectTrigger className="text-xs h-9 bg-card">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc">Newest Added</SelectItem>
              <SelectItem value="createdAt-asc">Oldest Added</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="stock-asc">Stock: Low to High</SelectItem>
              <SelectItem value="stock-desc">Stock: High to Low</SelectItem>
              <SelectItem value="title-asc">Title: A to Z</SelectItem>
              <SelectItem value="title-desc">Title: Z to A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
