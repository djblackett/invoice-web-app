FROM node:24.15.0-bookworm-slim
WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/* \
    && corepack enable && corepack prepare yarn@4.6.0 --activate
COPY package.json yarn.lock .yarnrc.yml ./
COPY prisma ./prisma
RUN yarn install --immutable && yarn prisma-generate
COPY tsconfig.json tsconfig.dev.json ./
COPY src ./src
COPY scripts/container-entrypoint.sh ./
EXPOSE 8000
ENTRYPOINT ["sh", "./container-entrypoint.sh"]
CMD ["npm", "run", "dev"]
