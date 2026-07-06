import { ScreenHeader, Typography } from '@/components';
import { UserProfileSkeleton } from '@/components/skeletons';
import { ProfileHeader, ProfileStats, UserLanguages } from '@/features';
import { useTheme, useUserProfile } from '@/hooks';
import { userProfileStyles as styles } from '@/theme';
import { useLocalSearchParams } from 'expo-router';
import { RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { profile, isLoading, refreshing, onRefresh, isSelf } =
    useUserProfile(id);

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['bottom', 'left', 'right']}
      >
        <UserProfileSkeleton />
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['bottom', 'left', 'right']}
      >
        <Typography
          variant="headline"
          weight="bold"
          style={{ margin: 16, textAlign: 'center', marginTop: 100 }}
        >
          Developer Not Found
        </Typography>
        <Typography
          color={theme.colors.textSecondary}
          style={{ textAlign: 'center', marginHorizontal: 32 }}
        >
          We couldn't find this developer in the current leaderboard. They might
          not have any activity for this period.
        </Typography>
      </SafeAreaView>
    );
  }

  const { user, running_total, rank } = profile;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['left', 'right']}
    >
      <ScreenHeader title={(user.username || 'Unknown').toUpperCase()} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        <ProfileHeader user={user} rank={rank} isSelf={isSelf} />
        <ProfileStats runningTotal={running_total} />
        <UserLanguages languages={running_total.languages} />
      </ScrollView>
    </SafeAreaView>
  );
}
