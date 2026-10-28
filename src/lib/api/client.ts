import { env } from "@/config/env";
import type { ApiResponse, ApiErrorResponse, RequestOptions } from "./types";

/**
 * Standardized API client error representing structured failures from the shared Express API.
 */
export class ApiClientError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: unknown;
  public readonly requestId?: string;

  constructor(
    message: string,
    status: number,
    code = "UNKNOWN_ERROR",
    details?: unknown,
    requestId?: string
  ) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.requestId = requestId;
  }
}

/**
 * CartX typed API client for interacting with the shared Express backend.
 * Handles centralized base URL, tenant header injection, and typed response/error unwrapping.
 */
export class ApiClient {
  private baseUrl: string;
  private defaultStoreId: string | null = null;
  private tokenProvider: (() => string | null) | null = null;

  constructor(baseUrl: string = env.apiBaseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  /**
   * Sets the active store context for subsequent requests.
   * NOTE: Per architectural guidelines, the X-Store-Id header communicates intent;
   * backend authentication tokens authoritatively validate tenant authorization.
   */
  public setActiveStoreId(storeId: string | null): void {
    this.defaultStoreId = storeId;
  }

  /**
   * Sets the authentication token provider.
   */
  public setTokenProvider(provider: () => string | null): void {
    this.tokenProvider = provider;
  }

  /**
   * Executes a typed HTTP request against the CartX Express API.
   */
  public async request<T = unknown>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { params, storeId, authToken, headers: customHeaders, ...fetchInit } = options;

    const url = new URL(
      endpoint.startsWith("http") ? endpoint : `${this.baseUrl}/${endpoint.replace(/^\//, "")}`
    );

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const headers = new Headers(customHeaders);
    if (!headers.has("Content-Type") && !(fetchInit.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }
    if (!headers.has("Accept")) {
      headers.set("Accept", "application/json");
    }

    // Tenant / Store Context
    const resolvedStoreId = storeId || this.defaultStoreId;
    if (resolvedStoreId && !headers.has("X-Store-Id")) {
      headers.set("X-Store-Id", resolvedStoreId);
    }

    // Authentication token
    const token = authToken || (this.tokenProvider ? this.tokenProvider() : null);
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    try {
      const response = await fetch(url.toString(), {
        ...fetchInit,
        headers,
      });

      const isJson = response.headers.get("content-type")?.includes("application/json");
      const data = isJson ? await response.json() : null;

      if (!response.ok) {
        const errorData = data as ApiErrorResponse | null;
        throw new ApiClientError(
          errorData?.error?.message || response.statusText || "Request failed",
          response.status,
          errorData?.error?.code || `HTTP_${response.status}`,
          errorData?.error?.details,
          errorData?.error?.requestId
        );
      }

      return data as ApiResponse<T>;
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new ApiClientError("Request aborted by user", 499, "REQUEST_ABORTED");
      }
      throw new ApiClientError(
        error instanceof Error ? error.message : "Network error occurred",
        0,
        "NETWORK_ERROR"
      );
    }
  }

  public get<T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  public post<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "method">) {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  public put<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "method">) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  public patch<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, "method">) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  public delete<T>(endpoint: string, options?: Omit<RequestOptions, "method">) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();

