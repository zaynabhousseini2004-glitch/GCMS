import { apiRequest } from "@/lib/api-client";
import type {
  AuthResponse,
  RegisterRequest,
  LoginRequest,
} from "@/lib/api/types";

/** POST /api/auth/register — Register a new STUDENT or VENDOR account */
export function register(body: RegisterRequest): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body,
    auth: false,
  });
}

/** POST /api/auth/login — Login with email and password */
export function login(body: LoginRequest): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body,
    auth: false,
  });
}

/** POST /api/auth/select-campus — Save campusId and get updated token */
export function selectCampus(campusId: number): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/select-campus", {
    method: "POST",
    body: { campusId },
  });
}

/** GET /api/auth/me — Get own full profile */
export function getMe(): Promise<{ user: UserProfile }> {
  return apiRequest<{ user: UserProfile }>("/auth/me");
}

export interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
  // Student-specific
  universityId?: string;
  faculty?: string;
  department?: string;
  graduationYear?: number;
  graduationSemester?: string;
}

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  role: string;
  status: string;
  campusId?: number | null;
  avatarUrl?: string | null;
  vendorApprovalStatus?: string | null;
  // Student-specific
  universityId?: string | null;
  faculty?: string | null;
  department?: string | null;
  graduationYear?: number | null;
  graduationSemester?: string | null;
}

/** PATCH /api/auth/profile — Update name and/or phone */
export function updateMyProfile(body: UpdateProfileRequest): Promise<{ user: UserProfile }> {
  return apiRequest<{ user: UserProfile }>("/auth/profile", {
    method: "PATCH",
    body,
  });
}

/** POST /api/auth/change-password — Change own password */
export function changePassword(body: { oldPassword: string; newPassword: string }): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/auth/change-password", {
    method: "POST",
    body,
  });
}
