#!/bin/bash
export $(jq -r "to_entries|map(\"\(.key)=\(.value|tostring)\")|.[]" < /app/siteConfig.json)
export REACT_APP_SERVER_BASE_URL=$APP_BASE_URL
export REACT_APP_HOST_SERVER_PORT=$HOST_SERVER_PORT