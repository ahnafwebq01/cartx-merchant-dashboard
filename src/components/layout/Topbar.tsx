"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Bell,
  Search,
  HelpCircle,
  ChevronDown,
  Building,
  User as UserIcon,
  LogOut,
  LogIn,
  ExternalLink,
  Phone,
  Mail,
  Clock,
  LifeBuoy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sidebar } from "./Sidebar";
import { DemoModeBadge } from "./DemoModeBadge";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { useAuth } from "@/lib/auth/context";
import { resetAllDemoData } from "@/lib/demo/resetDemo";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";

export function Topbar() {
  const router = useRouter();
  const { user, currentStore, currentRole, logout, loginAsDemo } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    await logout();
    router.push("/");
  };

  const handleQuickReset = async () => {
    resetAllDemoData();
    await queryClient.invalidateQueries();
    toast.success("Demo Mode reset successfully", {
      description: "All onboarding steps and demo data have been restored to defaults.",
    });
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border/60 bg-card/80 dark:bg-card/75 backdrop-blur-md px-4 md:px-6 transition-colors shadow-xs">
      {/* Left: Mobile Navigation Trigger & Store Selector */}
      <div className="flex items-center gap-3">
        {/* Mobile Drawer Trigger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-r border-border glass-sidebar">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">
              Merchant dashboard mobile navigation sidebar
            </SheetDescription>
            <Suspense fallback={<div className="w-64 h-full bg-card" />}>
              <Sidebar onItemClick={() => setMobileOpen(false)} />
            </Suspense>
          </SheetContent>
        </Sheet>

        {/* Current Store Selector */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/70 bg-background/50 backdrop-blur-xs hover:bg-muted/60 cursor-pointer transition-colors max-w-[180px] sm:max-w-xs shadow-xs">
          <Building className="h-4 w-4 text-primary shrink-0" />
          <div className="flex flex-col text-left min-w-0">
            <span className="text-xs font-semibold leading-tight text-foreground truncate">
              {currentStore?.name || "CartX Demo Store"}
            </span>
            <span className="text-[10px] text-muted-foreground truncate">
              {currentStore?.currency || "BDT (৳)"}
            </span>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-1 shrink-0" />
        </div>
      </div>

      {/* Center: Quick Search Trigger */}
      <div className="hidden md:flex items-center">
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground border border-input/80 rounded-lg bg-background/60 backdrop-blur-xs hover:bg-muted/70 hover:border-primary/40 transition-all w-64 justify-between shadow-xs cursor-pointer"
          aria-label="Quick search products, orders, customers"
        >
          <span className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5" />
            <span>Search store...</span>
          </span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted/80 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Right: Actions & User Profile */}
      <div className="flex items-center gap-2">
        {/* Demo Mode Badge */}
        <DemoModeBadge />

        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* Help Shortcut */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground cursor-pointer"
          aria-label="Help and merchant support"
          onClick={() => setHelpOpen(true)}
        >
          <HelpCircle className="h-4 w-4" />
        </Button>

        {/* Notification Center Trigger */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-muted-foreground hover:text-foreground cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>

        {/* User Profile Menu or Sign-in */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 pl-2 pr-1 h-9 rounded-full focus:outline-none cursor-pointer hover:bg-muted/50"
                aria-label="User account menu"
              >
                <Avatar className="h-7 w-7 border border-border">
                  <AvatarImage src={user?.avatarUrl} alt={user?.name || "Merchant"} />
                  <AvatarFallback className="text-[11px] bg-primary text-primary-foreground font-semibold">
                    {user?.name ? user.name.slice(0, 2).toUpperCase() : "CX"}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-panel">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none text-foreground">
                    {user?.name || "Merchant Admin"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "merchant@cartx.com.bd"}
                  </p>
                  <div className="pt-1">
                    <Badge variant="outline" className="text-[10px] font-mono capitalize">
                      {currentRole || "Store Owner"}
                    </Badge>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer flex items-center">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Store Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href={currentStore?.slug ? `https://${currentStore.slug}.cartx.com.bd` : "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer flex items-center"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  <span>View Storefront</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleQuickReset} className="text-amber-600 dark:text-amber-400 cursor-pointer">
                <RotateCcw className="mr-2 h-4 w-4" />
                <span>Reset Demo Data</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login" className="cursor-pointer flex items-center text-muted-foreground">
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Switch Account / Sign In</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="outline"
              asChild
              className="text-xs h-8 cursor-pointer"
            >
              <Link href="/login">Sign In</Link>
            </Button>
            <Button
              size="sm"
              onClick={() => loginAsDemo("owner")}
              className="text-xs h-8 cursor-pointer"
            >
              Demo Sign-In
            </Button>
          </div>
        )}
      </div>

      {/* Help & Support Dialog */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary">
              <LifeBuoy className="h-5 w-5" />
              <DialogTitle className="text-base font-semibold">
                CartX Merchant Support
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              Dedicated merchant assistance for online businesses in Bangladesh.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 rounded-lg border border-border bg-muted/40 space-y-2">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <Phone className="h-4 w-4 text-primary" />
                <span>Merchant Helpline: +880 9612-CARTX (22789)</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@cartx.com.bd</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Saturday – Thursday: 9:00 AM – 10:00 PM (Dhaka Time)</span>
              </div>
            </div>

            <div className="text-[11px] text-muted-foreground space-y-1">
              <p>
                <strong>Demo Mode Info:</strong> All product, inventory, order, payment, and shipment data in this session is stored safely in your browser storage.
              </p>
              <p>
                Need tutorials or technical help? Visit the{" "}
                <Link
                  href="/dashboard/support"
                  onClick={() => setHelpOpen(false)}
                  className="text-primary underline font-medium"
                >
                  Help Center
                </Link>{" "}
                or submit a{" "}
                <Link
                  href="/dashboard/support/tickets"
                  onClick={() => setHelpOpen(false)}
                  className="text-primary underline font-medium"
                >
                  Support Ticket
                </Link>
                .
              </p>
              <p>
                Need to change store profile, business details, or delivery rates? Visit{" "}
                <Link
                  href="/dashboard/settings"
                  onClick={() => setHelpOpen(false)}
                  className="text-primary underline font-medium"
                >
                  Store Settings
                </Link>
                .
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}

