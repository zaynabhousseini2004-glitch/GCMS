"use client";

import { AdminLayout } from "@/components/shared";
import {
  Users,
  Calendar,
  Clock,
  TicketCheck,
  Shirt,
  Building,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui";
import { useAdminDashboard } from "@/hooks/mutations/useAdmin";
import { PageWrapper, StaggerContainer, StaggerItem, FadeUp } from "@/components/shared/motion";

export function AdminDashboard() {
  const { data, isLoading } = useAdminDashboard();
  const stats_data = data?.stats;

  const stats = [
    { label: "Students", value: stats_data?.totalStudents ?? "—", icon: Users },
    { label: "Total Ceremonies", value: stats_data?.totalCeremonies ?? "—", icon: Calendar },
    { label: "Upcoming Ceremonies", value: stats_data?.upcomingCeremonies ?? "—", icon: Clock },
    { label: "Tickets Issued", value: stats_data?.totalTicketsIssued ?? "—", icon: TicketCheck },
    { label: "Outfit Rentals", value: stats_data?.totalOutfitRentals ?? "—", icon: Shirt },
    { label: "Approved Vendors", value: stats_data?.totalVendors ?? "—", icon: Building },
  ];

  return (
    <AdminLayout activeSidebarItem="Dashboard">
      <PageWrapper className="flex flex-col gap-6">
        <FadeUp>
          <h2 className="text-2xl font-semibold text-primary">Dashboard Overview</h2>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <StaggerItem key={i}>
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <s.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">{s.label}</p>
                    <h3 className="text-2xl font-bold text-primary">
                      {isLoading ? "..." : String(s.value)}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </PageWrapper>
    </AdminLayout>
  );
}
