import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../libs/prisma";
import { getIO } from "../../libs/socket";

const SendMessageSchema = z.object({
  content: z.string().min(1),
});

// GET /api/vendor/chat/rooms
export async function getChatRooms(
  req: Request,
  res: Response,
): Promise<void> {
  const vendorId = req.user!.id;

  const rooms = await prisma.chatRoom.findMany({
    where: { vendorId },
    select: {
      id: true,
      createdAt: true,
      admin: {
        select: { id: true, fullName: true, email: true },
      },
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          content: true,
          createdAt: true,
          senderId: true,
          isRead: true,
        },
      },
      _count: {
        select: {
          messages: { where: { isRead: false, senderId: { not: vendorId } } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const mapped = rooms.map((room) => ({
    id: room.id,
    createdAt: room.createdAt,
    participants: [
      { id: vendorId, fullName: req.user!.fullName },
      { id: room.admin.id, fullName: room.admin.fullName },
    ],
    lastMessage: room.messages[0]
      ? { ...room.messages[0], roomId: room.id }
      : null,
    unreadCount: room._count.messages,
  }));

  res.status(200).json({ rooms: mapped });
}

// POST /api/vendor/chat/rooms
export async function createChatRoom(
  req: Request,
  res: Response,
): Promise<void> {
  const vendorId = req.user!.id;
  const campusId = req.user!.campusId!;

  // Find the admin assigned to the vendor's campus
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN", campusId, status: "ACTIVE" },
  });
  if (!admin) {
    res
      .status(404)
      .json({ message: "No admin found for your campus" });
    return;
  }

  // Check if room already exists
  const existingRoom = await prisma.chatRoom.findUnique({
    where: { adminId_vendorId: { adminId: admin.id, vendorId } },
    select: {
      id: true,
      createdAt: true,
      admin: { select: { id: true, fullName: true, email: true } },
    },
  });
  if (existingRoom) {
    res.status(200).json({
      room: {
        id: existingRoom.id,
        createdAt: existingRoom.createdAt,
        participants: [
          { id: vendorId, fullName: req.user!.fullName },
          { id: existingRoom.admin.id, fullName: existingRoom.admin.fullName },
        ],
        lastMessage: null,
        unreadCount: 0,
      },
      existing: true,
    });
    return;
  }

  const room = await prisma.chatRoom.create({
    data: { adminId: admin.id, vendorId, campusId },
    select: {
      id: true,
      createdAt: true,
      admin: { select: { id: true, fullName: true, email: true } },
    },
  });

  res.status(201).json({
    room: {
      id: room.id,
      createdAt: room.createdAt,
      participants: [
        { id: vendorId, fullName: req.user!.fullName },
        { id: room.admin.id, fullName: room.admin.fullName },
      ],
      lastMessage: null,
      unreadCount: 0,
    },
  });
}

// GET /api/vendor/chat/rooms/:id/messages
export async function getChatMessages(
  req: Request,
  res: Response,
): Promise<void> {
  const vendorId = req.user!.id;
  const roomId = Number(req.params.id);
  if (!Number.isInteger(roomId) || roomId < 1) {
    res.status(400).json({ message: "Invalid room id" });
    return;
  }

  const room = await prisma.chatRoom.findUnique({
    where: { id: roomId, vendorId },
  });
  if (!room) {
    res.status(404).json({ message: "Chat room not found" });
    return;
  }

  // Mark unread messages from admin as read
  await prisma.chatMessage.updateMany({
    where: { roomId, isRead: false, senderId: { not: vendorId } },
    data: { isRead: true },
  });

  const messages = await prisma.chatMessage.findMany({
    where: { roomId },
    select: {
      id: true,
      content: true,
      senderId: true,
      isRead: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  res.status(200).json({ messages });
}

// POST /api/vendor/chat/rooms/:id/messages
export async function sendChatMessage(
  req: Request,
  res: Response,
): Promise<void> {
  const vendorId = req.user!.id;
  const roomId = Number(req.params.id);
  if (!Number.isInteger(roomId) || roomId < 1) {
    res.status(400).json({ message: "Invalid room id" });
    return;
  }

  const parsed = SendMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ message: "Validation error", errors: parsed.error.flatten() });
    return;
  }

  const room = await prisma.chatRoom.findUnique({
    where: { id: roomId, vendorId },
  });
  if (!room) {
    res.status(404).json({ message: "Chat room not found" });
    return;
  }

  const message = await prisma.chatMessage.create({
    data: {
      roomId,
      senderId: vendorId,
      content: parsed.data.content,
    },
    select: {
      id: true,
      content: true,
      senderId: true,
      isRead: true,
      createdAt: true,
    },
  });

  // Broadcast via WebSocket
  const io = getIO();
  io.to(`room:${roomId}`).emit("chat:message", { roomId, message });
  io.to(`user:${room.adminId}`).emit("chat:notification", { roomId, message });

  res.status(201).json({ message });
}
