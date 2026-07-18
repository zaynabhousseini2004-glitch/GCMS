"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { VendorLayout } from "@/components/shared";
import { Input, Button, Avatar, AvatarFallback, Card } from "@/components/ui";
import { Send, MessageSquarePlus } from "lucide-react";
import {
  useVendorCampusAdmins,
  useVendorChatRooms,
  useVendorChatMessages,
  useVendorSendChatMessage,
  useVendorCreateChatRoom,
} from "@/hooks/mutations/useVendor";
import { useAuth } from "@/providers/AuthProvider";
import { useChatSocket } from "@/hooks/useChatSocket";
import type { ChatMessage } from "@/lib/api/types";

export function VendorChat() {
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingEmitTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: roomsData,
    isLoading: loadingRooms,
    refetch: refetchRooms,
  } = useVendorChatRooms();
  const { data: campusAdmins = [], isLoading: loadingAdmins } =
    useVendorCampusAdmins();
  const sendMessage = useVendorSendChatMessage();
  const createRoom = useVendorCreateChatRoom();

  const rooms = useMemo(() => roomsData?.rooms ?? [], [roomsData]);

  // ── Auto-select first room ─────────────────────────────────────────────────
  // effectiveRoomId must be computed BEFORE useVendorChatMessages so the query
  // uses the correct key whether or not the vendor has explicitly clicked a room.
  const effectiveRoomId = selectedRoomId ?? rooms[0]?.id ?? null;

  const { data: messagesData } = useVendorChatMessages(effectiveRoomId ?? 0);
  const messages = messagesData?.messages ?? [];

  // ── Real-time: append to React Query cache on incoming socket message ──────

  const handleNewMessage = useCallback(
    (msg: ChatMessage) => {
      queryClient.invalidateQueries({ queryKey: ["vendor", "chat", "rooms"], exact: true });
      queryClient.setQueryData(
        ["vendor", "chat", "rooms", msg.roomId, "messages"],
        (old: { messages: ChatMessage[] } | undefined) => {
          if (!old) return { messages: [msg] };
          if (old.messages.some((m) => m.id === msg.id)) return old;
          return { messages: [...old.messages, msg] };
        },
      );
    },
    [queryClient],
  );

  const { isOtherTyping, emitTyping, emitStopTyping, emitRead } = useChatSocket(
    {
      enabled: isAuthenticated,
      roomId: effectiveRoomId,
      onNewMessage: handleNewMessage,
    },
  );

  // ── Mark as read when room opens ───────────────────────────────────────────
  useEffect(() => {
    if (effectiveRoomId) emitRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveRoomId]);

  // ── Auto-scroll ────────────────────────────────────────────────────────────
  const messageCount = messages.length;
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageCount]);

  const selectedRoom = useMemo(
    () => rooms.find((r) => r.id === effectiveRoomId),
    [rooms, effectiveRoomId],
  );
  const otherParticipant = useMemo(
    () => selectedRoom?.participants?.find((p) => p.id !== user?.id),
    [selectedRoom, user?.id],
  );

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSend = () => {
    if (!messageText.trim() || !effectiveRoomId) return;
    if (typingEmitTimeout.current) clearTimeout(typingEmitTimeout.current);
    emitStopTyping();

    sendMessage.mutate(
      { roomId: effectiveRoomId, body: { content: messageText.trim() } },
      {
        onSuccess: () => {
          setMessageText("");
          refetchRooms();
        },
      },
    );
  };

  const handleTyping = (value: string) => {
    setMessageText(value);
    emitTyping();
    if (typingEmitTimeout.current) clearTimeout(typingEmitTimeout.current);
    typingEmitTimeout.current = setTimeout(() => emitStopTyping(), 2000);
  };

  const handleStartChat = (adminId: number) => {
    createRoom.mutate(
      { adminId },
      {
        onSuccess: (data) => {
          setSelectedRoomId(data.room.id);
          refetchRooms();
        },
      },
    );
  };

  return (
    <VendorLayout activeSidebarItem="Chat">
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-primary">Chat with Admin</h2>
        <Card className="shadow-sm overflow-hidden">
          <div className="flex h-[calc(100vh-64px-100px)] min-h-[500px]">
            {/* ── Sidebar ───────────────────────────────────────────────── */}
            <div className="w-full max-w-[280px] border-r border-border flex flex-col bg-background">
              <div className="p-4 border-b border-border">
                <span className="text-sm font-semibold text-foreground">
                  Conversations
                </span>
              </div>
              <div className="flex-1 overflow-y-auto">
                {loadingRooms || loadingAdmins ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Loading...
                  </p>
                ) : (
                  <>
                    {/* Existing chat rooms */}
                    {rooms.map((room) => {
                      const other = room.participants?.find(
                        (p) => p.id !== user?.id,
                      );
                      return (
                        <button
                          key={room.id}
                          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left ${effectiveRoomId === room.id ? "bg-muted/70" : ""}`}
                          onClick={() => setSelectedRoomId(room.id)}
                        >
                          <Avatar className="h-10 w-10 shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                              {other?.fullName?.slice(0, 2).toUpperCase() ?? "AD"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-foreground text-sm truncate">
                                {other?.fullName ?? "Admin"}
                              </span>
                              {room.unreadCount > 0 && (
                                <span className="ml-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shrink-0">
                                  {room.unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {room.lastMessage?.content ?? "No messages yet"}
                            </p>
                          </div>
                        </button>
                      );
                    })}

                    {/* Admins the vendor hasn't opened a chat with yet */}
                    {campusAdmins
                      .filter(
                        (admin) =>
                          !rooms.some((r) =>
                            r.participants.some((p) => p.id === admin.id),
                          ),
                      )
                      .map((admin) => (
                        <button
                          key={`new-${admin.id}`}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                          onClick={() => handleStartChat(admin.id)}
                          disabled={createRoom.isPending}
                        >
                          <Avatar className="h-10 w-10 shrink-0">
                            <AvatarFallback className="bg-muted text-muted-foreground text-sm font-bold">
                              {admin.fullName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <span className="font-semibold text-foreground text-sm truncate block">
                              {admin.fullName}
                            </span>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MessageSquarePlus className="h-3 w-3" />
                              Start conversation
                            </p>
                          </div>
                        </button>
                      ))}

                    {campusAdmins.length === 0 && rooms.length === 0 && (
                      <div className="flex flex-col items-center justify-center gap-2 py-12 px-4 text-center">
                        <MessageSquarePlus className="w-6 h-6 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          No admins available on your campus.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* ── Messages panel ────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col">
              {!effectiveRoomId ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <p className="text-sm">
                    Select a conversation to start chatting.
                  </p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-border flex items-center gap-3 bg-background">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {otherParticipant?.fullName
                          ?.slice(0, 2)
                          .toUpperCase() ?? "AD"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-foreground text-sm">
                        {otherParticipant?.fullName ?? "Admin"}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-muted-foreground">
                        Live
                      </span>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/20">
                    {messages.length === 0 ? (
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
                                {new Date(msg.createdAt).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
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
                    />
                    <Button
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-4"
                      onClick={handleSend}
                      disabled={sendMessage.isPending || !messageText.trim()}
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
    </VendorLayout>
  );
}
