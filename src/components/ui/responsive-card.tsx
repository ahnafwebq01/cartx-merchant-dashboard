"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MobileDataCardProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
}

export function MobileDataCard({
  className,
  selected = false,
  children,
  ...props
}: MobileDataCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card/90 dark:bg-card/80 backdrop-blur-sm p-4 space-y-3 shadow-xs transition-colors",
        selected && "border-primary/50 bg-primary/5 dark:bg-primary/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface MobileCardFieldProps {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}

export function MobileCardField({
  label,
  value,
  className,
  labelClassName,
  valueClassName,
}: MobileCardFieldProps) {
  return (
    <div className={cn("flex flex-col min-w-0", className)}>
      <span
        className={cn(
          "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider",
          labelClassName
        )}
      >
        {label}
      </span>
      <div
        className={cn(
          "text-xs font-medium text-foreground mt-0.5 break-words",
          valueClassName
        )}
      >
        {value}
      </div>
    </div>
  );
}

export function MobileCardFieldInline({
  label,
  value,
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between text-xs py-0.5", className)}>
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground text-right">{value}</span>
    </div>
  );
}

