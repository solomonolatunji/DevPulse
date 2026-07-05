import { Button, Card, Skeleton, Typography } from '@/components';
import { WEEK_DAYS } from '@/constants';
import { useTheme } from '@/hooks';
import { DATE_FORMATS, formatDate } from '@/utilities';
import { hexToRgba } from '@/utilities/colors';
import Feather from '@react-native-vector-icons/feather/static';
import {
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  format,
  getDay,
  isAfter,
  isSameDay,
  isSameMonth,
  startOfMonth,
} from 'date-fns';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface DailySummary {
  date: string;
  totalTime: string;
  hasActivity: boolean;
  activityLevel: number;
}

interface CalendarDayData {
  day: string;
  date: Date;
  summary?: DailySummary;
}

interface MonthlyCalendarCardProps {
  monthDate: Date;
  totalTime: string;
  days: DailySummary[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  isLoading?: boolean;
}

export const MonthlyCalendarCard = ({
  monthDate,
  totalTime,
  days,
  onPrevMonth,
  onNextMonth,
  isLoading,
}: MonthlyCalendarCardProps) => {
  const { theme, isDark } = useTheme();
  const router = useRouter();

  const isCurrentMonth = isSameMonth(monthDate, new Date());

  const start = startOfMonth(monthDate);
  const end = endOfMonth(monthDate);
  const currentMonthName = format(monthDate, 'MMMM');

  const calendarDays = eachDayOfInterval({ start, end });
  const startDay = getDay(start);

  const weeks = [];
  let week = Array(7).fill(null);

  for (let i = 0; i < startDay; i++) {
    week[i] = null;
  }

  calendarDays.forEach((day, index) => {
    const dayOfWeek = getDay(day);
    if (dayOfWeek === 0 && week.some((d) => d !== null)) {
      weeks.push([...week]);
      week = Array(7).fill(null);
    }

    const summary = days.find((d) => isSameDay(new Date(d.date), day));

    week[dayOfWeek] = {
      day: format(day, 'd'),
      date: day,
      summary,
    };
  });
  weeks.push(week);

  const getHeatmapColor = (level: number) => {
    if (level === 0) return 'transparent';
    const opacityMap: Record<number, number> = {
      1: 0.12,
      2: 0.25,
      3: 0.44,
      4: 1.0,
    };
    return hexToRgba(theme.colors.primary, opacityMap[level] || 0.12);
  };

  const renderDay = (dayData: CalendarDayData | null, index: number) => {
    if (!dayData) return <View key={index} style={styles.dayCell} />;

    const { summary, day, date } = dayData;
    const isFuture = isAfter(date, endOfDay(new Date()));
    const hasActivity = summary?.hasActivity;
    const activityLevel = summary?.activityLevel || 0;
    const bgColor = getHeatmapColor(activityLevel);

    if (isLoading) {
      return (
        <View key={index} style={styles.dayCell}>
          <Skeleton variant="circle" width={32} height={32} />
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={index}
        style={styles.dayCell}
        onPress={() => {
          if (isFuture) return;
          const dateStr = formatDate(dayData.date, DATE_FORMATS.ISO);
          router.push(`/stats/daily?date=${dateStr}`);
        }}
        activeOpacity={isFuture ? 1 : 0.7}
        disabled={isFuture}
      >
        <View
          style={[
            styles.dayCircle,
            {
              backgroundColor: hasActivity
                ? bgColor
                : isDark
                  ? 'rgba(255,255,255,0.03)'
                  : 'rgba(0,0,0,0.02)',
            },
            activityLevel === 4 && {
              borderColor: theme.colors.primary,
              borderWidth: 1,
            },
            isFuture && { opacity: 0.3 },
          ]}
        >
          <Typography
            variant="body"
            weight={hasActivity ? 'bold' : 'medium'}
            color={
              activityLevel >= 3
                ? '#fff'
                : isFuture
                  ? theme.colors.textSecondary
                  : theme.colors.text
            }
            align="center"
          >
            {day}
          </Typography>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Card
      style={[
        styles.card,
        {
          borderColor: theme.colors.border,
          borderWidth: 1,
          backgroundColor: theme.colors.surface,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={onPrevMonth} style={styles.navButton}>
            <Feather name="chevron-left" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.monthInfo}>
            <Typography
              variant="title"
              weight="bold"
              align="center"
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {totalTime}
            </Typography>
            <Typography
              variant="caption"
              color={theme.colors.textSecondary}
              align="center"
            >
              worked in {currentMonthName}
            </Typography>
          </View>
          <TouchableOpacity
            onPress={onNextMonth}
            style={styles.navButton}
            disabled={isCurrentMonth}
          >
            <Feather
              name="chevron-right"
              size={24}
              color={theme.colors.text}
              style={{ opacity: isCurrentMonth ? 0.3 : 1 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={[
          styles.calendarContainer,
          {
            backgroundColor: isDark
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(0,0,0,0.02)',
          },
        ]}
      >
        <View style={styles.daysHeader}>
          {WEEK_DAYS.map((day) => (
            <Typography
              key={day}
              variant="caption"
              weight="bold"
              color={theme.colors.textSecondary}
              style={{ width: '14.28%', textAlign: 'center' }}
            >
              {day}
            </Typography>
          ))}
        </View>

        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((day, dayIndex) => renderDay(day, dayIndex))}
          </View>
        ))}

        <Button
          label="VIEW DETAILS OF THIS MONTH"
          onPress={() => router.push('/stats/numbers?range=last_30_days')}
          variant="soft"
          fullWidth
          style={{ marginTop: 16 }}
          labelStyle={{
            fontSize: 10,
            letterSpacing: 0.5,
            color: isDark ? theme.colors.text : theme.colors.textInverse,
          }}
          size="sm"
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 16,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  navButton: {
    padding: 8,
  },
  monthInfo: {
    flex: 1,
    alignItems: 'center',
  },
  calendarContainer: {
    borderRadius: 12,
    padding: 16,
  },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    opacity: 0.5,
  },
});
