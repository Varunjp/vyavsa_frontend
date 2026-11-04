import { QueryClient } from '@tanstack/react-query';

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000, // 30 seconds default stale time
        gcTime: 5 * 60 * 1000, // 5 minutes garbage collection
        refetchOnWindowFocus: false, // Prevent aggressive Redis rate-limit triggers
        retry: (failureCount, error) => {
          // Never retry on client authorization or validation errors
          const statusCode = (error as { statusCode?: number })?.statusCode;
          if (
            statusCode === 401 ||
            statusCode === 403 ||
            statusCode === 404 ||
            statusCode === 422
          ) {
            return false;
          }
          return failureCount < 2;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}
