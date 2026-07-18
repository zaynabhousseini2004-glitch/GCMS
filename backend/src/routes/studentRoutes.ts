import { Router } from "express";
import { authenticate, requireStudent } from "../middlewares/auth";

// Controllers
import {
  getCeremonies,
  getCeremonyById,
} from "../controllers/student/ceremonyController";
import {
  reserveTickets,
  getMyTickets,
  getTicketById,
  cancelReservation,
} from "../controllers/student/ticketController";
import {
  getOutfits,
  getMyRentals,
  rentOutfit,
  cancelRental,
} from "../controllers/student/outfitController";
import { getMyReservations } from "../controllers/student/reservationController";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controllers/student/notificationController";
import { getStudentDashboard } from "../controllers/student/dashboardController";
import { getDepartmentHeads } from "../controllers/student/departmentHeadController";

const router = Router();

// All student routes require authentication + student role
router.use(authenticate, requireStudent);

// ─── Dashboard ───────────────────────────────────────────────────
router.get("/dashboard", getStudentDashboard);

// ─── Department Heads ────────────────────────────────────────────
router.get("/department-heads", getDepartmentHeads);

// ─── Ceremonies ──────────────────────────────────────────────────
router.get("/ceremonies", getCeremonies);
router.get("/ceremonies/:id", getCeremonyById);

// ─── Tickets ─────────────────────────────────────────────────────
router.post("/tickets", reserveTickets);
router.get("/tickets", getMyTickets);
router.get("/tickets/:id", getTicketById);
router.patch("/tickets/:id/cancel", cancelReservation);

// ─── Outfits ─────────────────────────────────────────────────────
router.get("/outfits", getOutfits);
router.get("/outfits/rentals", getMyRentals);
router.post("/outfits/rent", rentOutfit);
router.patch("/outfits/rentals/:id/cancel", cancelRental);

// ─── Reservations (unified view) ────────────────────────────────
router.get("/reservations", getMyReservations);

// ─── Notifications ───────────────────────────────────────────────
router.get("/notifications", getNotifications);
router.patch("/notifications/read-all", markAllNotificationsRead);
router.patch("/notifications/:id/read", markNotificationRead);

export default router;
