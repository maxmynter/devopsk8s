FROM node:21-slim

WORKDIR /usr/src/app/

COPY . .

ENV TODOS_BASEURL=http://localhost:3005
ENV PORT=4000

RUN mkdir -p /usr/src/app/cache && chmod -R  777 /usr/src/app/cache

USER root

CMD ["node", "main.js"]
