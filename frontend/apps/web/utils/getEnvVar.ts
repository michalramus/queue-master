/**
 * Next inlines literal `process.env.SOME_VAR` accesses at build time, which would freeze the value
 * and make the external config file useless. Bracket access forces a lookup at runtime.
 */
export function getEnvVar(name: string, fallback: string = ""): string {
    // An env var declared but left empty (e.g. `BACKEND_URL=` in a compose file) must be treated as
    // unset, otherwise the empty string wins over the fallback and produces invalid URLs.
    return process.env[name] || fallback;
}
