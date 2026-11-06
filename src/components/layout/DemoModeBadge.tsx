"use client";

import React, { useState } from "react";
import { Sparkles, RotateCcw, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { resetAllDemoData } from "@/lib/demo/resetDemo";
import { toast } from "sonner";

export function DemoModeBadge() {
  const [open, setOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const queryClient = useQueryClient();

  const handleReset = async () => {
    setIsResetting(true);
    try {
      resetAllDemoData();
      await queryClient.invalidateQueries();
      toast.success("Demo Mode reset successfully", {
        description: "All onboarding steps and demo data have been restored to initial defaults.",
      });
      setOpen(false);
    } catch {
      toast.error("Failed to reset demo data");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[11px] sm:text-xs font-medium transition-colors cursor-pointer shrink-0"
          aria-label="Demo Mode Details"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="hidden sm:inline">Demo Mode</span>
          <span className="sm:hidden">Demo</span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Sparkles className="h-5 w-5" />
            <DialogTitle className="text-base font-semibold">
              CartX Interactive Demo Mode
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            This dashboard is fully operational in high-fidelity client demo mode. Zero backend server required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="p-3 rounded-lg border border-border bg-muted/40 space-y-2">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <span>Simulated Backend & Safe Browser Persistence</span>
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              All merchant onboarding steps, store settings, product catalogs, customer records, orders,
              couriers, themes, and marketing campaigns are preserved across refreshes in your browser&apos;s
              localStorage. No real payment or courier credentials are used.
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-foreground text-xs">Explore Demo Capabilities:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-muted-foreground">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                <span>7-Step Store Setup Wizard</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                <span>Simulated Subdomain Checker</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                <span>Order Fulfillment Lifecycle</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                <span>Courier Consignments & Tracking</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                <span>Live Storefront Theme Customizer</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                <span>Marketing & Flash Sales Engine</span>
              </li>
            </ul>
          </div>

          <div className="pt-2 border-t border-border flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground text-xs">Reset Demo Data</p>
              <p className="text-[11px] text-muted-foreground">Restore initial baseline store state.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={isResetting}
              className="gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {isResetting ? "Resetting..." : "Reset Data"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

