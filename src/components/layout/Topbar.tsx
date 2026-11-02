"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import {
  Menu,
  Bell,
  Search,
  HelpCircle,
  ChevronDown,
  Building,
  User as UserIcon,
  LogOut,
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
import { useAuth } from "@/lib/auth/context";

export function Topbar() {
  const { user, currentStore, currentRole, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-card px-4 md:px-6">
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
          <SheetContent side="left" className="p-0 w-64 border-r border-border">
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
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background/50 hover:bg-muted/50 cursor-pointer transition-colors max-w-[180px] sm:max-w-xs">
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
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground border border-input rounded-md bg-background hover:bg-muted transition-colors w-64 justify-between"
          aria-label="Quick search products, orders, customers"
        >
          <span className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5" />
            <span>Search store...</span>
          </span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Right: Actions & User Profile */}
      <div className="flex items-center gap-2">
        {/* Help Shortcut */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
          aria-label="Help and merchant support"
          onClick={() => setHelpOpen(true)}
        >
          <HelpCircle className="h-4 w-4" />
        </Button>

        {/* Notification Center Trigger */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>

        {/* User Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 pl-2 pr-1 h-9 rounded-full focus:outline-none"
              aria-label="User account menu"
            >
              <Avatar className="h-7 w-7 border border-border">
                <AvatarImage src={user?.avatarUrl} alt={user?.name || "Merchant"} />
                <AvatarFallback className="text-[11px] bg-primary text-primary-foreground">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : "CX"}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-foreground">
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
                <span>Store Profile</span>
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
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()} className="text-destructive cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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

