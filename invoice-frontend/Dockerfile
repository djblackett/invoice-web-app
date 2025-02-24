FROM node:20.13.1-bookworm-slim AS build

RUN corepack enable && \
    yarn set version stable

WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
COPY .yarnrc.yml /usr/src/app/
COPY .yarn /usr/src/app/.yarn
RUN yarn install --frozen-lockfile

COPY . .
RUN rm -rf tests

RUN yarn run build

FROM nginx:1.27.3-alpine-slim

RUN mkdir /usr/share/nginx/html/invoice-web-app
COPY --from=build /usr/src/app/dist /usr/share/nginx/html/invoice-web-app
