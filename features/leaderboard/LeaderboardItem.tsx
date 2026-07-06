import { Avatar, Card, Typography } from '@/components';
import { useTheme } from '@/hooks';
import { LeaderboardUser } from '@/interfaces/leaderboard';
import { wakaService } from '@/services/waka.service';
import { commonStyles } from '@/theme';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface LeaderboardItemProps {
  item: LeaderboardUser;
  highlight?: boolean;
  boardType?: 'time' | 'ai';
}

const formatAILines = (lines?: number) => {
  if (!lines) return '0 AI lines';
  if (lines >= 1000) return `${(lines / 1000).toFixed(1)}K AI lines`;
  return `${lines.toLocaleString()} AI lines`;
};

const styles = StyleSheet.create({
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
  },
  rankContainer: {
    width: 40,
    ...commonStyles.center,
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    flex: 1,
    minWidth: 0,
  },
});

export const LeaderboardItem = ({
  item,
  highlight = false,
  boardType = 'time',
}: LeaderboardItemProps) => {
  const { theme } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handlePress = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ['stats', 'last_7_days', undefined],
      queryFn: () => wakaService.getStats('last_7_days'),
      staleTime: 2 * 60 * 1000,
    });
    router.push(`/user/${item.user.id}`);
  }, [queryClient, router, item.user.id]);

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
      <Card
        style={[
          styles.userCard,
          highlight && {
            borderWidth: 1,
            borderColor: theme.colors.primary,
          },
        ]}
      >
        <View style={styles.rankContainer}>
          <Typography
            variant="body"
            weight="bold"
            color={
              highlight ? theme.colors.primary : theme.colors.textSecondary
            }
          >
            #{item.rank}
          </Typography>
        </View>
        <View style={{ marginHorizontal: theme.spacing[3] }}>
          <Avatar
            source={item.user.photo ? { uri: item.user.photo } : undefined}
            initials={item.user.display_name || item.user.username}
            size={40}
          />
        </View>
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Typography
              variant="caption"
              weight="bold"
              numberOfLines={1}
              style={styles.nameText}
            >
              {item.user.display_name || item.user.username || 'Anonymous'}
            </Typography>
            {highlight ? (
              <Typography
                variant="micro"
                weight="bold"
                color={theme.colors.primary}
                style={{ marginLeft: 8, flexShrink: 0 }}
              >
                YOU
              </Typography>
            ) : null}
          </View>
          <Typography
            variant="micro"
            color={theme.colors.textSecondary}
            numberOfLines={1}
          >
            {boardType === 'ai'
              ? formatAILines(item.running_total.ai_line_changes_total)
              : item.running_total.human_readable_total}
          </Typography>
        </View>
      </Card>
    </TouchableOpacity>
  );
};
