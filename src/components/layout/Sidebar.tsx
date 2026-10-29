"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Store,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { NAVIGATION_ITEMS } from "@/config/navigation";
import { useAuth } from "@/lib/auth/context";
import { hasPermission } from "@/lib/permissions/rbac";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  onItemClick?: () => void;
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  onItemClick,
  className,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const { permissions, currentRole } = useAuth();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Filter items based on user role and permissions
  const visibleItems = NAVIGATION_ITEMS.filter((item) => {
    if (currentRole === "owner") return true;
    if (!item.permission) return true;
    return hasPermission(permissions, item.permission);
  });

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-card border-r border-border select-none transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
      aria-label="Merchant Navigation"
    >
      {/* Brand Header */}
      <div
        className={cn(
          "flex items-center h-16 border-b border-border transition-all",
          isCollapsed ? "justify-center px-2" : "gap-3 px-6"
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-sm">
          <Store className="h-5 w-5" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm leading-tight text-foreground truncate">
              CartX
            </span>
            <span className="text-xs text-muted-foreground truncate">
              Merchant Panel
            </span>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const hasChildren = item.children && item.children.length > 0;
          const isGroupOpen = openGroups[item.title] ?? isActive;

          // Collapsed Icon-Only View
          if (isCollapsed) {
            return (
              <Tooltip key={item.title} delayDuration={100}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    onClick={onItemClick}
                    className={cn(
                      "flex items-center justify-center h-10 w-10 mx-auto rounded-lg transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    aria-label={item.title}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="flex flex-col gap-1 text-xs">
                  <span className="font-semibold">{item.title}</span>
                  {hasChildren && (
                    <div className="text-[11px] text-muted-foreground space-y-0.5">
                      {item.children?.map((sub) => (
                        <div key={sub.href}>• {sub.title}</div>
                      ))}
                    </div>
                  )}
                </TooltipContent>
              </Tooltip>
            );
          }

          // Full Expanded View
          return (
            <div key={item.title} className="space-y-1">
              {hasChildren ? (
                <div>
                  <button
                    type="button"
                    onClick={() => toggleGroup(item.title)}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2 rounded-md text-xs font-medium transition-colors",
                      isActive
                        ? "bg-secondary text-primary font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    aria-expanded={isGroupOpen}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200 shrink-0",
                        isGroupOpen ? "transform rotate-180" : ""
                      )}
                    />
                  </button>

                  {isGroupOpen && (
                    <div className="ml-6 pl-2 border-l border-border mt-1 space-y-1">
                      {item.children?.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={onItemClick}
                            className={cn(
                              "block px-2.5 py-1.5 rounded-md text-xs transition-colors",
                              isSubActive
                                ? "text-primary font-medium bg-primary/10"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                          >
                            {sub.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  onClick={onItemClick}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer System Status & Collapse Toggle */}
      <div className="p-2 border-t border-border flex flex-col gap-2">
        {!isCollapsed ? (
          <div className="flex items-center justify-between text-[11px] text-muted-foreground px-2 py-1">
            <span>CartX Engine</span>
            <span className="inline-flex items-center gap-1.5 text-success">
              <span className="h-2 w-2 rounded-full bg-success"></span>
              Operational
            </span>
          </div>
        ) : null}

        {onToggleCollapse && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className={cn(
              "w-full h-8 text-xs text-muted-foreground hover:text-foreground transition-colors",
              isCollapsed ? "justify-center p-0" : "justify-between px-2"
            )}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {!isCollapsed && <span>Collapse Sidebar</span>}
            {isCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </aside>
  );
}
