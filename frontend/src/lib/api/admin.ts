import { apiRequest } from "@/lib/api-client";
import type {
  AdminDashboard,
  Student,
  StudentDetail,
  UpdateEligibilityRequest,
  Ceremony,
  CreateCeremonyRequest,
  UpdateCeremonyRequest,
  TicketReservation,
  SetTicketPriceRequest,
  Outfit,
  CreateOutfitRequest,
  UpdateOutfitRequest,
  OutfitRental,
  Seat,
  CeremonyTicketReservation,
  CreateSeatsRequest,
  AssignSeatRequest,
  Vendor,
  VendorDetail,
  CreateVendorRequestPayload,
  ServiceOffering,
  CreateServiceOfferingRequest,
  UpdateServiceOfferingRequest,
  Instruction,
  CreateInstructionRequest,
  UpdateInstructionRequest,
  DepartmentHead,
  CreateDepartmentHeadRequest,
  UpdateDepartmentHeadRequest,
  DepartmentTitle,
  QrScanRequest,
  QrScanResult,
  ChatRoom,
  ChatMessage,
  CreateChatRoomRequest,
  SendMessageRequest,
  Notification,
  SendNotificationRequest,
} from "@/lib/api/types";

// ─── Dashboard ────────────────────────────────────────────────────────────────

/** GET /api/admin/dashboard */
export function getDashboard(): Promise<AdminDashboard> {
  return apiRequest<AdminDashboard>("/admin/dashboard");
}

// ─── Students ─────────────────────────────────────────────────────────────────

/** GET /api/admin/students */
export function getStudents(): Promise<{ students: Student[] }> {
  return apiRequest<{ students: Student[] }>("/admin/students");
}

/** GET /api/admin/students/:id */
export function getStudentById(id: number): Promise<{ student: StudentDetail }> {
  return apiRequest<{ student: StudentDetail }>(`/admin/students/${id}`);
}

/** PATCH /api/admin/students/:id/eligibility */
export function updateStudentEligibility(
  id: number,
  body: UpdateEligibilityRequest,
): Promise<{ student: Student }> {
  return apiRequest<{ student: Student }>(
    `/admin/students/${id}/eligibility`,
    { method: "PATCH", body },
  );
}

// ─── Ceremonies ───────────────────────────────────────────────────────────────

/** POST /api/admin/ceremonies */
export function createCeremony(
  body: CreateCeremonyRequest,
): Promise<{ ceremony: Ceremony }> {
  return apiRequest<{ ceremony: Ceremony }>("/admin/ceremonies", {
    method: "POST",
    body,
  });
}

/** GET /api/admin/ceremonies */
export function getCeremonies(): Promise<{ ceremonies: Ceremony[] }> {
  return apiRequest<{ ceremonies: Ceremony[] }>("/admin/ceremonies");
}

/** GET /api/admin/ceremonies/:id */
export function getCeremonyById(id: number): Promise<{ ceremony: Ceremony }> {
  return apiRequest<{ ceremony: Ceremony }>(`/admin/ceremonies/${id}`);
}

/** PATCH /api/admin/ceremonies/:id */
export function updateCeremony(
  id: number,
  body: UpdateCeremonyRequest,
): Promise<{ ceremony: Ceremony }> {
  return apiRequest<{ ceremony: Ceremony }>(`/admin/ceremonies/${id}`, {
    method: "PATCH",
    body,
  });
}

/** PATCH /api/admin/ceremonies/:id/cancel */
export function cancelCeremony(id: number): Promise<{ ceremony: Ceremony }> {
  return apiRequest<{ ceremony: Ceremony }>(`/admin/ceremonies/${id}/cancel`, {
    method: "PATCH",
  });
}

/** PATCH /api/admin/ceremonies/:id/restore */
export function restoreCeremony(id: number): Promise<{ ceremony: Ceremony }> {
  return apiRequest<{ ceremony: Ceremony }>(`/admin/ceremonies/${id}/restore`, {
    method: "PATCH",
  });
}

// ─── Tickets ──────────────────────────────────────────────────────────────────

/** GET /api/admin/tickets */
export function getTickets(): Promise<{ reservations: TicketReservation[] }> {
  return apiRequest<{ reservations: TicketReservation[] }>("/admin/tickets");
}

