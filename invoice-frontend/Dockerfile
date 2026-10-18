FROM node:24.15.0-bookworm-slim AS build
WORKDIR /usr/src/app
RUN corepack enable && corepack prepare yarn@4.6.0 --activate
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable
COPY . .
ARG VITE_BACKEND_URL=http://localhost:8000
ARG VITE_DEMO_MODE=false
ARG VITE_DOMAIN=""
ARG VITE_CLIENT_ID=""
ARG VITE_AUDIENCE=""
ARG VITE_SCOPE=""
ARG VITE_REDIRECT_URI=""
RUN yarn build

FROM nginx:stable-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist /usr/share/nginx/html/invoice-web-app
EXPOSE 80
HEALTHCHECK --interval=10s --timeout=3s CMD wget -q -O /dev/null http://127.0.0.1/invoice-web-app/
