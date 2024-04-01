
FROM node:21.7-slim as build

WORKDIR /app

COPY . .

RUN npm install

RUN npm install -g typescript

RUN tsc

FROM node:21.7-slim 

WORKDIR /app

COPY --from=build /app/dist/ ./

RUN adduser --disabled-password --gecos '' exec
USER exec

ENV PORT=3001

EXPOSE ${PORT}

CMD ["node", "pingpong.js"]
