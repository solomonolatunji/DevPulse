import { Typography } from '@/components/Typography';
import { useTheme } from '@/hooks/useTheme';
import Feather from '@react-native-vector-icons/feather/static';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export const DashboardBanner = () => {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.banner, { backgroundColor: theme.colors.primary + '10' }]}
      onPress={() => router.push('/stats/numbers')}
    >
      <View>
        <Typography variant="body" weight="bold" color={theme.colors.primary}>
          The Numbers
        </Typography>
        <Typography variant="caption" color={theme.colors.textSecondary}>
          Tap for detailed analytics & charts
        </Typography>
      </View>
      <Feather name="chevron-right" size={20} color={theme.colors.primary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
});
