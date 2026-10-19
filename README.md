# Fullstack Invoice Project

![License](https://img.shields.io/badge/license-MIT-blue.svg)
[![Build Status](https://github.com/djblackett/invoice-web-app/actions/workflows/ci-code-quality-tests.yaml/badge.svg)](https://github.com/djblackett/invoice-web-app/actions/workflows/ci-code-quality-tests.yaml)
![Node.js Version](https://img.shields.io/badge/node-v24.15.0-brightgreen.svg)

![Frontend screenshot showing the invoice application interface](./diagrams/fm-screenshot.png)

![Screenshot showing dark mode on multiple mobile views in a row](./diagrams/fm-mobile-dark.png)

## Table of Contents

- [Fullstack Invoice Project](#fullstack-invoice-project)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Links](#links)
  - [Implementation highlights](#implementation-highlights)
  - [Tech Stack](#tech-stack)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [DevOps](#devops)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Application](#running-the-application)
  - [Testing](#testing)
  - [Deployment](#deployment)
  - [Diagrams](#diagrams)
  - [Future Trajectory](#future-trajectory)
  - [Timesheet](#timesheet)
  - [Note on LLM usage](#note-on-llm-usage)
  - [License](#license)
  - [Contact](#contact)

## Project Overview

The Fullstack Invoice Project is a robust invoicing application designed as a complete full-stack solution to streamline invoice management. It implements all CRUD operations along with user authentication and management.  

Originally initiated as a **[FrontendMentor](https://www.frontendmentor.io/challenges/invoice-app-i7KaLTQjl)** challenge in May 2022 to enhance CSS skills, the project has evolved into a comprehensive application featuring both a dynamic frontend and a scalable backend. The backend leverages and expands on principles from the **[FullStackOpen](https://fullstackopen.com)** course, ensuring maintainability and a solid foundation for testing.

More details on my motivation and approach to writing this app can be found in the [project description](./docs/project-description.md). You can also view the specific requirements of the [Frontend Mentor challenge](./docs/README-frontend-mentor.md).

## Links

- [Live demo](https://djblackett.github.io/invoice-web-app/)
- [Github repository](https://github.com/djblackett/invoice-web-app)

## Implementation highlights

- **Responsive Frontend** using ReactJS and Styled Components
- **State Management** with Redux Toolkit and React Context
- **GraphQL Integration** via Apollo Client
- **Backend Services** built with NodeJS, ExpressJS, and InversifyJS
- **Database Management** using Prisma ORM and PostgreSQL
- **Unit Testing** for frontend and backend
- **Integration Testing** using Supertest
- **End-to-End (E2E) Testing** using Playwright
- **CI/CD Pipelines** built with GitHub Actions
- **Optimized Docker Containers** utilizing multi step builds
- **Local Container Orchestration** via Docker Compose

## Tech Stack

### Frontend

- **ReactJS** (TypeScript)
- **Styled Components**
- **Redux Toolkit**
- **Apollo Client** (GraphQL)
- **React Testing Library**

### Backend

- **NodeJS** (TypeScript)
- **ExpressJS**, **InversifyJS**
- **Prisma ORM**
- **PostgreSQL**
- **Vitest**

### DevOps

- **Docker Containers**
- **Docker Compose**
- **GitHub Actions** CI/CD Pipeline

## Getting Started

Use Linux/macOS Node **24.15.0** (`nvm use`, from `.nvmrc`), Corepack with the
package-pinned Yarn **4.6.0**, Docker Compose v2, and PostgreSQL 16 server tools for
the isolated browser gate. Use `corepack yarn`, since a global Yarn 1 ignores the
package pin. The root npm package provides Neon configuration and commands that
coordinate the two application packages; each application retains its Yarn lockfile.

```bash
(cd invoice-backend && corepack yarn install --immutable && npm run prisma-generate)
(cd invoice-frontend && corepack yarn install --immutable)
cp invoice-backend/.env.example invoice-backend/.env
cp invoice-frontend/.env.example invoice-frontend/.env
```

### Neon Postgres

The existing `invoice-app` project / `production` branch is already connected and
migrated. Do not repeat provisioning, reset it, or run `neon deploy` as a startup step.
`neon.ts` records the existing CLI policy (Auth disabled; newly created non-default
branches expire after seven days). It is not a second application host.

The ignored root `.env.local` holds the pooled `DATABASE_URL` and direct
`DATABASE_URL_UNPOOLED`, both with `sslmode=require`, plus the application settings
in root `.env.example`. Explicit shell variables take precedence, followed by root
`.env.local`, root `.env`, and package dotenv files. Never put database credentials
in `VITE_*` variables. Neither CI nor local PostgreSQL development needs Neon access.

```bash
nvm use
npm ci
npm run build
npm start
# Open http://localhost:5173/invoice-web-app/ (local preview only).
# Or start just the compiled API:
npm run start:backend
# Read-only live database smoke check, no browser or running API required:
npm run test:neon
```

Root build/start commands are optional local coordinators. The production backend
still builds with `invoice-backend`'s existing TypeScript/alias commands and runs
`node dist/src/index.js` in its existing Docker image. Prisma 6 remains the singleton
PostgreSQL TCP client. `npm run db:migrate` and container startup use the direct URL
only for the migration subprocess, preserving the pooled application URL. Local
PostgreSQL needs only `DATABASE_URL`. The existing schema and migrations are unchanged.
Do not run migrations or `db:seed:demo` against hosted data without approval; the seed
resets the shared demo workspace.

`test:neon` now enforces PostgreSQL read-only transactions through both connections,
compares committed migration checksums and reports the existing demo identity/counts.
The previous browser CRUD version wrote records; use the isolated real-backend E2E
gate below for CRUD/revision regression instead. Demo Mode works without Auth0.
See [public demo deployment](docs/deployment.md) for hosted settings and approvals.

### Local demo and compiled containers

```bash
./setup.sh demo
# Equivalent:
docker compose -f docker-compose.yml -f docker-compose.demo.yml up -d --build --wait
# Open http://localhost:5173/invoice-web-app/
# Stop without deleting data:
docker compose -f docker-compose.yml -f docker-compose.demo.yml down
```

The demo override explicitly enables both flags. Demo entry and Reset Demo invoke
the existing canonical transactional reset: seven invoices and eleven revisions
owned by `demoId / USER`. Visitors share that workspace. Ordinary container startup
applies committed migrations and **never seeds or resets data**. Explicitly reseed
only a disposable/local demo database when needed:

```bash
docker compose -f docker-compose.yml -f docker-compose.demo.yml exec backend node prisma/seed.mjs
```

`docker compose up -d --build --wait` alone runs the compiled production-like local
stack with Demo disabled. Its unconfigured account sign-in screen is expected;
normal login requires your public Auth0 SPA settings and backend issuer/audience.
This is a local configuration, with loopback-only ports and local-only DB credentials.
It is not a public hosting configuration.

Frontend configuration is embedded at **build time**, supplied as Compose build
arguments from the shell/root environment. Changing frontend container runtime
variables does not rebuild assets. For isolated ports, set all four values together:

```bash
FRONTEND_PORT=15173 BACKEND_PORT=18000 \
VITE_BACKEND_URL=http://localhost:18000 CORS_ORIGIN=http://localhost:15173 \
docker compose -p invoice-local up -d --build --wait
# Stop this isolated stack and delete ONLY its disposable volume:
docker compose -p invoice-local down --volumes
```

The browser API URL is the backend **root**, shared with WebSocket subscriptions.
Container names such as `backend-dev` are not browser-resolvable addresses. Set one
exact `CORS_ORIGIN`, including scheme/port, without a path or comma-separated list.
Both Demo flags default to false; enable them deliberately only for an intended demo.

When `CORS_ORIGIN` is unset, non-production HTTP CORS allows only
`http://localhost:5173` and `https://localhost:5173`, matching Vite's documented
HTTP/demo and HTTPS workflows. Production retains its historical default
`https://djblackett.github.io`; set the exact frontend origin for every release.
Setting `CORS_ORIGIN` replaces these defaults with that single origin, including
an exact custom local port when needed. Use the browser's serialized HTTP(S)
origin (no trailing slash). Empty/malformed values, paths, lists, `null` and
wildcards fail startup. Wildcards are not accepted with credentialed CORS.
Unapproved origins and `Origin: null` receive no CORS authorization headers.
Requests without `Origin`, including health probes, continue normally without
CORS headers. CORS does not replace API authorization or restrict WebSocket
handshakes. The browser E2E runner supplies its exact dynamic frontend origin
through `CORS_ORIGIN`, so it needs no additional default ports.

### Source development

```bash
# Start only the local database (localhost:55432):
docker compose -f docker-compose.dev.yml up -d db-dev
npm --prefix invoice-backend run migrate:deploy
# Separate terminals, with the example .env files above:
npm --prefix invoice-backend run dev
DEV_HTTPS=false npm --prefix invoice-frontend run dev
```

For this HTTP-only local workflow use backend `CERT_DIR=` and the example API/origin
values. Source edits reload through the existing development runners. Normal Auth0
login additionally requires configured allowed origins/callbacks in your test tenant.

For HTTPS source development in containers, supply the package `.env` files and
trusted local mkcert files first:

```bash
mkcert -install
mkdir -p invoice-backend/certs invoice-frontend/certs
mkcert -key-file invoice-backend/certs/localhost-key.pem \
  -cert-file invoice-backend/certs/localhost.pem localhost 127.0.0.1
cat invoice-backend/certs/localhost.pem "$(mkcert -CAROOT)/rootCA.pem" \
  > invoice-backend/certs/localhost-fullchain.pem
cp invoice-backend/certs/localhost{,-key}.pem invoice-frontend/certs/
./setup.sh dev
# Open https://localhost:5173/invoice-web-app/
docker compose -f docker-compose.dev.yml down
```

Development Compose mounts only source/Prisma/certificates, preserving image Linux
dependencies. It has no default E2E/Adminer container and does not seed or enable Demo.

## Testing

```bash
npm --prefix invoice-frontend run check
npm --prefix invoice-frontend run build
npm --prefix invoice-backend run check
# Backend integration tests require an explicit DISPOSABLE database;
# test:integration deploys committed migrations, then runs serially.
DATABASE_URL=postgresql://postgres:local-only@localhost:55432/invoice_checks \
  npm --prefix invoice-backend run test:integration
```

Create `invoice_checks` explicitly on the local database first if using that example;
never point integration tests at developer data you want to keep. For a completely
managed temporary database and combined backend/browser regression:

```bash
(cd invoice-frontend && npx --no-install playwright install chromium)
PG_BIN=/usr/lib/postgresql/16/bin E2E_BACKEND_REGRESSION=true \
  npm --prefix invoice-frontend run test:e2e
```

Omit `E2E_BACKEND_REGRESSION=true` for the normal 17-case browser gate. PostgreSQL
server tools must be on PATH or in `PG_BIN`; run as a non-root user. CI installs
Chromium with its OS dependencies. No Auth0 credentials, existing DB, certificates
or mock GraphQL responses are required. [Browser details](invoice-frontend/README.md#end-to-end-tests).

Production artifacts:

```bash
npm --prefix invoice-backend run build
VITE_BACKEND_URL=http://localhost:8000 npm --prefix invoice-frontend run build
# Requires a migrated local database:
npm --prefix invoice-backend start
# Local preview only; release image uses nginx:
DEV_HTTPS=false npm --prefix invoice-frontend run preview
```

## Deployment

CI runs frontend types/lint/Vitest/build, backend types/lint/unit/migrated PostgreSQL
integration/build, the isolated serial Chromium gate, and production container
build/startup checks. CodeQL remains separate. Ordinary PRs require no production
secrets and do not deploy.

The public demo reuses GitHub Pages, the existing Fly `invoice-backend` app and
Neon `invoice-app` / `production`. The manual **Publish demo to GitHub Pages** workflow
builds with `VITE_BACKEND_URL=https://invoice-backend.fly.dev` and `VITE_DEMO_MODE=true`.
It runs only from `main`, after explicit operator dispatch. Fly deployment remains a
separate approved CLI action from `invoice-backend/`, using its Dockerfile/manifest.
The root `fly.toml` remains an unsupported historical experiment.

Follow the [deployment audit and operator checklist](docs/deployment.md) before
publishing. It records required secrets, existing Machine count, shared demo/reset
behavior, cold starts, WebSocket limits and costs. No hosted deployment was performed
as part of preparing these configurations. Historical infrastructure evidence remains
in the [Slice 6A audit](docs/audit/slice-6a-release-infrastructure.md).

## Diagrams

### Architecture Flowchart

This diagram provides a high-level overview of the application's flow. The user interacts with the React (TypeScript) frontend, which communicates with the Node.js/Express backend via a GraphQL API (Apollo Client). The backend uses Prisma ORM to manage data in a PostgreSQL database. GitHub Actions verifies application checks and local container startup. Live deployment is a separate release step.

<img src="./diagrams/architecture.svg" alt="Architecture Diagram" width="400" />

### IoC Backend Architecture

This diagram shows how InversifyJS manages dependency injection in our backend. Controllers/Resolvers handle requests, delegate logic to Services, and interact with Repositories for data operations. The IoC container ensures modularity, testability, and maintainability.

<img src="./diagrams/ioc-backend.svg" alt="Inversion of Control backend architecture" width="400" />

### GraphQL Schema

GraphQL schema diagrams for [queries, mutations, and subscriptions](./docs/graphql-schema.md)

## Future Trajectory

While the Fullstack Invoice Project is functional and meets its core requirements, there are several areas identified for future improvement:

- **Enhanced Test Coverage:**  
  Additional unit, integration, and end-to-end tests will be implemented to further improve the app’s reliability and ease of maintenance.

- **Kubernetes Deployment:**  
  Exploring a Kubernetes-based deployment is on the roadmap. Container orchestration would streamline scaling and provide a more robust production environment.

- **Performance Optimization & Monitoring:**  
  Future work may include performance tuning and implementing enhanced monitoring to better track and optimize application behavior in production.

These enhancements are part of our long-term vision to continuously refine the project, ensuring it remains robust, scalable, and easy to maintain.

## Timesheet

For a detailed record of the time spent on this project, see the [project timesheet](./docs/timesheet.md).

## Note on LLM Usage

 I utilized ChatGPT and Copilot during this project. In my experience, they rarely produce immediately functional code without significant modifications. They have also sent me on quite a few wild goose chases. Instead, they excel at critiquing existing code and identifying deviations from best practices. I engaged in numerous conceptual discussions that helped refine my ideas and approaches, and I found them useful for analyzing complex error messages and stack traces.

 The unit tests constitute the main portion of the codebase generated by AI—many created using VSCode Copilot’s built-in test generation and others produced by submitting code to ChatGPT for test suggestions. Ultimately, I devoted considerable time debugging these tests and studying proper mocking techniques and best testing practices.

 I also used ChatGPT for some of the written documentation. Generally, I typed out what I wanted to say, but asked ChatGPT to say it more concisely and with a more formal tone.

## Contributing

Contributions to the Fullstack Invoice Project are welcome.  
If you wish to propose enhancements, fix bugs, or expand functionality, please adhere to the following process:

1. **Fork** the repository and create a dedicated branch for your changes.  
2. **Implement** your changes in a manner consistent with the existing code style and architectural patterns.  
3. **Add or update tests** as necessary to maintain reliability, and ensure that all unit, integration, and end-to-end tests pass locally before submission.  
4. **Open a Pull Request** describing the nature of your changes, the problem they address, and any relevant context.  

For substantial changes or new features, it is recommended to open an issue beforehand to facilitate discussion and alignment on approach.


## License

This project is licensed under the MIT License. This means you are free to use, modify, and distribute the software, provided that you include the original copyright and license notice in any copies or substantial portions of the software.

## Contact

- **Author:** David Andrea
- **GitHub:** [djblackett](https://github.com/djblackett)
