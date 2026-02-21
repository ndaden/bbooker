export interface User {
  id: string;
  email: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    address?: string;
    phoneNumber?: string;
    profileImage?: string;
  };
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  passwordAgain: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  payload?: User;
}

import type { QueryObserverResult } from "@tanstack/react-query";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: (redirectTo?: string) => Promise<void>;
  refetch: () => Promise<QueryObserverResult<User | null, Error>>;
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  address?: string;
}

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  birthDate: string;
  address: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  birthDate: string;
  address: string;
}

export interface AccountInfoData {
  email: string;
}
