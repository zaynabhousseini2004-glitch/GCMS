import { getToken } from "@/lib/api-client";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

async function uploadFile<T>(endpoint: string, file: File): Promise<T> {
  const formData = new FormData();
  formData.append("image", file);

  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ message: res.statusText }));
    const msg = (errData as { message?: string }).message ?? res.statusText;
    throw new Error(msg);
  }

  return res.json() as Promise<T>;
}

// Upload the current user's avatar
export function uploadAvatar(
  file: File,
): Promise<{ message: string; user: { id: number; fullName: string; avatarUrl: string } }> {
  return uploadFile("/upload/avatar", file);
}

// Upload an outfit image (admin)
export function uploadOutfitImage(
  outfitId: number,
  file: File,
): Promise<{ message: string; outfit: { id: number; outfitType: string; imageUrl: string } }> {
  return uploadFile(`/upload/outfit/${outfitId}`, file);
}

// Upload a ceremony banner (admin)
export function uploadCeremonyBanner(
  ceremonyId: number,
  file: File,
): Promise<{ message: string; ceremony: { id: number; title: string; bannerUrl: string } }> {
  return uploadFile(`/upload/ceremony/${ceremonyId}`, file);
}

// Upload a campus image (superadmin)
export function uploadCampusImage(
  campusId: number,
  file: File,
): Promise<{ message: string; campus: { id: number; name: string; imageUrl: string } }> {
  return uploadFile(`/upload/campus/${campusId}`, file);
}

// Upload a service offering image (admin)
export function uploadServiceImage(
  serviceId: number,
  file: File,
): Promise<{ message: string; service: { id: number; title: string; imageUrl: string } }> {
  return uploadFile(`/upload/service/${serviceId}`, file);
}

// Upload a department head photo (admin)
export function uploadDepartmentHeadPhoto(
  headId: number,
  file: File,
): Promise<{ message: string; departmentHead: { id: number; name: string; photoUrl: string } }> {
  return uploadFile(`/upload/department-head/${headId}`, file);
}
