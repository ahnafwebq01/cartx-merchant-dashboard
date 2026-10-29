"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Product } from "../types";
import { Edit, Layers, AlertCircle, CheckCircle2 } from "lucide-react";

interface ProductDetailsModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetailsModal({
  product,
  open,
  onOpenChange,
}: ProductDetailsModalProps) {
  if (!product) return null;

  const mainImage = product.images[0]?.url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                product.status === "active"
                  ? "default"
                  : product.status === "draft"
                  ? "secondary"
                  : "outline"
              }
              className="capitalize"
            >
              {product.status}
            </Badge>
            <span className="text-xs text-muted-foreground">SKU: {product.sku}</span>
          </div>
          <DialogTitle className="text-xl font-bold mt-1 text-foreground">
            {product.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Category: {product.category} {product.brand ? `• Brand: ${product.brand}` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 my-2">
          {/* Main Visual & Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-border bg-muted">
              <Image
                src={mainImage}
                alt={product.title}
                fill
                sizes="(max-width: 640px) 100vw, 200px"
                className="object-cover"
                unoptimized
              />
            </div>

            <div className="sm:col-span-2 space-y-3 flex flex-col justify-center">
              <div className="p-3 bg-muted/40 rounded-lg border border-border/60">
                <span className="text-xs text-muted-foreground block">Price (BDT)</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-bold text-primary">
                    ৳{(product.salePrice ?? product.price).toLocaleString("en-BD")}
                  </span>
                  {product.salePrice && product.salePrice < product.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      ৳{product.price.toLocaleString("en-BD")}
                    </span>
                  )}
                </div>
                {product.costPrice && (
                  <span className="text-[11px] text-muted-foreground mt-1 block">
                    Cost per item: ৳{product.costPrice.toLocaleString("en-BD")}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-background rounded-lg border border-border">
                  <span className="text-[11px] text-muted-foreground block">Available Stock</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {product.stock === 0 ? (
                      <>
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        <span className="font-semibold text-sm text-destructive">Out of Stock</span>
                      </>
                    ) : product.stock <= product.lowStockThreshold ? (
                      <>
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        <span className="font-semibold text-sm text-amber-600">
                          {product.stock} units (Low)
                        </span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span className="font-semibold text-sm text-foreground">
                          {product.stock} units
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-2.5 bg-background rounded-lg border border-border">
                  <span className="text-[11px] text-muted-foreground block">Low Stock Alert</span>
                  <span className="font-semibold text-sm text-foreground mt-0.5 block">
                    ≤ {product.lowStockThreshold} units
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          {product.description && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Description
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Variants if present */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" /> Variants ({product.variants.length})
              </h4>
              <div className="border border-border rounded-lg overflow-hidden divide-y divide-border text-xs">
                {product.variants.map((v) => (
                  <div key={v.id} className="flex items-center justify-between p-2.5 bg-card">
                    <div>
                      <span className="font-medium text-foreground">{v.name}</span>
                      <span className="text-muted-foreground ml-2">SKU: {v.sku}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">৳{v.price.toLocaleString("en-BD")}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {v.stock} in stock
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meta & System info */}
          <div className="bg-muted/30 rounded-lg p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground block text-[10px]">Slug</span>
              <span className="font-mono text-[11px] truncate block">{product.slug}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px]">Barcode</span>
              <span className="font-mono text-[11px]">{product.barcode || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px]">Weight</span>
              <span>{product.weight ? `${product.weight} kg` : "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px]">Updated</span>
              <span>{new Date(product.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button asChild>
            <Link href={`/dashboard/products/${product.id}/edit`}>
              <Edit className="h-4 w-4 mr-1.5" /> Edit Product
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
