"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CustomerAddress } from "../types";
import { User, Phone, Mail, MapPin, ExternalLink } from "lucide-react";

interface OrderCustomerCardProps {
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: CustomerAddress;
  billingAddress?: CustomerAddress;
}

export function OrderCustomerCard({
  customerId,
  customerName,
  customerPhone,
  customerEmail,
  shippingAddress,
  billingAddress,
}: OrderCustomerCardProps) {
  return (
    <Card className="border border-border shadow-xs">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <span>Customer Information</span>
          </div>
          <Button variant="ghost" size="sm" asChild className="h-7 text-xs px-2 gap-1 text-primary">
            <Link href={`/dashboard/customers/${customerId}`}>
              View Profile
              <ExternalLink className="h-3 w-3" />
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 space-y-4 text-xs">
        {/* Name and Direct Contact */}
        <div className="space-y-1.5">
          <p className="font-semibold text-foreground text-sm">{customerName}</p>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <a
              href={`tel:${customerPhone}`}
              className="font-mono text-foreground hover:underline"
            >
              {customerPhone}
            </a>
          </div>
          {customerEmail && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <a
                href={`mailto:${customerEmail}`}
                className="text-foreground hover:underline truncate"
              >
                {customerEmail}
              </a>
            </div>
          )}
        </div>

        {/* Shipping Address */}
        <div className="pt-2 border-t border-border/60 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-foreground text-[11px] uppercase tracking-wider">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span>Delivery Address</span>
          </div>
          <p className="text-foreground leading-relaxed pl-5">
            {shippingAddress.addressLine1}
            {shippingAddress.addressLine2 && `, ${shippingAddress.addressLine2}`}
          </p>
          <p className="text-muted-foreground pl-5">
            {shippingAddress.city}, {shippingAddress.division}
            {shippingAddress.postalCode ? ` - ${shippingAddress.postalCode}` : ""}
          </p>
          <p className="text-muted-foreground text-[11px] pl-5">
            {shippingAddress.country}
          </p>
        </div>

        {/* Billing Address if different */}
        {billingAddress && (
          <div className="pt-2 border-t border-border/60 space-y-1">
            <div className="font-semibold text-foreground text-[11px] uppercase tracking-wider">
              Billing Address
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {billingAddress.addressLine1}, {billingAddress.city}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

