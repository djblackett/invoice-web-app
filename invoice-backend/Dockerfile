FROM node:24.15.0-bookworm-slim AS dependencies
WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/* \
    && corepack enable && corepack prepare yarn@4.6.0 --activate
COPY package.json yarn.lock .yarnrc.yml ./
COPY prisma ./prisma
RUN yarn install --immutable

FROM dependencies AS build
COPY tsconfig.json tsconfig.build.json eslint.config.mjs ./
COPY src ./src
RUN yarn prisma-generate && yarn build

FROM node:24.15.0-bookworm-slim AS runtime
WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production DEMO_MODE=false PORT=8000
COPY --from=build --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=node:node /usr/src/app/dist ./dist
COPY --from=build --chown=node:node /usr/src/app/prisma ./prisma
COPY --chown=node:node scripts/migrate.cjs ./scripts/migrate.cjs
COPY --chown=node:node package.json scripts/container-entrypoint.sh ./
USER node
EXPOSE 8000
HEALTHCHECK --interval=10s --timeout=3s --start-period=30s CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||8000)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
ENTRYPOINT ["sh", "./container-entrypoint.sh"]
CMD ["node", "dist/src/index.js"]
