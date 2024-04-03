
FROM node:21.7-slim as build

WORKDIR /app

COPY . .

RUN npm install

RUN npm install -g typescript

RUN tsc

FROM node:21.7-slim 

WORKDIR /usr/src/app

RUN mkdir files

RUN echo "0" > files/pongs.txt

COPY --from=build /app/dist/ ./

RUN adduser --disabled-password --gecos '' exec
RUN chown -R exec:exec /usr/src/app
USER exec

ENV PORT=3001

EXPOSE ${PORT}

CMD ["node", "pingpong.js"]
