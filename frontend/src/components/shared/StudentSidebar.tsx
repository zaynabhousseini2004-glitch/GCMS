"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  TicketCheck,
  Shirt,
  BookOpen,
  Home,
  User,
} from "lucide-react";
import { studentRoutes } from "@/lib/routes";
import { useCampusId } from "@/hooks/useCampusId";

interface StudentSidebarProps {
  activeItem?: string;
}

export function StudentSidebar({
  activeItem = "Dashboard",
}: StudentSidebarProps) {
  const campusId = useCampusId();
  const r = studentRoutes(campusId);

  const NAV_ITEMS = [
    { label: "Home", icon: Home, id: "Home", href: r.home },
    { label: "Dashboard", icon: LayoutDashboard, id: "Dashboard", href: r.dashboard },
    { label: "Ceremony", icon: Calendar, id: "Ceremony", href: r.ceremony },
    { label: "Tickets", icon: TicketCheck, id: "Tickets", href: r.tickets },
    { label: "Outfit", icon: Shirt, id: "Outfit", href: r.outfit },
    { label: "Reservations", icon: BookOpen, id: "Reservations", href: r.reservations },
    { label: "Profile", icon: User, id: "Profile", href: r.profile },
  ];
  return (
    <aside className="w-[260px] bg-primary fixed left-0 top-16 bottom-0 text-primary-foreground overflow-y-auto z-10">
      <nav className="flex flex-col py-4">
        {NAV_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04, duration: 0.35, ease: "easeOut" }}
            >
            <Link
              href={item.href}
              className={`flex items-center gap-3 px-4 h-[44px] transition-colors w-full text-left ${
                isActive
                  ? "bg-sidebar-accent font-medium"
                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground/60 hover:text-primary-foreground"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${isActive ? "text-primary-foreground" : "text-muted-foreground/60"}`}
              />
              <span className="text-sm">{item.label}</span>
            </Link>
            </motion.div>
          );
        })}
      </nav>
    </aside>
  );
}
