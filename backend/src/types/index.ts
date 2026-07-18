import { z } from "zod";

export * from "../generated/zod";

export function validate<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
): z.infer<T> {
  return schema.parse(data);
}

/**
 * Safely parses data against a Zod schema.
 * Returns `{ success, data }` or `{ success: false, error }` without throwing.
 */
export function safeParse<T extends z.ZodTypeAny>(schema: T, data: unknown) {
  return schema.safeParse(data);
}

import {
  CampusUncheckedCreateInputSchema,
  CampusUncheckedUpdateInputSchema,
  UserUncheckedCreateInputSchema,
  UserUncheckedUpdateInputSchema,
  CeremonyUncheckedCreateInputSchema,
  CeremonyUncheckedUpdateInputSchema,
  StudentCeremonyRegistrationUncheckedCreateInputSchema,
  StudentCeremonyRegistrationUncheckedUpdateInputSchema,
  TicketReservationUncheckedCreateInputSchema,
  TicketReservationUncheckedUpdateInputSchema,
  TicketUncheckedCreateInputSchema,
  TicketUncheckedUpdateInputSchema,
  OutfitUncheckedCreateInputSchema,
  OutfitUncheckedUpdateInputSchema,
  OutfitRentalUncheckedCreateInputSchema,
  OutfitRentalUncheckedUpdateInputSchema,
  SeatUncheckedCreateInputSchema,
  SeatUncheckedUpdateInputSchema,
  SeatAssignmentUncheckedCreateInputSchema,
  SeatAssignmentUncheckedUpdateInputSchema,
  CeremonyServiceOfferingUncheckedCreateInputSchema,
  CeremonyServiceOfferingUncheckedUpdateInputSchema,
  VendorRequestUncheckedCreateInputSchema,
  VendorRequestUncheckedUpdateInputSchema,
  NotificationUncheckedCreateInputSchema,
  NotificationUncheckedUpdateInputSchema,
  DepartmentTitleCreateInputSchema,
  DepartmentTitleUpdateInputSchema,
  DepartmentHeadUncheckedCreateInputSchema,
  DepartmentHeadUncheckedUpdateInputSchema,
  CeremonyInstructionUncheckedCreateInputSchema,
  CeremonyInstructionUncheckedUpdateInputSchema,
  QrScanUncheckedCreateInputSchema,
  EmailLogUncheckedCreateInputSchema,
  ChatRoomUncheckedCreateInputSchema,
  ChatMessageUncheckedCreateInputSchema,
  ChatMessageUncheckedUpdateInputSchema,
} from "../generated/zod";

// Campus
export const CreateCampusBody = CampusUncheckedCreateInputSchema;
export const UpdateCampusBody = CampusUncheckedUpdateInputSchema;
export type CreateCampusBodyType = z.infer<typeof CreateCampusBody>;
export type UpdateCampusBodyType = z.infer<typeof UpdateCampusBody>;

// User
export const CreateUserBody = UserUncheckedCreateInputSchema;
export const UpdateUserBody = UserUncheckedUpdateInputSchema;
export type CreateUserBodyType = z.infer<typeof CreateUserBody>;
export type UpdateUserBodyType = z.infer<typeof UpdateUserBody>;

// Ceremony
export const CreateCeremonyBody = CeremonyUncheckedCreateInputSchema;
export const UpdateCeremonyBody = CeremonyUncheckedUpdateInputSchema;
export type CreateCeremonyBodyType = z.infer<typeof CreateCeremonyBody>;
export type UpdateCeremonyBodyType = z.infer<typeof UpdateCeremonyBody>;

// Student Ceremony Registration
export const CreateRegistrationBody =
  StudentCeremonyRegistrationUncheckedCreateInputSchema;
export const UpdateRegistrationBody =
  StudentCeremonyRegistrationUncheckedUpdateInputSchema;
export type CreateRegistrationBodyType = z.infer<typeof CreateRegistrationBody>;
export type UpdateRegistrationBodyType = z.infer<typeof UpdateRegistrationBody>;

// Ticket Reservation
export const CreateTicketReservationBody =
  TicketReservationUncheckedCreateInputSchema;
export const UpdateTicketReservationBody =
  TicketReservationUncheckedUpdateInputSchema;
export type CreateTicketReservationBodyType = z.infer<
  typeof CreateTicketReservationBody
>;
export type UpdateTicketReservationBodyType = z.infer<
  typeof UpdateTicketReservationBody
>;

// Ticket
export const CreateTicketBody = TicketUncheckedCreateInputSchema;
export const UpdateTicketBody = TicketUncheckedUpdateInputSchema;
export type CreateTicketBodyType = z.infer<typeof CreateTicketBody>;
export type UpdateTicketBodyType = z.infer<typeof UpdateTicketBody>;

// Outfit
export const CreateOutfitBody = OutfitUncheckedCreateInputSchema;
export const UpdateOutfitBody = OutfitUncheckedUpdateInputSchema;
export type CreateOutfitBodyType = z.infer<typeof CreateOutfitBody>;
export type UpdateOutfitBodyType = z.infer<typeof UpdateOutfitBody>;

