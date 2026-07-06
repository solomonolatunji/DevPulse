import { useTheme } from '@/hooks/useTheme';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, View, ViewStyle } from 'react-native';
import { Typography } from './Typography';

interface ProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
  showPercentage?: boolean;
  style?: ViewStyle;
}

export const ProgressBar = ({
  progress,
  label,
  showPercentage,
  style,
}: ProgressBarProps) => {
  const { theme } = useTheme();
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: clampedProgress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [clampedProgress]);

  const width = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={style}>
      {(label || showPercentage) && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: theme.spacing[1],
          }}
        >
          {label && (
            <Typography variant="caption" weight="medium">
              {label}
            </Typography>
          )}
          {showPercentage && (
            <Typography
              variant="caption"
              weight="medium"
              color={theme.colors.textSecondary}
            >
              {Math.round(clampedProgress)}%
            </Typography>
          )}
        </View>
      )}
      <View
        style={{
          height: 8,
          backgroundColor: theme.colors.surfaceHighlight,
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={{
            height: '100%',
            backgroundColor: theme.colors.primary,
            width,
            borderRadius: 4,
          }}
        />
      </View>
    </View>
  );
};

export const Spinner = ({
  size = 'small',
  color,
}: {
  size?: 'small' | 'large';
  color?: string;
}) => {
  const { theme } = useTheme();
  return (
    <ActivityIndicator size={size} color={color || theme.colors.primary} />
  );
};
