"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  UserPlus,
  Mail,
  User,
  Phone,
  Store,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const registerSchema = z
  .object({
    name: z.string().min(2, "Full Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .optional()
      .or(z.literal("")),
    storeName: z.string().min(2, "Store Name must be at least 2 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the Demo Terms and Conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

function computePasswordStrength(pass: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!pass) return { score: 0, label: "None", color: "bg-muted" };
  let score = 0;
  if (pass.length >= 6) score += 1;
  if (pass.length >= 10) score += 1;
  if (/[A-Z]/.test(pass)) score += 1;
  if (/[0-9]/.test(pass)) score += 1;
  if (/[^A-Za-z0-9]/.test(pass)) score += 1;

  if (score <= 1) return { score: 20, label: "Weak", color: "bg-rose-500" };
  if (score === 2) return { score: 45, label: "Fair", color: "bg-amber-500" };
  if (score === 3 || score === 4) return { score: 75, label: "Good", color: "bg-sky-500" };
  return { score: 100, label: "Strong", color: "bg-emerald-500" };
}

export function RegisterForm() {
  const router = useRouter();
  const { user, isAuthenticated, register: registerUser } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "+880 17",
      storeName: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const passwordVal = watch("password", "");
  const strength = useMemo(() => computePasswordStrength(passwordVal), [passwordVal]);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  const onSubmit = async (values: RegisterFormValues) => {
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const result = await registerUser({
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        storeName: values.storeName,
        password: values.password,
      });

      if (result.success) {
        toast.success("Demo Store Registered!", {
          description: `Welcome ${values.name}! Your demo account for "${values.storeName}" is ready.`,
        });
        router.push("/dashboard");
      } else {
        setErrorMessage(result.error || "Failed to register demo account.");
      }
    } catch {
      setErrorMessage("An unexpected registration error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassCard variant="elevated" className="p-6 sm:p-8 space-y-6">
      {/* Demo Mode Notice */}
      <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 text-xs text-muted-foreground flex items-start gap-2.5">
        <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-foreground">Demo Registration</p>
          <p>
            Your account and store will be created locally in this browser. No real backend or email verification is required.
          </p>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-xs text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs font-medium text-foreground">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="name"
              placeholder="e.g. Tanvir Ahmed"
              className="pl-9 bg-background/60"
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="text-[11px] text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Store Name */}
        <div className="space-y-1.5">
          <Label htmlFor="storeName" className="text-xs font-medium text-foreground">
            Store Name <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Store className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              id="storeName"
              placeholder="e.g. Dhaka Artisan Boutique"
              className="pl-9 bg-background/60"
              {...register("storeName")}
            />
          </div>
          {errors.storeName && (
            <p className="text-[11px] text-destructive">{errors.storeName.message}</p>
          )}
        </div>

        {/* Email & Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium text-foreground">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                type="email"
                placeholder="merchant@example.com"
                className="pl-9 bg-background/60"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs font-medium text-foreground">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                id="phone"
                placeholder="+880 17XX-XXXXXX"
                className="pl-9 bg-background/60"
                {...register("phone")}
              />
            </div>
            {errors.phone && (
              <p className="text-[11px] text-destructive">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Password & Confirm Password Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-medium text-foreground">
              Password <span className="text-destructive">*</span>
            </Label>
            <PasswordInput
              id="password"
              placeholder="••••••••"
              className="bg-background/60"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-[11px] text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-xs font-medium text-foreground">
              Confirm Password <span className="text-destructive">*</span>
            </Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="••••••••"
              className="bg-background/60"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-[11px] text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        {/* Password Strength Indicator */}
        {passwordVal && (
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">Password Strength:</span>
              <span className="font-semibold">{strength.label}</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${strength.color}`}
                style={{ width: `${strength.score}%` }}
              />
            </div>
          </div>
        )}

        {/* Terms Acceptance */}
        <div className="space-y-1 pt-1">
          <div className="flex items-start gap-2">
            <Checkbox
              id="acceptTerms"
              onCheckedChange={(checked) => setValue("acceptTerms", !!checked, { shouldValidate: true })}
              className="mt-0.5"
            />
            <Label htmlFor="acceptTerms" className="text-xs text-muted-foreground leading-snug cursor-pointer">
              I agree to the <span className="text-foreground font-medium">Demo Evaluation Terms</span> and acknowledge that this session is stored locally for product demonstration.
            </Label>
          </div>
          {errors.acceptTerms && (
            <p className="text-[11px] text-destructive pl-6">{errors.acceptTerms.message}</p>
          )}
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
              Creating Store Account...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Create Demo Merchant Store
            </span>
          )}
        </Button>
      </form>

      {/* Link to Login */}
      <div className="pt-2 border-t border-border/60 text-center text-xs text-muted-foreground">
        Already have a merchant account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
        >
          Sign In
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </GlassCard>
  );
}

export default RegisterForm;
