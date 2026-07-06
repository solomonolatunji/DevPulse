import { StatsRange } from '@/constants/wakatime';
import { wakaService } from '@/services/waka.service';
import { useOrganizationStore } from '@/stores';
import { VALID_TIME_RANGES } from '@/utilities';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

const PREFETCH_STALE_TIME = 2 * 60 * 1000;

export function useStats(range: StatsRange = 'last_7_days') {
  const { selectedOrganization } = useOrganizationStore();
  const orgId = selectedOrganization?.id;
  const queryClient = useQueryClient();
  const prefetched = useRef(false);

  const query = useQuery({
    queryKey: ['stats', range, orgId],
    queryFn: () => {
      if (orgId) {
        return wakaService.getOrgStats(orgId, range);
      }
      return wakaService.getStats(range);
    },
    staleTime: 2 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (query.data && !prefetched.current) {
      prefetched.current = true;
      const otherRanges = VALID_TIME_RANGES.filter((r) => r !== range);
      otherRanges.forEach((r) => {
        queryClient.prefetchQuery({
          queryKey: ['stats', r, orgId],
          queryFn: () =>
            orgId ? wakaService.getOrgStats(orgId, r) : wakaService.getStats(r),
          staleTime: PREFETCH_STALE_TIME,
        });
      });
    }
  }, [query.data, range, orgId, queryClient]);

  return {
    data: query.data || null,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    error: query.error,
    refetch: query.refetch,
  };
}
