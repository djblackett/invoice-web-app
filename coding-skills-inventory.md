# Coding Skills Inventory — David Andrea (@djblackett)
*Generated May 2026 from analysis of github.com/djblackett*

---

## Languages

| Language | Proficiency | Evidence |
|---|---|---|
| **TypeScript** | Proficient | Primary language across invoice-web-app, k8s-todo-source, rest-countries-api; strict typing, generics, decorators |
| **Go** | Comfortable | hackathon (CLI tool), k8s-todo-source (Gin/GORM backend + static file server); completed Boot.dev Golang Backend Path |
| **Python** | Comfortable | asteroids-bootdev — substantial pygame project with spatial grids, async loops, particle systems, audio processing |
| **JavaScript** | Comfortable | Supporting roles across frontend projects; also written Medium articles on JS for beginners |
| **Java** | Familiar | Contract content writing for Hyperskill (switch expressions, modules, Lombok, Gson, text blocks) |
| **SQL** | Familiar | PostgreSQL schema design, raw init.sql scripts, Prisma migrations |
| **Shell / Bash** | Familiar | k8s-todo-dep (GitOps manifests repo), CI scripting |
| **CSS / SCSS** | Familiar | Styled Components, SCSS modules, responsive layouts |

---

## Frontend

| Skill | Proficiency | Evidence |
|---|---|---|
| **React** | Proficient | Multiple production-grade projects; hooks, context, performance patterns |
| **Redux Toolkit** | Proficient | invoice-web-app, k8s-todo-source (UI state); slices, thunks, selectors |
| **TanStack Query (React Query)** | Comfortable | k8s-todo-source; server state, optimistic updates |
| **Apollo Client (GraphQL)** | Comfortable | invoice-web-app; queries, mutations, cache management |
| **Styled Components** | Comfortable | invoice-web-app; theming, dark/light mode |
| **Vite** | Comfortable | Frontend tooling across TypeScript projects |
| **React Testing Library** | Comfortable | invoice-web-app frontend unit tests |
| **Playwright (E2E)** | Familiar | invoice-web-app end-to-end test suite |
| **React Beautiful DnD** | Familiar | k8s-todo-source drag-and-drop reordering |
| **Responsive / mobile design** | Comfortable | Invoice app (mobile dark mode screenshots, responsive layouts) |

---

## Backend

| Skill | Proficiency | Evidence |
|---|---|---|
| **Node.js + Express** | Proficient | invoice-web-app backend; middleware, routing, auth |
| **GraphQL (Apollo Server)** | Comfortable | invoice-web-app; schema design, resolvers, subscriptions |
| **Prisma ORM** | Comfortable | invoice-web-app; schema, migrations, seeding |
| **PostgreSQL** | Comfortable | Used across invoice-web-app and k8s-todo-source; transactions, UUIDs, raw SQL |
| **InversifyJS (IoC / DI)** | Comfortable | invoice-web-app backend; repository pattern, testable architecture |
| **Gin (Go web framework)** | Comfortable | k8s-todo-source API server |
| **GORM (Go ORM)** | Familiar | k8s-todo-source; CRUD, transaction handling |
| **NATS (message queue)** | Familiar | k8s-todo-source; event publishing on CRUD operations |
| **REST API design** | Comfortable | Multiple projects |
| **Auth0 integration** | Familiar | invoice-web-app authentication |
| **OpenAI API** | Familiar | hackathon; direct API calls, model selection |
| **Ollama (local LLM)** | Familiar | hackathon; local inference, Docker sidecar setup |

---

## Testing

| Skill | Proficiency | Evidence |
|---|---|---|
| **Vitest** | Comfortable | invoice-web-app unit + integration tests |
| **Supertest (integration)** | Comfortable | invoice-web-app backend; tests against live PostgreSQL |
| **React Testing Library** | Comfortable | invoice-web-app frontend |
| **Playwright** | Familiar | invoice-web-app E2E flows |
| **pytest** | Familiar | asteroids-bootdev (multiplayer, gamepad, control config tests) |
| **Mocking / test doubles** | Comfortable | Described in invoice-web-app README; significant time debugging mocking patterns |

