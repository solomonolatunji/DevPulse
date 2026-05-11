import axios, {
  AxiosHeaders,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
} from 'axios';
import { encodeBase64 } from './base64';

export const DEFAULT_USER_AGENT = 'DevPulse/1.0 (React Native)';

export const createHttpClient = (
  defaults: CreateAxiosDefaults = {},
): AxiosInstance =>
  axios.create({
    validateStatus: () => true,
    responseType: 'text',
    ...defaults,
  });

export const textRequest = (
  client: AxiosInstance,
  config: AxiosRequestConfig,
): Promise<AxiosResponse<string>> =>
  client.request<string>({
    responseType: 'text',
    ...config,
  });

export const parseTextResponse = <T>(response: AxiosResponse<string>): T => {
  const responseText = response.data ?? '';

  if (!responseText) {
    return '' as T;
  }

  try {
    return JSON.parse(responseText) as T;
  } catch {
    return responseText as T;
  }
};

export const isSuccessfulStatus = (status: number): boolean =>
  status >= 200 && status < 300;

export const buildAuthHeaders = (
  token: string,
  type: 'bearer' | 'basic' = 'bearer',
): Record<string, string> => {
  const authHeader =
    type === 'basic' ? `Basic ${encodeBase64(token)}` : `Bearer ${token}`;

  return {
    Authorization: authHeader,
    'User-Agent': DEFAULT_USER_AGENT,
  };
};

export const normalizeHeaders = (
  headers?: RequestInit['headers'],
): Record<string, string> => {
  if (!headers) {
    return {};
  }

  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }

  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }

  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key, String(value)]),
  );
};

export const createTextRequestConfig = (
  url: string,
  options: RequestInit = {},
  headers: Record<string, string> = {},
): AxiosRequestConfig => ({
  url,
  method: options.method as AxiosRequestConfig['method'],
  headers,
  data: options.body,
  signal: options.signal ?? undefined,
});

export const attachRequestHeadersInterceptor = (
  client: AxiosInstance,
  resolveHeaders: () => Record<string, string>,
) => {
  client.interceptors.request.use((request: InternalAxiosRequestConfig) => {
    request.headers = AxiosHeaders.from({
      ...resolveHeaders(),
      ...(request.headers || {}),
    });

    return request;
  });
};
