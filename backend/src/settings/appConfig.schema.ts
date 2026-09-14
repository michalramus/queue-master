import { Schema } from "convict";

export type LogLevelType = "verbose" | "debug" | "log" | "warn" | "error";

/**
 * Values that can be provided by the external config file, environment variables or CLI arguments.
 * Mirrored into process.env by the loader, so the rest of the app keeps reading process.env.
 */
export interface AppConfigInterface {
    configPath: string;
    port: number;
    logLevel: LogLevelType;
    databaseUrl: string;
    jwtSecretKey: string;
    jwtRefreshTokenKey: string;
    uploadsPath: string;
    seedAdminUsername: string;
    seedAdminPassword: string;
}

/**
 * `env` names the environment variable an entry maps to - both the one read as the layer below the
 * config file and the one the loader mirrors the resolved value back into. Declaring it here keeps
 * a new setting to a single edit. The loader applies it, not convict itself, because convict would
 * rank the environment above the config file.
 *
 * NODE_ENV is deliberately absent - it gates Swagger exposure and is set by the yarn scripts
 * and the Dockerfile, never by the config file.
 */
export const appConfigSchema: Schema<AppConfigInterface> = {
    configPath: {
        doc: "Path to the external JSON config file. Missing file = env vars and defaults only.",
        format: String,
        default: "./config.json",
        arg: "config",
        env: "CONFIG_PATH",
    },
    port: {
        doc: "Port the API listens on",
        format: "port",
        default: 3001,
        arg: "port",
        env: "PORT",
    },
    logLevel: {
        doc: "Minimum log level, applied when NODE_ENV is production",
        format: ["verbose", "debug", "log", "warn", "error"],
        default: "log",
        arg: "log-level",
        env: "LOG_LEVEL",
    },
    databaseUrl: {
        doc: "PostgreSQL connection string used by Prisma",
        format: String,
        default: null,
        sensitive: true,
        env: "DATABASE_URL",
    },
    jwtSecretKey: {
        doc: "Secret used to sign access tokens",
        format: String,
        default: null,
        sensitive: true,
        env: "JWT_SECRET_KEY",
    },
    jwtRefreshTokenKey: {
        doc: "Secret used to sign refresh tokens",
        format: String,
        default: null,
        sensitive: true,
        env: "JWT_REFRESH_TOKEN_KEY",
    },
    uploadsPath: {
        doc: "Directory where uploaded files (e.g. logos) are stored",
        format: String,
        default: "./uploads",
        env: "UPLOADS_PATH",
    },
    seedAdminUsername: {
        doc: "Username of the admin account created on first boot",
        format: String,
        default: "admin",
        env: "SEED_ADMIN_USERNAME",
    },
    seedAdminPassword: {
        doc: "Password of the seeded admin account. Empty = a random one is generated and logged.",
        format: String,
        default: "",
        sensitive: true,
        env: "SEED_ADMIN_PASSWORD",
    },
};
