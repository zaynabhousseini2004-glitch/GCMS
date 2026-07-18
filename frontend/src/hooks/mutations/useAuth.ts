"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import type { LoginRequest, RegisterRequest } from "@/lib/api/types";

// ─── Register ─────────────────────────────────────────────────────────────────

/**
 * Mutation: register a new STUDENT or VENDOR account.
 * On success the token + user are stored via AuthProvider automatically.
 */
export function useRegister() {
  const { login } = useAuth();
  return useMutation({
    mutationFn: (body: RegisterRequest) => authApi.register(body),
    onSuccess: (data) => login(data.token, data.user),
  });
}

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * Mutation: authenticate with email + password.
 * On success the token + user are stored via AuthProvider automatically.
 */
export function useLogin() {
  const { login } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: LoginRequest) => authApi.login(body),
    onSuccess: (data) => {
      login(data.token, data.user);
      queryClient.clear(); // clear stale data from previous session
    },
  });
}

// ─── Logout ───────────────────────────────────────────────────────────────────

/**
 * Returns the `logout` function from AuthProvider.
 * Clears token + user from sessionStorage and resets React Query cache.
 */
export function useLogout() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  return () => {
    logout();
    queryClient.clear();
  };
}

// ─── Get own profile ──────────────────────────────────────────────────────────

export function useMyProfile() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authApi.getMe(),
    select: (data) => data.user as import("@/lib/api/auth").UserProfile,
  });
}

// ─── Update own profile ───────────────────────────────────────────────────────

export function useUpdateMyProfile() {
  const { login, user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.updateMyProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], data);
      // Update the auth user in sessionStorage so sidebar/header reflects the new name
      const token = sessionStorage.getItem("token");
      if (token && user) {
        login(token, { ...user, fullName: data.user.fullName });
      }
    },
  });
}

// ─── Change password ──────────────────────────────────────────────────────────

export function useChangePassword() {
  return useMutation({
    mutationFn: authApi.changePassword,
  });
}
