"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Customer } from "../types";
import { Tag, Plus, X } from "lucide-react";

interface CustomerTagsModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveTags: (tags: string[]) => Promise<void>;
  isLoading?: boolean;
}

const COMMON_TAGS = [
  "VIP",
  "Repeat",
  "High-Value",
  "Wholesale",
  "Dhaka",
  "Chattogram",
  "COD Verified",
  "COD High-Risk",
  "Corporate",
  "Eid Shopper",
];

export function CustomerTagsModal({
  customer,
  isOpen,
  onClose,
  onSaveTags,
  isLoading = false,
}: CustomerTagsModalProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [prevCustomer, setPrevCustomer] = useState<Customer | null>(null);

  if (customer !== prevCustomer) {
    setPrevCustomer(customer);
    setTags(customer?.tags || []);
  }

  if (!customer) return null;

  const handleAddTag = (t: string) => {
    const trimmed = t.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setCustomTag("");
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((tag) => tag !== t));
  };

  const handleSave = async () => {
    await onSaveTags(tags);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            Manage Tags for {customer.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Active Tags */}
          <div className="space-y-1.5">
            <span className="font-semibold text-foreground text-[11px] uppercase tracking-wider">
              Assigned Tags
            </span>
            <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-md bg-muted/30 border border-border/60">
              {tags.length === 0 ? (
                <span className="text-muted-foreground italic text-[11px]">
                  No tags assigned yet.
                </span>
              ) : (
                tags.map((t) => (
                  <Badge
                    key={t}
                    variant="secondary"
                    className="text-xs gap-1 pl-2 pr-1 py-0.5"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-destructive rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>

          {/* Add Custom Tag */}
          <div className="flex gap-2">
            <Input
              placeholder="Type new tag name..."
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag(customTag);
                }
              }}
              className="text-xs h-8"
            />
            <Button
              type="button"
              size="sm"
              onClick={() => handleAddTag(customTag)}
              disabled={!customTag.trim()}
              className="text-xs h-8 gap-1 font-medium"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </Button>
          </div>

          {/* Suggested Common Tags */}
          <div className="space-y-1.5 pt-2 border-t border-border/60">
            <span className="font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">
              Suggested Tags
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_TAGS.filter((t) => !tags.includes(t)).map((suggested) => (
                <button
                  key={suggested}
                  type="button"
                  onClick={() => handleAddTag(suggested)}
                  className="px-2 py-0.5 rounded text-[11px] bg-muted hover:bg-primary/10 hover:text-primary transition-colors border border-border/60"
                >
                  + {suggested}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={isLoading}
            className="text-xs font-medium"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

