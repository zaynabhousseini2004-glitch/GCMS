"use client";

import { SuperadminLayout, LandingContent } from "@/components/shared";

export function SAHome() {
  return (
    <SuperadminLayout activeSidebarItem="Home">
      <LandingContent />
    </SuperadminLayout>
  );
}
