FROM node:22.11.0

WORKDIR /usr/src/app/

COPY . .

RUN npm install -g npm@10.3.0
RUN apt-get update -y && apt-get install -y openssl
RUN npm install

EXPOSE 8000


CMD ["npm", "run", "dev"]
