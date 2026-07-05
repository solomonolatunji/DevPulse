import { Button, Card, Typography } from '@/components';
import { useTheme } from '@/hooks';
import { type ErrorBoundaryProps } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Typography
          variant="headline"
          weight="bold"
          color={theme.colors.primary}
          style={styles.icon}
        >
          !
        </Typography>

        <Typography variant="title" weight="bold" style={styles.title}>
          Something went wrong
        </Typography>

        <Typography
          variant="body"
          color={theme.colors.textSecondary}
          style={styles.message}
        >
          {error?.message || 'An unexpected runtime error occurred.'}
        </Typography>

        {error?.stack && (
          <Card style={styles.stackCard}>
            <Typography
              variant="caption"
              color={theme.colors.textSecondary}
              numberOfLines={20}
            >
              {error.stack}
            </Typography>
          </Card>
        )}

        <View style={styles.buttonContainer}>
          <Button label="Try Again" onPress={retry} fullWidth size="lg" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    textAlign: 'center',
    lineHeight: 64,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginBottom: 24,
    overflow: 'hidden',
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
  },
  stackCard: {
    width: '100%',
    padding: 16,
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
  },
});
