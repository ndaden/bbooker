import { useQuery } from "@tanstack/react-query";
import { getAppointmentsByUserQuery } from "./queries";
import { USER_APPOINTMENTS_KEY } from "./queryKeys";

const useFetchUserAppointments = (userId) => {
  const {
    data: appointments,
    isLoading,
    refetch: refetchAppointments,
  } = useQuery({
    queryKey: [USER_APPOINTMENTS_KEY, userId],
    queryFn: () => getAppointmentsByUserQuery(userId),
    enabled: !!userId,
  });

  return { appointments, refetchAppointments, isLoading };
};

export default useFetchUserAppointments;
