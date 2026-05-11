import { AuthService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/useAuthStore';
import { encodeBase64 } from './base64';
import { config } from './config';
import { WakaTimeApiError } from './errors';

export const getAuthToken = () => {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) {
    throw new Error('No Access Token found');
  }
  return accessToken;
};

export const getHeaders = (
  token: string,
  type: 'bearer' | 'basic' = 'bearer',
) => {
  const authHeader =
    type === 'basic' ? `Basic ${encodeBase64(token)}` : `Bearer ${token}`;

  return {
    Authorization: authHeader,
    'User-Agent': 'DevPulse/1.0 (React Native)',
  };
};

export async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const { accessToken: token, tokenType } = useAuthStore.getState();
  if (!token) {
    throw new Error('No Access Token found');
  }
  const url = `${config.WAKATIME_API_BASE_URL}${endpoint}`;

  const headers = {
    ...getHeaders(token, tokenType || 'bearer'),
    ...(options.headers || {}),
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
  };

  let response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    const {
      refreshToken: currentRefreshToken,
      setTokens,
      logout,
    } = useAuthStore.getState();

    if (!currentRefreshToken) {
      logout();
      throw new WakaTimeApiError(
        401,
        'Unauthorized',
        'No refresh token available',
      );
    }

    try {
      const refreshData = await AuthService.refreshToken(currentRefreshToken);

      setTokens(
        refreshData.access_token,
        refreshData.refresh_token,
        refreshData.expires_in,
      );

      const newToken = refreshData.access_token;
      const retryHeaders = {
        ...headers,
        ...getHeaders(newToken, 'bearer'),
      };
      response = await fetch(url, {
        ...options,
        headers: retryHeaders,
      });

      if (response.status === 401) {
        logout();
        throw new WakaTimeApiError(
          401,
          'Unauthorized',
          'Session expired after refresh',
        );
      }
    } catch (error) {
      logout();
      if (error instanceof WakaTimeApiError) throw error;
      throw new WakaTimeApiError(401, 'Unauthorized', 'Session expired');
    }
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new WakaTimeApiError(response.status, response.statusText, errorText);
  }

  return response.json();
}
