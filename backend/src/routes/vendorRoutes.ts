import { Router } from "express";
import { authenticate, requireVendor } from "../middlewares/auth";

// Controllers
import {
  getMyRequests,
  getMyRequestById,
  updateRequestStatus,
} from "../controllers/vendor/requestController";
import {
  getChatRooms,
  createChatRoom,
  getChatMessages,
  sendChatMessage,
} from "../controllers/vendor/chatController";
import {
  getProfile,
  updateProfile,
} from "../controllers/vendor/profileController";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controllers/vendor/notificationController";

const router = Router();

// All vendor routes require authentication + vendor role
router.use(authenticate, requireVendor);

// ─── Requests ────────────────────────────────────────────────────
router.get("/requests", getMyRequests);
router.get("/requests/:id", getMyRequestById);
router.patch("/requests/:id", updateRequestStatus);

// ─── Chat ────────────────────────────────────────────────────────
router.get("/chat/rooms", getChatRooms);
router.post("/chat/rooms", createChatRoom);
router.get("/chat/rooms/:id/messages", getChatMessages);
router.post("/chat/rooms/:id/messages", sendChatMessage);

// ─── Profile ─────────────────────────────────────────────────────
router.get("/profile", getProfile);
router.patch("/profile", updateProfile);

// ─── Notifications ───────────────────────────────────────────────
router.get("/notifications", getNotifications);
router.patch("/notifications/read-all", markAllNotificationsRead);
router.patch("/notifications/:id/read", markNotificationRead);

export default router;
