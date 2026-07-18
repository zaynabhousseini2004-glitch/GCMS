"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { VendorLayout } from "@/components/shared";
import { normalizePhoneInput, validatePhone, PHONE_DIGITS } from "@/lib/validation";
import { Button, Input, Label, Card, Badge, Avatar, AvatarFallback } from "@/components/ui";
import { useVendorProfile, useUpdateVendorProfile } from "@/hooks/mutations/useVendor";
import { useUploadAvatar } from "@/hooks/mutations/useUpload";
import { VendorApprovalStatus } from "@/lib/enums";

const approvalBadge = (s: string) => {
  if (s === VendorApprovalStatus.APPROVED) return "bg-green-50 text-green-700 border-green-200";
  if (s === VendorApprovalStatus.REJECTED) return "bg-red-50 text-red-700 border-red-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
};

export function VendorProfile() {
  const { data, isLoading } = useVendorProfile();
  const updateProfile = useUpdateVendorProfile();
  const uploadAvatar = useUploadAvatar();

  const vendor = data?.vendor;

  const [form, setForm] = useState({ companyName: "", serviceType: "", phone: "" });
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    if (vendor) {
      setForm({
        companyName: vendor.companyName ?? "",
        serviceType: vendor.serviceType ?? "",
        phone: vendor.phone ?? "",
      });
    }
  }, [vendor]);

  const handlePhoneChange = (raw: string) => {
    const normalized = normalizePhoneInput(raw);
    setForm((f) => ({ ...f, phone: normalized }));
    if (phoneError) setPhoneError(validatePhone(normalized) ?? "");
  };

  const handlePhoneFocus = () => {
    if (!form.phone) setForm((f) => ({ ...f, phone: "+961" }));
  };

  const handlePhoneBlur = () => {
    const current = form.phone === "+961" ? "" : form.phone;
    if (form.phone === "+961") setForm((f) => ({ ...f, phone: "" }));
    setPhoneError(validatePhone(current) ?? "");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneErr = validatePhone(form.phone);
    if (phoneErr) { setPhoneError(phoneErr); return; }
    updateProfile.mutate({
      companyName: form.companyName || undefined,
      serviceType: form.serviceType || undefined,
      phone: form.phone || undefined,
    });
  };

  if (isLoading) {
    return (
      <VendorLayout activeSidebarItem="Profile">
        <p className="text-muted-foreground text-center py-12">Loading profile...</p>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout activeSidebarItem="Profile">
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <h3 className="text-2xl font-semibold text-primary">My Profile</h3>

        <Card className="p-6">
          <div className="flex items-start gap-5 mb-6 pb-6 border-b border-border">
            {/* Avatar with upload on click */}
            <label className="relative cursor-pointer group" title="Click to upload photo">
              <div className="relative h-20 w-20 rounded-full overflow-hidden bg-primary/10">
                {(vendor as { avatarUrl?: string | null })?.avatarUrl ? (
                  <Image
                    src={(vendor as { avatarUrl?: string | null })!.avatarUrl!}
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Avatar className="h-20 w-20 text-2xl">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {vendor?.fullName?.slice(0, 2).toUpperCase() ?? "V"}
                    </AvatarFallback>
                  </Avatar>
                )}
                <span className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs">
                  {uploadAvatar.isPending ? "Uploading…" : "Change"}
                </span>
              </div>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadAvatar.mutate(file);
                }}
              />
            </label>
            <div>
              <h4 className="text-xl font-bold text-foreground">{vendor?.fullName}</h4>
              <p className="text-muted-foreground text-sm mb-2">{vendor?.email}</p>
              {vendor?.vendorApprovalStatus && (
                <Badge variant="outline" className={approvalBadge(vendor.vendorApprovalStatus)}>
                  {vendor.vendorApprovalStatus}
                </Badge>
              )}
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input id="company" placeholder="Your company name" value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service">Service Type</Label>
              <Input id="service" placeholder="e.g. Photography, Catering" value={form.serviceType}
                onChange={(e) => setForm({ ...form, serviceType: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+961 XXXXXXXX"
                value={form.phone}
                maxLength={12}
                className={phoneError ? "border-red-400 focus-visible:ring-red-400" : ""}
                onChange={(e) => handlePhoneChange(e.target.value)}
                onFocus={handlePhoneFocus}
                onBlur={handlePhoneBlur}
              />
              {phoneError
                ? <p className="text-xs text-red-600">{phoneError}</p>
                : <p className="text-xs text-muted-foreground">Format: +961 followed by {PHONE_DIGITS} digits</p>
              }
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={updateProfile.isPending}>
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </VendorLayout>
  );
}
