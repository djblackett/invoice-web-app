# Fullstack Invoice Project

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Build Status](https://github.com/djblackett/invoice-web-app/actions/workflows/frontend-deploy.yml/badge.svg)
![Node.js Version](https://img.shields.io/badge/node-v22.11.0-brightgreen.svg)

![Frontend screenshot showing the invoice application interface](./frontend-screenshot.png)

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
  - [License](#license)
  - [Contact](#contact)

## Project Overview

The Fullstack Invoice Project is a robust invoicing application designed as a complete full-stack solution to streamline invoice management. It implements all CRUD operations and user authentication and management.  

Originally initiated as a **[FrontendMentor](<https://www.frontendmentor.io/challenges/invoice-app-i7KaLTQjl>)** challenge in May 2022 to enhance CSS skills, the project has evolved into a comprehensive application featuring both a dynamic frontend and a scalable backend. The backend leverages and expands on principles from the **[FullStackOpen](<http://fullstackopen.com>)** course, ensuring maintainability and a solid testing foundation.

More details on my motivation and approach to writing this app can be found [here](./project-description.md). The specific requirements of the Frontend Mentor challenge can be found [here](./README-frontend-mentor.md).

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
- **End-to-End (E2E) Testing** using PlayWright
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

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/)

### Installation

#### Demo and Development Mode Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/djblackett/invoice-web-app.git
   cd invoice-web-app
   ```

2. **Install dependencies for the frontend:**

   ```bash
   cd invoice-frontend
   yarn install
   ```

3. **Install dependencies for the backend:**

   ```bash
   cd invoice-backend  # from project root
   yarn install
   ```

#### Demo Instructions

1. **Run demo docker compose file**

   ```bash
   docker compose -f docker-compose.demo.yml up
   ```

2. **Seed demo data**

   ```bash
   npx prisma db seed
   ```

3. **Access the application**  
 Open your browser and navigate to <https://localhost:5173/invoice-web-app/>.

#### Development Instructions

1. **Set up environment variables:**

   Create a `.env` file in both `invoice-frontend` and `invoice-backend` directories based on the provided `.env.example` files.

2. **Set up HTTPS certificates:**  
  mkcert can generate https certificates. MacOS and Linux can install mkcert with [Homebrew](https://formulae.brew.sh/formula/mkcert). Windows users can install it with [chocolatey](https://community.chocolatey.org/packages/mkcert) or with Homebrew if using WSL.

After installation, run:

   ```bash
   mkcert -install
   ```

   Create certs with mkcert

   ```bash
   cd invoice-backend  
   mkdir certs  
   cd certs
   mkcert localhost
   ```

   Copy certs to frontend directory

   ```bash
   cp -r invoice-backend/certs invoice-frontend/certs
   ```

### Running the Application

1. **Start the application using Docker Compose:**  
   Shut down demo mode if currently running: `docker compose -f docker-compose.demo.yml down`, then run:

   ```bash
   docker compose -f docker-compose.dev.yml up
   ```

2. **Access the application:**

   Open your browser and navigate to <https://localhost:5173/invoice-web-app/>.

## Testing

The project includes various levels of testing to ensure reliability and maintainability.

- **Backend Unit Tests:** Implemented using Vitest.
- **Frontend Unit Tests:** Implemented using React Testing Library.
- **Integration Tests:** Verify interactions between backend GraphQL resolvers and a real PostgreSQL database.
- **End-to-End (E2E) Tests:** Implemented with PlayWright and tests normal user flows

To run backend tests:

```bash
cd invoice-backend
yarn test:unit
yarn test:integration
```

To run frontend tests:

```bash
cd invoice-frontend
yarn test:unit
```

E2e tests:  
First, run `docker compose -f docker-compose.dev.yml up` to start all microservices

If you want the e2e tests to be wholly separate from the dev env, switch the backend start commands in `docker-compose.dev.yml`. (switch which one is commented out)  

Then:

```bash
cd invoice-frontend
yarn test:e2e
```

## Deployment

The project is configured for deployment using Fly.io and GitHub Pages. Continuous Integration and Continuous Deployment (CI/CD) pipelines are set up with GitHub Actions to automate the build, test, and deployment processes. Upon successful completion of tests, the frontend is built and published to GitHub Pages and the backend to Fly.io.

For both the frontend and backend, when changes are made to the dev branch via push or merge request, a CI pipeline runs and checks the code with a workflow that runs the frontend unit tests and the backend unit and integration tests. The backend integration tests are tested against an ephemeral PostgreSQL database spun up on the GitHub action workspace.

If tests pass, the code is merged into dev and docker containers are built and pushed to Docker Hub. These docker images are not currently used, however, because they are intended for use in Kubernetes deployments, which have not been built yet.

Pull requests to main run the same tests plus the end to end tests. The frontend code is built and then run in Vite preview mode so that the e2e tests use the production version of the app. The backend server is also run, along with an ephemeral PostgreSQL, such that the entire stack of the app is traversed when tested.

## Diagrams

### Architecture Flowchart

This diagram provides a high-level overview of the application's flow. It begins with the user interacting with the frontend, which is built with React (TypeScript). The frontend communicates with the backend via a GraphQL API (using Apollo Client). The backend, implemented with Node.js and Express, processes requests and manages data through Prisma ORM, which connects to a PostgreSQL database. Additionally, a CI/CD pipeline using GitHub Actions automates testing and deployment, with the frontend being deployed to GitHub Pages and the backend to Fly.io.

![Application Architecture Diagram](./diagrams/architecture.svg)

### IoC Backend Architecture

This diagram illustrates the dependency injection flow managed by InversifyJS in our backend. Incoming requests are processed by the Controllers/Resolvers, which delegate business logic to Services that, in turn, interact with Repositories for data operations. The IoC container (InversifyJS) centrally manages and injects these dependencies, promoting a modular, testable, and maintainable architecture.

![Inversion of Control backend architecture](./diagrams/ioc-backend.svg)

### GraphQL Schema

GraphQL schema [diagrams](./diagrams.md) for queries, mutations, and subscriptions

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

- **Author:** David Andrea
- **Email:** <your.email@example.com>
- **GitHub:** [djblackett](https://github.com/djblackett)
