/**
 * Runs once when the server starts, before any route module is evaluated, so the values the
 * config file provides are in process.env by the time a request is handled.
 *
 * Guarded on the Node runtime and using a dynamic import, otherwise the fs/path imports of the
 * loader would end up in the Edge bundle used by proxy.ts.
 */
export async function register(): Promise<void> {
    if (process.env.NEXT_RUNTIME !== "nodejs") {
        return;
    }

    const { loadAppConfig } = await import("@/utils/server/loadAppConfig");

    // A broken config must not take the server down - it can still proxy on the defaults
    try {
        loadAppConfig();
    } catch (error) {
        console.error(
            `[AppConfig] Invalid configuration: ${error instanceof Error ? error.message : String(error)}`,
        );
    }
}
