"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { vendorApi } from "@/lib/api";
import type {
  UpdateVendorRequestPayload,
  CampusAdmin,
  CreateChatRoomRequest,
  SendMessageRequest,
  UpdateVendorProfileRequest,
} from "@/lib/api/types";

// ─── Query keys ───────────────────────────────────────────────────────────────

export const vendorKeys = {
  requests: ["vendor", "requests"] as const,
  request: (id: number) => ["vendor", "requests", id] as const,
  campusAdmins: ["vendor", "chat", "admins"] as const,
  chatRooms: ["vendor", "chat", "rooms"] as const,
  chatMessages: (roomId: number) =>
    ["vendor", "chat", "rooms", roomId, "messages"] as const,
  profile: ["vendor", "profile"] as const,
  notifications: ["vendor", "notifications"] as const,
};

// ─── Requests ─────────────────────────────────────────────────────────────────

export function useMyVendorRequests() {
  return useQuery({
    queryKey: vendorKeys.requests,
    queryFn: vendorApi.getMyRequests,
  });
}

export function useMyVendorRequestById(id: number) {
  return useQuery({
    queryKey: vendorKeys.request(id),
    queryFn: () => vendorApi.getMyRequestById(id),
    enabled: !!id,
  });
}

/** Mutation: update the status of a vendor service request */
export function useUpdateVendorRequestStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: UpdateVendorRequestPayload;
    }) => vendorApi.updateRequestStatus(id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: vendorKeys.requests });
      qc.invalidateQueries({ queryKey: vendorKeys.request(id) });
    },
  });
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export function useVendorCampusAdmins() {
  return useQuery({
    queryKey: vendorKeys.campusAdmins,
    queryFn: vendorApi.getCampusAdmins,
    select: (data: { admins: CampusAdmin[] }) => data.admins,
  });
}

export function useVendorChatRooms() {
  return useQuery({
    queryKey: vendorKeys.chatRooms,
    queryFn: vendorApi.getChatRooms,
  });
}

export function useVendorChatMessages(roomId: number) {
  return useQuery({
    queryKey: vendorKeys.chatMessages(roomId),
    queryFn: () => vendorApi.getChatMessages(roomId),
    enabled: !!roomId,
  });
}

/** Mutation: open or retrieve a chat room with an admin */
export function useVendorCreateChatRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateChatRoomRequest) => vendorApi.createChatRoom(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: vendorKeys.chatRooms }),
  });
}

/** Mutation: send a message in a chat room */
export function useVendorSendChatMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      roomId,
      body,
    }: {
      roomId: number;
      body: SendMessageRequest;
    }) => vendorApi.sendChatMessage(roomId, body),
    onSuccess: (_, { roomId }) =>
      qc.invalidateQueries({ queryKey: vendorKeys.chatMessages(roomId) }),
  });
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export function useVendorProfile() {
  return useQuery({
    queryKey: vendorKeys.profile,
    queryFn: vendorApi.getProfile,
  });
}

/** Mutation: update the vendor's own profile */
export function useUpdateVendorProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateVendorProfileRequest) =>
      vendorApi.updateProfile(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: vendorKeys.profile }),
  });
}

// ─── Notifications ────────────────────────────────────────────────────────────

export function useVendorNotifications() {
  return useQuery({
    queryKey: vendorKeys.notifications,
    queryFn: vendorApi.getNotifications,
  });
}

/** Mutation: mark a single notification as read */
export function useMarkVendorNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => vendorApi.markNotificationRead(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: vendorKeys.notifications }),
  });
}

/** Mutation: mark all notifications as read */
export function useMarkAllVendorNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => vendorApi.markAllNotificationsRead(),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: vendorKeys.notifications }),
  });
}
