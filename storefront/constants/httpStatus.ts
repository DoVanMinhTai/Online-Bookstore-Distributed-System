/**
 * Centralized HTTP status code management.
 *
 * Use these constants instead of magic numbers so status handling stays
 * consistent across the whole storefront (ApiClientService, hooks, components).
 */

export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

export type HttpStatusCode = (typeof HttpStatus)[keyof typeof HttpStatus];

/**
 * Synthetic status used when the request never reached the server
 * (network failure, DNS error, timeout, CORS, etc.).
 */
export const NETWORK_ERROR_STATUS = 0;

/**
 * Default Vietnamese messages shown to the user per status code.
 * A message returned by the server (when present) takes precedence over these.
 */
export const HTTP_STATUS_MESSAGES: Record<number, string> = {
  [NETWORK_ERROR_STATUS]: 'Mất kết nối tới máy chủ. Vui lòng kiểm tra mạng và thử lại.',
  [HttpStatus.BAD_REQUEST]: 'Dữ liệu gửi lên không hợp lệ.',
  [HttpStatus.UNAUTHORIZED]: 'Bạn cần đăng nhập để tiếp tục.',
  [HttpStatus.FORBIDDEN]: 'Bạn không có quyền thực hiện thao tác này.',
  [HttpStatus.NOT_FOUND]: 'Không tìm thấy tài nguyên yêu cầu.',
  [HttpStatus.METHOD_NOT_ALLOWED]: 'Phương thức không được hỗ trợ.',
  [HttpStatus.CONFLICT]: 'Dữ liệu bị xung đột, vui lòng tải lại và thử lại.',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'Dữ liệu chưa hợp lệ, vui lòng kiểm tra lại.',
  [HttpStatus.TOO_MANY_REQUESTS]: 'Bạn thao tác quá nhanh, vui lòng thử lại sau giây lát.',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Hệ thống đang gặp sự cố, vui lòng thử lại sau.',
  [HttpStatus.BAD_GATEWAY]: 'Hệ thống đang bận, vui lòng thử lại sau.',
  [HttpStatus.SERVICE_UNAVAILABLE]: 'Dịch vụ tạm thời không khả dụng, vui lòng thử lại sau.',
  [HttpStatus.GATEWAY_TIMEOUT]: 'Máy chủ phản hồi quá lâu, vui lòng thử lại sau.',
};

export const DEFAULT_ERROR_MESSAGE = 'Đã xảy ra lỗi, vui lòng thử lại.';

/** Statuses that should redirect the user to the login flow. */
export const REDIRECT_TO_LOGIN_STATUSES: number[] = [HttpStatus.UNAUTHORIZED];

/** Statuses that should NOT trigger an error toast (handled silently / by caller). */
export const SILENT_STATUSES: number[] = [];

/** Keycloak login entry point used when a 401 is encountered. */
export const LOGIN_URL = 'http://storefront.local/oauth2/authorization/keycloak';

export const isSuccessStatus = (status: number): boolean => status >= 200 && status < 300;
