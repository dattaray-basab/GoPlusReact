FROM golang:1.20

WORKDIR /app

# Copy go.mod files
COPY go.mod go.sum ./

# Download dependencies and tidy up
RUN go mod download && go mod tidy

# Copy the source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -v -o main .

EXPOSE 8080

CMD ["./main"]