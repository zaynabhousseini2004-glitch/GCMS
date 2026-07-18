"use client";

import { Navbar, Footer, LandingContent } from "@/components/shared";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-inter flex flex-col">
      <Navbar activePage="Home" />

      <LandingContent />

      <Footer />
    </div>
  );
}
