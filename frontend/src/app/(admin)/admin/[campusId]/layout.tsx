"use client";

import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";

export default function AdminCampusLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ campusId: string }>;
}) {
  const { campusId } = use(params);
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || !user) return;

    // Cached user has no campus — admin was removed from their campus.
    // Clear session and send them to login so they get a fresh JWT if re-assigned.
    if (!user.campusId) {
      logout();
      router.replace('/login?reason=no-campus');
      return;
    }

    // Cached campusId doesn't match the URL — redirect to their assigned campus.
    if (String(user.campusId) !== campusId) {
      router.replace(`/admin/${user.campusId}/home`);
    }
  }, [isLoading, user, campusId, router, logout]);

  if (isLoading) return null;
  if (!user?.campusId) return null;
  if (String(user.campusId) !== campusId) return null;

  return <>{children}</>;
}
