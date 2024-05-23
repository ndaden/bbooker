import { useMutation } from "@tanstack/react-query";
import { createAppointmentQuery } from "./queries";

const useMutateAppointment = () => {
  const {
    mutate: mutateAppointment,
    data,
    error,
    isError,
    isLoading,
  } = useMutation({
    mutationFn: (formData) => createAppointmentQuery(formData),
  });

  return {
    mutateAppointment,
    data,
    error,
    isError,
    isLoading,
  };
};

export default useMutateAppointment;
