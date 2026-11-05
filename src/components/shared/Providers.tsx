"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/auth/context";
import { AppearanceProvider } from "@/components/theme/AppearanceContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AppearanceProvider>
          <AuthProvider>
            <TooltipProvider delayDuration={200}>
              {children}
              <Toaster position="top-right" richColors />
            </TooltipProvider>
          </AuthProvider>
        </AppearanceProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

