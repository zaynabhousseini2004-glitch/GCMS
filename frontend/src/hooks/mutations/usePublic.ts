"use client";

import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/lib/api";

// ─── Query keys ───────────────────────────────────────────────────────────────

export const publicKeys = {
  campuses: ["public", "campuses"] as const,
  campusCeremonies: (campusId: number) =>
    ["public", "campuses", campusId, "ceremonies"] as const,
  campusCeremony: (campusId: number, id: number) =>
    ["public", "campuses", campusId, "ceremonies", id] as const,
  campusOutfits: (campusId: number) =>
    ["public", "campuses", campusId, "outfits"] as const,
  campusDepartmentHeads: (campusId: number) =>
    ["public", "campuses", campusId, "department-heads"] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export function usePublicCampuses() {
  return useQuery({
    queryKey: publicKeys.campuses,
    queryFn: publicApi.getCampuses,
  });
}

export function usePublicCampusCeremonies(campusId: number) {
  return useQuery({
    queryKey: publicKeys.campusCeremonies(campusId),
    queryFn: () => publicApi.getCampusCeremonies(campusId),
    enabled: !!campusId,
  });
}

export function usePublicCampusCeremonyById(campusId: number, id: number) {
  return useQuery({
    queryKey: publicKeys.campusCeremony(campusId, id),
    queryFn: () => publicApi.getCampusCeremonyById(campusId, id),
    enabled: !!campusId && !!id,
  });
}

export function usePublicCampusOutfits(campusId: number) {
  return useQuery({
    queryKey: publicKeys.campusOutfits(campusId),
    queryFn: () => publicApi.getCampusOutfits(campusId),
    enabled: !!campusId,
  });
}

export function usePublicCampusDepartmentHeads(campusId: number) {
  return useQuery({
    queryKey: publicKeys.campusDepartmentHeads(campusId),
    queryFn: () => publicApi.getCampusDepartmentHeads(campusId),
    enabled: !!campusId,
  });
}
