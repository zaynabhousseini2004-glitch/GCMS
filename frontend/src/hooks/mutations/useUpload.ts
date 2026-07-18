import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as uploadApi from "@/lib/api/upload";

/** Upload the current user's own avatar */
export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadApi.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}

/** Upload an outfit image */
export function useUploadOutfitImage(outfitId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadApi.uploadOutfitImage(outfitId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "outfits"] });
    },
  });
}

/** Upload a ceremony banner */
export function useUploadCeremonyBanner(ceremonyId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadApi.uploadCeremonyBanner(ceremonyId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "ceremonies"] });
    },
  });
}

/** Upload a campus image */
export function useUploadCampusImage(campusId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadApi.uploadCampusImage(campusId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superadmin", "campuses"] });
    },
  });
}

/** Upload a service offering image */
export function useUploadServiceImage(serviceId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadApi.uploadServiceImage(serviceId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
    },
  });
}

/** Upload a department head photo */
export function useUploadDepartmentHeadPhoto(headId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadApi.uploadDepartmentHeadPhoto(headId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "department-heads"] });
    },
  });
}
