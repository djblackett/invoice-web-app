#!/usr/bin/env bash
# Local containers only. Does not install host dependencies or seed/reset existing data.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"
mode="${1:-demo}"
case "$mode" in
  demo) compose=(-f docker-compose.yml -f docker-compose.demo.yml); scheme=http ;;
  dev)
    compose=(-f docker-compose.dev.yml); scheme=https
    for package in invoice-backend invoice-frontend; do
      if [ ! -f "$package/.env" ]; then cp "$package/.env.example" "$package/.env"; fi
    done
    for cert in invoice-backend/certs/localhost-key.pem invoice-backend/certs/localhost-fullchain.pem invoice-frontend/certs/localhost-key.pem invoice-frontend/certs/localhost.pem; do
      if [ ! -f "$cert" ]; then
        echo "Missing $cert. Generate local mkcert certificates as documented in README.md." >&2
        exit 1
      fi
    done
    ;;
  *) echo "Usage: $0 [demo|dev]" >&2; exit 1 ;;
esac
docker compose version >/dev/null
docker compose "${compose[@]}" up -d --build --wait --wait-timeout 180
echo "Open $scheme://localhost:5173/invoice-web-app/"
echo "Stop: docker compose ${compose[*]} down"
