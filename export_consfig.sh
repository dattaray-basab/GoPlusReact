#!/bin/bash

# Path to the siteConfig.json file
CONFIG_FILE="siteConfig.json"

# Check if the config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "Error: $CONFIG_FILE not found!"
    exit 1
fi

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "Error: jq is not installed. Please install jq to parse JSON."
    exit 1
fi

# Read the JSON file and export each key-value pair as an environment variable
eval $(jq -r 'to_entries | .[] | "export \(.key)=\(.value)"' $CONFIG_FILE)

# Optionally, print out the exported variables for verification
echo "Exported environment variables:"
jq -r 'to_entries | .[] | "\(.key)=\(.value)"' $CONFIG_FILE

# Exit successfully
exit 0