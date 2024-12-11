FROM node:22.11.0
RUN npm install -g npm@10.3.0

WORKDIR /usr/src/app

COPY . .

RUN npm install
ENV VITE_BACKEND_URL="localhost:8000" REACT_APP_ENV="development"

EXPOSE 5173

CMD ["npm", "run", "dev"]
