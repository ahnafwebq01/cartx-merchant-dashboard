"use client";

import React, { useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Search,
  Percent,
  Store,
  Layers,
  Package,
  AlertTriangle,
  Edit2,
  Trash2,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDiscountsQuery,
  useCreateDiscountMutation,
  useUpdateDiscountMutation,
  useDeleteDiscountMutation,
} from "../hooks";
import {
  promotionalDiscountFormSchema,
  type PromotionalDiscountFormValues,
} from "../schemas";
import type { PromotionalDiscount } from "../types";

export function DiscountsListView() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scopeFilter, setScopeFilter] = useState("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<PromotionalDiscount | null>(null);
  const [discountToDelete, setDiscountToDelete] = useState<PromotionalDiscount | null>(null);

  const { data: discounts = [], isLoading } = useDiscountsQuery({
    search,
    status: statusFilter,
    scope: scopeFilter,
  });

  const createMutation = useCreateDiscountMutation();
  const updateMutation = useUpdateDiscountMutation();
  const deleteMutation = useDeleteDiscountMutation();

  const [initialDates] = useState(() => ({
    start: new Date().toISOString().split("T")[0],
    end: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split("T")[0],
  }));

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PromotionalDiscountFormValues>({
    resolver: zodResolver(promotionalDiscountFormSchema) as Resolver<PromotionalDiscountFormValues>,
    defaultValues: {
      name: "",
      description: "",
      discountType: "percentage",
      discountValue: 10,
      scope: "storewide",
      targetCategories: [],
      targetProducts: [],
      minOrderAmount: 1000,
      startDate: initialDates.start,
      endDate: initialDates.end,
      status: "active",
    },
  });

  const watchedScope = useWatch({ control, name: "scope" });
  const watchedType = useWatch({ control, name: "discountType" });
  const watchedTargetCategories = useWatch({ control, name: "targetCategories" }) || [];

  const openCreateDialog = () => {
    setEditingDiscount(null);
    reset({
      name: "",
      description: "",
      discountType: "percentage",
      discountValue: 10,
      scope: "storewide",
      targetCategories: [],
      targetProducts: [],
      minOrderAmount: 1000,
      startDate: initialDates.start,
      endDate: initialDates.end,
      status: "active",
    });
    setDialogOpen(true);
  };

  const openEditDialog = (discount: PromotionalDiscount) => {
    setEditingDiscount(discount);
    reset({
      name: discount.name,
      description: discount.description || "",
      discountType: discount.discountType,
      discountValue: discount.discountValue,
      scope: discount.scope,
      targetCategories: discount.targetCategories || [],
      targetProducts: discount.targetProducts || [],
      minOrderAmount: discount.minOrderAmount || 0,
      startDate: discount.startDate.split("T")[0],
      endDate: discount.endDate.split("T")[0],
      status: discount.status,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values: PromotionalDiscountFormValues) => {
    try {
      if (editingDiscount) {
        await updateMutation.mutateAsync({ id: editingDiscount.id, data: values });
      } else {
        await createMutation.mutateAsync(values);
      }
      setDialogOpen(false);
    } catch {
      // toast shown in mutation
    }
  };

  const handleDeleteConfirm = async () => {
    if (discountToDelete) {
      await deleteMutation.mutateAsync(discountToDelete.id);
      setDiscountToDelete(null);
    }
  };

  // Conflict warning check: Is there an active storewide discount?
  const hasActiveStorewide = discounts.some(
    (d) => d.status === "active" && d.scope === "storewide"
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Discounts & Promotions"
        description="Configure automatic storewide, category, or product price cuts applied dynamically at checkout."
        breadcrumbs={[
          { label: "Marketing", href: "/dashboard/marketing" },
          { label: "Discounts" },
        ]}
        actions={
          <Button size="sm" onClick={openCreateDialog} className="h-9">
            <Plus className="h-4 w-4 mr-1.5" />
            Create Campaign
          </Button>
        }
      />

      {/* Conflict Prevention Callout */}
      {hasActiveStorewide && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3.5 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold">Discount Precedence & Conflict Rules:</div>
            <div>
              An active <strong>storewide discount</strong> is currently running. Under CartX pricing rules, storewide markdowns apply across eligible carts; items already under product-specific promotion will adopt the highest single discount rate to avoid unintended double-stacking.
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search promotions by title or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px] h-9 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="ended">Ended</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>

              <Select value={scopeFilter} onValueChange={setScopeFilter}>
                <SelectTrigger className="w-[140px] h-9 text-xs">
                  <SelectValue placeholder="Scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Scopes</SelectItem>
                  <SelectItem value="storewide">Storewide</SelectItem>
                  <SelectItem value="category">Category-Specific</SelectItem>
                  <SelectItem value="product">Product-Specific</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Discounts Table */}
      <Card>
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold text-xs">Campaign Name</TableHead>
                <TableHead className="font-semibold text-xs">Scope</TableHead>
                <TableHead className="font-semibold text-xs">Rate</TableHead>
                <TableHead className="font-semibold text-xs">Min Spend</TableHead>
                <TableHead className="font-semibold text-xs">Orders Attributed</TableHead>
                <TableHead className="font-semibold text-xs">Revenue (৳)</TableHead>
                <TableHead className="font-semibold text-xs">Savings Given (৳)</TableHead>
                <TableHead className="font-semibold text-xs">Status</TableHead>
                <TableHead className="font-semibold text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center text-xs text-muted-foreground">
                    Loading discount campaigns...
                  </TableCell>
                </TableRow>
              ) : discounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center text-xs text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Percent className="h-8 w-8 text-muted-foreground/40" />
                      <span>No discount campaigns found matching the filter.</span>
                      <Button variant="outline" size="sm" onClick={openCreateDialog} className="mt-2 text-xs">
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Create First Campaign
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                discounts.map((discount) => (
                  <TableRow key={discount.id} className="text-xs">
                    {/* Name & Description */}
                    <TableCell>
                      <div className="font-semibold text-foreground">{discount.name}</div>
                      <div className="text-[11px] text-muted-foreground line-clamp-1 max-w-xs">
                        {discount.description || "Automatic checkout promotion"}
                      </div>
                    </TableCell>

                    {/* Scope Badge */}
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] capitalize flex items-center gap-1 w-fit">
                        {discount.scope === "storewide" ? (
                          <Store className="h-3 w-3" />
                        ) : discount.scope === "category" ? (
                          <Layers className="h-3 w-3" />
                        ) : (
                          <Package className="h-3 w-3" />
                        )}
                        {discount.scope}
                      </Badge>
                    </TableCell>

                    {/* Rate */}
                    <TableCell className="font-semibold text-foreground">
                      {discount.discountType === "percentage"
                        ? `${discount.discountValue}% OFF`
                        : `৳${discount.discountValue.toLocaleString("en-BD")} OFF`}
                    </TableCell>

                    {/* Min Spend */}
                    <TableCell>
                      {discount.minOrderAmount && discount.minOrderAmount > 0 ? (
                        <span>৳{discount.minOrderAmount.toLocaleString("en-BD")}</span>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </TableCell>

                    {/* Orders count */}
                    <TableCell className="font-mono">{discount.ordersCount}</TableCell>

                    {/* Revenue */}
                    <TableCell className="font-semibold text-foreground">
                      ৳{(discount.revenueAttributed || 0).toLocaleString("en-BD")}
                    </TableCell>

                    {/* Total savings given */}
                    <TableCell className="text-amber-600 font-medium">
                      ৳{(discount.totalDiscountGiven || 0).toLocaleString("en-BD")}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        variant={
                          discount.status === "active"
                            ? "success"
                            : discount.status === "scheduled"
                            ? "warning"
                            : discount.status === "ended"
                            ? "outline"
                            : "secondary"
                        }
                        className="text-[10px] capitalize"
                      >
                        {discount.status}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(discount)}
                          className="h-8 w-8 p-0"
                          title="Edit Campaign"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDiscountToDelete(discount)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          title="Delete Campaign"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card-Based Transformation View */}
        <div className="block lg:hidden">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              Loading discount campaigns...
            </div>
          ) : discounts.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              <div className="flex flex-col items-center justify-center gap-2">
                <Percent className="h-8 w-8 text-muted-foreground/40" />
                <span>No discount campaigns found matching the filter.</span>
                <Button variant="outline" size="sm" onClick={openCreateDialog} className="mt-2 text-xs">
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Create First Campaign
                </Button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {discounts.map((discount) => (
                <div key={discount.id} className="p-4 space-y-3">
                  {/* Top: Name, Status, Action buttons */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="font-semibold text-xs text-foreground block truncate">
                        {discount.name}
                      </span>
                      <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                        {discount.description || "Automatic checkout promotion"}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Badge
                        variant={
                          discount.status === "active"
                            ? "success"
                            : discount.status === "scheduled"
                            ? "warning"
                            : discount.status === "ended"
                            ? "outline"
                            : "secondary"
                        }
                        className="text-[10px] capitalize"
                      >
                        {discount.status}
                      </Badge>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(discount)}
                        className="h-7 w-7 p-0"
                        title="Edit Campaign"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDiscountToDelete(discount)}
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        title="Delete Campaign"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Scope & Discount Rate */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border/40">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">Scope</span>
                      <Badge variant="outline" className="text-[10px] capitalize flex items-center gap-1 w-fit mt-0.5">
                        {discount.scope === "storewide" ? (
                          <Store className="h-3 w-3" />
                        ) : discount.scope === "category" ? (
                          <Layers className="h-3 w-3" />
                        ) : (
                          <Package className="h-3 w-3" />
                        )}
                        {discount.scope}
                      </Badge>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">Discount Rate</span>
                      <span className="font-bold text-sm text-foreground">
                        {discount.discountType === "percentage"
                          ? `${discount.discountValue}% OFF`
                          : `৳${discount.discountValue.toLocaleString("en-BD")} OFF`}
                      </span>
                    </div>
                  </div>

                  {/* Min Spend */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
                    <span className="text-[11px] text-muted-foreground">Minimum Spend Threshold</span>
                    <span className="font-medium text-foreground">
                      {discount.minOrderAmount && discount.minOrderAmount > 0
                        ? `৳${discount.minOrderAmount.toLocaleString("en-BD")}`
                        : "None (No minimum)"}
                    </span>
                  </div>

                  {/* Performance stats row */}
                  <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-border/40 bg-muted/20 p-2 rounded-md">
                    <div>
                      <span className="text-[10px] uppercase text-muted-foreground tracking-wider block">Orders</span>
                      <span className="font-mono font-bold text-foreground">{discount.ordersCount}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] uppercase text-muted-foreground tracking-wider block">Revenue</span>
                      <span className="font-mono font-bold text-foreground">
                        ৳{(discount.revenueAttributed || 0).toLocaleString("en-BD")}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase text-muted-foreground tracking-wider block">Savings</span>
                      <span className="font-mono font-bold text-amber-600">
                        ৳{(discount.totalDiscountGiven || 0).toLocaleString("en-BD")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Create / Edit Campaign Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle className="text-base">
                {editingDiscount ? "Edit Discount Campaign" : "Create Promotional Campaign"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Configure automated price reductions applied directly to qualifying items.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4 text-xs">
              <div className="space-y-1.5">
                <Label htmlFor="campaign-name" className="text-xs font-semibold">
                  Campaign Title *
                </Label>
                <Input
                  id="campaign-name"
                  placeholder="e.g. Boishakhi 10% Storewide Markdown"
                  {...register("name")}
                  className="h-9"
                />
                {errors.name && <p className="text-destructive text-[11px]">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="campaign-desc" className="text-xs font-semibold">
                  Description
                </Label>
                <Input
                  id="campaign-desc"
                  placeholder="e.g. Automatic discount applied to all apparel orders above ৳1,500"
                  {...register("description")}
                  className="h-9"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Discount Type *</Label>
                  <Select
                    value={watchedType}
                    onValueChange={(val) =>
                      setValue("discountType", val as "percentage" | "fixed", {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed BDT (৳)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="discount-val" className="text-xs font-semibold">
                    {watchedType === "percentage" ? "Rate (% Off) *" : "Amount (৳ Off) *"}
                  </Label>
                  <Input
                    id="discount-val"
                    type="number"
                    step="any"
                    placeholder="e.g. 10"
                    {...register("discountValue")}
                    className="h-9"
                  />
                  {errors.discountValue && (
                    <p className="text-destructive text-[11px]">{errors.discountValue.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Promotional Scope *</Label>
                  <Select
                    value={watchedScope}
                    onValueChange={(val) =>
                      setValue("scope", val as "storewide" | "category" | "product", {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Scope" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="storewide">Storewide (All Catalog)</SelectItem>
                      <SelectItem value="category">Category-Specific</SelectItem>
                      <SelectItem value="product">Product-Specific</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="min-spend" className="text-xs font-semibold">
                    Min Order Spend (৳)
                  </Label>
                  <Input
                    id="min-spend"
                    type="number"
                    placeholder="e.g. 1500"
                    {...register("minOrderAmount")}
                    className="h-9"
                  />
                </div>
              </div>

              {watchedScope === "category" && (
                <div className="space-y-1.5 bg-muted/40 p-2.5 rounded-lg border border-border">
                  <Label className="text-xs font-semibold">Target Categories</Label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["Apparel & Fashion", "Traditional Handloom", "Organic & Groceries", "Leather Goods", "Heritage Crafts"].map((cat) => {
                      const isSelected = watchedTargetCategories.includes(cat);
                      return (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => {
                            if (isSelected) {
                              setValue("targetCategories", watchedTargetCategories.filter((c) => c !== cat));
                            } else {
                              setValue("targetCategories", [...watchedTargetCategories, cat]);
                            }
                          }}
                          className={`px-2 py-1 rounded text-[11px] border transition-colors ${
                            isSelected
                              ? "bg-primary text-white border-primary"
                              : "bg-background text-muted-foreground border-border hover:border-foreground"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                  {errors.targetCategories && (
                    <p className="text-destructive text-[11px]">{errors.targetCategories.message}</p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="disc-start" className="text-xs font-semibold">
                    Start Date *
                  </Label>
                  <Input id="disc-start" type="date" {...register("startDate")} className="h-9" />
                  {errors.startDate && (
                    <p className="text-destructive text-[11px]">{errors.startDate.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="disc-end" className="text-xs font-semibold">
                    End Date *
                  </Label>
                  <Input id="disc-end" type="date" {...register("endDate")} className="h-9" />
                  {errors.endDate && (
                    <p className="text-destructive text-[11px]">{errors.endDate.message}</p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingDiscount ? "Update Campaign" : "Save Campaign"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={Boolean(discountToDelete)} onOpenChange={() => setDiscountToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Promotional Campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove campaign <strong>{discountToDelete?.name}</strong>?
              This markdown will immediately cease applying to carts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Delete Campaign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
