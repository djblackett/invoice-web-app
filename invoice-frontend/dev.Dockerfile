FROM node:18.17.0

WORKDIR /usr/src/app

COPY . .

RUN npm install
ENV REACT_APP_BACKEND_URL="http://localhost:8000" REACT_APP_ENV="development"

EXPOSE 5173

CMD ["npm", "run", "dev"]
