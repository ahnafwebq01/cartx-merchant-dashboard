import type {
  StoreTheme,
  ThemeCustomizationSettings,
  StoreDomain,
  StorePage,
  StorefrontActivity,
  StorefrontOverview,
  StorefrontStatus,
  PageFilterParams,
} from "../types";
import type { StorePageFormValues, CustomDomainFormValues } from "../schemas";
import {
  INITIAL_THEMES,
  INITIAL_DOMAINS,
  INITIAL_PAGES,
  INITIAL_ACTIVITIES,
  DEFAULT_DNS_INSTRUCTIONS,
} from "../constants";

export const STOREFRONT_STATUS_STORAGE_KEY = "cartx_demo_storefront_status_v1";
export const THEMES_STORAGE_KEY = "cartx_demo_themes_v1";
export const DOMAINS_STORAGE_KEY = "cartx_demo_domains_v1";
export const PAGES_STORAGE_KEY = "cartx_demo_pages_v1";
export const ACTIVITIES_STORAGE_KEY = "cartx_demo_storefront_activities_v1";

export class MockStorefrontService {
  private memoryStatus: StorefrontStatus = "active";
  private memoryThemes: StoreTheme[] = JSON.parse(JSON.stringify(INITIAL_THEMES));
  private memoryDomains: StoreDomain[] = JSON.parse(JSON.stringify(INITIAL_DOMAINS));
  private memoryPages: StorePage[] = JSON.parse(JSON.stringify(INITIAL_PAGES));
  private memoryActivities: StorefrontActivity[] = JSON.parse(
    JSON.stringify(INITIAL_ACTIVITIES)
  );

