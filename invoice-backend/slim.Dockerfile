FROM node:lts-alpine3.20 AS build
ENV NODE_ENV=production
RUN npm install -g npm@10.3.0

WORKDIR /usr/src/app/

COPY package*.json /usr/src/app/

RUN npm install && npm i -g @vercel/ncc

COPY . /usr/src/app/

RUN npm run prisma-generate && ncc build ./src/index.ts -o dist -t


# Stage 2: Production
FROM node:lts-alpine3.20 AS production

ENV NODE_ENV=production
WORKDIR /usr/src/app


COPY --from=build /usr/src/app/dist ./

RUN rm -f ./client/libquery_engine-debian-openssl-1.1.x.so.node ./client/libquery_engine-debian-openssl-3.0.x.so.node \
    && mv /usr/src/app/client/libquery_engine-linux-musl-openssl-3.0.x.so.node /usr/src/app/ && rm -rf ./client

EXPOSE 8000

CMD ["node", "./index.js"]
