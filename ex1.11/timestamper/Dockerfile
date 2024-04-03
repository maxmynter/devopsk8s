FROM ubuntu:latest as build

RUN apt-get update && apt-get install -y gcc

WORKDIR /build

COPY timestamp.c .

RUN gcc -static timestamp.c -o timestamp

FROM alpine

WORKDIR /usr/src/app

RUN mkdir -p /usr/src/app/files

COPY --from=build /build/timestamp /usr/src/app/timestamp

RUN adduser -D appuser

RUN chown -R appuser /usr/src/app/files

USER appuser

CMD ["/usr/src/app/timestamp"]
