"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StockAdjustmentDialog } from "./StockAdjustmentDialog";
import type { InventoryItem } from "../types";
import { Search, SlidersHorizontal, AlertTriangle, XCircle, CheckCircle2 } from "lucide-react";

interface InventoryTableProps {
  items: InventoryItem[];
}

export function InventoryTable({ items }: InventoryTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedItemForAdjust, setSelectedItemForAdjust] = useState<InventoryItem | null>(null);

  const filteredItems = items.filter((item) => {
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (statusFilter !== "all" && item.status !== statusFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-4">
      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search SKU, product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 text-xs h-9 bg-card"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="text-xs h-9 w-full sm:w-48 bg-card">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Inventory ({items.length})</SelectItem>
              <SelectItem value="in_stock">In Stock</SelectItem>
              <SelectItem value="low_stock">Low Stock</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => setSelectedItemForAdjust(items[0] || null)}
            className="text-xs h-9 whitespace-nowrap"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" /> Adjust Stock
          </Button>
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40 text-xs">
              <TableRow>
                <TableHead className="min-w-[240px]">Product & SKU</TableHead>
                <TableHead className="w-36">Category</TableHead>
                <TableHead className="w-48">Stock Level & Health</TableHead>
                <TableHead className="w-28 text-center">Alert Limit</TableHead>
                <TableHead className="w-32 text-center">Status</TableHead>
                <TableHead className="w-28 text-right">Quick Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-xs text-muted-foreground">
                    No inventory records match your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => {
                  const fallbackImg =
                    item.imageUrl ||
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=80&q=80";

                  // Stock Health Percentage (capped at 50 units for bar scale)
                  const targetCapacity = Math.max(item.lowStockThreshold * 3, 20);
                  const percent = Math.min(100, Math.round((item.stock / targetCapacity) * 100));

                  return (
                    <TableRow key={item.id}>
                      {/* Product & SKU */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-9 w-9 shrink-0 rounded-md overflow-hidden border border-border bg-muted">
                            <Image
                              src={fallbackImg}
                              alt={item.title}
                              fill
                              sizes="36px"
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-xs text-foreground line-clamp-1">
                              {item.title}
                            </span>
                            <span className="font-mono text-[11px] text-muted-foreground">
                              {item.sku}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell className="text-xs text-muted-foreground">
                        {item.category}
                      </TableCell>

                      {/* Stock Level & Visual Capacity Meter (21st.dev inspired) */}
                      <TableCell>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-foreground">
                              {item.stock} units
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              {percent}%
                            </span>
                          </div>
                          {/* Visual Meter Bar */}
                          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 rounded-full ${
                                item.stock === 0
                                  ? "bg-destructive w-full"
                                  : item.stock <= item.lowStockThreshold
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              }`}
                              style={{ width: `${Math.max(percent, item.stock > 0 ? 8 : 0)}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>

                      {/* Low Stock Alert Limit */}
                      <TableCell className="text-center font-mono text-xs text-muted-foreground">
                        ≤ {item.lowStockThreshold}
                      </TableCell>

                      {/* Status Badge */}
                      <TableCell className="text-center">
                        {item.status === "out_of_stock" ? (
                          <Badge variant="destructive" className="text-[10px] gap-1 px-2 py-0.5">
                            <XCircle className="h-3 w-3" /> Out of Stock
                          </Badge>
                        ) : item.status === "low_stock" ? (
                          <Badge
                            variant="outline"
                            className="text-[10px] gap-1 px-2 py-0.5 border-amber-500/50 bg-amber-500/10 text-amber-600"
                          >
                            <AlertTriangle className="h-3 w-3" /> Low Stock
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-[10px] gap-1 px-2 py-0.5 border-emerald-500/40 bg-emerald-500/10 text-emerald-600"
                          >
                            <CheckCircle2 className="h-3 w-3" /> In Stock
                          </Badge>
                        )}
                      </TableCell>

                      {/* Action */}
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedItemForAdjust(item)}
                          className="h-7 text-xs"
                        >
                          Adjust
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      <StockAdjustmentDialog
        item={selectedItemForAdjust}
        allItems={items}
        open={Boolean(selectedItemForAdjust)}
        onOpenChange={(open) => !open && setSelectedItemForAdjust(null)}
      />
    </div>
  );
}

