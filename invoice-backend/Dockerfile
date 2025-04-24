FROM node:20-bookworm-slim AS build
ENV NODE_ENV=production

RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends openssl && \
    corepack enable && \
    yarn set version stable && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app/

COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
COPY .yarnrc.yml /usr/src/app/
COPY .yarn /usr/src/app/.yarn

RUN yarn install --frozen-lockfile

COPY . /usr/src/app/
RUN rm -rf libs && rm -rf tests


RUN yarn prisma-generate 
# RUN yarn prisma-push
RUN yarn build
CMD ["yarn", "start"]
# # Stage 2: Production
# FROM node:20.13.1-bookworm-slim AS production

# RUN apt-get update -y && \
#     apt-get install -y openssl && \
#     corepack enable && \
#     yarn set version stable

# ENV NODE_ENV=production
# WORKDIR /usr/src/app

# COPY --chown=node:node package.json yarn.lock ./
# COPY --chown=node:node .yarn .yarnrc.yml ./

# RUN yarn install --frozen-lockfile
# COPY --from=build /usr/src/app/dist ./dist
# COPY --chown=node:node --from=build /usr/src/app/dist/src ./dist/src
# COPY --chown=node:node --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma
# COPY --chown=node:node --from=build /usr/src/app/node_modules/@prisma ./node_modules/@prisma
# COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma
# COPY --chown=node:node --from=build /usr/src/app/tsconfig* ./dist

# EXPOSE 8000
# USER node

# CMD ["yarn", "start"]
