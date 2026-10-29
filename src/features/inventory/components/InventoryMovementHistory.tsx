"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { InventoryMovement } from "../types";
import { Search, ArrowRight, User } from "lucide-react";

interface InventoryMovementHistoryProps {
  movements: InventoryMovement[];
}

export function InventoryMovementHistory({
  movements,
}: InventoryMovementHistoryProps) {
  const [search, setSearch] = useState("");

  const filtered = movements.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      m.productName.toLowerCase().includes(q) ||
      m.sku.toLowerCase().includes(q) ||
      m.reason.toLowerCase().includes(q) ||
      (m.referenceId && m.referenceId.toLowerCase().includes(q))
    );
  });

  const getTypeBadge = (type: InventoryMovement["type"]) => {
    switch (type) {
      case "restock":
        return (
          <Badge className="bg-emerald-600/15 text-emerald-700 border-emerald-600/30 text-[10px] capitalize">
            Restock
          </Badge>
        );
      case "return_restock":
        return (
          <Badge className="bg-blue-600/15 text-blue-700 border-blue-600/30 text-[10px] capitalize">
            Return Restock
          </Badge>
        );
      case "damaged":
        return (
          <Badge variant="destructive" className="text-[10px] capitalize">
            Damaged
          </Badge>
        );
      case "lost":
        return (
          <Badge variant="destructive" className="text-[10px] capitalize">
            Lost / Shrinkage
          </Badge>
        );
      case "manual_correction":
      default:
        return (
          <Badge variant="outline" className="text-[10px] capitalize">
            Correction
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-3">
      {/* Search toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search movement logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 text-xs h-9 bg-card"
          />
        </div>
        <span className="text-xs text-muted-foreground">
          Showing {filtered.length} adjustment records
        </span>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40 text-xs">
              <TableRow>
                <TableHead className="w-36">Date & Time</TableHead>
                <TableHead className="min-w-[200px]">Product & SKU</TableHead>
                <TableHead className="w-28">Type</TableHead>
                <TableHead className="w-24 text-center">Change</TableHead>
                <TableHead className="w-32 text-center">
                  Balance (Before → After)
                </TableHead>
                <TableHead className="min-w-[220px]">Reason & Note</TableHead>
                <TableHead className="w-32 text-right">Actor</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-36 text-center text-xs text-muted-foreground"
                  >
                    No adjustment movements found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((m) => (
                  <TableRow key={m.id} className="text-xs">
                    {/* Timestamp */}
                    <TableCell className="font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                      {new Date(m.timestamp).toLocaleDateString("en-BD", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>

                    {/* Product & SKU */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {m.productName}
                        </span>
                        <span className="text-muted-foreground text-[10px] font-mono">
                          {m.sku}
                        </span>
                      </div>
                    </TableCell>

                    {/* Type Badge */}
                    <TableCell>{getTypeBadge(m.type)}</TableCell>

                    {/* Quantity Change */}
                    <TableCell className="text-center font-mono font-semibold">
                      <span
                        className={
                          m.quantityChange > 0
                            ? "text-emerald-600"
                            : m.quantityChange < 0
                              ? "text-destructive"
                              : "text-muted-foreground"
                        }
                      >
                        {m.quantityChange > 0
                          ? `+${m.quantityChange}`
                          : m.quantityChange}
                      </span>
                    </TableCell>

                    {/* Before -> After Balance */}
                    <TableCell className="text-center font-mono text-[11px]">
                      <div className="inline-flex items-center gap-1.5 text-muted-foreground">
                        <span>{m.beforeQuantity}</span>
                        <ArrowRight className="h-3 w-3" />
                        <span className="font-semibold text-foreground">
                          {m.afterQuantity}
                        </span>
                      </div>
                    </TableCell>

                    {/* Reason */}
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-foreground leading-tight">
                          {m.reason}
                        </p>
                        {m.referenceId && (
                          <span className="text-[10px] text-muted-foreground font-mono block">
                            Ref: {m.referenceId}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Actor */}
                    <TableCell className="text-right text-[11px] text-muted-foreground">
                      <div className="inline-flex items-center gap-1">
                        <User className="h-3 w-3 text-muted-foreground/80" />
                        <span>{m.actor}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
