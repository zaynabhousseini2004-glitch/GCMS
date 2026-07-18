"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/shared";
import {
  Input,
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
} from "@/components/ui";
import { Send } from "lucide-react";
import {
  useAdminChatRooms,
  useAdminChatMessages,
  useAdminSendChatMessage,
  useAdminCreateChatRoom,
  useAdminVendors,
} from "@/hooks/mutations/useAdmin";
import { useAuth } from "@/providers/AuthProvider";
import { useChatSocket } from "@/hooks/useChatSocket";
import type { ChatMessage } from "@/lib/api/types";

export default function AdminChat() {
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedVendorId, setSelectedVendorId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingEmitTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // ── Data hooks ─────────────────────────────────────────────────────────────
  const { data: roomsData, isLoading: loadingRooms, refetch: refetchRooms } = useAdminChatRooms();
  const { data: messagesData } = useAdminChatMessages(selectedRoomId ?? 0);
  const { data: vendorData, isLoading: loadingVendors } = useAdminVendors();
  const sendMessage = useAdminSendChatMessage();
  const createRoom = useAdminCreateChatRoom();

  const rooms = useMemo(() => roomsData?.rooms ?? [], [roomsData]);
  const vendors = useMemo(() => vendorData?.vendors ?? [], [vendorData]);
  const messages = messagesData?.messages ?? [];

  // ── Real-time: append to React Query cache on incoming socket message ──────

  const handleNewMessage = useCallback(
    (msg: ChatMessage) => {
      // Refresh only the room list so the sidebar shows the latest message/
      // unread count. `exact: true` prevents accidentally invalidating the
      // messages query which is already updated by setQueryData below.
      queryClient.invalidateQueries({ queryKey: ["admin", "chat", "rooms"], exact: true });

      // Append to the messages cache for this room
      queryClient.setQueryData(
        ["admin", "chat", "rooms", msg.roomId, "messages"],
        (old: { messages: ChatMessage[] } | undefined) => {
          if (!old) return { messages: [msg] };
          if (old.messages.some((m) => m.id === msg.id)) return old;
          return { messages: [...old.messages, msg] };
        },
      );
    },
    [queryClient],
  );

  const { isOtherTyping, emitTyping, emitStopTyping, emitRead } = useChatSocket({
    enabled: isAuthenticated,
    roomId: selectedRoomId,
    onNewMessage: handleNewMessage,
  });

  // ── Auto-scroll when message count changes ─────────────────────────────────
  const messageCount = messages.length;
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageCount]);

  // ── Mark messages as read when room opens ──────────────────────────────────
  useEffect(() => {
    if (selectedRoomId) emitRead();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoomId]);

  // ── Lookup maps ───────────────────────────────────────────────────────────
  const roomByVendor = useMemo(
    () =>
      new Map(
        rooms.map((r) => {
          const vendor = r.participants.find((p) => p.id !== user?.id);
          return [vendor?.id, r];
        }),
      ),
    [rooms, user?.id],
  );

  const selectedVendor = useMemo(
    () => vendors.find((v) => v.id === selectedVendorId),
    [vendors, selectedVendorId],
  );

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSelectVendor = (vendorId: number) => {
    setSelectedVendorId(vendorId);
    const existingRoom = roomByVendor.get(vendorId);
    if (existingRoom) {
      setSelectedRoomId(existingRoom.id);
    } else {
      createRoom.mutate(
        { userId: vendorId },
        {
          onSuccess: (data) => {
            setSelectedRoomId(data.room.id);
            refetchRooms();
          },
        },
      );
    }
  };

  const handleSend = () => {
    if (!messageText.trim() || !selectedRoomId) return;
    if (typingEmitTimeout.current) clearTimeout(typingEmitTimeout.current);
    emitStopTyping();

    sendMessage.mutate(
      { roomId: selectedRoomId, body: { content: messageText.trim() } },
      { onSuccess: () => setMessageText("") },
    );
  };

  const handleTyping = (value: string) => {
    setMessageText(value);
    emitTyping();
    if (typingEmitTimeout.current) clearTimeout(typingEmitTimeout.current);
    typingEmitTimeout.current = setTimeout(() => emitStopTyping(), 2000);
  };

  const isLoading = loadingRooms || loadingVendors;

  return (
    <AdminLayout activeSidebarItem="Chat">
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-primary">Vendor Chat</h2>
        <Card className="shadow-sm overflow-hidden">
          <div className="flex h-[calc(100vh-64px-100px)] min-h-[500px]">
            {/* ── Vendor list sidebar ───────────────────────────────────── */}
            <div className="w-full max-w-[280px] border-r border-border flex flex-col bg-background">
              <div className="px-4 py-3 border-b border-border">
                <span className="text-sm font-semibold text-foreground">Vendors</span>
              </div>
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
                ) : vendors.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No vendors on this campus.
                  </p>
                ) : (
                  vendors.map((vendor) => {
                    const room = roomByVendor.get(vendor.id);
                    const isSelected = selectedVendorId === vendor.id;
                    return (
                      <button
                        key={vendor.id}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left ${isSelected ? "bg-muted/70" : ""}`}
                        onClick={() => handleSelectVendor(vendor.id)}
                      >
                        <Avatar className="h-10 w-10 shrink-0">
                          {vendor.avatarUrl && (
                            <AvatarImage src={vendor.avatarUrl} alt={vendor.fullName} />
                          )}
                          <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                            {vendor.fullName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-foreground text-sm truncate">
                              {vendor.fullName}
                            </span>
                            {room && room.unreadCount > 0 && (
                              <span className="ml-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shrink-0">
                                {room.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {room?.lastMessage?.content ?? vendor.companyName ?? "No messages yet"}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* ── Messages panel ────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col">
              {!selectedVendorId ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <p className="text-sm">Select a vendor to start chatting.</p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-border flex items-center gap-3 bg-background">
                    <Avatar className="h-9 w-9">
                      {selectedVendor?.avatarUrl && (
                        <AvatarImage src={selectedVendor.avatarUrl} alt={selectedVendor.fullName} />
                      )}
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {selectedVendor?.fullName.slice(0, 2).toUpperCase() ?? "VN"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-foreground text-sm">
                        {selectedVendor?.fullName}
                      </p>
                      {selectedVendor?.companyName && (
                        <p className="text-xs text-muted-foreground">
                          {selectedVendor.companyName}
                        </p>
                      )}
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-muted-foreground">Live</span>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/20">
                    {createRoom.isPending ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                        Opening conversation...
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                        No messages yet. Say hello!
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isSent = msg.senderId === user?.id;
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isSent ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                                isSent
                                  ? "bg-primary text-primary-foreground rounded-br-md"
                                  : "bg-background border border-border text-foreground rounded-bl-md"
                              }`}
                            >
                              <p>{msg.content}</p>
                              <p
                                className={`text-[10px] mt-1 ${
                                  isSent
                                    ? "text-primary-foreground/60 text-right"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}

                    {isOtherTyping && (
                      <div className="flex justify-start">
                        <div className="bg-background border border-border rounded-2xl rounded-bl-md px-4 py-2.5 flex gap-1 items-center">
                          <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" />
                        </div>
                      </div>
                    )}

                    <div ref={bottomRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-border bg-background flex gap-2">
                    <Input
                      className="flex-1"
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => handleTyping(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      disabled={!selectedRoomId}
                    />
                    <Button
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-4"
                      onClick={handleSend}
                      disabled={sendMessage.isPending || !messageText.trim() || !selectedRoomId}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
