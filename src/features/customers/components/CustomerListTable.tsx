"use client";

import React from "react";
import Link from "next/link";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Customer } from "../types";
import {
  MoreHorizontal,
  Eye,
  Tag,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";

interface CustomerListTableProps {
  customers: Customer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
  onManageTags: (customer: Customer) => void;
  isLoading?: boolean;
}

export function CustomerListTable({
  customers,
  total,
  page,
  limit,
  totalPages,
  onPageChange,
  onLimitChange,
  onManageTags,
  isLoading = false,
}: CustomerListTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/40 text-xs">
            <TableRow>
              <TableHead className="min-w-[200px]">Customer</TableHead>
              <TableHead className="min-w-[140px]">Contact</TableHead>
              <TableHead className="w-28">Location</TableHead>
              <TableHead className="w-20 text-center">Orders</TableHead>
              <TableHead className="w-28 text-right">Total Spend</TableHead>
              <TableHead className="w-28 text-right">AOV</TableHead>
              <TableHead className="w-32">Last Order</TableHead>
              <TableHead className="min-w-[150px]">Tags</TableHead>
              <TableHead className="w-12 text-center"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-36 text-center text-xs text-muted-foreground"
                >
                  Loading customers...
                </TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-36 text-center text-xs text-muted-foreground"
                >
                  No matching customers found.
                </TableCell>
              </TableRow>
            ) : (
              customers.map((c) => (
                <TableRow key={c.id} className="text-xs">
                  {/* Customer Name & Avatar */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted border border-border overflow-hidden shrink-0 relative flex items-center justify-center">
                        {c.avatarUrl ? (
                          <Image
                            src={c.avatarUrl}
                            alt={c.name}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        ) : (
                          <User className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <Link
                          href={`/dashboard/customers/${c.id}`}
                          className="font-medium text-foreground hover:underline truncate"
                        >
                          {c.name}
                        </Link>
                        <span className="text-[10px] text-muted-foreground capitalize">
                          {c.segment.replace(/_/g, " ")} customer
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Contact */}
                  <TableCell>
                    <div className="flex flex-col text-muted-foreground">
                      <span className="font-mono text-foreground text-[11px]">
                        {c.phone}
                      </span>
                      {c.email && (
                        <span className="text-[10px] truncate max-w-[130px]">
                          {c.email}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Location */}
                  <TableCell className="text-muted-foreground">
                    {c.city}
                  </TableCell>

                  {/* Orders */}
                  <TableCell className="text-center font-mono font-semibold">
                    {c.totalOrders}
                  </TableCell>

                  {/* Total Spend */}
                  <TableCell className="text-right font-mono font-bold text-foreground">
                    ৳{c.totalSpend.toLocaleString("en-BD")}
                  </TableCell>

                  {/* AOV */}
                  <TableCell className="text-right font-mono text-muted-foreground">
                    ৳{c.averageOrderValue.toLocaleString("en-BD")}
                  </TableCell>

                  {/* Last Order */}
                  <TableCell className="text-muted-foreground text-[11px] whitespace-nowrap">
                    {c.lastOrderDate ? (
                      new Date(c.lastOrderDate).toLocaleDateString("en-BD", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    ) : (
                      <span className="italic text-[10px]">No orders</span>
                    )}
                  </TableCell>

                  {/* Tags */}
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {c.tags.map((t) => (
                        <Badge
                          key={t}
                          variant="secondary"
                          className="text-[10px] font-normal px-1.5 py-0"
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="text-xs w-36">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/customers/${c.id}`}
                            className="gap-2 cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onManageTags(c)}
                          className="gap-2 cursor-pointer"
                        >
                          <Tag className="h-3.5 w-3.5" />
                          Edit Tags
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
            Loading customers...
          </div>
        ) : customers.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No matching customers found.
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {customers.map((c) => (
              <div key={c.id} className="p-4 space-y-3">
                {/* Header: Avatar, Name, Segment, Actions */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-muted border border-border overflow-hidden shrink-0 relative flex items-center justify-center">
                      {c.avatarUrl ? (
                        <Image
                          src={c.avatarUrl}
                          alt={c.name}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/dashboard/customers/${c.id}`}
                        className="font-semibold text-xs text-foreground hover:underline block truncate"
                      >
                        {c.name}
                      </Link>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Badge variant="outline" className="text-[10px] capitalize px-1.5 py-0">
                          {c.segment.replace(/_/g, " ")}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{c.city}</span>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="text-xs w-36">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/customers/${c.id}`}
                          className="gap-2 cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onManageTags(c)}
                        className="gap-2 cursor-pointer"
                      >
                        <Tag className="h-3.5 w-3.5" />
                        Edit Tags
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Contact row */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-border/40">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">Phone</span>
                    <span className="font-mono text-foreground">{c.phone}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider block">Email</span>
                    <span className="text-muted-foreground truncate block">{c.email || "—"}</span>
                  </div>
                </div>

                {/* Metrics row */}
                <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-border/40 bg-muted/20 p-2 rounded-md">
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground tracking-wider block">Orders</span>
                    <span className="font-mono font-bold text-foreground">{c.totalOrders}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] uppercase text-muted-foreground tracking-wider block">Spend</span>
                    <span className="font-mono font-bold text-foreground">৳{c.totalSpend.toLocaleString("en-BD")}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-muted-foreground tracking-wider block">AOV</span>
                    <span className="font-mono font-semibold text-muted-foreground">৳{c.averageOrderValue.toLocaleString("en-BD")}</span>
                  </div>
                </div>

                {/* Tags and Last Order */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/40 text-xs">
                  <div className="flex flex-wrap gap-1">
                    {c.tags.map((t) => (
                      <Badge
                        key={t}
                        variant="secondary"
                        className="text-[10px] font-normal px-1.5 py-0"
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    Last: {c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString("en-BD", { month: "short", day: "numeric", year: "numeric" }) : "No orders"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 border-t border-border text-xs text-muted-foreground bg-muted/20">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <span>
            Showing {customers.length > 0 ? (page - 1) * limit + 1 : 0} to{" "}
            {Math.min(page * limit, total)} of {total} customers
          </span>
          <div className="flex items-center gap-1.5 sm:ml-3">
            <span>Rows:</span>
            <Select
              value={String(limit)}
              onValueChange={(val) => onLimitChange(Number(val))}
            >
              <SelectTrigger className="h-7 w-16 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || isLoading}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <span className="px-2 text-xs font-medium text-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || isLoading}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
