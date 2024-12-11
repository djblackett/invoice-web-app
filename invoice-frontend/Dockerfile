FROM node:lts-alpine3.20 AS build
RUN npm install -g npm@10.3.0

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
RUN npm ci --verbose

COPY . .
RUN rm -rf tests
ENV VITE_BACKEND_URL=backend:8000

RUN npm run build


FROM nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
