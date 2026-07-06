import { AuthConfig } from '@/features/auth/AuthConfig';
import {
  normalizeTokenResponse,
  parseTokenPayload,
} from '@/utilities/authToken';
import { encodeBase64 } from '@/utilities/base64';
import {
  createHttpClient,
  isSuccessfulStatus,
  textRequest,
} from '@/utilities/http';

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  uid: string;
}

const formHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded',
  Accept: 'application/json, application/x-www-form-urlencoded',
};
const authClient = createHttpClient();

export const AuthService = {
  /**
   * Exchanges an authorization code for an access token.
   */
  exchangeCodeForToken: async (code: string): Promise<TokenResponse> => {
    const response = await textRequest(authClient, {
      url: AuthConfig.discovery.tokenEndpoint,
      method: 'POST',
      headers: formHeaders,
      data: new URLSearchParams({
        client_id: AuthConfig.clientId,
        client_secret: AuthConfig.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: AuthConfig.redirectUri,
      }).toString(),
    });

    const data = parseTokenPayload(response);

    if (!isSuccessfulStatus(response.status)) {
      throw new Error(
        data.error_description ||
          data.error ||
          `Failed to exchange token (${response.status})`,
      );
    }

    return normalizeTokenResponse(data);
  },

  /**
   * Refreshes the access token using a refresh token.
   */
  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await textRequest(authClient, {
      url: AuthConfig.discovery.tokenEndpoint,
      method: 'POST',
      headers: formHeaders,
      data: new URLSearchParams({
        client_id: AuthConfig.clientId,
        client_secret: AuthConfig.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        redirect_uri: AuthConfig.redirectUri,
      }).toString(),
    });

    const data = parseTokenPayload(response);

    if (!isSuccessfulStatus(response.status)) {
      throw new Error(
        data.error_description ||
          data.error ||
          `Failed to refresh token (${response.status})`,
      );
    }

    return normalizeTokenResponse(data);
  },

  /**
   * Validates an API key by making a simple request.
   */
  validateApiKey: async (key: string): Promise<boolean> => {
    try {
      const response = await textRequest(authClient, {
        url: AuthConfig.discovery.authorizationEndpoint.replace(
          '/oauth/authorize',
          '/api/v1/users/current',
        ),
        headers: {
          Authorization: `Basic ${encodeBase64(key)}`,
        },
      });
      return isSuccessfulStatus(response.status);
    } catch {
      return false;
    }
  },
};
