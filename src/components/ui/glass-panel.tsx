import * as React from "react";
import { cn } from "@/lib/utils";

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, glow = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl border bg-card/75 dark:bg-card/70 backdrop-blur-xl border-border/70 dark:border-white/10 shadow-lg shadow-black/5 p-6",
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

GlassPanel.displayName = "GlassPanel";

