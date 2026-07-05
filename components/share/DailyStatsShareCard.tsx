import { useShareTheme } from '@/hooks/useShareTheme';
import { Feather } from '@react-native-vector-icons/feather/static';
import { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography } from '../Typography';
import { ShareCardWrapper } from './ShareCardWrapper';

interface DailyStatsShareCardProps {
  date: string;
  totalTime: string;
  diffText?: string;
  isPositiveDiff?: boolean;
  topLanguages?: Array<{ name: string; percent: number }>;
  topProjects?: Array<{ name: string; text: string; color?: string }>;
  total7d?: string;
}

export const DailyStatsShareCard = forwardRef<View, DailyStatsShareCardProps>(
  (
    {
      date,
      totalTime,
      diffText,
      isPositiveDiff,
      topLanguages,
      topProjects,
      total7d,
    },
    ref,
  ) => {
    const { textColor, mutedColor, surfaceColor, accent } = useShareTheme();
    const { isDark } = useShareTheme();

    const positiveColor = isDark ? '#4ADE80' : '#22C55E';
    const negativeColor = isDark ? '#F87171' : '#EF4444';

    const isToday = date.toUpperCase().includes('TODAY');
    const dateIcon = isToday ? 'zap' : 'calendar';

    return (
      <ShareCardWrapper ref={ref} outerPadding={24}>
        <View style={styles.topContainer}>
          <View style={styles.headerInfo}>
            <View
              style={[
                styles.dateBadge,
                {
                  backgroundColor: accent + '10',
                  borderColor: accent + '20',
                },
              ]}
            >
              <Feather name={dateIcon} size={12} color={accent} />
              <Typography
                variant="micro"
                weight="bold"
                color={accent}
                style={styles.dateLabel}
              >
                {date.toUpperCase()}
              </Typography>
            </View>
          </View>

          <View style={styles.heroSection}>
            <Typography
              variant="micro"
              weight="bold"
              color={mutedColor}
              style={styles.heroLabel}
            >
              TOTAL CODING TIME
            </Typography>
            <Typography
              variant="display"
              weight="bold"
              color={textColor}
              style={styles.totalTime}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {totalTime}
            </Typography>

            {diffText ? (
              <View
                style={[
                  styles.diffBadge,
                  {
                    backgroundColor:
                      (isPositiveDiff ? positiveColor : negativeColor) + '15',
                  },
                ]}
              >
                <Feather
                  name={isPositiveDiff ? 'trending-up' : 'trending-down'}
                  size={12}
                  color={isPositiveDiff ? positiveColor : negativeColor}
                />
                <Typography
                  variant="caption"
                  weight="bold"
                  color={isPositiveDiff ? positiveColor : negativeColor}
                >
                  {diffText}
                </Typography>
              </View>
            ) : null}
          </View>
        </View>

        {total7d && (
          <View style={styles.secondaryStats}>
            <View
              style={[
                styles.sevenDayBadge,
                { backgroundColor: surfaceColor, borderColor: accent + '15' },
              ]}
            >
              <Typography variant="micro" weight="bold" color={mutedColor}>
                LAST 7 DAYS
              </Typography>
              <Typography
                variant="body"
                weight="bold"
                color={textColor}
                numberOfLines={1}
                adjustsFontSizeToFit
                style={styles.sevenDayValue}
              >
                {total7d}
              </Typography>
            </View>
          </View>
        )}

        <View style={styles.statsGrid}>
          {topLanguages && topLanguages.length > 0 && (
            <View style={[styles.statBox, { backgroundColor: surfaceColor }]}>
              <View style={styles.statHeader}>
                <Feather name="code" size={12} color={accent} />
                <Typography variant="micro" weight="bold" color={mutedColor}>
                  LANGUAGES
                </Typography>
              </View>
              <View style={styles.statContent}>
                {topLanguages.slice(0, 3).map((lang, i) => (
                  <View key={lang.name} style={styles.statItem}>
                    <View
                      style={[
                        styles.statDot,
                        { backgroundColor: accent, opacity: 1 - i * 0.25 },
                      ]}
                    />
                    <Typography
                      variant="caption"
                      weight="bold"
                      color={textColor}
                      style={styles.itemName}
                      numberOfLines={1}
                    >
                      {lang.name}
                    </Typography>
                    <Typography
                      variant="micro"
                      weight="bold"
                      color={mutedColor}
                      numberOfLines={1}
                    >
                      {Math.round(lang.percent)}%
                    </Typography>
                  </View>
                ))}
              </View>
            </View>
          )}

          {topProjects && topProjects.length > 0 && (
            <View style={[styles.statBox, { backgroundColor: surfaceColor }]}>
              <View style={styles.statHeader}>
                <Feather name="folder" size={12} color={accent} />
                <Typography variant="micro" weight="bold" color={mutedColor}>
                  PROJECTS
                </Typography>
              </View>
              <View style={styles.statContent}>
                {topProjects.slice(0, 3).map((proj) => (
                  <View key={proj.name} style={styles.statItem}>
                    <View
                      style={[
                        styles.statDot,
                        { backgroundColor: proj.color || accent },
                      ]}
                    />
                    <Typography
                      variant="caption"
                      weight="bold"
                      color={textColor}
                      style={styles.itemName}
                      numberOfLines={1}
                    >
                      {proj.name}
                    </Typography>
                    <Typography
                      variant="micro"
                      weight="bold"
                      color={mutedColor}
                      numberOfLines={1}
                    >
                      {proj.text}
                    </Typography>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ShareCardWrapper>
    );
  },
);

DailyStatsShareCard.displayName = 'DailyStatsShareCard';

const styles = StyleSheet.create({
  topContainer: {
    alignItems: 'center',
    gap: 12,
  },
  headerInfo: {
    alignItems: 'center',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  dateLabel: {
    letterSpacing: 1.5,
  },
  heroSection: {
    alignItems: 'center',
    gap: 4,
  },
  heroLabel: {
    letterSpacing: 1,
    opacity: 0.8,
  },
  totalTime: {
    fontSize: 48,
    lineHeight: 56,
    textAlign: 'center',
  },
  diffBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  secondaryStats: {
    alignItems: 'center',
    marginVertical: 12,
  },
  sevenDayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  sevenDayValue: {
    flexShrink: 1,
  },
  statsGrid: {
    flexDirection: 'column',
    gap: 12,
  },
  statBox: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    opacity: 0.9,
  },
  statContent: {
    gap: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
  },
  statDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  itemName: {
    flex: 1,
    minWidth: 0,
  },
});
