"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storeSettingsSchema, type StoreSettingsFormValues } from "../schemas";
import { useCurrentStore, useUpdateStore } from "../hooks";
import { BANGLADESH_DISTRICTS, BUSINESS_CATEGORIES } from "@/config/bangladesh";
import { PermissionGuard } from "@/components/shared/PermissionGuard";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Store,
  MapPin,
  Mail,
  Globe,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";

export function StoreSettingsView() {
  const { data: store, isLoading, isError, error, refetch } = useCurrentStore();
  const updateMutation = useUpdateStore();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<StoreSettingsFormValues>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      businessCategory: "clothing_fashion",
      businessAddress: "",
      district: "Dhaka",
      cityArea: "",
      postalCode: "",
      tradeLicenseNo: "",
      ownerName: "",
      contactEmail: "",
      contactPhone: "",
      currency: "BDT",
      locale: "bn-BD",
      timezone: "Asia/Dhaka",
    },
  });

  // Populate form with store data when loaded
  useEffect(() => {
    if (store) {
      reset({
        name: store.name || "",
        slug: store.slug || "",
        description: store.description || "",
        businessCategory: store.businessCategory || "clothing_fashion",
        businessAddress: store.businessAddress || "",
        district: store.district || "Dhaka",
        cityArea: store.cityArea || "",
        postalCode: store.postalCode || "",
        tradeLicenseNo: store.tradeLicenseNo || "",
        ownerName: store.ownerName || "",
        contactEmail: store.contactEmail || "",
        contactPhone: store.contactPhone || "",
        currency: store.currency || "BDT",
        locale: store.locale || "bn-BD",
        timezone: store.timezone || "Asia/Dhaka",
      });
    }
  }, [store, reset]);

  const onSubmit = async (values: StoreSettingsFormValues) => {
    try {
      setSaveSuccess(false);
      await updateMutation.mutateAsync(values);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch {
      // Handled by updateMutation.isError
    }
  };

  const handleReset = () => {
    if (store) {
      reset();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Store Settings"
          description="Manage store identity, location, contacts, and locale preferences."
          breadcrumbs={[{ label: "Settings", href: "/dashboard/settings" }]}
        />
        <LoadingSkeleton rows={6} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Store Settings"
          description="Manage store identity, location, contacts, and locale preferences."
          breadcrumbs={[{ label: "Settings", href: "/dashboard/settings" }]}
        />
        <ErrorState
          title="Failed to load store settings"
          message={
            error instanceof Error
              ? error.message
              : "Unable to retrieve store profile from the shared Express API."
          }
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <PermissionGuard
      permission="settings.manage"
      showAccessDenied
    >
      <div className="space-y-6">
        <PageHeader
          title="Store Settings"
          description="Manage store identity, location, contacts, and locale preferences."
          breadcrumbs={[{ label: "Settings", href: "/dashboard/settings" }]}
          actions={
            <div className="flex items-center gap-2">
              {store?.slug && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`https://${store.slug}.cartx.com.bd`}
                    target="_blank"
                    rel="noreferrer"
                    className="gap-1.5"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View Storefront
                  </a>
                </Button>
              )}
            </div>
          }
        />

        {/* Feedback Alerts */}
        {saveSuccess && (
          <div className="flex items-center gap-2 p-3 text-sm text-success rounded-lg bg-success/10 border border-success/20">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Store settings successfully updated and persisted on backend!</span>
          </div>
        )}

        {updateMutation.isError && (
          <div className="flex items-center gap-2 p-3 text-sm text-destructive rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>
              {updateMutation.error instanceof Error
                ? updateMutation.error.message
                : "Failed to update store settings. Please try again."}
            </span>
          </div>
        )}

        {/* Store Status Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-foreground">{store?.name || "CartX Store"}</h3>
                <Badge
                  variant={store?.status === "active" ? "success" : "secondary"}
                  className="text-[10px] capitalize"
                >
                  {store?.status?.replace(/_/g, " ") || "Draft"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                {store?.slug ? `${store.slug}.cartx.com.bd` : "Subdomain unconfigured"}
              </p>
            </div>
          </div>

          {isDirty && (
            <Badge variant="warning" className="text-xs">
              Unsaved Changes
            </Badge>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
              <TabsTrigger value="profile" className="gap-2">
                <Store className="h-4 w-4" />
                <span className="truncate">Store Profile</span>
              </TabsTrigger>
              <TabsTrigger value="business" className="gap-2">
                <MapPin className="h-4 w-4" />
                <span className="truncate">Business Details</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="gap-2">
                <Mail className="h-4 w-4" />
                <span className="truncate">Contact Info</span>
              </TabsTrigger>
              <TabsTrigger value="locale" className="gap-2">
                <Globe className="h-4 w-4" />
                <span className="truncate">Currency & Locale</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: Store Profile */}
            <TabsContent value="profile">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base">Store Profile</CardTitle>
                  <CardDescription>
                    Public identity and presentation of your storefront.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Store Name (দোকানের নাম) *</Label>
                    <Input id="name" {...register("name")} />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="slug">Subdomain Slug (সাবডোমেইন) *</Label>
                    <div className="flex rounded-md shadow-sm">
                      <Input
                        id="slug"
                        className="rounded-r-none font-mono text-sm lowercase"
                        {...register("slug")}
                      />
                      <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-input bg-muted text-muted-foreground text-xs font-mono">
                        .cartx.com.bd
                      </span>
                    </div>
                    {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="description">Store Description (বিবরণ) *</Label>
                    <Textarea
                      id="description"
                      rows={3}
                      {...register("description")}
                    />
                    {errors.description && (
                      <p className="text-xs text-destructive">{errors.description.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 2: Business Information */}
            <TabsContent value="business">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base">Business Information</CardTitle>
                  <CardDescription>
                    Physical business presence, registration, and retail category.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="businessCategory">Business Category *</Label>
                    <select
                      id="businessCategory"
                      {...register("businessCategory")}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      {BUSINESS_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id} className="bg-card text-foreground">
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="businessAddress">Physical Business Address *</Label>
                    <Textarea id="businessAddress" rows={2} {...register("businessAddress")} />
                    {errors.businessAddress && (
                      <p className="text-xs text-destructive">{errors.businessAddress.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="district">District (জেলা) *</Label>
                      <select
                        id="district"
                        {...register("district")}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        {BANGLADESH_DISTRICTS.map((d) => (
                          <option key={d} value={d} className="bg-card text-foreground">
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="cityArea">City / Area *</Label>
                      <Input id="cityArea" {...register("cityArea")} />
                      {errors.cityArea && (
                        <p className="text-xs text-destructive">{errors.cityArea.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input id="postalCode" {...register("postalCode")} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="tradeLicenseNo">Trade License / BIN Number (Optional)</Label>
                    <Input id="tradeLicenseNo" {...register("tradeLicenseNo")} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 3: Contact Details */}
            <TabsContent value="contact">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base">Store Contact Details</CardTitle>
                  <CardDescription>
                    Official email and telephone numbers for notifications and customer receipts.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="ownerName">Owner Name (মালিকের নাম) *</Label>
                    <Input id="ownerName" {...register("ownerName")} />
                    {errors.ownerName && (
                      <p className="text-xs text-destructive">{errors.ownerName.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="contactEmail">Contact Email *</Label>
                      <Input id="contactEmail" type="email" {...register("contactEmail")} />
                      {errors.contactEmail && (
                        <p className="text-xs text-destructive">{errors.contactEmail.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="contactPhone">Mobile Number *</Label>
                      <Input id="contactPhone" {...register("contactPhone")} />
                      {errors.contactPhone && (
                        <p className="text-xs text-destructive">{errors.contactPhone.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 4: Currency & Locale */}
            <TabsContent value="locale">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base">Currency & Regional Settings</CardTitle>
                  <CardDescription>
                    Primary currency and formatting parameters (CARTX_MERCHANT_DASHBOARD.md Section 1).
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="currency">Primary Currency</Label>
                      <Input
                        id="currency"
                        disabled
                        value="BDT (৳) — Bangladeshi Taka"
                        className="bg-muted text-foreground cursor-not-allowed"
                      />
                      <p className="text-[11px] text-muted-foreground">Default primary currency for Bangladesh.</p>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="locale">Primary Language / Locale</Label>
                      <select
                        id="locale"
                        {...register("locale")}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="bn-BD" className="bg-card text-foreground">বাংলা (Bangladesh)</option>
                        <option value="en-US" className="bg-card text-foreground">English (United States)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="timezone">Time Zone</Label>
                      <select
                        id="timezone"
                        {...register("timezone")}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="Asia/Dhaka" className="bg-card text-foreground">Asia/Dhaka (GMT+6)</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-border mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={!isDirty || updateMutation.isPending}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Discard Changes
            </Button>

            <Button
              type="submit"
              disabled={!isDirty || updateMutation.isPending}
              className="gap-2"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Settings...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </PermissionGuard>
  );
}

