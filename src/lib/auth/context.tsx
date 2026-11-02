"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import type { User, StoreSummary, MerchantRole, Permission, StoreMembership } from "@/types/auth";
import { DEFAULT_ROLE_PERMISSIONS } from "@/lib/permissions/rbac";
import { apiClient } from "@/lib/api/client";

export const AUTH_STORAGE_KEY = "cartx_demo_auth_session_v1";

export const DEMO_USER: User = {
  id: "usr_demo_01",
  name: "Demo Merchant Admin",
  email: "demo@cartx.example.com",
  phone: "+880 1700-000000",
  avatarUrl: "",
};

export const DEMO_STORE: StoreSummary = {
  id: "store_demo_01",
  name: "CartX Demo Store",
  slug: "cartx-demo",
  currency: "BDT (৳)",
  status: "active",
};

export const DEMO_MEMBERSHIPS: StoreMembership[] = [
  {
    storeId: "store_demo_01",
    store: DEMO_STORE,
    role: "owner",
  },
];

interface AuthContextValue {
  user: User | null;
  currentStore: StoreSummary | null;
  currentRole: MerchantRole | null;
  permissions: Permission[];
  memberships: StoreMembership[];
  isAuthenticated: boolean;
  isLoading: boolean;
  switchStore: (storeId: string) => Promise<void>;
  loginAsDemo: (role?: MerchantRole) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(DEMO_USER);
  const [currentStore, setCurrentStore] = useState<StoreSummary | null>(DEMO_STORE);
  const [currentRole, setCurrentRole] = useState<MerchantRole | null>("owner");
  const [memberships, setMemberships] = useState<StoreMembership[]>(DEMO_MEMBERSHIPS);
  const [isLoading] = useState<boolean>(false);

  // Synchronize active store ID with API client
  useEffect(() => {
    apiClient.setActiveStoreId(currentStore?.id || null);
  }, [currentStore]);

  // Synchronize across tabs on external storage change
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === AUTH_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.user) setUser(parsed.user);
          if (parsed.currentStore) setCurrentStore(parsed.currentStore);
          if (parsed.currentRole) setCurrentRole(parsed.currentRole);
          if (parsed.memberships) setMemberships(parsed.memberships);
        } catch {
          // ignore invalid json
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Persist session to local storage
  const persistSession = useCallback((u: User | null, s: StoreSummary | null, r: MerchantRole | null, m: StoreMembership[]) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        user: u,
        currentStore: s,
        currentRole: r,
        memberships: m,
      }));
    } catch (e) {
      console.warn("[Auth] Failed to persist demo session:", e);
    }
  }, []);

  const permissions = useMemo(() => {
    if (!currentRole) return [];
    return DEFAULT_ROLE_PERMISSIONS[currentRole] || [];
  }, [currentRole]);

  const switchStore = useCallback(
    async (storeId: string) => {
      const target = memberships.find((m) => m.storeId === storeId);
      if (target) {
        setCurrentStore(target.store);
        setCurrentRole(target.role);
        persistSession(user, target.store, target.role, memberships);
      }
    },
    [memberships, persistSession, user]
  );

  const loginAsDemo = useCallback(
    (role: MerchantRole = "owner") => {
      setUser(DEMO_USER);
      setCurrentStore(DEMO_STORE);
      setCurrentRole(role);
      setMemberships(DEMO_MEMBERSHIPS);
      persistSession(DEMO_USER, DEMO_STORE, role, DEMO_MEMBERSHIPS);
    },
    [persistSession]
  );

  const logout = useCallback(async () => {
    // In demo mode, sign out sets user to null or can offer quick re-sign-in
    setUser(null);
    setCurrentStore(null);
    setCurrentRole(null);
    setMemberships([]);
    persistSession(null, null, null, []);
  }, [persistSession]);

  const value = useMemo(
    () => ({
      user,
      currentStore,
      currentRole,
      permissions,
      memberships,
      isAuthenticated: !!user,
      isLoading,
      switchStore,
      loginAsDemo,
      logout,
    }),
    [user, currentStore, currentRole, permissions, memberships, isLoading, switchStore, loginAsDemo, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
