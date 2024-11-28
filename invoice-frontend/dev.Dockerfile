FROM node:22.11.0

WORKDIR /usr/src/app

COPY . .

RUN npm install
ENV REACT_APP_BACKEND_URL="http://localhost:8080" REACT_APP_ENV="development"

EXPOSE 5173

CMD ["npm", "run", "dev"]
