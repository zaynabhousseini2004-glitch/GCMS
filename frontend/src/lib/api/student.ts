import { apiRequest } from "@/lib/api-client";
import type {
  Ceremony,
  DepartmentHead,
  TicketReservation,
  ReserveTicketsRequest,
  Outfit,
  OutfitRental,
  RentOutfitRequest,
  RentMultipleOutfitsRequest,
  StudentReservation,
  MyReservationsResponse,
  StudentDashboardData,
  Notification,
} from "@/lib/api/types";

// ─── Ceremonies ───────────────────────────────────────────────────────────────

/** GET /api/student/dashboard */
export function getStudentDashboard(): Promise<StudentDashboardData> {
  return apiRequest<StudentDashboardData>("/student/dashboard");
}

/** GET /api/student/ceremonies */
export function getCeremonies(): Promise<{ ceremonies: Ceremony[] }> {
  return apiRequest<{ ceremonies: Ceremony[] }>("/student/ceremonies");
}

/** GET /api/student/ceremonies/:id */
export function getCeremonyById(id: number): Promise<{ ceremony: Ceremony }> {
  return apiRequest<{ ceremony: Ceremony }>(`/student/ceremonies/${id}`);
}

// ─── Tickets ──────────────────────────────────────────────────────────────────

/** POST /api/student/tickets — Reserve tickets for a ceremony */
export function reserveTickets(
  body: ReserveTicketsRequest,
): Promise<{ ticket: TicketReservation }> {
  return apiRequest<{ ticket: TicketReservation }>("/student/tickets", {
    method: "POST",
    body,
  });
}

/** GET /api/student/tickets */
export function getMyTickets(): Promise<{ reservations: TicketReservation[] }> {
  return apiRequest<{ reservations: TicketReservation[] }>("/student/tickets");
}

/** GET /api/student/tickets/:id */
export function getTicketById(
  id: number,
): Promise<{ reservation: TicketReservation }> {
  return apiRequest<{ reservation: TicketReservation }>(`/student/tickets/${id}`);
}

/** PATCH /api/student/tickets/:id/cancel */
export function cancelTicket(
  id: number,
): Promise<{ ticket: TicketReservation }> {
  return apiRequest<{ ticket: TicketReservation }>(
    `/student/tickets/${id}/cancel`,
    { method: "PATCH" },
  );
}

// ─── Outfits ──────────────────────────────────────────────────────────────────

/** GET /api/student/outfits */
export function getOutfits(): Promise<{ outfits: Outfit[] }> {
  return apiRequest<{ outfits: Outfit[] }>("/student/outfits");
}

/** GET /api/student/outfits/rentals — My rental history */
export function getMyOutfitRentals(): Promise<{ rentals: OutfitRental[] }> {
  return apiRequest<{ rentals: OutfitRental[] }>("/student/outfits/rentals");
}

/** POST /api/student/outfits/rent */
export function rentOutfit(
  body: RentOutfitRequest,
): Promise<{ rental: OutfitRental }> {
  return apiRequest<{ rental: OutfitRental }>("/student/outfits/rent", {
    method: "POST",
    body,
  });
}

/** POST /api/student/outfits/rent-multiple */
export function rentMultipleOutfits(
  body: RentMultipleOutfitsRequest,
): Promise<{ rentals: OutfitRental[] }> {
  return apiRequest<{ rentals: OutfitRental[] }>("/student/outfits/rent-multiple", {
    method: "POST",
    body,
  });
}

/** PATCH /api/student/outfits/rentals/:id/cancel */
export function cancelOutfitRental(
  id: number,
): Promise<{ rental: OutfitRental }> {
  return apiRequest<{ rental: OutfitRental }>(
    `/student/outfits/rentals/${id}/cancel`,
    { method: "PATCH" },
  );
}

// ─── Reservations ─────────────────────────────────────────────────────────────

/** GET /api/student/reservations — Unified view of all student reservations */
export function getMyReservations(): Promise<MyReservationsResponse> {
  return apiRequest<MyReservationsResponse>("/student/reservations");
}

// ─── Notifications ────────────────────────────────────────────────────────────

/** GET /api/student/notifications */
export function getNotifications(): Promise<{ notifications: Notification[] }> {
  return apiRequest<{ notifications: Notification[] }>(
    "/student/notifications",
  );
}

/** PATCH /api/student/notifications/read-all */
export function markAllNotificationsRead(): Promise<void> {
  return apiRequest<void>("/student/notifications/read-all", {
    method: "PATCH",
  });
}

/** PATCH /api/student/notifications/:id/read */
export function markNotificationRead(id: number): Promise<void> {
  return apiRequest<void>(`/student/notifications/${id}/read`, {
    method: "PATCH",
  });
}

// ─── Department Heads ─────────────────────────────────────────────────────────

/** GET /api/student/department-heads */
export function getDepartmentHeads(): Promise<{ departmentHeads: DepartmentHead[] }> {
  return apiRequest<{ departmentHeads: DepartmentHead[] }>("/student/department-heads");
}
