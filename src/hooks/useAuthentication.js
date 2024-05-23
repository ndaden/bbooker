import { useQuery } from "@tanstack/react-query";
import { getUserQuery, logoutUserQuery } from "./queries";
import { useQueryClient } from "@tanstack/react-query";

const useAuthentication = (enabled = false) => {
  const queryCache = useQueryClient();
  const {
    data,
    isLoading,
    isError,
    error,
    refetch: getUserData,
  } = useQuery({
    queryFn: getUserQuery,
    queryKey: ["AUTHENTICATED_USER"],
    enabled: enabled,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const logout = async (redirectTo = "/") => {
    await queryCache.removeQueries({ queryKey: ["AUTHENTICATED_USER"] });
    await logoutUserQuery();
    // await getUserData();
    window.location.href = redirectTo;
  };

  return {
    getUserData,
    data,
    error,
    isError,
    isLoading,
    logout,
  };
};

export default useAuthentication;
