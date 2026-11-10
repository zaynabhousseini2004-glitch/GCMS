// ─── Enums ────────────────────────────────────────────────────────────────────────
export {
  UserRole,
  UserStatus,
  EligibilityStatus,
  CeremonyType,
  CeremonySemester,
  CeremonyStatus,
  ReservationStatus,
  OutfitType,
  OutfitStatus,
  RentalStatus,
  VendorApprovalStatus,
  VendorRequestStatus,
  ScanStatus,
  ReservationType,
} from "@/lib/enums";
import {
  UserRole,
  UserStatus,
  EligibilityStatus,
  CeremonyType,
  CeremonySemester,
  CeremonyStatus,
  ReservationStatus,
  OutfitType,
  OutfitStatus,
  RentalStatus,
  VendorApprovalStatus,
  VendorRequestStatus,
} from "@/lib/enums";

// ─── Auth ──────────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  campusId?: number | null;
  vendorApprovalStatus?: string | null;
}
export interface AuthResponse {
  token: string;
  user: AuthUser;
}
export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole.STUDENT | UserRole.VENDOR;
}
export interface LoginRequest {
  email: string;
  password: string;
}

// ─── Superadmin Student ──────────────────────────────────────────────────────────
export interface SAStudent {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  role: string;
  status: string;
  campusId?: number | null;
  eligibilityStatus: string;
  universityId?: string | null;
  faculty?: string | null;
  createdAt: string;
}

// ─── Admin User ─────────────────────────────────────────────────────────────────
export interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  status: UserStatus;
  campusId?: number | null;
  createdAt: string;
  updatedAt: string;
}
export interface CreateAdminRequest {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  campusId?: number;
}
export interface UpdateAdminRequest {
  fullName?: string;
  email?: string;
  password?: string;
  phone?: string;
  campusId?: number | null;
}

// ─── Campus ───────────────────────────────────────────────────────────────────────
export interface Campus {
  id: number;
  name: string;
  location?: string | null;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { users: number; ceremonies: number };
}
export interface CreateCampusRequest {
  name: string;
  location?: string;
}
export interface UpdateCampusRequest {
  name?: string;
  location?: string;
}
export interface CampusAdmin {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  status: UserStatus;
  createdAt: string;
}

// ─── Department Title ─────────────────────────────────────────────────────────
export interface DepartmentTitle {
  id: number;
  title: string;
  createdAt: string;
  _count?: { heads: number };
}
export interface CreateDepartmentTitleRequest {
  title: string;
}
export interface UpdateDepartmentTitleRequest {
  title: string;
}

// ─── Department Head ──────────────────────────────────────────────────────────
export interface DepartmentHead {
  id: number;
  fullName: string;
  departmentTitle: string;
  departmentTitleId: number;
  photoUrl?: string | null;
  description?: string | null;
  campusId: number;
  createdAt: string;
  updatedAt: string;
}
export interface CreateDepartmentHeadRequest {
  fullName: string;
  departmentTitleId: number;
}
export interface UpdateDepartmentHeadRequest {
  fullName?: string;
  departmentTitleId?: number;
}

// ─── Ceremony ───────────────────────────────────────────────────────────────────
export interface Ceremony {
  id: number;
  title: string;
  description?: string | null;
  ceremonyDate: string;
  startTime?: string | null;
  endTime?: string | null;
  venue?: string | null;
  capacity?: number | null;
  ceremonyType: CeremonyType;
  semester: CeremonySemester;
  status: CeremonyStatus;
  campusId?: number | null;
  createdAt: string;
  bannerUrl?: string | null;
  ticketPrice?: number | string | null;
  instructions?: {
    id: number;
    title?: string;
    content: string;
    order?: number;
    target?: "STUDENT" | "PARENT" | "GUEST";
  }[];
  _count?: { registrations: number; ticketReservations: number; seats?: number };
  /** Sum of numberOfTickets for CONFIRMED + PENDING reservations (capacity utilization) */
  ticketsBooked?: number;
}
export interface CreateCeremonyRequest {
  title: string;
  description?: string;
  ceremonyDate: string;
  venue?: string;
  capacity?: number;
  ceremonyType: string;
  semester: string;
}
export interface UpdateCeremonyRequest {
  title?: string;
  description?: string;
  ceremonyDate?: string;
  venue?: string;
  capacity?: number;
  ceremonyType?: string;
  semester?: string;
  status?: "UPCOMING" | "CANCELLED" | "COMPLETED";
  ticketPrice?: number;
}

