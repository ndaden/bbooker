import { useMutation } from "@tanstack/react-query";
import { authenticateUserQuery } from "./queries";

const useAuthenticateUser = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    mutate: authenticate,
  } = useMutation({
    mutationFn: (formData) => authenticateUserQuery(formData),
  });

  return { authenticate, data, error, isError, isLoading };
};

export default useAuthenticateUser;
