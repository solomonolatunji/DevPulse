import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { Typography } from '@/components/Typography';
import { useTheme } from '@/hooks/useTheme';
import Feather from '@react-native-vector-icons/feather/static';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';

interface LogoutBottomSheetProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const LogoutBottomSheet = forwardRef<
  BottomSheetModal,
  LogoutBottomSheetProps
>(({ onConfirm, onCancel }, ref) => {
  const { theme } = useTheme();

  return (
    <BottomSheet ref={ref} title="Logout" snapPoints={['50%']}>
      <View style={styles.logoutContent}>
        <View style={styles.logoutIconContainer}>
          <Feather name="log-out" size={40} color={theme.colors.error} />
        </View>
        <Typography variant="title" weight="bold" style={styles.logoutTitle}>
          Are you sure?
        </Typography>
        <Typography
          color={theme.colors.textSecondary}
          style={styles.logoutDescription}
        >
          You will need to enter your API key again to access your stats.
        </Typography>
        <View style={styles.logoutActions}>
          <Button
            label="CANCEL"
            variant="outline"
            onPress={onCancel}
            style={{ flex: 1 }}
          />
          <Button
            label="LOGOUT"
            variant="destructive"
            onPress={onConfirm}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  logoutContent: {
    padding: 24,
    alignItems: 'center',
  },
  logoutIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoutTitle: {
    marginBottom: 8,
  },
  logoutDescription: {
    textAlign: 'center',
    marginBottom: 32,
  },
  logoutActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
});
