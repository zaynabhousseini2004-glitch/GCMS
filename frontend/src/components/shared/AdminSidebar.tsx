"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Calendar,
  TicketCheck,
  Shirt,
  Armchair,
  Store,
  FileText,
  UserCog,
  User,
} from "lucide-react";
import { adminRoutes } from "@/lib/routes";
import { useCampusId } from "@/hooks/useCampusId";

interface AdminSidebarProps {
  activeItem?: string;
}

export function AdminSidebar({ activeItem = "Dashboard" }: AdminSidebarProps) {
  const campusId = useCampusId();
  const r = adminRoutes(campusId);

  const NAV_ITEMS = [
    { label: "Dashboard", icon: LayoutDashboard, id: "Dashboard", href: r.dashboard },
    { label: "Students", icon: Users, id: "Students", href: r.students },
    { label: "Ceremonies", icon: Calendar, id: "Ceremonies", href: r.ceremonies },
    { label: "Tickets", icon: TicketCheck, id: "Tickets", href: r.tickets },
    { label: "Outfits", icon: Shirt, id: "Outfits", href: r.outfits },
    { label: "Seating", icon: Armchair, id: "Seating", href: r.seating },
    { label: "Vendors", icon: Store, id: "Vendors", href: r.vendors },
    { label: "Instructions", icon: FileText, id: "Instructions", href: r.instructions },
    { label: "Dept Heads", icon: UserCog, id: "Dept Heads", href: r.deptHeads },
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
