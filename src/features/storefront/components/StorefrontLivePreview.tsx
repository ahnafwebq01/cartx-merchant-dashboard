"use client";

import React from "react";
import type { ThemeCustomizationSettings, ViewportMode } from "../types";
import { cn } from "@/lib/utils";
import {
  Search,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RotateCcw,
  CreditCard,
  Headphones,
  Sparkles,
} from "lucide-react";

interface StorefrontLivePreviewProps {
  settings: ThemeCustomizationSettings;
  viewport: ViewportMode;
  className?: string;
}

const SAMPLE_PRODUCTS = [
  {
    id: "p1",
    name: "Sundarban Wildflower Raw Honey (খাঁটি সুন্দরবনের মধু)",
    price: 850,
    originalPrice: 950,
    category: "Organic Grocery",
    imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "p2",
    name: "Cold-Pressed Kachi Ghani Mustard Oil (ঘানি ভাঙা সরিষার তেল)",
    price: 360,
    originalPrice: 420,
    category: "Edible Oils",
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "p3",
    name: "Dinajpur Premium Kataribhog Rice (দিনাজপুরের কাটারিভোগ চাল)",
    price: 110,
    originalPrice: 125,
    category: "Staples & Grains",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "p4",
    name: "Pure Natural Ghee - Pabna Milk Source (পাবনার খাঁটি ঘি)",
    price: 1450,
    originalPrice: 1600,
    category: "Dairy & Ghee",
    imageUrl: "https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&q=80&w=400",
  },
];

const SAMPLE_CATEGORIES = [
  { name: "Organic Honey", nameBn: "খাঁটি মধু", count: "12 items" },
  { name: "Edible Oils", nameBn: "ভোজ্য তেল", count: "8 items" },
  { name: "Spices & Herbs", nameBn: "মসলা ও উপাদান", count: "24 items" },
  { name: "Grains & Rice", nameBn: "চাল ও ডাল", count: "16 items" },
];

