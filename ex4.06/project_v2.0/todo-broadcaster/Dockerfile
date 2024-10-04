FROM node:21-slim

WORKDIR /usr/src/app/

COPY package*.json ./

RUN npm install

COPY main.js .

USER root

CMD ["node", "main.js"]
