"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Store, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/context";
import { DASHBOARD_EASE } from "@/lib/animations";

export function LandingPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  // Redirect existing authenticated users straight to the dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  // Prevent flash of landing page while redirecting authenticated user
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // Animation variants with reduced-motion awareness
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: shouldReduceMotion
        ? { duration: 0.01 }
        : {
            staggerChildren: 0.1,
            delayChildren: 0.05,
          },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 14,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: shouldReduceMotion
        ? { duration: 0.01 }
        : {
            duration: 0.45,
            ease: DASHBOARD_EASE,
          },
    },
  };

  const bgOrbVariantsA: Variants = {
    animate: shouldReduceMotion
      ? {}
      : {
          x: [0, 20, -15, 0],
          y: [0, -15, 12, 0],
          scale: [1, 1.05, 0.95, 1],
          transition: {
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          },
        },
  };

  const bgOrbVariantsB: Variants = {
    animate: shouldReduceMotion
      ? {}
      : {
          x: [0, -20, 15, 0],
          y: [0, 18, -12, 0],
          scale: [1, 0.95, 1.05, 1],
          transition: {
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          },
        },
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-background text-foreground px-4 sm:px-6 py-12 selection:bg-primary/20">
      {/* Subtle Background Ambient Mesh & Animations */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
        <motion.div
          variants={bgOrbVariantsA}
          animate="animate"
          className="absolute -top-36 -left-36 h-96 w-96 rounded-full bg-primary/12 dark:bg-primary/20 blur-3xl"
        />
        <motion.div
          variants={bgOrbVariantsB}
          animate="animate"
          className="absolute -bottom-36 -right-36 h-96 w-96 rounded-full bg-sky-500/10 dark:bg-sky-500/18 blur-3xl"
        />
        <div className="absolute inset-0 ambient-glow-bg opacity-60 dark:opacity-80" />
      </div>

      {/* Main Center Content — ONLY Branding, Headline, Description, Login, Register */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md sm:max-w-lg mx-auto relative z-10 flex flex-col items-center"
      >
        <div className="w-full rounded-2xl border border-border/70 bg-card/80 dark:bg-card/65 backdrop-blur-xl shadow-xl shadow-black/5 dark:shadow-black/30 p-8 sm:p-10 flex flex-col items-center text-center">
          {/* CartX Branding / Logo */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center gap-3 mb-6"
          >
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-primary to-sky-400 text-white flex items-center justify-center shadow-lg shadow-primary/25 transition-transform hover:scale-105 duration-300">
              <Store className="h-8 w-8" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                CartX
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono">
                Merchant
              </span>
            </div>
          </motion.div>

          {/* Welcome Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3 text-balance"
          >
            Welcome to CartX
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-sm sm:max-w-md mb-8 text-balance"
          >
            A modern, unified e-commerce platform for merchants in Bangladesh to manage catalog, fulfillment, orders, and sales analytics.
          </motion.p>

          {/* Action Buttons: Login & Register */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto"
          >
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto min-w-[140px] font-medium shadow-md shadow-primary/20 cursor-pointer"
            >
              <Link
                href="/login"
                className="flex items-center justify-center gap-2"
                aria-label="Sign in to your merchant account"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto min-w-[140px] font-medium cursor-pointer"
            >
              <Link
                href="/register"
                className="flex items-center justify-center gap-2"
                aria-label="Register a new merchant store"
              >
                <UserPlus className="h-4 w-4" />
                <span>Register Store</span>
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}

export default LandingPage;

