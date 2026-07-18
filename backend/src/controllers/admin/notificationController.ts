import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../libs/prisma";

const CreateNotificationSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
  userId: z.number().int().positive().optional(),
});

// POST /api/admin/notifications  — send to one student or all students on campus
export async function sendNotification(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;

  const parsed = CreateNotificationSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", errors: parsed.error.flatten() });
    return;
  }

  const { title, message, userId } = parsed.data;

  if (userId) {
    // Send to a specific student
    const student = await prisma.user.findUnique({
      where: { id: userId, role: "STUDENT", campusId },
    });
    if (!student) {
      res.status(404).json({ message: "Student not found on this campus" });
      return;
    }

    const notification = await prisma.notification.create({
      data: { userId, title, message },
      select: { id: true, title: true, message: true, createdAt: true },
    });

    res.status(201).json({ notification, recipientCount: 1 });
    return;
  }

  // Broadcast to all students on campus
  const students = await prisma.user.findMany({
    where: { role: "STUDENT", campusId, status: "ACTIVE" },
    select: { id: true },
  });

  if (students.length === 0) {
    res
      .status(200)
      .json({
        message: "No active students on this campus",
        recipientCount: 0,
      });
    return;
  }

  await prisma.notification.createMany({
    data: students.map((s) => ({ userId: s.id, title, message })),
  });

  res
    .status(201)
    .json({ message: "Notifications sent", recipientCount: students.length });
}

// GET /api/admin/notifications
export async function getNotifications(
  req: Request,
  res: Response,
): Promise<void> {
  const campusId = req.user!.campusId!;

  const notifications = await prisma.notification.findMany({
    where: { user: { campusId } },
    select: {
      id: true,
      title: true,
      message: true,
      isRead: true,
      createdAt: true,
      user: { select: { id: true, fullName: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  res.status(200).json({ notifications });
}
