import { useMutation } from "@tanstack/react-query";
import { authService } from "../lib/api/services";
import { SignupCredentials } from "../lib/api/services";

export const useSignup = () => {
  return useMutation({
    mutationFn: (credentials: SignupCredentials) =>
      authService.signup(credentials),
    retry: false,
  });
};
