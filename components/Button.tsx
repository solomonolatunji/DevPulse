import { useTheme } from '@/hooks/useTheme';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  PressableProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Typography } from './Typography';

type ButtonVariant =
  'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline' | 'soft';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

export const Button = ({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  labelStyle,
  onPress,
  ...props
}: ButtonProps) => {
  const { theme } = useTheme();

  const handlePress = (e: GestureResponderEvent) => {
    Haptics.selectionAsync();
    onPress?.(e);
  };

  const getVariantStyles = (pressed: boolean) => {
    const opacity = pressed ? 0.9 : 1;
    const baseDisabled = disabled || loading;

    switch (variant) {
      case 'primary':
        return {
          backgroundColor: baseDisabled
            ? theme.colors.primaryContainer
            : theme.colors.primary,
          opacity: baseDisabled ? 0.5 : opacity,
        };
      case 'secondary':
        return {
          backgroundColor: baseDisabled
            ? theme.colors.surfaceHighlight
            : theme.colors.secondaryContainer,
          opacity: baseDisabled ? 0.5 : opacity,
        };
      case 'ghost':
        return {
          backgroundColor: pressed
            ? theme.colors.surfaceHighlight
            : 'transparent',
          opacity: baseDisabled ? 0.5 : opacity,
        };
      case 'destructive':
        return {
          backgroundColor: baseDisabled
            ? theme.colors.errorContainer
            : theme.colors.error,
          opacity: baseDisabled ? 0.5 : opacity,
        };
      case 'outline':
        return {
          backgroundColor: pressed
            ? theme.colors.surfaceHighlight
            : 'transparent',
          borderWidth: 1.5,
          borderColor: baseDisabled
            ? theme.colors.border
            : theme.colors.primary,
          opacity: baseDisabled ? 0.5 : opacity,
        };
      case 'soft':
        return {
          backgroundColor: baseDisabled
            ? theme.colors.surfaceHighlight
            : theme.colors.primary + '15',
          opacity: baseDisabled ? 0.5 : opacity,
        };
    }
  };

  const getLabelColor = () => {
    if (disabled) return theme.colors.textTertiary;

    switch (variant) {
      case 'primary':
        return theme.colors.primaryForeground;
      case 'secondary':
        return theme.colors.secondaryContainerForeground;
      case 'ghost':
        return theme.colors.text;
      case 'destructive':
        return theme.colors.textInverse;
      case 'outline':
        return theme.colors.primary;
      case 'soft':
        return theme.colors.primary;
    }
  };

  const getHeight = () => {
    switch (size) {
      case 'sm':
        return 36;
      case 'md':
        return 44;
      case 'lg':
        return 54;
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm':
        return theme.spacing[4];
      case 'md':
        return theme.spacing[6];
      case 'lg':
        return theme.spacing[8];
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'caption';
      case 'md':
        return 'body';
      case 'lg':
        return 'lg';
    }
  };

  return (
    <Pressable
      disabled={disabled || loading}
      onPress={handlePress}
      style={({ pressed }) => [
        {
          height: getHeight(),
          paddingHorizontal: getPadding(),
          borderRadius: 100,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          gap: theme.spacing[2],
        },
        getVariantStyles(pressed),
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getLabelColor()} size="small" />
      ) : (
        <>
          {leftIcon}
          <Typography
            variant={size === 'sm' ? 'caption' : size === 'md' ? 'body' : 'lg'}
            weight="bold"
            style={[{ color: getLabelColor() }, labelStyle]}
          >
            {label}
          </Typography>
          {rightIcon}
        </>
      )}
    </Pressable>
  );
};
