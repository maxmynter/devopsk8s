# Use an official base image
FROM alpine:latest

# Install build dependencies
RUN apk add --no-cache gcc musl-dev

# Copy the C source code into the container
COPY . /src

# Set the working directory
WORKDIR /src

# Compile the C program
RUN gcc -o log-output rnd_str.c

# Command to run the compiled program
CMD ["./log-output"]

