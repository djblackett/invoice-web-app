FROM node:20.17.0

WORKDIR /usr/src/app/

COPY --chown=node:node . .
RUN npm ci
ENV DEBUG=playground:*

EXPOSE 8000
CMD npm run dev
