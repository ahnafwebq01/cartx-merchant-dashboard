"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  LayoutDashboard,
  Compass,
  Search,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { notFoundVariants, microInteractions } from "@/lib/animations";

export default function NotFoundPage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background text-foreground relative overflow-hidden select-none">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-accent/5 rounded-full blur-2xl pointer-events-none" />

      <motion.div
        variants={notFoundVariants.container}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full text-center relative z-10 flex flex-col items-center"
      >
        {/* Animated Badge & Icon */}
        <motion.div
          variants={notFoundVariants.badge}
          className="relative mb-6"
        >
          <motion.div
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    rotate: [0, 8, -8, 0],
                    y: [0, -4, 0],
                  }
            }
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5 mx-auto"
          >
            <Compass className="h-10 w-10 text-primary" />
          </motion.div>
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-warning text-warning-foreground font-bold text-xs shadow-xs">
            !
          </div>
        </motion.div>

        {/* 404 Large Indicator */}
        <motion.div
          variants={notFoundVariants.number}
          className="text-7xl sm:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground via-foreground to-muted-foreground/40 leading-none mb-2"
        >
          404
        </motion.div>

        {/* Clear Page Not Found Heading */}
        <motion.h1
          variants={notFoundVariants.heading}
          className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-2"
        >
          Page Not Found
        </motion.h1>

        {/* Short Friendly Explanation */}
        <motion.p
          variants={notFoundVariants.body}
          className="text-xs sm:text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed"
        >
          The dashboard resource, administrative view, or URL you navigated to does not exist or may have been relocated in a recent update.
        </motion.p>

        {/* Action Buttons with Motion Tap & Hover */}
        <motion.div
          variants={notFoundVariants.actions}
          className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-8"
        >
          <motion.div
            whileHover={shouldReduceMotion ? undefined : microInteractions.subtleLift}
            whileTap={shouldReduceMotion ? undefined : microInteractions.tapButton}
            className="w-full sm:w-auto"
          >
            <Button asChild size="default" className="w-full sm:w-auto gap-2 shadow-sm font-medium">
              <Link href="/dashboard">
                <LayoutDashboard className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Link>
            </Button>
          </motion.div>

          <motion.div
            whileHover={shouldReduceMotion ? undefined : microInteractions.subtleLift}
            whileTap={shouldReduceMotion ? undefined : microInteractions.tapButton}
            className="w-full sm:w-auto"
          >
            <Button
              variant="outline"
              size="default"
              onClick={handleGoBack}
              className="w-full sm:w-auto gap-2 cursor-pointer font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Quick Navigational Assist Card */}
        <motion.div variants={notFoundVariants.body} className="w-full">
          <Card className="p-4 bg-card/60 backdrop-blur-xs border-border/80 text-left">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground mb-2.5">
              <Search className="h-3.5 w-3.5 text-primary" />
              <span>Common Navigation Destinations</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/dashboard/orders"
                className="p-2 rounded-md bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Orders</span>
              </Link>
              <Link
                href="/dashboard/products"
                className="p-2 rounded-md bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Products</span>
              </Link>
              <Link
                href="/dashboard/analytics"
                className="p-2 rounded-md bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Analytics</span>
              </Link>
              <Link
                href="/dashboard/support"
                className="p-2 rounded-md bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Help Center</span>
              </Link>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

