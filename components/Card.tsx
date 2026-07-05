import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
}

export const Card = ({
  children,
  style,
  variant = 'elevated',
  ...props
}: CardProps) => {
  const { theme, isDark } = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: theme.colors.surface,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.12,
          shadowRadius: 8,
          borderWidth: isDark ? 0 : 1,
          borderColor: theme.colors.border,
        };
      case 'outlined':
        return {
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      case 'filled':
        return {
          backgroundColor: theme.colors.surfaceHighlight,
        };
    }
  };

  return (
    <View
      style={[
        styles.card,
        getVariantStyle(),
        { borderRadius: theme.spacing[4], padding: theme.spacing[4] },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
  },
});
