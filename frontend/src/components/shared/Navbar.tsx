"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui";

export interface NavbarProps {
  activePage?: string;
}

export function Navbar(_props: NavbarProps = {}) {
  return (
    <header className="h-16 w-full bg-primary text-primary-foreground flex items-center justify-between px-6 sticky top-0 z-50 shadow-md">
      {/* Left: logos */}
      <div className="flex items-center gap-3">
        <Image
          src="/liulogo.png"
          alt="LIU Logo"
          width={40}
          height={40}
          className="object-contain"
        />
        <div className="w-px h-8 bg-primary-foreground/30" />
        <Image
          src="/GCMS_logo.png"
          alt="GCMS Logo"
          width={40}
          height={40}
          className="object-contain"
        />
      </div>

      <div className="flex-1" />

      {/* Right: login button */}
      <div className="flex items-center">
        <Button
          asChild
          variant="outline"
          className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
        >
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </header>
  );
}
