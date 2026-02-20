# Use the official PHP image from Docker Hub
FROM php:8.1-cli

# Set the working directory in the container
WORKDIR /app

# Copy the local code to the container
COPY . /app

# Expose the port that PHP will run on
EXPOSE 8000

# Command to run PHP built-in server
CMD ["php", "-S", "0.0.0.0:8000"]