FROM node:lts-alpine3.20

WORKDIR /usr/src/app/

COPY --chown=node:node . .
RUN npm ci
ENV DEBUG=playground:*
RUN npm run tsc

EXPOSE 8000
CMD npm start