// Outfit Rental
export const CreateOutfitRentalBody = OutfitRentalUncheckedCreateInputSchema;
export const UpdateOutfitRentalBody = OutfitRentalUncheckedUpdateInputSchema;
export type CreateOutfitRentalBodyType = z.infer<typeof CreateOutfitRentalBody>;
export type UpdateOutfitRentalBodyType = z.infer<typeof UpdateOutfitRentalBody>;

// Seat
export const CreateSeatBody = SeatUncheckedCreateInputSchema;
export const UpdateSeatBody = SeatUncheckedUpdateInputSchema;
export type CreateSeatBodyType = z.infer<typeof CreateSeatBody>;
export type UpdateSeatBodyType = z.infer<typeof UpdateSeatBody>;

// Seat Assignment
export const CreateSeatAssignmentBody =
  SeatAssignmentUncheckedCreateInputSchema;
export const UpdateSeatAssignmentBody =
  SeatAssignmentUncheckedUpdateInputSchema;
export type CreateSeatAssignmentBodyType = z.infer<
  typeof CreateSeatAssignmentBody
>;
export type UpdateSeatAssignmentBodyType = z.infer<
  typeof UpdateSeatAssignmentBody
>;

// Ceremony Service Offering
export const CreateServiceOfferingBody =
  CeremonyServiceOfferingUncheckedCreateInputSchema;
export const UpdateServiceOfferingBody =
  CeremonyServiceOfferingUncheckedUpdateInputSchema;
export type CreateServiceOfferingBodyType = z.infer<
  typeof CreateServiceOfferingBody
>;
export type UpdateServiceOfferingBodyType = z.infer<
  typeof UpdateServiceOfferingBody
>;

// Vendor Request
export const CreateVendorRequestBody = VendorRequestUncheckedCreateInputSchema;
export const UpdateVendorRequestBody = VendorRequestUncheckedUpdateInputSchema;
export type CreateVendorRequestBodyType = z.infer<
  typeof CreateVendorRequestBody
>;
export type UpdateVendorRequestBodyType = z.infer<
  typeof UpdateVendorRequestBody
>;

// Notification
export const CreateNotificationBody = NotificationUncheckedCreateInputSchema;
export const UpdateNotificationBody = NotificationUncheckedUpdateInputSchema;
export type CreateNotificationBodyType = z.infer<typeof CreateNotificationBody>;
export type UpdateNotificationBodyType = z.infer<typeof UpdateNotificationBody>;

// Department Title
export const CreateDepartmentTitleBody = DepartmentTitleCreateInputSchema;
export const UpdateDepartmentTitleBody = DepartmentTitleUpdateInputSchema;
export type CreateDepartmentTitleBodyType = z.infer<
  typeof CreateDepartmentTitleBody
>;
export type UpdateDepartmentTitleBodyType = z.infer<
  typeof UpdateDepartmentTitleBody
>;

// Department Head
export const CreateDepartmentHeadBody =
  DepartmentHeadUncheckedCreateInputSchema;
export const UpdateDepartmentHeadBody =
  DepartmentHeadUncheckedUpdateInputSchema;
export type CreateDepartmentHeadBodyType = z.infer<
  typeof CreateDepartmentHeadBody
>;
export type UpdateDepartmentHeadBodyType = z.infer<
  typeof UpdateDepartmentHeadBody
>;

// Ceremony Instruction
export const CreateCeremonyInstructionBody =
  CeremonyInstructionUncheckedCreateInputSchema;
export const UpdateCeremonyInstructionBody =
  CeremonyInstructionUncheckedUpdateInputSchema;
export type CreateCeremonyInstructionBodyType = z.infer<
  typeof CreateCeremonyInstructionBody
>;
export type UpdateCeremonyInstructionBodyType = z.infer<
  typeof UpdateCeremonyInstructionBody
>;

// QR Scan
export const CreateQrScanBody = QrScanUncheckedCreateInputSchema;
export type CreateQrScanBodyType = z.infer<typeof CreateQrScanBody>;

// Email Log
export const CreateEmailLogBody = EmailLogUncheckedCreateInputSchema;
export type CreateEmailLogBodyType = z.infer<typeof CreateEmailLogBody>;

// Chat Room
export const CreateChatRoomBody = ChatRoomUncheckedCreateInputSchema;
export type CreateChatRoomBodyType = z.infer<typeof CreateChatRoomBody>;

// Chat Message
export const CreateChatMessageBody = ChatMessageUncheckedCreateInputSchema;
export const UpdateChatMessageBody = ChatMessageUncheckedUpdateInputSchema;
export type CreateChatMessageBodyType = z.infer<typeof CreateChatMessageBody>;
export type UpdateChatMessageBodyType = z.infer<typeof UpdateChatMessageBody>;

// ─── Common param schemas ─────────────────────────────────────────────────────

export const IdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
export type IdParam = z.infer<typeof IdParamSchema>;

export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
export type Pagination = z.infer<typeof PaginationSchema>;
