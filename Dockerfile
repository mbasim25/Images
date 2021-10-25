# Base image
FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

# install dependencies
RUN npm i 

COPY . .

RUN npm run migrate

CMD ["npm","run","dev"]