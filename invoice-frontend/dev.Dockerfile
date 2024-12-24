FROM node:22.11.0

RUN corepack enable && \
    corepack prepare yarn@1.22.22 --activate

WORKDIR /usr/src/app

COPY . .

RUN yarn install
ENV VITE_BACKEND_URL="https://localhost:8000"

EXPOSE 5173

CMD ["npm", "run", "dev"]
