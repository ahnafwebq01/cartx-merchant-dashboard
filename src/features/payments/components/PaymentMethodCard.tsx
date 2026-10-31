"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { PaymentMethodConfig } from "../types";
import { ConfigurePaymentMethodDialog } from "./ConfigurePaymentMethodDialog";
import {
  CreditCard,
  Settings,
  CheckCircle2,
  Radio,
  Banknote,
} from "lucide-react";
import { useUpdatePaymentMethodMutation } from "../hooks";

interface PaymentMethodCardProps {
  method: PaymentMethodConfig;
}

export function PaymentMethodCard({ method }: PaymentMethodCardProps) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const updateMutation = useUpdatePaymentMethodMutation();

  const handleToggle = async (checked: boolean) => {
    await updateMutation.mutateAsync({
      provider: method.id,
      isEnabled: checked,
      environment: method.environment,
      accountIdentifier: method.accountIdentifier,
      merchantId: method.merchantId,
    });
  };

  const isCOD = method.id === "cod";

  return (
    <>
      <Card className="border-border shadow-xs hover:border-primary/40 transition-colors">
        <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
          <div className="space-y-3">
            {/* Header: Name, Bengali name, Badges */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  {isCOD ? (
                    <Banknote className="h-5 w-5" />
                  ) : (
                    <CreditCard className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    {method.name}
                    <span className="text-xs font-normal text-muted-foreground">
                      ({method.displayNameBn})
                    </span>
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {method.status === "connected" ? (
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 gap-1"
                      >
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        Live Connected
                      </Badge>
                    ) : method.status === "demo_mode" ? (
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

                    <Badge
                      variant="secondary"
                      className="text-[10px] uppercase font-mono"
                    >
                      {method.environment}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Toggle Switch */}
              <Switch
                checked={method.isEnabled}
                onCheckedChange={handleToggle}
                disabled={updateMutation.isPending}
                aria-label={`Toggle ${method.name}`}
              />
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground leading-relaxed">
              {method.description}
            </p>

            {/* Channels & Account info */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {method.supportedChannels.map((channel) => (
                <span
                  key={channel}
                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground"
                >
                  {channel}
                </span>
              ))}
            </div>

            {method.accountIdentifier && (
              <div className="text-[11px] font-mono text-muted-foreground bg-muted/40 p-2 rounded border border-border/40">
                Account ID: <span className="text-foreground font-semibold">{method.accountIdentifier}</span>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">
              {method.hasCredentials ? "Zero-trust verified" : "Requires setup"}
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

      <ConfigurePaymentMethodDialog
        method={method}
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
      />
    </>
  );
}
