import { useQuery } from "@tanstack/react-query";
import { getBusinessesQuery } from "./queries";
import { BUSINESSES_KEY } from "./queryKeys";

const useFetchBusinesses = (id) => {
  const {
    data: businesses,
    isLoading,
    refetch: refetchBusinesses,
  } = useQuery({
    queryKey: id ? [BUSINESSES_KEY, id] : [BUSINESSES_KEY],
    queryFn: () => getBusinessesQuery(id),
    enabled: true,
  });

  return { businesses, refetchBusinesses, isLoading };
};

export default useFetchBusinesses;
