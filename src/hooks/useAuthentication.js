import { useQuery } from "@tanstack/react-query";
import { getUserQuery, logoutUserQuery } from "./queries";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const useAuthentication = () => {
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
    enabled: true,
    staleTime: 100,
    cacheTime: 100,
  });

  const logout = async () => {
    await queryCache.removeQueries({ queryKey: ["AUTHENTICATED_USER"] });
    await logoutUserQuery();
    await getUserData();
  };

  useEffect(() => {
    const refetch = async () => {
      await getUserData();
    };
    refetch();
  }, [isLoading]);

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
