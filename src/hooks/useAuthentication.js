import { useQuery } from "@tanstack/react-query";
import { isAuthenticatedQuery } from "./queries";
import { useQueryClient } from "@tanstack/react-query";

const useAuthentication = () => {
  const queryCache = useQueryClient();
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

  const logout = async () => {
    await queryCache.removeQueries({ queryKey: ["AUTHENTICATED_USER"] });
    sessionStorage.removeItem("auth_token");
    await getUserData();
  };

  return { getUserData, userData, error, isError, isLoading, logout };
};

export default useAuthentication;
