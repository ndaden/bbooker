import { useQuery } from "@tanstack/react-query";
import { getFreeSlotsQuery } from "./queries";
import { FREE_SLOTS_KEY } from "./queryKeys";

const useFetchFreeSlots = ({
  businessId,
  startTimeInterval,
  endTimeInterval,
  slotDurationInMinutes,
}) => {
  const {
    data: freeSlots,
    isLoading,
    refetch: refetchFreeSlots,
  } = useQuery({
    queryKey: [
      FREE_SLOTS_KEY,
      businessId,
      startTimeInterval,
      endTimeInterval,
      slotDurationInMinutes,
    ],
    queryFn: () =>
      getFreeSlotsQuery({
        businessId,
        startTimeInterval,
        endTimeInterval,
        slotDurationInMinutes,
      }),
    retry: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled: !!businessId && !!startTimeInterval,
    /* cacheTime: Infinity,
    staleTime: Infinity, */
  });

  return { freeSlots, refetchFreeSlots, isLoading };
};

export default useFetchFreeSlots;
