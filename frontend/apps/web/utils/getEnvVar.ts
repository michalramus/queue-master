/**
 * Next inlines literal `process.env.SOME_VAR` accesses at build time, which would freeze the value
 * and make the external config file useless. Bracket access forces a lookup at runtime.
 */
export function getEnvVar(name: string, fallback: string = ""): string {
    return process.env[name] ?? fallback;
}
