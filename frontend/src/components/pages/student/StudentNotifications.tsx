"use client";

import { StudentLayout } from "@/components/shared";
import { Badge, Card, Button } from "@/components/ui";
import { Bell, CheckCheck } from "lucide-react";
import {
  useStudentNotifications,
  useMarkStudentNotificationRead,
  useMarkAllStudentNotificationsRead,
} from "@/hooks/mutations/useStudent";

export function StudentNotifications() {
  const { data, isLoading } = useStudentNotifications();
  const markRead = useMarkStudentNotificationRead();
  const markAll = useMarkAllStudentNotificationsRead();

  const notifications = data?.notifications ?? [];
  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <StudentLayout activeSidebarItem="Notifications">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-primary">Notifications</h3>
            {unread > 0 && (
              <p className="text-sm text-muted-foreground mt-1">{unread} unread notification{unread > 1 ? "s" : ""}</p>
            )}
          </div>
          {unread > 0 && (
            <Button variant="outline" className="gap-2" onClick={() => markAll.mutate()} disabled={markAll.isPending}>
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </Button>
          )}
        </div>

        {isLoading ? (
          <p className="text-muted-foreground text-center py-8">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No notifications yet.</p>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {notifications.map((n) => (
              <Card
                key={n.id}
                className={`p-5 flex items-start gap-4 cursor-pointer transition-colors ${!n.isRead ? "bg-primary/5 border-primary/20" : ""}`}
                onClick={() => { if (!n.isRead) markRead.mutate(n.id); }}
              >
                <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${!n.isRead ? "bg-primary" : "bg-transparent"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`font-semibold text-sm ${!n.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                      {n.title}
                    </h4>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{n.message}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
