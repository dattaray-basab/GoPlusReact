#!/bin/bash

# Store the current directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Path to the siteConfig.json file
CONFIG_FILE="${SCRIPT_DIR}/siteConfig.json"

# Check if the config file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "Error: $CONFIG_FILE not found!"
    return 1
fi

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "Error: jq is not installed. Please install jq to parse JSON."
    return 1
fi

# Read the JSON file and export each key-value pair as an environment variable
while IFS="=" read -r key value; do
    # Remove any surrounding quotes from the value
    value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//')
    export "$key=$value"
    echo "Exported: $key=$value"
done < <(jq -r 'to_entries | .[] | "\(.key)=\(.value)"' "$CONFIG_FILE")

# Print current directory to verify it hasn't changed
echo "Current directory: $(pwd)"

# Optionally, print out all exported variables for verification
echo "All exported variables:"
env | grep -E "CONTAINER_|HOST_|BASE_URL"

# Return successfully
return 0