import { Card, ScreenHeader, Typography } from '@/components';
import { SessionRowSkeleton } from '@/components/skeletons';
import { SessionTimeline } from '@/features/stats/SessionTimeline';
import { useDurations, useTheme } from '@/hooks';
import { sessionStyles as styles } from '@/theme';
import { useQueryClient } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AppState,
  AppStateStatus,
  FlatList,
  RefreshControl,
  View,
} from 'react-native';

const DAYS_TO_SHOW = 7;

export default function SessionHistoryScreen() {
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const [today, setToday] = useState(() => new Date());
  const todayStr = useRef(format(new Date(), 'yyyy-MM-dd'));

  const refreshIfNewDay = useCallback(() => {
    const now = new Date();
    const nowStr = format(now, 'yyyy-MM-dd');
    if (nowStr !== todayStr.current) {
      todayStr.current = nowStr;
      setToday(now);
    }
  }, []);

  useEffect(() => {
    const handleAppState = (next: AppStateStatus) => {
      if (next === 'active') {
        refreshIfNewDay();
      }
    };
    const sub = AppState.addEventListener('change', handleAppState);
    return () => sub.remove();
  }, [refreshIfNewDay]);

  const days = useMemo(
    () => Array.from({ length: DAYS_TO_SHOW }, (_, i) => subDays(today, i)),
    [today],
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['durations'] });
    setRefreshing(false);
  }, [queryClient]);

  const renderDayItem = ({ item: date }: { item: Date }) => {
    return <DaySessionRow date={date} />;
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScreenHeader title="Sessions" />
      <FlatList
        data={days}
        renderItem={renderDayItem}
        keyExtractor={(item) => item.toISOString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.surface}
          />
        }
      />
    </View>
  );
}

const DaySessionRow = ({ date }: { date: Date }) => {
  const { data: sessions, isLoading } = useDurations(date);
  const { theme } = useTheme();

  if (isLoading) {
    return <SessionRowSkeleton />;
  }

  return (
    <Card style={styles.dayCard}>
      <Typography variant="body" weight="bold" style={styles.dateLabel}>
        {format(date, 'EEEE, MMM d')}
      </Typography>
      {sessions && sessions.length > 0 ? (
        <SessionTimeline sessions={sessions} height={60} />
      ) : (
        <Typography
          variant="caption"
          color={theme.colors.textTertiary}
          style={styles.emptyText}
        >
          No activity recorded
        </Typography>
      )}
    </Card>
  );
};
