#!/bin/sh
set -e

# Prisma reads DATABASE_URL from the environment, so the external config file has to be resolved
# before the migrations run. The loader logs to stdout, so the value is passed through a file.
# The `--` is required, otherwise node consumes `--config` itself.
DB_URL_FILE="$(mktemp)"
node -e '
const { loadAppConfig } = require("/app/dist/settings/appConfig.loader");
const config = loadAppConfig(["node", "-e", ...process.argv.slice(1, -1)]);
require("fs").writeFileSync(process.argv[process.argv.length - 1], config.databaseUrl);
' -- "$@" "$DB_URL_FILE"

DATABASE_URL="$(cat "$DB_URL_FILE")"
export DATABASE_URL
rm -f "$DB_URL_FILE"

npx prisma migrate deploy

exec node dist/main "$@"
