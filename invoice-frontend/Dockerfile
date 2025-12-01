# Stage 1: Build
FROM node:20.13.1-bookworm-slim AS build

ENV NODE_ENV=production

RUN corepack enable && \
    yarn set version stable

WORKDIR /usr/src/app

# Copy dependency files first for better caching
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source files
COPY . .

# Remove test files to reduce build context
RUN rm -rf tests

# Build the application
RUN yarn run build

# Stage 2: Production
FROM nginx:1.27.3-alpine-slim

# Copy built static files
RUN mkdir -p /usr/share/nginx/html/invoice-web-app
COPY --from=build /usr/src/app/dist /usr/share/nginx/html/invoice-web-app

# Copy nginx configuration if exists
# COPY nginx.conf /etc/nginx/nginx.conf

# Run as nginx user (already default in nginx image)
# Expose port 80 for HTTP traffic
EXPOSE 80
