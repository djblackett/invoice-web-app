FROM node:lts-alpine3.20 AS build

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
RUN npm ci --verbose

COPY . .
RUN rm -rf tests
ENV REACT_APP_BACKEND_URL=http://proxy:8000

RUN npm run build


FROM nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
