import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ApiError } from '../handleApiError';
import { DEFAULT_ERROR_MESSAGE } from '@/constants/httpStatus';

export interface UseApiRequestState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export interface UseApiRequestResult<T> extends UseApiRequestState<T> {
  refetch: () => Promise<void>;
}

export type ApiRequestFn<T> = () => Promise<T>;

export function useApiRequest<T>(
  requestFn: ApiRequestFn<T>,
  options?: {
    immediate?: boolean;
    /**
     * Show an error toast automatically when the request fails.
     * ApiError instances are already toasted by the API client, so this only
     * toasts errors that slipped through (default false to avoid duplicates).
     */
    showErrorToast?: boolean;
  }
): UseApiRequestResult<T> {
  const { immediate = true, showErrorToast = false } = options || {};

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await requestFn();
      setData(result);
    } catch (err: unknown) {
      let message = DEFAULT_ERROR_MESSAGE;
      // ApiError already carries a normalized, user-friendly message.
      const alreadyToasted = err instanceof ApiError;

      if (err instanceof Error && err.message) {
        message = err.message;
      }

      setError(message);

      if (showErrorToast && !alreadyToasted) {
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [requestFn, showErrorToast]);

  useEffect(() => {
    if (immediate) {
      void execute();
    }
  }, [execute, immediate]);

  return {
    data,
    isLoading,
    error,
    refetch: execute,
  };
}
