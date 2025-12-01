# Stage 1: Build
FROM node:20.13.1-bookworm-slim AS build

RUN apt-get update -y && \
    apt-get install -y openssl && \
    corepack enable && \
    yarn set version stable

WORKDIR /usr/src/app/

# Copy dependency files first for better caching
COPY package.json yarn.lock .yarnrc.yml /usr/src/app/
COPY .yarn /usr/src/app/.yarn

# Install all dependencies (including devDependencies for build)
RUN yarn install --frozen-lockfile

# Copy source files
COPY . /usr/src/app/

# Remove unnecessary files to reduce image size
RUN rm -rf libs && rm -rf tests

# Generate Prisma client and build TypeScript
RUN yarn prisma-generate
RUN yarn tsc -p tsconfig.build.json

# Stage 2: Production
FROM node:20.13.1-bookworm-slim AS production

RUN apt-get update -y && \
    apt-get install -y openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    corepack enable && \
    yarn set version stable

ENV NODE_ENV=production
WORKDIR /usr/src/app

# Copy dependency files
COPY --chown=node:node package.json yarn.lock .yarnrc.yml ./
COPY --chown=node:node .yarn ./.yarn

# Install only production dependencies
RUN yarn install --frozen-lockfile --production

# Copy built artifacts from build stage
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --chown=node:node --from=build /usr/src/app/node_modules/@prisma ./node_modules/@prisma
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma

EXPOSE 8000

# Run as non-root user for security
USER node

CMD ["yarn", "start"]
