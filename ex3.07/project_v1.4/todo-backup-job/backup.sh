#!/bin/bash

set -e

if [ $URL ]
then
  pg_dump -v postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$URL/$POSTGRES_DB > /usr/src/app/backup.sql
  curl -v --upload-file /usr/src/app/backup.sql \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    "https://storage.googleapis.com/$BUCKET_NAME/db_backup_$(date +\%F).sql"
fi
