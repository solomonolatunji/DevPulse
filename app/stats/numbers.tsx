import {
  Card,
  NumbersSkeleton,
  ScreenHeader,
  SegmentedStatsCard,
  TimeRangeSelector,
  Typography,
} from '@/components';
import { getCategoryColor, getOSColor } from '@/constants';
import { BestDayCard } from '@/features';
import { AIProductivityCard } from '@/features/stats';
import { useMetadata, useStats, useTheme } from '@/hooks';
import {
  WakaTimeLanguage,
  WakaTimeMachineStat,
  WakaTimeStats,
} from '@/interfaces';
import { RANGE_API_MAP, TimeRange, VALID_TIME_RANGES } from '@/utilities';
import { generateDeterministicColor } from '@/utilities/colors';
import { Feather } from '@react-native-vector-icons/feather/static';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SegmentedStatItem =
  | WakaTimeLanguage
  | WakaTimeMachineStat
  | NonNullable<WakaTimeStats['data']['dependencies']>[number];
type StatItem = {
  label: string;
  value: string;
  icon: FeatherIconName;
  color: string;
  fullWidth?: boolean;
};

export default function NumbersScreen() {
  const { theme } = useTheme();
  const { getLanguageColor, getEditorColor, getMachineColor } = useMetadata();
  const params = useLocalSearchParams<{ range?: string }>();
  const [range, setRange] = useState<TimeRange>('last_7_days');

  useEffect(() => {
    if (params.range && VALID_TIME_RANGES.includes(params.range as TimeRange)) {
      setRange(params.range as TimeRange);
    }
  }, [params.range]);

  const {
    data: stats,
    isLoading,
    refetch: refetchStats,
    isRefetching,
  } = useStats(RANGE_API_MAP[range]);

  const handleRefresh = () => {
    refetchStats();
  };

  if (isLoading && !stats) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['left', 'right']}
      >
        <NumbersSkeleton />
      </SafeAreaView>
    );
  }

  const statItems: StatItem[] = [
    {
      label: 'All Time Total',
      value: stats?.data?.human_readable_total || '0h 0m',
      icon: 'clock',
      color: theme.colors.primary,
      fullWidth: true,
    },
    {
      label: 'Daily Average',
      value: stats?.data?.human_readable_daily_average || '0h 0m',
      icon: 'bar-chart-2',
      color: theme.colors.secondary,
      fullWidth: true,
    },
    {
      label: 'Languages',
      value: stats?.data?.languages?.length?.toString() || '0',
      icon: 'code',
      color: theme.colors.accent,
    },
    {
      label: 'Projects',
      value: stats?.data?.projects?.length?.toString() || '0',
      icon: 'folder',
      color: '#4CAF50',
    },
    {
      label: 'Editors',
      value: stats?.data?.editors?.length?.toString() || '0',
      icon: 'edit-3',
      color: '#FF9800',
    },
    {
      label: 'OS',
      value: stats?.data?.operating_systems?.length?.toString() || '0',
      icon: 'monitor',
      color: '#9C27B0',
    },
  ];

  const sections: {
    title: string;
    data: SegmentedStatItem[] | undefined;
    getColor: (name: string) => string;
    limit?: number;
  }[] = [
    {
      title: 'Top Languages',
      data: stats?.data?.languages,
      getColor: getLanguageColor,
    },
    {
      title: 'Categories',
      data: stats?.data?.categories,
      getColor: getCategoryColor,
    },
    {
      title: 'Editors',
      data: stats?.data?.editors,
      getColor: getEditorColor,
    },
    {
      title: 'Operating Systems',
      data: stats?.data?.operating_systems,
      getColor: getOSColor,
    },
    {
      title: 'Workstations',
      data: stats?.data?.machines,
      getColor: (name) => {
        const machine = stats?.data?.machines?.find(
          (machineItem: WakaTimeMachineStat) => machineItem.name === name,
        );
        return getMachineColor(machine?.machine_name_id);
      },
    },
    {
      title: 'Top Dependencies',
      data: stats?.data?.dependencies,
      getColor: generateDeterministicColor,
      limit: 8,
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['left', 'right']}
    >
      <ScreenHeader title="The Numbers" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        <TimeRangeSelector value={range} onChange={setRange} />

        <BestDayCard
          date={stats?.data?.best_day?.date}
          totalTime={stats?.data?.best_day?.text}
          totalSeconds={stats?.data?.best_day?.total_seconds}
          dailyAverage={stats?.data?.daily_average}
          topProject={stats?.data?.projects?.[0]}
        />

        <View style={styles.grid}>
          {statItems.map((item, index) => (
            <Card
              key={index}
              style={[
                styles.statCard,
                item.fullWidth ? { width: '100%' } : { width: '48%' },
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: item.color + '20' },
                ]}
              >
                <Feather name={item.icon} size={24} color={item.color} />
              </View>
              <View style={styles.statInfo}>
                <Typography
                  variant="caption"
                  color={theme.colors.textSecondary}
                >
                  {item.label}
                </Typography>
                <Typography
                  variant="title"
                  weight="bold"
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {item.value}
                </Typography>
              </View>
            </Card>
          ))}
        </View>

        {sections.map(
          (section) =>
            section.data &&
            section.data.length > 0 && (
              <SegmentedStatsCard
                key={section.title}
                title={section.title}
                segments={section.data
                  .slice(0, section.limit || 5)
                  .map((item) => ({
                    label: item.name,
                    percent: item.percent,
                    color: section.getColor(item.name),
                    valueText: item.text,
                  }))}
              />
            ),
        )}

        {stats?.data?.ai_additions !== undefined && (
          <AIProductivityCard
            aiAdditions={stats.data.ai_additions || 0}
            aiDeletions={stats.data.ai_deletions || 0}
            humanAdditions={stats.data.human_additions || 0}
            humanDeletions={stats.data.human_deletions || 0}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 40,
  },
  grid: {
    gap: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statInfo: {
    flex: 1,
  },
});
