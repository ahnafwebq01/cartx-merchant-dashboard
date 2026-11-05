"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ShieldCheck,
  KeyRound,
  Laptop,
  MapPin,
  Clock,
  Info,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

export function SecuritySettings() {
  const { changePassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: PasswordChangeFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await changePassword(values.currentPassword, values.newPassword);
      if (res.success) {
        toast.success("Password updated successfully", {
          description: "Your demo administrator password has been changed.",
        });
        reset();
      } else {
        toast.error(res.error || "Failed to update password");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Password Change Interface */}
      <Card className="border-border/70 bg-card/80 backdrop-blur-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" />
                Password & Authentication
              </CardTitle>
              <CardDescription className="text-xs">
                Update credentials used to access this merchant administrative account.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              Demo Auth Provider
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword" className="text-xs font-medium text-foreground">
                Current Password *
              </Label>
              <PasswordInput
                id="currentPassword"
                placeholder="Enter current password"
                className="bg-background/60"
                {...register("currentPassword")}
              />
              {errors.currentPassword && (
                <p className="text-[11px] text-destructive">{errors.currentPassword.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="newPassword" className="text-xs font-medium text-foreground">
                New Password *
              </Label>
              <PasswordInput
                id="newPassword"
                placeholder="At least 6 characters"
                className="bg-background/60"
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <p className="text-[11px] text-destructive">{errors.newPassword.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-medium text-foreground">
                Confirm New Password *
              </Label>
              <PasswordInput
                id="confirmPassword"
                placeholder="Repeat new password"
                className="bg-background/60"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-[11px] text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="pt-2">
              <Button type="submit" size="sm" disabled={isSubmitting} className="cursor-pointer">
                {isSubmitting ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Active Browser Session */}
      <Card className="border-border/70 bg-card/80 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Laptop className="h-4 w-4 text-primary" />
            Active Session Telemetry
          </CardTitle>
          <CardDescription className="text-xs">
            Current browser instance authenticated for this merchant storefront.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border/60 bg-muted/30">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Laptop className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">Current Evaluation Browser</span>
                  <Badge variant="success" className="text-[10px] py-0 px-1.5">
                    Active Session
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Dhaka, Bangladesh (BDIX Network)
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Started recently
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Architecture & Demo Boundary Overview */}
      <Card className="border-border/70 bg-card/80 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Platform Security & Demo Boundaries
          </CardTitle>
          <CardDescription className="text-xs">
            Understanding security isolation and environment specifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-muted-foreground">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border border-border/60 bg-background/50 space-y-1">
              <div className="font-semibold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                RBAC Permission Guard Active
              </div>
              <p>Granular role-based authorization guards all 16 dashboard modules and API mutations.</p>
            </div>

            <div className="p-3 rounded-lg border border-border/60 bg-background/50 space-y-1">
              <div className="font-semibold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                Tenant Isolation Prepared
              </div>
              <p>Client HTTP headers inject store identification (<code>X-Store-Id</code>) for multi-tenant boundary integrity.</p>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Backend Dependency Limitation</p>
              <p className="mt-0.5 text-[11px]">
                Hardware security keys (FIDO2/WebAuthn), SMS-based OTP, and server-side JWT invalidation require dedicated backend infrastructure and are purposely disabled in this frontend evaluation build.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SecuritySettings;
