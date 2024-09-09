#!/bin/bash

# Start the Go server
start_server() {
    echo "Starting Go server..."
    cd my-server
    go run main.go &
    SERVER_PID=$!
    cd ..
    echo "Go server started with PID $SERVER_PID"
}

# Start the React app
start_app() {
    echo "Starting React app..."
    cd my-app
    yarn start &
    APP_PID=$!
    cd ..
    echo "React app started with PID $APP_PID"
}

# Main function to start both services
start_all() {
    start_server
    start_app

    echo "Both services are running. Press Ctrl+C to stop."
    wait
}

# Trap Ctrl+C and call the cleanup function
cleanup() {
    echo "Stopping services..."
    kill $SERVER_PID
    kill $APP_PID
    exit 0
}

trap cleanup INT

# Start the services
start_all