"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProductDetailsModal } from "./ProductDetailsModal";
import type { Product, PaginatedResult } from "../types";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Archive,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";

interface ProductListTableProps {
  data: PaginatedResult<Product>;
  selectedIds: string[];
  onSelectId: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onDuplicate: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onClearFilters: () => void;
}

export function ProductListTable({
  data,
  selectedIds,
  onSelectId,
  onSelectAll,
  onPageChange,
  onLimitChange,
  onDuplicate,
  onArchive,
  onDelete,
  onClearFilters,
}: ProductListTableProps) {
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  const isAllSelected =
    data.items.length > 0 && data.items.every((p) => selectedIds.includes(p.id));

  const productToDelete = data.items.find((p) => p.id === deleteProductId);

  return (
    <>
      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40 text-xs">
              <TableRow>
                <TableHead className="w-10 px-3">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={(checked) => onSelectAll(Boolean(checked))}
                    aria-label="Select all products on page"
                  />
                </TableHead>
                <TableHead className="min-w-[240px]">Product</TableHead>
                <TableHead className="w-32">SKU</TableHead>
                <TableHead className="w-32">Category</TableHead>
                <TableHead className="w-28 text-right">Price</TableHead>
                <TableHead className="w-28 text-center">Stock</TableHead>
                <TableHead className="w-24 text-center">Status</TableHead>
                <TableHead className="w-28 text-right">Updated</TableHead>
                <TableHead className="w-12 text-center" aria-label="Actions"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="p-3 bg-muted rounded-full text-muted-foreground">
                        <Package className="h-8 w-8" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-sm text-foreground">
                          No products found
                        </h4>
                        <p className="text-xs text-muted-foreground max-w-sm">
                          No items match your active search or filters. Try adjusting your query or reset filters.
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={onClearFilters}>
                        Reset All Filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.items.map((product) => {
                  const isSelected = selectedIds.includes(product.id);
                  const mainImage =
                    product.images[0]?.url ||
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&q=80";

                  return (
                    <TableRow
                      key={product.id}
                      className={isSelected ? "bg-muted/30" : undefined}
                    >
                      {/* Checkbox */}
                      <TableCell className="px-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            onSelectId(product.id, Boolean(checked))
                          }
                          aria-label={`Select ${product.title}`}
                        />
                      </TableCell>

                      {/* Product Thumbnail & Title */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 rounded-md overflow-hidden border border-border bg-muted">
                            <Image
                              src={mainImage}
                              alt={product.title}
                              fill
                              sizes="40px"
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <Link
                              href={`/dashboard/products/${product.id}/edit`}
                              className="font-medium text-xs text-foreground hover:text-primary transition-colors line-clamp-1"
                            >
                              {product.title}
                            </Link>
                            {product.brand && (
                              <span className="text-[11px] text-muted-foreground">
                                {product.brand}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* SKU */}
                      <TableCell>
                        <span className="font-mono text-xs text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                          {product.sku}
                        </span>
                      </TableCell>

                      {/* Category */}
                      <TableCell className="text-xs text-muted-foreground">
                        {product.category}
                      </TableCell>

                      {/* Price in BDT */}
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-semibold text-xs text-foreground">
                            ৳{(product.salePrice ?? product.price).toLocaleString("en-BD")}
                          </span>
                          {product.salePrice && product.salePrice < product.price && (
                            <span className="text-[10px] text-muted-foreground line-through">
                              ৳{product.price.toLocaleString("en-BD")}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Stock Level */}
                      <TableCell className="text-center">
                        {product.stock === 0 ? (
                          <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                            Out of stock
                          </Badge>
                        ) : product.stock <= product.lowStockThreshold ? (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 border-amber-500/50 bg-amber-500/10 text-amber-600"
                          >
                            Low ({product.stock})
                          </Badge>
                        ) : (
                          <span className="text-xs font-medium text-foreground">
                            {product.stock}
                          </span>
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            product.status === "active"
                              ? "default"
                              : product.status === "draft"
                              ? "secondary"
                              : "outline"
                          }
                          className="capitalize text-[10px] px-2 py-0"
                        >
                          {product.status}
                        </Badge>
                      </TableCell>

                      {/* Updated Date */}
                      <TableCell className="text-right text-[11px] text-muted-foreground">
                        {new Date(product.updatedAt).toLocaleDateString("en-BD", {
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>

                      {/* Row Actions Menu */}
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              aria-label={`Actions for ${product.title}`}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 text-xs">
                            <DropdownMenuLabel className="text-[10px]">
                              Actions
                            </DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setViewProduct(product)}>
                              <Eye className="h-3.5 w-3.5 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/products/${product.id}/edit`}>
                                <Edit className="h-3.5 w-3.5 mr-2" /> Edit Product
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDuplicate(product.id)}>
                              <Copy className="h-3.5 w-3.5 mr-2" /> Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onArchive(product.id)}>
                              <Archive className="h-3.5 w-3.5 mr-2" />
                              {product.status === "archived" ? "Unarchive" : "Archive"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteProductId(product.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        {data.total > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 border-t border-border bg-muted/20 text-xs text-muted-foreground">
            <div>
              Showing{" "}
              <span className="font-semibold text-foreground">
                {(data.page - 1) * data.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-foreground">
                {Math.min(data.page * data.limit, data.total)}
              </span>{" "}
              of <span className="font-semibold text-foreground">{data.total}</span> products
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px]">Rows per page:</span>
              <select
                aria-label="Rows per page"
                value={data.limit}
                onChange={(e) => onLimitChange(Number(e.target.value))}
                className="h-7 text-xs bg-background border border-border rounded px-1.5 focus:outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>

              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  disabled={data.page <= 1}
                  onClick={() => onPageChange(data.page - 1)}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <span className="px-2 font-medium text-foreground">
                  {data.page} / {data.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  disabled={data.page >= data.totalPages}
                  onClick={() => onPageChange(data.page + 1)}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick View Details Modal */}
      <ProductDetailsModal
        product={viewProduct}
        open={Boolean(viewProduct)}
        onOpenChange={(open) => !open && setViewProduct(null)}
      />

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={Boolean(deleteProductId)}
        onOpenChange={(open) => !open && setDeleteProductId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base text-destructive flex items-center gap-2">
              <Trash2 className="h-4 w-4" /> Delete Product
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Are you sure you want to permanently delete{" "}
              <strong className="text-foreground">
                &ldquo;{productToDelete?.title}&rdquo;
              </strong>{" "}
              (SKU: {productToDelete?.sku})? This action cannot be undone.
              <br />
              <span className="mt-2 block text-muted-foreground text-[11px]">
                Tip: If this product has historical orders, consider archiving it instead so sales reports remain consistent.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs"
              onClick={() => {
                if (deleteProductId) {
                  onDelete(deleteProductId);
                  setDeleteProductId(null);
                }
              }}
            >
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
