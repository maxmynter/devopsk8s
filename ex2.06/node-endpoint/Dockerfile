FROM node:21 AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN rm -rf node_modules

RUN npm ci --only=production

FROM node:21

ENV PORT=3000

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist .

RUN useradd exec

USER exec

EXPOSE 3000

CMD [ "node", "index.js" ]

