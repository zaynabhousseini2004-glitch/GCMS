"use client";

import { useState, useEffect, type ReactNode } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import {
  Button,
  Input,
  Label,
  Card,
  Avatar,
  AvatarFallback,
} from "@/components/ui";
import { useMyProfile, useUpdateMyProfile, useChangePassword } from "@/hooks/mutations/useAuth";
import { useUploadAvatar } from "@/hooks/mutations/useUpload";
import {
  normalizePhoneInput,
  validatePhone,
  validatePassword,
  PASSWORD_LENGTH,
  PHONE_DIGITS,
} from "@/lib/validation";

interface ProfilePageProps {
  Layout: (props: { children: ReactNode; activeSidebarItem?: string }) => ReactNode;
}

export function ProfilePage({ Layout }: ProfilePageProps) {
  const { data: profile, isLoading } = useMyProfile();
  const updateProfile = useUpdateMyProfile();
  const changePasswordMutation = useChangePassword();
  const uploadAvatar = useUploadAvatar();

  const [form, setForm] = useState({ fullName: "", phone: "" });
  const [phoneError, setPhoneError] = useState("");

  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.fullName ?? "",
        phone: profile.phone ?? "",
      });
    }
  }, [profile]);

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
      fullName: form.fullName || undefined,
      phone: form.phone || undefined,
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    const pwErr = validatePassword(pwForm.newPassword);
    if (pwErr) { setPwError(pwErr); return; }

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }

    changePasswordMutation.mutate(
      { oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword },
      {
        onSuccess: () => {
          setPwSuccess("Password changed successfully.");
          setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
        },
        onError: (err: unknown) => {
          const msg =
            err && typeof err === "object" && "message" in err
              ? (err as { message: string }).message
              : "Failed to change password.";
          setPwError(msg);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <Layout activeSidebarItem="Profile">
        <p className="text-muted-foreground text-center py-12">Loading profile…</p>
      </Layout>
    );
  }

  const initials = profile?.fullName?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <Layout activeSidebarItem="Profile">
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <h3 className="text-2xl font-semibold text-primary">My Profile</h3>

        {/* Profile info card */}
        <Card className="p-6">
          <div className="flex items-start gap-5 mb-6 pb-6 border-b border-border">
            <label className="relative cursor-pointer group" title="Click to upload photo">
              <div className="relative h-20 w-20 rounded-full overflow-hidden bg-primary/10">
                {profile?.avatarUrl ? (
                  <Image src={profile.avatarUrl} alt="Avatar" fill className="object-cover" />
                ) : (
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                )}
                <span className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs rounded-full">
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
              <h4 className="text-xl font-bold text-foreground">{profile?.fullName}</h4>
              <p className="text-muted-foreground text-sm">{profile?.email}</p>
              <p className="text-xs text-muted-foreground/60 mt-1 capitalize">{profile?.role?.toLowerCase()}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Your full name"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={profile?.email ?? ""} readOnly className="bg-muted/40 cursor-not-allowed" />
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
            {updateProfile.isSuccess && <p className="text-sm text-green-600">Profile updated successfully.</p>}
            {updateProfile.isError && <p className="text-sm text-destructive">Failed to update profile.</p>}
            <div className="flex justify-end pt-2">
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Change password card */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-1">Change Password</h4>
          <p className="text-xs text-muted-foreground mb-4">
            Password must contain exactly {PASSWORD_LENGTH} characters.
          </p>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {/* Current password */}
            <div className="space-y-2">
              <Label htmlFor="oldPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="oldPassword"
                  type={showOld ? "text" : "password"}
                  placeholder="Enter current password"
                  value={pwForm.oldPassword}
                  maxLength={PASSWORD_LENGTH}
                  className="pr-10"
                  onChange={(e) => setPwForm({ ...pwForm, oldPassword: e.target.value })}
                  required
                />
                <button type="button" onClick={() => setShowOld(!showOld)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground focus:outline-none">
                  {showOld ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  placeholder={`Exactly ${PASSWORD_LENGTH} characters`}
                  value={pwForm.newPassword}
                  maxLength={PASSWORD_LENGTH}
                  className={`pr-10 ${pwError ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                  onChange={(e) => {
                    setPwForm({ ...pwForm, newPassword: e.target.value });
                    if (pwError) setPwError("");
                  }}
                  required
                />
                <button type="button" onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground focus:outline-none">
                  {showNew ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm new password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat new password"
                  value={pwForm.confirmPassword}
                  maxLength={PASSWORD_LENGTH}
                  className={`pr-10 ${pwError ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                  onChange={(e) => {
                    setPwForm({ ...pwForm, confirmPassword: e.target.value });
                    if (pwError) setPwError("");
                  }}
                  required
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground focus:outline-none">
                  {showConfirm ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {pwError && <p className="text-sm text-destructive">{pwError}</p>}
            {pwSuccess && <p className="text-sm text-green-600">{pwSuccess}</p>}
            <div className="flex justify-end pt-2">
              <Button type="submit" variant="outline" disabled={changePasswordMutation.isPending}>
                {changePasswordMutation.isPending ? "Changing…" : "Change Password"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
