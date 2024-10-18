#!/bin/bash

if [ -z "${BACKEND_URL}" ]; then
    echo "BACKEND_URL is not set"
    exit 1
fi

todosBaseurl="${BACKEND_URL}" 

url=$(curl -Ls -o /dev/null -w %{url_effective} "https://en.wikipedia.org/wiki/Special:Random")

json_payload=$(jq -n --arg url "$url" '{text: ("Read " + $url)}')

curl -X  POST "${todosBaseurl}/todos" \
	-H "Content-Type: application/json" \
	-d "$json_payload"
