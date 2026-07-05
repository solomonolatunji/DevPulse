import { Typography } from '@/components/Typography';
import { useTheme } from '@/hooks/useTheme';
import Feather from '@react-native-vector-icons/feather/static';
import React from 'react';
import { StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

interface SettingItemProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  color?: string;
  description?: string;
  disabled?: boolean;
}

export const SettingItem = ({
  icon,
  label,
  value,
  onPress,
  isSwitch,
  switchValue,
  onSwitchChange,
  color,
  description,
  disabled,
}: SettingItemProps) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={disabled || isSwitch}
    >
      <View
        style={[
          styles.settingIcon,
          { backgroundColor: (color || theme.colors.primary) + '15' },
        ]}
      >
        <Feather name={icon} size={20} color={color || theme.colors.primary} />
      </View>
      <View style={styles.settingText}>
        <Typography weight="medium">{label}</Typography>
        {description && (
          <Typography variant="micro" color={theme.colors.textSecondary}>
            {description}
          </Typography>
        )}
      </View>
      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{
            false: theme.colors.border,
            true: theme.colors.primary,
          }}
          thumbColor={theme.colors.surface}
        />
      ) : (
        <View style={styles.settingValue}>
          {value && (
            <Typography
              variant="caption"
              color={theme.colors.textSecondary}
              style={{ marginRight: 8 }}
            >
              {value}
            </Typography>
          )}
          <Feather
            name="chevron-right"
            size={18}
            color={theme.colors.textSecondary}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
