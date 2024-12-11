FROM node:20.13.1-bookworm-slim AS build
ENV NODE_ENV=production
RUN npm install -g npm@10.3.0

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /usr/src/app/

COPY package*.json /usr/src/app/

RUN npm install

COPY . /usr/src/app/


# RUN npx prisma generate && DATABASE_URL=postgres://postgres:example@db:5432/db npx prisma migrate deploy
RUN npm run prisma-generate && npx tsc -p tsconfig.build.json

# Stage 2: Production
FROM node:20.13.1-bookworm-slim AS production
RUN apt-get update -y && apt-get install -y openssl

ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY --chown=node:node package.json package-lock.json ./

RUN npm ci --verbose
COPY --chown=node:node --from=build /usr/src/app/dist/src ./dist/src
COPY --chown=node:node --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --chown=node:node --from=build /usr/src/app/node_modules/@prisma ./node_modules/@prisma
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma

EXPOSE 8000
USER node

CMD ["npm", "start"]
