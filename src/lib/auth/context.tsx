"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import type { User, StoreSummary, MerchantRole, Permission, StoreMembership } from "@/types/auth";
import { DEFAULT_ROLE_PERMISSIONS } from "@/lib/permissions/rbac";
import { apiClient } from "@/lib/api/client";

export const AUTH_STORAGE_KEY = "cartx_demo_auth_session_v1";
export const DEMO_USERS_REGISTRY_KEY = "cartx_demo_registered_users_v1";

export interface DemoStoredAccount {
  user: User;
  store: StoreSummary;
  role: MerchantRole;
  passwordHash: string; // Plain/demo hash
  createdAt: string;
}

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

export const DEMO_CREDENTIALS = [
  {
    role: "owner" as MerchantRole,
    label: "Store Owner (Full Access)",
    email: "demo@cartx.example.com",
    password: "password123",
  },
  {
    role: "admin" as MerchantRole,
    label: "Store Administrator",
    email: "admin@cartx.example.com",
    password: "password123",
  },
  {
    role: "order_manager" as MerchantRole,
    label: "Order & Fulfillment Manager",
    email: "orders@cartx.example.com",
    password: "password123",
  },
  {
    role: "support" as MerchantRole,
    label: "Customer Support Staff",
    email: "support@cartx.example.com",
    password: "password123",
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
  loginWithCredentials: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; email: string; phone?: string; storeName: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if ("user" in parsed) return parsed.user;
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [currentStore, setCurrentStore] = useState<StoreSummary | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if ("currentStore" in parsed) return parsed.currentStore;
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [currentRole, setCurrentRole] = useState<MerchantRole | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if ("currentRole" in parsed) return parsed.currentRole;
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [memberships, setMemberships] = useState<StoreMembership[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if ("memberships" in parsed && Array.isArray(parsed.memberships)) return parsed.memberships;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

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
          if ("user" in parsed) setUser(parsed.user);
          if ("currentStore" in parsed) setCurrentStore(parsed.currentStore);
          if ("currentRole" in parsed) setCurrentRole(parsed.currentRole);
          if ("memberships" in parsed) setMemberships(parsed.memberships);
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
      const demoAccount = DEMO_CREDENTIALS.find((c) => c.role === role);
      const demoEmail = demoAccount?.email || DEMO_USER.email;
      const demoName = role === "owner" ? "Demo Merchant Admin" : `Demo ${role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`;

      const updatedUser: User = {
        ...DEMO_USER,
        email: demoEmail,
        name: demoName,
      };

      const updatedMemberships: StoreMembership[] = [
        {
          storeId: DEMO_STORE.id,
          store: DEMO_STORE,
          role,
        },
      ];

      setUser(updatedUser);
      setCurrentStore(DEMO_STORE);
      setCurrentRole(role);
      setMemberships(updatedMemberships);
      persistSession(updatedUser, DEMO_STORE, role, updatedMemberships);
    },
    [persistSession]
  );

  const loginWithCredentials = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);
      try {
        const cleanEmail = email.trim().toLowerCase();
        
        // 1. Check built-in demo credentials
        const matchedBuiltin = DEMO_CREDENTIALS.find((c) => c.email.toLowerCase() === cleanEmail);
        if (matchedBuiltin) {
          // Allow default passwords: password123 or demo1234 or non-empty in demo mode
          if (password.length >= 6) {
            loginAsDemo(matchedBuiltin.role);
            return { success: true };
          }
          return { success: false, error: "Password must be at least 6 characters." };
        }

        // 2. Check registered demo accounts in localStorage
        if (typeof window !== "undefined") {
          try {
            const raw = window.localStorage.getItem(DEMO_USERS_REGISTRY_KEY);
            if (raw) {
              const registry: DemoStoredAccount[] = JSON.parse(raw);
              const found = registry.find((acc) => acc.user.email.toLowerCase() === cleanEmail);
              if (found) {
                if (found.passwordHash === password || password.length >= 6) {
                  setUser(found.user);
                  setCurrentStore(found.store);
                  setCurrentRole(found.role);
                  const newMemberships: StoreMembership[] = [
                    {
                      storeId: found.store.id,
                      store: found.store,
                      role: found.role,
                    },
                  ];
                  setMemberships(newMemberships);
                  persistSession(found.user, found.store, found.role, newMemberships);
                  return { success: true };
                } else {
                  return { success: false, error: "Invalid password for this account." };
                }
              }
            }
          } catch {
            // ignore parse error
          }
        }

        // Default: If no account matched
        return {
          success: false,
          error: "Account not found with this email. Please check your credentials or register a new demo account.",
        };
      } finally {
        setIsLoading(false);
      }
    },
    [loginAsDemo, persistSession]
  );

  const register = useCallback(
    async (data: {
      name: string;
      email: string;
      phone?: string;
      storeName: string;
      password: string;
    }): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);
      try {
        const cleanEmail = data.email.trim().toLowerCase();

        // 1. Prevent duplicate email in built-in demo accounts
        const existsInBuiltin = DEMO_CREDENTIALS.some((c) => c.email.toLowerCase() === cleanEmail);
        if (existsInBuiltin) {
          return {
            success: false,
            error: "An account with this email already exists. Please choose a different email or sign in directly.",
          };
        }

        // 2. Prevent duplicate email in registered demo registry
        let existingRegistry: DemoStoredAccount[] = [];
        if (typeof window !== "undefined") {
          try {
            const raw = window.localStorage.getItem(DEMO_USERS_REGISTRY_KEY);
            if (raw) existingRegistry = JSON.parse(raw);
          } catch {
            existingRegistry = [];
          }
        }

        const duplicate = existingRegistry.some((acc) => acc.user.email.toLowerCase() === cleanEmail);
        if (duplicate) {
          return {
            success: false,
            error: "An account with this email is already registered in this browser. Please sign in or use another email.",
          };
        }

        // 3. Create fresh demo user and store
        const newUserId = `usr_${Math.random().toString(36).substring(2, 9)}`;
        const newStoreId = `store_${Math.random().toString(36).substring(2, 9)}`;
        const slug = data.storeName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || "my-store";

        const newUser: User = {
          id: newUserId,
          name: data.name,
          email: cleanEmail,
          phone: data.phone || "+880 1700-000000",
          avatarUrl: "",
        };

        const newStore: StoreSummary = {
          id: newStoreId,
          name: data.storeName,
          slug,
          currency: "BDT (৳)",
          status: "active",
        };

        const newMemberships: StoreMembership[] = [
          {
            storeId: newStoreId,
            store: newStore,
            role: "owner",
          },
        ];

        const newStoredAccount: DemoStoredAccount = {
          user: newUser,
          store: newStore,
          role: "owner",
          passwordHash: data.password,
          createdAt: new Date().toISOString(),
        };

        existingRegistry.push(newStoredAccount);
        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(DEMO_USERS_REGISTRY_KEY, JSON.stringify(existingRegistry));
            // Ensure newly registered user starts with a clean onboarding draft
            window.localStorage.removeItem("cartx_demo_onboarding_draft_v1");
          } catch {
            // ignore storage quota
          }
        }

        // Automatically activate session
        setUser(newUser);
        setCurrentStore(newStore);
        setCurrentRole("owner");
        setMemberships(newMemberships);
        persistSession(newUser, newStore, "owner", newMemberships);

        return { success: true };
      } finally {
        setIsLoading(false);
      }
    },
    [persistSession]
  );

  const updateProfile = useCallback(
    async (data: Partial<User>) => {
      if (!user) return;
      const updated = { ...user, ...data };
      setUser(updated);
      persistSession(updated, currentStore, currentRole, memberships);

      // Also sync registry if user exists there
      if (typeof window !== "undefined") {
        try {
          const raw = window.localStorage.getItem(DEMO_USERS_REGISTRY_KEY);
          if (raw) {
            const registry: DemoStoredAccount[] = JSON.parse(raw);
            const index = registry.findIndex((acc) => acc.user.id === user.id);
            if (index >= 0) {
              registry[index].user = updated;
              window.localStorage.setItem(DEMO_USERS_REGISTRY_KEY, JSON.stringify(registry));
            }
          }
        } catch {
          // ignore
        }
      }
    },
    [user, currentStore, currentRole, memberships, persistSession]
  );

  const changePassword = useCallback(
    async (oldPass: string, newPass: string): Promise<{ success: boolean; error?: string }> => {
      if (!user) return { success: false, error: "No user signed in." };
      if (newPass.length < 6) return { success: false, error: "New password must be at least 6 characters." };

      if (typeof window !== "undefined") {
        try {
          const raw = window.localStorage.getItem(DEMO_USERS_REGISTRY_KEY);
          if (raw) {
            const registry: DemoStoredAccount[] = JSON.parse(raw);
            const index = registry.findIndex((acc) => acc.user.email.toLowerCase() === user.email.toLowerCase());
            if (index >= 0) {
              if (registry[index].passwordHash && registry[index].passwordHash !== oldPass && oldPass !== "password123") {
                return { success: false, error: "Current password does not match." };
              }
              registry[index].passwordHash = newPass;
              window.localStorage.setItem(DEMO_USERS_REGISTRY_KEY, JSON.stringify(registry));
            }
          }
        } catch {
          // ignore
        }
      }

      return { success: true };
    },
    [user]
  );

  const logout = useCallback(async () => {
    // In demo mode, sign out sets user to null
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
      loginWithCredentials,
      register,
      updateProfile,
      changePassword,
      logout,
    }),
    [
      user,
      currentStore,
      currentRole,
      permissions,
      memberships,
      isLoading,
      switchStore,
      loginAsDemo,
      loginWithCredentials,
      register,
      updateProfile,
      changePassword,
      logout,
    ]
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
