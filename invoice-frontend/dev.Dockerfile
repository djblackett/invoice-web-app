FROM node:24.15.0-bookworm-slim
WORKDIR /usr/src/app
RUN corepack enable && corepack prepare yarn@4.6.0 --activate
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]
