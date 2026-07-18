"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import type {
  CreateCeremonyRequest,
  UpdateCeremonyRequest,
  SetTicketPriceRequest,
  CreateOutfitRequest,
  UpdateOutfitRequest,
  CreateSeatsRequest,
  AssignSeatRequest,
  CreateVendorRequestPayload,
  CreateServiceOfferingRequest,
  UpdateServiceOfferingRequest,
  CreateInstructionRequest,
  UpdateInstructionRequest,
  CreateDepartmentHeadRequest,
  UpdateDepartmentHeadRequest,
  QrScanRequest,
  CreateChatRoomRequest,
  SendMessageRequest,
  SendNotificationRequest,
  UpdateEligibilityRequest,
  AdminDashboard,
} from "@/lib/api/types";

// ─── Query keys ───────────────────────────────────────────────────────────────

export const adminKeys = {
  dashboard: ["admin", "dashboard"] as const,
  students: ["admin", "students"] as const,
  student: (id: number) => ["admin", "students", id] as const,
  ceremonies: ["admin", "ceremonies"] as const,
  ceremony: (id: number) => ["admin", "ceremonies", id] as const,
  tickets: ["admin", "tickets"] as const,
  ticket: (id: number) => ["admin", "tickets", id] as const,
  outfits: ["admin", "outfits"] as const,
  outfitRentals: ["admin", "outfits", "rentals"] as const,
  seats: (ceremonyId: number) => ["admin", "ceremonies", ceremonyId, "seats"] as const,
  vendors: ["admin", "vendors"] as const,
  vendor: (id: number) => ["admin", "vendors", id] as const,
  vendorRequests: ["admin", "vendors", "requests"] as const,
  services: (ceremonyId: number) => ["admin", "ceremonies", ceremonyId, "services"] as const,
  instructions: (ceremonyId: number) => ["admin", "ceremonies", ceremonyId, "instructions"] as const,
  departmentHeads: ["admin", "department-heads"] as const,
  departmentTitles: ["admin", "department-titles"] as const,
  chatRooms: ["admin", "chat", "rooms"] as const,
  chatMessages: (roomId: number) => ["admin", "chat", "rooms", roomId, "messages"] as const,
  notifications: ["admin", "notifications"] as const,
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

export function useAdminDashboard() {
  return useQuery<AdminDashboard>({
    queryKey: adminKeys.dashboard,
    queryFn: adminApi.getDashboard,
  });
}

// ─── Students ─────────────────────────────────────────────────────────────────

export function useAdminStudents() {
  return useQuery({
    queryKey: adminKeys.students,
    queryFn: adminApi.getStudents,
  });
}

export function useAdminStudentById(id: number) {
  return useQuery({
    queryKey: adminKeys.student(id),
    queryFn: () => adminApi.getStudentById(id),
    enabled: !!id,
  });
}

export function useUpdateStudentEligibility() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateEligibilityRequest }) =>
      adminApi.updateStudentEligibility(id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: adminKeys.students });
      qc.invalidateQueries({ queryKey: adminKeys.student(id) });
    },
  });
}

// ─── Ceremonies ───────────────────────────────────────────────────────────────

export function useAdminCeremonies() {
  return useQuery({
    queryKey: adminKeys.ceremonies,
    queryFn: adminApi.getCeremonies,
  });
}

export function useAdminCeremonyById(id: number) {
  return useQuery({
    queryKey: adminKeys.ceremony(id),
    queryFn: () => adminApi.getCeremonyById(id),
    enabled: !!id,
  });
}

export function useCreateCeremony() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateCeremonyRequest) => adminApi.createCeremony(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.ceremonies }),
  });
}

export function useUpdateCeremony() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateCeremonyRequest }) =>
      adminApi.updateCeremony(id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: adminKeys.ceremonies });
      qc.invalidateQueries({ queryKey: adminKeys.ceremony(id) });
    },
  });
}

export function useCancelCeremony() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.cancelCeremony(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: adminKeys.ceremonies });
      qc.invalidateQueries({ queryKey: adminKeys.ceremony(id) });
    },
  });
}

export function useRestoreCeremony() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      adminApi.updateCeremony(id, { status: "UPCOMING" }),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: adminKeys.ceremonies });
      qc.invalidateQueries({ queryKey: adminKeys.ceremony(id) });
    },
  });
}

// ─── Tickets ──────────────────────────────────────────────────────────────────

export function useAdminTickets() {
  return useQuery({
    queryKey: adminKeys.tickets,
    queryFn: adminApi.getTickets,
  });
}

export function useAdminTicketById(id: number) {
  return useQuery({
    queryKey: adminKeys.ticket(id),
    queryFn: () => adminApi.getTicketById(id),
    enabled: !!id,
  });
}

