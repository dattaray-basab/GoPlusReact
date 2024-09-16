#!/bin/bash

# Check if the script is being sourced
(return 0 2>/dev/null) && sourced=1 || sourced=0

if [ $sourced -eq 0 ]; then
    echo "This script should be sourced, not executed directly."
    echo "Please run: source $0"
    return 1
fi

# Main function to set environment variables
set_environment_variables() {
    # Check if jq is installed
    if ! command -v jq &> /dev/null; then
        echo "jq could not be found. Please install it."
        return 1
    fi

    # Default config file path
    CONFIG_FILE="siteConfig.json"
    VERBOSE=0

    # Parse command line arguments
    while getopts ":f:v" opt; do
      case ${opt} in
        f )
          CONFIG_FILE=$OPTARG
          ;;
        v )
          VERBOSE=1
          ;;
        \? )
          echo "Invalid option: $OPTARG" 1>&2
          return 1
          ;;
        : )
          echo "Invalid option: $OPTARG requires an argument" 1>&2
          return 1
          ;;
      esac
    done

    # Function to log verbose messages
    log_verbose() {
        if [[ $VERBOSE -eq 1 ]]; then
            echo "$1"
        fi
    }

    # Read siteConfig.json
    if [[ ! -f "$CONFIG_FILE" ]]; then
        echo "Config file $CONFIG_FILE not found!"
        return 1
    fi
    config=$(cat "$CONFIG_FILE")

    # Function to convert string to uppercase
    to_upper() {
        echo "$1" | tr '[:lower:]' '[:upper:]'
    }

    # Function to set environment variables
    set_env_vars() {
        local key=$1
        local value=$2
        local directive=$3

        case $directive in
            "react_flag_only")
                export REACT_APP_cks_${key}="$value"
                log_verbose "Set REACT_APP_cks_${key}=$value"
                ;;
            "react_flag_and_server")
                export cks_${key}="$value"
                export REACT_APP_cks_${key}="$value"
                log_verbose "Set cks_${key}=$value and REACT_APP_cks_${key}=$value"
                ;;
            "server_only")
                export cks_${key}="$value"
                log_verbose "Set cks_${key}=$value"
                ;;
            *)
                log_verbose "Unknown directive: $directive. No environment variable set for ${key}."
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
                    set_env_vars "${upper_server_name}_${upper_key}" "$value" "$directive"
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
    log_verbose "Printing all set environment variables:"
    env | grep cks_
    env | grep REACT_APP_cks_
}

# Run the main function
set_environment_variables

print_instructions() {
    echo "Environment variables have been set."
    echo "To make these variables available in new terminal sessions, add the following line to your ~/.bashrc or ~/.bash_profile:"
    echo "source $(cd "$(dirname "$0")" && pwd)/$(basename "$0")"
}

print_instructions