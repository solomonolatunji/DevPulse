import { StyleSheet, View } from 'react-native';
import { Skeleton } from '../Skeleton';

export const GoalDetailsSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Title Field */}
      <View style={styles.field}>
        <Skeleton width={100} height={16} style={styles.label} />
        <Skeleton width="100%" height={50} borderRadius={12} />
      </View>

      {/* Duration Field */}
      <View style={styles.field}>
        <Skeleton width={80} height={16} style={styles.label} />
        <Skeleton width="100%" height={50} borderRadius={12} />
      </View>

      {/* Frequency Field */}
      <View style={styles.field}>
        <Skeleton width={90} height={16} style={styles.label} />
        <Skeleton width="100%" height={50} borderRadius={12} />
      </View>

      {/* Projects Field - mimics multi-select */}
      <View style={styles.field}>
        <Skeleton width={60} height={16} style={styles.label} />
        <Skeleton width="100%" height={50} borderRadius={12} />
        <View style={styles.tags}>
          <Skeleton width={80} height={32} borderRadius={16} />
          <Skeleton width={100} height={32} borderRadius={16} />
          <Skeleton width={60} height={32} borderRadius={16} />
        </View>
      </View>

      {/* Save Button */}
      <Skeleton
        width="100%"
        height={56}
        borderRadius={16}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  button: {
    marginTop: 24,
  },
});
