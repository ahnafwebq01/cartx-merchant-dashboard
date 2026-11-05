"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useSyncExternalStore } from "react";

export type AccentColor = "blue" | "emerald" | "violet" | "amber" | "rose";
export type SidebarStyle = "glass" | "solid";
export type BorderRadius = "sharp" | "modern" | "smooth" | "rounded";
export type DensityMode = "comfortable" | "compact";

export interface AppearanceSettings {
  accentColor: AccentColor;
  sidebarStyle: SidebarStyle;
  borderRadius: BorderRadius;
  density: DensityMode;
}

const DEFAULT_SETTINGS: AppearanceSettings = {
  accentColor: "blue",
  sidebarStyle: "glass",
  borderRadius: "modern",
  density: "comfortable",
};

export const APPEARANCE_STORAGE_KEY = "cartx_appearance_settings_v1";

interface AppearanceContextValue extends AppearanceSettings {
  setAccentColor: (accent: AccentColor) => void;
  setSidebarStyle: (style: SidebarStyle) => void;
  setBorderRadius: (radius: BorderRadius) => void;
  setDensity: (density: DensityMode) => void;
  resetAppearance: () => void;
}

const AppearanceContext = createContext<AppearanceContextValue | undefined>(undefined);

const emptySubscribe = () => () => {};

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppearanceSettings>(() => {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    try {
      const stored = window.localStorage.getItem(APPEARANCE_STORAGE_KEY);
      if (stored) {
        return {
          ...DEFAULT_SETTINGS,
          ...JSON.parse(stored),
        };
      }
    } catch {
      // Ignore parse errors
    }
    return DEFAULT_SETTINGS;
  });

  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  // Synchronize DOM attributes with current settings
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;

    // Accent
    if (settings.accentColor === "blue") {
      root.removeAttribute("data-accent");
    } else {
      root.setAttribute("data-accent", settings.accentColor);
    }

    // Sidebar
    root.setAttribute("data-sidebar", settings.sidebarStyle);

    // Border radius
    if (settings.borderRadius === "modern") {
      root.removeAttribute("data-radius");
    } else {
      root.setAttribute("data-radius", settings.borderRadius);
    }

    // Density
    if (settings.density === "comfortable") {
      root.removeAttribute("data-density");
    } else {
      root.setAttribute("data-density", settings.density);
    }

    // Persist
    try {
      window.localStorage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ignore quota errors
    }
  }, [settings, mounted]);

  const setAccentColor = useCallback((accentColor: AccentColor) => {
    setSettings((prev) => ({ ...prev, accentColor }));
  }, []);

  const setSidebarStyle = useCallback((sidebarStyle: SidebarStyle) => {
    setSettings((prev) => ({ ...prev, sidebarStyle }));
  }, []);

  const setBorderRadius = useCallback((borderRadius: BorderRadius) => {
    setSettings((prev) => ({ ...prev, borderRadius }));
  }, []);

  const setDensity = useCallback((density: DensityMode) => {
    setSettings((prev) => ({ ...prev, density }));
  }, []);

  const resetAppearance = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const value = useMemo(
    () => ({
      ...settings,
      setAccentColor,
      setSidebarStyle,
      setBorderRadius,
      setDensity,
      resetAppearance,
    }),
    [settings, setAccentColor, setSidebarStyle, setBorderRadius, setDensity, resetAppearance]
  );

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance(): AppearanceContextValue {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error("useAppearance must be used within an AppearanceProvider");
  }
  return context;
}
