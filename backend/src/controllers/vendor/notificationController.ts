import { Request, Response } from "express";
import { prisma } from "../../libs/prisma";

// GET /api/vendor/notifications
export async function getNotifications(
  req: Request,
  res: Response,
): Promise<void> {
  const vendorId = req.user!.id;

  const notifications = await prisma.notification.findMany({
    where: { userId: vendorId },
    select: {
      id: true,
      title: true,
      message: true,
      isRead: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({ notifications });
}

// PATCH /api/vendor/notifications/:id/read
export async function markNotificationRead(
  req: Request,
  res: Response,
): Promise<void> {
  const vendorId = req.user!.id;
  const notificationId = Number(req.params.id);
  if (!Number.isInteger(notificationId) || notificationId < 1) {
    res.status(400).json({ message: "Invalid notification id" });
    return;
  }

  const notification = await prisma.notification.findUnique({
    where: { id: notificationId, userId: vendorId },
  });
  if (!notification) {
    res.status(404).json({ message: "Notification not found" });
    return;
  }

  await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });

  res.status(200).json({ message: "Notification marked as read" });
}

// PATCH /api/vendor/notifications/read-all
export async function markAllNotificationsRead(
  req: Request,
  res: Response,
): Promise<void> {
  const vendorId = req.user!.id;

  await prisma.notification.updateMany({
    where: { userId: vendorId, isRead: false },
    data: { isRead: true },
  });

  res.status(200).json({ message: "All notifications marked as read" });
}
