"use client";

import { ErrorBoundary } from "shared-components";

interface ClientErrorBoundaryProps {
    children: React.ReactNode;
}

export default function ClientErrorBoundary({ children }: ClientErrorBoundaryProps) {
    return <ErrorBoundary onReset={() => window.location.reload()}>{children}</ErrorBoundary>;
}
