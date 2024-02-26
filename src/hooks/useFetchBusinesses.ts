import { useQuery } from "@tanstack/react-query";
import { getBusinessesQuery } from "./queries";
import { BUSINESSES_KEY } from "./queryKeys";

type BusinessRequest = {
  id?: string;
  ownerid?: string;
};

const useFetchBusinesses = (request: BusinessRequest) => {
  const {
    data,
    isLoading,
    refetch: refetchBusinesses,
    error,
    isError,
  } = useQuery({
    queryKey: !!request?.id
      ? [BUSINESSES_KEY, request?.id]
      : !!request?.ownerid
      ? [BUSINESSES_KEY, "OWNER", request?.ownerid]
      : [BUSINESSES_KEY],
    queryFn: () =>
      getBusinessesQuery({ id: request?.id, ownerid: request?.ownerid }),
    enabled: true,
  });

  return {
    businesses: data,
    refetchBusinesses,
    isLoading,
    isError,
    error,
  };
};

export default useFetchBusinesses;
