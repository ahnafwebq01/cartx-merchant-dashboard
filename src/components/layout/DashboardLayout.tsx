"use client";

import React, { useState, Suspense } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Reusable Dashboard Shell Layout for CartX Merchant Dashboard.
 * Integrates persistent desktop sidebar with collapsible support (21st.dev inspired),
 * mobile drawer, sticky topbar, and accessible main container.
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop Persistent Sidebar with Collapsible Width */}
      <div
        className={cn(
          "hidden md:flex flex-col shrink-0 transition-all duration-300",
          isCollapsed ? "md:w-16" : "md:w-64"
        )}
      >
        <Suspense fallback={<div className="w-64 h-full bg-card border-r border-border" />}>
          <Sidebar
            className="h-full"
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          />
        </Suspense>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 focus:outline-none" tabIndex={-1}>
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
