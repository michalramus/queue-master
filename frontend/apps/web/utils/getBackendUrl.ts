import { getEnvVar } from "@/utils/getEnvVar";

/**
 * Base URL of the NestJS API for server-side requests, without a trailing slash.
 * The browser never uses it - client-side requests go through the /api proxy.
 *
 * Regex strips a single trailing slash: "http://api:3001/" -> "http://api:3001",
 * "http://api:3001" stays unchanged.
 */
export function getBackendUrl(): string {
    return getEnvVar("BACKEND_URL", "http://localhost:3001").replace(/\/$/, "");
}
