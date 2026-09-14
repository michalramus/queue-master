import convict, { Schema } from "convict";
import * as fs from "fs";
import * as path from "path";
import { AppConfigInterface, appConfigSchema } from "@/utils/server/appConfig.schema";

/** The only entry whose value is a path, not a setting - never mirrored back into the environment */
const CONFIG_PATH_KEY = "configPath";

/** Reads the `env` name of a schema entry, or null when the entry declares none */
function readEnvName(entry: unknown): string | null {
    if (typeof entry !== "object" || entry === null || !("env" in entry)) {
        return null;
    }

    return typeof entry.env === "string" ? entry.env : null;
}

/**
 * Schema path -> environment variable, taken from the schema itself, so adding a setting there is
 * enough for it to be read from the environment and mirrored back.
 */
function buildEnvVarByPath(schema: Schema<AppConfigInterface>): Record<string, string> {
    const envVarByPath: Record<string, string> = {};

    for (const [configPath, entry] of Object.entries(schema)) {
        const envName = readEnvName(entry);
        if (envName !== null) {
            envVarByPath[configPath] = envName;
        }
    }

    return envVarByPath;
}

export const ENV_VAR_BY_PATH: Record<string, string> = buildEnvVarByPath(appConfigSchema);

/**
 * Environment variables that are actually set, as a convict layer.
 * Loaded before the config file so the file wins over the environment.
 */
function buildEnvLayer(env: NodeJS.ProcessEnv): Record<string, string> {
    const layer: Record<string, string> = {};

    for (const [configPath, envVar] of Object.entries(ENV_VAR_BY_PATH)) {
        const value = env[envVar];
        if (value !== undefined && value !== "") {
            layer[configPath] = value;
        }
    }

    return layer;
}

/**
 * Write the resolved values back into process.env.
 * Consumers must read them through getEnvVar, because Next inlines literal
 * process.env.SOME_VAR accesses at build time.
 */
function mirrorToEnv(config: AppConfigInterface, env: NodeJS.ProcessEnv): void {
    for (const [configPath, value] of Object.entries(config)) {
        const envVar = ENV_VAR_BY_PATH[configPath];
        if (envVar === undefined || configPath === CONFIG_PATH_KEY) {
            continue;
        }

        if (value === null || value === undefined || value === "") {
            continue;
        }

        env[envVar] = String(value);
    }
}

/**
 * Resolve configuration from, in decreasing priority:
 * CLI argument > config file > environment variable > schema default.
 *
 * convict is constructed with an empty environment on purpose: it would otherwise rank the
 * environment above the config file. The environment is applied below the file instead.
 *
 * Throws when a value is invalid.
 */
export function loadAppConfig(
    argv: string[] = process.argv,
    env: NodeJS.ProcessEnv = process.env,
): AppConfigInterface {
    // NODE_ENV is the one variable Next's ProcessEnv type requires; no schema entry binds to it,
    // so convict sees an environment with nothing it can apply
    const config = convict(appConfigSchema, {
        args: argv.slice(2),
        env: { NODE_ENV: env.NODE_ENV },
    });

    config.load(buildEnvLayer(env));

    const configPath = path.resolve(config.get("configPath"));
    if (fs.existsSync(configPath)) {
        config.loadFile(configPath);
        console.log(`[AppConfig] Loaded configuration from ${configPath}`);
    } else {
        console.log(
            `[AppConfig] No configuration file at ${configPath}, using environment and defaults`,
        );
    }

    config.validate({ allowed: "strict" });

    const properties = config.getProperties();
    mirrorToEnv(properties, env);

    return properties;
}
