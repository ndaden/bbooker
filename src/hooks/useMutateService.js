import { useMutation } from "@tanstack/react-query";
import { createServiceQuery } from "./queries";

const useMutateService = () => {
  const {
    mutate: mutateService,
    data,
    error,
    isError,
    isLoading,
  } = useMutation({
    mutationFn: (formData) => createServiceQuery(formData),
  });

  return {
    mutateService,
    data,
    error,
    isError,
    isLoading,
  };
};

export default useMutateService;
