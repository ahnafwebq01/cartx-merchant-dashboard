"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { CourierConnection } from "../types";
import { ConfigureCourierDialog } from "./ConfigureCourierDialog";
import {
  Truck,
  Settings,
  CheckCircle2,
  Radio,
  MapPin,
  Phone,
} from "lucide-react";
import { useUpdateCourierConnectionMutation } from "../hooks";

interface CourierCardProps {
  courier: CourierConnection;
}

export function CourierCard({ courier }: CourierCardProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const updateMutation = useUpdateCourierConnectionMutation();

  const handleToggle = async (checked: boolean) => {
    await updateMutation.mutateAsync({
      courierId: courier.id,
      isEnabled: checked,
      accountIdentifier: courier.accountIdentifier,
      defaultPickupAddress: courier.defaultPickupAddress,
      pickupPhone: courier.pickupPhone,
    });
  };

  return (
    <>
      <Card className="border-border shadow-xs hover:border-primary/40 transition-colors">
        <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
          <div className="space-y-3">
            {/* Header: Name, Bengali name, Badges */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    {courier.name}
                    <span className="text-xs font-normal text-muted-foreground">
                      ({courier.displayNameBn})
                    </span>
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {courier.status === "connected" ? (
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 gap-1"
                      >
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        Live Connected
                      </Badge>
                    ) : courier.status === "demo_mode" ? (
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 gap-1"
                      >
                        <Radio className="h-2.5 w-2.5" />
                        Demo Sandbox
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">
                        Disconnected
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Toggle Switch */}
              <Switch
                checked={courier.isEnabled}
                onCheckedChange={handleToggle}
                disabled={updateMutation.isPending}
                aria-label={`Toggle ${courier.name}`}
              />
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground leading-relaxed">
              {courier.description}
            </p>

            {/* Services */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {courier.supportedServices.map((service) => (
                <span
                  key={service}
                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground"
                >
                  {service}
                </span>
              ))}
            </div>

            {/* Pickup Details */}
            <div className="p-2.5 rounded bg-muted/40 border border-border/40 space-y-1 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="h-3 w-3 text-primary shrink-0" />
                <span className="truncate">{courier.defaultPickupAddress}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <Phone className="h-3 w-3 text-primary shrink-0" />
                <span>{courier.pickupPhone}</span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">
              {courier.hasApiKey ? "Zero-trust API active" : "API setup required"}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConfigOpen(true)}
              className="text-xs h-7 gap-1"
            >
              <Settings className="h-3 w-3" />
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfigureCourierDialog
        courier={courier}
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
      />
    </>
  );
}

