import { useQuery } from "@tanstack/react-query";
import { isAuthenticatedQuery } from "./queries";

const useAuthentication = () => {
  const {
    data: userData,
    isLoading,
    isError,
    error,
    refetch: getUserData,
  } = useQuery({
    queryFn: isAuthenticatedQuery,
    queryKey: ["AUTHENTICATED_USER"],
    enabled: true,
    retry: false,
  });

  return { getUserData, userData, error, isError, isLoading };
};

export default useAuthentication;
