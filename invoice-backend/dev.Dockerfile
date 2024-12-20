FROM node:22.11.0

WORKDIR /usr/src/app/
RUN apt-get update -y && apt-get install -y openssl && apt install yarn -y

COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/

RUN yarn install --frozen-lockfile

EXPOSE 8000

CMD ["npm", "run", "dev"]
