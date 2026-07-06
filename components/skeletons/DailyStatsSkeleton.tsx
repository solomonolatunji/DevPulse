import { StyleSheet, View } from 'react-native';
import { Skeleton } from '../Skeleton';

export const DailyStatsSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Total Time Card */}
      <View style={styles.cardCenter}>
        <Skeleton width={200} height={40} style={{ marginBottom: 8 }} />
        <Skeleton width={150} height={16} />
      </View>

      {/* Activity Rhythm Placeholder */}
      <View style={styles.card}>
        <Skeleton width="100%" height={200} borderRadius={16} />
      </View>

      {/* Projects Card */}
      <View style={styles.card}>
        {[1, 2, 3].map((key) => (
          <View key={key} style={styles.projectItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Skeleton
                width={10}
                height={10}
                borderRadius={5}
                style={{ marginRight: 10 }}
              />
              <Skeleton width={100} height={16} />
            </View>
            <Skeleton width={60} height={16} />
          </View>
        ))}
      </View>

      {/* Segmented Stats Cards */}
      {[1, 2, 3].map((key) => (
        <View key={key} style={styles.card}>
          <Skeleton width={100} height={16} style={{ marginBottom: 16 }} />
          {[1, 2].map((subKey) => (
            <View key={subKey} style={{ marginBottom: 12 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}
              >
                <Skeleton width={80} height={14} />
                <Skeleton width={40} height={14} />
              </View>
              <Skeleton width="100%" height={8} borderRadius={4} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Padding removed as it's handled by parent ScrollView in daily.tsx
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  cardCenter: {
    marginBottom: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
    alignItems: 'center',
  },
  projectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
});
