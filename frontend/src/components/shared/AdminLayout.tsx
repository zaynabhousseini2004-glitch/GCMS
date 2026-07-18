"use client";

import { ReactNode } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { AdminSidebar } from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
  activeSidebarItem?: string;
}

export function AdminLayout({
  children,
  activeSidebarItem = "Dashboard",
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-muted font-sans">
      <DashboardHeader />
      <AdminSidebar activeItem={activeSidebarItem} />
      <main className="ml-[260px] p-6 min-h-[calc(100vh-64px)]">
        {children}
      </main>
    </div>
  );
}
