#!/bin/bash

# Wait for database to be ready
echo "Waiting for database to be ready..."
until mysqladmin ping -h database -u appuser -papppassword123 --silent; do
    echo "Waiting for database connection..."
    sleep 2
done

echo "Database is ready! Running migrations..."

# Run migrations
npm run migrate:latest

echo "Migrations completed!" 