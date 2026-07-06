import { Card, Typography } from '@/components';
import { useTheme } from '@/hooks';
import { StyleSheet, View } from 'react-native';

interface ProfileStatsProps {
  runningTotal: {
    human_readable_total: string;
    human_readable_daily_average: string;
  };
}

export default function ProfileStats({ runningTotal }: ProfileStatsProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.statsRow}>
      <Card style={styles.statCard}>
        <Typography
          variant="micro"
          color={theme.colors.textSecondary}
          style={styles.statLabel}
        >
          WEEKLY TOTAL
        </Typography>
        <Typography
          variant="title"
          weight="bold"
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {runningTotal.human_readable_total}
        </Typography>
      </Card>
      <Card style={styles.statCard}>
        <Typography
          variant="micro"
          color={theme.colors.textSecondary}
          style={styles.statLabel}
        >
          DAILY AVG
        </Typography>
        <Typography
          variant="title"
          weight="bold"
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {runningTotal.human_readable_daily_average}
        </Typography>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  statLabel: {
    marginBottom: 8,
  },
});
