import { COUNTRIES } from '@/constants/countries';
import { useLeaderboard, useUser } from '@/hooks';
import {
  CurrentLeaderboardUser,
  LeaderboardUser,
} from '@/interfaces/leaderboard';
import { useLeaderboardStore } from '@/stores/useLeaderboardStore';
import React, { createContext, useContext, useEffect, useMemo } from 'react';

interface LeaderboardContextType {
  selectedCountry: string | undefined;
  setSelectedCountry: (country: string | undefined) => void;
  isLoading: boolean;
  isRefetching: boolean;
  leaderboardData: LeaderboardUser[];
  currentUserRank: CurrentLeaderboardUser | undefined;
  userRanks: {
    global: number | null | undefined;
    country: number | null | undefined;
    isLoading: boolean;
  };
  refetch: () => void;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  countries: typeof COUNTRIES;
  userCountry: string | undefined;
  isOrganizationLeaderboardAvailable: boolean;
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(
  undefined,
);

export function LeaderboardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: userData } = useUser();
  const { selectedCountry, setSelectedCountry } = useLeaderboardStore();

  const userCountry = useMemo(() => {
    return userData?.data?.city?.country_code;
  }, [userData]);

  useEffect(() => {
    if (userCountry && selectedCountry === undefined) {
      setSelectedCountry(userCountry);
    }
  }, [userCountry, selectedCountry, setSelectedCountry]);

  const {
    data: leaderboardDataObj,
    currentUserRank,
    userRanks,
    isLoading,
    isRefetching,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isOrganizationLeaderboardAvailable,
  } = useLeaderboard();

  const leaderboardData = useMemo(
    () => leaderboardDataObj?.pages?.flatMap((page) => page.data) || [],
    [leaderboardDataObj?.pages],
  );

  const value = {
    selectedCountry,
    setSelectedCountry,
    isLoading,
    isRefetching,
    leaderboardData,
    currentUserRank,
    userRanks,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    countries: COUNTRIES,
    userCountry,
    isOrganizationLeaderboardAvailable,
  };

  return (
    <LeaderboardContext.Provider value={value}>
      {children}
    </LeaderboardContext.Provider>
  );
}

export function useLeaderboardContext() {
  const context = useContext(LeaderboardContext);
  if (context === undefined) {
    throw new Error(
      'useLeaderboardContext must be used within a LeaderboardProvider',
    );
  }
  return context;
}
