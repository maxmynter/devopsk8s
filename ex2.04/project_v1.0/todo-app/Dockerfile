FROM node:21-slim

WORKDIR /usr/src/app/

COPY . .

ENV TODOS_BASEURL=http://localhost:3005
ENV PORT=4000

RUN useradd -m server-exec -s /bin/sh

RUN mkdir -p cache && chown -R server-exec:server-exec cache

USER server-exec

CMD ["node", "main.js"]
