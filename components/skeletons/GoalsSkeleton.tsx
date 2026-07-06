import { StyleSheet, View } from 'react-native';
import { Skeleton } from '../Skeleton';

export const GoalsSkeleton = () => {
  return (
    <View style={styles.container}>
      {[1, 2, 3].map((key) => (
        <View key={key} style={styles.card}>
          <View style={styles.header}>
            <View>
              <Skeleton width={150} height={20} style={{ marginBottom: 6 }} />
              <Skeleton width={100} height={12} />
            </View>
            <Skeleton width={60} height={24} borderRadius={8} />
          </View>

          <View style={{ marginTop: 16, marginBottom: 16 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <Skeleton width={40} height={12} />
              <Skeleton width={30} height={12} />
            </View>
            <Skeleton width="100%" height={8} borderRadius={4} />
          </View>

          <View style={styles.footer}>
            <Skeleton width={100} height={12} />
            <Skeleton width={60} height={12} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
});
