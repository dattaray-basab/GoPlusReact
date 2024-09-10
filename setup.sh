#!/bin/bash

parse_config() {
    local prefix=""
    while IFS=': ' read -r key value
    do
        if [[ $key == \#* ]] || [ -z "$key" ]; then
            continue
        fi
        if [[ $key =~ ^[[:space:]]+ ]]; then
            key=$(echo "$key" | xargs)
        else
            prefix=$(echo "$key" | tr '[:lower:]' '[:upper:]')
            continue
        fi
        value=$(echo $value | sed -e 's/^"//' -e 's/"$//')
        key=$(echo $key | tr '[:lower:]-' '[:upper:]_')
        export "CONFIG_${prefix}_${key}"="$value"
    done < siteConfig.yaml
}

parse_config

echo "Parsed configuration:"
env | grep "^CONFIG_"

if [ "$1" = "docker" ]; then
    echo "Starting services with Docker..."
    docker-compose up --build
else
    echo "Usage: $0 docker"
    exit 1
fi