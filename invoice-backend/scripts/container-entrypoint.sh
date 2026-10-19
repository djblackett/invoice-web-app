#!/bin/sh
set -eu
# No schema push, reset or seed on startup. Failed migration prevents serving.
node scripts/migrate.cjs
exec "$@"
