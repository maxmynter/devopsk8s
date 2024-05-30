#!/bin/bash

set -e

if [ -z "$URL" ]; then
  echo "URL environment variable is not set."
  exit 1
fi

if [ -z "$POSTGRES_USER" ]; then
  echo "POSTGRES_USER environment variable is not set."
  exit 1
fi

if [ -z "$POSTGRES_PASSWORD" ]; then
  echo "POSTGRES_PASSWORD environment variable is not set."
  exit 1
fi

if [ -z "$POSTGRES_DB" ]; then
  echo "POSTGRES_DB environment variable is not set."
  exit 1
fi

if [ -z "$BUCKET_NAME" ]; then
  echo "BUCKET_NAME environment variable is not set."
  exit 1
fi

if [ -z "$ACCESS_TOKEN" ]; then
  echo "ACCESS_TOKEN environment variable is not set."
  exit 1
fi

echo "Starting the database backup..."
pg_dump -v postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$URL/$POSTGRES_DB > /usr/src/app/backup.sql

echo "Uploading the backup to Google Cloud Storage..."
echo "BUCKET_NAME: $BUCKET_NAME"
echo "ACCESS_TOKEN: ${ACCESS_TOKEN:0:4}..."

curl -v --upload-file /usr/src/app/backup.sql \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  "https://storage.googleapis.com/$BUCKET_NAME/db_backup_$(date +\%F).sql"

echo "Backup and upload completed successfully."
