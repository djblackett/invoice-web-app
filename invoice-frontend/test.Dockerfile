FROM node:22.11.0

WORKDIR /usr/src/app

RUN apt install yarn -y
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN yarn install --forzen-lockfile && npx playwright install --with-deps

ENV VITE_BACKEND_URL="http://localhost:8000"

EXPOSE 5173

COPY . .

CMD ["npm", "run", "dev"]
