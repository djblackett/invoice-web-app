FROM node:16.20.2

WORKDIR /usr/src/app/

#COPY . .
COPY --chown=node:node . .
RUN npm ci
ENV DEBUG=playground:*

EXPOSE 8000
CMD npm run dev