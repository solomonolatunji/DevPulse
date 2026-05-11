import { useTheme } from '@/hooks/useTheme';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from './Typography';

export interface BottomSheetProps {
  title?: string;
  children: React.ReactNode;
  snapPoints?: string[];
  onDismiss?: () => void;
  keyboardBehavior?: 'interactive' | 'extend' | 'fillParent';
  keyboardBlurBehavior?: 'none' | 'restore';
  android_keyboardInputMode?: 'adjustPan' | 'adjustResize';
  enableContentPanningGesture?: boolean;
  enableHandlePanningGesture?: boolean;
}

export const BottomSheet = forwardRef<BottomSheetModal, BottomSheetProps>(
  (
    {
      title,
      children,
      snapPoints: propSnapPoints,
      onDismiss,
      keyboardBehavior = 'interactive',
      keyboardBlurBehavior = 'restore',
      android_keyboardInputMode = 'adjustResize',
      enableContentPanningGesture = true,
      enableHandlePanningGesture = true,
    },
    ref,
  ) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const snapPoints = useMemo(
      () => propSnapPoints || ['50%'],
      [propSnapPoints],
    );

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        onDismiss={onDismiss}
        enableOverDrag={false}
        enablePanDownToClose={enableContentPanningGesture}
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        keyboardBehavior={keyboardBehavior}
        keyboardBlurBehavior={keyboardBlurBehavior}
        android_keyboardInputMode={android_keyboardInputMode}
        enableContentPanningGesture={enableContentPanningGesture}
        enableHandlePanningGesture={enableHandlePanningGesture}
        backgroundStyle={{
          backgroundColor: theme.colors.surface,
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.textTertiary,
        }}
      >
        {title && (
          <View
            style={[
              styles.header,
              {
                borderBottomColor: theme.colors.border,
                paddingBottom: theme.spacing[4],
                marginBottom: theme.spacing[4],
              },
            ]}
          >
            <Typography
              variant="subtitle"
              weight="bold"
              style={{ textAlign: 'center' }}
            >
              {title}
            </Typography>
          </View>
        )}
        {children}
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