export function StorefrontLivePreview({
  settings,
  viewport,
  className,
}: StorefrontLivePreviewProps) {
  const { colors, typography, header, hero, categories, products, promo, trustBadges, footer } =
    settings;

  const fontClass =
    typography.headingFont === "Noto Sans Bengali" || typography.headingFont === "Hind Siliguri"
      ? "font-bengali"
      : "font-sans";

  const renderBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case "truck":
        return <Truck className="h-5 w-5 text-current shrink-0" />;
      case "shield-check":
        return <ShieldCheck className="h-5 w-5 text-current shrink-0" />;
      case "rotate-ccw":
        return <RotateCcw className="h-5 w-5 text-current shrink-0" />;
      case "headphones":
        return <Headphones className="h-5 w-5 text-current shrink-0" />;
      case "credit-card":
      default:
        return <CreditCard className="h-5 w-5 text-current shrink-0" />;
    }
  };

  return (
    <div className={cn("w-full flex justify-center py-4 px-2 sm:px-4", className)}>
      <div
        className={cn(
          "transition-all duration-300 shadow-2xl rounded-xl border border-border/80 overflow-hidden bg-background text-foreground flex flex-col",
          viewport === "desktop" && "w-full max-w-[1080px]",
          viewport === "tablet" && "w-[768px]",
          viewport === "mobile" && "w-[375px]"
        )}
        style={{
          backgroundColor: colors.background,
          color: colors.text,
          fontFamily: typography.bodyFont === "Noto Sans Bengali" ? "var(--font-noto-bengali)" : "inherit",
        }}
      >
        {/* Browser Top Chrome Simulation */}
        <div className="bg-slate-900 px-3 py-2 flex items-center justify-between text-xs text-slate-300 border-b border-slate-800 select-none">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="bg-slate-800/80 px-3 py-0.5 rounded text-[11px] font-mono text-slate-300 truncate max-w-[280px] flex items-center gap-1.5">
            <span className="text-emerald-400">🔒</span>
            <span>green-harvest.cartx.com.bd</span>
          </div>
          <div className="text-[10px] uppercase font-semibold text-slate-400">
            {viewport}
          </div>
        </div>

        {/* 1. Announcement Bar */}
        {header.announcementEnabled && header.announcementText && (
          <div
            className="px-3 py-1.5 text-center text-xs font-medium text-white transition-colors"
            style={{ backgroundColor: header.announcementBg || colors.primary }}
          >
            <p className="truncate">{header.announcementText}</p>
          </div>
        )}

        {/* 2. Store Header / Navigation */}
        <header
          className={cn(
            "px-4 py-3 border-b flex items-center justify-between transition-colors",
            header.sticky ? "sticky top-0 z-20 backdrop-blur-sm" : ""
          )}
          style={{
            backgroundColor: colors.headerBg || colors.background,
            borderColor: `${colors.text}15`,
          }}
        >
          <div className="flex items-center gap-2">
            {header.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={header.logoUrl}
                alt={header.logoText}
                className="h-8 max-w-[120px] object-contain"
              />
            ) : (
              <span
                className={cn("font-bold text-base tracking-tight truncate", fontClass)}
                style={{ color: colors.primary }}
              >
                {header.logoText || "Green Harvest Organic"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            {header.showSearch && (
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-muted/60 text-muted-foreground">
                <Search className="h-3.5 w-3.5" />
                <span className="hidden sm:inline text-[11px]">পণ্য খুঁজুন...</span>
              </div>
            )}
            {header.showCart && (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded font-medium text-white text-[11px] shadow-sm"
                style={{ backgroundColor: colors.primary }}
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>কার্ট (২)</span>
              </div>
            )}
          </div>
        </header>

        {/* 3. Hero Section */}
        {hero.enabled && (
          <div
            className={cn(
              "p-4 sm:p-8 transition-all border-b",
              hero.bannerStyle === "centered" ? "text-center" : "text-left"
            )}
            style={{
              backgroundColor: `${colors.primary}08`,
              borderColor: `${colors.text}15`,
            }}
          >
            <div
              className={cn(
                "grid gap-6 items-center",
                hero.bannerStyle === "split" && viewport !== "mobile" ? "grid-cols-2" : "grid-cols-1"
              )}
            >
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <Sparkles className="h-3 w-3" />
                  <span>শতভাগ অর্গানিক ও ফ্রেশ</span>
                </div>
                <h1
                  className={cn(
                    "font-extrabold tracking-tight leading-tight",
                    viewport === "mobile" ? "text-xl" : "text-2xl sm:text-3xl",
                    fontClass
                  )}
                  style={{ color: colors.text }}
                >
                  {hero.headlineBn || hero.headline}
                </h1>
                <p
                  className={cn(
                    "text-muted-foreground leading-relaxed",
                    viewport === "mobile" ? "text-xs" : "text-sm"
                  )}
                >
                  {hero.subheadingBn || hero.subheading}
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg font-semibold text-white text-xs sm:text-sm shadow transition-opacity hover:opacity-95"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {hero.buttonText}
                  </button>
                </div>
              </div>

              {hero.imageUrl && (
                <div className="relative rounded-lg overflow-hidden border border-border shadow-sm max-h-[220px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={hero.imageUrl}
                    alt={hero.headline}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. Trust Badges */}
        {trustBadges.enabled && trustBadges.items.length > 0 && (
          <div
            className="px-4 py-3 border-b grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/20"
            style={{ borderColor: `${colors.text}10` }}
          >
            {trustBadges.items.slice(0, 4).map((tb) => (
              <div key={tb.id} className="flex items-center gap-2 p-1.5">
                <div
                  className="p-1.5 rounded-md shrink-0"
                  style={{
                    backgroundColor: `${colors.primary}15`,
                    color: colors.primary,
                  }}
                >
                  {renderBadgeIcon(tb.icon)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-[11px] font-semibold truncate leading-tight">
                    {tb.titleBn || tb.title}
                  </h4>
                  <p className="text-[9px] text-muted-foreground truncate">
                    {tb.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. Featured Categories */}
        {categories.enabled && (
          <div className="p-4 sm:p-6 border-b" style={{ borderColor: `${colors.text}10` }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={cn("font-bold text-sm sm:text-base", fontClass)}>
                {categories.titleBn || categories.title}
              </h3>
              <span className="text-[11px] font-medium text-primary hover:underline cursor-pointer">
                সবগুলো দেখুন →
              </span>
            </div>
            <div
              className={cn(
                "grid gap-2.5",
                viewport === "mobile" ? "grid-cols-2" : "grid-cols-4"
              )}
            >
              {SAMPLE_CATEGORIES.map((cat, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-border/70 hover:border-primary/50 transition-colors bg-card flex flex-col justify-between"
                >
                  <span className="text-xs font-semibold">{cat.nameBn || cat.name}</span>
                  <span className="text-[10px] text-muted-foreground mt-1">
                    {cat.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Featured Products */}
        {products.enabled && (
          <div className="p-4 sm:p-6 border-b" style={{ borderColor: `${colors.text}10` }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={cn("font-bold text-sm sm:text-base", fontClass)}>
                {products.titleBn || products.title}
              </h3>
              <span className="text-[11px] font-medium text-primary hover:underline cursor-pointer">
                সবগুলো পণ্য →
              </span>
            </div>
            <div
              className={cn(
                "grid gap-3",
                viewport === "mobile" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-4"
              )}
            >
              {SAMPLE_PRODUCTS.slice(0, products.productCount || 4).map((p) => (
                <div
                  key={p.id}
                  className="rounded-lg border border-border/80 overflow-hidden bg-card flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-4/3 bg-muted overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1.5 left-1.5 text-[9px] px-1.5 py-0.5 rounded font-bold bg-amber-500 text-white shadow-xs">
                      খাঁটি পণ্য
                    </span>
                  </div>
                  <div className="p-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-muted-foreground block truncate">
                        {p.category}
                      </span>
                      <h4 className="text-xs font-medium line-clamp-2 mt-0.5 leading-snug">
                        {p.name}
                      </h4>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs font-bold text-foreground">
                          ৳{p.price.toLocaleString("en-BD")}
                        </span>
                        <span className="text-[10px] line-through text-muted-foreground">
                          ৳{p.originalPrice.toLocaleString("en-BD")}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="px-2 py-1 rounded text-[10px] font-semibold text-white shadow-xs"
                        style={{ backgroundColor: colors.primary }}
                      >
                        + কার্ট
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Promotional Banner */}
        {promo.enabled && promo.headline && (
          <div
            className="p-4 sm:p-5 text-center text-white"
            style={{ backgroundColor: colors.accent || colors.primary }}
          >
            <h4 className="font-bold text-xs sm:text-sm">{promo.headline}</h4>
            <div className="flex items-center justify-center gap-2 mt-1.5">
              <span className="px-2.5 py-0.5 rounded font-mono text-xs font-bold bg-black/30 border border-white/20">
                কুপন: {promo.couponCode || "EID2026"}
              </span>
              <span className="text-[11px] text-white/90">{promo.discountText}</span>
            </div>
          </div>
        )}

        {/* 8. Storefront Footer */}
        <footer
          className="p-4 sm:p-6 text-xs transition-colors"
          style={{
            backgroundColor: colors.footerBg,
            color: "#94A3B8",
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-slate-800">
            <div>
              <h5 className="font-semibold text-white mb-1.5 text-xs">
                {header.logoText}
              </h5>
              <p className="text-[11px] leading-relaxed text-slate-400">
                বাংলাদেশের সব প্রান্তে খাঁটি ও প্রাকৃতিক পণ্যের বিশ্বস্ত প্রতিষ্ঠান।
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-white mb-1.5 text-xs">প্রয়োজনীয় পেইজ</h5>
              <ul className="space-y-1 text-[11px] text-slate-400">
                <li>গোপনীয়তা নীতি (Privacy Policy)</li>
                <li>ব্যবহারের শর্তাবলী (Terms & Conditions)</li>
                <li>৭ দিনের রিটার্ন নীতি (Refund Policy)</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-white mb-1.5 text-xs">নিরাপদ পেমেন্ট</h5>
              {footer.showPaymentMethods && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["bKash", "Nagad", "Cash on Delivery", "Cards"].map((pm, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-medium"
                    >
                      {pm}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 gap-2">
            <span>{footer.copyrightText}</span>
            <span>CartX Multi-Tenant SaaS Demo</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
