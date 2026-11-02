import { describe, it, expect, beforeEach } from "vitest";
import {
  customDomainSchema,
  storePageSchema,
  themeCustomizationSchema,
  themeColorsSchema,
} from "@/features/storefront/schemas";
import { MockStorefrontService } from "@/features/storefront/services/mockStorefront";
import {
  DEFAULT_THEME_SETTINGS,
  LEGAL_TEMPLATES,
} from "@/features/storefront/constants";

describe("Phase 6: Storefront & Domain Management Test Suite", () => {
  let service: MockStorefrontService;

  beforeEach(() => {
    service = new MockStorefrontService();
  });

  describe("1. Zod Validation Schemas", () => {
    describe("customDomainSchema", () => {
      it("should accept valid FQDN domains", () => {
        const validDomains = [
          "shop.greenharvest.com.bd",
          "greenharvest.com",
          "my-store.com.bd",
          "store.bd",
          "shop123.organic.org",
        ];

        validDomains.forEach((domain) => {
          const result = customDomainSchema.safeParse({ domain });
          expect(result.success, `Expected domain '${domain}' to be valid`).toBe(true);
        });
      });

      it("should reject domains containing protocols (http:// or https://)", () => {
        const result1 = customDomainSchema.safeParse({ domain: "https://shop.mybrand.com" });
        expect(result1.success).toBe(false);
        if (!result1.success) {
          expect(result1.error.issues[0].message).toContain("Do not include http:// or https://");
        }

        const result2 = customDomainSchema.safeParse({ domain: "http://shop.mybrand.com" });
        expect(result2.success).toBe(false);
      });

      it("should reject domains containing paths or slashes", () => {
        const result = customDomainSchema.safeParse({ domain: "shop.mybrand.com/store" });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain("cannot include paths or slashes");
        }
      });

      it("should reject domains containing spaces or invalid characters", () => {
        const invalidDomains = [
          "shop brand.com",
          "shop_brand.com",
          "@shop.com",
          "shop..com",
          "abc",
        ];

        invalidDomains.forEach((domain) => {
          const result = customDomainSchema.safeParse({ domain });
          expect(result.success).toBe(false);
        });
      });

      it("should reject adding default CartX platform domains as custom domains", () => {
        const result = customDomainSchema.safeParse({ domain: "my-shop.cartx.com.bd" });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain("Cannot add default CartX platform domains");
        }
      });
    });

    describe("themeColorsSchema & themeCustomizationSchema", () => {
      it("should validate complete theme customization settings", () => {
        const result = themeCustomizationSchema.safeParse(DEFAULT_THEME_SETTINGS);
        expect(result.success).toBe(true);
      });

      it("should reject invalid hex colors", () => {
        const invalidColors = {
          primary: "blue",
          secondary: "#1E40AF",
          accent: "#F59E0B",
          background: "#FFFFFF",
          text: "#0F172A",
          headerBg: "#FFFFFF",
          footerBg: "#0F172A",
        };

        const result = themeColorsSchema.safeParse(invalidColors);
        expect(result.success).toBe(false);
      });

      it("should accept valid 3-digit and 6-digit hex colors", () => {
        const validColors = {
          primary: "#2563EB",
          secondary: "#FFF",
          accent: "#000000",
          background: "#fafafa",
          text: "#123",
          headerBg: "#FFFFFF",
          footerBg: "#0F172A",
        };

        const result = themeColorsSchema.safeParse(validColors);
        expect(result.success).toBe(true);
      });
    });

    describe("storePageSchema", () => {
      it("should accept valid store page inputs", () => {
        const validPage = {
          title: "About Our Farm",
          titleBn: "আমাদের খামার পরিচিতি",
          slug: "about-our-farm",
          content: "We are an organic produce cooperative operating in Dinajpur since 2024.",
          pageType: "standard_cms" as const,
          status: "published" as const,
          metaTitle: "About Us",
          metaDescription: "Learn about our farm.",
        };

        const result = storePageSchema.safeParse(validPage);
        expect(result.success).toBe(true);
      });

      it("should reject invalid slug formats", () => {
        const invalidSlugs = [
          "About Farm",
          "about_farm",
          "-leading-dash",
          "trailing-dash-",
          "about/farm",
          "about@farm",
        ];

        invalidSlugs.forEach((slug) => {
          const result = storePageSchema.safeParse({
            title: "Test Page",
            slug,
            content: "Long enough test content for validation.",
            pageType: "standard_cms",
            status: "published",
          });
          expect(result.success, `Expected slug '${slug}' to be rejected`).toBe(false);
        });
      });

      it("should enforce minimum content length of 10 characters", () => {
        const result = storePageSchema.safeParse({
          title: "Short Page",
          slug: "short-page",
          content: "Too short",
          pageType: "standard_cms",
          status: "draft",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain("at least 10 characters long");
        }
      });
    });
  });

  describe("2. MockStorefrontService Operations & Demo Invariants", () => {
    describe("Overview & Statistics", () => {
      it("should return complete overview data with correct initial counts", () => {
        const overview = service.getOverview();

        expect(overview.status).toBe("active");
        expect(overview.defaultUrl).toContain("cartx.com.bd");
        expect(overview.totalThemes).toBe(4);
        expect(overview.activeTheme.id).toBe("modern_clean");
        expect(overview.totalPublishedPages).toBeGreaterThanOrEqual(4);
        expect(overview.recentActivities.length).toBeGreaterThan(0);
      });

      it("should allow changing storefront operational status", () => {
        service.updateStatus("maintenance");
        expect(service.loadStatus()).toBe("maintenance");

        const overview = service.getOverview();
        expect(overview.status).toBe("maintenance");

        const activities = service.loadActivities();
        expect(activities[0].action).toBe("status_changed");
        expect(activities[0].description).toContain("MAINTENANCE");
      });
    });

    describe("Theme Management", () => {
      it("should return the list of 4 themes with only one active theme", () => {
        const themes = service.getThemes();
        expect(themes.length).toBe(4);

        const activeThemes = themes.filter((t) => t.isActive);
        expect(activeThemes.length).toBe(1);
        expect(activeThemes[0].id).toBe("modern_clean");
      });

      it("should activate a selected theme and deactivate others", () => {
        const activated = service.activateTheme("minimal_boutique");
        expect(activated.id).toBe("minimal_boutique");
        expect(activated.isActive).toBe(true);

        const currentActive = service.getActiveTheme();
        expect(currentActive.id).toBe("minimal_boutique");

        const previousActive = service.getThemes().find((t) => t.id === "modern_clean");
        expect(previousActive?.isActive).toBe(false);
      });

      it("should throw an error when activating non-existent theme", () => {
        expect(() => service.activateTheme("unknown_theme_99")).toThrow(
          "Theme 'unknown_theme_99' not found"
        );
      });

      it("should update theme customization settings and record activity", () => {
        const active = service.getActiveTheme();
        const newSettings = {
          ...active.currentSettings,
          colors: {
            ...active.currentSettings.colors,
            primary: "#10B981",
          },
        };

        const updated = service.updateThemeCustomization(active.id, newSettings);
        expect(updated.currentSettings.colors.primary).toBe("#10B981");

        const activities = service.loadActivities();
        expect(activities[0].action).toBe("theme_updated");
      });

      it("should reset theme customization to default settings", () => {
        const active = service.getActiveTheme();
        const modifiedSettings = {
          ...active.currentSettings,
          colors: {
            ...active.currentSettings.colors,
            primary: "#FF0000",
          },
        };
        service.updateThemeCustomization(active.id, modifiedSettings);

        const resetTheme = service.resetThemeCustomization(active.id);
        expect(resetTheme.currentSettings.colors.primary).toBe(
          resetTheme.defaultSettings.colors.primary
        );
      });
    });

    describe("Domain Management & Truthful Status Boundaries", () => {
      it("should list initial domains including default subdomain and custom domain", () => {
        const domains = service.getDomains();
        expect(domains.length).toBe(2);

        const defaultDomain = domains.find((d) => d.isDefaultSubdomain);
        expect(defaultDomain).toBeDefined();
        expect(defaultDomain?.status).toBe("active");
        expect(defaultDomain?.sslStatus).toBe("active");
      });

      it("should add a new custom domain with truthful demo verification status", () => {
        const newDomain = service.addCustomDomain({ domain: "shop.myorganicbd.com" });

        expect(newDomain.domain).toBe("shop.myorganicbd.com");
        expect(newDomain.isDefaultSubdomain).toBe(false);
        // INVARIANT: Never claimed verified or active SSL in demo mode!
        expect(newDomain.status).toBe("demo_pending_verification");
        expect(newDomain.sslStatus).toBe("demo_not_active");

        const domains = service.getDomains();
        expect(domains.find((d) => d.domain === "shop.myorganicbd.com")).toBeDefined();
      });

      it("should prevent duplicate domain configuration", () => {
        expect(() =>
          service.addCustomDomain({ domain: "green-harvest.cartx.com.bd" })
        ).toThrow("is already configured");
      });

      it("should prevent removal of the default CartX platform subdomain", () => {
        const domains = service.getDomains();
        const defaultDom = domains.find((d) => d.isDefaultSubdomain)!;

        expect(() => service.removeDomain(defaultDom.id)).toThrow(
          "Default CartX platform subdomain cannot be removed"
        );
      });

      it("should remove custom domain successfully", () => {
        const customDom = service.getDomains().find((d) => !d.isDefaultSubdomain)!;
        service.removeDomain(customDom.id);

        const domainsAfter = service.getDomains();
        expect(domainsAfter.find((d) => d.id === customDom.id)).toBeUndefined();
      });

      it("should truthfully report verification status as demo and not claim false connection", () => {
        const customDom = service.getDomains().find((d) => !d.isDefaultSubdomain)!;
        const checkResult = service.checkDomainVerification(customDom.id);

        expect(checkResult.isBackendConnected).toBe(false);
        expect(checkResult.status).toBe("demo_pending_verification");
        expect(checkResult.sslStatus).toBe("demo_not_active");
        expect(checkResult.message).toContain("shared Express backend API");
      });
    });

    describe("CMS Pages Management", () => {
      it("should list all initial store pages", () => {
        const pages = service.getPages();
        expect(pages.length).toBe(6);

        const legalPolicies = pages.filter((p) => p.pageType === "legal_policy");
        expect(legalPolicies.length).toBe(4);
      });

      it("should filter pages by status and search keyword", () => {
        const publishedPages = service.getPages({ status: "published" });
        expect(publishedPages.every((p) => p.status === "published")).toBe(true);

        const draftPages = service.getPages({ status: "draft" });
        expect(draftPages.every((p) => p.status === "draft")).toBe(true);

        const searchResults = service.getPages({ search: "privacy" });
        expect(searchResults.length).toBe(1);
        expect(searchResults[0].slug).toBe("privacy-policy");
      });

      it("should create a new CMS page and retrieve it by ID and slug", () => {
        const newPage = service.createPage({
          title: "Customer FAQs",
          titleBn: "সাধারণ প্রশ্নোত্তর",
          slug: "customer-faqs",
          content: "Here are frequently asked questions regarding order delivery in Bangladesh.",
          pageType: "standard_cms",
          status: "published",
        });

        expect(newPage.id).toBeTruthy();
        expect(newPage.slug).toBe("customer-faqs");

        const retrievedById = service.getPageById(newPage.id);
        expect(retrievedById).toBeDefined();
        expect(retrievedById?.title).toBe("Customer FAQs");

        const retrievedBySlug = service.getPageBySlug("customer-faqs");
        expect(retrievedBySlug).toBeDefined();
        expect(retrievedBySlug?.title).toBe("Customer FAQs");
      });

      it("should prevent duplicate slugs when creating a page", () => {
        expect(() =>
          service.createPage({
            title: "Duplicate Privacy Policy",
            slug: "privacy-policy",
            content: "Duplicate content text for testing error handling.",
            pageType: "standard_cms",
            status: "draft",
          })
        ).toThrow("already exists");
      });

      it("should update page details and publication status", () => {
        const draftPage = service.getPages({ status: "draft" })[0];
        const updated = service.updatePage(draftPage.id, {
          title: "Updated Harvest Calendar",
          status: "published",
        });

        expect(updated.title).toBe("Updated Harvest Calendar");
        expect(updated.status).toBe("published");
        expect(updated.publishedAt).toBeDefined();
      });

      it("should delete a page successfully", () => {
        const pageToDelete = service.createPage({
          title: "Temporary Page",
          slug: "temp-page-to-delete",
          content: "This content is meant for deletion testing.",
          pageType: "standard_cms",
          status: "draft",
        });

        service.deletePage(pageToDelete.id);
        expect(service.getPageById(pageToDelete.id)).toBeUndefined();
      });
    });

    describe("Reset Demo Data", () => {
      it("should restore all baseline presets when resetDemoData is called", () => {
        service.updateStatus("offline");
        service.activateTheme("bold_express");

        service.resetDemoData();

        expect(service.loadStatus()).toBe("active");
        expect(service.getActiveTheme().id).toBe("modern_clean");
      });
    });
  });

  describe("3. Legal Templates & Consumer Protection Disclaimers", () => {
    it("should include all 4 mandatory Bangladesh e-commerce legal policies", () => {
      expect(LEGAL_TEMPLATES.privacy).toBeDefined();
      expect(LEGAL_TEMPLATES.terms).toBeDefined();
      expect(LEGAL_TEMPLATES.refund).toBeDefined();
      expect(LEGAL_TEMPLATES.shipping).toBeDefined();
    });

    it("should include mandatory Legal Disclaimer Notice in all legal templates", () => {
      Object.entries(LEGAL_TEMPLATES).forEach(([key, template]) => {
        expect(
          template.content.includes("আইনি বিজ্ঞপ্তি") ||
            template.content.includes("Legal Disclaimer"),
          `Template '${key}' must contain the legal draft disclaimer`
        ).toBe(true);
      });
    });

    it("should address Bangladesh local currency (BDT ৳) and payment methods", () => {
      expect(LEGAL_TEMPLATES.terms.content).toContain("BDT ৳");
      expect(LEGAL_TEMPLATES.refund.content).toContain("bKash");
      expect(LEGAL_TEMPLATES.refund.content).toContain("Nagad");
      expect(LEGAL_TEMPLATES.shipping.content).toContain("৳60");
      expect(LEGAL_TEMPLATES.shipping.content).toContain("৳120");
    });
  });
});
