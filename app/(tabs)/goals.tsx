import { Card, Header, Typography } from '@/components';
import { GoalsSkeleton } from '@/components/skeletons';
import { useGoals, useTheme } from '@/hooks';
import { WakaTimeGoal } from '@/interfaces';
import { goalsStyles as styles } from '@/theme';
import { Feather } from '@react-native-vector-icons/feather/static';
import { useRouter } from 'expo-router';
import { FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';

export default function GoalsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { data, isLoading, refetch, isRefetching } = useGoals();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return theme.colors.success;
      case 'fail':
        return theme.colors.error;
      default:
        return theme.colors.secondary;
    }
  };

  const renderGoalItem = ({ item }: { item: WakaTimeGoal }) => {
    const latestData = item.chart_data?.[item.chart_data.length - 1];
    const progress = latestData
      ? Math.min(latestData.actual_seconds / latestData.goal_seconds, 1)
      : 0;

    return (
      <TouchableOpacity
        onPress={() => router.push(`/goals/${item.id}`)}
        activeOpacity={0.7}
      >
        <Card style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <View style={styles.titleContainer}>
              <Typography
                variant="title"
                weight="bold"
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {item.title}
              </Typography>
              <Typography variant="micro" color={theme.colors.textSecondary}>
                {item.range_text}
              </Typography>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) + '20' },
              ]}
            >
              <Typography
                variant="micro"
                weight="bold"
                style={{ color: getStatusColor(item.status) }}
              >
                {item.status.toUpperCase()}
              </Typography>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <Typography variant="caption" weight="semibold">
                {item.delta}
              </Typography>
              <Typography variant="micro" color={theme.colors.textSecondary}>
                {Math.round(progress * 100)}%
              </Typography>
            </View>
            <View
              style={[
                styles.progressBarBg,
                { backgroundColor: theme.colors.border },
              ]}
            >
              <View
                style={[
                  styles.progressBarFill,
                  {
                    backgroundColor: getStatusColor(item.status),
                    width: `${progress * 100}%`,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <Typography variant="micro" color={theme.colors.textSecondary}>
              Average: {item.average_status.toUpperCase()}
            </Typography>
            {item.languages.length > 0 && (
              <Typography variant="micro" color={theme.colors.textSecondary}>
                {item.languages.slice(0, 2).join(', ')}
              </Typography>
            )}
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  if (isLoading && !data) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Header
          title="Goals"
          subtitle="Track your coding milestones"
          actions={[
            {
              icon: 'plus',
              onPress: () => router.push('/goals/create'),
            },
          ]}
        />
        <GoalsSkeleton />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header
        title="Goals"
        subtitle="Track your coding milestones"
        actions={[
          {
            icon: 'plus',
            onPress: () => router.push('/goals/create'),
          },
        ]}
      />

      <FlatList
        data={data?.data}
        renderItem={renderGoalItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.surface}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="target" size={48} color={theme.colors.border} />
            <Typography
              variant="title"
              weight="semibold"
              style={styles.emptyTitle}
            >
              No Goals Set
            </Typography>
            <Typography
              color={theme.colors.textSecondary}
              style={styles.emptySubtitle}
            >
              Create goals on the WakaTime dashboard to track them here.
            </Typography>
          </View>
        }
      />
    </View>
  );
}
