import { useMutation } from "@tanstack/react-query";
import { authService, AuthResponse } from "../lib/api/services";
import { LoginCredentials } from "../types/auth";

type OnSuccessCallback = (data: AuthResponse, variables: LoginCredentials, context?: unknown) => void | Promise<void>;

interface LoginOptions {
  onSuccess?: OnSuccessCallback;
  onMutate?: (variables: LoginCredentials) => unknown;
  onError?: (error: Error) => void;
}

export const useLogin = (options?: LoginOptions) => {
  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    retry: false,
    onSuccess: async (data, variables, context) => {
      // Track auth state to avoid unnecessary API calls
      if (data?.success) {
        localStorage.setItem('auth_state', 'authenticated');
        // Dispatch event to trigger re-evaluation in other tabs/components
        window.dispatchEvent(new Event('auth-state-change'));
      }
      if (options?.onSuccess) {
        await options.onSuccess(data, variables, context);
      }
    },
    onMutate: options?.onMutate,
    onError: options?.onError,
  });
};
