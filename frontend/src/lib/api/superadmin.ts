import { apiRequest } from "@/lib/api-client";
import type {
  AdminUser,
  CreateAdminRequest,
  UpdateAdminRequest,
  Campus,
  CreateCampusRequest,
  UpdateCampusRequest,
  CampusAdmin,
  DepartmentTitle,
  CreateDepartmentTitleRequest,
  UpdateDepartmentTitleRequest,
} from "@/lib/api/types";

// ─── Users (Admin accounts) ───────────────────────────────────────────────────

/** POST /api/superadmin/users — Create a new admin account */
export function createAdmin(
  body: CreateAdminRequest,
): Promise<{ user: AdminUser }> {
  return apiRequest<{ user: AdminUser }>("/superadmin/users", {
    method: "POST",
    body,
  });
}

/** GET /api/superadmin/users */
export function getAdminUsers(): Promise<{ users: AdminUser[] }> {
  return apiRequest<{ users: AdminUser[] }>("/superadmin/users");
}

/** GET /api/superadmin/users/:id */
export function getAdminUserById(id: number): Promise<{ user: AdminUser }> {
  return apiRequest<{ user: AdminUser }>(`/superadmin/users/${id}`);
}

/** PATCH /api/superadmin/users/:id */
export function updateAdminUser(
  id: number,
  body: UpdateAdminRequest,
): Promise<{ user: AdminUser }> {
  return apiRequest<{ user: AdminUser }>(`/superadmin/users/${id}`, {
    method: "PATCH",
    body,
  });
}

/** PATCH /api/superadmin/users/:id/deactivate */
export function deactivateAdminUser(id: number): Promise<{ user: AdminUser }> {
  return apiRequest<{ user: AdminUser }>(
    `/superadmin/users/${id}/deactivate`,
    { method: "PATCH" },
  );
}

/** PATCH /api/superadmin/users/:id/activate */
export function activateAdminUser(id: number): Promise<{ user: AdminUser }> {
  return apiRequest<{ user: AdminUser }>(`/superadmin/users/${id}/activate`, {
    method: "PATCH",
  });
}

// ─── Campuses ─────────────────────────────────────────────────────────────────

/** POST /api/superadmin/campuses */
export function createCampus(
  body: CreateCampusRequest,
): Promise<{ campus: Campus }> {
  return apiRequest<{ campus: Campus }>("/superadmin/campuses", {
    method: "POST",
    body,
  });
}

/** GET /api/superadmin/campuses */
export function getCampuses(): Promise<{ campuses: Campus[] }> {
  return apiRequest<{ campuses: Campus[] }>("/superadmin/campuses");
}

/** GET /api/superadmin/campuses/:id */
export function getCampusById(id: number): Promise<{ campus: Campus }> {
  return apiRequest<{ campus: Campus }>(`/superadmin/campuses/${id}`);
}

/** PATCH /api/superadmin/campuses/:id */
export function updateCampus(
  id: number,
  body: UpdateCampusRequest,
): Promise<{ campus: Campus }> {
  return apiRequest<{ campus: Campus }>(`/superadmin/campuses/${id}`, {
    method: "PATCH",
    body,
  });
}

/** DELETE /api/superadmin/campuses/:id */
export function deleteCampus(id: number): Promise<void> {
  return apiRequest<void>(`/superadmin/campuses/${id}`, {
    method: "DELETE",
  });
}

// ─── Campus ↔ Admin Assignment ────────────────────────────────────────────────

/** GET /api/superadmin/campuses/:id/admins */
export function getCampusAdmins(
  campusId: number,
): Promise<{ admins: CampusAdmin[] }> {
  return apiRequest<{ admins: CampusAdmin[] }>(
    `/superadmin/campuses/${campusId}/admins`,
  );
}

/** POST /api/superadmin/campuses/:id/admins — Assign an admin to a campus */
export function assignAdminToCampus(
  campusId: number,
  adminId: number,
): Promise<void> {
  return apiRequest<void>(`/superadmin/campuses/${campusId}/admins`, {
    method: "POST",
    body: { adminId },
  });
}

/** DELETE /api/superadmin/campuses/:id/admins/:adminId */
export function removeAdminFromCampus(
  campusId: number,
  adminId: number,
): Promise<void> {
  return apiRequest<void>(
    `/superadmin/campuses/${campusId}/admins/${adminId}`,
    { method: "DELETE" },
  );
}

// ─── Department Titles ────────────────────────────────────────────────────────

/** GET /api/superadmin/department-titles */
export function getDepartmentTitles(): Promise<{
  departmentTitles: DepartmentTitle[];
}> {
  return apiRequest<{ departmentTitles: DepartmentTitle[] }>(
    "/superadmin/department-titles",
  );
}

/** POST /api/superadmin/department-titles */
export function createDepartmentTitle(
  body: CreateDepartmentTitleRequest,
): Promise<{ departmentTitle: DepartmentTitle }> {
  return apiRequest<{ departmentTitle: DepartmentTitle }>(
    "/superadmin/department-titles",
    { method: "POST", body },
  );
}

/** PATCH /api/superadmin/department-titles/:id */
export function updateDepartmentTitle(
  id: number,
  body: UpdateDepartmentTitleRequest,
): Promise<{ departmentTitle: DepartmentTitle }> {
  return apiRequest<{ departmentTitle: DepartmentTitle }>(
    `/superadmin/department-titles/${id}`,
    { method: "PATCH", body },
  );
}

/** DELETE /api/superadmin/department-titles/:id */
export function deleteDepartmentTitle(id: number): Promise<void> {
  return apiRequest<void>(`/superadmin/department-titles/${id}`, {
    method: "DELETE",
  });
}

