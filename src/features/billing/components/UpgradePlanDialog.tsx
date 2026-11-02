"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Sparkles, AlertCircle, Zap } from "lucide-react";
import { SUBSCRIPTION_PLANS } from "../constants";
import { calculatePlanPricing } from "../services/mockBilling";
import { useUpgradePlanMutation, useSubscriptionQuery } from "../hooks";
import type { SubscriptionPlanId, BillingCycle } from "../types";

interface UpgradePlanDialogProps {
  planId: SubscriptionPlanId | null;
  initialCycle?: BillingCycle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpgradePlanDialog({
  planId,
  initialCycle = "monthly",
  open,
  onOpenChange,
}: UpgradePlanDialogProps) {
  const [cycle, setCycle] = useState<BillingCycle>(initialCycle);
  const { data: currentSub } = useSubscriptionQuery();
  const upgradeMutation = useUpgradePlanMutation();

  if (!planId) return null;

  const targetPlan = SUBSCRIPTION_PLANS[planId];
  const currentPlanId = currentSub?.planId || "growth";
  const isCurrentPlan = currentPlanId === planId && currentSub?.billingCycle === cycle;
  const isUpgrade =
    (currentPlanId === "starter" && (planId === "growth" || planId === "pro")) ||
    (currentPlanId === "growth" && planId === "pro");

  const pricing = calculatePlanPricing(planId, cycle);

  const handleConfirm = async () => {
    try {
      await upgradeMutation.mutateAsync({ planId, cycle });
      onOpenChange(false);
    } catch {
      // Handled by hook toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-md bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
            </span>
            <DialogTitle className="text-xl">
              {isCurrentPlan
                ? `Manage ${targetPlan.name}`
                : isUpgrade
                ? `Upgrade to ${targetPlan.name}`
                : `Switch to ${targetPlan.name}`}
            </DialogTitle>
          </div>
          <DialogDescription>
            {targetPlan.tagline}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Simulated Disclaimer Banner */}
          <div className="flex items-start gap-2.5 p-3 rounded-lg border border-primary/20 bg-primary/5 text-xs text-muted-foreground">
            <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <strong>Simulated Billing Operation:</strong> CartX Merchant Dashboard runs in client demonstration mode.
              No real credit card or bKash wallet will be charged. Your store limits will adjust immediately.
            </div>
          </div>

          {/* Billing Cycle Selector */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/40">
            <div>
              <span className="text-xs font-medium text-foreground block">Select Billing Frequency</span>
              <span className="text-[11px] text-muted-foreground">
                Annual billing saves up to 17% on platform fees
              </span>
            </div>
            <Tabs value={cycle} onValueChange={(v) => setCycle(v as BillingCycle)}>
              <TabsList className="h-8">
                <TabsTrigger value="monthly" className="text-xs h-7">Monthly</TabsTrigger>
                <TabsTrigger value="annual" className="text-xs h-7">Annual (-17%)</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-lg border border-border bg-card flex items-baseline justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                {cycle === "annual" ? "Annual License (Billed Yearly)" : "Monthly Recurring"}
              </p>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl font-extrabold text-foreground">
                  ৳{pricing.billedAmount.toLocaleString("bn-BD")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {cycle === "annual" ? "/ year" : "/ month"}
                </span>
              </div>
              {cycle === "annual" && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                  ৳{pricing.monthlyEquivalent.toLocaleString("bn-BD")}/mo equivalent (Save ৳{pricing.annualSavingsAmount.toLocaleString("bn-BD")}/yr)
                </p>
              )}
            </div>
            <Badge variant={isUpgrade ? "default" : "secondary"}>
              {isCurrentPlan ? "Current Plan" : isUpgrade ? "Upgrade" : "Downgrade"}
            </Badge>
          </div>

          {/* What's Included */}
          <div className="space-y-2">
            <h5 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Included in this Tier:
            </h5>
            <ul className="grid grid-cols-1 gap-1.5 text-xs text-muted-foreground">
              {targetPlan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={upgradeMutation.isPending || isCurrentPlan}
            className="gap-2"
          >
            <Zap className="h-4 w-4" />
            {upgradeMutation.isPending
              ? "Updating Subscription..."
              : isCurrentPlan
              ? "Already on this Plan"
              : isUpgrade
              ? "Confirm & Upgrade Plan"
              : "Confirm Plan Switch"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

