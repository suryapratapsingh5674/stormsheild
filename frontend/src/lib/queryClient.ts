import { QueryClient } from "@tanstack/react-query";

// TanStack Query client configuration
// staleTime: data considered fresh for 60s — avoids redundant refetches while user navigates
// retry: 2 retries for flaky network, but not on 4xx errors
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});
