"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { superadminApi } from "@/lib/api";
import type {
  CreateAdminRequest,
  UpdateAdminRequest,
  CreateCampusRequest,
  UpdateCampusRequest,
  CreateDepartmentTitleRequest,
  UpdateDepartmentTitleRequest,
} from "@/lib/api/types";

// ─── Query keys ───────────────────────────────────────────────────────────────

export const superadminKeys = {
  users: ["superadmin", "users"] as const,
  user: (id: number) => ["superadmin", "users", id] as const,
  campuses: ["superadmin", "campuses"] as const,
  campus: (id: number) => ["superadmin", "campuses", id] as const,
  campusAdmins: (campusId: number) =>
    ["superadmin", "campuses", campusId, "admins"] as const,
  departmentTitles: ["superadmin", "department-titles"] as const,
};

// ─── Users (Admin accounts) ───────────────────────────────────────────────────

export function useAdminUsers() {
  return useQuery({
    queryKey: superadminKeys.users,
    queryFn: superadminApi.getAdminUsers,
  });
}

export function useAdminUserById(id: number) {
  return useQuery({
    queryKey: superadminKeys.user(id),
    queryFn: () => superadminApi.getAdminUserById(id),
    enabled: !!id,
  });
}

/** Mutation: create a new admin account */
export function useCreateAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateAdminRequest) => superadminApi.createAdmin(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: superadminKeys.users }),
  });
}

/** Mutation: update an admin account's details */
export function useUpdateAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateAdminRequest }) =>
      superadminApi.updateAdminUser(id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: superadminKeys.users });
      qc.invalidateQueries({ queryKey: superadminKeys.user(id) });
    },
  });
}

/** Mutation: deactivate an admin account */
export function useDeactivateAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => superadminApi.deactivateAdminUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: superadminKeys.users }),
  });
}

/** Mutation: reactivate a deactivated admin account */
export function useActivateAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => superadminApi.activateAdminUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: superadminKeys.users }),
  });
}

// ─── Campuses ─────────────────────────────────────────────────────────────────

export function useCampuses() {
  return useQuery({
    queryKey: superadminKeys.campuses,
    queryFn: superadminApi.getCampuses,
  });
}

export function useCampusById(id: number) {
  return useQuery({
    queryKey: superadminKeys.campus(id),
    queryFn: () => superadminApi.getCampusById(id),
    enabled: !!id,
  });
}

/** Mutation: create a new campus */
export function useCreateCampus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateCampusRequest) => superadminApi.createCampus(body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: superadminKeys.campuses }),
  });
}

/** Mutation: update a campus's details */
export function useUpdateCampus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateCampusRequest }) =>
      superadminApi.updateCampus(id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: superadminKeys.campuses });
      qc.invalidateQueries({ queryKey: superadminKeys.campus(id) });
    },
  });
}

/** Mutation: delete a campus */
export function useDeleteCampus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => superadminApi.deleteCampus(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: superadminKeys.campuses }),
  });
}

// ─── Campus ↔ Admin Assignment ────────────────────────────────────────────────

export function useCampusAdmins(campusId: number) {
  return useQuery({
    queryKey: superadminKeys.campusAdmins(campusId),
    queryFn: () => superadminApi.getCampusAdmins(campusId),
    enabled: !!campusId,
  });
}

/** Mutation: assign an existing admin to a campus */
export function useAssignAdminToCampus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      campusId,
      adminId,
    }: {
      campusId: number;
      adminId: number;
    }) => superadminApi.assignAdminToCampus(campusId, adminId),
    onSuccess: (_, { campusId }) =>
      qc.invalidateQueries({
        queryKey: superadminKeys.campusAdmins(campusId),
      }),
  });
}

/** Mutation: remove an admin's campus assignment */
export function useRemoveAdminFromCampus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      campusId,
      adminId,
    }: {
      campusId: number;
      adminId: number;
    }) => superadminApi.removeAdminFromCampus(campusId, adminId),
    onSuccess: (_, { campusId }) =>
      qc.invalidateQueries({
        queryKey: superadminKeys.campusAdmins(campusId),
      }),
  });
}

// ─── Department Titles ────────────────────────────────────────────────────────

export function useDepartmentTitles() {
  return useQuery({
    queryKey: superadminKeys.departmentTitles,
    queryFn: superadminApi.getDepartmentTitles,
  });
}

/** Mutation: create a new department title */
export function useCreateDepartmentTitle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateDepartmentTitleRequest) =>
      superadminApi.createDepartmentTitle(body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: superadminKeys.departmentTitles }),
  });
}

/** Mutation: update an existing department title */
export function useUpdateDepartmentTitle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: UpdateDepartmentTitleRequest;
    }) => superadminApi.updateDepartmentTitle(id, body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: superadminKeys.departmentTitles }),
  });
}

/** Mutation: delete a department title */
export function useDeleteDepartmentTitle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => superadminApi.deleteDepartmentTitle(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: superadminKeys.departmentTitles }),
  });
}

