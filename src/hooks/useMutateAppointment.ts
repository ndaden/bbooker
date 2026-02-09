import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { createAppointmentQuery } from "./queries";

const useMutateAppointment = (): {
  mutateAppointment: UseMutationResult<Response, Error, unknown, unknown>["mutate"];
  data: UseMutationResult<Response, Error, unknown, unknown>["data"];
  error: UseMutationResult<Response, Error, unknown, unknown>["error"];
  isError: UseMutationResult<Response, Error, unknown, unknown>["isError"];
  isPending: boolean;
} => {
  const {
    mutate: mutateAppointment,
    data,
    error,
    isError,
    isPending,
  } = useMutation({
    mutationFn: (formData: unknown) => createAppointmentQuery(formData),
  });

  return {
    mutateAppointment,
    data,
    error,
    isError,
    isPending,
  };
};

export default useMutateAppointment;
