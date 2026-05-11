"use client";

import { QueryClientProvider, QueryClient, HydrationBoundary } from "@tanstack/react-query";
import { useState } from "react";

const ReactQueryProvider = ({
    children,
    dehydratedState,
}: {
    children: React.ReactNode;
    dehydratedState?: unknown;
}) => {
    const [queryClient] = useState(
        () => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000 } } }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
        </QueryClientProvider>
    );
};

export default ReactQueryProvider;
