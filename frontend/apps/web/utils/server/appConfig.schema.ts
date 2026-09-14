import { Schema } from "convict";

/**
 * `env` names the environment variable an entry maps to - both the one read as the layer below the
 * config file and the one the loader mirrors the resolved value back into. Declaring it here keeps
 * a new setting to a single edit. The loader applies it, not convict itself, because convict would
 * rank the environment above the config file.
 *
 * Server-side only - nothing here is exposed to the browser.
 * PORT and HOSTNAME are absent on purpose: Next reads them before instrumentation runs,
 * so they stay environment variables.
 */
export interface AppConfigInterface {
    configPath: string;
    backendUrl: string;
}

export const appConfigSchema: Schema<AppConfigInterface> = {
    configPath: {
        doc: "Path to the external JSON config file. Missing file = env vars and defaults only.",
        format: String,
        default: "./config.json",
        arg: "config",
        env: "CONFIG_PATH",
    },
    backendUrl: {
        doc: "Base URL of the NestJS API, used by the /api proxy and the server-side axios instances",
        format: String,
        default: "http://localhost:3001",
        arg: "backend-url",
        env: "BACKEND_URL",
    },
};
