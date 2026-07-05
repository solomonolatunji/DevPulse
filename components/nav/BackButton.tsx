import { useTheme } from '@/hooks/useTheme';
import Feather from '@react-native-vector-icons/feather/static';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface BackButtonProps {
  onPress?: () => void;
  tintColor?: string;
}

export const BackButton = ({ onPress, tintColor }: BackButtonProps) => {
  const { theme } = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      if (router.canGoBack()) {
        router.back();
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.iconButtonContainer,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <Feather
        name="arrow-left"
        size={20}
        color={tintColor || theme.colors.text}
      />
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
    marginRight: 12,
  },
});

export default BackButton;
