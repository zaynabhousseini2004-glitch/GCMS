import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../middlewares/auth";
import { prisma } from "../libs/prisma";

let io: Server;

export function initSocketIO(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST"],
    },
    path: "/socket.io",
  });

  // JWT authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Authentication required"));
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next(new Error("Server misconfiguration"));
    }

    try {
      const decoded = jwt.verify(token, secret) as JwtPayload;
      socket.data.user = decoded;
      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const user: JwtPayload = socket.data.user;

    // Join a personal room so we can target messages to specific users
    socket.join(`user:${user.id}`);

    // ─── Join Chat Room ──────────────────────────────────────────
    socket.on("chat:join", async (roomId: number) => {
      if (!Number.isInteger(roomId) || roomId < 1) {
        socket.emit("error", { message: "Invalid room id" });
        return;
      }

      const room = await prisma.chatRoom.findUnique({
        where: { id: roomId },
      });

      if (!room || (room.adminId !== user.id && room.vendorId !== user.id)) {
        socket.emit("error", { message: "Chat room not found" });
        return;
      }

      socket.join(`room:${roomId}`);
      socket.emit("chat:joined", { roomId });
    });

    // ─── Leave Chat Room ─────────────────────────────────────────
    socket.on("chat:leave", (roomId: number) => {
      socket.leave(`room:${roomId}`);
    });

    // ─── Send Message ────────────────────────────────────────────
    socket.on(
      "chat:message",
      async (data: { roomId: number; content: string }) => {
        const { roomId, content } = data;

        if (!roomId || !content?.trim()) {
          socket.emit("error", { message: "roomId and content are required" });
          return;
        }

        const room = await prisma.chatRoom.findUnique({
          where: { id: roomId },
        });

        if (!room || (room.adminId !== user.id && room.vendorId !== user.id)) {
          socket.emit("error", { message: "Chat room not found" });
          return;
        }

        const message = await prisma.chatMessage.create({
          data: {
            roomId,
            senderId: user.id,
            content: content.trim(),
          },
          select: {
            id: true,
            content: true,
            senderId: true,
            isRead: true,
            createdAt: true,
          },
        });

        // Broadcast to everyone in the room (including sender)
        io.to(`room:${roomId}`).emit("chat:message", { roomId, message });

        // Also notify the other user in case they haven't joined the room
        const recipientId =
          room.adminId === user.id ? room.vendorId : room.adminId;
        io.to(`user:${recipientId}`).emit("chat:notification", {
          roomId,
          message,
        });
      },
    );

    // ─── Mark Messages as Read ───────────────────────────────────
    socket.on("chat:read", async (roomId: number) => {
      if (!Number.isInteger(roomId) || roomId < 1) return;

      const room = await prisma.chatRoom.findUnique({
        where: { id: roomId },
      });

      if (!room || (room.adminId !== user.id && room.vendorId !== user.id)) {
        return;
      }

      await prisma.chatMessage.updateMany({
        where: { roomId, isRead: false, senderId: { not: user.id } },
        data: { isRead: true },
      });

      // Notify the other participant that messages were read
      const recipientId =
        room.adminId === user.id ? room.vendorId : room.adminId;
      io.to(`user:${recipientId}`).emit("chat:read", { roomId });
    });

    // ─── Typing Indicator ────────────────────────────────────────
    socket.on("chat:typing", (roomId: number) => {
      socket.to(`room:${roomId}`).emit("chat:typing", {
        roomId,
        userId: user.id,
      });
    });

    socket.on("chat:stopTyping", (roomId: number) => {
      socket.to(`room:${roomId}`).emit("chat:stopTyping", {
        roomId,
        userId: user.id,
      });
    });

    socket.on("disconnect", () => {
      // Cleanup handled automatically by socket.io
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
}
