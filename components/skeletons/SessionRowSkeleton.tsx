import { useTheme } from '@/hooks';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from '../Skeleton';

export const SessionRowSkeleton = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    card: {
      marginBottom: theme.spacing[4],
      padding: theme.spacing[3],
      borderWidth: 1,
      borderColor: theme.colors.border + '20',
      borderRadius: theme.tokens.borderRadius.lg,
      backgroundColor: theme.colors.surfaceSubtle,
    },
  });

  return (
    <View style={styles.card}>
      <Skeleton
        width={120}
        height={20}
        style={{ marginBottom: theme.spacing[3], marginLeft: theme.spacing[2] }}
      />
      <Skeleton
        width="100%"
        height={60}
        borderRadius={theme.tokens.borderRadius.md}
      />
    </View>
  );
};
