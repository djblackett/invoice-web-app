FROM node:22.11.0

WORKDIR /usr/src/app

RUN corepack enable && \
    corepack prepare yarn@1.22.22 --activate \
    && yarn install --frozen-lockfile \
    && npx playwright install --with-deps

COPY . .

ENV VITE_BACKEND_URL="https://backend-dev:8000"
EXPOSE 5173

CMD ["npm", "run", "dev"]
