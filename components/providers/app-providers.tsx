"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Provider } from "react-redux";
import { SessionHydrator } from "@/components/providers/session-hydrator";
import { store } from "@/store/store";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SessionHydrator />
        {children}
      </QueryClientProvider>
    </Provider>
  );
}
