export const ERROR_CODES = {
    BAD_REQUEST: "BAD_REQUEST",
    UNAUTHORIZED: "UNAUTHORIZED",
    FORBIDDEN: "FORBIDDEN",
    NOT_FOUND: "NOT_FOUND",
    OUT_OF_STOCK: "OUT_OF_STOCK",
    ALREADY_EXISTS: "ALREADY_EXISTS",
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
    SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE"
};

export const ERROR_MESSAGES = {
    BAD_REQUEST: "Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin.",
    UNAUTHORIZED: "Bạn chưa được phép thực hiện hành động này. Vui lòng đăng nhập.",
    FORBIDDEN: "Bạn không có quyền truy cập vào tài nguyên này.",
    NOT_FOUND: "Không tìm thấy tài nguyên. Vui lòng kiểm tra lại thông tin.",
    OUT_OF_STOCK: "Sản phẩm đã hết hàng. Vui lòng chọn sản phẩm khác.",
    ALREADY_EXISTS: "Tài nguyên đã tồn tại. Vui lòng kiểm tra lại thông tin.",
    INTERNAL_SERVER_ERROR: "Đã xảy ra lỗi máy chủ. Vui lòng thử lại sau.",
    SERVICE_UNAVAILABLE: "Dịch vụ hiện không khả dụng. Vui lòng thử lại sau."
};

export function getErrorMessage(status: number): string {
    switch (status) {
        case 400:
            return ERROR_MESSAGES.BAD_REQUEST;
        case 401:
            return ERROR_MESSAGES.UNAUTHORIZED;
        case 403:
            return ERROR_MESSAGES.FORBIDDEN;
        case 404:
            return ERROR_MESSAGES.NOT_FOUND;
        case 409:
            return ERROR_MESSAGES.ALREADY_EXISTS;
        case 500:
            return ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
        case 503:
            return ERROR_MESSAGES.SERVICE_UNAVAILABLE;
        default:
            return "Đã xảy ra lỗi không xác định. Vui lòng thử lại.";
    }
}