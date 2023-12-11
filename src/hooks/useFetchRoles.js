import { useQuery } from "@tanstack/react-query";
import { getRolesQuery } from "./queries";
import { ROLES_KEY } from "./queryKeys";

const useFetchRoles = () => {
  const {
    data: roles,
    isLoading,
    refetch: refetchRoles,
  } = useQuery({
    queryKey: [ROLES_KEY],
    queryFn: getRolesQuery,
    enabled: true,
  });

  return { roles, refetchRoles, isLoading };
};

export default useFetchRoles;
