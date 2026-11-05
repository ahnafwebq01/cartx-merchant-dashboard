import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "subtle" | "interactive";
  glow?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", glow = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border transition-all duration-200",
          // Glass surface & backdrop blur
          "bg-card/75 dark:bg-card/65 backdrop-blur-md",
          "border-border/60 dark:border-white/10",
          "shadow-xs hover:shadow-md",
          variant === "elevated" && "shadow-lg border-border/80 bg-card/85 dark:bg-card/75",
          variant === "subtle" && "bg-muted/40 dark:bg-muted/20 border-border/40 backdrop-blur-sm",
          variant === "interactive" && "cursor-pointer hover:border-primary/50 hover:-translate-y-0.5",
          glow && "relative overflow-hidden before:absolute before:inset-0 before:bg-radial-gradient before:from-primary/10 before:to-transparent before:pointer-events-none",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

