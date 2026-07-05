import { Card, Typography } from '@/components';
import { useTheme } from '@/hooks';
import Feather from '@react-native-vector-icons/feather/static';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface DailyTotalCardProps {
  totalTimeLabel: string;
  goalDiffText: string;
  isPositiveDiff: boolean;
  diffColor: string;
}

export const DailyTotalCard = ({
  totalTimeLabel,
  goalDiffText,
  isPositiveDiff,
  diffColor,
}: DailyTotalCardProps) => {
  const { theme, isDark } = useTheme();

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
      {/* Content Section */}
      <View style={styles.content}>
        <Typography
          variant="micro"
          weight="bold"
          align="center"
          style={[styles.label, { color: theme.colors.primary }]}
        >
          TOTAL WORKED
        </Typography>
        <Typography
          variant="display"
          weight="bold"
          align="center"
          style={{ fontSize: 32, lineHeight: 40, marginVertical: 4 }}
        >
          {totalTimeLabel}
        </Typography>

        {goalDiffText ? (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: isPositiveDiff
                  ? theme.colors.successContainer
                  : theme.colors.errorContainer,
                marginTop: 4,
                alignSelf: 'center',
              },
            ]}
          >
            <Feather
              name={isPositiveDiff ? 'trending-up' : 'trending-down'}
              size={12}
              color={diffColor}
              style={{ marginRight: 4 }}
            />
            <Typography
              variant="caption"
              weight="bold"
              style={{ color: diffColor }}
            >
              {goalDiffText}
            </Typography>
          </View>
        ) : (
          <Typography
            variant="caption"
            color={theme.colors.textSecondary}
            align="center"
            style={{ marginTop: 2 }}
          >
            No data vs average
          </Typography>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 16,
    overflow: 'hidden',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
});
