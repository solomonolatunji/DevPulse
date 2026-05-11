/**
 * Custom error class for WakaTime API failures.
 * Encapsulates status codes and response text for better error handling.
 */
type ErrorWithCaptureStackTrace = ErrorConstructor & {
  captureStackTrace?: (
    targetObject: object,
    constructorOpt?: new (...args: unknown[]) => Error,
  ) => void;
};

export class WakaTimeApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body: string,
  ) {
    const message = `WakaTime API Error ${status}: ${statusText || 'Unknown Error'}`;
    super(message);
    this.name = 'WakaTimeApiError';

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    const errorConstructor = Error as ErrorWithCaptureStackTrace;
    if (errorConstructor.captureStackTrace) {
      errorConstructor.captureStackTrace(this, WakaTimeApiError);
    }
  }

  /**
   * Helper to determine if the error is due to authentication issues.
   */
  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  /**
   * Helper to parse the error body if it's JSON.
   */
  get json(): unknown | null {
    try {
      return JSON.parse(this.body);
    } catch {
      return null;
    }
  }
}
