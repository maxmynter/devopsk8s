#!/bin/bash

DATA_DIR="/var/lib/postgresql/data/pgdata"
mkdir -p "$DATA_DIR"

chown -R postgres:postgres "$DATA_DIR"

export PGDATA="$DATA_DIR"

docker-entrypoint.sh postgres &

until pg_isready -U $POSTGRES_USER -d $POSTGRES_DB; do 
	echo 'Waiting for db ready ...'
	sleep 1
done

node migrate.js


echo "Migrations finished"
