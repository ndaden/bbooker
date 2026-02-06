import { useMutation } from "@tanstack/react-query";
import { authService } from "../lib/api/services";
import { LoginCredentials } from "../types/auth";

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    retry: false,
  });
};
