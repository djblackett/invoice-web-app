FROM node:22.11.0

WORKDIR /usr/src/app

COPY . .

RUN corepack enable && \
    yarn set version stable \
    && yarn install --frozen-lockfile



EXPOSE 5173

CMD ["yarn", "run", "dev"]
