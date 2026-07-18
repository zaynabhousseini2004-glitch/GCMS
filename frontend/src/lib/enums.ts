// ─── Application-wide string enums ───────────────────────────────────────────
// All values match what the backend API (Prisma) returns exactly.

export enum UserRole {
  STUDENT = "STUDENT",
  VENDOR = "VENDOR",
  ADMIN = "ADMIN",
  SUPERADMIN = "SUPERADMIN",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum EligibilityStatus {
  PENDING = "PENDING",
  ELIGIBLE = "ELIGIBLE",
  NOT_ELIGIBLE = "NOT_ELIGIBLE",
}

export enum CeremonyType {
  BACHELOR = "BACHELOR",
  MASTER = "MASTER",
}

export enum CeremonySemester {
  FALL = "FALL",
  SPRING = "SPRING",
  SUMMER = "SUMMER",
}

export enum CeremonyStatus {
  UPCOMING = "UPCOMING",
  PASSED = "PASSED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum ReservationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

export enum OutfitType {
  GOWN = "GOWN",
  CAP = "CAP",
  HOOD = "HOOD",
}

export enum OutfitStatus {
  AVAILABLE = "AVAILABLE",
  UNAVAILABLE = "UNAVAILABLE",
}

export enum RentalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  RETURNED = "RETURNED",
}

export enum VendorApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum VendorRequestStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum ScanStatus {
  VALID = "VALID",
  INVALID = "INVALID",
  ALREADY_USED = "ALREADY_USED",
}

export enum ReservationType {
  TICKET = "TICKET",
  OUTFIT = "OUTFIT",
}
