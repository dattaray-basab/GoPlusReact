#!/bin/bash

# Read siteConfig.json
config=$(cat siteConfig.json)

# Function to convert string to uppercase
to_upper() {
    echo "$1" | tr '[:lower:]' '[:upper:]'
}

# Function to set environment variables
set_env_vars() {
    local prefix=$1
    local key=$2
    local value=$3
    local directive=$4

    case $directive in
        "react_flag_only")
            export REACT_APP_cks_${key}="$value"
            ;;
        "react_flag_and_server")
            export cks_${key}="$value"
            export REACT_APP_cks_${key}="$value"
            ;;
        "server_only")
            export cks_${key}="$value"
            ;;
    esac
}

# Function to process a server object
process_server() {
    local server_name=$1
    local server_obj=$2

    local gen_env=$(echo "$server_obj" | jq -r '.gen_env // empty')
    if [ ! -z "$gen_env" ]; then
        local directive=$(echo "$gen_env" | jq -r '.directive')
        for key in $(echo "$server_obj" | jq -r 'keys[]'); do
            if [ "$key" != "gen_env" ]; then
                local value=$(echo "$server_obj" | jq -r ".$key")
                local upper_server_name=$(to_upper "$server_name")
                local upper_key=$(to_upper "$key")
                set_env_vars "" "${upper_server_name}_${upper_key}" "$value" "$directive"
            fi
        done
    fi
}

# Iterate through all keys in the JSON
for key in $(echo "$config" | jq -r 'keys[]'); do
    value=$(echo "$config" | jq -r ".$key")
    
    # Check if the value is an object
    if [ "$(echo "$value" | jq -r 'type')" = "object" ]; then
        # If it's an object, check if it has a 'gen_env' key
        if [ "$(echo "$value" | jq -r 'has("gen_env")')" = "true" ]; then
            # If it has 'gen_env', process it as a server
            process_server "$key" "$value"
        else
            # If it doesn't have 'gen_env', iterate through its keys
            for subkey in $(echo "$value" | jq -r 'keys[]'); do
                subvalue=$(echo "$value" | jq -r ".$subkey")
                if [ "$(echo "$subvalue" | jq -r 'type')" = "object" ]; then
                    process_server "$subkey" "$subvalue"
                fi
            done
        fi
    fi
done

# Print all set environment variables
env | grep cks_