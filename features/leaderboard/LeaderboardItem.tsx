import { Avatar, Card, Typography } from '@/components';
import { useTheme } from '@/hooks';
import { LeaderboardUser } from '@/interfaces/leaderboard';
import { commonStyles } from '@/theme';
import { useRouter } from 'expo-router';
import React from 'react';
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

export const LeaderboardItem = ({
  item,
  highlight = false,
  boardType = 'time',
}: LeaderboardItemProps) => {
  const { theme } = useTheme();
  const router = useRouter();

  const styles = StyleSheet.create({
    userCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing[3],
      marginBottom: theme.spacing[2],
      borderRadius: theme.tokens.borderRadius.md,
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

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push(`/user/${item.user.id}`)}
    >
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
