import { handleApiResponse, handleNetworkError } from './handleApiError';

type RequestBody = BodyInit | null;

interface RequestOptions {
  method: string;
  headers: {
    [key: string]: string;
  };
  body?: BodyInit;
}

const isBrowser = (): boolean => typeof window !== 'undefined';

const sendRequest = async (
  method: string,
  endpoint: string,
  data: RequestBody = null,
  contentType: string | null = null
) => {

  const defaultContentType = 'application/json; charset=UTF-8';
  const requestOptions: RequestOptions = {
    method: method.toUpperCase(),
    headers: {
      'Content-type': contentType ?? defaultContentType,
    },
  };

  if (data) {
    if (data instanceof FormData) {
      delete requestOptions.headers['Content-type'];
    }
    requestOptions.body = data;
  }

  try {
    const response = await fetch(endpoint, method === 'GET' ? undefined : requestOptions);

    if (response.type == 'cors' && response.redirected) {
      window.location.href = response.url;
    }

    // Centralized status handling (toast + 401 redirect + throw ApiError).
    // Skipped on the server (SSR) so callers keep their own try/catch behavior
    // and we never attempt to toast/redirect outside the browser.
    if (isBrowser()) {
      return await handleApiResponse(response);
    }

    return response;
  } catch (error) {
    // Network failure / timeout, or an ApiError rethrown from handleApiResponse.
    throw handleNetworkError(error, { showErrorToast: isBrowser() });
  }
};

const apiClientService = {
  get: (endpoint: string) => sendRequest('GET', endpoint),
  post: (endpoint: string, data: RequestBody, contentType: string | null = null) =>
    sendRequest('POST', endpoint, data, contentType),
  put: (endpoint: string, data: RequestBody, contentType: string | null = null) =>
    sendRequest('PUT', endpoint, data, contentType),
  delete: (endpoint: string) => sendRequest('DELETE', endpoint),

};

export default apiClientService;
