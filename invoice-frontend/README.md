# Invoice App

## How to run

### Run frontend in development mode

`npm run dev`

### Run tests

#### Unit tests

`npm run test:unit`

#### End-to-end tests

You will need to start the backend before running the e2e tests
`npm run test:e2e`

### Startup backend

Use Docker Compose to start the appropriate backend.
First `cd ..` to go to root directory

### Production env

`docker compose up`

### Development environment

`docker compose -f docker-compose.dev.yml up`

### Test env

`docker compose -f docker-compose-test.yml up`

## Frontend quality gate

After installing dependencies with the pinned Yarn version (`corepack yarn install --immutable`), run from this directory:

```bash
npm run check
```

This runs both strict TypeScript projects, ESLint, the existing Vitest unit/integration suite in parallel, and the Vite production build. `npm test` runs tests once; `npm run test:unit` retains watch mode. Tests use jsdom and mocks and do not require a backend or Auth0 credentials.

For a serial diagnostic run:

```bash
npm test -- --no-file-parallelism
```

See [Slice 5A verification](../docs/audit/slice-5a-frontend-stabilization.md) for baseline errors, repeated reliability checks, existing skips, and deferred browser E2E work.
