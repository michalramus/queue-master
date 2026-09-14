import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { ENV_VAR_BY_PATH, loadAppConfig } from "src/settings/appConfig.loader";
import { AppConfigInterface, appConfigSchema } from "src/settings/appConfig.schema";

describe("loadAppConfig", () => {
    let tmpDir: string;

    /** Required values, so a test only has to provide what it actually exercises */
    const requiredEnv: NodeJS.ProcessEnv = {
        DATABASE_URL: "postgresql://env/db",
        JWT_SECRET_KEY: "env-secret",
        JWT_REFRESH_TOKEN_KEY: "env-refresh",
    };

    function writeConfigFile(content: Record<string, unknown> | string): string {
        const filePath = path.join(tmpDir, `${Math.random().toString(36).slice(2)}.json`);
        fs.writeFileSync(filePath, typeof content === "string" ? content : JSON.stringify(content));
        return filePath;
    }

    beforeEach(() => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "qm-config-"));
    });

    afterEach(() => {
        fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    it("falls back to schema defaults when no config file exists", () => {
        const env: NodeJS.ProcessEnv = { ...requiredEnv };

        const config: AppConfigInterface = loadAppConfig(
            ["node", "main", "--config", path.join(tmpDir, "missing.json")],
            env,
        );

        expect(config.port).toBe(3001);
        expect(config.logLevel).toBe("log");
        expect(config.uploadsPath).toBe("./uploads");
        expect(config.seedAdminUsername).toBe("admin");
    });

    it("lets environment variables override defaults", () => {
        const env: NodeJS.ProcessEnv = { ...requiredEnv, PORT: "4000", UPLOADS_PATH: "/data" };

        const config: AppConfigInterface = loadAppConfig(["node", "main"], env);

        expect(config.port).toBe(4000);
        expect(config.uploadsPath).toBe("/data");
    });

    it("lets the config file override environment variables", () => {
        const filePath = writeConfigFile({ port: 5000, databaseUrl: "postgresql://file/db" });
        const env: NodeJS.ProcessEnv = { ...requiredEnv, PORT: "4000" };

        const config: AppConfigInterface = loadAppConfig(["node", "main", "--config", filePath], env);

        expect(config.port).toBe(5000);
        expect(config.databaseUrl).toBe("postgresql://file/db");
    });

    it("lets a CLI argument override the config file", () => {
        const filePath = writeConfigFile({ port: 5000 });
        const env: NodeJS.ProcessEnv = { ...requiredEnv };

        const config: AppConfigInterface = loadAppConfig(["node", "main", "--config", filePath, "--port", "6000"], env);

        expect(config.port).toBe(6000);
    });

    it("resolves the config file path from CONFIG_PATH", () => {
        const filePath = writeConfigFile({ uploadsPath: "/from-config-path" });
        const env: NodeJS.ProcessEnv = { ...requiredEnv, CONFIG_PATH: filePath };

        const config: AppConfigInterface = loadAppConfig(["node", "main"], env);

        expect(config.uploadsPath).toBe("/from-config-path");
    });

    it("throws when a required value is missing everywhere", () => {
        expect(() => loadAppConfig(["node", "main"], {})).toThrow(/databaseUrl/);
    });

    it("throws on an invalid value", () => {
        const filePath = writeConfigFile({ port: "not-a-port" });

        expect(() => loadAppConfig(["node", "main", "--config", filePath], { ...requiredEnv })).toThrow(/port/);
    });

    it("throws on an unknown key in the config file", () => {
        const filePath = writeConfigFile({ typoedKey: true });

        expect(() => loadAppConfig(["node", "main", "--config", filePath], { ...requiredEnv })).toThrow(/typoedKey/);
    });

    it("mirrors resolved values into the environment", () => {
        const filePath = writeConfigFile({
            port: 5000,
            databaseUrl: "postgresql://file/db",
            jwtSecretKey: "file-secret",
            jwtRefreshTokenKey: "file-refresh",
            seedAdminUsername: "root",
        });
        const env: NodeJS.ProcessEnv = {};

        loadAppConfig(["node", "main", "--config", filePath], env);

        expect(env.PORT).toBe("5000");
        expect(env.DATABASE_URL).toBe("postgresql://file/db");
        expect(env.JWT_SECRET_KEY).toBe("file-secret");
        expect(env.JWT_REFRESH_TOKEN_KEY).toBe("file-refresh");
        expect(env.SEED_ADMIN_USERNAME).toBe("root");
    });

    it("reads and mirrors every env-bound schema entry, so a new setting needs no loader change", () => {
        // The map is derived from the schema, so every entry there is reachable from the environment
        expect(Object.keys(ENV_VAR_BY_PATH).sort()).toEqual(Object.keys(appConfigSchema).sort());

        const env: NodeJS.ProcessEnv = {
            ...requiredEnv,
            LOG_LEVEL: "warn",
            UPLOADS_PATH: "/data",
            SEED_ADMIN_USERNAME: "root",
            SEED_ADMIN_PASSWORD: "from-env",
        };

        const config: AppConfigInterface = loadAppConfig(["node", "main"], env);

        expect(config.logLevel).toBe("warn");
        expect(config.seedAdminPassword).toBe("from-env");
        expect(env.SEED_ADMIN_PASSWORD).toBe("from-env");
    });

    it("does not mirror the config file path back into the environment", () => {
        const filePath = writeConfigFile({ port: 5000 });
        const env: NodeJS.ProcessEnv = { ...requiredEnv };

        loadAppConfig(["node", "main", "--config", filePath], env);

        expect(env.CONFIG_PATH).toBeUndefined();
    });

    it("does not mirror an empty seed admin password, so a random one is still generated", () => {
        const env: NodeJS.ProcessEnv = { ...requiredEnv };

        loadAppConfig(["node", "main"], env);

        expect(env.SEED_ADMIN_PASSWORD).toBeUndefined();
    });
});
