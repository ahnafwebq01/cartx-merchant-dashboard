"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  LogIn,
  KeyRound,
  Mail,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { useAuth, DEMO_CREDENTIALS } from "@/lib/auth/context";
import type { MerchantRole } from "@/types/auth";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { user, isAuthenticated, loginWithCredentials, loginAsDemo } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "demo@cartx.example.com",
      password: "password123",
      rememberMe: true,
    },
  });

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  const onSubmit = async (values: LoginFormValues) => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const result = await loginWithCredentials(values.email, values.password);
      if (result.success) {
        toast.success("Welcome back!", {
          description: "Signed in successfully to CartX Merchant Dashboard (Demo Mode).",
        });
        router.push("/dashboard");
      } else {
        setErrorMessage(result.error || "Authentication failed. Please verify credentials.");
      }
    } catch {
      setErrorMessage("An unexpected authentication error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoFill = (email: string, role: string) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", "password123", { shouldValidate: true });
    setErrorMessage(null);
    toast.info(`Filled demo credentials for ${role}`, {
      description: "Click 'Sign In' or use Instant Access below.",
    });
  };

  const handleInstantDemoLogin = (role: MerchantRole) => {
    loginAsDemo(role);
    toast.success("Demo Mode Activated", {
      description: `Signed in as Demo ${role.replace(/_/g, " ")}.`,
    });
    router.push("/dashboard");
  };

  return (
    <GlassCard variant="elevated" className="p-4 sm:p-8 space-y-5 sm:space-y-6">
      {/* Demo Mode Notice Banner */}
      <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 text-xs text-muted-foreground flex items-start gap-2.5">
        <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-foreground">Interactive Demo Mode</p>
          <p>
            CartX operates in frontend evaluation mode. Use the preconfigured roles below or type custom credentials.
          </p>
        </div>
      </div>

      {/* Form Error Banner */}
      {errorMessage && (
        <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-xs text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-medium text-foreground">
            Merchant Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="merchant@example.com"
              className="pl-9 bg-background/60"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-medium text-foreground">
              Password
            </Label>
            <button
              type="button"
              onClick={() => setForgotPasswordOpen(true)}
              className="text-xs text-primary hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="bg-background/60"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-[11px] text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2 pt-1">
          <Checkbox
            id="rememberMe"
            defaultChecked
            onCheckedChange={(checked) => setValue("rememberMe", !!checked)}
          />
          <Label htmlFor="rememberMe" className="text-xs text-muted-foreground cursor-pointer">
            Remember me on this browser
          </Label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full font-medium cursor-pointer shadow-md shadow-primary/20"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing In...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Sign In to Merchant Console
            </span>
          )}
        </Button>
      </form>

      {/* Demo Credentials Quick-Access Picker */}
      <div className="pt-2 border-t border-border/60 space-y-3">
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 text-xs">
          <span className="font-semibold text-foreground flex items-center gap-1.5">
            <KeyRound className="h-3.5 w-3.5 text-primary" />
            Quick Demo Access
          </span>
          <span className="text-[10px] text-muted-foreground">Click role to auto-sign in</span>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
          {DEMO_CREDENTIALS.map((cred) => (
            <button
              key={cred.role}
              type="button"
              onClick={() => handleInstantDemoLogin(cred.role)}
              className="p-2.5 rounded-lg border border-border/80 bg-background/50 hover:bg-muted hover:border-primary/40 transition-all text-left flex flex-col gap-0.5 group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                  {cred.label.split(" (")[0]}
                </span>
                <Badge variant="outline" className="text-[9px] uppercase font-mono px-1 py-0">
                  {cred.role}
                </Badge>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono truncate">
                {cred.email}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Link to Register */}
      <div className="pt-2 text-center text-xs text-muted-foreground">
        Don&apos;t have a merchant account?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
        >
          Register Store Demo
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Forgot Password Explanation Dialog */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="sm:max-w-md glass-panel">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary">
              <KeyRound className="h-5 w-5" />
              <DialogTitle className="text-base">Password Recovery (Demo Mode)</DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              CartX Merchant Dashboard is currently running in client-side Demo Mode.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs text-muted-foreground">
            <div className="p-3 rounded-lg border border-border bg-muted/40 space-y-1.5">
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-amber-500" />
                No Production Backend Connected
              </p>
              <p>
                In Demo Mode, accounts are simulated locally. You can sign in using any of the built-in demo roles (e.g. <code>demo@cartx.example.com</code> with password <code>password123</code>) or create a fresh demo account on the registration page.
              </p>
            </div>
            <p>
              When a production backend with SMTP or SMS OTP is linked, standard password reset links and SMS verification codes will be sent.
            </p>
          </div>
          <div className="flex justify-end pt-2">
            <Button
              size="sm"
              onClick={() => {
                setForgotPasswordOpen(false);
                handleQuickDemoFill("demo@cartx.example.com", "Store Owner");
              }}
            >
              Fill Default Demo Credentials
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </GlassCard>
  );
}

export default LoginForm;
