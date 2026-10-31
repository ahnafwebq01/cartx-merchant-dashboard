"use client";

import React from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { OrderItem } from "../types";
import { Package } from "lucide-react";

interface OrderItemsCardProps {
  items: OrderItem[];
}

export function OrderItemsCard({ items }: OrderItemsCardProps) {
  const totalUnits = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <Card className="border border-border shadow-xs">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" />
            <span>Ordered Items</span>
          </div>
          <span className="text-xs text-muted-foreground font-normal">
            {items.length} line item(s) • {totalUnits} total unit(s)
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Product Thumbnail Fallback */}
                <div className="h-12 w-12 rounded-md bg-muted border border-border overflow-hidden shrink-0 relative flex items-center justify-center">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <Package className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                <div className="space-y-0.5 min-w-0">
                  <p className="font-semibold text-foreground text-xs leading-snug">
                    {item.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="font-mono bg-muted/60 px-1 rounded text-[10px]">
                      SKU: {item.sku}
                    </span>
                    {item.variantName && (
                      <span className="text-primary font-medium">
                        {item.variantName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto font-mono text-xs">
                <div className="text-left sm:text-right">
                  <span className="text-muted-foreground text-[11px] block sm:inline mr-1">
                    ৳{item.price.toLocaleString("en-BD")} ×
                  </span>
                  <span className="font-semibold text-foreground">
                    {item.quantity}
                  </span>
                </div>

                <div className="text-right font-bold text-foreground">
                  ৳{item.total.toLocaleString("en-BD")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

