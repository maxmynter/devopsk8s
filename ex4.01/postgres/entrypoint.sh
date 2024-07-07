#!/bin/bash

docker-entrypoint.sh postgres &

until pg_isready -U $POSTGRES_USER -d $POSTGRES_DB; do 
	echo 'Waiting for db ready ...'
	sleep 1
done

node migrate.js


echo "Migrations finished"
