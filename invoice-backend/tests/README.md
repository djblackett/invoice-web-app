# Testing Guide

This document explains how to run tests with different database backends.

## Overview

The integration tests have been updated to support both SQLite and PostgreSQL databases. The test setup automatically detects the database type from the `DATABASE_URL` environment variable and configures the appropriate test isolation strategy.

## Database Support

### SQLite

- Creates temporary database files for each test
- Automatically cleans up test databases after each test
- Faster test execution
- No external dependencies

### PostgreSQL

- Creates unique schemas for each test
- Automatically drops schemas after each test
- More realistic production environment
- Requires PostgreSQL server

## Running Tests

### Unit Tests

```bash
# Run unit tests (database-agnostic)
npm run test:unit
```

### Integration Tests

#### With PostgreSQL (default)

```bash
# Run integration tests with PostgreSQL
npm run test:integration
# or explicitly
npm run test:integration:postgres
```

#### With SQLite

```bash
# Run integration tests with SQLite
npm run test:integration:sqlite
```

### Coverage Reports

#### With PostgreSQL

```bash
npm run coverage
```

#### With SQLite

```bash
npm run coverage:sqlite
```

## Test Database Setup

The test setup uses a unified database configuration system that:

1. **Detects database type** from the `DATABASE_URL` environment variable
2. **Creates isolated test environments**:
   - SQLite: Creates temporary `.db` files
   - PostgreSQL: Creates unique schemas
3. **Handles cleanup** automatically after each test
4. **Binds the test database** to the dependency injection container

## Environment Variables

### For PostgreSQL Tests

```bash
DATABASE_URL=postgres://postgres:example@localhost:5432/db-test
```

### For SQLite Tests

```bash
DATABASE_URL=sqlite:./prisma/test.db
```

## Test Structure

Each integration test follows this pattern:

```typescript
describe("Test Suite", () => {
  let testDbConfig: TestDatabaseConfig;
  let app: unknown;

  beforeEach(async () => {
    // Setup test database (auto-detects SQLite vs PostgreSQL)
    testDbConfig = await setupTestDatabase();
    
    // Bind to DI container
    const child = container.createChild();
    child.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(testDbConfig.prisma);
    
    // Create server
    [app] = await createServer();
  });

  afterEach(async () => {
    // Cleanup test database
    await testDbConfig.cleanup();
  });

  // ... tests
});
```

## Benefits

1. **Database Flexibility**: Tests can run with either SQLite or PostgreSQL
2. **Faster Development**: Use SQLite for quick local testing
3. **Production Parity**: Use PostgreSQL for more realistic testing
4. **Isolation**: Each test gets a fresh database
5. **Automatic Cleanup**: No manual database cleanup required

## Troubleshooting

### SQLite Issues

- Ensure the `prisma` directory exists
- Check file permissions for database creation
- Verify SQLite is available on the system

### PostgreSQL Issues

- Ensure PostgreSQL server is running
- Verify connection credentials
- Check that the test database exists
- Ensure the user has schema creation permissions

### Schema Conflicts

If you see Prisma schema conflicts, ensure you're using the correct schema file for your database type:

- SQLite: `prisma/schema.prisma` (current default)
- PostgreSQL: `prisma/schema.postgres.prisma`
