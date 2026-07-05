import { useTheme } from '@/hooks/useTheme';
import Feather from '@react-native-vector-icons/feather/static';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface ShareButtonProps {
  onPress: () => void;
  tintColor?: string;
}

export const ShareButton = ({ onPress, tintColor }: ShareButtonProps) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.iconButtonContainer,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <Feather name="share" size={18} color={tintColor || theme.colors.text} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ShareButton;
