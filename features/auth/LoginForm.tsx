import { Button } from '@/components/Button';
import { TextInput } from '@/components/Input';
import { Typography } from '@/components/Typography';
import { AuthConfig } from '@/features/auth/AuthConfig';
import { useTheme } from '@/hooks';
import { AuthService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/useAuthStore';
import { toastError, toastSuccess } from '@/utilities/toast';
import { Ionicons } from '@expo/vector-icons';
import { useAuthRequest } from 'expo-auth-session';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

export function LoginForm() {
  const { theme, isDark } = useTheme();
  const setTokens = useAuthStore((state) => state.setTokens);
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [isValidatingKey, setIsValidatingKey] = useState(false);

  const handleManualLogin = async () => {
    if (!apiKey.trim() || isValidatingKey) return;

    setIsValidatingKey(true);
    try {
      const isValid = await AuthService.validateApiKey(apiKey.trim());
      if (isValid) {
        setTokens(apiKey.trim(), null, null, 'basic');
        toastSuccess('Login Successful', 'Welcome back!');
        router.replace('/(tabs)');
      } else {
        toastError('Invalid API Key', 'Please check your key and try again.');
      }
    } catch (error) {
      toastError('Login Failed', 'An error occurred during validation.');
    } finally {
      setIsValidatingKey(false);
    }
  };

  const handleOpenLink = (url: string) => {
    WebBrowser.openBrowserAsync(url);
  };

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: AuthConfig.clientId,
      scopes: AuthConfig.scopes,
      redirectUri: AuthConfig.redirectUri,
    },
    AuthConfig.discovery,
  );

  useEffect(() => {
    if (response?.type === 'success' && response.params?.code) {
      router.push({
        pathname: '/redirect',
        params: { code: response.params.code },
      });
    } else if (response?.type === 'error') {
      toastError(
        'Login Failed',
        response.params?.error_description || 'An error occurred.',
      );
    } else if (response?.type === 'cancel' || response?.type === 'dismiss') {
      toastError('Cancelled', 'Login process was cancelled');
    }
  }, [response, router]);

  return (
    <View style={styles.container}>
      <View style={styles.heroSection}>
        <View style={styles.brandingContainer}>
          <View
            style={[
              styles.iconGlow,
              {
                backgroundColor: isDark
                  ? 'rgba(14, 165, 233, 0.15)'
                  : 'rgba(14, 165, 233, 0.1)',
              },
            ]}
          />
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Image
              source={require('@/assets/images/icon.png')}
              style={styles.logo}
              contentFit="contain"
            />
          </View>
        </View>
        <Typography variant="display" weight="bold" style={styles.title}>
          DevPulse
        </Typography>
        <Typography
          variant="body"
          color={theme.colors.textSecondary}
          style={styles.subtitle}
        >
          Track your coding time, hit your goals, and master your productivity.
        </Typography>
      </View>

      <View style={styles.formSection}>
        <Button
          variant="primary"
          size="lg"
          label={!request ? 'Initializing...' : 'Log in with WakaTime'}
          onPress={async () => {
            try {
              await promptAsync();
            } catch {
              toastError('Login Error', 'Failed to open the login screen.');
            }
          }}
          disabled={!request}
          loading={!request && AuthConfig.clientId !== undefined}
          leftIcon={
            <Ionicons
              name="logo-github"
              size={20}
              color={theme.colors.textInverse}
            />
          }
          fullWidth
        />

        <View style={styles.dividerContainer}>
          <View
            style={[styles.divider, { backgroundColor: theme.colors.border }]}
          />
          <Typography
            variant="micro"
            weight="bold"
            style={[styles.dividerText, { color: theme.colors.textSecondary }]}
          >
            OR USE API KEY
          </Typography>
          <View
            style={[styles.divider, { backgroundColor: theme.colors.border }]}
          />
        </View>

        <View>
          <TextInput
            placeholder="Paste WakaTime API Key"
            value={apiKey}
            onChangeText={setApiKey}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            rightIcon={
              isValidatingKey ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <Pressable onPress={handleManualLogin}>
                  <Ionicons
                    name="arrow-forward-circle"
                    size={28}
                    color={
                      apiKey.trim()
                        ? theme.colors.primary
                        : theme.colors.textTertiary
                    }
                  />
                </Pressable>
              )
            }
            onSubmitEditing={handleManualLogin}
          />
          <Pressable
            onPress={() => handleOpenLink('https://wakatime.com/api-key')}
            style={styles.getApiKeyButton}
          >
            <Typography
              variant="micro"
              weight="bold"
              color={theme.colors.primary}
            >
              GET API KEY
            </Typography>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 0,
    paddingHorizontal: 0,
    gap: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  brandingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconGlow: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 30,
    opacity: 0.5,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  logo: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 28,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: 18,
  },
  formSection: {
    gap: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    letterSpacing: 1.5,
  },
  getApiKeyButton: {
    alignItems: 'center',
    paddingTop: 12,
  },
});
