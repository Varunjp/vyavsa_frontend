import { isAxiosError } from 'axios';
import { ApiErrorInfo, ApiResponse } from '@/types';

export class AppError extends Error {
  code: string;
  statusCode?: number;
  details?: Record<string, string>;
  fields?: Record<string, string>;

  constructor(
    message: string,
    code = 'APP_ERROR',
    statusCode?: number,
    details?: Record<string, string>,
    fields?: Record<string, string>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.fields = fields;
  }
}

export function parseApiError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (isAxiosError(error)) {
    const statusCode = error.response?.status;
    const data = error.response?.data as ApiResponse<unknown> | undefined;

    if (data && !data.success && data.error) {
      const errInfo: ApiErrorInfo = data.error;
      return new AppError(
        errInfo.message || data.message || error.message,
        errInfo.code || 'API_ERROR',
        statusCode,
        errInfo.details,
        errInfo.fields || errInfo.details
      );
    }

    if (statusCode === 401) {
      return new AppError(
        'Your session has expired or is invalid. Please log in again.',
        'UNAUTHORIZED',
        401
      );
    }

    if (statusCode === 403) {
      return new AppError('You do not have permission to perform this action.', 'FORBIDDEN', 403);
    }

    if (statusCode === 404) {
      return new AppError('The requested resource was not found.', 'NOT_FOUND', 404);
    }

    if (statusCode === 429) {
      return new AppError(
        'Too many requests. Please wait a moment and try again.',
        'RATE_LIMITED',
        429
      );
    }

    if (statusCode && statusCode >= 500) {
      return new AppError(
        'A server error occurred. Please try again later.',
        'SERVER_ERROR',
        statusCode
      );
    }

    return new AppError(
      error.message || 'An unexpected network error occurred.',
      'NETWORK_ERROR',
      statusCode
    );
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR');
  }

  return new AppError('An unexpected error occurred.', 'UNKNOWN_ERROR');
}
