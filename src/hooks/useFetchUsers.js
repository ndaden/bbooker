import { useQuery } from "@tanstack/react-query";
import { getUsersQuery } from "./queries";
import { USERS_KEY } from "./queryKeys";

const useFetchUsers = () => {
  const {
    data: users,
    isLoading,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: [USERS_KEY],
    queryFn: getUsersQuery,
    enabled: true,
  });

  return { users, refetchUsers, isLoading };
};

export default useFetchUsers;
