FROM node:20.13.1-bookworm-slim AS build
ENV NODE_ENV=production


RUN apt-get update -y && apt-get install -y openssl && apt-get install yarn -y

WORKDIR /usr/src/app/

COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/

RUN yarn install --frozen-lockfile

COPY . /usr/src/app/
RUN rm -rf libs && rm -rf tests


# RUN npx prisma generate && DATABASE_URL=postgres://postgres:example@db:5432/db npx prisma migrate deploy
RUN npm run prisma-generate && npx --package typescript tsc -p tsconfig.build.json

# Stage 2: Production
FROM node:20.13.1-bookworm-slim AS production
RUN apt-get update -y && apt-get install -y openssl && apt-get install yarn -y

ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY --chown=node:node package.json yarn.lock ./

RUN yarn install --frozen-lockfile
COPY --chown=node:node --from=build /usr/src/app/dist/src ./dist/src
COPY --chown=node:node --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --chown=node:node --from=build /usr/src/app/node_modules/@prisma ./node_modules/@prisma
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma

EXPOSE 8000
USER node

CMD ["npm", "start"]
