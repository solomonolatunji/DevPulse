import { useTheme } from '@/hooks/useTheme';
import { StyleSheet, View } from 'react-native';
import { Card } from './Card';
import { Typography } from './Typography';

export interface StatSegment {
  label: string;
  percent: number;
  color: string;
  valueText: string;
}

interface SegmentedStatsCardProps {
  title: string;
  segments: StatSegment[];
  subtitle?: string;
}

export const SegmentedStatsCard = ({
  title,
  segments,
  subtitle,
}: SegmentedStatsCardProps) => {
  const { theme } = useTheme();

  const totalPercent = segments.reduce((sum, s) => sum + s.percent, 0);

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Typography
          variant="title"
          style={styles.title}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" style={styles.subtitle}>
            {subtitle}
          </Typography>
        )}
      </View>

      <View
        style={[
          styles.barContainer,
          { backgroundColor: theme.colors.surfaceHighlight },
        ]}
      >
        {segments.map((segment, index) => (
          <View
            key={index}
            style={[
              styles.segment,
              {
                width: `${(segment.percent / Math.max(totalPercent, 100)) * 100}%`,
                backgroundColor: segment.color,
                borderTopLeftRadius: index === 0 ? 8 : 0,
                borderBottomLeftRadius: index === 0 ? 8 : 0,
                borderTopRightRadius: index === segments.length - 1 ? 8 : 0,
                borderBottomRightRadius: index === segments.length - 1 ? 8 : 0,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.list}>
        {segments.map((segment, index) => (
          <View key={index} style={styles.listItem}>
            <View style={styles.labelGroup}>
              <View style={[styles.dot, { backgroundColor: segment.color }]} />
              <Typography variant="body" style={styles.label}>
                {segment.label}
              </Typography>
            </View>
            <View style={styles.valueGroup}>
              <Typography variant="body" style={styles.percentText}>
                {segment.percent.toFixed(1)}%
              </Typography>
              <Typography variant="caption" style={styles.valueText}>
                {segment.valueText}
              </Typography>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontWeight: '700',
  },
  subtitle: {
    opacity: 0.7,
  },
  barContainer: {
    height: 12,
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  segment: {
    height: '100%',
  },
  list: {
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  label: {
    fontWeight: '500',
  },
  valueGroup: {
    alignItems: 'flex-end',
  },
  percentText: {
    fontWeight: '600',
  },
  valueText: {
    opacity: 0.6,
  },
});
