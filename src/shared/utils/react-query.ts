import {
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from "@tanstack/react-query";
import {
  QUERY_DEFAULT_STALE_TIME,
  QUERY_RETRY_COUNT,
} from "@/shared/constants/app";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: QUERY_RETRY_COUNT,
        staleTime: QUERY_DEFAULT_STALE_TIME,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
