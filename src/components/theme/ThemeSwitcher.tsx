"use client";

import React, { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ThemeSwitcherProps {
  variant?: "dropdown" | "segmented";
  className?: string;
  size?: "sm" | "default";
}

const emptySubscribe = () => () => {};

export function ThemeSwitcher({
  variant = "dropdown",
  className,
}: ThemeSwitcherProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!mounted) {
    // Avoid hydration mismatch by rendering placeholder with matching dimensions
    return (
      <div
        className={cn(
          variant === "segmented"
            ? "flex items-center gap-1 p-1 rounded-lg border border-border bg-muted/40 h-9 w-[180px]"
            : "h-9 w-9 rounded-lg border border-border bg-muted/40",
          className
        )}
      />
    );
  }

  if (variant === "segmented") {
    const options: Array<{ value: "light" | "dark" | "system"; label: string; icon: React.ComponentType<{ className?: string }> }> = [
      { value: "light", label: "Light", icon: Sun },
      { value: "dark", label: "Dark", icon: Moon },
      { value: "system", label: "System", icon: Laptop },
    ];

    return (
      <div
        className={cn(
          "inline-flex items-center gap-1 p-1 rounded-lg border border-border bg-muted/40 backdrop-blur-sm",
          className
        )}
        role="radiogroup"
        aria-label="Theme selection"
      >
        {options.map((option) => {
          const Icon = option.icon;
          const isActive = theme === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setTheme(option.value)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer",
                isActive
                  ? "bg-card text-foreground shadow-xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Dropdown variant (standard for topbar/header)
  const CurrentIcon = resolvedTheme === "dark" ? Moon : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/60 relative cursor-pointer",
            className
          )}
          aria-label="Toggle theme (Light, Dark, System)"
        >
          <CurrentIcon className="h-4 w-4 transition-transform hover:scale-110" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36 glass-panel">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex items-center justify-between cursor-pointer text-xs"
        >
          <span className="flex items-center gap-2">
            <Sun className="h-3.5 w-3.5 text-amber-500" />
            <span>Light</span>
          </span>
          {theme === "light" && <Check className="h-3.5 w-3.5 text-primary" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex items-center justify-between cursor-pointer text-xs"
        >
          <span className="flex items-center gap-2">
            <Moon className="h-3.5 w-3.5 text-indigo-400" />
            <span>Dark</span>
          </span>
          {theme === "dark" && <Check className="h-3.5 w-3.5 text-primary" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex items-center justify-between cursor-pointer text-xs"
        >
          <span className="flex items-center gap-2">
            <Laptop className="h-3.5 w-3.5 text-muted-foreground" />
            <span>System</span>
          </span>
          {theme === "system" && <Check className="h-3.5 w-3.5 text-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ThemeSwitcher;
