"use client";

import { Clock } from "lucide-react";
import { Button } from "@/components/ui";
import { useAuth } from "@/providers/AuthProvider";

export default function VendorPending() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="bg-background rounded-2xl shadow-lg p-12 max-w-md w-full text-center border border-border">
        <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">Pending Approval</h2>
        <p className="text-muted-foreground mb-8">
          Your vendor account is awaiting review by the admin. You&apos;ll be notified once your account is approved.
        </p>
        <Button variant="outline" onClick={logout} className="w-full">
          Sign Out
        </Button>
      </div>
    </div>
  );
}
