import { useMutation } from "@tanstack/react-query";
import { authService, UpdateProfileData, AuthResponse, ProfileFormData } from "../lib/api/services";

export const useUpdateProfile = () => {
  return useMutation<AuthResponse, Error, UpdateProfileData>({
    mutationFn: (data: UpdateProfileData) => {
      const formData = new FormData();
      
      // Add profile image if present
      if (data.profileImage) {
        formData.append('profileImage', data.profileImage);
      }
      
      // Add profile fields as JSON
      const profile: { firstName?: string; lastName?: string; address?: string; phoneNumber?: string } = {};
      if (data.firstName) profile.firstName = data.firstName;
      if (data.lastName) profile.lastName = data.lastName;
      if (data.address) profile.address = data.address;
      if (data.phoneNumber) profile.phoneNumber = data.phoneNumber;
      
      formData.append('profile', JSON.stringify(profile));
      
      // Add password fields
      if (data.password) formData.append('password', data.password);
      if (data.newPassword) formData.append('newPassword', data.newPassword);
      if (data.newPasswordAgain) formData.append('newPasswordAgain', data.newPasswordAgain);
      
      return authService.updateProfile(formData);
    },
    retry: false,
  });
};
