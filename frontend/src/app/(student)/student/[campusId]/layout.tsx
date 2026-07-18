"use client";

import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";


export default function StudentCampusLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ campusId: string }>;
}) {
  const { campusId } = use(params);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || !user) return;
    if (user.campusId && String(user.campusId) !== campusId) {
      router.replace(`/student/${user.campusId}/home`);
    }
  }, [isLoading, user, campusId, router]);

  if (isLoading) return null;
  if (user?.campusId && String(user.campusId) !== campusId) return null;

  return <>{children}</>;
}
