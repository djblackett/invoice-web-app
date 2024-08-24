FROM node:20.10.0

WORKDIR /usr/src/app

COPY . .

RUN npm install
ENV REACT_APP_BACKEND_URL="http://localhost:8080" REACT_APP_ENV="development"

EXPOSE 3000

CMD ["npm", "run", "dev"]
