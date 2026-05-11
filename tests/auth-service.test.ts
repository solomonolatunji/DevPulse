import type { AxiosResponse } from 'axios';

import {
  normalizeTokenResponse,
  parseTokenPayload,
} from '@/utilities/authToken';

const createResponse = (
  data: string,
  contentType?: string,
): AxiosResponse<string> =>
  ({
    data,
    status: 200,
    statusText: 'OK',
    headers: contentType ? { 'content-type': contentType } : {},
    config: {} as AxiosResponse<string>['config'],
  }) as AxiosResponse<string>;

describe('auth token helpers', () => {
  it('parses JSON token payloads', () => {
    const payload = parseTokenPayload(
      createResponse(
        JSON.stringify({
          access_token: 'token',
          refresh_token: 'refresh',
          expires_in: 3600,
          uid: 'user-1',
        }),
        'application/json',
      ),
    );

    expect(payload).toEqual({
      access_token: 'token',
      refresh_token: 'refresh',
      expires_in: 3600,
      uid: 'user-1',
    });
  });

  it('falls back to urlencoded payload parsing', () => {
    const payload = parseTokenPayload(
      createResponse(
        'access_token=token&refresh_token=refresh&expires_in=3600&uid=user-1',
      ),
    );

    expect(payload).toEqual({
      access_token: 'token',
      refresh_token: 'refresh',
      expires_in: '3600',
      uid: 'user-1',
    });
  });

  it('normalizes expires_in to a number and defaults missing fields', () => {
    expect(
      normalizeTokenResponse({
        access_token: 'token',
        expires_in: '7200',
      }),
    ).toEqual({
      access_token: 'token',
      refresh_token: '',
      expires_in: 7200,
      uid: '',
    });
  });
});
