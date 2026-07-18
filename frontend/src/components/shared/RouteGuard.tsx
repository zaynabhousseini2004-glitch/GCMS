"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserRole, UserStatus } from "@/lib/enums";
import { useAuth } from "@/providers/AuthProvider";

interface RouteGuardProps {
  /** Required role(s) to access this route */
  allowedRole: UserRole | UserRole[];
  /** Where to redirect unauthenticated users. Defaults to /login */
  redirectTo?: string;
  /** Where to redirect authenticated users with the wrong role. Defaults to / */
  forbiddenRedirect?: string;
  children: React.ReactNode;
}

/**
 * Client-side route guard.
 * - Shows nothing while auth state is loading (avoids flash).
 * - Redirects to `redirectTo` when not authenticated.
 * - Redirects to `forbiddenRedirect` when authenticated but wrong role.
 */
export function RouteGuard({
  allowedRole,
  redirectTo = "/login",
  forbiddenRedirect = "/",
  children,
}: RouteGuardProps) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const roles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }
    if (user && user.status === UserStatus.INACTIVE) {
      logout();
      router.replace('/login?reason=inactive');
      return;
    }
    if (user && !roles.includes(user.role)) {
      router.replace(forbiddenRedirect);
    }
  }, [isLoading, isAuthenticated, user, router, redirectTo, forbiddenRedirect]); // eslint-disable-line react-hooks/exhaustive-deps

  // While loading or about to redirect – render nothing
  if (isLoading) return null;
  if (!isAuthenticated) return null;
  if (user && user.status === UserStatus.INACTIVE) return null;
  if (user && !roles.includes(user.role)) return null;

  return <>{children}</>;
}

/**
 * Inverse guard: redirect already-authenticated users away from auth pages.
 */
export function GuestGuard({
  children,
  redirectTo,
}: {
  children: React.ReactNode;
  /** Where authenticated users land. Falls back to their role's home. */
  redirectTo?: string;
}) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;
    const dest =
      redirectTo ?? roleHome(user.role, user.campusId ?? undefined);
    router.replace(dest);
  }, [isLoading, isAuthenticated, user, router, redirectTo]);

  if (isLoading) return null;
  if (isAuthenticated) return null;
  return <>{children}</>;
}

function roleHome(role: UserRole, campusId?: number): string {
  if (role === UserRole.SUPERADMIN) return "/superadmin/dashboard";
  // If no campus selected yet, send to campus-selection
  if (!campusId) return "/campus-selection";
  switch (role) {
    case UserRole.ADMIN:
      return `/admin/${campusId}/dashboard`;
    case UserRole.STUDENT:
      return `/student/${campusId}/dashboard`;
    case UserRole.VENDOR:
      return `/vendor/${campusId}/dashboard`;
    default:
      return "/campus-selection";
  }
}
