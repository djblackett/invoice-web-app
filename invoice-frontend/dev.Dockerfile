FROM node:22.11.0

RUN corepack enable && \
    corepack prepare yarn@1.22.22 --activate

WORKDIR /usr/src/app

# Install Playwright and its dependencies
RUN yarn add --dev @playwright/test
RUN npx playwright install --with-deps

COPY . .

RUN yarn install
ENV VITE_BACKEND_URL="https://backend-dev:8000"

EXPOSE 5173

CMD ["npm", "run", "dev"]
