import { Router } from "express";
import { authenticate, requireAdmin } from "../middlewares/auth";

// Controllers
import { getDashboard } from "../controllers/admin/dashboardController";
import { getDepartmentTitles } from "../controllers/departmentTitleController";
import {
  getStudents,
  getStudentById,
  updateStudentEligibility,
} from "../controllers/admin/studentController";
import {
  createCeremony,
  getCeremonies,
  getCeremonyById,
  updateCeremony,
  cancelCeremony,
} from "../controllers/admin/ceremonyController";
import {
  getTicketReservations,
  getTicketReservationById,
  confirmReservation,
  cancelReservation,
  setTicketPrice,
} from "../controllers/admin/ticketController";
import {
  createOutfit,
  getOutfits,
  updateOutfit,
  getOutfitRentals,
  approveRental,
  rejectRental,
} from "../controllers/admin/outfitController";
import {
  createSeats,
  getSeats,
  assignSeat,
  removeSeatAssignment,
} from "../controllers/admin/seatingController";
import {
  getVendors,
  getVendorById,
  approveVendor,
  rejectVendor,
  createVendorRequest,
  getVendorRequests,
} from "../controllers/admin/vendorController";
import {
  createServiceOffering,
  getServiceOfferings,
  updateServiceOffering,
  deleteServiceOffering,
} from "../controllers/admin/serviceOfferingController";
import {
  createInstruction,
  getInstructions,
  updateInstruction,
  deleteInstruction,
} from "../controllers/admin/instructionController";
import {
  createDepartmentHead,
  getDepartmentHeads,
  updateDepartmentHead,
  deleteDepartmentHead,
} from "../controllers/admin/departmentHeadController";
import { scanQrCode } from "../controllers/admin/qrScanController";
import {
  getChatRooms,
  createChatRoom,
  getChatMessages,
  sendChatMessage,
} from "../controllers/admin/chatController";
import {
  sendNotification,
  getNotifications,
} from "../controllers/admin/notificationController";

const router = Router();

// All routes require a valid JWT + ADMIN role + assigned campus
router.use(authenticate, requireAdmin);

// ─── Dashboard ────────────────────────────────────────────────────────────────
router.get("/dashboard", getDashboard);

// ─── Student Management ──────────────────────────────────────────────────────
router.get("/students", getStudents);
router.get("/students/:id", getStudentById);
router.patch("/students/:id/eligibility", updateStudentEligibility);

// ─── Ceremony Management ─────────────────────────────────────────────────────
router.post("/ceremonies", createCeremony);
router.get("/ceremonies", getCeremonies);
router.get("/ceremonies/:id", getCeremonyById);
router.patch("/ceremonies/:id", updateCeremony);
router.patch("/ceremonies/:id/cancel", cancelCeremony);

// ─── Ticket Management ───────────────────────────────────────────────────────
router.get("/tickets", getTicketReservations);
router.get("/tickets/:id", getTicketReservationById);
router.patch("/tickets/:id/confirm", confirmReservation);
router.patch("/tickets/:id/cancel", cancelReservation);
router.patch("/ceremonies/:ceremonyId/ticket-price", setTicketPrice);

// ─── Outfit Management ───────────────────────────────────────────────────────
router.post("/outfits", createOutfit);
router.get("/outfits", getOutfits);
router.patch("/outfits/:id", updateOutfit);
router.get("/outfits/rentals", getOutfitRentals);
router.patch("/outfits/rentals/:id/approve", approveRental);
router.patch("/outfits/rentals/:id/reject", rejectRental);

// ─── Seating Management ──────────────────────────────────────────────────────
router.post("/ceremonies/:ceremonyId/seats", createSeats);
router.get("/ceremonies/:ceremonyId/seats", getSeats);
router.post("/ceremonies/:ceremonyId/seats/assign", assignSeat);
router.delete("/ceremonies/:ceremonyId/seats/assign/:id", removeSeatAssignment);

// ─── Vendor Management ───────────────────────────────────────────────────────
router.get("/vendors", getVendors);
router.post("/vendors/requests", createVendorRequest);
router.get("/vendors/requests", getVendorRequests);
router.get("/vendors/:id", getVendorById);
router.patch("/vendors/:id/approve", approveVendor);
router.patch("/vendors/:id/reject", rejectVendor);

// ─── Service Offerings ───────────────────────────────────────────────────────
router.post("/ceremonies/:id/services", createServiceOffering);
router.get("/ceremonies/:id/services", getServiceOfferings);
router.patch("/services/:serviceId", updateServiceOffering);
router.delete("/services/:serviceId", deleteServiceOffering);

// ─── Instructions ────────────────────────────────────────────────────────────
router.post("/instructions", createInstruction);
router.get("/ceremonies/:ceremonyId/instructions", getInstructions);
router.patch("/instructions/:id", updateInstruction);
router.delete("/instructions/:id", deleteInstruction);

// ─── Department Heads ────────────────────────────────────────────────────────
router.post("/department-heads", createDepartmentHead);
router.get("/department-heads", getDepartmentHeads);
router.patch("/department-heads/:id", updateDepartmentHead);
router.delete("/department-heads/:id", deleteDepartmentHead);

// ─── Department Titles (read-only for admin) ──────────────────────────────────
router.get("/department-titles", getDepartmentTitles);

// ─── QR Scan ─────────────────────────────────────────────────────────────────
router.post("/qr-scan", scanQrCode);

// ─── Chat ────────────────────────────────────────────────────────────────────
router.get("/chat/rooms", getChatRooms);
router.post("/chat/rooms", createChatRoom);
router.get("/chat/rooms/:id/messages", getChatMessages);
router.post("/chat/rooms/:id/messages", sendChatMessage);

// ─── Notifications ───────────────────────────────────────────────────────────
router.post("/notifications", sendNotification);
router.get("/notifications", getNotifications);

export default router;
