import { Agent } from "undici";
import { getBackendUrl } from "@/utils/getBackendUrl";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

// SSE connections must never hit undici's default 5-min body timeout
const sseAgent = new Agent({ bodyTimeout: 0, headersTimeout: 60_000 });

// Keep track of active backend fetch requests to kill them instantly on Ctrl+C
const activeControllers = new Set<AbortController>();

declare global {
    var __SIGINT_HANDLER_SET: boolean | undefined;
}

// Register process listeners only once (safeguard against hot-reloads)
if (typeof process !== "undefined" && !globalThis.__SIGINT_HANDLER_SET) {
    globalThis.__SIGINT_HANDLER_SET = true;

    const cleanExit = () => {
        if (activeControllers.size > 0) {
            process.stdout.write(
                `\nStopping proxy: Force aborting ${activeControllers.size} active connections...\n`,
            );
            for (const controller of activeControllers) {
                try {
                    controller.abort();
                } catch {}
            }
            activeControllers.clear();
        }
        process.exit(0);
    };

    process.once("SIGINT", cleanExit);
    process.once("SIGTERM", cleanExit);
}

/**
 * Wraps a streaming body so that `cleanup` runs when the stream actually finishes, errors, or is
 * cancelled by the client — not when the `Response` object is merely constructed. Without this an
 * SSE stream loses its abort wiring while it is still piping, and the backend subscription is
 * never torn down when the browser tab goes away.
 */
function streamWithCleanup(
    body: ReadableStream<Uint8Array>,
    cleanup: () => void,
): ReadableStream<Uint8Array> {
    const reader = body.getReader();
    let cleanedUp = false;

    const runCleanup = (): void => {
        if (cleanedUp) {
            return;
        }
        cleanedUp = true;
        cleanup();
    };

    return new ReadableStream<Uint8Array>({
        async pull(controller) {
            try {
                const { done, value } = await reader.read();

                if (done) {
                    runCleanup();
                    controller.close();
                    return;
                }

                controller.enqueue(value);
            } catch (error) {
                runCleanup();
                controller.error(error);
            }
        },
        async cancel(reason) {
            runCleanup();
            await reader.cancel(reason).catch(() => {});
        },
    });
}

async function proxyRequest(req: Request, path: string, method: string): Promise<Response> {
    const url = new URL(req.url);
    const backendUrl = `${getBackendUrl()}/api/${path}${url.search}`;

    const headers = new Headers(req.headers);
    headers.delete("host");

    // Create an independent AbortController for the backend fetch
    const backendController = new AbortController();
    activeControllers.add(backendController);

    // Link the client's disconnect to the backend fetch directly
    const onAbort = () => {
        backendController.abort();
    };
    req.signal.addEventListener("abort", onAbort);

    const isSSE = path === "sse/events";

    let cleanedUp = false;
    // When true, the streamed body owns the cleanup and the `finally` below must not run it early.
    let cleanupDeferredToStream = false;

    const cleanup = (): void => {
        if (cleanedUp) {
            return;
        }
        cleanedUp = true;
        req.signal.removeEventListener("abort", onAbort);
        activeControllers.delete(backendController);
    };

    try {
        const fetchOptions: RequestInit & { dispatcher?: Agent } = {
            method,
            headers,
            body: method !== "GET" && method !== "HEAD" ? await req.arrayBuffer() : undefined,
            signal: backendController.signal,
        };
        if (isSSE) {
            fetchOptions.dispatcher = sseAgent;
        }
        const response = await fetch(backendUrl, fetchOptions);

        const contentType = response.headers.get("content-type");

        if (contentType?.includes("text/event-stream") && response.body) {
            cleanupDeferredToStream = true;

            const body = streamWithCleanup(response.body, () => {
                // The stream is over (ended, errored or the tab disconnected) — tear the backend
                // connection down before dropping the abort wiring.
                backendController.abort();
                cleanup();
            });

            return new Response(body, {
                status: response.status,
                headers: {
                    "Content-Type": "text/event-stream",
                    "Cache-Control": "no-cache, no-transform",
                    Connection: "keep-alive",
                    "X-Accel-Buffering": "no",
                },
            });
        }

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        });
    } catch (error) {
        // If the browser disconnected or process exited, respond quietly
        if (req.signal.aborted || backendController.signal.aborted) {
            return new Response("Client disconnected", { status: 499 });
        }

        process.stderr.write(
            `Error while connecting to backend: ${method} ${backendUrl} — ${error instanceof Error ? error.message : String(error)}\n`,
        );
        return new Response("Error while connecting to backend", { status: 502 });
    } finally {
        // Cleanup to prevent event listener and set tracking leaks. Streamed SSE responses defer
        // this until their body is done; every other path (including errors) cleans up here.
        if (!cleanupDeferredToStream) {
            cleanup();
        }
    }
}

export async function GET(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return proxyRequest(request, path.join("/"), "GET");
}

export async function POST(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return proxyRequest(request, path.join("/"), "POST");
}

export async function PUT(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return proxyRequest(request, path.join("/"), "PUT");
}

export async function PATCH(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    return proxyRequest(request, path.join("/"), "PATCH");
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ path: string[] }> },
) {
    const { path } = await params;
    return proxyRequest(request, path.join("/"), "DELETE");
}
