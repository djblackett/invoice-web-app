FROM node:lts-alpine3.20 AS build

RUN corepack enable && \
    corepack prepare yarn@1.22.22 --activate

WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN yarn install --frozen-lockfile

COPY . .
RUN rm -rf tests

RUN npm run build

FROM nginx:1.27.3-alpine-slim

RUN mkdir /usr/share/nginx/html/invoice-web-app
COPY --from=build /usr/src/app/dist /usr/share/nginx/html/invoice-web-app
