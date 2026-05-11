import type { LeaderboardUser } from '@/interfaces';

const INLINE_HIGHLIGHT_MAX_RANK = 10;
const PODIUM_SIZE = 3;

type LeaderboardRuleArgs = {
  currentUserId?: string;
  currentUserRank?: number | null;
  selectedOrganization?: { id: string } | null;
  selectedCountry?: string;
  userCountry?: string;
  topThree: LeaderboardUser[];
};

export const isLeaderboardScopeOwnedByCurrentUser = (
  selectedCountry?: string,
  userCountry?: string,
): boolean =>
  !selectedCountry ||
  selectedCountry === 'GLOBAL' ||
  selectedCountry === userCountry;

export const isCurrentUserInTopThree = (
  topThree: LeaderboardUser[],
  currentUserId?: string,
): boolean =>
  !!currentUserId && topThree.some((entry) => entry.user.id === currentUserId);

export const shouldHighlightInlineCurrentUser = ({
  currentUserId,
  currentUserRank,
  selectedOrganization,
  selectedCountry,
  userCountry,
}: Omit<LeaderboardRuleArgs, 'topThree'>): boolean =>
  !selectedOrganization &&
  !!currentUserId &&
  currentUserRank != null &&
  currentUserRank >= PODIUM_SIZE + 1 &&
  currentUserRank <= INLINE_HIGHLIGHT_MAX_RANK &&
  isLeaderboardScopeOwnedByCurrentUser(selectedCountry, userCountry);

export const shouldShowStickyCurrentUserRow = ({
  currentUserId,
  currentUserRank,
  selectedOrganization,
  selectedCountry,
  userCountry,
  topThree,
}: LeaderboardRuleArgs): boolean =>
  !selectedOrganization &&
  !!currentUserId &&
  currentUserRank != null &&
  !isCurrentUserInTopThree(topThree, currentUserId) &&
  !shouldHighlightInlineCurrentUser({
    currentUserId,
    currentUserRank,
    selectedOrganization,
    selectedCountry,
    userCountry,
  }) &&
  isLeaderboardScopeOwnedByCurrentUser(selectedCountry, userCountry);

export const getRemainingLeaderboardUsers = (
  leaderboardData: LeaderboardUser[],
): LeaderboardUser[] => leaderboardData.slice(PODIUM_SIZE);
