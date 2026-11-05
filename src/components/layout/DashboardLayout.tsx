"use client";

import React, { useState, Suspense } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { PageTransition } from "@/components/shared/PageTransition";
import { DASHBOARD_EASE } from "@/lib/animations";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Enhanced Dashboard Shell Layout for CartX Merchant Dashboard.
 * Integrates persistent desktop sidebar with smooth Motion collapsible width,
 * mobile drawer, sticky topbar, and animated page transitions.
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background relative selection:bg-primary/20">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 ambient-glow-bg opacity-60 dark:opacity-80" />

      {/* Desktop Persistent Sidebar with Animated Collapsible Width */}
      <motion.div
        animate={{ width: isCollapsed ? 64 : 256 }}
        transition={{
          duration: shouldReduceMotion ? 0.05 : 0.26,
          ease: DASHBOARD_EASE,
        }}
        className="hidden md:flex flex-col shrink-0 overflow-hidden border-r border-border/60 bg-card/85 dark:bg-card/75 backdrop-blur-xl shadow-xs"
      >
        <Suspense fallback={<div className="w-64 h-full bg-card/80 backdrop-blur-md" />}>
          <Sidebar
            className="h-full w-full border-r-0"
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          />
        </Suspense>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 focus:outline-none"
          tabIndex={-1}
        >
          <div className="mx-auto max-w-7xl">
            <PageTransition key={pathname}>{children}</PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
