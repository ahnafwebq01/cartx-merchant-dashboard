"use client";

import React, { useState } from "react";
import { Code2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { WebhookEvent } from "../types";
import { SAMPLE_WEBHOOK_PAYLOADS } from "../constants";
import { toast } from "sonner";

interface WebhookPayloadPreviewProps {
  events: WebhookEvent[];
}

export function WebhookPayloadPreview({ events }: WebhookPayloadPreviewProps) {
  const [selectedEvent, setSelectedEvent] = useState<WebhookEvent>(
    events[0] || "order.created"
  );
  const [copied, setCopied] = useState(false);

  const activeEvent = events.includes(selectedEvent) ? selectedEvent : events[0] || "order.created";
  const payload = SAMPLE_WEBHOOK_PAYLOADS[activeEvent] || {};
  const formattedJson = JSON.stringify(payload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    toast.success("Payload copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-primary" />
          <span className="font-semibold text-foreground">Sample Event Payloads</span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="h-7 text-xs gap-1"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy JSON"}
        </Button>
      </div>

      {/* Event tabs */}
      <div className="flex flex-wrap gap-1.5">
        {events.map((evt) => (
          <Badge
            key={evt}
            variant={activeEvent === evt ? "default" : "outline"}
            className="cursor-pointer text-[10px] font-mono capitalize"
            onClick={() => setSelectedEvent(evt)}
          >
            {evt}
          </Badge>
        ))}
      </div>

      <pre className="p-3 rounded-lg bg-slate-950 text-slate-100 font-mono text-[11px] overflow-x-auto max-h-48 leading-relaxed border border-slate-800">
        <code>{formattedJson}</code>
      </pre>

      <p className="text-[10px] text-muted-foreground">
        All outgoing production webhooks are signed using HMAC SHA-256 with the secret header <code>X-CartX-Signature</code>.
      </p>
    </div>
  );
}

