import { createContext, useEffect, useRef, ReactNode } from "react";
import { sseEvents } from "shared-utils";
import { useAppConfig } from "@/utils/hooks/useAppConfig";

type SseEventCallback = (event: MessageEvent) => void;

interface SseContextValue {
    addEventListener: (event: sseEvents, callback: SseEventCallback) => void;
    removeEventListener: (event: sseEvents, callback: SseEventCallback) => void;
}

const SseContext = createContext<SseContextValue | null>(null);

export { SseContext };

const sseEndpoint = "/sse/events";

export function SseProvider({ children }: { children: ReactNode }) {
    const { data: appConfig } = useAppConfig();
    const eventSourceRef = useRef<EventSource | null>(null);
    const listenersRef = useRef<Map<sseEvents, Set<SseEventCallback>>>(new Map());
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const reconnectAttemptsRef = useRef(0);
    const maxReconnectDelay = 30000; // 30 seconds
    const baseReconnectDelay = 1000; // 1 second

    const addEventListener = (event: sseEvents, callback: SseEventCallback) => {
        if (!listenersRef.current.has(event)) {
            listenersRef.current.set(event, new Set());
        }
        listenersRef.current.get(event)!.add(callback);

        // If we already have an active connection, register this listener
        if (eventSourceRef.current) {
            eventSourceRef.current.addEventListener(event, callback);
        }
    };

    const removeEventListener = (event: sseEvents, callback: SseEventCallback) => {
        const listeners = listenersRef.current.get(event);
        if (listeners) {
            listeners.delete(callback);
            if (listeners.size === 0) {
                listenersRef.current.delete(event);
            }
        }

        // Remove from the active connection if it exists
        if (eventSourceRef.current) {
            eventSourceRef.current.removeEventListener(event, callback);
        }
    };

    useEffect(() => {
        if (!appConfig?.backendUrl) return;

        function connect() {
            if (!appConfig) return;

            const backendUrl = appConfig.backendUrl.replace(/\/$/, ""); // Ensure no trailing slash at the end of backendUrl
            const sseUrl = `${backendUrl}${sseEndpoint}`;

            console.log("SSE connecting to:", sseUrl);

            eventSourceRef.current = new EventSource(sseUrl);

            eventSourceRef.current.onopen = () => {
                console.log("SSE connected");
                reconnectAttemptsRef.current = 0;
            };

            eventSourceRef.current.onerror = (error) => {
                console.error("SSE connection error:", error);
                eventSourceRef.current?.close();

                // Exponential backoff: 1s, 2s, 4s, 8s, 16s, 30s (max)
                const delay = Math.min(
                    baseReconnectDelay * Math.pow(2, reconnectAttemptsRef.current),
                    maxReconnectDelay,
                );
                reconnectAttemptsRef.current++;

                console.debug(
                    `SSE reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current})...`,
                );
                reconnectTimeoutRef.current = setTimeout(connect, delay);
            };

            // Register all existing listeners
            listenersRef.current.forEach((callbacks, event) => {
                callbacks.forEach((callback) => {
                    eventSourceRef.current?.addEventListener(event, callback);
                });
            });
        }

        connect();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };
    }, [appConfig]);

    return (
        <SseContext.Provider value={{ addEventListener, removeEventListener }}>
            {children}
        </SseContext.Provider>
    );
}
