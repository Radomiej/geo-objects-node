# This file is a template, and might need editing before it works on your project.
FROM node:8.11-alpine

WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
ENV APP_PROFILE DEVELOPMENT
ENV APP_LOGGER_FORMAT dev
ENV PORT 1337

ENV MONGODB_HOST 172.17.0.1
ENV MONGODB_PORT 27017
ENV MONGODB_DATABASE "geo-objects-dev"

COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

# replace this with your application's default port
EXPOSE 1337:1337
CMD [ "npm", "start" ]

