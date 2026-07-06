import { useTheme } from '@/hooks';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card } from '../Card';
import { Skeleton } from '../Skeleton';

export const UserProfileSkeleton = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      padding: theme.spacing[4],
      paddingBottom: 40,
    },
    profileSection: {
      alignItems: 'center',
      marginBottom: theme.spacing[8],
      marginTop: theme.spacing[2],
    },
    avatar: {
      marginBottom: theme.spacing[4],
    },
    displayName: {
      marginBottom: theme.spacing[2],
      marginTop: theme.spacing[2],
    },
    username: {
      marginBottom: theme.spacing[4],
    },
    badgesContainer: {
      flexDirection: 'row',
      gap: theme.spacing[2],
      marginTop: theme.spacing[1],
      justifyContent: 'center',
    },
    statsRow: {
      flexDirection: 'row',
      gap: theme.spacing[3],
      marginBottom: theme.spacing[8],
    },
    statCard: {
      flex: 1,
      padding: theme.spacing[4],
      alignItems: 'center',
    },
    statLabel: {
      marginBottom: theme.spacing[2],
    },
    sectionHeader: {
      marginLeft: theme.spacing[1],
      marginBottom: theme.spacing[3],
    },
    languagesCard: {
      padding: theme.spacing[1],
      marginBottom: theme.spacing[6],
    },
    langItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: theme.spacing[4],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border + '20',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <Skeleton
            width={120}
            height={120}
            variant="circle"
            style={styles.avatar}
          />

          <Skeleton width={200} height={32} style={styles.displayName} />

          <Skeleton width={140} height={20} style={styles.username} />

          <View style={styles.badgesContainer}>
            <Skeleton
              width={90}
              height={28}
              borderRadius={theme.tokens.borderRadius.sm}
            />
            <Skeleton
              width={110}
              height={28}
              borderRadius={theme.tokens.borderRadius.sm}
            />
          </View>
        </View>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Skeleton width={80} height={12} style={styles.statLabel} />
            <Skeleton width={120} height={24} />
          </Card>
          <Card style={styles.statCard}>
            <Skeleton width={70} height={12} style={styles.statLabel} />
            <Skeleton width={100} height={24} />
          </Card>
        </View>

        <Skeleton width={120} height={14} style={styles.sectionHeader} />

        <Card style={styles.languagesCard}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.langItem}>
              <Skeleton width={100} height={16} />
              <Skeleton width={60} height={16} />
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
};
