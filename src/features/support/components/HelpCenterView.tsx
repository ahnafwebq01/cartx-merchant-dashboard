"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Search,
  BookOpen,
  Clock,
  ArrowRight,
  LifeBuoy,
  CreditCard,
  Truck,
  Globe,
  Users,
  Megaphone,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useHelpArticlesQuery, useFaqsQuery } from "../hooks";
import { HelpArticleModal } from "./HelpArticleModal";
import { CreateTicketDialog } from "./CreateTicketDialog";
import type { HelpArticle } from "../types";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";

export function HelpCenterView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);
  const [openFaqId, setOpenFaqId] = useState<string | null>("faq_01");

  const { data: articles = [], isLoading: isLoadingArticles } = useHelpArticlesQuery({
    search: searchTerm,
    category: categoryFilter,
  });

  const { data: faqs = [], isLoading: isLoadingFaqs } = useFaqsQuery();

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const categories = [
    { id: "all", label: "All Guides", icon: BookOpen },
    { id: "payments", label: "Payment Gateways", icon: CreditCard },
    { id: "couriers", label: "Shipping & Courier", icon: Truck },
    { id: "storefront", label: "Domains & Themes", icon: Globe },
    { id: "team_billing", label: "Team & Invoicing", icon: Users },
    { id: "marketing", label: "Marketing & Drops", icon: Megaphone },
  ];

  if (isLoadingArticles || isLoadingFaqs) {
    return <LoadingSkeleton rows={5} />;
  }

  return (
    <div className="space-y-8">
      {/* Hero Search Section */}
      <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-8 text-center max-w-3xl mx-auto shadow-sm">
        <Badge variant="outline" className="border-primary/40 text-primary text-xs mb-2">
          CARTX KNOWLEDGE BASE
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          How can we help your business today?
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-xl mx-auto">
          Explore step-by-step technical guides, courier API instructions, and FAQs designed for Bangladesh merchants.
        </p>

        <div className="mt-5 max-w-lg mx-auto relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search guides, setup tutorials, bKash, Steadfast..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 text-xs sm:text-sm bg-card shadow-sm"
          />
        </div>
      </div>

      {/* System Operational Status Card */}
      <Card className="border-emerald-500/20 bg-emerald-500/5">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <span className="font-semibold text-xs text-foreground block">
                All CartX Platform Systems Operational
              </span>
              <span className="text-[11px] text-muted-foreground">
                Storefront CDN (100%), bKash/Nagad PGW (100%), Steadfast & Pathao APIs (Normal)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard/support/tickets">
              <Button variant="outline" size="sm" className="text-xs gap-1.5 h-8">
                <LifeBuoy className="h-3.5 w-3.5" />
                View Support Tickets
              </Button>
            </Link>
            <CreateTicketDialog />
          </div>
        </CardContent>
      </Card>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = categoryFilter === cat.id;

          return (
            <Button
              key={cat.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter(cat.id)}
              className="text-xs gap-1.5 h-8"
            >
              <Icon className="h-3.5 w-3.5" />
              {cat.label}
            </Button>
          );
        })}
      </div>

      {/* Articles Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Knowledge Base Guides ({articles.length})
          </h3>
          {categoryFilter !== "all" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCategoryFilter("all")}
              className="text-xs text-muted-foreground hover:text-foreground h-7"
            >
              Reset Category
            </Button>
          )}
        </div>

        {articles.length === 0 ? (
          <div className="p-8 text-center rounded-lg border border-dashed border-border">
            <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <h4 className="font-medium text-foreground text-sm">No articles match your query</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Try searching for &ldquo;bKash&rdquo;, &ldquo;Steadfast&rdquo;, &ldquo;Domain&rdquo;, or &ldquo;RBAC&rdquo;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((art) => (
              <Card
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                      {art.categoryLabel}
                    </Badge>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{art.readTimeMinutes} min</span>
                    </div>
                  </div>
                  <CardTitle className="text-sm font-semibold line-clamp-2 hover:text-primary transition-colors">
                    {art.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-3 text-xs text-muted-foreground line-clamp-3">
                  {art.summary}
                </CardContent>
                <CardFooter className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-primary font-medium">
                  <span>Read Guide</span>
                  <ArrowRight className="h-3 w-3" />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Frequently Asked Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription className="text-xs">
            Quick solutions to the most common merchant inquiries on CartX.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {faqs.map((faq) => {
            const isOpen = openFaqId === faq.id;

            return (
              <div
                key={faq.id}
                className="rounded-lg border border-border overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-xs font-semibold text-foreground hover:bg-muted/30"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-3.5 pt-0 text-xs text-muted-foreground border-t border-border/50 bg-muted/10 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Submit Ticket Banner */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Need 1-on-1 assistance with your store?
            </h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-md">
              Our Dhaka-based merchant support specialists are available Sunday through Thursday to assist with integrations, billing, and custom domains.
            </p>
          </div>
          <CreateTicketDialog />
        </CardContent>
      </Card>

      {/* Article Reader Modal */}
      <HelpArticleModal
        article={selectedArticle}
        open={Boolean(selectedArticle)}
        onOpenChange={(open) => !open && setSelectedArticle(null)}
      />
    </div>
  );
}
