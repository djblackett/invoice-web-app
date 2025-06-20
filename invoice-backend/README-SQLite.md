# SQLite Support for Invoice Backend

The invoice backend now supports SQLite as an alternative to PostgreSQL, including an in-memory database option for development and testing.

## Configuration

### Environment Variables

Add these environment variables to your `.env` file or set them when running the application:

- `USE_SQLITE=true` - Enable SQLite instead of PostgreSQL
- `USE_IN_MEMORY=true` - Use SQLite in-memory database (requires `USE_SQLITE=true`)

### Database Options

1. **PostgreSQL (Default)**
   - Uses the existing PostgreSQL setup with Docker
   - Requires `docker-compose up` to start the database

2. **SQLite File Database**
   - Set `USE_SQLITE=true`
   - Creates a `dev.db` file in the project root
   - Persistent storage between application restarts

3. **SQLite In-Memory Database**
   - Set `USE_SQLITE=true` and `USE_IN_MEMORY=true`
   - Database exists only in memory
   - Data is lost when the application stops
   - Perfect for testing and development

## Usage

### NPM Scripts

The following npm scripts are available:

```bash
# Regular development with PostgreSQL (requires Docker)
npm run dev

# Development with SQLite file database
npm run dev:sqlite

# Development with SQLite in-memory database
npm run dev:memory
```

### Manual Configuration

You can also set environment variables manually:

```bash
# SQLite file database
USE_SQLITE=true npm run dev

# SQLite in-memory database
USE_SQLITE=true USE_IN_MEMORY=true npm run dev
```

## Benefits

### SQLite File Database
- No Docker dependency
- Faster startup time
- Simpler development setup
- Portable database file

### SQLite In-Memory Database
- Extremely fast operations
- No file system dependencies
- Perfect for unit tests
- Clean state on each restart
- Ideal for CI/CD environments

## Technical Details

### Database Connection

The application automatically selects the appropriate database connection class:
- `DatabaseConnection` for PostgreSQL
- `SQLiteDatabaseConnection` for SQLite

### Schema Management

- PostgreSQL uses Prisma migrations
- SQLite in-memory database creates schema programmatically on startup
- SQLite file database can use Prisma migrations or programmatic schema creation

### Logging

The application logs the database configuration on startup:
- Database URL
- Use SQLite flag
- Use In-Memory flag

## Limitations

### SQLite Limitations
- No concurrent write operations
- Limited to single-node deployments
- Some PostgreSQL-specific features may not be available

### In-Memory Database Limitations
- Data is lost on application restart
- Not suitable for production
- Limited to single process

## Migration from PostgreSQL

To migrate from PostgreSQL to SQLite:

1. Export your PostgreSQL data
2. Set `USE_SQLITE=true`
3. Start the application (schema will be created automatically)
4. Import your data using Prisma or custom scripts

## Testing

For testing, you can use:

- For Postgres: `npm run test:integration:postgres`
- For SQLite file: `npm run test:integration:sqlite`
- For SQLite in-memory: `npm run test:integration:memory`

This provides:
- Fast test execution with in-memory
- Isolated test environments
- No cleanup required between tests
