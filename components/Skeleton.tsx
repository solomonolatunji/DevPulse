import { useTheme } from '@/hooks/useTheme';
import { useEffect } from 'react';
import { DimensionValue, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  variant?: 'rect' | 'circle';
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton = ({
  width = '100%',
  height = 20,
  variant = 'rect',
  borderRadius,
  style,
}: SkeletonProps) => {
  const { theme } = useTheme();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 1000 }),
        withTiming(0.7, { duration: 1000 }),
      ),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: theme.colors.surfaceHighlight,
          borderRadius:
            borderRadius ??
            (variant === 'circle'
              ? typeof height === 'number'
                ? height / 2
                : 999
              : theme.spacing[1]),
        },
        animatedStyle,
        style,
      ]}
    />
  );
};
