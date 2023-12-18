import { useQuery } from "@tanstack/react-query";
import { getBusinessesQuery } from "./queries";
import { BUSINESSES_KEY } from "./queryKeys";

const useFetchBusinesses = (id) => {
  const {
    data,
    isLoading,
    refetch: refetchBusinesses,
    error,
    isError,
  } = useQuery({
    queryKey: id ? [BUSINESSES_KEY, id] : [BUSINESSES_KEY],
    queryFn: () => getBusinessesQuery(id),
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
