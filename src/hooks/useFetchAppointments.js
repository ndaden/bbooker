import { useQuery } from "@tanstack/react-query";
import { getAppointmentsQuery } from "./queries";
import { APPOINTMENTS_KEY } from "./queryKeys";

const useFetchAppointments = () => {
  const {
    data: appointments,
    isLoading,
    refetch: refetchAppointments,
  } = useQuery({
    queryKey: [APPOINTMENTS_KEY],
    queryFn: getAppointmentsQuery,
    enabled: true,
  });

  return { appointments, refetchAppointments, isLoading };
};

export default useFetchAppointments;
