import { StyleSheet, View } from 'react-native';
import { Skeleton } from '../Skeleton';

export const LeaderboardSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Top 3 Podium Placeholder */}
      <View style={styles.podium}>
        <View style={[styles.podiumItem, { marginTop: 40 }]}>
          <Skeleton
            width={60}
            height={60}
            borderRadius={30}
            style={{ marginBottom: 8 }}
          />
          <Skeleton width={40} height={12} />
        </View>
        <View style={styles.podiumItem}>
          <Skeleton
            width={80}
            height={80}
            borderRadius={40}
            style={{ marginBottom: 8 }}
          />
          <Skeleton width={50} height={14} />
        </View>
        <View style={[styles.podiumItem, { marginTop: 50 }]}>
          <Skeleton
            width={60}
            height={60}
            borderRadius={30}
            style={{ marginBottom: 8 }}
          />
          <Skeleton width={40} height={12} />
        </View>
      </View>

      {/* List Items */}
      {[1, 2, 3, 4, 5, 6].map((key) => (
        <View key={key} style={styles.listItem}>
          <Skeleton width={24} height={16} style={{ marginRight: 16 }} />
          <Skeleton
            width={40}
            height={40}
            borderRadius={20}
            style={{ marginRight: 12 }}
          />
          <View style={{ flex: 1 }}>
            <Skeleton width={100} height={16} style={{ marginBottom: 4 }} />
            <Skeleton width={60} height={12} />
          </View>
          <Skeleton width={50} height={16} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  podium: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 32,
    marginTop: 16,
    height: 150,
  },
  podiumItem: {
    alignItems: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
});
