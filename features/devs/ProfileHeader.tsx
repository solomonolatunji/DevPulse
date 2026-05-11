import { Avatar, Typography } from '@/components';
import { useTheme } from '@/hooks';
import { LeaderboardUserProfile, User } from '@/interfaces';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native';

interface ProfileHeaderProps {
  user: User['data'] | LeaderboardUserProfile;
  rank: number | string | null;
  isSelf: boolean;
}

export default function ProfileHeader({
  user,
  rank,
  isSelf,
}: ProfileHeaderProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.profileSection}>
      <View style={styles.avatarContainer}>
        <Avatar
          source={user.photo ? { uri: user.photo } : undefined}
          initials={user.display_name || user.username}
          size={120}
        />
        <View
          style={[styles.rankBadge, { backgroundColor: theme.colors.primary }]}
        >
          <Typography variant="micro" weight="bold" style={{ color: '#fff' }}>
            #{rank}
          </Typography>
        </View>
      </View>

      <Typography variant="title" weight="bold" style={styles.displayName}>
        {user.display_name || user.username || 'Anonymous'}
      </Typography>

      <View style={styles.usernameRow}>
        <Typography color={theme.colors.textSecondary} style={styles.username}>
          @{user.username || 'anonymous'}
        </Typography>
        {user.created_at && (
          <Typography variant="micro" color={theme.colors.textSecondary + '80'}>
            • JOINED {new Date(user.created_at).getFullYear()}
          </Typography>
        )}
      </View>

      {user.city?.title && (
        <View style={styles.locationContainer}>
          <Feather
            name="map-pin"
            size={12}
            color={theme.colors.textSecondary}
          />
          <Typography
            variant="caption"
            color={theme.colors.textSecondary}
            weight="bold"
            style={styles.locationText}
          >
            {user.city.title.toUpperCase()}
          </Typography>
        </View>
      )}

      <View style={styles.badgesContainer}>
        {user.is_hireable && (
          <View
            style={[
              styles.badge,
              { backgroundColor: theme.colors.primary + '15' },
            ]}
          >
            <Feather name="zap" size={14} color={theme.colors.primary} />
            <Typography
              variant="caption"
              weight="bold"
              color={theme.colors.primary}
              style={styles.badgeText}
            >
              HIREABLE
            </Typography>
          </View>
        )}

        {user.website && (
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.badge,
              { backgroundColor: theme.colors.surfaceHighlight },
            ]}
            onPress={() => Linking.openURL(user.website!)}
          >
            <Feather
              name="globe"
              size={14}
              color={theme.colors.textSecondary}
            />
            <Typography
              variant="caption"
              weight="bold"
              color={theme.colors.textSecondary}
              style={styles.badgeText}
            >
              PORTFOLIO
            </Typography>
          </TouchableOpacity>
        )}

        {(isSelf ? user.email && user.is_email_public : user.email) && (
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.badge,
              { backgroundColor: theme.colors.surfaceHighlight },
            ]}
            onPress={() => Linking.openURL(`mailto:${user.email}`)}
          >
            <Feather name="mail" size={14} color={theme.colors.textSecondary} />
            <Typography
              variant="caption"
              weight="bold"
              color={theme.colors.textSecondary}
              style={styles.badgeText}
            >
              EMAIL
            </Typography>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  rankBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#fff',
  },
  displayName: {
    marginBottom: 4,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
    marginBottom: 8,
  },
  username: {
    marginBottom: 0,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
    marginBottom: 12,
  },
  locationText: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    marginLeft: 4,
  },
});
