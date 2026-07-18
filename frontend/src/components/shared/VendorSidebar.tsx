"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutDashboard, FileText, User } from "lucide-react";
import { vendorRoutes } from "@/lib/routes";
import { useCampusId } from "@/hooks/useCampusId";

interface VendorSidebarProps {
  activeItem?: string;
}

export function VendorSidebar({
  activeItem = "Dashboard",
}: VendorSidebarProps) {
  const campusId = useCampusId();
  const r = vendorRoutes(campusId);

  const NAV_ITEMS = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      id: "Dashboard",
      href: r.dashboard,
    },
    { label: "Requests", icon: FileText, id: "Requests", href: r.requests },
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