export function useConfirmTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.confirmTicket(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.tickets }),
  });
}

export function useCancelTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.cancelTicket(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.tickets }),
  });
}

export function useRestoreTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.restoreTicket(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.tickets }),
  });
}

export function useSetTicketPrice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      ceremonyId,
      body,
    }: {
      ceremonyId: number;
      body: SetTicketPriceRequest;
    }) => adminApi.setTicketPrice(ceremonyId, body),
    onSuccess: (_, { ceremonyId }) => {
      qc.invalidateQueries({ queryKey: adminKeys.ceremony(ceremonyId) });
      qc.invalidateQueries({ queryKey: adminKeys.ceremonies });
    },
  });
}

// ─── Outfits ──────────────────────────────────────────────────────────────────

export function useAdminOutfits() {
  return useQuery({
    queryKey: adminKeys.outfits,
    queryFn: adminApi.getOutfits,
  });
}

export function useAdminOutfitRentals() {
  return useQuery({
    queryKey: adminKeys.outfitRentals,
    queryFn: adminApi.getOutfitRentals,
  });
}

export function useCreateOutfit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateOutfitRequest) => adminApi.createOutfit(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.outfits }),
  });
}

export function useUpdateOutfit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateOutfitRequest }) =>
      adminApi.updateOutfit(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.outfits }),
  });
}

export function useDeleteOutfit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.deleteOutfit(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.outfits }),
  });
}

export function useApproveOutfitRental() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.approveOutfitRental(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.outfitRentals });
      qc.invalidateQueries({ queryKey: adminKeys.outfits });
    },
  });
}

export function useRejectOutfitRental() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.rejectOutfitRental(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: adminKeys.outfitRentals }),
  });
}

export function useMarkRentalPickedUp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.markRentalPickedUp(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.outfitRentals }),
  });
}

export function useMarkRentalReturned() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.markRentalReturned(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminKeys.outfitRentals });
      qc.invalidateQueries({ queryKey: adminKeys.outfits });
    },
  });
}

// ─── Seating ──────────────────────────────────────────────────────────────────

export function useAdminSeats(ceremonyId: number) {
  return useQuery({
    queryKey: adminKeys.seats(ceremonyId),
    queryFn: () => adminApi.getSeats(ceremonyId),
    enabled: !!ceremonyId,
  });
}

export function useCreateSeats() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      ceremonyId,
      body,
    }: {
      ceremonyId: number;
      body: CreateSeatsRequest;
    }) => adminApi.createSeats(ceremonyId, body),
    onSuccess: (_, { ceremonyId }) =>
      qc.invalidateQueries({ queryKey: adminKeys.seats(ceremonyId) }),
  });
}

export function useAssignSeat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      ceremonyId,
      body,
    }: {
      ceremonyId: number;
      body: AssignSeatRequest;
    }) => adminApi.assignSeat(ceremonyId, body),
    onSuccess: (_, { ceremonyId }) =>
      qc.invalidateQueries({ queryKey: adminKeys.seats(ceremonyId) }),
  });
}

export function useRemoveSeatAssignment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ceremonyId, id }: { ceremonyId: number; id: number }) =>
      adminApi.removeSeatAssignment(ceremonyId, id),
    onSuccess: (_, { ceremonyId }) =>
      qc.invalidateQueries({ queryKey: adminKeys.seats(ceremonyId) }),
  });
}

// ─── Vendors ──────────────────────────────────────────────────────────────────

export function useAdminVendors() {
  return useQuery({
    queryKey: adminKeys.vendors,
    queryFn: adminApi.getVendors,
  });
}

export function useAdminVendorById(id: number) {
  return useQuery({
    queryKey: adminKeys.vendor(id),
    queryFn: () => adminApi.getVendorById(id),
    enabled: !!id,
  });
}

export function useAdminVendorRequests() {
  return useQuery({
    queryKey: adminKeys.vendorRequests,
    queryFn: adminApi.getVendorRequests,
  });
}

export function useApproveVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.approveVendor(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.vendors }),
  });
}

export function useRejectVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.rejectVendor(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.vendors }),
  });
}

export function useCreateVendorRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateVendorRequestPayload) =>
      adminApi.createVendorRequest(body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: adminKeys.vendorRequests }),
  });
}

// ─── Service Offerings ────────────────────────────────────────────────────────

export function useAdminServiceOfferings(ceremonyId: number) {
  return useQuery({
    queryKey: adminKeys.services(ceremonyId),
    queryFn: () => adminApi.getServiceOfferings(ceremonyId),
    enabled: !!ceremonyId,
  });
}

