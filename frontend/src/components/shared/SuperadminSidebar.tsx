"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  UserCog,
  Users,
  BookOpen,
  User,
} from "lucide-react";
import { ROUTES } from "@/lib/routes";
// Superadmin is global — no campusId needed

const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    id: "Dashboard",
    href: ROUTES.superadmin.dashboard,
  },
  {
    label: "Campuses",
    icon: Building2,
    id: "Campuses",
    href: ROUTES.superadmin.campuses,
  },
  {
    label: "Campus Admins",
    icon: UserCog,
    id: "Campus Admins",
    href: ROUTES.superadmin.campusAdmins,
  },
  { label: "Users", icon: Users, id: "Users", href: ROUTES.superadmin.users },
  {
    label: "Dept Titles",
    icon: BookOpen,
    id: "Dept Titles",
    href: ROUTES.superadmin.deptTitles,
  },
  {
    label: "Profile",
    icon: User,
    id: "Profile",
    href: ROUTES.superadmin.profile,
  },
];

interface SuperadminSidebarProps {
  activeItem?: string;
}

export function SuperadminSidebar({
  activeItem = "Dashboard",
}: SuperadminSidebarProps) {
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
