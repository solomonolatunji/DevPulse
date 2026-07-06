import { useTheme } from '@/hooks/useTheme';
import { Pressable, StyleSheet, View } from 'react-native';
import { Typography } from './Typography';

interface SwitchProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Switch = ({ label, checked, onChange, disabled }: SwitchProps) => {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={() => !disabled && onChange(!checked)}
      style={[styles.container, disabled && { opacity: 0.5 }]}
    >
      <View
        style={{
          width: 44,
          height: 24,
          borderRadius: 99,
          backgroundColor: checked
            ? theme.colors.primary
            : theme.colors.surfaceHighlight,
          justifyContent: 'center',
          paddingHorizontal: 2,
        }}
      >
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: theme.colors.surface,
            transform: [{ translateX: checked ? 20 : 0 }],
          }}
        />
      </View>
      {label && (
        <Typography variant="body" style={{ marginLeft: theme.spacing[3] }}>
          {label}
        </Typography>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
});
