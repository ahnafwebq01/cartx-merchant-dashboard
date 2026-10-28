"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import type { User, StoreSummary, MerchantRole, Permission, StoreMembership } from "@/types/auth";
import { DEFAULT_ROLE_PERMISSIONS } from "@/lib/permissions/rbac";
import { apiClient } from "@/lib/api/client";

interface AuthContextValue {
  user: User | null;
  currentStore: StoreSummary | null;
  currentRole: MerchantRole | null;
  permissions: Permission[];
  memberships: StoreMembership[];
  isAuthenticated: boolean;
  isLoading: boolean;
  switchStore: (storeId: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentStore, setCurrentStore] = useState<StoreSummary | null>(null);
  const [currentRole, setCurrentRole] = useState<MerchantRole | null>(null);
  const [memberships, setMemberships] = useState<StoreMembership[]>([]);
  // Phase 1 begins with initial state ready (no active session yet)
  const [isLoading] = useState<boolean>(false);

  // Synchronize active store ID with API client
  useEffect(() => {
    apiClient.setActiveStoreId(currentStore?.id || null);
  }, [currentStore]);

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
      }
    },
    [memberships]
  );

  const logout = useCallback(async () => {
    setUser(null);
    setCurrentStore(null);
    setCurrentRole(null);
    setMemberships([]);
  }, []);

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
      logout,
    }),
    [user, currentStore, currentRole, permissions, memberships, isLoading, switchStore, logout]
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
