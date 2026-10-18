#!/bin/sh
set -eu
# No schema push, reset or seed on startup. Failed migration prevents serving.
node node_modules/prisma/build/index.js migrate deploy
exec "$@"
