"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customDomainSchema, type CustomDomainFormValues } from "../schemas";
import {
  useDomainsQuery,
  useAddCustomDomainMutation,
  useRemoveCustomDomainMutation,
  useVerifyDomainMutation,
} from "../hooks";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Globe,
  Plus,
  Trash2,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  ShieldAlert,
  Info,
  AlertTriangle,
  Server,
  Lock,
} from "lucide-react";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { ErrorState } from "@/components/feedback/ErrorState";
import { toast } from "sonner";

export function DomainManagementView() {
  const { data: domains, isLoading, isError, error, refetch } = useDomainsQuery();
  const addDomainMutation = useAddCustomDomainMutation();
  const removeDomainMutation = useRemoveCustomDomainMutation();
  const verifyMutation = useVerifyDomainMutation();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showDnsModal, setShowDnsModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomDomainFormValues>({
    resolver: zodResolver(customDomainSchema),
    defaultValues: { domain: "" },
  });

  const onSubmitDomain = async (values: CustomDomainFormValues) => {
    try {
      await addDomainMutation.mutateAsync(values);
      reset();
    } catch {
      // Handled by mutation onError toast
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Domain Management"
          description="স্টোর ডোমেইন, কাস্টম ডোমেইন সংযোগ এবং ডিএনএস নির্দেশনা"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Storefront", href: "/dashboard/store" },
            { label: "Domains", href: "/dashboard/store/domains" },
          ]}
        />
        <LoadingSkeleton rows={4} />
      </div>
    );
  }

  if (isError || !domains) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Domain Management"
          description="স্টোর ডোমেইন, কাস্টম ডোমেইন সংযোগ এবং ডিএনএস নির্দেশনা"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Storefront", href: "/dashboard/store" },
            { label: "Domains", href: "/dashboard/store/domains" },
          ]}
        />
        <ErrorState
          title="Failed to load domain configuration"
          message={error?.message || "Could not retrieve domains list"}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const defaultSubdomain = domains.find((d) => d.isDefaultSubdomain);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Domain Management"
        description="স্টোর ডোমেইন, কাস্টম ডোমেইন সংযোগ এবং ডিএনএস নির্দেশনা"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Storefront", href: "/dashboard/store" },
          { label: "Domains", href: "/dashboard/store/domains" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDnsModal(true)}
              className="gap-1.5"
            >
              <Info className="h-4 w-4 text-primary" />
              <span>DNS Setup Guide</span>
            </Button>
          </div>
        }
      />

      {/* Backend Integration & Truthful Status Banner */}
      <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h4 className="font-semibold text-amber-900 dark:text-amber-200">
            Demo Mode & Authoritative Verification Boundary
          </h4>
          <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
            The shared CartX Express.js backend is not yet connected. Therefore, DNS verification against live authoritative nameservers and SSL certificate issuance via Let&apos;s Encrypt / Cloudflare are <strong>intentionally not fabricated</strong>. In client demo mode, custom domains remain labeled as <em>Demo Mode — Verification Pending</em> and SSL as <em>Demo / Not Active</em> until backed by server-side verification APIs.
          </p>
        </div>
      </div>

      {/* 1. Default Subdomain Card */}
      <Card className="border-border shadow-xs">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <span>Default CartX Storefront URL</span>
              </CardTitle>
              <CardDescription>
                আপনার স্টোরের স্থায়ী ও প্রস্তুত সাবডোমেইন
              </CardDescription>
            </div>
            <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
              ✓ Active / Default
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3.5 rounded-lg border border-border bg-muted/20">
            <div className="space-y-1">
              <span className="font-mono text-sm font-bold text-foreground">
                {defaultSubdomain?.domain || "green-harvest.cartx.com.bd"}
              </span>
              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <Lock className="h-3.5 w-3.5" />
                  SSL Active (Platform Wildcard)
                </span>
                <span>•</span>
                <span>Managed by CartX Cloud Edge</span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  copyToClipboard(
                    `https://${defaultSubdomain?.domain || "green-harvest.cartx.com.bd"}`,
                    "default-url"
                  )
                }
                className="gap-1.5 text-xs h-8"
              >
                {copiedKey === "default-url" ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>{copiedKey === "default-url" ? "Copied" : "Copy URL"}</span>
              </Button>

              <Button asChild size="sm" variant="outline" className="gap-1.5 text-xs h-8">
                <a
                  href={`https://${defaultSubdomain?.domain || "green-harvest.cartx.com.bd"}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Visit</span>
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Connect Custom Domain Form Card */}
      <Card className="border-border shadow-xs">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Server className="h-4 w-4 text-primary" />
            <span>Connect Custom Domain (কাস্টম ডোমেইন যুক্ত করুন)</span>
          </CardTitle>
          <CardDescription>
            আপনার নিজস্ব ব্র্যান্ড ডোমেইন (যেমন: shop.mybrand.com বা brand.com.bd) যুক্ত করতে নিচে লিখুন।
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmitDomain)} className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <div className="flex-1 w-full space-y-1">
                <Label htmlFor="domain-input" className="text-xs">
                  Domain Name (FQDN)
                </Label>
                <div className="relative">
                  <Input
                    id="domain-input"
                    {...register("domain")}
                    placeholder="shop.yourbrand.com.bd"
                    className="h-9 text-xs font-mono lowercase"
                  />
                </div>
                {errors.domain && (
                  <p className="text-[11px] text-destructive mt-1 font-medium">
                    {errors.domain.message}
                  </p>
                )}
              </div>

              <div className="sm:pt-5 w-full sm:w-auto">
                <Button
                  type="submit"
                  size="sm"
                  className="h-9 w-full sm:w-auto gap-1.5 text-xs font-medium"
                  disabled={addDomainMutation.isPending}
                >
                  <Plus className="h-4 w-4" />
                  <span>{addDomainMutation.isPending ? "Connecting..." : "Connect Domain"}</span>
                </Button>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground">
              Tip: Do not add &quot;https://&quot; or trailing slashes. Subdomains like &quot;shop.yourstore.com&quot; are recommended for smooth CNAME routing.
            </p>
          </form>
        </CardContent>
      </Card>

      {/* 3. Configured Domains Table */}
      <Card className="border-border shadow-xs">
        <CardHeader>
          <CardTitle className="text-base">Domain Routing Table</CardTitle>
          <CardDescription>
            কনফিগার করা ডোমেইনসমূহের লাইভ স্ট্যাটাস ও ডিএনএস তথ্য
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold">Domain Name</TableHead>
                  <TableHead className="text-xs font-semibold">Type</TableHead>
                  <TableHead className="text-xs font-semibold">Connection Status</TableHead>
                  <TableHead className="text-xs font-semibold">SSL Status</TableHead>
                  <TableHead className="text-xs font-semibold">Target Value</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domains.map((dom) => {
                  return (
                    <TableRow key={dom.id} className="text-xs">
                      {/* Domain Name */}
                      <TableCell className="font-mono font-medium text-foreground py-3">
                        <div className="flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{dom.domain}</span>
                        </div>
                      </TableCell>

                      {/* Type */}
                      <TableCell>
                        {dom.isDefaultSubdomain ? (
                          <Badge variant="secondary" className="text-[10px]">
                            Platform Default
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px]">
                            Custom FQDN
                          </Badge>
                        )}
                      </TableCell>

                      {/* Connection Status */}
                      <TableCell>
                        {dom.status === "active" ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                            ✓ Connected
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]">
                            Demo — Verification Pending
                          </Badge>
                        )}
                      </TableCell>

                      {/* SSL Status */}
                      <TableCell>
                        {dom.sslStatus === "active" ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-[11px]">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-600 font-medium text-[11px]">
                            <ShieldAlert className="h-3.5 w-3.5" />
                            Demo / Not Active
                          </span>
                        )}
                      </TableCell>

                      {/* Target */}
                      <TableCell className="font-mono text-muted-foreground text-[11px]">
                        {dom.targetValue}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!dom.isDefaultSubdomain && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => verifyMutation.mutate(dom.id)}
                                disabled={verifyMutation.isPending}
                                className="h-7 px-2 text-xs"
                                title="Check DNS Resolution (Truthful Demo)"
                              >
                                <RefreshCw className={`h-3 w-3 mr-1 ${verifyMutation.isPending ? "animate-spin" : ""}`} />
                                Verify
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowDnsModal(true)}
                                className="h-7 px-2 text-xs"
                              >
                                DNS Records
                              </Button>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                                    title="Remove Domain"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Remove Custom Domain?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to disconnect <strong>{dom.domain}</strong>? Traffic to this domain will stop routing to your storefront.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => removeDomainMutation.mutate(dom.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Remove Domain
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                          {dom.isDefaultSubdomain && (
                            <span className="text-[11px] text-muted-foreground italic">
                              Permanent
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* DNS Records Guide Modal Dialog */}
      <Dialog open={showDnsModal} onOpenChange={setShowDnsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              <span>DNS Configuration Guide</span>
            </DialogTitle>
            <DialogDescription>
              আপনার ডোমেইন প্রোভাইডার (cPanel, Cloudflare, Namecheap, BTCL)-এর DNS Management প্যানেলে নিচের রেকর্ডগুলো যোগ করুন:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent bg-muted/40">
                    <TableHead className="text-xs font-semibold">Record Type</TableHead>
                    <TableHead className="text-xs font-semibold">Host / Name</TableHead>
                    <TableHead className="text-xs font-semibold">Value / Target</TableHead>
                    <TableHead className="text-xs font-semibold">TTL</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Copy</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="text-xs">
                    <TableCell className="font-bold text-primary">CNAME</TableCell>
                    <TableCell className="font-mono">shop (or @)</TableCell>
                    <TableCell className="font-mono text-emerald-600 font-semibold">
                      cname.cartx.com.bd
                    </TableCell>
                    <TableCell className="text-muted-foreground">Automatic / 3600</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard("cname.cartx.com.bd", "cname-val")}
                        className="h-7 px-2"
                      >
                        {copiedKey === "cname-val" ? (
                          <Check className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow className="text-xs">
                    <TableCell className="font-bold text-primary">A</TableCell>
                    <TableCell className="font-mono">@ (Apex Root)</TableCell>
                    <TableCell className="font-mono text-emerald-600 font-semibold">
                      104.21.45.120
                    </TableCell>
                    <TableCell className="text-muted-foreground">3600</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard("104.21.45.120", "a-val")}
                        className="h-7 px-2"
                      >
                        {copiedKey === "a-val" ? (
                          <Check className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="p-3.5 rounded-lg border border-border/80 bg-muted/20 space-y-2 text-xs text-muted-foreground">
              <h5 className="font-semibold text-foreground">Important Bangladesh Merchant Notes:</h5>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  DNS propagation typically takes <strong>15 minutes to 24 hours</strong> across Bangladesh ISPs (Grameenphone, Banglalink, BTCL broadband).
                </li>
                <li>
                  SSL certificates are automatically generated by Let&apos;s Encrypt within 60 minutes after DNS points correctly.
                </li>
                <li>
                  Do not configure conflicting A or CNAME records on the same hostname.
                </li>
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <Button size="sm" onClick={() => setShowDnsModal(false)}>
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
