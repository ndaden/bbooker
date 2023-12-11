import { useQuery } from "@tanstack/react-query";
import { getServicesQuery } from "./queries";
import { SERVICES_KEY } from "./queryKeys";

const useFetchServices = (id, businessId) => {
  const buildKey = () => {
    let key = [SERVICES_KEY];
    if (id) {
      key = [...key, id];
    }
    if (businessId) {
      key = [...key, businessId];
    }
    return key;
  };

  const {
    data: services,
    isLoading,
    refetch: refetchServices,
  } = useQuery({
    queryKey: buildKey(),
    queryFn: () => getServicesQuery(id, businessId),
    enabled: true,
  });

  return { services, refetchServices, isLoading };
};

export default useFetchServices;
