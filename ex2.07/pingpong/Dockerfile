FROM node:21.7-slim as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

RUN npm install -g typescript

COPY . .

RUN tsc

FROM node:21.7-slim 

WORKDIR /usr/src/app

COPY --from=build /app/dist/ ./
COPY --from=build /app/package.json /app/package-lock.json ./

RUN npm install --omit=dev

RUN adduser --disabled-password --gecos '' exec
RUN chown -R exec:exec /usr/src/app
USER exec

ENV PORT=3001

EXPOSE ${PORT}

CMD ["node", "pingpong.js"]
