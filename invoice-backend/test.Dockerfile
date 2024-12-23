FROM node:20.9.0

WORKDIR /usr/src/app/

COPY --chown=node:node . .

RUN apt-get update -y && apt-get install -y openssl && apt-get install yarn -y
RUN yarn install --frozen-lockfile

EXPOSE 8000

CMD ["npm", "run", "start:test"]
