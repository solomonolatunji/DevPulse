import { wakaService } from '@/services/waka.service';
import { useLeaderboardStore, useOrganizationStore } from '@/stores';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useUser } from './useUser';

export function useLeaderboard() {
  const { selectedCountry } = useLeaderboardStore();
  const { selectedOrganization } = useOrganizationStore();
  const { data: user } = useUser();
  const orgId = selectedOrganization?.id;
  const isOrganizationLeaderboardAvailable = !orgId;
  const countryCode =
    selectedCountry === 'GLOBAL' ? undefined : selectedCountry;
  const userCountry = user?.data?.city?.country_code;

  const leaderboardQuery = useInfiniteQuery({
    queryKey: ['leaderboard', selectedCountry, orgId],
    queryFn: ({ pageParam = 1 }) =>
      wakaService.getLeaderboard(undefined, countryCode, pageParam),
    enabled: isOrganizationLeaderboardAvailable,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const ranksQuery = useQuery({
    queryKey: ['userRanks', userCountry, orgId],
    queryFn: async () => {
      const globalResponse = await wakaService.getLeaderboard();
      const globalRank = globalResponse.current_user?.rank;

      let countryResponse = undefined;
      let countryRank;
      if (userCountry) {
        countryResponse = await wakaService.getLeaderboard(
          undefined,
          userCountry,
        );
        countryRank = countryResponse.current_user?.rank;
      }

      return {
        global: globalRank,
        country: countryRank,
        globalCurrentUser: globalResponse.current_user,
        countryCurrentUser: countryResponse?.current_user,
      };
    },
    enabled: isOrganizationLeaderboardAvailable,
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  return {
    data: leaderboardQuery.data,
    userRanks: {
      global: ranksQuery.data?.global,
      country: ranksQuery.data?.country,
      isLoading: ranksQuery.isLoading,
    },
    currentUserRank:
      selectedCountry === 'GLOBAL'
        ? ranksQuery.data?.globalCurrentUser
        : selectedCountry === userCountry
          ? ranksQuery.data?.countryCurrentUser
          : undefined,
    isLoading: leaderboardQuery.isLoading,
    isRefetching: leaderboardQuery.isRefetching,
    isFetchingNextPage: leaderboardQuery.isFetchingNextPage,
    hasNextPage: leaderboardQuery.hasNextPage,
    isOrganizationLeaderboardAvailable,
    error: leaderboardQuery.error
      ? (leaderboardQuery.error as Error).message
      : null,
    refetch: leaderboardQuery.refetch,
    fetchNextPage: leaderboardQuery.fetchNextPage,
  };
}
