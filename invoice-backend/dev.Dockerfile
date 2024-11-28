FROM node:22.11.0

WORKDIR /usr/src/app/

COPY --chown=node:node . .

# ENV DEBUG=playground:*
# add this line
RUN apt-get update -y && apt-get install -y openssl
RUN npm install

EXPOSE 8000

CMD ["npm", "run", "dev"]
