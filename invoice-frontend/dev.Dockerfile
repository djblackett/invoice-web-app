FROM node:22.11.0

WORKDIR /usr/src/app

RUN corepack enable && \
    corepack prepare yarn@1.22.22 --activate \
    && yarn install --frozen-lockfile

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
