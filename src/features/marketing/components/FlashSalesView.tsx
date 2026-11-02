"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Flame,
  Plus,
  Search,
  Package,
  Trash2,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  useFlashSalesQuery,
  useCreateFlashSaleMutation,
  useDeleteFlashSaleMutation,
} from "../hooks";
import { FlashSaleCountdown } from "./FlashSaleCountdown";
import { flashSaleFormSchema, type FlashSaleFormValues } from "../schemas";
import type { FlashSale } from "../types";
import { mockProductService } from "@/features/products/services/mockProducts";

export function FlashSalesView() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<FlashSale | null>(null);

  const { data: flashSales = [], isLoading } = useFlashSalesQuery({
    search,
    status: statusFilter,
  });

  const createMutation = useCreateFlashSaleMutation();
  const deleteMutation = useDeleteFlashSaleMutation();

  // Load available products for selection
  const catalogProducts = mockProductService.getProducts().items;

  // Helper date-time format for inputs
  const [initialDates] = useState(() => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const toLocalIso = (d: Date) =>
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    const now = new Date();
    return {
      start: toLocalIso(now),
      end: toLocalIso(new Date(now.getTime() + 24 * 3600 * 1000)),
    };
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FlashSaleFormValues>({
    resolver: zodResolver(flashSaleFormSchema) as Resolver<FlashSaleFormValues>,
    defaultValues: {
      title: "",
      description: "",
      productId: "",
      originalPrice: 1000,
      discountedPrice: 750,
      allocatedStock: 10,
      perCustomerLimit: 1,
      startTime: initialDates.start,
      endTime: initialDates.end,
      status: "scheduled",
    },
  });

  const selectedProductId = useWatch({ control, name: "productId" });
  const watchedOriginal = useWatch({ control, name: "originalPrice" }) || 0;
  const watchedDiscounted = useWatch({ control, name: "discountedPrice" }) || 0;

  const selectedProduct = catalogProducts.find((p) => p.id === selectedProductId);

  const handleProductSelect = (prodId: string) => {
    const prod = catalogProducts.find((p) => p.id === prodId);
    if (prod) {
      setValue("productId", prod.id, { shouldValidate: true });
      setValue("title", `Flash Deal: ${prod.title}`);
      setValue("originalPrice", prod.price);
      // default 20% discount
      setValue("discountedPrice", Math.round(prod.price * 0.8));
      setValue("allocatedStock", Math.min(prod.stock, 15));
    }
  };

  const openCreateDialog = () => {
    reset({
      title: "",
      description: "",
      productId: "",
      originalPrice: 1000,
      discountedPrice: 750,
      allocatedStock: 10,
      perCustomerLimit: 1,
      startTime: initialDates.start,
      endTime: initialDates.end,
      status: "scheduled",
    });
    setCreateDialogOpen(true);
  };

  const onSubmit = async (values: FlashSaleFormValues) => {
    if (!selectedProduct) return;
    try {
      await createMutation.mutateAsync({
        ...values,
        productTitle: selectedProduct.title,
        productSku: selectedProduct.sku,
        productImage: selectedProduct.images?.[0]?.url,
        availableStock: selectedProduct.stock,
      });
      setCreateDialogOpen(false);
    } catch {
      // Toast shown in mutation hook
    }
  };

  const handleDeleteConfirm = async () => {
    if (saleToDelete) {
      await deleteMutation.mutateAsync(saleToDelete.id);
      setSaleToDelete(null);
    }
  };

  const discountSavingsPercent = watchedOriginal > 0 && watchedDiscounted > 0
    ? (((watchedOriginal - watchedDiscounted) / watchedOriginal) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Flash Sales"
        description="Run urgent, time-boxed promotions with live countdown clocks and allocated unit quotas."
        breadcrumbs={[
          { label: "Marketing", href: "/dashboard/marketing" },
          { label: "Flash Sales" },
        ]}
        actions={
          <Button size="sm" onClick={openCreateDialog} className="h-9">
            <Plus className="h-4 w-4 mr-1.5" />
            Create Flash Sale
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search flash sales by title, product or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-9 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                <SelectItem value="active">Live Now</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="ended">Ended</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Flash Sales Cards Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-muted-foreground">
          Loading flash sale campaigns...
        </div>
      ) : flashSales.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600">
            <Flame className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-foreground text-sm">No Flash Sales Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Schedule high-demand time-limited drops with allocated unit counts to drive impulsive buying.
          </p>
          <Button size="sm" onClick={openCreateDialog} className="mt-2 text-xs">
            <Plus className="h-3.5 w-3.5 mr-1" />
            Create First Flash Sale
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {flashSales.map((sale) => (
            <Card key={sale.id} className="overflow-hidden flex flex-col justify-between border-border hover:border-primary/40 transition-colors">
              <div>
                {/* Product Header Thumbnail & Pricing */}
                <div className="p-4 flex items-start gap-3 border-b border-border/60">
                  <div className="w-16 h-16 rounded-lg bg-muted shrink-0 overflow-hidden relative border border-border">
                    {sale.productImage ? (
                      <Image
                        src={sale.productImage}
                        alt={sale.productTitle}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Package className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-mono text-muted-foreground truncate">
                        {sale.productSku}
                      </span>
                      <Badge variant="destructive" className="text-[10px] font-bold px-1.5 py-0">
                        {sale.discountPercentage}% OFF
                      </Badge>
                    </div>

                    <h4 className="font-semibold text-xs text-foreground line-clamp-1" title={sale.title}>
                      {sale.title}
                    </h4>

                    <div className="flex items-baseline gap-2 pt-0.5">
                      <span className="text-base font-bold text-foreground">
                        ৳{sale.discountedPrice.toLocaleString("en-BD")}
                      </span>
                      <span className="text-xs text-muted-foreground line-through">
                        ৳{sale.originalPrice.toLocaleString("en-BD")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Countdown & Quota Progress Component */}
                <div className="p-4">
                  <FlashSaleCountdown
                    startTime={sale.startTime}
                    endTime={sale.endTime}
                    status={sale.status}
                    claimedStock={sale.claimedStock}
                    allocatedStock={sale.allocatedStock}
                  />
                </div>
              </div>

              {/* Bottom Metrics & Actions */}
              <div className="px-4 py-3 bg-muted/20 border-t border-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" />
                  <span>
                    Revenue: <strong>৳{(sale.revenue || 0).toLocaleString("en-BD")}</strong>
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSaleToDelete(sale)}
                  className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10 text-[11px]"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Flash Sale Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle className="text-base flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-rose-500" />
                Configure Flash Sale Campaign
              </DialogTitle>
              <DialogDescription className="text-xs">
                Choose a product, allocate stock quota, and define discount rate with countdown bounds.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4 text-xs">
              {/* Product Picker */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Select Catalog Product *</Label>
                <Select value={selectedProductId} onValueChange={handleProductSelect}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Choose a product from store inventory..." />
                  </SelectTrigger>
                  <SelectContent>
                    {catalogProducts.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.title} (Stock: {p.stock} • ৳{p.price.toLocaleString("en-BD")})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.productId && (
                  <p className="text-destructive text-[11px]">{errors.productId.message}</p>
                )}
              </div>

              {selectedProduct && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-foreground">{selectedProduct.title}</div>
                    <div className="text-muted-foreground text-[11px]">
                      SKU: {selectedProduct.sku} • Available Warehouse Stock: {selectedProduct.stock} units
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-muted-foreground line-through text-[11px]">
                      ৳{selectedProduct.price}
                    </div>
                    <div className="font-bold text-primary">
                      {discountSavingsPercent}% OFF
                    </div>
                  </div>
                </div>
              )}

              {/* Campaign Title */}
              <div className="space-y-1.5">
                <Label htmlFor="fs-title" className="text-xs font-semibold">
                  Flash Sale Campaign Title *
                </Label>
                <Input
                  id="fs-title"
                  placeholder="e.g. Midnight Rush: Premium Silk Jamdani Drop"
                  {...register("title")}
                  className="h-9"
                />
                {errors.title && <p className="text-destructive text-[11px]">{errors.title.message}</p>}
              </div>

              {/* Pricing Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="fs-orig" className="text-xs font-semibold">
                    Original Regular Price (৳)
                  </Label>
                  <Input
                    id="fs-orig"
                    type="number"
                    readOnly
                    {...register("originalPrice")}
                    className="h-9 bg-muted"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="fs-disc" className="text-xs font-semibold">
                    Flash Sale Price (৳) *
                  </Label>
                  <Input
                    id="fs-disc"
                    type="number"
                    step="any"
                    placeholder="Must be lower than regular price"
                    {...register("discountedPrice")}
                    className="h-9"
                  />
                  {errors.discountedPrice && (
                    <p className="text-destructive text-[11px]">{errors.discountedPrice.message}</p>
                  )}
                </div>
              </div>

              {/* Stock and Limit Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="fs-stock" className="text-xs font-semibold">
                    Allocated Stock Units *
                  </Label>
                  <Input
                    id="fs-stock"
                    type="number"
                    placeholder="e.g. 15 (cannot exceed inventory)"
                    {...register("allocatedStock")}
                    className="h-9"
                  />
                  {errors.allocatedStock && (
                    <p className="text-destructive text-[11px]">{errors.allocatedStock.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="fs-limit" className="text-xs font-semibold">
                    Limit Per Customer
                  </Label>
                  <Input
                    id="fs-limit"
                    type="number"
                    placeholder="e.g. 1"
                    {...register("perCustomerLimit")}
                    className="h-9"
                  />
                </div>
              </div>

              {/* Timings Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="fs-start" className="text-xs font-semibold">
                    Start Time *
                  </Label>
                  <Input
                    id="fs-start"
                    type="datetime-local"
                    {...register("startTime")}
                    className="h-9"
                  />
                  {errors.startTime && (
                    <p className="text-destructive text-[11px]">{errors.startTime.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="fs-end" className="text-xs font-semibold">
                    End Time *
                  </Label>
                  <Input
                    id="fs-end"
                    type="datetime-local"
                    {...register("endTime")}
                    className="h-9"
                  />
                  {errors.endTime && (
                    <p className="text-destructive text-[11px]">{errors.endTime.message}</p>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 bg-muted/40 p-2.5 rounded border border-border">
                <AlertCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>
                  Prevents overlapping flash sales for the same product. Does not decrement physical stock until shopper order placement.
                </span>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting || !selectedProduct}>
                {isSubmitting ? "Creating..." : "Schedule Flash Sale"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={Boolean(saleToDelete)} onOpenChange={() => setSaleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Flash Sale Drop?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel and remove <strong>{saleToDelete?.title}</strong>?
              This will restore standard catalog pricing for this product immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Remove Flash Sale
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
