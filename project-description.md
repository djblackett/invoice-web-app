# Project Motivation And Description

## Origins

I began this project in May 2022 as a frontend web development initiative inspired by a [Frontend Mentor](https://www.frontendmentor.io/home) design. With access to Figma files, I initially built the interface using React, Styled Components, and Redux—with data stored in local storage. Although remnants of my early, less-refined code remain, I have since refactored much of the logic and integrated React Hook Form for improved validation and error handling. After completing the FullStackOpen course, I revisited the frontend to integrate a real backend.

## Evolution of Frontend

While the UI has remained largely consistent, the underlying architecture has evolved considerably. Beginning in 2023, I transitioned to GraphQL with Apollo Client, eliminating Redux for invoice and user management. In addition to queries and mutations, a web socket subscription now enables real-time updates of new invoices for admin users.

For authentication, I leveraged Auth0’s cloud services. Users can create an account with email and password or log in via Google, Microsoft, or Apple. Social logins automatically generate accounts if needed, and users are assigned a default USER role—allowing them to manage only their own invoices—while manually created admin accounts can view, edit, and delete any invoice. The backend API manages user roles accordingly.

## Evolution of Backend

In 2023, following my FullStackOpen course, I expanded the project by adding a backend server, PostgreSQL database, and CI/CD pipeline. During testing, I discovered that the initial backend components were too tightly coupled and difficult to test, prompting a major refactor inspired by [Kahlil Stemmler’s](https://khalilstemmler.com/) work and his course on software testing and architecture.

The refactored backend maintains a three-tiered architecture and now implements the repository pattern. By using TypeScript interfaces and inversion of control (via InversifyJS), the business logic remains agnostic of the repository layer. The backend runs on an ExpressJS server with Apollo GraphQL middleware, where the GraphQL context handles authentication and passes user data to resolvers. These resolvers delegate operations to service classes, while repository classes manage database interactions through Prisma connected to a PostgreSQL database.

These architectural improvements have greatly simplified testing. The backend now includes lightweight unit tests and integration tests using Supertest and a live PostgreSQL database—each test creating its own schema via a child container in Inversify. Originally, machine-to-machine authentication was used for testing; however, to conserve M2M authorizations, the test and CI environments now bypass Auth0.

## Testing

On the frontend, unit tests are implemented with React Testing Library and Vitest, while end-to-end testing is handled by Playwright. The e2e tests, which authenticate via the web interface using environment-injected credentials, were written using fixtures and the Page Object Model—a POM implementation I plan to refine further.

## Demo Mode

To better demonstrate the app’s features, I developed a demo mode that can be run locally with minimal configuration. The demo bypasses the need for extensive environment variables, an Auth0 account, and self-signed HTTPS certificates by allowing the frontend to toggle between USER and ADMIN roles. Detailed instructions are provided in the README.

## CI/CD

Deployment is streamlined: the statically generated React [frontend](https://djblackett.github.io/invoice-web-app/) is hosted on GitHub Pages, and the backend API along with the PostgreSQL database are deployed in separate containers on [Fly.io](http://fly.io/). My CI workflow checks out the code, runs tests (excluding e2e tests initially), and, upon success, builds Docker images for both frontend and backend that are pushed to DockerHub. The continuous deployment pipelines are configured to trigger only when relevant changes occur, and various artifacts are collected to facilitate debugging.
