FROM node:lts-alpine3.20

WORKDIR /usr/src/app/

COPY package*.json /usr/src/app/

RUN npm install --only=production

COPY --chown=node:node . /usr/src/app/

RUN rm -rf tests && rm -rf mocks && rm -rf src/mocks && rm -rf src/generated
RUN npx prisma generate && DATABASE_URL=postgres://postgres:example@db:5432/db npx prisma migrate deploy
RUN npx tsc -p tsconfig.build.json

EXPOSE 8000
CMD npm start
