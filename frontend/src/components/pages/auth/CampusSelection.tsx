"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowRight, MapPin } from "lucide-react";
import { Card } from "@/components/ui";
import { usePublicCampuses } from "@/hooks/mutations/usePublic";
import { useAuth } from "@/providers/AuthProvider";
import { authApi } from "@/lib/api";
import { UserRole } from "@/lib/enums";
import { adminRoutes, studentRoutes, vendorRoutes } from "@/lib/routes";

export default function CampusSelection() {
  const router = useRouter();
  const { user, isAuthenticated, login } = useAuth();
  const { data, isLoading } = usePublicCampuses();
  const campuses = data?.campuses ?? [];
  const [selecting, setSelecting] = useState(false);

  // Guard: unauthenticated → login; already has campus → skip selection.
  useEffect(() => {
    if (!isAuthenticated) { router.replace("/login"); return; }
    if (!user) return;
    if (user.campusId) {
      // Campus already assigned — bypass this page entirely so the user
      // cannot accidentally overwrite their campus by clicking a different card.
      const id = user.campusId;
      if (user.role === UserRole.ADMIN) {
        router.replace(adminRoutes(id).home);
      } else if (user.role === UserRole.STUDENT) {
        router.replace(studentRoutes(id).home);
      } else if (user.role === UserRole.VENDOR) {
        router.replace(
          user.vendorApprovalStatus === "APPROVED"
            ? vendorRoutes(id).dashboard
            : vendorRoutes(id).pending,
        );
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSelect = async (campusId: number) => {
    if (!user || selecting) return;
    setSelecting(true);
    try {
      // Save campusId in DB and get a new token with campusId included
      const data = await authApi.selectCampus(campusId);
      login(data.token, data.user);
      if (user.role === UserRole.ADMIN) {
        router.push(adminRoutes(campusId).dashboard);
      } else if (user.role === UserRole.STUDENT) {
        router.push(studentRoutes(campusId).ceremony);
      } else if (user.role === UserRole.VENDOR) {
        const isApproved = data.user.vendorApprovalStatus === "APPROVED";
        router.push(
          isApproved
            ? vendorRoutes(campusId).dashboard
            : vendorRoutes(campusId).pending,
        );
      }
    } catch (err) {
      console.error("Failed to select campus", err);
      setSelecting(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-6 font-inter bg-primary">
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70">
        <div className="absolute inset-0 bg-foreground/40"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        <div className="mb-10 text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-background/10 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm border border-primary-foreground/20">
            <GraduationCap className="w-12 h-12 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4 tracking-tight text-center">
            Welcome to Graduation Ceremony Portal
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-lg text-center">
            Select your campus to continue to your dedicated graduation
            dashboard and manage your ceremony details.
          </p>
        </div>

        {isLoading ? (
          <p className="text-primary-foreground/70">Loading campuses...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
            {campuses.map((campus) => (
              <Card
                key={campus.id}
                onClick={() => handleSelect(campus.id)}
                className="group bg-background p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border-l-4 border-l-transparent hover:border-l-accent overflow-hidden"
              >
                <div className="flex justify-between items-center h-full">
                  <div className="flex flex-col">
                    <h4 className="text-xl font-bold text-primary mb-2 group-hover:text-primary transition-colors">
                      {campus.name}
                    </h4>
                    {campus.location && (
                      <div className="flex items-center text-muted-foreground text-sm">
                        <MapPin className="w-4 h-4 mr-1.5 opacity-70" />
                        {campus.location}
                      </div>
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/5 group-hover:bg-accent/10 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-5 h-5 text-accent transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
