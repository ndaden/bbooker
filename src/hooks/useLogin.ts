import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { authService, AuthResponse } from "../lib/api/services";
import { LoginCredentials } from "../types/auth";

export const useLogin = (
  options?: UseMutationOptions<AuthResponse, Error, LoginCredentials>
) => {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    retry: false,
    ...options,
  });
};
