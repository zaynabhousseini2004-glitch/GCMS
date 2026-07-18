"use client";

import { StudentLayout } from "@/components/shared";
import {
  Calendar,
  TicketCheck,
  Shirt,
  BookOpen,
  Clock,
  Bell,
  MapPin,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from "@/components/ui";
import { useStudentDashboard } from "@/hooks/mutations/useStudent";
import { PageWrapper, StaggerContainer, StaggerItem, FadeUp } from "@/components/shared/motion";

export function StudentDashboard() {
  const { data, isLoading } = useStudentDashboard();
  const stats_data = data?.stats;
  const upcomingCeremonies = data?.upcomingCeremonies ?? [];
  const recentNotifications = data?.recentNotifications ?? [];

  const stats = [
    { label: "My Tickets", value: isLoading ? "…" : String(stats_data?.totalTickets ?? 0), icon: TicketCheck },
    { label: "Rented Outfits", value: isLoading ? "…" : String(stats_data?.rentedOutfitsCount ?? 0), icon: Shirt },
    { label: "Reservations", value: isLoading ? "…" : String(stats_data?.totalReservations ?? 0), icon: BookOpen },
  ];

  const ceremonyStatusBadge = (status: string) => {
    if (status === "ACTIVE") return "bg-green-100 text-green-800 hover:bg-green-100";
    if (status === "UPCOMING") return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    return "bg-muted text-foreground";
  };

  return (
    <StudentLayout activeSidebarItem="Dashboard">
      <PageWrapper className="flex flex-col gap-6">
        <FadeUp>
          <h2 className="text-2xl font-semibold text-primary">Student Dashboard</h2>
        </FadeUp>

        {/* Stats */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <StaggerItem key={i}>
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <s.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">{s.label}</p>
                    <h3 className="text-lg font-bold text-primary">{s.value}</h3>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Upcoming Ceremonies */}
        <FadeUp delay={0.2}>
          <Card className="shadow-sm">
          <CardHeader className="px-6 py-4 border-b border-border">
            <CardTitle className="text-lg font-semibold text-primary flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Upcoming Ceremonies
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            {isLoading ? (
              <p className="text-sm text-muted-foreground text-center py-4">Loading...</p>
            ) : upcomingCeremonies.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No upcoming ceremonies.</p>
            ) : upcomingCeremonies.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-4 rounded-lg bg-muted">
                <div>
                  <h4 className="font-semibold text-foreground">{c.title}</h4>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(c.ceremonyDate).toLocaleDateString()}
                    {c.startTime ? ` · ${c.startTime}` : ""}
                    {c.venue ? (
                      <>
                        {" · "}
                        <MapPin className="w-3.5 h-3.5 inline" />
                        {c.venue}
                      </>
                    ) : null}
                  </p>
                </div>
                <Badge variant="secondary" className={ceremonyStatusBadge(c.status)}>
                  {c.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        </FadeUp>

        {/* Recent Notifications */}
        <FadeUp delay={0.3}>
        <Card className="shadow-sm">
          <CardHeader className="px-6 py-4 border-b border-border">
            <CardTitle className="text-lg font-semibold text-primary flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            {isLoading ? (
              <p className="text-sm text-muted-foreground text-center py-4">Loading...</p>
            ) : recentNotifications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No notifications yet.</p>
            ) : recentNotifications.map((n) => (
              <div key={n.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.isRead ? "bg-muted-foreground/40" : "bg-primary"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-sm text-muted-foreground">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        </FadeUp>
      </PageWrapper>
    </StudentLayout>
  );
}

