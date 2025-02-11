FROM node:20.9.0

WORKDIR /usr/src/app/
RUN apt-get update -y && apt-get install -y openssl && apt install yarn -y

COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/

# running with --frozen-lockfile broke when updating some dependencies
RUN yarn install

EXPOSE 8000

CMD ["npm", "run", "dev"]
