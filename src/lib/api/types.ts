/**
 * Standard API envelope returned by CartX Backend API
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * Standard backend error response structure
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    requestId?: string;
  };
}

/**
 * HTTP client options
 */
export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  storeId?: string;
  authToken?: string;
}