/** GET /api/admin/tickets/:id */
export function getTicketById(
  id: number,
): Promise<{ ticket: TicketReservation }> {
  return apiRequest<{ ticket: TicketReservation }>(`/admin/tickets/${id}`);
}

/** PATCH /api/admin/tickets/:id/confirm */
export function confirmTicket(
  id: number,
): Promise<{ ticket: TicketReservation }> {
  return apiRequest<{ ticket: TicketReservation }>(
    `/admin/tickets/${id}/confirm`,
    { method: "PATCH" },
  );
}

/** PATCH /api/admin/tickets/:id/cancel */
export function cancelTicket(
  id: number,
): Promise<{ ticket: TicketReservation }> {
  return apiRequest<{ ticket: TicketReservation }>(
    `/admin/tickets/${id}/cancel`,
    { method: "PATCH" },
  );
}

/** PATCH /api/admin/tickets/:id/restore */
export function restoreTicket(
  id: number,
): Promise<{ reservation: TicketReservation }> {
  return apiRequest<{ reservation: TicketReservation }>(
    `/admin/tickets/${id}/restore`,
    { method: "PATCH" },
  );
}

/** PATCH /api/admin/ceremonies/:ceremonyId/ticket-price */
export function setTicketPrice(
  ceremonyId: number,
  body: SetTicketPriceRequest,
): Promise<{ ceremony: Ceremony }> {
  return apiRequest<{ ceremony: Ceremony }>(
    `/admin/ceremonies/${ceremonyId}/ticket-price`,
    { method: "PATCH", body },
  );
}

// ─── Outfits ──────────────────────────────────────────────────────────────────

/** POST /api/admin/outfits */
export function createOutfit(
  body: CreateOutfitRequest,
): Promise<{ outfit: Outfit }> {
  return apiRequest<{ outfit: Outfit }>("/admin/outfits", {
    method: "POST",
    body,
  });
}

/** GET /api/admin/outfits */
export function getOutfits(): Promise<{ outfits: Outfit[] }> {
  return apiRequest<{ outfits: Outfit[] }>("/admin/outfits");
}

/** PATCH /api/admin/outfits/:id */
export function updateOutfit(
  id: number,
  body: UpdateOutfitRequest,
): Promise<{ outfit: Outfit }> {
  return apiRequest<{ outfit: Outfit }>(`/admin/outfits/${id}`, {
    method: "PATCH",
    body,
  });
}

