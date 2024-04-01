FROM node:21-slim

WORKDIR /usr/src/app/

COPY . .

ENV PORT=3000

RUN adduser server-exec

USER server-exec

CMD ["node", "main.js"]
