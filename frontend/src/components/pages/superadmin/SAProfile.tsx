"use client";

import { SuperadminLayout } from "@/components/shared";
import { ProfilePage } from "@/components/pages/ProfilePage";

export function SAProfile() {
  return <ProfilePage Layout={SuperadminLayout} />;
}
