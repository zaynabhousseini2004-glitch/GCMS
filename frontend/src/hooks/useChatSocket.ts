"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { ChatMessage } from "@/lib/api/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:3001";

interface UseChatSocketOptions {
  /** Pass true when the user is authenticated; false/undefined to disconnect. */
  enabled: boolean;
  roomId: number | null;
  onNewMessage?: (msg: ChatMessage) => void;
}

export function useChatSocket({
  enabled,
  roomId,
  onNewMessage,
}: UseChatSocketOptions) {
  // Read token lazily so it is always fresh (set/cleared during login/logout).
  // sessionStorage is tab-isolated, matching the storage used by api-client.ts.
  const getToken = () =>
    typeof window !== "undefined" ? sessionStorage.getItem("token") : null;
  const socketRef = useRef<Socket | null>(null);
  // Keep onNewMessage in a ref so the socket listener never goes stale
  const onNewMessageRef = useRef(onNewMessage);
  useEffect(() => {
    onNewMessageRef.current = onNewMessage;
  });

  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Always reflects the latest roomId so the reconnect handler can read it
  // without closing over a stale value.
  const currentRoomIdRef = useRef<number | null>(roomId);
  useEffect(() => {
    currentRoomIdRef.current = roomId;
  }, [roomId]);

  // ── Create / destroy socket based on auth state ─────────────────────────
  useEffect(() => {
    if (!enabled) return;
    const token = getToken();
    if (!token) return;

    const socket = io(API_URL, {
      auth: { token },
      path: "/socket.io",
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    // Re-join the current room after every (re)connect so server-side room
    // membership is restored even when Socket.IO auto-reconnects after a
    // network drop (the server forgets rooms on each new connection).
    socket.on("connect", () => {
      if (currentRoomIdRef.current) {
        socket.emit("chat:join", currentRoomIdRef.current);
      }
    });

    // Incoming message from backend (broadcast to room)
    socket.on(
      "chat:message",
      (data: { roomId: number; message: Omit<ChatMessage, "roomId"> }) => {
        onNewMessageRef.current?.({ ...data.message, roomId: data.roomId });
      },
    );

    // Typing indicator from the other participant
    socket.on("chat:typing", () => {
      setIsOtherTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setIsOtherTyping(false), 3000);
    });

    socket.on("chat:stopTyping", () => {
      setIsOtherTyping(false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [enabled]);

  // ── Join / leave room when selectedRoomId changes ──────────────────────────
  const prevRoomRef = useRef<number | null>(null);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    if (prevRoomRef.current && prevRoomRef.current !== roomId) {
      socket.emit("chat:leave", prevRoomRef.current);
    }

    if (roomId) {
      socket.emit("chat:join", roomId);
      prevRoomRef.current = roomId;
    }

    return () => {
      if (roomId && socketRef.current) {
        socketRef.current.emit("chat:leave", roomId);
      }
    };
  }, [roomId]);

  // ── Outgoing helpers ───────────────────────────────────────────────────────
  const emitTyping = useCallback(() => {
    if (socketRef.current && roomId) {
      socketRef.current.emit("chat:typing", roomId);
    }
  }, [roomId]);

  const emitStopTyping = useCallback(() => {
    if (socketRef.current && roomId) {
      socketRef.current.emit("chat:stopTyping", roomId);
    }
  }, [roomId]);

  const emitRead = useCallback(() => {
    if (socketRef.current && roomId) {
      socketRef.current.emit("chat:read", roomId);
    }
  }, [roomId]);

  return { isOtherTyping, emitTyping, emitStopTyping, emitRead };
}
