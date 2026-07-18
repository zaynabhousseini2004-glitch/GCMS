"use client";

import { AdminLayout } from "@/components/shared";
import { ProfilePage } from "@/components/pages/ProfilePage";

export function AdminProfile() {
  return <ProfilePage Layout={AdminLayout} />;
}
