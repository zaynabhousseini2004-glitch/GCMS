"use client";

import { useParams } from "next/navigation";


export function useCampusId(): number {
  const params = useParams<{ campusId: string }>();
  return Number(params.campusId);
}
