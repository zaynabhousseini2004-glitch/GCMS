"use client";

import { VendorLayout } from "@/components/shared";
import { Card } from "@/components/ui";
import { useMyVendorRequests } from "@/hooks/mutations/useVendor";
import { VendorRequestStatus } from "@/lib/enums";
import { ClipboardList, CheckCircle2, Clock, XCircle } from "lucide-react";

export function VendorDashboard() {
  const { data, isLoading } = useMyVendorRequests();
  const requests = data?.requests ?? [];

  const stats = [
    {
      label: "Total Requests",
      value: requests.length,
      icon: <ClipboardList className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      label: "Pending",
      value: requests.filter((r) => r.requestStatus === VendorRequestStatus.PENDING).length,
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      bg: "bg-amber-50",
    },
    {
      label: "In Progress",
      value: requests.filter((r) => r.requestStatus === VendorRequestStatus.IN_PROGRESS).length,
      icon: <ClipboardList className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      label: "Completed",
      value: requests.filter((r) => r.requestStatus === VendorRequestStatus.COMPLETED).length,
      icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
      bg: "bg-green-50",
    },
  ];

  return (
    <VendorLayout activeSidebarItem="Dashboard">
      <div className="flex flex-col gap-6">
        <h3 className="text-2xl font-semibold text-primary">Vendor Dashboard</h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className={`${stat.bg} border-0 shadow-sm p-5`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</span>
                <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {isLoading ? "—" : stat.value}
              </p>
            </Card>
          ))}
        </div>

        <Card className="shadow-sm p-6">
          <h4 className="font-semibold text-foreground mb-4">Recent Requests</h4>
          {requests.slice(0, 5).length === 0 ? (
            <p className="text-muted-foreground text-sm">No recent requests.</p>
          ) : (
            <div className="space-y-3">
              {requests.slice(0, 5).map((r) => (
                <div key={r.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="font-medium text-sm">{r.requestTitle}</span>
                  <span className="text-xs text-muted-foreground">{r.requestStatus}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </VendorLayout>
  );
}
