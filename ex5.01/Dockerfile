FROM golang:1.16 as builder
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependencies
RUN go mod download

# Copy the source code
COPY main.go .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o dummysite-controller

FROM alpine:3.14
COPY --from=builder /app/dummysite-controller /dummysite-controller
CMD ["/dummysite-controller"]
