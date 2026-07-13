export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

// Regex at the end to remove trailing slash if any
const BACKEND_URL = process.env.BACKEND_URL?.replace(/\/$/, "") || "http://localhost:3001";

async function proxyRequest(req: Request, path: string, method: string) {
    const url = new URL(req.url);
    const backendUrl = `${BACKEND_URL}/api/${path}${url.search}`;

    const headers = new Headers(req.headers);
    headers.delete("host");

    // Create an independent AbortController for the backend fetch
    const backendController = new AbortController();

    // Link the client's disconnect to the backend fetch directly
    req.signal.addEventListener("abort", () => {
        backendController.abort();
    });

    try {
        const response = await fetch(backendUrl, {
            method,
            headers,
            body: method !== "GET" && method !== "HEAD" ? await req.arrayBuffer() : undefined,
            signal: backendController.signal,
        });

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
        // If the browser simply disconnected, respond with a standard 499 quietly
        if (req.signal.aborted) {
            return new Response("Client disconnected", { status: 499 });
        }

        process.stderr.write(
            `Error while connecting to backend: ${method} ${backendUrl} — ${error instanceof Error ? error.message : String(error)}\n`,
        );
        return new Response("Error while connecting to backend", { status: 502 });
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
