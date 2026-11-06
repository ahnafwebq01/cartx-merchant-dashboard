"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User as UserIcon, Mail, Phone, Camera } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional().or(z.literal("")),
  avatarUrl: z.string().url("Please enter a valid image URL").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileSettings() {
  const { user, currentRole, updateProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "Demo Merchant Admin",
      email: user?.email || "demo@cartx.example.com",
      phone: user?.phone || "+880 1700-000000",
      avatarUrl: user?.avatarUrl || "",
    },
  });

  const avatarUrl = watch("avatarUrl");
  const userName = watch("name");

  const onSubmit = async (values: ProfileFormValues) => {
    setIsSaving(true);
    try {
      await updateProfile(values);
      toast.success("Profile updated successfully", {
        description: "Your merchant administrator information has been saved.",
      });
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const AVATAR_PRESETS = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  ];

  return (
    <Card className="border-border/70 bg-card/80 backdrop-blur-md">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold">Merchant Profile</CardTitle>
            <CardDescription className="text-xs">
              Manage your personal administrator identity and contact details.
            </CardDescription>
          </div>
          <Badge variant="outline" className="w-fit text-xs font-mono capitalize">
            Role: {currentRole || "Owner"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl border border-border/60 bg-muted/30">
            <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-xs">
              <AvatarImage src={avatarUrl || user?.avatarUrl} alt={userName} />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-lg">
                {userName ? userName.slice(0, 2).toUpperCase() : "CX"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <h4 className="text-sm font-semibold text-foreground">{userName || "Merchant Administrator"}</h4>
              <p className="text-xs text-muted-foreground">Select an avatar preset or provide a custom image URL.</p>
              <div className="flex items-center gap-2 pt-1 justify-center sm:justify-start">
                {AVATAR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setValue("avatarUrl", preset, { shouldDirty: true })}
                    className="h-7 w-7 rounded-full overflow-hidden border border-border hover:border-primary transition-all cursor-pointer hover:scale-110"
                    title={`Avatar Preset ${idx + 1}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preset} alt={`Preset ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-medium text-foreground">
                Display Name *
              </Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="name" className="pl-9 bg-background/60" {...register("name")} />
              </div>
              {errors.name && <p className="text-[11px] text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-foreground">
                Email Address *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" className="pl-9 bg-background/60" {...register("email")} />
              </div>
              {errors.email && <p className="text-[11px] text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-medium text-foreground">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="phone" className="pl-9 bg-background/60" {...register("phone")} />
              </div>
              {errors.phone && <p className="text-[11px] text-destructive">{errors.phone.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="avatarUrl" className="text-xs font-medium text-foreground">
                Avatar Image URL
              </Label>
              <div className="relative">
                <Camera className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="avatarUrl" placeholder="https://..." className="pl-9 bg-background/60" {...register("avatarUrl")} />
              </div>
              {errors.avatarUrl && <p className="text-[11px] text-destructive">{errors.avatarUrl.message}</p>}
            </div>
          </div>

          <div className="flex flex-col-reverse xs:flex-row items-stretch xs:items-center justify-between gap-3 pt-2 border-t border-border/60">
            {isDirty ? (
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Unsaved changes</span>
            ) : (
              <span className="text-xs text-muted-foreground">Information synced locally</span>
            )}
            <Button type="submit" size="sm" disabled={isSaving || !isDirty} className="cursor-pointer justify-center">
              {isSaving ? "Saving..." : "Save Profile Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default ProfileSettings;
