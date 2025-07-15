#!/bin/bash

echo "🚀 Setting up Money Transfer App with Docker"
echo "============================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << 'EOL'
# Application Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=appuser
DB_PASSWORD=apppassword123
DB_NAME=money_transfer_db

# JWT Configuration
JWT_SECRET=f56cb389e066363f8b08ec56f36295a7c3451cf2314fae46f6d14758a1a1bbb797c13e0c1227ec931040405dc5d607b402147c9d6b9c14f6a6a7b626faf60afa
JWT_EXPIRES_IN=24h

# Raven Atlas API Configuration
RAVEN_BASE_URL=https://atlas.getravenbank.com/api/v1
RAVEN_PUBLIC_KEY=your-raven-public-key
RAVEN_SECRET_KEY=your-raven-secret-key

# Webhook Configuration
WEBHOOK_SECRET=b99276264161ed564ea885dd006a7ab0145646bcf2d36af39bcb1f9302ea7636

# Security Configuration
BCRYPT_ROUNDS=12
TRANSFER_LIMIT=10000
EOL
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Start database
echo "🗄️  Starting MySQL database..."
docker-compose up -d database

echo "⏳ Waiting for database to be ready..."
sleep 15

# Check database health
echo "🔍 Checking database health..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if docker-compose exec -T database mysqladmin ping -h localhost -u appuser -papppassword123 &> /dev/null; then
        echo "✅ Database is ready!"
        break
    fi
    
    if [ $attempt -eq $max_attempts ]; then
        echo "❌ Database failed to start after $max_attempts attempts"
        echo "📋 Database logs:"
        docker-compose logs database
        exit 1
    fi
    
    echo "⏳ Attempt $attempt/$max_attempts - waiting for database..."
    sleep 2
    ((attempt++))
done

# Run migrations (using local environment since Docker app might not build)
echo "🔄 Running database migrations..."
if npm run migrate:latest; then
    echo "✅ Migrations completed successfully!"
else
    echo "❌ Migration failed. Please check your database connection."
    exit 1
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update your Raven Atlas API keys in .env file"
echo "2. Start the application:"
echo "   - For local development: npm run dev"
echo "   - For Docker: docker-compose up -d (after fixing network issues)"
echo ""
echo "🌐 Available endpoints:"
echo "   - API: http://localhost:3000"
echo "   - Health: http://localhost:3000/health"
echo "   - Database: localhost:3306"
echo ""
echo "📖 For more details, check DOCKER.md and README.md" 