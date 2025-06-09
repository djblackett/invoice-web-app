# 🧾 Invoice Backend

This is the backend service for the Invoice application. It provides a GraphQL API, revision history tracking, and secure user authentication.

---

## 🚀 Quick Start

### 🔧 Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18 (latest LTS preferred)
- [Yarn](https://yarnpkg.com/) ≥ 4
- [SQLite3](https://www.sqlite.org/index.html) (for local dev)

### 🛠️ Run the Setup Script

```bash
./setup-dev.sh
```

This will:

- Install dependencies
- Switch Prisma to SQLite mode
- Push the schema to the DB
- Generate the Prisma client
- Seed demo data (including invoices and revision history)
- Start the development server

---

## 🔗 API Access

GraphQL API available at:

👉 <http://localhost:8000/graphql>

You can use [Apollo Sandbox](https://studio.apollographql.com/), [Altair](https://altairgraphql.dev/), or your favorite GraphQL client.

📂 Sample queries are available in the `.graphql-samples/` directory  
Copy-paste them directly into your GraphQL Explorer for quick testing.

---

## 📬 Postman Collection

Prefer REST-like tools? Import the following files into [Postman](https://www.postman.com/):

```
invoice-api.postman_collection.json
invoice-api.postman_environment.json
```

Then, **select** the `Invoice API Environment` from the dropdown in the top right of the Postman UI.  
All necessary headers and variables (like `Authorization`) are preconfigured.

---

## 👨‍💻 Author

David Andrea
