"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Copy,
  Check,
  Edit2,
  Trash2,
  Ticket,
  Power,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useCouponsQuery,
  useDeleteCouponMutation,
  useToggleCouponStatusMutation,
} from "../hooks";
import type { Coupon } from "../types";
import { toast } from "sonner";

export function CouponsListView() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);

  const { data: coupons = [], isLoading } = useCouponsQuery({
    search,
    status: statusFilter,
    type: typeFilter,
  });

  const deleteMutation = useDeleteCouponMutation();
  const toggleMutation = useToggleCouponStatusMutation();

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success(`Coupon code "${code}" copied to clipboard!`);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const handleDeleteConfirm = async () => {
    if (couponToDelete) {
      await deleteMutation.mutateAsync(couponToDelete.id);
      setCouponToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coupon Codes"
        description="Create and manage voucher codes, configure usage limits, and set customer eligibility."
        breadcrumbs={[
          { label: "Marketing", href: "/dashboard/marketing" },
          { label: "Coupons" },
        ]}
        actions={
          <Button size="sm" asChild className="h-9">
            <Link href="/dashboard/marketing/coupons/new">
              <Plus className="h-4 w-4 mr-1.5" />
              Create Coupon
            </Link>
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
                placeholder="Search coupon code or campaign name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[130px] h-9 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[140px] h-9 text-xs">
                  <SelectValue placeholder="Discount Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed BDT (৳)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coupons Data Table */}
      <Card>
        <div className="hidden lg:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold text-xs">Code</TableHead>
                <TableHead className="font-semibold text-xs">
                  Campaign & Eligibility
                </TableHead>
                <TableHead className="font-semibold text-xs">
                  Discount Value
                </TableHead>
                <TableHead className="font-semibold text-xs">
                  Min Spend / Cap
                </TableHead>
                <TableHead className="font-semibold text-xs">
                  Usage / Limit
                </TableHead>
                <TableHead className="font-semibold text-xs">
                  Validity Period
                </TableHead>
                <TableHead className="font-semibold text-xs">Status</TableHead>
                <TableHead className="font-semibold text-xs text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-32 text-center text-xs text-muted-foreground"
                  >
                    Loading coupon records...
                  </TableCell>
                </TableRow>
              ) : coupons.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-32 text-center text-xs text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Ticket className="h-8 w-8 text-muted-foreground/40" />
                      <span>
                        No coupons found matching the selected filters.
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="mt-2 text-xs"
                      >
                        <Link href="/dashboard/marketing/coupons/new">
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Create First Coupon
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                coupons.map((coupon) => {
                  const effectiveStatus = coupon.status;

                  return (
                    <TableRow key={coupon.id} className="text-xs">
                      {/* Code with Copy Shortcut */}
                      <TableCell className="font-mono font-bold">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20 tracking-wider">
                            {coupon.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(coupon.code)}
                            title="Copy coupon code"
                            className="text-muted-foreground hover:text-foreground transition-colors p-1"
                          >
                            {copiedCode === coupon.code ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </TableCell>

                      {/* Campaign Name & Eligibility */}
                      <TableCell>
                        <div className="font-medium text-foreground">
                          {coupon.campaignName}
                        </div>
                        <div className="text-[11px] text-muted-foreground capitalize">
                          Eligibility:{" "}
                          {coupon.customerEligibility.replace("_", " ")}
                        </div>
                      </TableCell>

                      {/* Discount Value */}
                      <TableCell>
                        <span className="font-semibold text-foreground">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}% OFF`
                            : `৳${coupon.discountValue.toLocaleString("en-BD")} OFF`}
                        </span>
                      </TableCell>

                      {/* Min Spend & Max Cap */}
                      <TableCell>
                        <div>
                          {coupon.minOrderAmount > 0 ? (
                            <span>
                              Min: ৳
                              {coupon.minOrderAmount.toLocaleString("en-BD")}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">
                              No min
                            </span>
                          )}
                        </div>
                        {coupon.maxDiscountCap ? (
                          <div className="text-[11px] text-muted-foreground">
                            Cap: ৳
                            {coupon.maxDiscountCap.toLocaleString("en-BD")}
                          </div>
                        ) : null}
                      </TableCell>

                      {/* Usage Limit */}
                      <TableCell>
                        <div className="font-medium">
                          {coupon.usedCount}
                          {coupon.usageLimit
                            ? ` / ${coupon.usageLimit}`
                            : " / ∞"}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          Total Saved: ৳
                          {(coupon.totalDiscountGiven || 0).toLocaleString(
                            "en-BD",
                          )}
                        </div>
                      </TableCell>

                      {/* Validity Period */}
                      <TableCell className="text-muted-foreground">
                        <div>
                          {new Date(coupon.startDate).toLocaleDateString(
                            "en-BD",
                            { month: "short", day: "numeric" },
                          )}
                        </div>
                        <div className="text-[10px]">
                          to{" "}
                          {new Date(coupon.endDate).toLocaleDateString(
                            "en-BD",
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          variant={
                            effectiveStatus === "active"
                              ? "success"
                              : effectiveStatus === "expired"
                                ? "outline"
                                : "secondary"
                          }
                          className="capitalize text-[10px]"
                        >
                          {effectiveStatus}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-8 w-8 p-0"
                          >
                            <Link
                              href={`/dashboard/marketing/coupons/${coupon.id}/edit`}
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                              <span className="sr-only">Edit Coupon</span>
                            </Link>
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Power className="h-3.5 w-3.5" />
                                <span className="sr-only">Status Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {coupon.status !== "active" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    toggleMutation.mutate({
                                      id: coupon.id,
                                      status: "active",
                                    })
                                  }
                                >
                                  Activate Coupon
                                </DropdownMenuItem>
                              )}
                              {coupon.status === "active" && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    toggleMutation.mutate({
                                      id: coupon.id,
                                      status: "inactive",
                                    })
                                  }
                                >
                                  Deactivate Coupon
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => setCouponToDelete(coupon)}
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-2" />
                                Delete Coupon
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card-Based Transformation View */}
        <div className="block lg:hidden">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              Loading coupons...
            </div>
          ) : coupons.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No discount coupons found matching the selected filters.
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {coupons.map((coupon) => {
                const now = new Date();
                const isExpired = new Date(coupon.endDate) < now;
                const effectiveStatus = isExpired ? "expired" : coupon.status;

                return (
                  <div key={coupon.id} className="p-4 space-y-3">
                    {/* Top: Code, Copy, Status, Actions */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <code className="font-mono font-bold text-xs bg-muted px-2 py-0.5 rounded border border-border">
                          {coupon.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                          onClick={() => handleCopyCode(coupon.code)}
                          title="Copy Code"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <Badge
                          variant={
                            effectiveStatus === "active"
                              ? "success"
                              : effectiveStatus === "expired"
                                ? "outline"
                                : "secondary"
                          }
                          className="capitalize text-[10px]"
                        >
                          {effectiveStatus}
                        </Badge>

                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="h-7 w-7 p-0"
                        >
                          <Link href={`/dashboard/marketing/coupons/${coupon.id}/edit`}>
                            <Edit2 className="h-3.5 w-3.5" />
                          </Link>
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 w-7 p-0"
                            >
                              <Power className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {coupon.status !== "active" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  toggleMutation.mutate({
                                    id: coupon.id,
                                    status: "active",
                                  })
                                }
                              >
                                Activate Coupon
                              </DropdownMenuItem>
                            )}
                            {coupon.status === "active" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  toggleMutation.mutate({
                                    id: coupon.id,
                                    status: "inactive",
                                  })
                                }
                              >
                                Deactivate Coupon
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setCouponToDelete(coupon)}
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-2" />
                              Delete Coupon
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Campaign & Discount */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border/40">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">Campaign</span>
                        <span className="font-medium text-foreground block truncate">{coupon.campaignName}</span>
                        <span className="text-[10px] text-muted-foreground capitalize">
                          {coupon.customerEligibility.replace("_", " ")}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">Discount</span>
                        <span className="font-bold text-sm text-foreground">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}% OFF`
                            : `৳${coupon.discountValue.toLocaleString("en-BD")} OFF`}
                        </span>
                      </div>
                    </div>

                    {/* Spend rules & Usage */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border/40">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">Min Spend / Cap</span>
                        <span className="text-foreground">
                          {coupon.minOrderAmount > 0 ? `Min: ৳${coupon.minOrderAmount.toLocaleString("en-BD")}` : "No min"}
                        </span>
                        {coupon.maxDiscountCap && (
                          <span className="text-[10px] text-muted-foreground block">
                            Cap: ৳{coupon.maxDiscountCap.toLocaleString("en-BD")}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">Usage</span>
                        <span className="font-medium text-foreground">
                          {coupon.usedCount}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : " / ∞"}
                        </span>
                        <span className="text-[10px] text-muted-foreground block">
                          Saved: ৳{(coupon.totalDiscountGiven || 0).toLocaleString("en-BD")}
                        </span>
                      </div>
                    </div>

                    {/* Validity Period Footer */}
                    <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[11px] text-muted-foreground">
                      <span>Validity</span>
                      <span>
                        {new Date(coupon.startDate).toLocaleDateString("en-BD", { month: "short", day: "numeric" })} -{" "}
                        {new Date(coupon.endDate).toLocaleDateString("en-BD", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={Boolean(couponToDelete)}
        onOpenChange={() => setCouponToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Coupon Code?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete coupon{" "}
              <strong>{couponToDelete?.code}</strong>? Customers will no longer
              be able to redeem this coupon at checkout.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete Coupon
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
