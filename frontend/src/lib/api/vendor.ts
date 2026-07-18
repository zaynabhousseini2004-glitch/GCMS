import { apiRequest } from "@/lib/api-client";
import type {
  VendorRequest,
  UpdateVendorRequestPayload,
  CampusAdmin,
  ChatRoom,
  ChatMessage,
  CreateChatRoomRequest,
  SendMessageRequest,
  VendorProfile,
  UpdateVendorProfileRequest,
  Notification,
} from "@/lib/api/types";

// ─── Requests ─────────────────────────────────────────────────────────────────

/** GET /api/vendor/requests */
export function getMyRequests(): Promise<{ requests: VendorRequest[] }> {
  return apiRequest<{ requests: VendorRequest[] }>("/vendor/requests");
}

/** GET /api/vendor/requests/:id */
export function getMyRequestById(
  id: number,
): Promise<{ request: VendorRequest }> {
  return apiRequest<{ request: VendorRequest }>(`/vendor/requests/${id}`);
}

/** PATCH /api/vendor/requests/:id — Update request status */
export function updateRequestStatus(
  id: number,
  body: UpdateVendorRequestPayload,
): Promise<{ request: VendorRequest }> {
  return apiRequest<{ request: VendorRequest }>(`/vendor/requests/${id}`, {
    method: "PATCH",
    body,
  });
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

/** GET /api/vendor/chat/admins — all active admins on the vendor's campus */
export function getCampusAdmins(): Promise<{ admins: CampusAdmin[] }> {
  return apiRequest<{ admins: CampusAdmin[] }>("/vendor/chat/admins");
}

/** GET /api/vendor/chat/rooms */
export function getChatRooms(): Promise<{ rooms: ChatRoom[] }> {
  return apiRequest<{ rooms: ChatRoom[] }>("/vendor/chat/rooms");
}

/** POST /api/vendor/chat/rooms */
export function createChatRoom(
  body: CreateChatRoomRequest,
): Promise<{ room: ChatRoom }> {
  return apiRequest<{ room: ChatRoom }>("/vendor/chat/rooms", {
    method: "POST",
    body,
  });
}

/** GET /api/vendor/chat/rooms/:id/messages */
export function getChatMessages(
  roomId: number,
): Promise<{ messages: ChatMessage[] }> {
  return apiRequest<{ messages: ChatMessage[] }>(
    `/vendor/chat/rooms/${roomId}/messages`,
  );
}

/** POST /api/vendor/chat/rooms/:id/messages */
export function sendChatMessage(
  roomId: number,
  body: SendMessageRequest,
): Promise<{ message: ChatMessage }> {
  return apiRequest<{ message: ChatMessage }>(
    `/vendor/chat/rooms/${roomId}/messages`,
    { method: "POST", body },
  );
}

// ─── Profile ──────────────────────────────────────────────────────────────────

/** GET /api/vendor/profile */
export function getProfile(): Promise<{ vendor: VendorProfile }> {
  return apiRequest<{ vendor: VendorProfile }>("/vendor/profile");
}

/** PATCH /api/vendor/profile */
export function updateProfile(
  body: UpdateVendorProfileRequest,
): Promise<{ vendor: VendorProfile }> {
  return apiRequest<{ vendor: VendorProfile }>("/vendor/profile", {
    method: "PATCH",
    body,
  });
}

// ─── Notifications ────────────────────────────────────────────────────────────

/** GET /api/vendor/notifications */
export function getNotifications(): Promise<{ notifications: Notification[] }> {
  return apiRequest<{ notifications: Notification[] }>(
    "/vendor/notifications",
  );
}

/** PATCH /api/vendor/notifications/read-all */
export function markAllNotificationsRead(): Promise<void> {
  return apiRequest<void>("/vendor/notifications/read-all", {
    method: "PATCH",
  });
}

/** PATCH /api/vendor/notifications/:id/read */
export function markNotificationRead(id: number): Promise<void> {
  return apiRequest<void>(`/vendor/notifications/${id}/read`, {
    method: "PATCH",
  });
}
