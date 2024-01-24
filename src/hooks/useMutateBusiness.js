import { useMutation } from "@tanstack/react-query";
import { createBusinessQuery } from "./queries";

const useMutateBusiness = () => {
  const {
    mutate: mutateBusiness,
    data,
    error,
    isError,
    isLoading,
  } = useMutation({
    mutationFn: (formData) => createBusinessQuery(formData),
  });

  return {
    mutateBusiness,
    data,
    error,
    isError,
    isLoading,
  };
};

export default useMutateBusiness;
