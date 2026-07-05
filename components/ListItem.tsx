import { useTheme } from '@/hooks/useTheme';
import { Feather } from '@react-native-vector-icons/feather/static';
import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Typography } from './Typography';

interface ListItemProps {
  title: string;
  subtitle?: string;
  description?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rightText?: string;
  onPress?: () => void;
  showChevron?: boolean;
  titleStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}

export const ListItem = ({
  title,
  subtitle,
  description,
  leftIcon,
  rightIcon,
  rightText,
  onPress,
  showChevron = true,
  titleStyle,
  style,
}: ListItemProps) => {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: pressed
            ? theme.colors.surfaceHighlight
            : 'transparent',
          paddingVertical: theme.spacing[3],
          paddingHorizontal: theme.spacing[4],
        },
        style as ViewStyle,
      ]}
    >
      {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

      <View style={styles.content}>
        <Typography variant="body" weight="semibold" style={titleStyle}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="micro" color={theme.colors.textSecondary}>
            {subtitle}
          </Typography>
        )}
        {description && (
          <Typography
            variant="caption"
            color={theme.colors.textSecondary}
            style={{ marginTop: 2 }}
          >
            {description}
          </Typography>
        )}
      </View>

      <View style={styles.rightContent}>
        {rightText && (
          <Typography variant="body" color={theme.colors.textSecondary}>
            {rightText}
          </Typography>
        )}
        {rightIcon}
        {showChevron && !rightIcon && (
          <Feather
            name="chevron-right"
            size={20}
            color={theme.colors.textTertiary}
          />
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  leftIconContainer: {
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
