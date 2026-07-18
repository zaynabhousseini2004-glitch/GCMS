"use client";

import { SuperadminLayout } from "@/components/shared";
import { Card } from "@/components/ui";
import { useCampuses, useAdminUsers } from "@/hooks/mutations/useSuperadmin";
import { useDepartmentTitles } from "@/hooks/mutations/useSuperadmin";
import { Building2, Users, GraduationCap } from "lucide-react";

export function SADashboard() {
  const { data: campusData } = useCampuses();
  const { data: usersData } = useAdminUsers();
  const { data: titlesData } = useDepartmentTitles();

  const stats = [
    {
      label: "Total Campuses",
      value: campusData?.campuses?.length ?? "—",
      icon: <Building2 className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      label: "Admin Users",
      value: usersData?.users?.length ?? "—",
      icon: <Users className="w-5 h-5 text-purple-600" />,
      bg: "bg-purple-50",
    },
    {
      label: "Department Titles",
      value: titlesData?.departmentTitles?.length ?? "—",
      icon: <GraduationCap className="w-5 h-5 text-green-600" />,
      bg: "bg-green-50",
    },
  ];

  return (
    <SuperadminLayout activeSidebarItem="Dashboard">
      <div className="flex flex-col gap-6">
        <h3 className="text-2xl font-semibold text-primary">Superadmin Dashboard</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className={`${stat.bg} border-0 shadow-sm p-5`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</span>
                <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </Card>
          ))}
        </div>

        {campusData?.campuses && campusData.campuses.length > 0 && (
          <Card className="shadow-sm p-6">
            <h4 className="font-semibold text-foreground mb-4">Campus Overview</h4>
            <div className="space-y-3">
              {campusData.campuses.map((campus) => (
                <div key={campus.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <span className="font-medium text-sm">{campus.name}</span>
                    {campus.location && <span className="text-xs text-muted-foreground ml-2">— {campus.location}</span>}
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>{campus._count?.users ?? 0} users</span>
                    <span>{campus._count?.ceremonies ?? 0} ceremonies</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </SuperadminLayout>
  );
}
