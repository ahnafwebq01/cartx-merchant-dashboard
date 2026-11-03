"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Webhook, ShieldCheck } from "lucide-react";
import type { WebhookEndpoint, WebhookEvent } from "../types";
import { WEBHOOK_EVENT_OPTIONS } from "../constants";
import { WebhookPayloadPreview } from "./WebhookPayloadPreview";
import { useCreateWebhookMutation, useUpdateWebhookMutation } from "../hooks";

interface WebhookEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  webhookToEdit?: WebhookEndpoint | null;
}

export function WebhookEditorDialog({
  open,
  onOpenChange,
  webhookToEdit,
}: WebhookEditorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {open && (
          <WebhookEditorForm
            key={webhookToEdit?.id || "new"}
            webhookToEdit={webhookToEdit}
            onOpenChange={onOpenChange}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function WebhookEditorForm({
  webhookToEdit,
  onOpenChange,
}: {
  webhookToEdit?: WebhookEndpoint | null;
  onOpenChange: (open: boolean) => void;
}) {
  const createMutation = useCreateWebhookMutation();
  const updateMutation = useUpdateWebhookMutation();

  const [url, setUrl] = useState(
    () => webhookToEdit?.url ?? "https://api.yourstore.com.bd/webhooks/orders"
  );
  const [description, setDescription] = useState(
    () => webhookToEdit?.description ?? ""
  );
  const [selectedEvents, setSelectedEvents] = useState<WebhookEvent[]>(
    () => webhookToEdit?.events ?? ["order.created", "order.updated"]
  );
  const [isActive, setIsActive] = useState(() => webhookToEdit?.isActive ?? true);

  const toggleEvent = (event: WebhookEvent) => {
    if (selectedEvents.includes(event)) {
      if (selectedEvents.length <= 1) return; // at least 1
      setSelectedEvents((prev) => prev.filter((e) => e !== event));
    } else {
      setSelectedEvents((prev) => [...prev, event]);
    }
  };

  const handleSave = async () => {
    if (!url.trim()) return;

    if (webhookToEdit) {
      await updateMutation.mutateAsync({
        id: webhookToEdit.id,
        values: {
          url: url.trim(),
          description: description.trim(),
          events: selectedEvents,
          isActive,
        },
      });
    } else {
      await createMutation.mutateAsync({
        url: url.trim(),
        description: description.trim(),
        events: selectedEvents,
        isActive,
      });
    }

    onOpenChange(false);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Webhook className="h-5 w-5 text-primary" />
          {webhookToEdit ? "Edit Webhook Endpoint" : "Add Webhook Endpoint"}
        </DialogTitle>
        <DialogDescription className="text-xs">
          Subscribe destination endpoints to asynchronous store events
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-2">
        {/* Endpoint URL */}
        <div className="space-y-1.5">
          <Label htmlFor="webhookUrl" className="text-xs font-medium">
            Endpoint Destination URL <span className="text-destructive">*</span>
          </Label>
          <Input
            id="webhookUrl"
            placeholder="https://api.yourstore.com.bd/webhooks/handler"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="text-xs font-mono"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="webhookDesc" className="text-xs font-medium">
            Description / System Purpose
          </Label>
          <Input
            id="webhookDesc"
            placeholder="e.g. ERP order sync listener"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="text-xs"
          />
        </div>

        {/* Signing Secret Notice */}
        <div className="p-3 rounded-lg border border-border bg-muted/30 space-y-1 text-xs">
          <div className="flex items-center justify-between font-medium">
            <span className="flex items-center gap-1.5 text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              HMAC Signing Secret Key
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">
              whsec_••••••••••••••••••••••••
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Production webhooks are cryptographically signed using HMAC-SHA256 headers. Raw signing secrets are never exposed on client-side bundles.
          </p>
        </div>

        {/* Subscribed Events Checklist */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Subscribed Events ({selectedEvents.length})</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {WEBHOOK_EVENT_OPTIONS.map((opt) => {
              const isChecked = selectedEvents.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                    isChecked
                      ? "border-primary/50 bg-primary/5"
                      : "border-border bg-muted/20 hover:bg-muted/40"
                  }`}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => toggleEvent(opt.value)}
                    className="mt-0.5"
                  />
                  <div className="space-y-0.5 min-w-0">
                    <div className="font-mono text-xs font-semibold leading-tight text-foreground">
                      {opt.label}
                    </div>
                    <div className="text-[10px] text-muted-foreground leading-tight">
                      {opt.description}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Sample Payload Preview */}
        <WebhookPayloadPreview events={selectedEvents} />

        {/* Active Switch */}
        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20 text-xs">
          <div>
            <div className="font-medium">Active Subscription State</div>
            <div className="text-[11px] text-muted-foreground">
              Disabled webhooks will not attempt automated simulation deliveries
            </div>
          </div>
          <Switch checked={isActive} onCheckedChange={setIsActive} />
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleSave}
          disabled={!url.trim() || createMutation.isPending || updateMutation.isPending}
        >
          {webhookToEdit ? "Update Endpoint" : "Register Webhook"}
        </Button>
      </DialogFooter>
    </>
  );
}