// ─── Ticket Reservation ───────────────────────────────────────────────────────────
export interface Ticket {
  id: number;
  ticketCode: string;
  qrCode?: string;
  guestName?: string | null;
  seatNumber?: string | null;
  ticketStatus: string;
}
export interface TicketReservation {
  id: number;
  userId: number;
  ceremonyId: number;
  numberOfTickets: number;
  pricePerTicket: number;
  totalPrice: number;
  reservationStatus: ReservationStatus;
  reservedAt: string;
  user?: { id: number; fullName: string; email: string };
  ceremony?: {
    id: number;
    title: string;
    ceremonyDate: string;
    venue?: string | null;
    status?: CeremonyStatus;
  };
  tickets?: Ticket[];
}
export interface ReserveTicketsRequest {
  ceremonyId: number;
  numberOfTickets: number;
  guests?: { guestName: string }[];
}
export interface SetTicketPriceRequest {
  pricePerTicket: number;
}

// ─── Outfit ─────────────────────────────────────────────────────────────────────────
export interface Outfit {
  id: number;
  outfitType: OutfitType;
  size?: string | null;
  color?: string | null;
  ceremonyType?: CeremonyType | null;
  quantityAvailable: number;
  rentalPrice: number;
  status: OutfitStatus;
  campusId?: number;
  imageUrl?: string | null;
  createdAt?: string;
  /** Count of currently active (APPROVED, not yet returned) rentals for this outfit */
  _count?: { outfitRentals: number };
}
export interface CreateOutfitRequest {
  outfitType: string;
  size?: string;
  color?: string;
  ceremonyType?: string;
  quantityAvailable?: number;
  rentalPrice?: number;
}
export interface UpdateOutfitRequest {
  outfitType?: string;
  size?: string;
  color?: string;
  ceremonyType?: string;
  quantityAvailable?: number;
  rentalPrice?: number;
  status?: string;
}
export interface OutfitRental {
  id: number;
  userId: number;
  ceremonyId: number;
  outfitId: number;
  selectedSize: string;
  rentalStatus: RentalStatus;
  pickupDate?: string | null;
  returnDate?: string | null;
  rentedAt: string;
  outfit?: { id: number; outfitType: OutfitType; size?: string | null; color?: string | null };
  user?: { id: number; fullName: string; email: string };
}
export interface RentOutfitRequest {
  ceremonyId: number;
  outfitId: number;
  selectedSize: string;
}

export interface RentMultipleOutfitsRequest {
  ceremonyId: number;
  outfits: Array<{
    outfitId: number;
    selectedSize: string;
  }>;
}

// ─── Seating ─────────────────────────────────────────────────────────────────────
export interface Seat {
  id: number;
  ceremonyId: number;
  seatNumber: string;
  sectionName?: string | null;
  seatStatus: string;
  createdAt: string;
  assignments?: { id: number; guestName?: string | null; user: { id: number; fullName: string; email: string } | null }[];
}
export interface CeremonyTicketReservation {
  userId: number;
  numberOfTickets: number;
  user: { id: number; fullName: string; email: string };
}
export interface CreateSeatsRequest {
  seats: Array<{
    seatNumber: string;
    sectionName?: string;
    rowNumber?: string;
  }>;
}
export interface AssignSeatRequest {
  seatId: number;
  userId?: number;
  guestName?: string;
}

