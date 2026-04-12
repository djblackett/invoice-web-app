#!/bin/bash
# setup.sh — one-shot setup and launch for the Invoice Web App.
# Usage:  ./setup.sh [demo|dev]
# Default mode is 'demo'. Dev mode requires mkcert certs and Auth0 credentials (see README).

set -euo pipefail

# ── colour helpers ──────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
info()    { echo -e "${GREEN}[INFO]${NC}  $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*"; }
heading() { echo -e "\n${CYAN}=== $* ===${NC}"; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODE="${1:-demo}"

# ── prerequisites ────────────────────────────────────────────────────────────
check_prereqs() {
    heading "Checking prerequisites"
    local ok=1

    if ! command -v docker &>/dev/null; then
        error "Docker not found. Install from https://docs.docker.com/get-docker/"
        ok=0
    fi

    if ! docker compose version &>/dev/null 2>&1; then
        error "Docker Compose plugin not found. It ships with Docker Desktop, or install the plugin separately."
        ok=0
    fi

    if ! command -v node &>/dev/null; then
        error "Node.js not found. Install the LTS version from https://nodejs.org/"
        ok=0
    fi

    [ "$ok" -eq 1 ] || { error "Please install the missing tools and re-run this script."; exit 1; }
    info "All prerequisites found."
}

# ── port conflict check ──────────────────────────────────────────────────────
check_ports() {
    heading "Checking for port conflicts"
    local conflicts=0

    # Ports used by the compose files: 5432 (postgres), 8000 (backend), 5173 (frontend)
    for port in 5432 8000 5173; do
        if lsof -iTCP:"$port" -sTCP:LISTEN -t &>/dev/null 2>&1 || \
           ss -tlnp "sport = :$port" 2>/dev/null | grep -q ":$port"; then
            error "Port $port is already in use."
            conflicts=1
        fi
    done

    if [ "$conflicts" -ne 0 ]; then
        echo ""
        warn "One or more required ports are occupied. Common causes:"
        warn "  • Port 5432 — a local PostgreSQL service is running."
        warn "    Stop it with:  sudo systemctl stop postgresql"
        warn "                   brew services stop postgresql   (macOS)"
        warn "  • Port 8000 / 5173 — another dev server is running on those ports."
        echo ""
        error "Please free the conflicting ports and re-run this script."
        exit 1
    fi

    info "All required ports are free."
}

# ── .env setup ───────────────────────────────────────────────────────────────
setup_env() {
    heading "Setting up environment files"
    for dir in invoice-backend invoice-frontend; do
        local dest="$SCRIPT_DIR/$dir/.env"
        local src="$SCRIPT_DIR/$dir/.env.example"
        if [ ! -f "$dest" ]; then
            cp "$src" "$dest"
            info "Created $dir/.env from .env.example"
        else
            warn "$dir/.env already exists — skipping."
        fi
    done
}

# ── dependency install ────────────────────────────────────────────────────────
install_deps() {
    heading "Installing dependencies"

    # Attempt to enable corepack so that the yarn version pinned in .yarnrc.yml is used.
    if command -v corepack &>/dev/null; then
        info "Enabling corepack..."
        corepack enable 2>/dev/null || warn "corepack enable failed (may need sudo). Continuing with system yarn/npm."
    fi

    info "Installing backend dependencies..."
    (cd "$SCRIPT_DIR/invoice-backend" && yarn install)

    info "Installing frontend dependencies..."
    (cd "$SCRIPT_DIR/invoice-frontend" && yarn install)
}

# ── wait for backend /health ─────────────────────────────────────────────────
wait_for_backend() {
    local url="http://localhost:8000/health"
    local max=120 elapsed=0
    info "Waiting for backend to be ready at $url (up to ${max}s)..."
    until curl -sf "$url" &>/dev/null; do
        if [ "$elapsed" -ge "$max" ]; then
            warn "Backend did not become healthy within ${max}s. Continuing anyway."
            return
        fi
        sleep 5; elapsed=$((elapsed + 5)); printf "."
    done
    echo ""
    info "Backend is ready."
}

# ── seed demo data ────────────────────────────────────────────────────────────
seed_db() {
    heading "Seeding demo data"
    docker compose -f "$COMPOSE_FILE" exec -T backend-demo \
        sh -c "DATABASE_URL=postgresql://postgres:example@db-demo:5432/db-demo?schema=public npx prisma db seed"
    info "Demo data seeded successfully."
}

# ── main ─────────────────────────────────────────────────────────────────────
case "$MODE" in
    demo)
        COMPOSE_FILE="$SCRIPT_DIR/docker-compose.demo.yml"
        ;;
    dev)
        COMPOSE_FILE="$SCRIPT_DIR/docker-compose.dev.yml"
        warn "Dev mode requires HTTPS certificates (mkcert) and Auth0 credentials."
        warn "See README.md → Development Instructions before continuing."
        ;;
    *)
        error "Unknown mode: '$MODE'. Valid options: demo, dev"
        echo "Usage: $0 [demo|dev]"
        exit 1
        ;;
esac

check_prereqs
check_ports
setup_env
install_deps

heading "Starting containers (mode: $MODE)"
info "Compose file: $COMPOSE_FILE"
info "Building images and starting services — this may take several minutes on first run..."

docker compose -f "$COMPOSE_FILE" up -d --build

if [ "$MODE" = "demo" ]; then
    wait_for_backend
    seed_db
    echo ""
    echo -e "${GREEN}╔══════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  Invoice Web App is running in demo mode!            ║${NC}"
    echo -e "${GREEN}║                                                      ║${NC}"
    echo -e "${GREEN}║  Open: http://localhost:5173/invoice-web-app/        ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════╝${NC}"
else
    echo ""
    echo -e "${GREEN}╔══════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  Invoice Web App is starting in dev mode!            ║${NC}"
    echo -e "${GREEN}║                                                      ║${NC}"
    echo -e "${GREEN}║  Open: https://localhost:5173/invoice-web-app/       ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════╝${NC}"
fi
