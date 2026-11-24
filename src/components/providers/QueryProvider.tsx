"use client";

import React, { useLayoutEffect, useState } from "react";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { markHydrated } from "@/lib/hydration";

/**
 * Runs once the server HTML has been hydrated: from then on data hooks may read
 * the browser's saved content, so every query is refreshed with it.
 * A layout effect runs before any normal effect, so the rest of the app
 * already sees the saved data in its own effects.
 */
function StorageReady() {
  const queryClient = useQueryClient();
  useLayoutEffect(() => {
    markHydrated();
    queryClient.invalidateQueries();
  }, [queryClient]);
  return null;
}

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <StorageReady />
      {children}
    </QueryClientProvider>
  );
}
