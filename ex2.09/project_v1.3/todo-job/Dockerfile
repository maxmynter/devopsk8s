FROM alpine:latest

RUN apk add --no-cache curl jq bash

WORKDIR /usr/src/script
COPY ./url-job.sh /usr/src/script/url-job.sh

RUN chmod +x /usr/src/script/url-job.sh

ENTRYPOINT [ "/usr/src/script/url-job.sh" ]