export function useCreateServiceOffering() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      ceremonyId,
      body,
    }: {
      ceremonyId: number;
      body: CreateServiceOfferingRequest;
    }) => adminApi.createServiceOffering(ceremonyId, body),
    onSuccess: (_, { ceremonyId }) =>
      qc.invalidateQueries({ queryKey: adminKeys.services(ceremonyId) }),
  });
}

export function useUpdateServiceOffering() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      serviceId,
      body,
    }: {
      serviceId: number;
      body: UpdateServiceOfferingRequest;
      ceremonyId: number;
    }) => adminApi.updateServiceOffering(serviceId, body),
    onSuccess: (_, { ceremonyId }) =>
      qc.invalidateQueries({ queryKey: adminKeys.services(ceremonyId) }),
  });
}

export function useDeleteServiceOffering() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      serviceId,
    }: {
      serviceId: number;
      ceremonyId: number;
    }) => adminApi.deleteServiceOffering(serviceId),
    onSuccess: (_, { ceremonyId }) =>
      qc.invalidateQueries({ queryKey: adminKeys.services(ceremonyId) }),
  });
}

// ─── Instructions ─────────────────────────────────────────────────────────────

export function useAdminInstructions(ceremonyId: number) {
  return useQuery({
    queryKey: adminKeys.instructions(ceremonyId),
    queryFn: () => adminApi.getInstructions(ceremonyId),
    enabled: !!ceremonyId,
  });
}

export function useCreateInstruction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateInstructionRequest) =>
      adminApi.createInstruction(body),
    onSuccess: (data) =>
      qc.invalidateQueries({
        queryKey: adminKeys.instructions(data.instruction.ceremonyId),
      }),
  });
}

export function useUpdateInstruction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
      ceremonyId,
    }: {
      id: number;
      body: UpdateInstructionRequest;
      ceremonyId: number;
    }) => adminApi.updateInstruction(id, body),
    onSuccess: (_, { ceremonyId }) =>
      qc.invalidateQueries({ queryKey: adminKeys.instructions(ceremonyId) }),
  });
}

export function useDeleteInstruction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number; ceremonyId: number }) =>
      adminApi.deleteInstruction(id),
    onSuccess: (_, { ceremonyId }) =>
      qc.invalidateQueries({ queryKey: adminKeys.instructions(ceremonyId) }),
  });
}

// ─── Department Heads ─────────────────────────────────────────────────────────
export function useAdminDepartmentTitles() {
  return useQuery({
    queryKey: adminKeys.departmentTitles,
    queryFn: adminApi.getDepartmentTitles,
  });
}
export function useAdminDepartmentHeads() {
  return useQuery({
    queryKey: adminKeys.departmentHeads,
    queryFn: adminApi.getDepartmentHeads,
  });
}

export function useCreateDepartmentHead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateDepartmentHeadRequest) =>
      adminApi.createDepartmentHead(body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: adminKeys.departmentHeads }),
  });
}

export function useUpdateDepartmentHead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: UpdateDepartmentHeadRequest;
    }) => adminApi.updateDepartmentHead(id, body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: adminKeys.departmentHeads }),
  });
}

export function useDeleteDepartmentHead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminApi.deleteDepartmentHead(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: adminKeys.departmentHeads }),
  });
}

// ─── QR Scan ──────────────────────────────────────────────────────────────────

/** Mutation: scan a QR code to validate a student's ticket. */
export function useScanQrCode() {
  return useMutation({
    mutationFn: (body: QrScanRequest) => adminApi.scanQrCode(body),
  });
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export function useAdminChatRooms() {
  return useQuery({
    queryKey: adminKeys.chatRooms,
    queryFn: adminApi.getChatRooms,
  });
}

export function useAdminChatMessages(roomId: number) {
  return useQuery({
    queryKey: adminKeys.chatMessages(roomId),
    queryFn: () => adminApi.getChatMessages(roomId),
    enabled: !!roomId,
  });
}

export function useAdminCreateChatRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateChatRoomRequest) => adminApi.createChatRoom(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.chatRooms }),
  });
}

export function useAdminSendChatMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      roomId,
      body,
    }: {
      roomId: number;
      body: SendMessageRequest;
    }) => adminApi.sendChatMessage(roomId, body),
    onSuccess: (_, { roomId }) =>
      qc.invalidateQueries({ queryKey: adminKeys.chatMessages(roomId) }),
  });
}

// ─── Notifications ────────────────────────────────────────────────────────────

export function useAdminNotifications() {
  return useQuery({
    queryKey: adminKeys.notifications,
    queryFn: adminApi.getNotifications,
  });
}

export function useSendNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: SendNotificationRequest) =>
      adminApi.sendNotification(body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: adminKeys.notifications }),
  });
}
