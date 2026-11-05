"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Store,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  NAVIGATION_GROUPS,
  isRouteActive,
  isParentItemActive,
} from "@/config/navigation";
import { useAuth } from "@/lib/auth/context";
import { hasPermission } from "@/lib/permissions/rbac";
import type { Permission } from "@/types/auth";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { DASHBOARD_EASE, microInteractions } from "@/lib/animations";

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
  const { permissions, currentRole, currentStore } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  // State for collapsible group sections (e.g. Catalog, Sales, etc.)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      NAVIGATION_GROUPS.forEach((group) => {
        initial[group.id] = group.defaultOpen ?? true;
      });
      return initial;
    },
  );

  // State for collapsible parent items (e.g. Products, Inventory, Orders, etc.)
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  // Automatically expand group section and parent item when a child route is active
  useEffect(() => {
    NAVIGATION_GROUPS.forEach((group) => {
      let groupHasActive = false;

      group.items.forEach((item) => {
        if (isParentItemActive(item, pathname)) {
          groupHasActive = true;
          if (item.children && item.children.length > 0) {
            setOpenItems((prev) => ({ ...prev, [item.title]: true }));
          }
        }
      });

      if (groupHasActive) {
        setOpenSections((prev) => ({ ...prev, [group.id]: true }));
      }
    });
  }, [pathname]);

  const toggleSection = (groupId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const toggleItem = (title: string, defaultState: boolean) => {
    setOpenItems((prev) => ({
      ...prev,
      [title]: prev[title] !== undefined ? !prev[title] : !defaultState,
    }));
  };

  // Helper for role & permission checks
  const hasItemPermission = (permission?: Permission) => {
    if (currentRole === "owner") return true;
    if (!permission) return true;
    return hasPermission(permissions, permission);
  };

  // Filter groups and items based on RBAC permissions
  const visibleGroups = NAVIGATION_GROUPS.map((group) => {
    const visibleItems = group.items
      .filter((item) => hasItemPermission(item.permission))
      .map((item) => {
        if (!item.children) return item;
        const visibleChildren = item.children.filter((child) =>
          hasItemPermission(child.permission),
        );
        return {
          ...item,
          children: visibleChildren,
        };
      });

    return {
      ...group,
      items: visibleItems,
    };
  }).filter((group) => group.items.length > 0);

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-transparent select-none overflow-hidden",
        className,
      )}
      aria-label="Merchant Dashboard Navigation"
    >
      {/* Brand / Store Header */}
      <div
        className={cn(
          "flex items-center h-16 border-b border-border/60 bg-card/30 backdrop-blur-xs shrink-0 transition-colors",
          isCollapsed ? "justify-center px-2" : "gap-3 px-6",
        )}
      >
        <motion.div
          whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-xs"
        >
          <Store className="h-5 w-5" />
        </motion.div>

        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, width: 0, x: -8 }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, width: "auto", x: 0 }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, width: 0, x: -8 }
              }
              transition={{ duration: 0.2, ease: DASHBOARD_EASE }}
              className="flex flex-col min-w-0 overflow-hidden whitespace-nowrap"
            >
              <span className="font-semibold text-sm leading-tight text-foreground truncate">
                {currentStore?.name || "CartX Store"}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                Merchant Panel
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scrollable Navigation Body */}
      <nav
        className="flex-1 overflow-y-auto px-2 py-3 space-y-4 focus:outline-none scrollbar-thin"
        aria-label="Sidebar Sections"
      >
        {visibleGroups.map((group, groupIdx) => {
          const isSectionOpen = openSections[group.id] ?? true;

          // Collapsed Mode: Render icon buttons with tooltips
          if (isCollapsed) {
            return (
              <div key={group.id} className="space-y-1">
                {groupIdx > 0 && (
                  <div className="my-2 border-t border-border/50" />
                )}
                {group.items.map((item) => {
                  const isParentActive = isParentItemActive(item, pathname);
                  const hasChildren = item.children && item.children.length > 0;

                  return (
                    <Tooltip key={item.title} delayDuration={100}>
                      <TooltipTrigger asChild>
                        <motion.div
                          whileHover={
                            shouldReduceMotion ? undefined : { scale: 1.05 }
                          }
                          whileTap={
                            shouldReduceMotion ? undefined : { scale: 0.95 }
                          }
                        >
                          <Link
                            href={item.href}
                            onClick={onItemClick}
                            className={cn(
                              "flex items-center justify-center h-10 w-10 mx-auto rounded-lg transition-colors relative",
                              isParentActive
                                ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            )}
                            aria-label={item.title}
                          >
                            <item.icon className="h-4 w-4 shrink-0" />
                            {hasChildren && (
                              <span
                                className={cn(
                                  "absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full",
                                  isParentActive
                                    ? "bg-primary-foreground"
                                    : "bg-muted-foreground/50",
                                )}
                              />
                            )}
                          </Link>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        sideOffset={8}
                        className="flex flex-col gap-1.5 text-xs py-2 px-3 min-w-[150px] max-w-[220px]"
                      >
                        <div className="font-semibold text-foreground flex items-center justify-between gap-2">
                          <span>{item.title}</span>
                          {item.badge && (
                            <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded font-normal text-secondary-foreground">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {hasChildren && (
                          <div className="text-[11px] text-muted-foreground space-y-1 pt-1.5 border-t border-border/50">
                            {item.children?.map((sub) => {
                              const isSubActive =
                                pathname === sub.href ||
                                (sub.href !== item.href &&
                                  pathname.startsWith(`${sub.href}/`));
                              return (
                                <div
                                  key={sub.href}
                                  className={cn(
                                    "truncate flex items-center gap-1.5",
                                    isSubActive
                                      ? "text-primary font-semibold"
                                      : "",
                                  )}
                                >
                                  <span className="h-1 w-1 rounded-full bg-current shrink-0" />
                                  <span>{sub.title}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            );
          }

          // Expanded Mode: Render group header and nested accordions
          return (
            <div key={group.id} className="space-y-1">
              {/* Group Section Heading */}
              {group.collapsible !== false ? (
                <div className="px-2 pt-2 pb-1">
                  <motion.button
                    type="button"
                    onClick={() => toggleSection(group.id)}
                    whileHover={shouldReduceMotion ? undefined : { x: 1 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
                    className="flex items-center justify-between w-full text-[10px] font-semibold text-muted-foreground/80 hover:text-foreground uppercase tracking-wider transition-colors px-1 py-0.5 rounded cursor-pointer"
                    aria-expanded={isSectionOpen}
                  >
                    <span>{group.title}</span>
                    <motion.div
                      animate={{ rotate: isSectionOpen ? 0 : -90 }}
                      transition={{ duration: 0.2, ease: DASHBOARD_EASE }}
                    >
                      <ChevronDown className="h-3 w-3 shrink-0" />
                    </motion.div>
                  </motion.button>
                </div>
              ) : (
                <div className="px-3 pt-2 pb-1 text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-wider">
                  {group.title}
                </div>
              )}

              {/* Group Items with Animated Height Accordion */}
              <AnimatePresence initial={false}>
                {isSectionOpen && (
                  <motion.div
                    key="group-items-content"
                    initial={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { height: 0, opacity: 0 }
                    }
                    animate={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : {
                            height: "auto",
                            opacity: 1,
                            transition: {
                              duration: 0.22,
                              ease: DASHBOARD_EASE,
                            },
                          }
                    }
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : {
                            height: 0,
                            opacity: 0,
                            transition: {
                              duration: 0.18,
                              ease: DASHBOARD_EASE,
                            },
                          }
                    }
                    className="space-y-0.5 overflow-hidden"
                  >
                    {group.items.map((item) => {
                      const hasChildren =
                        item.children && item.children.length > 0;
                      const isParentActive = isParentItemActive(item, pathname);
                      const isDirectActive = isRouteActive(
                        pathname,
                        item.href,
                        item.exactMatch,
                      );
                      const isItemOpen =
                        openItems[item.title] ?? isParentActive;

                      if (hasChildren) {
                        return (
                          <div key={item.title} className="space-y-0.5">
                            <motion.button
                              type="button"
                              onClick={() =>
                                toggleItem(item.title, isParentActive)
                              }
                              whileHover={
                                shouldReduceMotion
                                  ? undefined
                                  : microInteractions.subtleHover
                              }
                              whileTap={
                                shouldReduceMotion
                                  ? undefined
                                  : microInteractions.tapScale
                              }
                              className={cn(
                                "flex items-center justify-between w-full px-3 py-2 rounded-md text-xs font-medium transition-colors relative cursor-pointer",
                                isParentActive
                                  ? "bg-secondary/80 text-foreground font-semibold"
                                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                              )}
                              aria-expanded={isItemOpen}
                            >
                              <div className="flex items-center gap-2.5 truncate">
                                <item.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <span className="truncate">{item.title}</span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0 ml-1">
                                {item.badge && (
                                  <span className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded font-normal">
                                    {item.badge}
                                  </span>
                                )}
                                <motion.div
                                  animate={{ rotate: isItemOpen ? 180 : 0 }}
                                  transition={{
                                    duration: 0.2,
                                    ease: DASHBOARD_EASE,
                                  }}
                                >
                                  <ChevronDown className="h-3.5 w-3.5" />
                                </motion.div>
                              </div>
                            </motion.button>

                            {/* Nested Subroutes with Animated Height and Opacity */}
                            <AnimatePresence initial={false}>
                              {isItemOpen && (
                                <motion.div
                                  key={`sub-${item.title}`}
                                  initial={
                                    shouldReduceMotion
                                      ? { opacity: 0 }
                                      : { height: 0, opacity: 0 }
                                  }
                                  animate={
                                    shouldReduceMotion
                                      ? { opacity: 1 }
                                      : {
                                          height: "auto",
                                          opacity: 1,
                                          transition: {
                                            duration: 0.22,
                                            ease: DASHBOARD_EASE,
                                          },
                                        }
                                  }
                                  exit={
                                    shouldReduceMotion
                                      ? { opacity: 0 }
                                      : {
                                          height: 0,
                                          opacity: 0,
                                          transition: {
                                            duration: 0.18,
                                            ease: DASHBOARD_EASE,
                                          },
                                        }
                                  }
                                  className="ml-5 pl-2.5 border-l border-border/70 mt-0.5 space-y-0.5 overflow-hidden"
                                >
                                  {item.children?.map((sub) => {
                                    const isSubActive =
                                      pathname === sub.href ||
                                      (sub.href !== item.href &&
                                        pathname.startsWith(`${sub.href}/`));

                                    return (
                                      <motion.div
                                        key={sub.href}
                                        whileHover={
                                          shouldReduceMotion
                                            ? undefined
                                            : microInteractions.subtleHover
                                        }
                                        whileTap={
                                          shouldReduceMotion
                                            ? undefined
                                            : microInteractions.tapScale
                                        }
                                        className="relative"
                                      >
                                        <Link
                                          href={sub.href}
                                          onClick={onItemClick}
                                          className={cn(
                                            "flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors relative z-10",
                                            isSubActive
                                              ? "text-primary font-semibold"
                                              : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                                          )}
                                        >
                                          {isSubActive &&
                                            !shouldReduceMotion && (
                                              <motion.span
                                                layoutId="sidebarActiveSubIndicator"
                                                className="absolute inset-0 rounded-md bg-primary/10 -z-10"
                                                transition={{
                                                  type: "spring",
                                                  stiffness: 400,
                                                  damping: 30,
                                                }}
                                              />
                                            )}
                                          <span className="truncate">
                                            {sub.title}
                                          </span>
                                          {sub.badge && (
                                            <span className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded ml-1">
                                              {sub.badge}
                                            </span>
                                          )}
                                        </Link>
                                      </motion.div>
                                    );
                                  })}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      }

                      // Direct Link (no children) with animated active indicator
                      return (
                        <motion.div
                          key={item.title}
                          whileHover={
                            shouldReduceMotion
                              ? undefined
                              : microInteractions.subtleHover
                          }
                          whileTap={
                            shouldReduceMotion
                              ? undefined
                              : microInteractions.tapScale
                          }
                          className="relative"
                        >
                          <Link
                            href={item.href}
                            onClick={onItemClick}
                            className={cn(
                              "flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors relative z-10",
                              isDirectActive
                                ? "text-primary-foreground font-semibold shadow-xs"
                                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                            )}
                          >
                            {isDirectActive && !shouldReduceMotion && (
                              <motion.span
                                layoutId="sidebarActiveDirectIndicator"
                                className="absolute inset-0 rounded-md bg-primary -z-10 shadow-xs"
                                transition={{
                                  type: "spring",
                                  stiffness: 420,
                                  damping: 32,
                                }}
                              />
                            )}
                            <item.icon className="h-4 w-4 shrink-0" />
                            <span className="truncate">{item.title}</span>
                            {item.badge && (
                              <span
                                className={cn(
                                  "ml-auto text-[10px] px-1.5 py-0.5 rounded",
                                  isDirectActive
                                    ? "bg-primary-foreground/20 text-primary-foreground"
                                    : "bg-secondary text-secondary-foreground",
                                )}
                              >
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Footer Area: System Status & Collapse Toggle */}
      <div className="p-2 border-t border-border/60 shrink-0 flex flex-col gap-1.5 bg-card/60 backdrop-blur-xs">
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              initial={
                shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1, height: "auto" }
              }
              exit={
                shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }
              }
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-between text-[11px] text-muted-foreground px-2 py-1">
                <span>CartX Engine</span>
                <span className="inline-flex items-center gap-1.5 text-success font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                  </span>
                  Operational
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {onToggleCollapse &&
          (isCollapsed ? (
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onToggleCollapse}
                  className="w-10 h-10 mx-auto p-0 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-lg cursor-pointer"
                  aria-label="Expand sidebar"
                >
                  <PanelLeftOpen className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                Expand Sidebar
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="w-full h-8 text-xs text-muted-foreground hover:text-foreground transition-colors justify-between px-2 cursor-pointer"
              aria-label="Collapse sidebar"
            >
              <span>Collapse Sidebar</span>
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          ))}
      </div>
    </aside>
  );
}

export default Sidebar;