/** DELETE /api/admin/outfits/:id */
export function deleteOutfit(id: number): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/admin/outfits/${id}`, {
    method: "DELETE",
  });
}

/** GET /api/admin/outfits/rentals */
export function getOutfitRentals(): Promise<{ rentals: OutfitRental[] }> {
  return apiRequest<{ rentals: OutfitRental[] }>("/admin/outfits/rentals");
}

/** PATCH /api/admin/outfits/rentals/:id/approve */
export function approveOutfitRental(
  id: number,
): Promise<{ rental: OutfitRental }> {
  return apiRequest<{ rental: OutfitRental }>(
    `/admin/outfits/rentals/${id}/approve`,
    { method: "PATCH" },
  );
}

/** PATCH /api/admin/outfits/rentals/:id/reject */
export function rejectOutfitRental(
  id: number,
): Promise<{ rental: OutfitRental }> {
  return apiRequest<{ rental: OutfitRental }>(
    `/admin/outfits/rentals/${id}/reject`,
    { method: "PATCH" },
  );
}

/** PATCH /api/admin/outfits/rentals/:id/pickup */
export function markRentalPickedUp(id: number): Promise<{ rental: OutfitRental }> {
  return apiRequest<{ rental: OutfitRental }>(
    `/admin/outfits/rentals/${id}/pickup`,
    { method: "PATCH" },
  );
}

/** PATCH /api/admin/outfits/rentals/:id/return */
export function markRentalReturned(id: number): Promise<{ rental: OutfitRental }> {
  return apiRequest<{ rental: OutfitRental }>(
    `/admin/outfits/rentals/${id}/return`,
    { method: "PATCH" },
  );
}

// ─── Seating ──────────────────────────────────────────────────────────────────

/** POST /api/admin/ceremonies/:ceremonyId/seats */
export function createSeats(
  ceremonyId: number,
  body: CreateSeatsRequest,
): Promise<{ seats: Seat[] }> {
  return apiRequest<{ seats: Seat[] }>(
    `/admin/ceremonies/${ceremonyId}/seats`,
    { method: "POST", body },
  );
}

/** GET /api/admin/ceremonies/:ceremonyId/seats */
export function getSeats(ceremonyId: number): Promise<{ seats: Seat[]; ticketReservations: CeremonyTicketReservation[] }> {
  return apiRequest<{ seats: Seat[]; ticketReservations: CeremonyTicketReservation[] }>(
    `/admin/ceremonies/${ceremonyId}/seats`,
  );
}

/** POST /api/admin/ceremonies/:ceremonyId/seats/assign */
export function assignSeat(
  ceremonyId: number,
  body: AssignSeatRequest,
): Promise<{ seat: Seat }> {
  return apiRequest<{ seat: Seat }>(
    `/admin/ceremonies/${ceremonyId}/seats/assign`,
    { method: "POST", body },
  );
}

/** DELETE /api/admin/ceremonies/:ceremonyId/seats/assign/:id */
export function removeSeatAssignment(
  ceremonyId: number,
  id: number,
): Promise<void> {
  return apiRequest<void>(
    `/admin/ceremonies/${ceremonyId}/seats/assign/${id}`,
    { method: "DELETE" },
  );
}

// ─── Vendors ──────────────────────────────────────────────────────────────────

/** GET /api/admin/vendors */
export function getVendors(): Promise<{ vendors: Vendor[] }> {
  return apiRequest<{ vendors: Vendor[] }>("/admin/vendors");
}

/** GET /api/admin/vendors/:id */
export function getVendorById(id: number): Promise<{ vendor: VendorDetail }> {
  return apiRequest<{ vendor: VendorDetail }>(`/admin/vendors/${id}`);
}

/** PATCH /api/admin/vendors/:id/approve */
export function approveVendor(id: number): Promise<{ vendor: Vendor }> {
  return apiRequest<{ vendor: Vendor }>(`/admin/vendors/${id}/approve`, {
    method: "PATCH",
  });
}

/** PATCH /api/admin/vendors/:id/reject */
export function rejectVendor(id: number): Promise<{ vendor: Vendor }> {
  return apiRequest<{ vendor: Vendor }>(`/admin/vendors/${id}/reject`, {
    method: "PATCH",
  });
}

/** POST /api/admin/vendors/requests */
export function createVendorRequest(
  body: CreateVendorRequestPayload,
): Promise<void> {
  return apiRequest<void>("/admin/vendors/requests", {
    method: "POST",
    body,
  });
}

/** GET /api/admin/vendors/requests */
export function getVendorRequests(): Promise<{ requests: unknown[] }> {
  return apiRequest<{ requests: unknown[] }>("/admin/vendors/requests");
}

// ─── Service Offerings ────────────────────────────────────────────────────────

/** POST /api/admin/ceremonies/:id/services */
export function createServiceOffering(
  ceremonyId: number,
  body: CreateServiceOfferingRequest,
): Promise<{ service: ServiceOffering }> {
  return apiRequest<{ service: ServiceOffering }>(
    `/admin/ceremonies/${ceremonyId}/services`,
    { method: "POST", body },
  );
}

/** GET /api/admin/ceremonies/:id/services */
export function getServiceOfferings(
  ceremonyId: number,
): Promise<{ services: ServiceOffering[] }> {
  return apiRequest<{ services: ServiceOffering[] }>(
    `/admin/ceremonies/${ceremonyId}/services`,
  );
}

/** PATCH /api/admin/services/:serviceId */
export function updateServiceOffering(
  serviceId: number,
  body: UpdateServiceOfferingRequest,
): Promise<{ service: ServiceOffering }> {
  return apiRequest<{ service: ServiceOffering }>(
    `/admin/services/${serviceId}`,
    { method: "PATCH", body },
  );
}

/** DELETE /api/admin/services/:serviceId */
export function deleteServiceOffering(serviceId: number): Promise<void> {
  return apiRequest<void>(`/admin/services/${serviceId}`, {
    method: "DELETE",
  });
}

// ─── Instructions ─────────────────────────────────────────────────────────────

/** POST /api/admin/instructions */
export function createInstruction(
  body: CreateInstructionRequest,
): Promise<{ instruction: Instruction }> {
  return apiRequest<{ instruction: Instruction }>("/admin/instructions", {
    method: "POST",
    body,
  });
}

/** GET /api/admin/ceremonies/:ceremonyId/instructions */
export function getInstructions(
  ceremonyId: number,
): Promise<{ instructions: Instruction[] }> {
  return apiRequest<{ instructions: Instruction[] }>(
    `/admin/ceremonies/${ceremonyId}/instructions`,
  );
}

/** PATCH /api/admin/instructions/:id */
export function updateInstruction(
  id: number,
  body: UpdateInstructionRequest,
): Promise<{ instruction: Instruction }> {
  return apiRequest<{ instruction: Instruction }>(
    `/admin/instructions/${id}`,
    { method: "PATCH", body },
  );
}

/** DELETE /api/admin/instructions/:id */
export function deleteInstruction(id: number): Promise<void> {
  return apiRequest<void>(`/admin/instructions/${id}`, { method: "DELETE" });
}

// ─── Department Heads ─────────────────────────────────────────────────────────

/** POST /api/admin/department-heads */
export function createDepartmentHead(
  body: CreateDepartmentHeadRequest,
): Promise<{ departmentHead: DepartmentHead }> {
  return apiRequest<{ departmentHead: DepartmentHead }>(
    "/admin/department-heads",
    { method: "POST", body },
  );
}

/** GET /api/admin/department-heads */
export function getDepartmentHeads(): Promise<{
  departmentHeads: DepartmentHead[];
}> {
  return apiRequest<{ departmentHeads: DepartmentHead[] }>(
    "/admin/department-heads",
  );
}

/** PATCH /api/admin/department-heads/:id */
export function updateDepartmentHead(
  id: number,
  body: UpdateDepartmentHeadRequest,
): Promise<{ departmentHead: DepartmentHead }> {
  return apiRequest<{ departmentHead: DepartmentHead }>(
    `/admin/department-heads/${id}`,
    { method: "PATCH", body },
  );
}

/** DELETE /api/admin/department-heads/:id */
export function deleteDepartmentHead(id: number): Promise<void> {
  return apiRequest<void>(`/admin/department-heads/${id}`, {
    method: "DELETE",
  });
}

// ─── QR Scan ──────────────────────────────────────────────────────────────────

/** POST /api/admin/qr-scan */
export function scanQrCode(body: QrScanRequest): Promise<QrScanResult> {
  return apiRequest<QrScanResult>("/admin/qr-scan", {
    method: "POST",
    body,
  });
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

/** GET /api/admin/chat/rooms */
export function getChatRooms(): Promise<{ rooms: ChatRoom[] }> {
  return apiRequest<{ rooms: ChatRoom[] }>("/admin/chat/rooms");
}

/** POST /api/admin/chat/rooms */
export function createChatRoom(
  body: CreateChatRoomRequest,
): Promise<{ room: ChatRoom }> {
  return apiRequest<{ room: ChatRoom }>("/admin/chat/rooms", {
    method: "POST",
    body: { vendorId: body.userId },
  });
}

/** GET /api/admin/chat/rooms/:id/messages */
export function getChatMessages(
  roomId: number,
): Promise<{ messages: ChatMessage[] }> {
  return apiRequest<{ messages: ChatMessage[] }>(
    `/admin/chat/rooms/${roomId}/messages`,
  );
}

/** POST /api/admin/chat/rooms/:id/messages */
export function sendChatMessage(
  roomId: number,
  body: SendMessageRequest,
): Promise<{ message: ChatMessage }> {
  return apiRequest<{ message: ChatMessage }>(
    `/admin/chat/rooms/${roomId}/messages`,
    { method: "POST", body },
  );
}

// ─── Notifications ────────────────────────────────────────────────────────────

/** POST /api/admin/notifications */
export function sendNotification(
  body: SendNotificationRequest,
): Promise<{ notification: Notification }> {
  return apiRequest<{ notification: Notification }>("/admin/notifications", {
    method: "POST",
    body,
  });
}

/** GET /api/admin/notifications */
export function getNotifications(): Promise<{ notifications: Notification[] }> {
  return apiRequest<{ notifications: Notification[] }>("/admin/notifications");
}

// ─── Department Titles (read-only) ───────────────────────────────────────────

/** GET /api/admin/department-titles */
export function getDepartmentTitles(): Promise<{ departmentTitles: DepartmentTitle[] }> {
  return apiRequest<{ departmentTitles: DepartmentTitle[] }>("/admin/department-titles");
}
