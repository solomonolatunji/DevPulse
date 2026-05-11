import { AuthService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/useAuthStore';
import { config } from './config';
import { WakaTimeApiError } from './errors';
import {
  attachRequestHeadersInterceptor,
  buildAuthHeaders,
  createHttpClient,
  createTextRequestConfig,
  isSuccessfulStatus,
  normalizeHeaders,
  parseTextResponse,
  textRequest,
} from './http';

export const getAuthToken = () => {
  const { accessToken } = useAuthStore.getState();
  if (!accessToken) {
    throw new Error('No Access Token found');
  }
  return accessToken;
};

const wakaTimeClient = createHttpClient({
  baseURL: config.WAKATIME_API_BASE_URL,
});
attachRequestHeadersInterceptor(wakaTimeClient, () => {
  const { accessToken, tokenType } = useAuthStore.getState();

  if (!accessToken) {
    return {};
  }

  return buildAuthHeaders(accessToken, tokenType || 'bearer');
});

export async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const { accessToken: token } = useAuthStore.getState();
  if (!token) {
    throw new Error('No Access Token found');
  }

  const headers = {
    ...normalizeHeaders(options.headers),
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
  };

  const requestConfig = createTextRequestConfig(endpoint, options, headers);

  let response = await textRequest(wakaTimeClient, requestConfig);

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

      response = await textRequest(wakaTimeClient, {
        ...requestConfig,
        headers,
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

  if (!isSuccessfulStatus(response.status)) {
    throw new WakaTimeApiError(
      response.status,
      response.statusText,
      response.data ?? '',
    );
  }

  return parseTextResponse<T>(response);
}
