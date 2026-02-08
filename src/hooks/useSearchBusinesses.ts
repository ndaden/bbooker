import { useQuery } from "@tanstack/react-query";
import { searchBusinessesQuery } from "./queries";
import { BUSINESSES_KEY } from "./queryKeys";

interface SearchParams {
  query?: string;
  lat?: number | null;
  lng?: number | null;
  radius?: number;
}

const useSearchBusinesses = ({ query, lat, lng, radius = 10 }: SearchParams) => {
  const {
    data,
    isLoading,
    refetch: refetchSearch,
    error,
    isError,
  } = useQuery({
    queryKey: [BUSINESSES_KEY, "SEARCH", query, lat, lng, radius],
    queryFn: () =>
      searchBusinessesQuery({ query, lat, lng, radius }),
    enabled: !!query || (lat !== undefined && lng !== undefined),
  });

  return {
    businesses: data,
    refetchSearch,
    isLoading,
    isError,
    error,
  };
};

export default useSearchBusinesses;
