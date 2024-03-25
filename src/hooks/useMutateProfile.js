import { useMutation } from "@tanstack/react-query";
import { editProfileQuery } from "./queries";

const useMutateProfile = () => {
  const {
    mutate: mutateProfile,
    data,
    error,
    isError,
    isLoading,
  } = useMutation({
    mutationFn: ({ formData, isJson }) => {
      return editProfileQuery(formData, isJson);
    },
  });

  return {
    mutateProfile,
    data,
    error,
    isError,
    isLoading,
  };
};

export default useMutateProfile;
