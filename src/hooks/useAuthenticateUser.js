import { useMutation } from "@tanstack/react-query";
import { authenticateUserQuery } from "./queries";

const useAuthenticateUser = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    isSuccess,
    mutate: authenticate,
  } = useMutation({
    mutationFn: (formData) => authenticateUserQuery(formData),
    retry: false,
  });

  return { authenticate, data, error, isError, isLoading, isSuccess };
};

export default useAuthenticateUser;
