import { Typography } from '@/components/Typography';
import { STATS_RANGES, StatsRange } from '@/constants/wakatime';
import { useTheme } from '@/hooks/useTheme';
import { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

export type TimeRange = StatsRange;

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
  availableRanges?: readonly { label: string; value: string }[];
}

const DEFAULT_RANGES = STATS_RANGES;

export const TimeRangeSelector = ({
  value,
  onChange,
  availableRanges = DEFAULT_RANGES,
}: TimeRangeSelectorProps) => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const containerPadding = 2;
  const horizontalMargin = 32;
  const segmentWidth =
    (width - horizontalMargin - containerPadding * 2) / availableRanges.length;

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const index = availableRanges.findIndex((r) => r.value === value);
    if (index !== -1) {
      Animated.spring(animatedValue, {
        toValue: index * segmentWidth,
        useNativeDriver: true,
        friction: 12,
        tension: 50,
      }).start();
    }
  }, [value, segmentWidth, availableRanges]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surfaceHighlight,
          padding: containerPadding,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.activeSegment,
          {
            width: segmentWidth,
            transform: [{ translateX: animatedValue }],
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.primary,
            left: containerPadding,
          },
        ]}
      />
      <View style={styles.segmentsContainer}>
        {availableRanges.map((range) => {
          const isSelected = value === range.value;
          const displayLabel = range.label.replace(' ', '\u00A0');

          return (
            <TouchableOpacity
              key={range.value}
              style={[styles.segment, { width: segmentWidth }]}
              onPress={() => onChange(range.value as TimeRange)}
              activeOpacity={0.7}
            >
              <Typography
                variant="micro"
                weight={isSelected ? 'bold' : 'medium'}
                color={
                  isSelected ? theme.colors.primary : theme.colors.textSecondary
                }
                align="center"
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
                style={styles.label}
              >
                {displayLabel}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    marginVertical: 12,
    position: 'relative',
    height: 40,
    justifyContent: 'center',
  },
  segmentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  segment: {
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    zIndex: 1,
  },
  activeSegment: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    borderRadius: 20,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  label: {
    paddingHorizontal: 2,
  },
});
