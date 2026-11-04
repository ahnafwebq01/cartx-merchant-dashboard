"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { pageVariants, reducedMotionVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable Page Transition wrapper.
 * Provides subtle fade and upward entrance animations when navigating
 * between dashboard views, automatically respecting prefers-reduced-motion.
 */
export function PageTransition({ children, className }: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion();
  const variants = shouldReduceMotion ? reducedMotionVariants.page : pageVariants;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      className={cn("w-full", className)}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;

