"use client";

import { ReactNode } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { VendorSidebar } from "./VendorSidebar";

interface VendorLayoutProps {
  children: ReactNode;
  activeSidebarItem?: string;
}

export function VendorLayout({
  children,
  activeSidebarItem = "Dashboard",
}: VendorLayoutProps) {
  return (
    <div className="min-h-screen bg-muted font-sans">
      <DashboardHeader />
      <VendorSidebar activeItem={activeSidebarItem} />
      <main className="ml-[260px] p-6 min-h-[calc(100vh-64px)]">
        {children}
      </main>
    </div>
  );
}
