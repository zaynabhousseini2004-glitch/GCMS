"use client";

import { Input, Button, Avatar, AvatarFallback, Card } from "@/components/ui";
import { Search, Send, Image as ImageIcon, Paperclip } from "lucide-react";

interface Conversation {
  initials: string;
  name: string;
  time: string;
  msg: string;
  unread?: number;
}

interface Message {
  type: "sent" | "received";
  text: string;
  time: string;
}

interface ActiveConversation {
  initials: string;
  name: string;
  subtitle: string;
  messages: Message[];
}

interface ChatPanelProps {
  title: string;
  searchPlaceholder: string;
  conversations: Conversation[];
  activeConversation: ActiveConversation;
}

export function ChatPanel({
  title,
  searchPlaceholder,
  conversations,
  activeConversation,
}: ChatPanelProps) {
  const [active, ...others] = conversations;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold text-primary">{title}</h2>

      <Card className="shadow-sm overflow-hidden">
        <div className="flex h-[calc(100vh-64px-100px)] min-h-[500px]">
          {/* Left Panel — Conversations */}
          <div className="w-full max-w-[320px] border-r border-border flex flex-col bg-background hidden md:flex">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h4 className="font-bold text-primary text-base">
                Conversations
              </h4>
              <Button
                size="sm"
                variant="outline"
                className="text-primary border-primary text-xs h-8"
              >
                New Chat
              </Button>
            </div>

            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <Input
                  className="pl-9 bg-muted/50 h-9 text-sm"
                  placeholder={searchPlaceholder}
                />
              </div>
            </div>

            <div className="flex-grow overflow-y-auto">
              {/* Active conversation */}
              {active && (
                <div className="p-3 flex items-start gap-3 bg-primary/5 border-l-3 border-l-primary cursor-pointer">
                  <Avatar className="h-10 w-10 mt-0.5 shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {active.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-grow overflow-hidden min-w-0">
                    <div className="flex justify-between items-baseline gap-2 mb-0.5">
                      <span className="font-semibold text-sm text-foreground truncate">
                        {active.name}
                      </span>
                      <span className="text-[11px] text-primary font-medium shrink-0">
                        {active.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {active.msg}
                    </p>
                  </div>
                  {active.unread && (
                    <div className="shrink-0 flex items-center justify-center h-5 w-5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full mt-3">
                      {active.unread}
                    </div>
                  )}
                </div>
              )}

              {/* Other conversations */}
              {others.map((c) => (
                <div
                  key={c.initials}
                  className="p-3 flex items-start gap-3 hover:bg-muted/50 cursor-pointer border-l-3 border-l-transparent transition-colors"
                >
                  <Avatar className="h-10 w-10 mt-0.5 shrink-0">
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                      {c.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-grow overflow-hidden min-w-0">
                    <div className="flex justify-between items-baseline gap-2 mb-0.5">
                      <span className="font-semibold text-sm text-foreground truncate">
                        {c.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground/60 shrink-0">
                        {c.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {c.msg}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel — Messages */}
          <div className="flex-grow flex flex-col bg-muted/30 min-w-0">
            {/* Chat Header */}
            <div className="px-4 sm:px-6 py-3 border-b border-border bg-background flex items-center gap-3">
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {activeConversation.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h4 className="font-semibold text-sm text-foreground truncate">
                  {activeConversation.name}
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  {activeConversation.subtitle}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="flex justify-center">
                <span className="text-[11px] font-medium text-muted-foreground/60 bg-background px-3 py-1 rounded-full shadow-sm border border-border">
                  Today
                </span>
              </div>

              {activeConversation.messages.map((m, i) =>
                m.type === "sent" ? (
                  <div key={i} className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%] sm:max-w-[70%] shadow-sm">
                      <p className="text-sm">{m.text}</p>
                      <span className="text-[10px] text-primary-foreground/60 block text-right mt-1">
                        {m.time}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex justify-start">
                    <div className="bg-background text-foreground rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%] sm:max-w-[70%] shadow-sm border border-border">
                      <p className="text-sm">{m.text}</p>
                      <span className="text-[10px] text-muted-foreground/60 block mt-1">
                        {m.time}
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 sm:p-4 bg-background border-t border-border">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-muted-foreground/50 hover:text-muted-foreground rounded-full h-9 w-9 shrink-0"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-muted-foreground/50 hover:text-muted-foreground rounded-full h-9 w-9 shrink-0 hidden sm:flex"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Input
                  className="flex-grow bg-muted/50 border-transparent focus-visible:ring-primary rounded-full px-4 h-9 text-sm"
                  placeholder="Type a message..."
                />
                <Button
                  size="icon"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-9 w-9 shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
