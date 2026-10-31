"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  CourierProviderId,
  NormalizedShipmentStatus,
  Shipment,
  ShipmentFilterParams,
} from "../types";
import { ShipmentStatusBadge } from "./ShipmentStatusBadge";
import {
  Search,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  Plus,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { mockShippingService } from "../services/mockShipping";
import { ShipmentDetailsModal } from "./ShipmentDetailsModal";
import { CreateShipmentDialog } from "./CreateShipmentDialog";

interface ShipmentListTableProps {
  shipments: Shipment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filterParams: ShipmentFilterParams;
  onFilterChange: (newParams: Partial<ShipmentFilterParams>) => void;
  isLoading?: boolean;
}

export function ShipmentListTable({
  shipments,
  total,
  page,
  limit,
  totalPages,
  filterParams,
  onFilterChange,
  isLoading = false,
}: ShipmentListTableProps) {
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleExportCSV = () => {
    const csvData = mockShippingService.exportShipmentsToCSV(shipments);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `cartx-shipments-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusTabs: { label: string; value: NormalizedShipmentStatus | "all" }[] = [
    { label: "All Parcels", value: "all" },
    { label: "In Transit", value: "in_transit" },
    { label: "Delivered", value: "delivered" },
    { label: "Pending Pickup", value: "pending" },
    { label: "Returned / Cancelled", value: "returned" },
  ];

  return (
    <div className="space-y-4">
      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {statusTabs.map((tab) => {
            const isSelected = (filterParams.status || "all") === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => onFilterChange({ status: tab.value, page: 1 })}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <Button
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          className="text-xs h-8 gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          Create Consignment
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-1 items-center gap-2 max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by consignment, tracking ID, customer, order #..."
              value={filterParams.search || ""}
              onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
              className="pl-8 text-xs h-9"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Courier Filter */}
          <Select
            value={filterParams.courier || "all"}
            onValueChange={(val) =>
              onFilterChange({
                courier: val as CourierProviderId | "all",
                page: 1,
              })
            }
          >
            <SelectTrigger className="w-[140px] text-xs h-9">
              <Filter className="h-3 w-3 mr-1 text-muted-foreground" />
              <SelectValue placeholder="Courier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Couriers</SelectItem>
              <SelectItem value="steadfast">Steadfast</SelectItem>
              <SelectItem value="pathao">Pathao</SelectItem>
              <SelectItem value="redx">RedX</SelectItem>
            </SelectContent>
          </Select>

          {/* Export CSV */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="text-xs h-9 gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-semibold">Consignment / Tracking</TableHead>
              <TableHead className="text-xs font-semibold">Order #</TableHead>
              <TableHead className="text-xs font-semibold">Courier</TableHead>
              <TableHead className="text-xs font-semibold">Recipient & Destination</TableHead>
              <TableHead className="text-xs font-semibold">COD Amount</TableHead>
              <TableHead className="text-xs font-semibold">Status</TableHead>
              <TableHead className="text-xs font-semibold">Date</TableHead>
              <TableHead className="text-xs font-semibold text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-xs text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-2 text-primary" />
                  Loading shipments...
                </TableCell>
              </TableRow>
            ) : shipments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-xs text-muted-foreground">
                  No shipments found matching the selected filters.
                </TableCell>
              </TableRow>
            ) : (
              shipments.map((shp) => (
                <TableRow key={shp.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs">
                    <span className="font-semibold text-foreground block">
                      {shp.consignmentId}
                    </span>
                    <span className="text-[10px] text-primary font-medium">
                      {shp.trackingId}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    <Link
                      href={`/dashboard/orders/${shp.orderId}`}
                      className="text-primary hover:underline font-semibold flex items-center gap-1"
                    >
                      {shp.orderNumber}
                      <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    <Badge variant="secondary" className="text-[10px]">
                      {shp.courierName}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="font-medium text-foreground">{shp.recipientName}</div>
                    <div className="text-[11px] text-muted-foreground truncate max-w-xs">
                      {shp.city}, {shp.district} • {shp.recipientPhone}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs font-semibold text-foreground">
                    {shp.codAmount > 0 ? (
                      `৳${shp.codAmount.toLocaleString("en-BD")}`
                    ) : (
                      <span className="text-muted-foreground font-normal">Prepaid (৳0)</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <ShipmentStatusBadge status={shp.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {new Date(shp.createdAt).toLocaleDateString("en-BD", {
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedShipment(shp)}
                      className="h-7 px-2 text-xs gap-1"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Track</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Clamped Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20 text-xs text-muted-foreground">
          <div>
            Showing {shipments.length > 0 ? (page - 1) * limit + 1 : 0} to{" "}
            {Math.min(page * limit, total)} of {total} shipments
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFilterChange({ page: page - 1 })}
              disabled={page <= 1}
              className="h-7 px-2"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs font-medium px-2">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFilterChange({ page: page + 1 })}
              disabled={page >= totalPages}
              className="h-7 px-2"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Details & Tracking Modal */}
      {selectedShipment && (
        <ShipmentDetailsModal
          shipment={selectedShipment}
          isOpen={Boolean(selectedShipment)}
          onClose={() => setSelectedShipment(null)}
        />
      )}

      {/* Create Consignment Dialog */}
      {isCreateOpen && (
        <CreateShipmentDialog
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        />
      )}
    </div>
  );
}

