import { Card, Typography } from '@/components';
import { useTheme } from '@/hooks';
import { calculatePercentageChange, formatDate } from '@/utilities';
import { Feather } from '@react-native-vector-icons/feather/static';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface BestDayCardProps {
  date?: string;
  totalTime?: string;
  totalSeconds?: number;
  dailyAverage?: number;
  topProject?: {
    name: string;
    text: string;
  };
}

export const BestDayCard = ({
  date,
  totalTime,
  totalSeconds = 0,
  dailyAverage = 0,
  topProject,
}: BestDayCardProps) => {
  const { theme, isDark } = useTheme();
  const router = useRouter();

  if (!date || !totalTime || totalSeconds === 0) {
    return null;
  }

  const formattedDate = formatDate(date);

  const percentAboveAverage = calculatePercentageChange(
    totalSeconds,
    dailyAverage,
  );

  const handlePress = () => {
    router.push({ pathname: '/stats/daily', params: { date } });
  };

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
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
        <View style={styles.content}>
          {/* Trophy Icon Section */}
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: isDark
                  ? 'rgba(251, 191, 36, 0.15)'
                  : 'rgba(251, 191, 36, 0.1)',
              },
            ]}
          >
            <View
              style={[
                styles.iconGlow,
                {
                  backgroundColor: isDark
                    ? 'rgba(251, 191, 36, 0.2)'
                    : 'rgba(251, 191, 36, 0.15)',
                },
              ]}
            />
            <MaterialDesignIcons
              name="trophy"
              size={32}
              color={isDark ? '#FBBF24' : '#F59E0B'}
            />
          </View>

          {/* Content Section */}
          <View style={styles.textContainer}>
            <View style={styles.header}>
              <Typography
                variant="micro"
                weight="bold"
                style={[
                  styles.label,
                  { color: isDark ? '#FBBF24' : '#F59E0B' },
                ]}
              >
                BEST DAY
              </Typography>
              <Typography
                variant="caption"
                color={theme.colors.textSecondary}
                weight="medium"
              >
                {formattedDate}
              </Typography>
            </View>

            <View style={styles.statsRow}>
              <Typography
                variant="title"
                weight="bold"
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {totalTime}
              </Typography>
              {percentAboveAverage > 0 && (
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: isDark
                        ? 'rgba(34, 197, 94, 0.15)'
                        : 'rgba(34, 197, 94, 0.1)',
                    },
                  ]}
                >
                  <Feather
                    name="trending-up"
                    size={12}
                    color={isDark ? '#4ADE80' : '#22C55E'}
                    style={{ marginRight: 2 }}
                  />
                  <Typography
                    variant="micro"
                    weight="bold"
                    style={{ color: isDark ? '#4ADE80' : '#22C55E' }}
                  >
                    +{percentAboveAverage}%
                  </Typography>
                </View>
              )}
            </View>

            {topProject ? (
              <View style={styles.topProjectRow}>
                <Feather
                  name="code"
                  size={12}
                  color={theme.colors.textSecondary}
                  style={{ marginRight: 4 }}
                />
                <Typography
                  variant="caption"
                  color={theme.colors.textSecondary}
                  numberOfLines={1}
                  style={{ flexShrink: 1 }}
                >
                  {topProject.name}
                </Typography>
                <Typography
                  variant="caption"
                  color={theme.colors.textSecondary}
                  style={{ marginLeft: 4 }}
                >
                  •
                </Typography>
                <Typography
                  variant="caption"
                  color={theme.colors.textSecondary}
                  weight="medium"
                  style={{ marginLeft: 4 }}
                >
                  {topProject.text}
                </Typography>
              </View>
            ) : (
              <Typography
                variant="caption"
                color={theme.colors.textSecondary}
                style={{ marginTop: 2 }}
              >
                Your most productive day
              </Typography>
            )}
          </View>

          {/* Chevron indicator */}
          <Feather
            name="chevron-right"
            size={18}
            color={theme.colors.textSecondary}
            style={{ opacity: 0.5 }}
          />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 16,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconGlow: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  textContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  topProjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
});
