FROM node:22.14.0-alpine3.21@sha256:9bef0ef1e268f60627da9ba7d7605e8831d5b56ad07487d24d1aa386336d1944

WORKDIR /usr/src/app/
RUN  apk add openssl
RUN corepack enable && yarn set version stable

COPY package.json yarn.lock .yarnrc.yml .pnp.* .yarn/ /usr/src/app/
RUN yarn install
COPY . /usr/src/app/

RUN yarn prisma-generate


EXPOSE 8000

CMD ["yarn", "dev"]
