import { StyleSheet, View } from 'react-native';
import { Skeleton } from '../Skeleton';

export const DashboardSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Skeleton width={120} height={24} style={{ marginBottom: 4 }} />
          <Skeleton width={180} height={16} />
        </View>
        <Skeleton width={40} height={40} borderRadius={20} />
      </View>

      {/* Rank Card */}
      <View style={styles.card}>
        <Skeleton width="100%" height={100} borderRadius={16} />
      </View>

      {/* Total Time Card */}
      <View style={styles.card}>
        <Skeleton width="100%" height={140} borderRadius={16} />
      </View>

      {/* Daily Progress Card */}
      <View style={styles.card}>
        <Skeleton width="100%" height={180} borderRadius={16} />
      </View>

      {/* Monthly Calendar Card */}
      <View style={styles.card}>
        <Skeleton width="100%" height={250} borderRadius={16} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  card: {
    marginBottom: 16,
  },
});