// ─── Vendor ─────────────────────────────────────────────────────────────────────────
export interface Vendor {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  companyName?: string | null;
  serviceType?: string | null;
  vendorApprovalStatus: VendorApprovalStatus;
  status: UserStatus;
  avatarUrl?: string | null;
  campusId?: number | null;
  createdAt: string;
}

export interface VendorDetail extends Vendor {
  assignedVendorRequests: Array<{
    id: number;
    requestTitle: string;
    requestStatus: string;
    ceremony: { id: number; title: string };
    createdAt: string;
  }>;
}

export interface CreateVendorRequestPayload {
  vendorId: number;
  ceremonyId: number;
  serviceOfferingId?: number;
  requestTitle: string;
  requestDescription?: string;
}

// ─── Service Offering ───────────────────────────────────────────────────────────
export interface ServiceOffering {
  id: number;
  ceremonyId: number;
  title: string;
  description?: string | null;
  price: number;
  quantity: number;
  isActive: boolean;
  createdAt: string;
}
export interface CreateServiceOfferingRequest {
  title: string;
  description?: string;
  price: number;
  quantity?: number;
}
export interface UpdateServiceOfferingRequest {
  title?: string;
  description?: string;
  price?: number;
  isActive?: boolean;
}

// ─── Instruction ───────────────────────────────────────────────────────────────
export interface Instruction {
  id: number;
  title?: string;
  content: string;
  target?: string;
  order?: number;
  ceremonyId: number;
  createdAt: string;
  updatedAt: string;
}
export interface CreateInstructionRequest {
  content: string;
  title?: string;
  ceremonyId: number;
  target?: string;
}
export interface UpdateInstructionRequest {
  content?: string;
  title?: string;
  target?: string;
}

// ─── Notification ────────────────────────────────────────────────────────────────
export interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  userId: number;
  createdAt: string;
}
export interface SendNotificationRequest {
  title: string;
  message: string;
  targetRole?: UserRole;
  targetUserId?: number;
}

// ─── Chat ───────────────────────────────────────────────────────────────────────────
export interface ChatMessage {
  id: number;
  roomId: number;
  senderId: number;
  content: string;
  isRead: boolean;
  createdAt: string;
}
export interface ChatRoom {
  id: number;
  participants: { id: number; fullName: string }[];
  lastMessage?: ChatMessage | null;
  unreadCount: number;
  createdAt: string;
}
export interface CampusAdmin {
  id: number;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
}
export interface CreateChatRoomRequest {
  adminId: number;
}
export interface SendMessageRequest {
  content: string;
}

// ─── Vendor Requests ───────────────────────────────────────────────────────────────
export interface VendorRequest {
  id: number;
  vendorId?: number;
  ceremonyId?: number;
  requestTitle: string;
  requestDescription?: string | null;
  requestStatus: VendorRequestStatus;
  createdAt: string;
  updatedAt: string;
  vendor?: { id: number; fullName: string; companyName?: string | null };
  ceremony?: {
    id: number;
    title: string;
    ceremonyDate: string;
    venue?: string | null;
  };
  serviceOffering?: { id: number; title: string; price: number };
  assignedBy?: { id: number; fullName: string; email: string };
}
export interface UpdateVendorRequestPayload {
  requestStatus: string;
}

// ─── Vendor Profile ────────────────────────────────────────────────────────────────
export interface VendorProfile {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  companyName?: string | null;
  serviceType?: string | null;
  vendorApprovalStatus: VendorApprovalStatus;
  campusId?: number | null;
  avatarUrl?: string | null;
  campus?: { id: number; name: string; location?: string | null };
  createdAt?: string;
  updatedAt?: string;
}
export interface UpdateVendorProfileRequest {
  companyName?: string;
  serviceType?: string;
  phone?: string;
}

