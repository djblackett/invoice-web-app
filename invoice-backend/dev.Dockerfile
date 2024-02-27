FROM node:20.11.1

WORKDIR /usr/src/app/

#COPY . .
COPY --chown=node:node . .
RUN npm ci
ENV DEBUG=playground:*
# add this line
RUN apt-get update -y && apt-get install -y openssl

EXPOSE 8000
CMD npm run dev