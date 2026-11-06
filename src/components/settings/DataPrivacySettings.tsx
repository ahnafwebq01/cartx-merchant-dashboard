"use client";

import React, { useState } from "react";
import {
  Download,
  AlertTriangle,
  HardDrive,
  Trash2,
  ShieldAlert,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { resetAllDemoData } from "@/lib/demo/resetDemo";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function DataPrivacySettings() {
  const queryClient = useQueryClient();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const calculateStorageUsage = () => {
    if (typeof window === "undefined") return 0;
    let total = 0;
    try {
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && (key.startsWith("cartx_") || key.includes("cartx"))) {
          const val = window.localStorage.getItem(key) || "";
          total += (key.length + val.length) * 2; // Approximate UTF-16 bytes
        }
      }
    } catch {
      // ignore
    }
    return total;
  };

  const [storageBytes, setStorageBytes] = useState<number>(calculateStorageUsage);

  const handleExportData = () => {
    if (typeof window === "undefined") return;
    try {
      const dump: Record<string, unknown> = {};
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && (key.startsWith("cartx_") || key.includes("cartx"))) {
          try {
            dump[key] = JSON.parse(window.localStorage.getItem(key) || "");
          } catch {
            dump[key] = window.localStorage.getItem(key);
          }
        }
      }

      const blob = new Blob([JSON.stringify(dump, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cartx-demo-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Demo data exported", {
        description: "Your local demo configuration and session JSON has been downloaded.",
      });
    } catch {
      toast.error("Failed to export demo data");
    }
  };

  const handleResetData = async () => {
    resetAllDemoData();
    // Also clear custom keys
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem("cartx_appearance_settings_v1");
        window.localStorage.removeItem("cartx_notification_preferences_v1");
        window.localStorage.removeItem("cartx_regional_preferences_v1");
        window.localStorage.removeItem("cartx_demo_registered_users_v1");
      } catch {
        // ignore
      }
    }
    await queryClient.invalidateQueries();
    setStorageBytes(calculateStorageUsage());
    setResetDialogOpen(false);
    toast.success("All Demo Preferences Reset", {
      description: "Default baseline products, onboarding milestones, and preferences restored.",
    });
  };

  const storageKb = (storageBytes / 1024).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Storage Footprint */}
      <Card className="border-border/70 bg-card/80 backdrop-blur-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-primary" />
                Demo Storage Footprint
              </CardTitle>
              <CardDescription className="text-xs">
                Inspect volume of data cached in this browser for CartX evaluation.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              {storageKb} KB Allocated
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3.5 rounded-xl border border-border/60 bg-muted/30 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-medium text-foreground">Browser LocalStorage Cache</span>
              <p className="text-[11px] text-muted-foreground">
                Contains store configurations, product inventory, coupons, and registered demo profiles.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="gap-1.5 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export JSON</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Demo Limitations Notice */}
      <Card className="border-border/70 bg-card/80 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-primary" />
            Client-Side Privacy Boundaries
          </CardTitle>
          <CardDescription className="text-xs">
            Understanding data privacy and persistence in frontend evaluation mode.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-muted-foreground">
          <p>
            This dashboard operates entirely in <strong>Frontend-First Demo Mode</strong>. No customer PII, credit card credentials, or bank accounts are transmitted to external servers.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Clearing your browser cache or opening in Incognito will load initial clean defaults.</li>
            <li>No tracking analytics or cookies are sold or sent to third parties.</li>
            <li>When ready for production deployment, connect to PostgreSQL/Express API via environment variables.</li>
          </ul>
        </CardContent>
      </Card>

      {/* Reset Actions */}
      <Card className="border-destructive/30 bg-destructive/5 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-destructive flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Reset Demo Data & Factory Defaults
          </CardTitle>
          <CardDescription className="text-xs">
            Irreversibly restore all mock products, demo shipments, orders, and custom settings to initial defaults.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            Action will reset onboarding checklists and newly created SKUs.
          </span>

          <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-1.5 cursor-pointer">
                <Trash2 className="h-3.5 w-3.5" />
                <span>Reset All Demo Data</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="glass-panel">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-base font-semibold text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Confirm Demo Data Reset
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xs">
                  This will erase all locally stored changes, created products, custom store settings, and newly registered demo users. The dashboard will return to its original baseline demo state.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleResetData}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                >
                  Yes, Reset Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}

export default DataPrivacySettings;
