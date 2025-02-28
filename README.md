# Fullstack Invoice Project

![License](https://img.shields.io/badge/license-MIT-blue.svg)
<!-- ![Build Status](https://github.com/djblackett/fullstack-invoice-project/actions/workflows/ci.yml/badge.svg) -->
![Node.js Version](https://img.shields.io/badge/node-v22.11.0-brightgreen.svg)

## Table of Contents

- [Fullstack Invoice Project](#fullstack-invoice-project)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Features](#features)
    - [Currently Implemented](#currently-implemented)
    - [Planned Features](#planned-features)
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
    <!-- - [Deploying with Docker](#deploying-with-docker) -->
  - [Diagrams](#diagrams)
  - [Contributing](#contributing)
  - [License](#license)
  - [Contact](#contact)

## Project Overview

The Fullstack Invoice Project is a robust invoicing application designed as a complete full-stack solution to streamline invoice management. Originally initiated as a **[FrontendMentor](<https://www.frontendmentor.io/challenges/invoice-app-i7KaLTQjl>)** challenge in May 2022 to enhance CSS skills, the project has evolved into a comprehensive application featuring both a dynamic frontend and a scalable backend. The backend leverages and expands on principles from the **[FullStackOpen](<http://fullstackopen.com>)** course, ensuring maintainability and a solid testing foundation.

More details on my motivation and approach to writing this app can be found [here](./project-description.md). The specific requirements of the Frontend Mentor challenge can be found [here](./README-frontend-mentor.md).

## Features

### Currently Implemented

- **Responsive Frontend** using ReactJS and Styled Components
- **State Management** with Redux Toolkit and React Context
- **GraphQL Integration** via Apollo Client
- **Backend Services** built with NodeJS, ExpressJS, and InversifyJS
- **Database Management** using Prisma ORM and PostgreSQL
- **Basic Unit Testing** for backend services

### Planned Features

- **Unit Testing** for all backend services
- **Frontend Refactor** to emphasize presentational vs. container components
- **Unit Testing** for frontend
- **Integration Testing**
- **End-to-End (E2E) Testing**
- **Enhanced Error Handling**
- **CI/CD Pipeline** implementation
- **Optimized Docker Configuration**

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
   cd frontend
   yarn install
   ```

3. **Install dependencies for the backend:**

   ```bash
   cd ../backend
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

   Create a `.env` file in both `frontend` and `backend` directories based on the provided `.env.example` files.

2. **Set up HTTPS certificates:**  
  Installation example for Ubuntu (x86)  
  Install mkcert:

   ```bash
   sudo apt-get update
   sudo apt-get install libnss3-tools
   wget -O mkcert https://github.com/FiloSottile/mkcert/releases/download/v1.4.3/mkcert-v1.4.3-linux-amd64
   chmod +x mkcert
   sudo mv mkcert /usr/local/bin/
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

   Open your browser and navigate to `https://localhost:5173/invoice-web-app/`.

## Testing

The project includes various levels of testing to ensure reliability and maintainability.

- **Backend Unit Tests:** Implemented using Vitest.
- **Frontend Unit Tests:** Implemented using React Testing Library.
- **Integration Tests:** Verify interactions between backend GraphQL resolvers and a real PostgresQL database.
- **End-to-End (E2E) Tests:** Implemented with PlayWright and tests normal user flows

To run backend tests:

```bash
cd backend
npm run test:unit
npm run test:integration
```

To run frontend tests:

```bash
cd frontend
npm run test:unit
npm run test:e2e
```

## Deployment

The project is configured for deployment using Fly.io. Continuous Integration and Continuous Deployment (CI/CD) pipelines are set up with GitHub Actions to automate the build, test, and deployment processes.

<!-- ### Deploying with Docker

1. **Build Docker images:**

   ```bash
   docker compose build
   ```

2. **Run containers:**

   ```bash
   docker-compose up -d
   ``` -->

## Diagrams

### GraphQL Schema

Queries:
![GraphQL Queries](./invoice-backend/graphql-diagrams/queries-visualization-invoicegraph.svg)

Mutations:
![GraphQL Mutations](./invoice-backend/graphql-diagrams/mutations-visualization-invoicegraph.svg)

Subscriptions:
![GraphQL Queries](./invoice-backend/graphql-diagrams/subscriptions-visualization-invoicegraph.svg)

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository.**
2. **Create a new branch:**

   ```bash
   git checkout -b feature/YourFeature
   ```

3. **Commit your changes:**

   ```bash
   git commit -m "Add YourFeature"
   ```

4. **Push to the branch:**

   ```bash
   git push origin feature/YourFeature
   ```

5. **Open a Pull Request.**

Please ensure your code follows the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

- **Author:** David Andrea
- **Email:** <your.email@example.com>
- **GitHub:** [djblackett](https://github.com/djblackett)
