# Dockerfile for my-server

# Build stage
FROM golang:1.20-alpine AS builder

WORKDIR /app

# Copy go.mod and go.sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -v -o main .

# Final stage
FROM alpine:latest

WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/main .

# The siteConfig.json will be mounted as a volume, so we don't need to copy it here

# Use an environment variable for the port
ENV PORT=${CONTAINER_SERVER_PORT}

# Expose the port
EXPOSE ${PORT}

# Run the binary
CMD ["./main"]