"use client";

import { ReactNode } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { SuperadminSidebar } from "./SuperadminSidebar";

interface SuperadminLayoutProps {
  children: ReactNode;
  activeSidebarItem?: string;
}

export function SuperadminLayout({
  children,
  activeSidebarItem = "Dashboard",
}: SuperadminLayoutProps) {
  return (
    <div className="min-h-screen bg-muted font-sans">
      <DashboardHeader />
      <SuperadminSidebar activeItem={activeSidebarItem} />
      <main className="ml-[260px] p-6 min-h-[calc(100vh-64px)]">
        {children}
      </main>
    </div>
  );
}
