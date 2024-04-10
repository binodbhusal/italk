/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-mixed-operators */
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';

import { useEffect, useState } from 'react';

const useGetCalls = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setisLoading] = useState(false);
  const client = useStreamVideoClient();
  const { user } = useUser();
  useEffect(() => {
    const loadCalls = async () => {
      if (!client || !user?.id) return;
      setisLoading(true);
      try {
        const response = await client?.queryCalls({
          sort: [{ field: 'starts_at', direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              { created_by_user_id: user.id },
              { members: { $in: [user.id] } },
            ],

          },
        });
        const calls = response?.calls;
        setCalls(calls);
      } catch (error) {
        console.log(error);
      } finally {
        setisLoading(false);
      }
    };
    loadCalls();
  }, [client, user?.id]);

  const now = new Date();
  const endedCalls = calls.filter(({
    state:
    { startsAt, endedAt },
  } :Call) => (startsAt && new Date(startsAt) < now || !!endedAt));
  const upcomingCalls = calls.filter(({
    state:
    { startsAt },
  } :Call) => (startsAt && new Date(startsAt) > now));
  return {
    endedCalls,
    upcomingCalls,
    callRecordings: calls,
    isLoading,
  };
};
export default useGetCalls;
