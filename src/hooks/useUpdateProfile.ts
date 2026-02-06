import { useMutation } from "@tanstack/react-query";
import { authService, UpdateProfileData, AuthResponse } from "../lib/api/services";

export const useUpdateProfile = () => {
  return useMutation<AuthResponse, Error, UpdateProfileData>({
    mutationFn: (data: UpdateProfileData) => authService.updateProfile(data),
    retry: false,
  });
};
