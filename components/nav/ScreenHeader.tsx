import { Typography } from '@/components/Typography';
import { useTheme } from '@/hooks/useTheme';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton } from './BackButton';

interface ScreenHeaderProps {
  title: string;
}

const ScreenHeader = ({ title }: ScreenHeaderProps) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <BackButton />
      <View style={styles.titleContainer}>
        <Typography
          variant="title"
          weight="bold"
          numberOfLines={1}
          color={theme.colors.text}
          style={styles.titleText}
        >
          {title}
        </Typography>
      </View>
      <View style={styles.spacer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    textAlign: 'center',
  },
  spacer: {
    width: 40,
    marginLeft: 12,
  },
});

export default ScreenHeader;
