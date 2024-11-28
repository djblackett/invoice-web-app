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
