#!/bin/bash

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "Error: jq is not installed. Please install jq to parse JSON."
    exit 1
fi

# Path to the siteConfig.json file
CONFIG_FILE="/path/to/siteConfig.json"

# Check if the config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "Error: siteConfig.json not found at $CONFIG_FILE"
    exit 1
fi

# Read each key-value pair from the JSON file and export as environment variables
jq -r 'to_entries | .[] | "export \(.key)=\(.value)"' "$CONFIG_FILE" > /tmp/env_vars.sh

# Source the temporary file to set the environment variables
source /tmp/env_vars.sh

# Clean up the temporary file
rm /tmp/env_vars.sh

# Optional: Print the exported variables
env | grep -E "CONTAINER_APP_PORT|HOST_APP_PORT|CONTAINER_SERVER_PORT|HOST_SERVER_PORT|APP_BASE_URL|SERVER_BASE_URL"

echo "Environment variables have been set successfully."