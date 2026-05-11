import { BottomSheet, Header, ListItem, Typography } from '@/components';
import { LeaderboardShareCard } from '@/components/share';
import { LeaderboardSkeleton } from '@/components/skeletons';
import { COUNTRIES } from '@/constants/countries';
import { useLeaderboardContext } from '@/contexts';
import { CurrentUserRank, LeaderboardItem, TopThreePodium } from '@/features';
import { useAllTime, useShareScreenshot, useTheme, useUser } from '@/hooks';
import { useOrganizationStore } from '@/stores';
import { leaderboardStyles as styles } from '@/theme';
import { Feather } from '@expo/vector-icons';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LeaderboardScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { data: user } = useUser();
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);
  const { selectedOrganization } = useOrganizationStore();
  const { data: allTime } = useAllTime();
  const { shareCardRef, handleShare } = useShareScreenshot();

  const {
    selectedCountry,
    setSelectedCountry,
    isLoading,
    isRefetching,
    refetch,
    leaderboardData,
    currentUserRank,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    countries,
  } = useLeaderboardContext();

  const topThree = React.useMemo(
    () => leaderboardData.slice(0, 3),
    [leaderboardData],
  );

  const remainingUsers = React.useMemo(
    () => leaderboardData.slice(3),
    [leaderboardData],
  );

  const handlePresentModalPress = React.useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleCountrySelect = (country: string | undefined) => {
    setSelectedCountry(country);
    bottomSheetRef.current?.dismiss();
  };

  const getSubtitle = () => {
    if (selectedOrganization) {
      return `${selectedOrganization.name} Leaderboard`;
    }
    if (selectedCountry && selectedCountry !== 'GLOBAL') {
      const countryLabel =
        COUNTRIES.find((country) => country.value === selectedCountry)?.label ||
        selectedCountry;
      return `${countryLabel} Top Developers`;
    }
    return 'Global Top Developers';
  };

  const showCountrySelector = !selectedOrganization;
  const footerReservedSpace = selectedOrganization
    ? styles.listContent.paddingBottom
    : Platform.OS === 'ios'
      ? 160 + Math.max(insets.bottom, 12)
      : styles.listContentWithFooter.paddingBottom;

  const onRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading && !leaderboardData.length) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Header
          title="Leaderboard"
          subtitle={getSubtitle()}
          onShare={handleShare}
          rightElement={
            !selectedOrganization ? (
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={handlePresentModalPress}
              >
                <Typography variant="title">
                  {countries.find((c) => c.value === selectedCountry)?.icon ||
                    '🌍'}
                </Typography>
              </TouchableOpacity>
            ) : null
          }
        />
        <LeaderboardSkeleton />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header
        title="Leaderboard"
        subtitle={getSubtitle()}
        onShare={handleShare}
        rightElement={
          showCountrySelector ? (
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.surface,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={handlePresentModalPress}
            >
              <Typography variant="title">
                {countries.find((c) => c.value === selectedCountry)?.icon ||
                  '🌍'}
              </Typography>
            </TouchableOpacity>
          ) : null
        }
      />

      {/* Hidden share card for capture - Always render with fallback */}
      <LeaderboardShareCard
        ref={shareCardRef}
        rank={currentUserRank?.rank}
        displayName={
          currentUserRank?.user.display_name ||
          currentUserRank?.user.username ||
          user?.data.display_name ||
          user?.data.username ||
          'Developer'
        }
        username={currentUserRank?.user.username || user?.data.username}
        photo={currentUserRank?.user.photo || user?.data.photo}
        totalTime={allTime?.data.text}
        country={currentUserRank?.user.city?.title || user?.data.city?.title}
        scope={getSubtitle()}
        top3Users={topThree}
      />

      <FlatList
        data={remainingUsers}
        renderItem={({ item }) => <LeaderboardItem item={item} />}
        keyExtractor={(item) => item.user.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: footerReservedSpace },
        ]}
        ListHeaderComponent={<TopThreePodium users={topThree} />}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator color={theme.colors.primary} />
            </View>
          ) : null
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.surface}
          />
        }
        ListEmptyComponent={
          remainingUsers.length === 0 && leaderboardData.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="users" size={48} color={theme.colors.border} />
              <Typography
                variant="title"
                weight="semibold"
                style={styles.emptyTitle}
              >
                {selectedOrganization
                  ? 'No Organization Data'
                  : 'Leaderboard Unavailable'}
              </Typography>
              <Typography
                color={theme.colors.textSecondary}
                style={styles.emptySubtitle}
              >
                {selectedOrganization
                  ? `Leaderboard for ${selectedOrganization.name} is not available yet.`
                  : 'Unable to fetch leaderboard data at this time.'}
              </Typography>
            </View>
          ) : null
        }
      />

      {!selectedOrganization && <CurrentUserRank />}

      <BottomSheet
        ref={bottomSheetRef}
        title="Select Location"
        snapPoints={['50%', '90%']}
      >
        <BottomSheetFlatList
          data={countries}
          keyExtractor={(item: {
            label: string;
            value: string | undefined;
            icon: string;
          }) => item.label}
          renderItem={({
            item,
          }: {
            item: { label: string; value: string | undefined; icon: string };
          }) => (
            <ListItem
              title={item.label}
              leftIcon={<Typography variant="title">{item.icon}</Typography>}
              rightIcon={
                selectedCountry === item.value ? (
                  <Feather
                    name="check"
                    size={20}
                    color={theme.colors.primary}
                  />
                ) : undefined
              }
              onPress={() => handleCountrySelect(item.value)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      </BottomSheet>
    </View>
  );
}
