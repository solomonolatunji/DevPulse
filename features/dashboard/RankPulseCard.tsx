import { Typography } from '@/components/Typography';
import { COUNTRIES } from '@/constants/countries';
import { useLeaderboard, useUser } from '@/hooks';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export const RankPulseCard = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { userRanks } = useLeaderboard();
  const { data: user } = useUser();

  const hasGlobalRank = userRanks.global != null;
  const hasCountryRank = userRanks.country != null;
  const countryCode = user?.data?.city?.country_code;
  const countryLabel = useMemo(() => {
    if (!countryCode) return 'COUNTRY';
    return (
      COUNTRIES.find((country) => country.value === countryCode)?.label ||
      'COUNTRY'
    );
  }, [countryCode]);

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withRepeat(
            withSequence(
              withTiming(1, { duration: 1000 }),
              withTiming(1.05, { duration: 1000 }),
              withTiming(1, { duration: 1000 }),
            ),
            -1,
            true,
          ),
        },
      ],
    };
  });

  if (userRanks.isLoading && !hasGlobalRank && !hasCountryRank) {
    return (
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <ActivityIndicator color={theme.colors.accent} />
      </View>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push('/leaderboard')}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.rankSection}>
          <Typography
            variant="caption"
            weight="semibold"
            color={theme.colors.textSecondary}
            style={styles.label}
          >
            GLOBAL
          </Typography>
          <Animated.View style={pulseStyle}>
            <Typography
              variant="headline"
              weight="bold"
              color={theme.colors.accent}
            >
              {hasGlobalRank ? `#${userRanks.global}` : '#'}
            </Typography>
          </Animated.View>
        </View>

        <View
          style={[styles.divider, { backgroundColor: theme.colors.border }]}
        />

        <View style={styles.rankSection}>
          <Typography
            variant="caption"
            weight="semibold"
            color={theme.colors.textSecondary}
            style={styles.label}
          >
            {countryLabel}
          </Typography>
          <Typography
            variant="headline"
            weight="bold"
            color={theme.colors.text}
          >
            {hasCountryRank ? `#${userRanks.country}` : '#'}
          </Typography>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  rankSection: {
    alignItems: 'center',
    flex: 1,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    fontSize: 10,
  },
  divider: {
    width: 1,
    height: 32,
    marginHorizontal: 8,
  },
});