---

## DevOps & Infrastructure

| Skill | Proficiency | Evidence |
|---|---|---|
| **Docker** | Comfortable | Multi-stage Dockerfiles across 3+ projects; client/server separation |
| **Docker Compose** | Comfortable | Dev, demo, and production compose files; Ollama sidecar |
| **Kubernetes** | Comfortable | Completed UoH "DevOps with Kubernetes" course; k8s-todo-source + k8s-todo-dep with staging/production namespaces |
| **ArgoCD (GitOps)** | Familiar | k8s-todo-dep; cluster pulls from deployment repo; staging vs. production promotion |
| **GitHub Actions (CI/CD)** | Comfortable | Multi-stage pipelines: lint, unit tests, integration tests, E2E, Docker Hub push, deploy |
| **Fly.io** | Comfortable | invoice-web-app backend + hackathon server deployed to Fly.io |
| **GitHub Pages** | Comfortable | invoice-web-app frontend; asteroids web build via pygbag |
| **Nginx** | Familiar | invoice-web-app reverse proxy config |
| **Linkerd (service mesh)** | Familiar | k8s-todo-source |
| **Apache Tika** | Familiar | hackathon; Docker sidecar for document parsing |

---

## Architecture & Patterns

| Pattern | Evidence |
|---|---|
| **Full-stack monorepo** | invoice-web-app (frontend + backend + docker in one repo) |
| **GitOps (split source/deploy repos)** | k8s-todo-source + k8s-todo-dep |
| **IoC / Dependency Injection** | invoice-web-app (InversifyJS); Controllers → Services → Repositories |
| **Repository pattern** | invoice-web-app backend |
| **Plugin / modular extractor architecture** | hackathon file type extractors |
| **Event-driven (message queue)** | k8s-todo-source (NATS) |
| **Microservices** | k8s-todo-source (frontend server, API, broadcaster) |
| **Optimistic UI updates** | k8s-todo-source (React Query) |
| **Spatial partitioning** | asteroids-bootdev (spatial grid for O(1) collision detection) |
| **Metadata-first / AI fallback** | hackathon (local metadata confidence scoring before LLM call) |

---

## Writing & Communication

- Published on **Medium**: articles on JavaScript, AI/ML and tacit knowledge, teaching comp sci
- Contract technical writing for **Hyperskill** (Java lessons on modules, Lombok, Gson, text blocks)
- Strong README/documentation discipline across all projects

---

## Notable Projects (by complexity)

1. **invoice-web-app** — Most substantial: 962 commits, full testing pyramid (unit → integration → E2E), GraphQL, IoC backend, Docker, CI/CD, deployed to Fly.io + GitHub Pages
2. **k8s-todo-source / k8s-todo-dep** — Production-grade Kubernetes deployment with GitOps, NATS, Linkerd, ArgoCD, 32 tagged releases
3. **hackathon** — Go CLI with AI backends (OpenAI, Ollama, remote server), plugin architecture, concurrent processing, Kubernetes + Fly.io deployment — won 4 stars at Boot.dev hackathon
4. **asteroids-bootdev** — Python/pygame game far beyond the course baseline: 2-player co-op, gamepad support, spatial grid, async game loop, web build, original music

---

## Areas to Develop (inferred from project notes)

- **OCR / document processing** — noted as roadmap in hackathon
- **Kubernetes production depth** — Kubernetes deployed but monitoring/scaling patterns still maturing
- **Performance optimization & observability** — noted as future work in invoice-web-app
- **Java depth** — familiar from contract writing but not from building production Java apps

---

*Sources: [github.com/djblackett](https://github.com/djblackett), pinned repos, and profile README*
