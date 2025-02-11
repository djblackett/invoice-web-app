# Fullstack Invoice Project

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Build Status](https://github.com/yourusername/fullstack-invoice-project/actions/workflows/ci.yml/badge.svg)
![Node.js Version](https://img.shields.io/badge/node-v16.13.0-brightgreen.svg)

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
    - [Deploying with Docker](#deploying-with-docker)
    - [Deploying with Kubernetes](#deploying-with-kubernetes)
  - [Contributing](#contributing)
  - [License](#license)
  - [Contact](#contact)

## Project Overview

I began this project in May 2022 as a **FrontendMentor** challenge to sharpen my CSS skills. Impressed with the initial frontend implementation, I expanded the project to include backend functionality, leveraging concepts from the **FullStackOpen** course. The goal is to develop a robust, full-stack invoicing application with comprehensive testing and deployment pipelines.

## Features

### Currently Implemented

- **Responsive Frontend** using ReactJS and Styled Components
- **State Management** with Redux Toolkit
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
- **Kubernetes Configuration** (`config.yaml`)

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
- **Kubernetes** Configuration

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v16.13.0 or higher)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Kubernetes](https://kubernetes.io/docs/setup/) (optional, for deployment)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/fullstack-invoice-project.git
   cd fullstack-invoice-project
   ```

2. **Install dependencies for the frontend:**

   ```bash
   cd frontend
   npm install
   ```

3. **Install dependencies for the backend:**

   ```bash
   cd ../backend
   npm install
   ```

4. **Set up environment variables:**

   Create a `.env` file in both `frontend` and `backend` directories based on the provided `.env.example` files.

### Running the Application

1. **Start the application using Docker Compose:**

   ```bash
   docker-compose up --build
   ```

2. **Access the application:**

   Open your browser and navigate to `http://localhost:3000`.

## Testing

The project includes various levels of testing to ensure reliability and maintainability.

- **Backend Unit Tests:** Implemented using Vitest.
- **Frontend Unit Tests:** To be implemented using React Testing Library.
- **Integration Tests:** Planned to verify interactions between frontend and backend.
- **End-to-End (E2E) Tests:** Planned using tools like Cypress or Selenium.

To run backend tests:

```bash
cd backend
npm run test
```

## Deployment

The project is configured for deployment using Docker and Kubernetes. Continuous Integration and Continuous Deployment (CI/CD) pipelines are set up with GitHub Actions to automate the build, test, and deployment processes.

### Deploying with Docker

1. **Build Docker images:**

   ```bash
   docker-compose build
   ```

2. **Run containers:**

   ```bash
   docker-compose up -d
   ```

### Deploying with Kubernetes

1. **Apply Kubernetes configurations:**

   ```bash
   kubectl apply -f kubernetes/config.yaml
   ```

2. **Verify deployment:**

   ```bash
   kubectl get pods
   ```

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

- **Author:** Your Name
- **Email:** your.email@example.com
- **GitHub:** [yourusername](https://github.com/yourusername)
