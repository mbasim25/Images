# Base image
FROM node:14-alpine as base

WORKDIR /app

COPY package*.json ./

# install dependencies
RUN npm i 

COPY . .


# Final phase

FROM base as dev

RUN npm run migrate

CMD ["npm","run","dev"]