FROM node:lts-alpine3.20

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
RUN npm install --force --loglevel verbose
RUN npm install -g serve --force --loglevel verbose

COPY . .
RUN rm -rf tests
ENV REACT_APP_BACKEND_URL=http://proxy:8000

RUN npm run build && \
    rm -R /usr/src/app/src && \
    rm -R /usr/src/app/node_modules && \
    rm -R /usr/src/app/public && \
    rm package.json package-lock.json && \
    adduser -D -g '' user1 && \
    chown -R user1:user1 /usr/src/app


USER user1


CMD ["serve", "-s", "-l", "4000", "dist"]
