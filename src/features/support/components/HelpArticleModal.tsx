"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ThumbsUp, ThumbsDown, CheckCircle } from "lucide-react";
import type { HelpArticle } from "../types";
import { toast } from "sonner";

interface HelpArticleModalProps {
  article: HelpArticle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HelpArticleModal({
  article,
  open,
  onOpenChange,
}: HelpArticleModalProps) {
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  if (!article) return null;

  const handleFeedback = (helpful: boolean) => {
    setFeedbackGiven(true);
    toast.success(helpful ? "Thank you for your feedback!" : "Thanks! We'll improve this guide.");
  };

  const formatDate = (isoString: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "Asia/Dhaka",
      }).format(new Date(isoString));
    } catch {
      return isoString;
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) setFeedbackGiven(false);
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-3 border-b border-border">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <Badge variant="outline" className="text-primary border-primary/30 text-xs">
              {article.categoryLabel}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{article.readTimeMinutes} min read</span>
            </div>
            <span className="text-xs text-muted-foreground">• Updated {formatDate(article.lastUpdated)}</span>
          </div>

          <DialogTitle className="text-xl font-bold text-foreground leading-snug">
            {article.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            {article.summary}
          </DialogDescription>
        </DialogHeader>

        {/* Article Body */}
        <div className="py-4 space-y-4 text-xs text-muted-foreground leading-relaxed whitespace-pre-line font-sans">
          {article.content}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border">
          {article.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] font-normal">
              #{tag}
            </Badge>
          ))}
        </div>

        {/* Helpful Feedback Section */}
        <div className="p-3 rounded-lg border border-border bg-muted/40 flex items-center justify-between text-xs mt-2">
          <span className="text-muted-foreground font-medium">Was this guide helpful?</span>
          {feedbackGiven ? (
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-xs font-medium">
              <CheckCircle className="h-3.5 w-3.5" /> Feedback recorded
            </span>
          ) : (
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFeedback(true)}
                className="h-7 text-xs gap-1"
              >
                <ThumbsUp className="h-3 w-3" /> Yes
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFeedback(false)}
                className="h-7 text-xs gap-1"
              >
                <ThumbsDown className="h-3 w-3" /> No
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
