"use client";

import { Bell, MessageSquare, LogOut, QrCode } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLogout } from "@/hooks/mutations/useAuth";
import { useAuth } from "@/providers/AuthProvider";
import { UserRole } from "@/lib/enums";
import { usePublicCampuses } from "@/hooks/mutations/usePublic";

function CampusBadge() {
  const { user } = useAuth();
  const { data } = usePublicCampuses();

  if (!user) return null;

  if (user.role === UserRole.SUPERADMIN) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-400 text-amber-950 select-none">
        Super Admin — All Campuses
      </span>
    );
  }

  if (!user.campusId) return null;

  const campus = data?.campuses.find((c) => c.id === user.campusId);
  if (!campus) return null;

  const roleLabel =
    user.role === UserRole.ADMIN
      ? "Admin"
      : user.role === UserRole.STUDENT
      ? "Student"
      : user.role === UserRole.VENDOR
      ? "Vendor"
      : null;

  if (!roleLabel) return null;

  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-400 text-amber-950 select-none">
      {roleLabel} of {campus.name} Campus
    </span>
  );
}

export function DashboardHeader() {
  const router = useRouter();
  const logout = useLogout();
  const { user } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const role = user?.role;
  const campusId = user?.campusId;

  const hasChatPage = role === UserRole.ADMIN || role === UserRole.VENDOR;
  const hasBellPage = role === UserRole.ADMIN || role === UserRole.STUDENT;
  const hasQrScan = role === UserRole.ADMIN;

  const chatHref =
    role === UserRole.ADMIN
      ? `/admin/${campusId}/chat`
      : `/vendor/${campusId}/chat`;

  const bellHref =
    role === UserRole.ADMIN
      ? `/admin/${campusId}/notifications`
      : `/student/${campusId}/notifications`;

  const qrScanHref = `/admin/${campusId}/qr-scan`;

  return (
    <header className="h-16 w-full bg-primary text-primary-foreground flex items-center justify-between px-6 sticky top-0 z-50 shadow-md">
      {/* Left: logos */}
      <div className="flex items-center gap-3">
        <Image
          src="/liulogo.png"
          alt="LIU Logo"
          width={40}
          height={40}
          className="object-contain"
        />
        <div className="w-px h-8 bg-primary-foreground/30" />
        <Image
          src="/GCMS_logo.png"
          alt="GCMS Logo"
          width={40}
          height={40}
          className="object-contain"
        />
      </div>

      {/* Center: campus badge */}
      <div className="flex-1 flex items-center justify-center">
        <CampusBadge />
      </div>

      {/* Right: actions */}
      <div className="flex items-center space-x-3">
        {hasChatPage && (
          <button
            onClick={() => router.push(chatHref)}
            className="relative p-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        )}
        {hasQrScan && (
          <button
            onClick={() => router.push(qrScanHref)}
            className="relative p-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            title="QR Scanner"
          >
            <QrCode className="w-5 h-5" />
          </button>
        )}
        {hasBellPage && (
          <button
            onClick={() => router.push(bellHref)}
            className="relative p-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            <Bell className="w-5 h-5" />
          </button>
        )}
        <div className="pl-3 border-l border-primary-foreground/20 flex items-center">
          <button
            onClick={handleLogout}
            className="flex items-center text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            <LogOut className="w-4 h-4 mr-1.5" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
