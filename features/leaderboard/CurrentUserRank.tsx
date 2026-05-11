import { Avatar } from '@/components';
import { Card } from '@/components/Card';
import { Typography } from '@/components/Typography';
import { useLeaderboardContext } from '@/contexts/LeaderboardContext';
import { useStats, useTheme, useUser } from '@/hooks';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const CurrentUserRank = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { currentUserRank, userCountry, selectedCountry, userRanks } =
    useLeaderboardContext();
  const { data: weeklyStats } = useStats('last_7_days');
  const { data: user } = useUser();
  const bottomOffset = Platform.OS === 'ios' ? Math.max(insets.bottom, 12) : 0;

  const isGlobalView = !selectedCountry || selectedCountry === 'GLOBAL';
  const isOwnCountryView = selectedCountry === userCountry;
  const fallbackRank = isGlobalView
    ? userRanks.global
    : isOwnCountryView
      ? userRanks.country
      : undefined;
  const displayRank = currentUserRank?.rank ?? fallbackRank;
  const displayUser = currentUserRank?.user ?? user?.data;
  const displayTotal =
    weeklyStats?.data.human_readable_total || 'No time logged';
  const rankLabel = displayRank != null ? `#${displayRank}` : '#';
  const statusText =
    displayRank != null
      ? displayTotal
      : 'No leaderboard position available for this period.';

  if (!displayUser) {
    return null;
  }

  if (
    selectedCountry &&
    selectedCountry !== 'GLOBAL' &&
    selectedCountry !== userCountry
  ) {
    return null;
  }

  return (
    <View
      style={[
        styles.currentUserContainer,
        {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          bottom: bottomOffset,
        },
      ]}
    >
      <Card
        style={[
          styles.userCard,
          {
            marginBottom: 0,
            borderWidth: 1,
            borderColor: theme.colors.primary,
            paddingVertical: 8,
          },
        ]}
      >
        <View style={styles.rankContainer}>
          <Typography variant="body" weight="bold" color={theme.colors.primary}>
            {rankLabel}
          </Typography>
        </View>
        <View style={{ marginHorizontal: 12 }}>
          <Avatar
            source={displayUser.photo ? { uri: displayUser.photo } : undefined}
            initials={displayUser.display_name || displayUser.username}
            size={40}
          />
        </View>
        <View style={styles.userInfo}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="caption" weight="bold">
              {displayUser.display_name || displayUser.username || 'You'}
            </Typography>
            <Typography
              variant="micro"
              weight="bold"
              color={theme.colors.primary}
              style={{ marginRight: 8 }}
            >
              YOU
            </Typography>
          </View>

          <Typography variant="micro" color={theme.colors.textSecondary}>
            {statusText}
          </Typography>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  currentUserContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    padding: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
});
