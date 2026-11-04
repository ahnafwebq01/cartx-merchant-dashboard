import type { Variants } from "motion/react";

/**
 * Standard cubic-bezier easing for smooth dashboard interactions.
 * Balanced between snappy responsiveness and fluid transitions.
 */
export const DASHBOARD_EASE = [0.25, 0.1, 0.25, 1.0] as const;
export const BOUNCE_SUBTLE_EASE = [0.34, 1.3, 0.64, 1.0] as const;

export const TRANSITIONS = {
  instant: { duration: 0.01 },
  fast: { duration: 0.18, ease: DASHBOARD_EASE },
  normal: { duration: 0.28, ease: DASHBOARD_EASE },
  slow: { duration: 0.45, ease: DASHBOARD_EASE },
  springSnappy: { type: "spring", stiffness: 400, damping: 30 },
  springGentle: { type: "spring", stiffness: 300, damping: 25 },
} as const;

/**
 * Page level entrance transitions.
 * Subtle vertical motion (6-8px) and opacity fade.
 */
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: DASHBOARD_EASE,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: {
      duration: 0.15,
      ease: DASHBOARD_EASE,
    },
  },
};

/**
 * Container variant that staggers child elements (cards, list rows, grid items).
 */
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
};

/**
 * Item variant used inside containerVariants.
 */
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: DASHBOARD_EASE,
    },
  },
};

/**
 * Statistics & Overview Cards Entrance.
 */
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.32,
      ease: DASHBOARD_EASE,
    },
  },
};

/**
 * Sidebar container and item animations.
 */
export const sidebarVariants: Variants = {
  expanded: {
    width: 256,
    transition: {
      duration: 0.26,
      ease: DASHBOARD_EASE,
    },
  },
  collapsed: {
    width: 64,
    transition: {
      duration: 0.26,
      ease: DASHBOARD_EASE,
    },
  },
};

/**
 * Accordion / Submenu collapse & expand animation.
 * Smoothly opens and closes height without causing layout jumps.
 */
export const submenuVariants: Variants = {
  closed: {
    opacity: 0,
    height: 0,
    overflow: "hidden",
    transition: {
      duration: 0.2,
      ease: DASHBOARD_EASE,
    },
  },
  open: {
    opacity: 1,
    height: "auto",
    overflow: "hidden",
    transition: {
      duration: 0.24,
      ease: DASHBOARD_EASE,
    },
  },
};

/**
 * Sidebar label fade/slide animation when collapsing or expanding.
 */
export const sidebarLabelVariants: Variants = {
  hidden: {
    opacity: 0,
    width: 0,
    transition: { duration: 0.15 },
  },
  visible: {
    opacity: 1,
    width: "auto",
    transition: { duration: 0.22, delay: 0.05 },
  },
};

/**
 * Micro hover & tap interaction helpers.
 */
export const microInteractions = {
  subtleHover: { x: 2, transition: { duration: 0.15 } },
  subtleLift: { y: -2, transition: { duration: 0.2 } },
  tapScale: { scale: 0.98, transition: { duration: 0.1 } },
  tapButton: { scale: 0.96, transition: { duration: 0.08 } },
};

/**
 * Custom 404 animation variants.
 */
export const notFoundVariants: {
  container: Variants;
  badge: Variants;
  number: Variants;
  heading: Variants;
  body: Variants;
  actions: Variants;
} = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  },
  badge: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.35, ease: DASHBOARD_EASE },
    },
  },
  number: {
    hidden: { opacity: 0, scale: 0.85, y: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.45, ease: DASHBOARD_EASE },
    },
  },
  heading: {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: DASHBOARD_EASE },
    },
  },
  body: {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: DASHBOARD_EASE },
    },
  },
  actions: {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: DASHBOARD_EASE },
    },
  },
};

/**
 * Fallback static variants for users who prefer reduced motion.
 */
export const reducedMotionVariants: Record<string, Variants> = {
  page: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.05 } },
    exit: { opacity: 0, transition: { duration: 0.05 } },
  },
  item: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.05 } },
  },
  container: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.05 } },
  },
};

