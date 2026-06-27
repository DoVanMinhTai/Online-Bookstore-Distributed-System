import toast from 'react-hot-toast';
import {
  DEFAULT_ERROR_MESSAGE,
  HTTP_STATUS_MESSAGES,
  LOGIN_URL,
  NETWORK_ERROR_STATUS,
  REDIRECT_TO_LOGIN_STATUSES,
  SILENT_STATUSES,
  isSuccessStatus,
} from '@/constants/httpStatus';

/**
 * Error thrown for any non-2xx response (or network failure) so callers can
 * inspect the status code and a human-readable message in one place.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, message: string, body: unknown = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

/** Best-effort extraction of a message from a parsed error body. */
const extractServerMessage = (body: unknown): string | null => {
  if (!body) return null;
  if (typeof body === 'string') return body.trim() || null;
  if (typeof body === 'object') {
    const record = body as Record<string, unknown>;
    const candidate =
      record.message ?? record.error ?? record.detail ?? record.title ?? null;
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
  }
  return null;
};

/** Resolve the message to show: server message first, then status default. */
export const resolveErrorMessage = (status: number, body: unknown): string => {
  return (
    extractServerMessage(body) ??
    HTTP_STATUS_MESSAGES[status] ??
    DEFAULT_ERROR_MESSAGE
  );
};

/** Safely read a response body as JSON, falling back to text. */
const readBody = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get('content-type') ?? '';
  try {
    if (contentType.includes('application/json')) {
      return await response.json();
    }
    const text = await response.text();
    return text || null;
  } catch {
    return null;
  }
};

const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    window.location.href = LOGIN_URL;
  }
};

export interface HandleResponseOptions {
  /** Show an error toast automatically (default true). */
  showErrorToast?: boolean;
}

/**
 * Centralized response handler. Returns the response untouched on success;
 * on failure it surfaces a toast (per status), optionally redirects on 401,
 * and throws an {@link ApiError} so the caller's catch block runs.
 */
export const handleApiResponse = async (
  response: Response,
  options: HandleResponseOptions = {}
): Promise<Response> => {
  const { showErrorToast = true } = options;

  if (isSuccessStatus(response.status)) {
    return response;
  }

  const body = await readBody(response.clone());
  const message = resolveErrorMessage(response.status, body);

  if (REDIRECT_TO_LOGIN_STATUSES.includes(response.status)) {
    if (showErrorToast) toast.error(message);
    redirectToLogin();
    throw new ApiError(response.status, message, body);
  }

  if (showErrorToast && !SILENT_STATUSES.includes(response.status)) {
    toast.error(message);
  }

  throw new ApiError(response.status, message, body);
};

/**
 * Convert a thrown network/unknown error into an ApiError with a toast.
 * Use inside catch blocks of the API client.
 */
export const handleNetworkError = (
  error: unknown,
  options: HandleResponseOptions = {}
): ApiError => {
  const { showErrorToast = true } = options;

  if (error instanceof ApiError) {
    return error;
  }

  const message = HTTP_STATUS_MESSAGES[NETWORK_ERROR_STATUS];
  if (showErrorToast) toast.error(message);
  return new ApiError(NETWORK_ERROR_STATUS, message, null);
};
