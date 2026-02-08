import { useQuery } from "@tanstack/react-query";
import { getAppointmentsQuery, getAppointmentsByBusinessQuery } from "./queries";
import { APPOINTMENTS_KEY } from "./queryKeys";

const useFetchAppointments = (businessId = null) => {
  const {
    data: appointments,
    isLoading,
    refetch: refetchAppointments,
  } = useQuery({
    queryKey: businessId ? [APPOINTMENTS_KEY, "BUSINESS", businessId] : [APPOINTMENTS_KEY],
    queryFn: () => businessId ? getAppointmentsByBusinessQuery(businessId) : getAppointmentsQuery(),
    enabled: true,
  });

  return { appointments, refetchAppointments, isLoading };
};

export default useFetchAppointments;
