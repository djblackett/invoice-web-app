FROM node:22.14.0-alpine3.21@sha256:9bef0ef1e268f60627da9ba7d7605e8831d5b56ad07487d24d1aa386336d1944

WORKDIR /usr/src/app/
RUN apt-get update -y && apt-get install -y openssl
RUN corepack enable && yarn set version stable

COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/

RUN yarn install

EXPOSE 8000

CMD ["yarn", "dev"]
