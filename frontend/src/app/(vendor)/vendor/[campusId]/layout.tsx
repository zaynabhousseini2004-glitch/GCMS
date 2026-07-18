"use client";
"use client";

import { use, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useVendorProfile } from "@/hooks/mutations/useVendor";
import { vendorRoutes } from "@/lib/routes";

export default function VendorCampusLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ campusId: string }>;
}) {
  const { campusId } = use(params);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { data: profileData, isLoading: profileLoading } = useVendorProfile();

  const isPendingPage = pathname === `/vendor/${campusId}/pending`;
  const approvalStatus =
    profileData?.vendor?.vendorApprovalStatus ?? user?.vendorApprovalStatus;
  const isApproved = approvalStatus === "APPROVED";

  useEffect(() => {
    if (isLoading || profileLoading) return;
    if (isApproved && isPendingPage) {
      router.replace(vendorRoutes(campusId).dashboard);
    } else if (!isApproved && !isPendingPage) {
      router.replace(vendorRoutes(campusId).pending);
    }
  }, [isLoading, profileLoading, isApproved, isPendingPage, campusId, router]);

  // Block render until we know approval status
  if (isLoading || profileLoading) return null;

  // Non-approved on a protected page — block render while redirecting
  if (!isApproved && !isPendingPage) return null;

  // Approved on pending page — block render while redirecting
  if (isApproved && isPendingPage) return null;

  return <>{children}</>;
}
