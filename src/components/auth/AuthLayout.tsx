"use client";

import React from "react";
import Link from "next/link";
import { Store, ShieldCheck, Sparkles, ArrowLeft } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { Badge } from "@/components/ui/badge";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full relative flex flex-col justify-between overflow-x-hidden bg-background text-foreground selection:bg-primary/20">
      {/* Background Ambient Glows & Gradient Mesh */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-[30rem] w-[30rem] rounded-full bg-sky-500/10 dark:bg-sky-500/15 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-3xl" />
        <div className="absolute inset-0 ambient-glow-bg opacity-70" />
      </div>

      {/* Top Header / Bar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-sky-400 text-white flex items-center justify-center shadow-md shadow-primary/25 transition-transform group-hover:scale-105">
            <Store className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight leading-tight flex items-center gap-1.5">
              CartX
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Merchant
              </span>
            </span>
            <span className="text-[10px] text-muted-foreground leading-none">
              E-Commerce Management Platform
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2.5">
          <Badge
            variant="outline"
            className="hidden sm:inline-flex items-center gap-1.5 py-1 px-2.5 text-[11px] font-mono border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10"
          >
            <Sparkles className="h-3 w-3" />
            <span>Frontend Demo Mode</span>
          </Badge>

          <ThemeSwitcher />

          <Link
            href="/"
            className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-md hover:bg-muted/50"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Authentication Card Container */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-md sm:max-w-lg">
          {/* Header titles */}
          <div className="text-center mb-6 space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {subtitle}
            </p>
          </div>

          {/* Render children form */}
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-muted-foreground gap-2 border-t border-border/40">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          <span>CartX Merchant Platform • Bangladesh E-Commerce Engine</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Demo Authentication Environment</span>
          <span>•</span>
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span>•</span>
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default AuthLayout;

