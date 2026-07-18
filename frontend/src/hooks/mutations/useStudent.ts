"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { studentApi } from "@/lib/api";
import type { ReserveTicketsRequest, RentOutfitRequest, RentMultipleOutfitsRequest } from "@/lib/api/types";

// ─── Query keys ───────────────────────────────────────────────────────────────

export const studentKeys = {
  dashboard: ["student", "dashboard"] as const,
  ceremonies: ["student", "ceremonies"] as const,
  ceremony: (id: number) => ["student", "ceremonies", id] as const,
  tickets: ["student", "tickets"] as const,
  ticket: (id: number) => ["student", "tickets", id] as const,
  outfits: ["student", "outfits"] as const,
  reservations: ["student", "reservations"] as const,
  notifications: ["student", "notifications"] as const,
  departmentHeads: ["student", "department-heads"] as const,
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

export function useStudentDashboard() {
  return useQuery({
    queryKey: studentKeys.dashboard,
    queryFn: studentApi.getStudentDashboard,
  });
}

// ─── Ceremonies ───────────────────────────────────────────────────────────────

export function useStudentCeremonies() {
  return useQuery({
    queryKey: studentKeys.ceremonies,
    queryFn: studentApi.getCeremonies,
  });
}

export function useStudentCeremonyById(id: number) {
  return useQuery({
    queryKey: studentKeys.ceremony(id),
    queryFn: () => studentApi.getCeremonyById(id),
    enabled: !!id,
  });
}

// ─── Tickets ──────────────────────────────────────────────────────────────────

export function useMyTickets() {
  return useQuery({
    queryKey: studentKeys.tickets,
    queryFn: studentApi.getMyTickets,
  });
}

export function useMyTicketById(id: number) {
  return useQuery({
    queryKey: studentKeys.ticket(id),
    queryFn: () => studentApi.getTicketById(id),
    enabled: !!id,
  });
}

/** Mutation: reserve tickets for a ceremony */
export function useReserveTickets() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ReserveTicketsRequest) =>
      studentApi.reserveTickets(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: studentKeys.tickets });
      qc.invalidateQueries({ queryKey: studentKeys.reservations });
    },
  });
}

/** Mutation: cancel a ticket reservation */
export function useCancelMyTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => studentApi.cancelTicket(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: studentKeys.tickets });
      qc.invalidateQueries({ queryKey: studentKeys.reservations });
    },
  });
}

// ─── Outfits ──────────────────────────────────────────────────────────────────

export function useStudentOutfits() {
  return useQuery({
    queryKey: studentKeys.outfits,
    queryFn: studentApi.getOutfits,
  });
}

export function useMyOutfitRentals() {
  return useQuery({
    queryKey: [...studentKeys.outfits, "rentals"],
    queryFn: studentApi.getMyOutfitRentals,
  });
}

/** Mutation: rent an outfit */
export function useRentOutfit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: RentOutfitRequest) => studentApi.rentOutfit(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: studentKeys.outfits });
      qc.invalidateQueries({ queryKey: studentKeys.reservations });
    },
  });
}

/** Mutation: rent multiple outfits */
export function useRentMultipleOutfits() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: RentMultipleOutfitsRequest) => studentApi.rentMultipleOutfits(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: studentKeys.outfits });
      qc.invalidateQueries({ queryKey: studentKeys.reservations });
    },
  });
}

/** Mutation: cancel an outfit rental */
export function useCancelOutfitRental() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => studentApi.cancelOutfitRental(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: studentKeys.outfits });
      qc.invalidateQueries({ queryKey: studentKeys.reservations });
    },
  });
}

// ─── Reservations ─────────────────────────────────────────────────────────────

export function useMyReservations() {
  return useQuery({
    queryKey: studentKeys.reservations,
    queryFn: studentApi.getMyReservations,
  });
}

// ─── Notifications ────────────────────────────────────────────────────────────

export function useStudentNotifications() {
  return useQuery({
    queryKey: studentKeys.notifications,
    queryFn: studentApi.getNotifications,
  });
}

/** Mutation: mark a single notification as read */
export function useMarkStudentNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => studentApi.markNotificationRead(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: studentKeys.notifications }),
  });
}

/** Mutation: mark all notifications as read */
export function useMarkAllStudentNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => studentApi.markAllNotificationsRead(),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: studentKeys.notifications }),
  });
}

// ─── Department Heads ─────────────────────────────────────────────────────────

export function useStudentDepartmentHeads() {
  return useQuery({
    queryKey: studentKeys.departmentHeads,
    queryFn: studentApi.getDepartmentHeads,
  });
}
