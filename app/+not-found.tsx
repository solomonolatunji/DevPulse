import { Button, Typography } from '@/components';
import { useTheme } from '@/hooks';
import { commonStyles } from '@/theme';
import Feather from '@react-native-vector-icons/feather/static';
import { Link, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function NotFoundScreen() {
  const { theme } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!', headerShown: false }} />
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.content}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: theme.colors.error + '10' },
            ]}
          >
            <Feather
              name="alert-triangle"
              size={64}
              color={theme.colors.error}
            />
          </View>

          <Typography variant="display" weight="bold" style={styles.errorCode}>
            404
          </Typography>

          <Typography variant="title" weight="bold" style={styles.title}>
            Oops! Page Not Found
          </Typography>

          <Typography
            variant="body"
            color={theme.colors.textSecondary}
            style={styles.description}
          >
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </Typography>
        </View>

        <View style={styles.footer}>
          <Link href="/" asChild>
            <Button
              label="Back to Dashboard"
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={
                <Feather
                  name="home"
                  size={20}
                  color={theme.colors.primaryForeground}
                />
              }
            />
          </Link>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.flex1,
    padding: 24,
  },
  content: {
    ...commonStyles.flex1,
    ...commonStyles.center,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    ...commonStyles.center,
    marginBottom: 32,
  },
  errorCode: {
    opacity: 0.5,
    marginBottom: 8,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: 22,
  },
  footer: {
    width: '100%',
    paddingBottom: 40,
  },
});
