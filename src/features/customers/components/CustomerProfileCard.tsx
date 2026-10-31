"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Customer } from "../types";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Tag,
  Plus,
} from "lucide-react";

interface CustomerProfileCardProps {
  customer: Customer;
  onAddNote: (note: string) => Promise<void>;
  onManageTags: () => void;
  isLoading?: boolean;
}

export function CustomerProfileCard({
  customer,
  onAddNote,
  onManageTags,
  isLoading = false,
}: CustomerProfileCardProps) {
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddNote(note.trim());
      setNote("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSegmentBadge = () => {
    switch (customer.segment) {
      case "high_value":
        return (
          <Badge className="bg-purple-600/15 text-purple-700 dark:text-purple-400 border-purple-600/30 text-[10px] font-semibold uppercase">
            VIP / High-Value
          </Badge>
        );
      case "repeat":
        return (
          <Badge className="bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 border-emerald-600/30 text-[10px] font-semibold uppercase">
            Repeat Buyer
          </Badge>
        );
      case "inactive":
        return (
          <Badge
            variant="outline"
            className="text-[10px] text-muted-foreground uppercase"
          >
            Inactive
          </Badge>
        );
      case "new":
      default:
        return (
          <Badge className="bg-blue-600/15 text-blue-700 dark:text-blue-400 border-blue-600/30 text-[10px] font-semibold uppercase">
            New Customer
          </Badge>
        );
    }
  };

  return (
    <Card className="border border-border shadow-xs overflow-hidden">
      {/* 21st.dev inspired Profile Banner */}
      <div className="h-20 bg-linear-to-r from-primary/15 via-primary/5 to-muted border-b border-border/60" />

      <CardContent className="p-6 pt-0 relative space-y-6">
        {/* Avatar and Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10">
          <div className="flex items-end gap-3">
            <div className="h-20 w-20 rounded-full border-4 border-card bg-muted overflow-hidden relative shadow-md flex items-center justify-center">
              {customer.avatarUrl ? (
                <Image
                  src={customer.avatarUrl}
                  alt={customer.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-0.5">
              <h2 className="text-lg font-bold text-foreground leading-tight">
                {customer.name}
              </h2>
              <div className="flex items-center gap-2">
                {getSegmentBadge()}
                <span className="text-[11px] text-muted-foreground">
                  Member since{" "}
                  {new Date(customer.createdAt).toLocaleDateString("en-BD", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onManageTags}
            className="text-xs h-8 gap-1.5 self-start sm:self-end"
          >
            <Tag className="h-3.5 w-3.5" />
            Manage Tags
          </Button>
        </div>

        {/* 4 Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-muted/40 border border-border/60 text-center">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
              Total Orders
            </span>
            <span className="text-xl font-bold font-mono text-foreground">
              {customer.totalOrders}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-muted/40 border border-border/60 text-center">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
              Total Spent
            </span>
            <span className="text-xl font-bold font-mono text-primary">
              ৳{customer.totalSpend.toLocaleString("en-BD")}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-muted/40 border border-border/60 text-center">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
              Average Order
            </span>
            <span className="text-xl font-bold font-mono text-foreground">
              ৳{customer.averageOrderValue.toLocaleString("en-BD")}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-muted/40 border border-border/60 text-center">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">
              Last Active
            </span>
            <span className="text-xs font-semibold text-foreground block mt-1">
              {customer.lastOrderDate
                ? new Date(customer.lastOrderDate).toLocaleDateString("en-BD", {
                    month: "short",
                    day: "numeric",
                  })
                : "None"}
            </span>
          </div>
        </div>

        {/* Contact & Address Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2 border-t border-border/60">
          {/* Contact Details */}
          <div className="space-y-2">
            <span className="font-semibold text-foreground text-[11px] uppercase tracking-wider block">
              Contact Channels
            </span>
            <div className="flex items-center gap-2 text-foreground">
              <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <a
                href={`tel:${customer.phone}`}
                className="font-mono hover:underline"
              >
                {customer.phone}
              </a>
            </div>
            {customer.email && (
              <div className="flex items-center gap-2 text-foreground">
                <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <a
                  href={`mailto:${customer.email}`}
                  className="hover:underline truncate"
                >
                  {customer.email}
                </a>
              </div>
            )}
          </div>

          {/* Default Delivery Address */}
          <div className="space-y-1">
            <span className="font-semibold text-foreground text-[11px] uppercase tracking-wider block">
              Primary Shipping Address
            </span>
            <div className="flex items-start gap-1.5 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
              <p className="text-foreground leading-relaxed">
                {customer.defaultAddress.addressLine1}
                <br />
                {customer.city}, {customer.division}
                {customer.defaultAddress.postalCode &&
                  ` - ${customer.defaultAddress.postalCode}`}
                , Bangladesh
              </p>
            </div>
          </div>
        </div>

        {/* Customer Tags */}
        <div className="pt-2 border-t border-border/60 space-y-2">
          <span className="font-semibold text-foreground text-[11px] uppercase tracking-wider block">
            Customer Segmentation Tags
          </span>
          <div className="flex flex-wrap gap-1.5">
            {customer.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs px-2 py-0.5 font-medium"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Internal Notes */}
        <div className="pt-2 border-t border-border/60 space-y-3 text-xs">
          <span className="font-semibold text-foreground text-[11px] uppercase tracking-wider block">
            Merchant Private Notes
          </span>
          {customer.internalNotes ? (
            <div className="p-3 rounded-md bg-muted/40 border border-border/60 whitespace-pre-wrap font-sans text-foreground text-[11px] leading-relaxed">
              {customer.internalNotes}
            </div>
          ) : (
            <p className="text-muted-foreground italic text-[11px]">
              No notes for this customer profile yet.
            </p>
          )}

          <form onSubmit={handleNoteSubmit} className="space-y-2">
            <Textarea
              placeholder="Add observation or customer preference note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="text-xs"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                disabled={isLoading || isSubmitting || !note.trim()}
                className="text-xs h-7 gap-1 font-medium"
              >
                <Plus className="h-3.5 w-3.5" />
                {isSubmitting ? "Saving..." : "Add Note"}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
