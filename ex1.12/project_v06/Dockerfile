FROM node:21-slim

WORKDIR /usr/src/app/

COPY . .

ENV PORT=3000

RUN adduser server-exec

RUN mkdir -p cache && chown -R server-exec:server-exec cache

USER server-exec

CMD ["node", "main.js"]
