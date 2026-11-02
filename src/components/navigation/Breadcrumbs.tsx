import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items = [], className }: BreadcrumbsProps) {
  // Omit leading redundant "Dashboard" item if items.length > 1, as the Home icon already links to /dashboard
  const displayItems =
    items.length > 1 && (items[0].href === "/dashboard" || items[0].label === "Dashboard")
      ? items.slice(1)
      : items;

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm", className)}>
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground flex items-center transition-colors"
            aria-label="Dashboard Home"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          return (
            <React.Fragment key={index}>
              <li aria-hidden="true" className="text-muted-foreground">
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li>
                {isLast || !item.href ? (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className={cn(
                      "font-medium",
                      isLast ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

