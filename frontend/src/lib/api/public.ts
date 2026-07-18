import { apiRequest } from "@/lib/api-client";
import type { Campus, Ceremony, Outfit, DepartmentHead } from "@/lib/api/types";

/** GET /api/public/campuses — List all campuses */
export function getCampuses(): Promise<{ campuses: Campus[] }> {
  return apiRequest<{ campuses: Campus[] }>("/public/campuses", { auth: false });
}

/** GET /api/public/campuses/:campusId/ceremonies — List ceremonies for a campus */
export function getCampusCeremonies(
  campusId: number,
): Promise<{ ceremonies: Ceremony[] }> {
  return apiRequest<{ ceremonies: Ceremony[] }>(
    `/public/campuses/${campusId}/ceremonies`,
    { auth: false },
  );
}

/** GET /api/public/campuses/:campusId/ceremonies/:id — Get a single ceremony */
export function getCampusCeremonyById(
  campusId: number,
  id: number,
): Promise<{ ceremony: Ceremony }> {
  return apiRequest<{ ceremony: Ceremony }>(
    `/public/campuses/${campusId}/ceremonies/${id}`,
    { auth: false },
  );
}

/** GET /api/public/campuses/:campusId/outfits — List outfits for a campus */
export function getCampusOutfits(
  campusId: number,
): Promise<{ outfits: Outfit[] }> {
  return apiRequest<{ outfits: Outfit[] }>(
    `/public/campuses/${campusId}/outfits`,
    { auth: false },
  );
}

/** GET /api/public/campuses/:campusId/department-heads — List dept. heads for a campus */
export function getCampusDepartmentHeads(
  campusId: number,
): Promise<{ departmentHeads: DepartmentHead[] }> {
  return apiRequest<{ departmentHeads: DepartmentHead[] }>(
    `/public/campuses/${campusId}/department-heads`,
    { auth: false },
  );
}
