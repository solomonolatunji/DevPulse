import type { LeaderboardUser } from '@/interfaces';

import {
  getRemainingLeaderboardUsers,
  isCurrentUserInTopThree,
  isLeaderboardScopeOwnedByCurrentUser,
  shouldHighlightInlineCurrentUser,
  shouldShowStickyCurrentUserRow,
} from '@/features/leaderboard/rules';

const createLeaderboardUser = (rank: number, id?: string): LeaderboardUser => ({
  rank,
  running_total: {
    total_seconds: rank * 1000,
    human_readable_total: `${rank} hrs`,
    daily_average: rank * 10,
    human_readable_daily_average: `${rank} hrs/day`,
    languages: [],
  },
  user: {
    id: id ?? `user-${rank}`,
    username: `user-${rank}`,
  },
});

describe('leaderboard rules', () => {
  const topThree = [
    createLeaderboardUser(1),
    createLeaderboardUser(2),
    createLeaderboardUser(3),
  ];

  describe('isLeaderboardScopeOwnedByCurrentUser', () => {
    it('treats global and own-country scopes as owned', () => {
      expect(isLeaderboardScopeOwnedByCurrentUser(undefined, 'NG')).toBe(true);
      expect(isLeaderboardScopeOwnedByCurrentUser('GLOBAL', 'NG')).toBe(true);
      expect(isLeaderboardScopeOwnedByCurrentUser('NG', 'NG')).toBe(true);
    });

    it('treats another country scope as not owned', () => {
      expect(isLeaderboardScopeOwnedByCurrentUser('GH', 'NG')).toBe(false);
    });
  });

  describe('isCurrentUserInTopThree', () => {
    it('returns true when the current user is on the podium', () => {
      expect(isCurrentUserInTopThree(topThree, 'user-2')).toBe(true);
    });

    it('returns false when the current user is not on the podium', () => {
      expect(isCurrentUserInTopThree(topThree, 'user-10')).toBe(false);
    });
  });

  describe('shouldHighlightInlineCurrentUser', () => {
    it('highlights current user when rank is between 4 and 10', () => {
      expect(
        shouldHighlightInlineCurrentUser({
          currentUserId: 'user-4',
          currentUserRank: 4,
          selectedOrganization: null,
          selectedCountry: 'NG',
          userCountry: 'NG',
        }),
      ).toBe(true);

      expect(
        shouldHighlightInlineCurrentUser({
          currentUserId: 'user-10',
          currentUserRank: 10,
          selectedOrganization: null,
          selectedCountry: 'GLOBAL',
          userCountry: 'NG',
        }),
      ).toBe(true);
    });

    it('does not highlight for top-three, lower ranks, org mode, or foreign country scope', () => {
      expect(
        shouldHighlightInlineCurrentUser({
          currentUserId: 'user-3',
          currentUserRank: 3,
          selectedOrganization: null,
          selectedCountry: 'NG',
          userCountry: 'NG',
        }),
      ).toBe(false);

      expect(
        shouldHighlightInlineCurrentUser({
          currentUserId: 'user-11',
          currentUserRank: 11,
          selectedOrganization: null,
          selectedCountry: 'NG',
          userCountry: 'NG',
        }),
      ).toBe(false);

      expect(
        shouldHighlightInlineCurrentUser({
          currentUserId: 'user-4',
          currentUserRank: 4,
          selectedOrganization: { id: 'org-1' },
          selectedCountry: 'NG',
          userCountry: 'NG',
        }),
      ).toBe(false);

      expect(
        shouldHighlightInlineCurrentUser({
          currentUserId: 'user-4',
          currentUserRank: 4,
          selectedOrganization: null,
          selectedCountry: 'GH',
          userCountry: 'NG',
        }),
      ).toBe(false);
    });
  });

  describe('shouldShowStickyCurrentUserRow', () => {
    it('shows sticky row when the current user is below the near-top threshold', () => {
      expect(
        shouldShowStickyCurrentUserRow({
          currentUserId: 'user-11',
          currentUserRank: 11,
          selectedOrganization: null,
          selectedCountry: 'NG',
          userCountry: 'NG',
          topThree,
        }),
      ).toBe(true);
    });

    it('does not show sticky row when the user is in top three or near-top range', () => {
      expect(
        shouldShowStickyCurrentUserRow({
          currentUserId: 'user-2',
          currentUserRank: 2,
          selectedOrganization: null,
          selectedCountry: 'NG',
          userCountry: 'NG',
          topThree,
        }),
      ).toBe(false);

      expect(
        shouldShowStickyCurrentUserRow({
          currentUserId: 'user-10',
          currentUserRank: 10,
          selectedOrganization: null,
          selectedCountry: 'NG',
          userCountry: 'NG',
          topThree,
        }),
      ).toBe(false);
    });

    it('does not show sticky row in org mode or foreign country scope', () => {
      expect(
        shouldShowStickyCurrentUserRow({
          currentUserId: 'user-20',
          currentUserRank: 20,
          selectedOrganization: { id: 'org-1' },
          selectedCountry: 'NG',
          userCountry: 'NG',
          topThree,
        }),
      ).toBe(false);

      expect(
        shouldShowStickyCurrentUserRow({
          currentUserId: 'user-20',
          currentUserRank: 20,
          selectedOrganization: null,
          selectedCountry: 'GH',
          userCountry: 'NG',
          topThree,
        }),
      ).toBe(false);
    });
  });

  describe('getRemainingLeaderboardUsers', () => {
    it('drops the podium entries and returns the rest in order', () => {
      const leaderboardData = [
        createLeaderboardUser(1),
        createLeaderboardUser(2),
        createLeaderboardUser(3),
        createLeaderboardUser(4),
        createLeaderboardUser(5),
      ];

      expect(
        getRemainingLeaderboardUsers(leaderboardData).map(
          (entry) => entry.rank,
        ),
      ).toEqual([4, 5]);
    });
  });
});
