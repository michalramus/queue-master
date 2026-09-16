import convict, { Schema } from "convict";
import path from "path";

/**
 * Schema of the external kiosk config file. Every optional setting has a default, so a partial
 * file is valid; JWTToken and backendUrl have no default and are therefore required.
 */
const appConfigSchema: Schema<Omit<AppConfigInterface, "configError">> = {
    JWTToken: {
        doc: "Device JWT used to authenticate against the API",
        format: String,
        default: null,
        sensitive: true,
    },
    backendUrl: {
        doc: "Base URL of the API, without the /api prefix",
        format: String,
        default: null,
    },
    mode: {
        doc: "Which screen the app runs: the ticket kiosk or the TV display",
        format: ["kiosk", "tv"],
        default: "kiosk",
    },
    zoomFactor: {
        doc: "Zoom factor of the window",
        format: (value: unknown): void => {
            if (typeof value !== "number" || !(value > 0)) {
                throw new Error("must be a number greater than 0");
            }
        },
        default: 1.0,
    },
    printingScript: {
        doc: "Path to the ticket printing script. Empty = printing disabled.",
        format: String,
        default: "",
    },
    printingDialogueShowTime: {
        doc: "How long the printing overlay blocks the screen, in ms",
        format: (value: unknown): void => {
            if (typeof value !== "number" || value < 0) {
                throw new Error("must be a number greater than or equal to 0");
            }
        },
        default: 1000,
    },
    audioSynthesizerScript: {
        doc: "Path to the audio synthesizer script. Empty = announcements disabled.",
        format: String,
        default: "",
    },
    openingHoursEnableBanner: {
        doc: "Show the closed banner outside opening hours",
        format: Boolean,
        default: true,
    },
    openingHoursEnableScripts: {
        doc: "Run the open/close scripts when opening hours start or end",
        format: Boolean,
        default: false,
    },
    openingHoursOpenScript: {
        doc: "Script executed when the kiosk opens. Empty = nothing runs.",
        format: String,
        default: "",
    },
    openingHoursCloseScript: {
        doc: "Script executed when the kiosk closes. Empty = nothing runs.",
        format: String,
        default: "",
    },
};

/**
 * Config file location: `--config <path>` > CONFIG_PATH > a .json path as the last CLI argument
 * (how `yarn dev:electron` and the packaged launchers have always passed it) > ./config.json
 */
function resolveConfigPath(argv: string[]): string {
    const flagIndex = argv.indexOf("--config");
    if (flagIndex >= 0 && argv[flagIndex + 1]) {
        return path.resolve(argv[flagIndex + 1]);
    }

    if (process.env.CONFIG_PATH) {
        return path.resolve(process.env.CONFIG_PATH);
    }

    const lastArgument = argv[argv.length - 1];
    if (lastArgument?.endsWith(".json")) {
        return path.resolve(lastArgument);
    }

    return path.resolve("config.json");
}

/** Reads and validates the external config file. Throws when it is missing or invalid. */
export function loadAppConfig(argv: string[] = process.argv): AppConfigInterface {
    const configPath = resolveConfigPath(argv);

    const config = convict(appConfigSchema);
    config.loadFile(configPath);
    config.validate({ allowed: "strict" });

    console.log(`Loaded configuration from ${configPath}`);

    return config.getProperties();
}
