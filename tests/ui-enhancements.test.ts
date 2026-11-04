import { describe, it, expect } from "vitest";
import {
  pageVariants,
  containerVariants,
  itemVariants,
  cardVariants,
  sidebarVariants,
  submenuVariants,
  notFoundVariants,
  reducedMotionVariants,
  DASHBOARD_EASE,
} from "@/lib/animations";
import { LoaderSpinner, FullPageLoader, SectionLoader, ButtonSpinner, TableLoader } from "@/components/ui/loader-spinner";
import NotFoundPage from "@/app/not-found";
import { PageTransition } from "@/components/shared/PageTransition";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Sidebar } from "@/components/layout/Sidebar";

describe("CartX Dashboard UI Enhancements & Animations", () => {
  describe("1. Shared Animation Variants & Transitions", () => {
    it("should export dashboard easing matching design specifications", () => {
      expect(DASHBOARD_EASE).toEqual([0.25, 0.1, 0.25, 1.0]);
    });

    it("should provide page entrance variants with subtle displacement and fade", () => {
      expect(pageVariants.initial).toBeDefined();
      expect(pageVariants.animate).toBeDefined();
      expect(pageVariants.exit).toBeDefined();

      const initial = pageVariants.initial as { opacity: number; y: number };
      const animate = pageVariants.animate as { opacity: number; y: number };
      expect(initial.opacity).toBe(0);
      expect(initial.y).toBe(8);
      expect(animate.opacity).toBe(1);
      expect(animate.y).toBe(0);
    });

    it("should provide stagger container variants for dashboard cards and lists", () => {
      expect(containerVariants.hidden).toEqual({ opacity: 0 });
      const visible = containerVariants.visible as {
        opacity: number;
        transition: { staggerChildren: number; delayChildren: number };
      };
      expect(visible.opacity).toBe(1);
      expect(visible.transition.staggerChildren).toBe(0.06);
    });

    it("should configure card and item entrance variants", () => {
      expect(cardVariants.hidden).toBeDefined();
      expect(cardVariants.visible).toBeDefined();
      expect(itemVariants.hidden).toBeDefined();
      expect(itemVariants.visible).toBeDefined();
    });

    it("should configure sidebar width animations for collapse and expand", () => {
      expect(sidebarVariants.expanded).toEqual({
        width: 256,
        transition: expect.objectContaining({ duration: 0.26 }),
      });
      expect(sidebarVariants.collapsed).toEqual({
        width: 64,
        transition: expect.objectContaining({ duration: 0.26 }),
      });
    });

    it("should configure submenu accordion height and opacity transitions", () => {
      expect(submenuVariants.closed).toEqual({
        opacity: 0,
        height: 0,
        overflow: "hidden",
        transition: expect.objectContaining({ duration: 0.2 }),
      });
      expect(submenuVariants.open).toEqual({
        opacity: 1,
        height: "auto",
        overflow: "hidden",
        transition: expect.objectContaining({ duration: 0.24 }),
      });
    });

    it("should configure 404 page staggered entrance variants", () => {
      expect(notFoundVariants.container).toBeDefined();
      expect(notFoundVariants.number).toBeDefined();
      expect(notFoundVariants.heading).toBeDefined();
      expect(notFoundVariants.badge).toBeDefined();
      expect(notFoundVariants.actions).toBeDefined();
    });

    it("should provide accessible fallback variants for reduced-motion users", () => {
      expect(reducedMotionVariants.page).toBeDefined();
      expect(reducedMotionVariants.item).toBeDefined();
      expect(reducedMotionVariants.container).toBeDefined();
    });
  });

  describe("2. 21st.dev Spinner Component & Loading System", () => {
    it("should export LoaderSpinner, FullPageLoader, SectionLoader, ButtonSpinner, and TableLoader", () => {
      expect(LoaderSpinner).toBeDefined();
      expect(FullPageLoader).toBeDefined();
      expect(SectionLoader).toBeDefined();
      expect(ButtonSpinner).toBeDefined();
      expect(TableLoader).toBeDefined();
    });
  });

  describe("3. 404 Page Component Structure", () => {
    it("should export NotFoundPage default function", () => {
      expect(NotFoundPage).toBeDefined();
      expect(typeof NotFoundPage).toBe("function");
    });
  });

  describe("4. Dashboard Layout & PageTransition Structure", () => {
    it("should export PageTransition, DashboardLayout, and Sidebar components", () => {
      expect(PageTransition).toBeDefined();
      expect(DashboardLayout).toBeDefined();
      expect(Sidebar).toBeDefined();
    });
  });
});

