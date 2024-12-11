FROM node:18.17.0

WORKDIR /usr/src/app

ENV VITE_BACKEND_URL="http://localhost:8000" REACT_APP_ENV="development"

EXPOSE 5173

COPY package*.json /usr/src/app/
RUN npm ci --verbose && npx playwright install --with-deps

COPY . .




CMD ["npm", "run", "dev"]
