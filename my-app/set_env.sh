#!/bin/bash

# Path to the siteConfig.json file
CONFIG_FILE="/app/siteConfig.json"

# Check if the config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "Error: siteConfig.json not found at $CONFIG_FILE"
    exit 1
fi

# Read each key-value pair from the JSON file and create a .env file
jq -r 'to_entries | .[] | "REACT_APP_\(.key)=\(.value)"' "$CONFIG_FILE" > .env

# Also set these variables in the current environment
set -a
source .env
set +a

# Optional: Print the exported variables
env | grep REACT_APP_

echo "Environment variables have been set successfully."