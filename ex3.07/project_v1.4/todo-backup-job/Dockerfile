FROM postgres:16

RUN apt-get update && apt-get install -y curl jq bash && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY ./backup.sh /usr/src/app/backup.sh

RUN chmod +x /usr/src/app/backup.sh

ENTRYPOINT [ "/usr/src/app/backup.sh" ]