// ─── Student ───────────────────────────────────────────────────────────────────────
export interface Student {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  status: UserStatus;
  eligibilityStatus: EligibilityStatus;
  universityId?: string | null;
  faculty?: string | null;
  department?: string | null;
  graduationYear?: number | null;
  graduationSemester?: string | null;
  createdAt: string;
}

export interface StudentDetail extends Student {
  registrations: Array<{
    id: number;
    registrationStatus: string;
    registeredAt: string;
    ceremony: { id: number; title: string; ceremonyDate: string };
  }>;
  ticketReservations: Array<{
    id: number;
    numberOfTickets: number;
    reservationStatus: string;
    reservedAt: string;
  }>;
  outfitRentals: Array<{
    id: number;
    selectedSize: string;
    rentalStatus: string;
    rentedAt: string;
  }>;
}

export interface UpdateEligibilityRequest {
  eligibilityStatus: string;
}

// ─── Student Reservations ──────────────────────────────────────────────────────────────
export interface StudentReservation {
  id: number;
  type: string;
  status: string;
  ceremonyTitle?: string;
  outfitName?: string;
  createdAt: string;
}
export interface TicketReservationEntry {
  id: number;
  numberOfTickets: number;
  pricePerTicket: string;
  totalPrice: string;
  reservationStatus: string;
  reservedAt: string;
  ceremony?: {
    id: number;
    title: string;
    ceremonyDate: string;
    venue?: string | null;
  };
  tickets?: {
    id: number;
    ticketCode: string;
    guestName?: string | null;
    ticketStatus: string;
  }[];
}
export interface OutfitRentalEntry {
  id: number;
  rentalStatus: string;
  rentedAt: string;
  outfit?: { id: number; name: string; size?: string | null };
  ceremony?: { id: number; title: string };
}
export interface SeatAssignmentEntry {
  id: number;
  assignedAt: string;
  seat?: { id: number; seatNumber: string; sectionName?: string | null; rowNumber?: string | null };
  ceremony?: { id: number; title: string; ceremonyDate?: string; venue?: string | null };
}
export interface MyReservationsResponse {
  ticketReservations: TicketReservationEntry[];
  outfitRentals: OutfitRentalEntry[];
  seatAssignments: SeatAssignmentEntry[];
}

// ─── Admin Dashboard ────────────────────────────────────────────────────────────────
export interface DashboardStats {
  totalStudents: number;
  totalCeremonies: number;
  upcomingCeremonies: number;
  totalTicketsIssued: number;
  totalOutfitRentals: number;
  totalVendors: number;
}
export interface AdminDashboard {
  stats: DashboardStats;
}

// ─── Student Dashboard ──────────────────────────────────────────────────────────────
export interface StudentDashboardStats {
  totalTickets: number;
  outfitStatus: string | null;
  rentedOutfitsCount: number;
  totalReservations: number;
}
export interface StudentUpcomingCeremony {
  id: number;
  title: string;
  ceremonyDate: string;
  startTime?: string | null;
  venue?: string | null;
  status: string;
}
export interface StudentDashboardNotification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
export interface StudentDashboardData {
  stats: StudentDashboardStats;
  upcomingCeremonies: StudentUpcomingCeremony[];
  recentNotifications: StudentDashboardNotification[];
}

// ─── QR Scan ───────────────────────────────────────────────────────────────────────
export interface QrScanRequest {
  qrCode: string;
}
export interface QrScanTicketData {
  ticketCode: string;
  guestName: string | null;
  seatNumber: string | null;
  ticketStatus: string;
  student: { id: number; fullName: string; email: string } | null;
  ceremony: {
    id: number;
    title: string;
    ceremonyDate: string;
    venue: string | null;
    status: string;
    isUpcoming: boolean;
  };
  reservation: {
    id: number;
    status: string;
    numberOfTickets: number;
    totalPrice: number;
  };
  outfitRentals: { id: number; status: string; outfitType: string | null; size: string | null }[];
}
export interface QrScanResult {
  status: string;
  access: string;
  data: QrScanTicketData | null;
}
