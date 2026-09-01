import { Agent } from "undici";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

// Regex at the end to remove trailing slash if any
const BACKEND_URL = process.env.BACKEND_URL?.replace(/\/$/, "") || "http://localhost:3001";

// SSE connections must never hit undici's default 5-min body timeout
const sseAgent = new Agent({ bodyTimeout: 0, headersTimeout: 60_000 });

// Keep track of active backend fetch requests to kill them instantly on Ctrl+C
const activeControllers = new Set<AbortController>();

// Register process listeners only once (safeguard against hot-reloads)
if (typeof process !== "undefined" && !(globalThis as any).__SIGINT_HANDLER_SET) {
    (globalThis as any).__SIGINT_HANDLER_SET = true;

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

async function proxyRequest(req: Request, path: string, method: string) {
    const url = new URL(req.url);
    const backendUrl = `${BACKEND_URL}/api/${path}${url.search}`;

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
            return new Response(response.body, {
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
        // Cleanup to prevent event listener and set tracking leaks
        req.signal.removeEventListener("abort", onAbort);
        activeControllers.delete(backendController);
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
