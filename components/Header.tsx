import { Typography } from '@/components/Typography';
import { useTheme } from '@/hooks/useTheme';
import Feather from '@react-native-vector-icons/feather/static';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons/static';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface HeaderAction {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
  label?: string;
}

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: HeaderAction[];
  rightElement?: React.ReactNode;
  onShare?: () => void;
  style?: ViewStyle;
}

export const Header = ({
  title,
  subtitle,
  actions,
  rightElement,
  onShare,
  style,
}: HeaderProps) => {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      edges={['top']}
      style={[{ backgroundColor: theme.colors.background }, style]}
    >
      <View style={styles.header}>
        <View style={styles.contentRow}>
          <View style={styles.leftSection}>
            {subtitle && (
              <Typography
                variant="caption"
                weight="semibold"
                color={theme.colors.textSecondary}
                style={styles.greeting}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {subtitle}
              </Typography>
            )}
            <Typography
              variant="headline"
              weight="bold"
              color={theme.colors.text}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {title}
            </Typography>
          </View>

          <View style={styles.rightSection}>
            {onShare && (
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.iconButton,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
                onPress={onShare}
              >
                <Feather name="share" size={18} color={theme.colors.text} />
              </TouchableOpacity>
            )}
            {rightElement}
            {actions?.map((action, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                style={[
                  styles.iconButton,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
                onPress={action.onPress}
              >
                <MaterialCommunityIcons
                  name={action.icon}
                  size={20}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  greeting: {
    marginBottom: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
