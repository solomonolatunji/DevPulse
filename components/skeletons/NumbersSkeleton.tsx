import { useTheme } from '@/hooks';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from '../Skeleton';

export const NumbersSkeleton = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      padding: theme.spacing[4],
    },
    marginBottom: {
      marginBottom: theme.spacing[6],
    },
    marginBottomSmall: {
      marginBottom: theme.spacing[2],
    },
    marginRight: {
      marginRight: theme.spacing[4],
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing[3],
      marginBottom: theme.spacing[6],
    },
    card: {
      width: '48%',
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing[4],
      borderRadius: theme.tokens.borderRadius.lg,
      backgroundColor: theme.colors.surfaceSubtle,
      borderWidth: 1,
      borderColor: theme.colors.border + '20',
    },
    flex: {
      flex: 1,
    },
    segmentedCard: {
      padding: theme.spacing[4],
      borderRadius: theme.tokens.borderRadius.lg,
      backgroundColor: theme.colors.surfaceSubtle,
      borderWidth: 1,
      borderColor: theme.colors.border + '20',
      marginBottom: theme.spacing[4],
    },
    segmentRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing[3],
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

  return (
    <View style={styles.container}>
      {/* Time Range Selector */}
      <Skeleton
        width="100%"
        height={40}
        borderRadius={theme.tokens.borderRadius.full}
        style={styles.marginBottom}
      />

      {/* Stats Grid */}
      <View style={styles.grid}>
        {[1, 2, 3, 4, 5, 6].map((key) => (
          <View key={key} style={styles.card}>
            <Skeleton
              width={48}
              height={48}
              borderRadius={theme.tokens.borderRadius.md}
              style={styles.marginRight}
            />
            <View style={styles.flex}>
              <Skeleton
                width={80}
                height={12}
                style={styles.marginBottomSmall}
              />
              <Skeleton width={60} height={20} />
            </View>
          </View>
        ))}
      </View>

      {/* Segmented Stats Cards */}
      {[1, 2, 3].map((key) => (
        <View key={key} style={styles.segmentedCard}>
          <Skeleton width={120} height={20} style={styles.marginBottom} />
          {[1, 2, 3, 4, 5].map((item) => (
            <View key={item} style={styles.segmentRow}>
              <View style={styles.row}>
                <Skeleton
                  width={20}
                  height={20}
                  borderRadius={theme.tokens.borderRadius.xs}
                  style={styles.marginRight}
                />
                <Skeleton width={100} height={16} />
              </View>
              <Skeleton width={40} height={16} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};
