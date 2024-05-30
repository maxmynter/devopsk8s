FROM alpine:latest

RUN apk add --no-cache curl jq bash

WORKDIR /usr/src/script
COPY ./backup.sh /usr/src/script/backup.sh

RUN chmod +x /usr/src/script/backup.sh

ENTRYPOINT [ "/usr/src/script/backup.sh" ]

