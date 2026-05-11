import { Skeleton } from '@/components/Skeleton';
import { useTheme } from '@/hooks/useTheme';
import { AuthService } from '@/services';
import { useAuthStore } from '@/stores/useAuthStore';
import { toastError, toastSuccess } from '@/utilities/toast';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { View } from 'react-native';

const exchangingCodes = new Set<string>();

export default function AuthRedirectScreen() {
  const { theme } = useTheme();
  const { code, error, error_description } = useLocalSearchParams<{
    code?: string;
    error?: string;
    error_description?: string;
  }>();
  const router = useRouter();
  const { setTokens } = useAuthStore();

  const handleExchange = useCallback(
    async (authCode: string) => {
      try {
        const data = await AuthService.exchangeCodeForToken(authCode);

        const expiresIn = data.expires_in
          ? parseInt(String(data.expires_in), 10)
          : 0;

        setTokens(data.access_token, data.refresh_token, expiresIn);
        toastSuccess('Success', 'WakaTime account connected');
        router.replace('/(tabs)');
      } catch (err) {
        toastError(
          'Login Error',
          err instanceof Error ? err.message : 'Failed to complete login',
        );
        router.replace('/auth');
      } finally {
        exchangingCodes.delete(authCode);
      }
    },
    [setTokens, router],
  );

  useEffect(() => {
    if (error) {
      toastError('Login Failed', error_description || error);
      router.replace('/auth');
      return;
    }

    if (code && !exchangingCodes.has(code)) {
      exchangingCodes.add(code);
      handleExchange(code);
    } else if (!code) {
      router.replace('/auth');
    }
  }, [code, error, error_description, router, handleExchange]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background,
        gap: 24,
        padding: 40,
      }}
    >
      <Skeleton variant="circle" width={80} height={80} />
      <View style={{ width: '100%', alignItems: 'center', gap: 12 }}>
        <Skeleton width="80%" height={20} borderRadius={10} />
        <Skeleton width="60%" height={16} borderRadius={8} />
      </View>
    </View>
  );
}
