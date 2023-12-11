import { useMutation } from "@tanstack/react-query";
import { createUserQuery } from "./queries";

const useMutateUser = () => {
  const {
    mutate: mutateUser,
    data,
    error,
    isError,
    isLoading,
  } = useMutation({
    mutationFn: (formData) => createUserQuery(formData),
  });

  return {
    mutateUser,
    data,
    error,
    isError,
    isLoading,
  };
};

export default useMutateUser;
