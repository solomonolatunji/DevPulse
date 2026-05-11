import { DashboardSkeleton } from '@/components/skeletons';
import {
  WakaTimeLanguage,
  WakaTimeSummary,
  WakaTimeSummaryItem,
} from '@/interfaces';
import {
  BestDayCard,
  DailyProgressCard,
  DashboardHeader,
  MonthlyCalendarCard,
  RankPulseCard,
  TotalTimeCard,
} from '@/features';
import {
  useAllTime,
  useMetadata,
  useStats,
  useSummaries,
  useTheme,
  useUser,
  useWidgetSync,
} from '@/hooks';
import { useOrganizationStore } from '@/stores';
import { dashboardStyles as styles } from '@/theme/styles/dashboard';
import {
  calculateDailyAveragePercent,
  formatCompactDuration,
  formatDuration,
} from '@/utilities';
import { getProjectColor } from '@/utilities/projectColors';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AppState,
  AppStateStatus,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Dashboard() {
  const { theme } = useTheme();
  const { isLoading: userLoading } = useUser();
  const { getLanguageColor } = useMetadata();
  const { selectedOrganization } = useOrganizationStore();

  const {
    data: allTimeData,
    isLoading: allTimeLoading,
    refetch: refetchAllTime,
  } = useAllTime();

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

  const [viewingMonth, setViewingMonth] = useState(today);

  const startMonth = useMemo(() => startOfMonth(viewingMonth), [viewingMonth]);
  const endMonth = useMemo(() => endOfMonth(viewingMonth), [viewingMonth]);

  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
    isRefetching: isStatsRefetching,
  } = useStats('last_7_days');

  const {
    data: todaySummaries,
    refetch: refetchToday,
    isLoading: todayLoading,
  } = useSummaries(today, today);

  const {
    data: monthSummaries,
    refetch: refetchMonth,
    isLoading: monthLoading,
  } = useSummaries(startMonth, endMonth);

  const handleRefresh = useCallback(() => {
    refetchStats();
    refetchAllTime();
    refetchToday();
    refetchMonth();
  }, [refetchStats, refetchAllTime, refetchToday, refetchMonth]);

  useEffect(() => {
    const handleAppState = (next: AppStateStatus) => {
      if (next === 'active') {
        refreshIfNewDay();
        handleRefresh();
      }
    };
    const sub = AppState.addEventListener('change', handleAppState);
    return () => sub.remove();
  }, [refreshIfNewDay, handleRefresh]);

  const isLoading =
    userLoading ||
    statsLoading ||
    allTimeLoading ||
    todayLoading ||
    isStatsRefetching;

  const dailyAverage = stats?.data?.daily_average || 0;

  const totalTimeDisplay = allTimeData?.data?.text || '0 HRS 0 MINS';
  const totalProjects = stats?.data?.projects?.length || 0;

  const recentProjects = (stats?.data?.projects || [])
    .slice(0, 3)
    .map((project: WakaTimeLanguage) => ({
      name: project.name,
      text:
        project.text ||
        (project.total_seconds ? formatDuration(project.total_seconds) : '0m'),
      color: getProjectColor(project.name),
    }));

  const {
    todayTotal,
    todayPercent,
    todayGoalDiffText,
    latestProjects,
    statsForWidget,
  } = useMemo(() => {
    const todayData = todaySummaries?.data?.[0];
    const seconds = todayData?.grand_total?.total_seconds || 0;
    const text = formatDuration(seconds);
    const percent = calculateDailyAveragePercent(seconds, dailyAverage);

    let goalDiffText = '';
    if (dailyAverage > 0) {
      const diff = seconds - dailyAverage;
      const sign = diff >= 0 ? '+' : '-';
      const absDiff = Math.abs(diff);
      const h = Math.floor(absDiff / 3600);
      const m = Math.floor((absDiff % 3600) / 60);

      if (h > 0) {
        goalDiffText = `${sign}${h}h ${m}m`;
      } else {
        goalDiffText = `${sign}${m}m`;
      }
    }

    const projects = (todayData?.projects || [])
      .slice(0, 5)
      .map((project: WakaTimeSummaryItem) => ({
        name: project.name,
        text: project.text,
        color: getProjectColor(project.name),
        percent: project.percent || 0,
      }));

    const topLanguage = todayData?.languages?.[0]
      ? {
          name: todayData.languages[0].name,
          percent: todayData.languages[0].percent,
          color: getLanguageColor(todayData.languages[0].name),
        }
      : undefined;

    const topProject = projects[0]
      ? {
          name: projects[0].name,
          text: formatCompactDuration(
            todayData?.projects?.[0]?.total_seconds || 0,
          ),
          color: projects[0].color,
        }
      : undefined;

    return {
      todayTotal: text,
      todayPercent: percent,
      todayGoalDiffText: goalDiffText,
      latestProjects: projects,
      statsForWidget: {
        todayTotalText: text,
        todayPercent: percent,
        theme: {
          background: theme.colors.background,
          surface: theme.colors.surface,
          surfaceSubtle: theme.colors.surfaceSubtle,
          border: theme.colors.border,
          text: theme.colors.text,
          textSecondary: theme.colors.textSecondary,
          primary: theme.colors.primary,
        },
        topLanguage,
        topProject,
      },
    };
  }, [todaySummaries, dailyAverage, getLanguageColor, theme.colors]);

  useWidgetSync(statsForWidget, !selectedOrganization);

  const todayProjects = latestProjects;
  const monthTotal = monthSummaries?.cumulative_total?.text || '0 hrs 0 mins';

  const handlePrevMonth = () => {
    setViewingMonth((prev: Date) =>
      startOfMonth(new Date(prev.getFullYear(), prev.getMonth() - 1, 1)),
    );
  };

  const handleNextMonth = () => {
    setViewingMonth((prev: Date) =>
      startOfMonth(new Date(prev.getFullYear(), prev.getMonth() + 1, 1)),
    );
  };

  const calendarDays = (monthSummaries?.data || []).map(
    (dayData: WakaTimeSummary) => {
      const totalSeconds = dayData.grand_total.total_seconds;
      let activityLevel = 0;

      if (totalSeconds > 0 && dailyAverage > 0) {
        const ratio = totalSeconds / dailyAverage;
        if (ratio > 1) activityLevel = 4;
        else if (ratio > 0.75) activityLevel = 3;
        else if (ratio > 0.25) activityLevel = 2;
        else activityLevel = 1;
      } else if (totalSeconds > 0) {
        activityLevel = 2;
      }

      return {
        date: dayData.range.date,
        totalTime: dayData.grand_total.text,
        hasActivity: totalSeconds > 0,
        activityLevel,
      };
    },
  );

  if (isLoading && !stats) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['top']}
      >
        <DashboardSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <DashboardHeader />

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingTop: 12,
          paddingBottom: 100,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isStatsRefetching}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.surface}
          />
        }
      >
        <RankPulseCard />

        <TotalTimeCard
          totalTime={totalTimeDisplay}
          totalProjectsCount={totalProjects}
          recentProjects={recentProjects}
        />
        <DailyProgressCard
          totalTime={todayTotal}
          projects={todayProjects}
          percent={todayPercent}
          goalDiffText={todayGoalDiffText}
          avgDiff={todayGoalDiffText}
        />
        <BestDayCard
          date={stats?.data?.best_day?.date}
          totalTime={stats?.data?.best_day?.text}
          totalSeconds={stats?.data?.best_day?.total_seconds}
          dailyAverage={dailyAverage}
          topProject={stats?.data?.projects?.[0]}
        />
        <MonthlyCalendarCard
          monthDate={viewingMonth}
          totalTime={monthTotal}
          days={calendarDays}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          isLoading={monthLoading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
