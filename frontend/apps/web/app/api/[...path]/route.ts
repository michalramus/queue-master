import { Agent } from "undici";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

// Regex at the end to remove trailing slash if any
const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") || "http://localhost:3001";

// Create agent with disabled timeouts for SSE
const agent = new Agent({
    bodyTimeout: 0,
    headersTimeout: 0,
    connectTimeout: 10000, // 10 seconds for initial connection
});

async function proxyRequest(req: Request, path: string, method: string) {
    const url = new URL(req.url);
    const backendUrl = `${BACKEND_URL}/${path}${url.search}`;

    const headers = new Headers(req.headers);
    headers.delete("host");

    try {
        const response = await fetch(backendUrl, {
            method,
            headers,
            body: method !== "GET" && method !== "HEAD" ? await req.arrayBuffer() : undefined,
            // @ts-ignore - dispatcher is valid but not in types
            dispatcher: agent,
            // @ts-ignore - duplex is needed for streaming
            duplex: "half",
        });

        const contentType = response.headers.get("content-type");

        // For SSE endpoints, create a proper streaming response
        if (contentType?.includes("text/event-stream")) {
            // Return the response body directly without wrapping in ReadableStream
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
        console.error("Error while connecting to backend:", error);
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
