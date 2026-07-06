import { StyleSheet, View } from 'react-native';
import { Skeleton } from '../Skeleton';

export const ProjectListSkeleton = () => {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((key) => (
        <View key={key} style={styles.card}>
          <View style={styles.header}>
            <Skeleton
              width={40}
              height={40}
              borderRadius={12}
              style={{ marginRight: 12 }}
            />
            <View style={{ flex: 1 }}>
              <Skeleton width={120} height={16} style={{ marginBottom: 6 }} />
              <Skeleton width={80} height={12} />
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Skeleton width={30} height={8} style={{ marginBottom: 4 }} />
              <Skeleton width={50} height={14} />
            </View>
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
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