  private safeGetItem<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  }

  private safeSetItem<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`[MockStorefrontService] LocalStorage set error for key ${key}:`, e);
    }
  }

  // --- Persistence Accessors ---

  public loadStatus(): StorefrontStatus {
    return this.safeGetItem(STOREFRONT_STATUS_STORAGE_KEY, this.memoryStatus);
  }

  public saveStatus(status: StorefrontStatus): void {
    this.memoryStatus = status;
    this.safeSetItem(STOREFRONT_STATUS_STORAGE_KEY, status);
  }

  public loadThemes(): StoreTheme[] {
    return this.safeGetItem(THEMES_STORAGE_KEY, this.memoryThemes);
  }

  public saveThemes(themes: StoreTheme[]): void {
    this.memoryThemes = themes;
    this.safeSetItem(THEMES_STORAGE_KEY, themes);
  }

  public loadDomains(): StoreDomain[] {
    return this.safeGetItem(DOMAINS_STORAGE_KEY, this.memoryDomains);
  }

  public saveDomains(domains: StoreDomain[]): void {
    this.memoryDomains = domains;
    this.safeSetItem(DOMAINS_STORAGE_KEY, domains);
  }

  public loadPages(): StorePage[] {
    return this.safeGetItem(PAGES_STORAGE_KEY, this.memoryPages);
  }

  public savePages(pages: StorePage[]): void {
    this.memoryPages = pages;
    this.safeSetItem(PAGES_STORAGE_KEY, pages);
  }

  public loadActivities(): StorefrontActivity[] {
    return this.safeGetItem(ACTIVITIES_STORAGE_KEY, this.memoryActivities);
  }

  public saveActivities(activities: StorefrontActivity[]): void {
    this.memoryActivities = activities;
    this.safeSetItem(ACTIVITIES_STORAGE_KEY, activities);
  }

  public appendActivity(
    action: StorefrontActivity["action"],
    description: string,
    actor: string = "Store Admin"
  ): void {
    const list = this.loadActivities();
    const newActivity: StorefrontActivity = {
      id: `act-${Date.now()}`,
      action,
      description,
      actor,
      timestamp: new Date().toISOString(),
    };
    const updated = [newActivity, ...list].slice(0, 30);
    this.saveActivities(updated);
  }

  // --- Overview Query ---

  public getOverview(): StorefrontOverview {
    const status = this.loadStatus();
    const themes = this.loadThemes();
    const domains = this.loadDomains();
    const pages = this.loadPages();
    const activities = this.loadActivities();

    const activeTheme = themes.find((t) => t.isActive) || themes[0];
    const defaultDomain = domains.find((d) => d.isDefaultSubdomain);
    const customDomain = domains.find((d) => !d.isDefaultSubdomain);

    const publishedPages = pages.filter((p) => p.status === "published");
    const draftPages = pages.filter((p) => p.status === "draft");

    return {
      status,
      storeName: activeTheme.currentSettings.header.logoText || "Green Harvest Organic",
      defaultUrl: defaultDomain ? `https://${defaultDomain.domain}` : "https://green-harvest.cartx.com.bd",
      customDomain: customDomain ? customDomain.domain : undefined,
      activeTheme,
      totalThemes: themes.length,
      totalPublishedPages: publishedPages.length,
      totalDraftPages: draftPages.length,
      isCustomDomainConfigured: Boolean(customDomain),
      domainStatus: customDomain ? customDomain.status : "not_connected",
      sslStatus: customDomain ? customDomain.sslStatus : "demo_not_active",
      recentActivities: activities.slice(0, 5),
    };
  }

  public updateStatus(status: StorefrontStatus): StorefrontStatus {
    this.saveStatus(status);
    this.appendActivity(
      "status_changed",
      `Storefront status updated to '${status.toUpperCase()}'.`
    );
    return status;
  }

  // --- Themes Methods ---

  public getThemes(): StoreTheme[] {
    return this.loadThemes();
  }

  public getActiveTheme(): StoreTheme {
    const themes = this.loadThemes();
    return themes.find((t) => t.isActive) || themes[0];
  }

  public updateThemeCustomization(
    themeId: string,
    settings: ThemeCustomizationSettings
  ): StoreTheme {
    const themes = this.loadThemes();
    const index = themes.findIndex((t) => t.id === themeId);
    if (index === -1) {
      throw new Error(`Theme '${themeId}' not found`);
    }

    const updatedTheme: StoreTheme = {
      ...themes[index],
      currentSettings: settings,
      lastEditedAt: new Date().toISOString(),
    };

    themes[index] = updatedTheme;
    this.saveThemes(themes);
    this.appendActivity(
      "theme_updated",
      `Updated visual styling and section settings on ${updatedTheme.name}.`
    );

    return updatedTheme;
  }

  public activateTheme(themeId: string): StoreTheme {
    const themes = this.loadThemes();
    const target = themes.find((t) => t.id === themeId);
    if (!target) {
      throw new Error(`Theme '${themeId}' not found`);
    }

    const updated = themes.map((t) => ({
      ...t,
      isActive: t.id === themeId,
    }));

    this.saveThemes(updated);
    this.appendActivity(
      "theme_activated",
      `Switched active storefront theme to ${target.name}.`
    );

    return updated.find((t) => t.id === themeId)!;
  }

  public resetThemeCustomization(themeId: string): StoreTheme {
    const themes = this.loadThemes();
    const index = themes.findIndex((t) => t.id === themeId);
    if (index === -1) {
      throw new Error(`Theme '${themeId}' not found`);
    }

    const resetTheme: StoreTheme = {
      ...themes[index],
      currentSettings: JSON.parse(JSON.stringify(themes[index].defaultSettings)),
      lastEditedAt: new Date().toISOString(),
    };

    themes[index] = resetTheme;
    this.saveThemes(themes);
    this.appendActivity(
      "theme_updated",
      `Reset customizations on ${resetTheme.name} to default values.`
    );

    return resetTheme;
  }

  // --- Domains Methods ---

  public getDomains(): StoreDomain[] {
    return this.loadDomains();
  }

  public addCustomDomain(input: CustomDomainFormValues): StoreDomain {
    const cleanDomain = input.domain.trim().toLowerCase();
    const domains = this.loadDomains();

    const existing = domains.find((d) => d.domain === cleanDomain);
    if (existing) {
      throw new Error(`Domain '${cleanDomain}' is already configured`);
    }

    // Replace or add custom domain
    // In demo mode, clearly mark verification as pending and SSL as not active
    const newDomain: StoreDomain = {
      id: `dom-${Date.now()}`,
      domain: cleanDomain,
      isDefaultSubdomain: false,
      isPrimary: false,
      status: "demo_pending_verification",
      verificationMethod: "cname",
      targetValue: "cname.cartx.com.bd",
      sslStatus: "demo_not_active",
      dnsRecords: DEFAULT_DNS_INSTRUCTIONS,
      lastCheckedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    // Filter out previous custom domains (allowing 1 custom domain in demo mode)
    const updated = [...domains.filter((d) => d.isDefaultSubdomain), newDomain];
    this.saveDomains(updated);

    this.appendActivity(
      "domain_added",
      `Added custom domain ${cleanDomain} (Demo Mode — Verification Pending).`
    );

    return newDomain;
  }

  public removeDomain(domainId: string): void {
    const domains = this.loadDomains();
    const target = domains.find((d) => d.id === domainId);
    if (!target) {
      throw new Error(`Domain '${domainId}' not found`);
    }
    if (target.isDefaultSubdomain) {
      throw new Error("Default CartX platform subdomain cannot be removed.");
    }

    const updated = domains.filter((d) => d.id !== domainId);
    this.saveDomains(updated);

    this.appendActivity(
      "domain_removed",
      `Removed custom domain ${target.domain}.`
    );
  }

  public checkDomainVerification(domainId: string): {
    domainId: string;
    status: StoreDomain["status"];
    sslStatus: StoreDomain["sslStatus"];
    message: string;
    isBackendConnected: false;
  } {
    const domains = this.loadDomains();
    const target = domains.find((d) => d.id === domainId);
    if (!target) {
      throw new Error(`Domain '${domainId}' not found`);
    }

    // Update timestamp
    target.lastCheckedAt = new Date().toISOString();
    this.saveDomains(domains);

    // Truthful response: DNS verification requires shared Express backend
    return {
      domainId,
      status: target.status,
      sslStatus: target.sslStatus,
      message:
        "Demo Mode: Verification requires live authoritative DNS lookup via the CartX shared Express backend API. Status remains unverified in client demo.",
      isBackendConnected: false,
    };
  }

  // --- CMS Pages Methods ---

  public getPages(params: PageFilterParams = {}): StorePage[] {
    let pages = this.loadPages();

    if (params.search) {
      const q = params.search.toLowerCase().trim();
      pages = pages.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          (p.titleBn && p.titleBn.toLowerCase().includes(q))
      );
    }

    if (params.status && params.status !== "all") {
      pages = pages.filter((p) => p.status === params.status);
    }

    if (params.type && params.type !== "all") {
      pages = pages.filter((p) => p.pageType === params.type);
    }

    return pages;
  }

  public getPageById(id: string): StorePage | undefined {
    const pages = this.loadPages();
    return pages.find((p) => p.id === id);
  }

  public getPageBySlug(slug: string): StorePage | undefined {
    const pages = this.loadPages();
    return pages.find((p) => p.slug === slug);
  }

  public createPage(input: StorePageFormValues): StorePage {
    const pages = this.loadPages();
    const cleanSlug = input.slug.trim().toLowerCase();

    const existing = pages.find((p) => p.slug === cleanSlug);
    if (existing) {
      throw new Error(`A page with slug '/${cleanSlug}' already exists.`);
    }

    const now = new Date().toISOString();
    const newPage: StorePage = {
      id: `page-${Date.now()}`,
      title: input.title,
      titleBn: input.titleBn || undefined,
      slug: cleanSlug,
      content: input.content,
      contentBn: input.contentBn || undefined,
      pageType: input.pageType,
      policyType: input.policyType,
      status: input.status,
      metaTitle: input.metaTitle || undefined,
      metaDescription: input.metaDescription || undefined,
      viewsCount: 0,
      publishedAt: input.status === "published" ? now : undefined,
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newPage, ...pages];
    this.savePages(updated);

    this.appendActivity(
      "page_created",
      `Created new ${input.pageType === "legal_policy" ? "legal policy" : "CMS page"} '${input.title}'.`
    );

    return newPage;
  }

  public updatePage(id: string, input: Partial<StorePageFormValues>): StorePage {
    const pages = this.loadPages();
    const index = pages.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Page '${id}' not found`);
    }

    const current = pages[index];
    if (input.slug && input.slug !== current.slug) {
      const cleanSlug = input.slug.trim().toLowerCase();
      const duplicate = pages.find((p) => p.slug === cleanSlug && p.id !== id);
      if (duplicate) {
        throw new Error(`A page with slug '/${cleanSlug}' already exists.`);
      }
    }

    const now = new Date().toISOString();
    const updatedPage: StorePage = {
      ...current,
      ...input,
      updatedAt: now,
      publishedAt:
        input.status === "published" && current.status !== "published"
          ? now
          : current.publishedAt,
    };

    pages[index] = updatedPage;
    this.savePages(pages);

    this.appendActivity(
      input.status === "published" && current.status !== "published"
        ? "page_published"
        : "page_updated",
      `Updated page '${updatedPage.title}' (${updatedPage.status}).`
    );

    return updatedPage;
  }

  public deletePage(id: string): void {
    const pages = this.loadPages();
    const target = pages.find((p) => p.id === id);
    if (!target) {
      throw new Error(`Page '${id}' not found`);
    }

    const updated = pages.filter((p) => p.id !== id);
    this.savePages(updated);

    this.appendActivity("page_deleted", `Deleted page '${target.title}'.`);
  }

  // --- Reset Demo Data ---

  public resetDemoData(): void {
    this.memoryStatus = "active";
    this.memoryThemes = JSON.parse(JSON.stringify(INITIAL_THEMES));
    this.memoryDomains = JSON.parse(JSON.stringify(INITIAL_DOMAINS));
    this.memoryPages = JSON.parse(JSON.stringify(INITIAL_PAGES));
    this.memoryActivities = JSON.parse(JSON.stringify(INITIAL_ACTIVITIES));

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STOREFRONT_STATUS_STORAGE_KEY);
      window.localStorage.removeItem(THEMES_STORAGE_KEY);
      window.localStorage.removeItem(DOMAINS_STORAGE_KEY);
      window.localStorage.removeItem(PAGES_STORAGE_KEY);
      window.localStorage.removeItem(ACTIVITIES_STORAGE_KEY);
    }
  }
}

export const mockStorefrontService = new MockStorefrontService();

