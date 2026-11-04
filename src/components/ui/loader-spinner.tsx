"use client";

import * as React from "react";
import { motion, type HTMLMotionProps, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type SpinnerSizePreset = "xs" | "sm" | "md" | "lg" | "xl";
export type SpinnerColorVariant = "primary" | "white" | "muted" | "accent" | "foreground";

const SIZE_PRESETS: Record<SpinnerSizePreset, { size: number; borderWidth: number }> = {
  xs: { size: 14, borderWidth: 2 },
  sm: { size: 18, borderWidth: 2.5 },
  md: { size: 28, borderWidth: 3 },
  lg: { size: 40, borderWidth: 4 },
  xl: { size: 56, borderWidth: 4.5 },
};

const COLOR_VARIANTS: Record<SpinnerColorVariant, string> = {
  primary: "var(--primary)",
  white: "#ffffff",
  muted: "var(--muted-foreground)",
  accent: "var(--accent)",
  foreground: "var(--foreground)",
};

export interface LoaderSpinnerProps
  extends Omit<HTMLMotionProps<"div">, "children"> {
  /**
   * Numeric size in pixels. Overrides `sizePreset`.
   */
  size?: number;
  /**
   * Pre-configured size variants.
   * xs = 14px, sm = 18px, md = 28px, lg = 40px, xl = 56px.
   */
  sizePreset?: SpinnerSizePreset;
  /**
   * CSS color or theme variable. Overrides `variant`.
   */
  color?: string;
  /**
   * Pre-configured color variants corresponding to CartX theme tokens.
   */
  variant?: SpinnerColorVariant;
  /**
   * Border width in pixels.
   */
  borderWidth?: number;
  /**
   * Single rotation cycle duration in seconds (default 0.9s).
   */
  duration?: number;
  /**
   * Accessible description for screen readers.
   */
  label?: string;
}

/**
 * 21st.dev Spinner Loader Integration (id: 20015, by animbits).
 * Enhanced with CartX Design System theme tokens, size presets,
 * ARIA accessibility, and reduced-motion handling.
 *
 * Source: https://21st.dev/r/animbits/loaders-spinner
 */
export function LoaderSpinner({
  className,
  size,
  sizePreset = "md",
  color,
  variant = "primary",
  borderWidth,
  duration = 0.9,
  label = "Loading...",
  style,
  ...props
}: LoaderSpinnerProps) {
  const shouldReduceMotion = useReducedMotion();
  const presetConfig = SIZE_PRESETS[sizePreset];
  const finalSize = size ?? presetConfig.size;
  const finalBorderWidth = borderWidth ?? presetConfig.borderWidth;
  const finalColor = color ?? COLOR_VARIANTS[variant];

  return (
    <div
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center justify-center shrink-0", className)}
    >
      <motion.div
        className="rounded-full shrink-0"
        style={{
          width: finalSize,
          height: finalSize,
          border: `${finalBorderWidth}px solid transparent`,
          borderTopColor: finalColor,
          borderRightColor: finalColor,
          ...style,
        }}
        animate={shouldReduceMotion ? { opacity: [0.4, 1, 0.4] } : { rotate: 360 }}
        transition={
          shouldReduceMotion
            ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
            : { duration, ease: "linear", repeat: Infinity }
        }
        {...props}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

/**
 * Full page loading state for top-level dashboard suspense and routing.
 */
export function FullPageLoader({
  title = "Loading CartX Panel...",
  description = "Preparing merchant data and administrative controls",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div
      className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-4 p-8 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="relative flex items-center justify-center">
        <LoaderSpinner sizePreset="lg" variant="primary" />
        <div className="absolute h-4 w-4 rounded-full bg-primary/20 blur-xs" />
      </div>
      <div className="space-y-1">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
        {description && (
          <p className="text-xs text-muted-foreground max-w-sm">{description}</p>
        )}
      </div>
    </div>
  );
}

/**
 * Section / Card loading state for data widgets.
 */
export function SectionLoader({
  message = "Loading data...",
  className,
  minHeight = "min-h-[180px]",
}: {
  message?: string;
  className?: string;
  minHeight?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card/40 p-6 text-center",
        minHeight,
        className
      )}
      role="status"
      aria-live="polite"
    >
      <LoaderSpinner sizePreset="md" variant="primary" />
      <span className="text-xs text-muted-foreground">{message}</span>
    </div>
  );
}

/**
 * Compact inline spinner for buttons and interactive controls.
 */
export function ButtonSpinner({
  className,
  variant = "white",
}: {
  className?: string;
  variant?: SpinnerColorVariant;
}) {
  return (
    <LoaderSpinner
      sizePreset="xs"
      variant={variant}
      className={cn("mr-2 shrink-0", className)}
    />
  );
}

/**
 * Table loading overlay with spinner and accessible indication.
 */
export function TableLoader({
  rows = 4,
  message = "Fetching table records...",
}: {
  rows?: number;
  message?: string;
}) {
  return (
    <div className="relative w-full rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-8 flex flex-col items-center justify-center gap-3">
        <LoaderSpinner sizePreset="md" variant="primary" />
        <p className="text-xs text-muted-foreground font-medium">{message}</p>
      </div>
      <div className="divide-y divide-border/60 border-t border-border/60 opacity-40">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-11 flex items-center px-4 gap-4 animate-pulse">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-4 flex-1 bg-muted/60 rounded" />
            <div className="h-4 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoaderSpinner;

