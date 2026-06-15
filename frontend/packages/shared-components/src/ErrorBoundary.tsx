"use client";

import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { FallbackProps } from "react-error-boundary";
import React, { useEffect, useState } from "react";

function ErrorBoundaryFallback({ error, resetErrorBoundary }: FallbackProps) {
    const refreshTime: number = 60; // seconds
    const [countdown, setCountdown] = useState(refreshTime);

    //refresh page after 1 minute
    useEffect(() => {
        const autoRefreshTimer = setTimeout(() => {
            resetErrorBoundary();
        }, refreshTime * 1000);
        return () => clearTimeout(autoRefreshTimer);
    }, [resetErrorBoundary]);

    useEffect(() => {
        // Countdown timer
        const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(countdownInterval);
        };
    }, [resetErrorBoundary]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-red-50 p-8 text-center font-sans text-red-900">
            <svg width="64" height="64" fill="none" viewBox="0 0 24 24" className="mb-6">
                <circle cx="12" cy="12" r="10" fill="#ffebee" stroke="#b71c1c" strokeWidth="2" />
                <path d="M12 8v4" stroke="#b71c1c" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1" fill="#b71c1c" />
            </svg>
            <h1 className="mb-4 text-3xl font-bold">Something went wrong</h1>
            <p className="mb-4 text-lg">
                An unexpected error occurred. Please try refreshing the kiosk or contact support.
            </p>
            <pre className="mx-auto mb-4 max-w-xl overflow-x-auto rounded-lg bg-red-100 p-4 text-sm whitespace-pre-wrap text-red-800">
                {error instanceof Error ? error.message : String(error)}
            </pre>
            {error instanceof Error && error.stack && (
                <details className="mx-auto mb-4 max-w-xl text-gray-800">
                    <summary className="cursor-pointer">Show technical details</summary>
                    <pre className="text-xs whitespace-pre-wrap">{error.stack}</pre>
                </details>
            )}
            <button
                onClick={resetErrorBoundary}
                className="mt-4 rounded-md bg-red-700 px-8 py-3 text-lg font-semibold text-white shadow-md transition-colors hover:bg-red-800"
            >
                Refresh kiosk
            </button>
            <p className="mt-4 text-sm text-gray-600">Automatic refresh in: {countdown} seconds</p>
        </div>
    );
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
    onReset?: () => void;
}

export default function ErrorBoundary({ children, onReset }: ErrorBoundaryProps) {
    const handleReset = () => {
        console.log("ErrorBoundary: Reset called");
        if (onReset) {
            onReset();
        } else {
            window.location.reload();
        }
    };

    const handleError = (error: unknown, errorInfo: React.ErrorInfo) => {
        console.log("ErrorBoundary: Error caught!", error, errorInfo);
    };

    return (
        <ReactErrorBoundary
            FallbackComponent={ErrorBoundaryFallback}
            onReset={handleReset}
            onError={handleError}
        >
            {children}
        </ReactErrorBoundary>
    );
}

export { ErrorBoundary, ErrorBoundaryFallback };
