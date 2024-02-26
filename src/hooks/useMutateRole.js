import { useMutation } from "@tanstack/react-query";
import { createRoleQuery } from "./queries";

const useMutateRole = () => {
  const {
    mutate: mutateRole,
    data,
    error,
    isError,
    isLoading,
  } = useMutation({
    mutationFn: (formData) => createRoleQuery(formData),
  });

  return {
    mutateRole,
    data,
    error,
    isError,
    isLoading,
  };
};

export default useMutateRole;
