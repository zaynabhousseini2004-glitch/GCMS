"use client";

import { ReactNode } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { StudentSidebar } from "./StudentSidebar";

interface StudentLayoutProps {
  children: ReactNode;
  activeSidebarItem?: string;
}

export function StudentLayout({
  children,
  activeSidebarItem = "Dashboard",
}: StudentLayoutProps) {
  return (
    <div className="min-h-screen bg-muted font-sans">
      <DashboardHeader />
      <StudentSidebar activeItem={activeSidebarItem} />
      <main className="ml-[260px] p-6 min-h-[calc(100vh-64px)]">
        {children}
      </main>
    </div>
  );
}
