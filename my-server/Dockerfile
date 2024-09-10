
FROM golang:1.16

WORKDIR /app

# Copy the export script and siteConfig.json
COPY export_config.sh siteConfig.json ./

# Install jq
RUN apt-get update && apt-get install -y jq

# Run the export script to set environment variables
RUN chmod +x export_config.sh && . ./export_config.sh

# Copy go.mod and go.sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -v -o main .

EXPOSE ${CONTAINER_SERVER_PORT}

CMD ["./main"]