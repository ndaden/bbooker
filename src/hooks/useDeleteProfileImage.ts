import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../lib/api/services";

export const useDeleteProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.deleteProfileImage(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AUTHENTICATED_USER"] });
    },
  });
};