"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Plus, Lock } from "lucide-react";

interface OrderNotesCardProps {
  internalNotes?: string;
  onAddNote: (note: string) => Promise<void>;
  isLoading?: boolean;
}

export function OrderNotesCard({
  internalNotes,
  onAddNote,
  isLoading = false,
}: OrderNotesCardProps) {
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddNote(note.trim());
      setNote("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border border-border shadow-xs">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            <span>Staff Internal Notes</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-normal">
            <Lock className="h-3 w-3" />
            Private to Merchant
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 space-y-4 text-xs">
        {internalNotes ? (
          <div className="p-3 rounded-md bg-muted/40 border border-border/60 whitespace-pre-wrap font-sans text-foreground text-[11px] leading-relaxed">
            {internalNotes}
          </div>
        ) : (
          <p className="text-muted-foreground italic text-[11px]">
            No internal staff notes recorded yet.
          </p>
        )}

        {/* Add Note Form */}
        <form onSubmit={handleSubmit} className="space-y-2 pt-2 border-t border-border/60">
          <Textarea
            placeholder="Add internal note for fulfillment team..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="text-xs"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              disabled={isLoading || isSubmitting || !note.trim()}
              className="text-xs h-7 gap-1 font-medium"
            >
              <Plus className="h-3.5 w-3.5" />
              {isSubmitting ? "Saving..." : "Add Note"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

