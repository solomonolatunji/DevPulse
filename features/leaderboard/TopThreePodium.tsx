import { Avatar } from '@/components';
import { Typography } from '@/components/Typography';
import { useTheme } from '@/hooks';
import { LeaderboardUser } from '@/interfaces/leaderboard';
import { Feather } from '@react-native-vector-icons/feather/static';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface TopThreePodiumProps {
  users: LeaderboardUser[];
}

export const TopThreePodium = ({ users }: TopThreePodiumProps) => {
  const { theme, isDark } = useTheme();
  const router = useRouter();

  const displayTopThree = React.useMemo(() => {
    if (users.length === 0) return [];

    return [users[1], users[0], users[2]].filter(Boolean);
  }, [users]);

  if (displayTopThree.length === 0) return null;

  return (
    <View style={styles.podiumContainer}>
      {displayTopThree.map((user) => {
        const podiumRank =
          user.rank === users[0]?.rank
            ? 1
            : user.rank === users[1]?.rank
              ? 2
              : 3;
        const isFirst = podiumRank === 1;
        const isSecond = podiumRank === 2;
        const colors = {
          1: '#FFD700', // Gold
          2: '#C0C0C0', // Silver
          3: '#CD7F32', // Bronze
        };
        const color = colors[podiumRank as 1 | 2 | 3];

        return (
          <TouchableOpacity
            key={user.user.id}
            activeOpacity={0.8}
            style={[
              styles.podiumItem,
              isFirst && styles.podiumItemFirst,
              isSecond && styles.podiumItemSecond,
            ]}
            onPress={() => router.push(`/user/${user.user.id}`)}
          >
            <View style={styles.avatarWrapper}>
              <View
                style={[
                  styles.podiumAvatar,
                  isFirst
                    ? styles.avatarFirst
                    : isSecond
                      ? styles.avatarSecond
                      : styles.avatarThird,
                  {
                    borderColor: color,
                    width: isFirst ? 86 : isSecond ? 72 : 64,
                    height: isFirst ? 86 : isSecond ? 72 : 64,
                    borderRadius: isFirst ? 43 : isSecond ? 36 : 32,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}
              >
                <Avatar
                  source={
                    user.user.photo ? { uri: user.user.photo } : undefined
                  }
                  initials={user.user.display_name || user.user.username}
                  size={isFirst ? 80 : isSecond ? 66 : 58}
                />
              </View>
              <View style={[styles.podiumBadge, { backgroundColor: color }]}>
                <Typography
                  variant="micro"
                  weight="bold"
                  color="#FFFFFF"
                  style={
                    user.rank != null && user.rank > 999
                      ? { fontSize: 8 }
                      : undefined
                  }
                >
                  {user.rank ?? '-'}
                </Typography>
              </View>
              {isFirst && (
                <View style={styles.crownContainer}>
                  <Feather name="award" size={24} color="#FFD700" />
                </View>
              )}
            </View>

            <View
              style={[
                styles.podiumInfo,
                !isFirst && styles.podiumInfoSide,
                podiumRank === 3 && styles.podiumInfoThird,
              ]}
            >
              <Typography
                variant="caption"
                weight="bold"
                align="center"
                numberOfLines={1}
                style={[styles.nameText, !isFirst && styles.nameTextSide]}
              >
                {user.user.display_name || user.user.username || 'Anon'}
              </Typography>
              <Typography
                variant="micro"
                color={theme.colors.textSecondary}
                align="center"
                weight="medium"
                numberOfLines={1}
                style={styles.totalText}
              >
                {user.running_total.human_readable_total
                  .replace('hrs', 'h')
                  .replace('mins', 'm')}
              </Typography>
            </View>

            {/* Pedestal effect */}
            <View
              style={[
                styles.pedestal,
                {
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(0,0,0,0.03)',
                },
                isFirst
                  ? styles.pedestalFirst
                  : isSecond
                    ? styles.pedestalSecond
                    : styles.pedestalThird,
              ]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 24,
    marginBottom: 32,
    gap: 10,
  },
  podiumItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    minWidth: 0,
  },
  podiumItemFirst: {
    zIndex: 2,
  },
  podiumItemSecond: {
    zIndex: 1,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
    alignItems: 'center',
  },
  podiumAvatar: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderWidth: 3,
  },
  avatarFirst: {
    width: 86,
    height: 86,
    borderRadius: 43,
  },
  avatarSecond: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarThird: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  podiumBadge: {
    position: 'absolute',
    bottom: -2,
    right: 0,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    paddingHorizontal: 4,
  },
  crownContainer: {
    position: 'absolute',
    top: -20,
    zIndex: 3,
  },
  podiumInfo: {
    paddingHorizontal: 6,
    marginBottom: 8,
    width: '100%',
    minWidth: 0,
    overflow: 'hidden',
    alignItems: 'center',
  },
  podiumInfoSide: {
    paddingTop: 8,
  },
  podiumInfoThird: {
    paddingTop: 12,
  },
  nameText: {
    width: '100%',
    flexShrink: 1,
  },
  nameTextSide: {
    fontSize: 12,
    lineHeight: 14,
  },
  totalText: {
    width: '100%',
  },
  pedestal: {
    width: '100%',
    borderRadius: 12,
    position: 'absolute',
    bottom: -16,
    zIndex: -1,
  },
  pedestalFirst: {
    height: 90,
  },
  pedestalSecond: {
    height: 70,
  },
  pedestalThird: {
    height: 58,
  },
});
