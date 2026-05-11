import type { AxiosResponse } from 'axios';

export interface RawTokenPayload {
  access_token?: string;
  refresh_token?: string;
  expires_in?: string | number;
  uid?: string;
  error?: string;
  error_description?: string;
}

export interface NormalizedTokenPayload {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  uid: string;
}

export const parseTokenPayload = (
  response: AxiosResponse<string>,
): RawTokenPayload => {
  const responseText = response.data ?? '';
  const contentTypeHeader = response.headers['content-type'];
  const contentType = Array.isArray(contentTypeHeader)
    ? contentTypeHeader.join(', ')
    : String(contentTypeHeader ?? '');

  if (
    contentType.includes('application/json') ||
    responseText.trim().startsWith('{')
  ) {
    try {
      return JSON.parse(responseText) as RawTokenPayload;
    } catch {
      return Object.fromEntries(new URLSearchParams(responseText).entries());
    }
  }

  return Object.fromEntries(new URLSearchParams(responseText).entries());
};

export const normalizeTokenResponse = (
  payload: RawTokenPayload,
): NormalizedTokenPayload => ({
  access_token: payload.access_token || '',
  refresh_token: payload.refresh_token || '',
  expires_in: payload.expires_in ? Number(payload.expires_in) : 0,
  uid: payload.uid || '',
});
