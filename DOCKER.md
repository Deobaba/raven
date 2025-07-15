# 🐳 Docker Setup Guide for Money Transfer App

This guide explains how to run the Money Transfer App using Docker containers.

## 📦 What's Included

- **Application Container**: Node.js app with TypeScript
- **Database Container**: MySQL 8.0 with persistent storage
- **Multi-stage Dockerfile**: Optimized for both development and production
- **Health checks**: Automatic container health monitoring
- **Networking**: Secure container-to-container communication

## 🚀 Quick Start

### Prerequisites
- Docker installed on your system
- Docker Compose (usually comes with Docker)

### Option 1: Production Setup (Recommended)

```bash
# Build and start all services
docker-compose up -d

# Check if services are running
docker-compose ps

# View logs
docker-compose logs -f

# Run database migrations
docker-compose exec app npm run migrate:latest
```

### Option 2: Development Setup (with live reload)

```bash
# Start in development mode
docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d

# Or use the development profile
docker-compose --profile dev up -d

# View logs with live updates
docker-compose logs -f app-dev
```

## 📋 Available Commands

### Basic Operations
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove volumes (⚠️ deletes database data)
docker-compose down -v

# View running containers
docker-compose ps

# View logs
docker-compose logs [service-name]

# Follow logs in real-time
docker-compose logs -f [service-name]
```

### Database Operations
```bash
# Run migrations
docker-compose exec app npm run migrate:latest

# Rollback migrations
docker-compose exec app npm run migrate:rollback

# Access MySQL shell
docker-compose exec database mysql -u appuser -papppassword123 money_transfer_db

# Backup database
docker-compose exec database mysqldump -u appuser -papppassword123 money_transfer_db > backup.sql

# Restore database
docker-compose exec -T database mysql -u appuser -papppassword123 money_transfer_db < backup.sql
```

### Application Operations
```bash
# Execute commands in app container
docker-compose exec app npm test

# Access app container shell
docker-compose exec app sh

# Rebuild specific service
docker-compose build app

# Restart specific service
docker-compose restart app
```

## 🔧 Configuration

### Environment Variables

The application uses these environment variables (defined in docker-compose.yml):

```yaml
environment:
  NODE_ENV: production
  PORT: 3000
  DB_HOST: database          # Container name
  DB_PORT: 3306
  DB_USER: appuser
  DB_PASSWORD: apppassword123
  DB_NAME: money_transfer_db
  JWT_SECRET: your-jwt-secret
  RAVEN_PUBLIC_KEY: your-raven-public-key
  RAVEN_SECRET_KEY: your-raven-secret-key
  WEBHOOK_SECRET: your-webhook-secret
```

### Customizing Configuration

1. **Update docker-compose.yml** for environment variables
2. **Create .env.docker** file for sensitive data:

```bash
# .env.docker
RAVEN_PUBLIC_KEY=your-actual-public-key
RAVEN_SECRET_KEY=your-actual-secret-key
JWT_SECRET=your-custom-jwt-secret
```

Then update docker-compose.yml to use env_file:
```yaml
services:
  app:
    env_file:
      - .env.docker
```

## 🌐 Accessing the Application

Once running, the application is available at:

- **API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **Database**: localhost:3306 (from host machine)

### API Endpoints

- POST `/api/v1/auth/signup` - Create account
- POST `/api/v1/auth/login` - Login
- GET `/api/v1/users/profile` - User profile
- POST `/api/v1/transactions/transfer` - Send money
- GET `/api/v1/transactions` - Transaction history

## 🗄️ Database

### Connection Details

- **Host**: localhost (from host machine) or `database` (from containers)
- **Port**: 3306
- **Database**: money_transfer_db
- **User**: appuser
- **Password**: apppassword123
- **Root Password**: rootpassword123

### Persistent Storage

Database data is stored in a Docker volume `mysql_data`. This means your data persists even when containers are restarted.

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Check what's using the port
   netstat -tulpn | grep :3000
   
   # Change port in docker-compose.yml
   ports:
     - "3001:3000"  # Use port 3001 instead
   ```

2. **Database connection failed**:
   ```bash
   # Check if database is healthy
   docker-compose ps
   
   # View database logs
   docker-compose logs database
   
   # Restart database
   docker-compose restart database
   ```

3. **Migrations not running**:
   ```bash
   # Manually run migrations
   docker-compose exec app npm run migrate:latest
   
   # Check database tables
   docker-compose exec database mysql -u appuser -papppassword123 -e "SHOW TABLES;" money_transfer_db
   ```

4. **Container won't start**:
   ```bash
   # View detailed logs
   docker-compose logs app
   
   # Rebuild container
   docker-compose build --no-cache app
   docker-compose up -d app
   ```

### Debugging

1. **Access container shell**:
   ```bash
   docker-compose exec app sh
   ```

2. **Check container processes**:
   ```bash
   docker-compose exec app ps aux
   ```

3. **View application logs**:
   ```bash
   docker-compose exec app tail -f logs/combined.log
   ```

## 🔒 Security Notes

- Database runs in an isolated network
- Application runs as non-root user
- Sensitive data should be in environment variables
- Use Docker secrets in production

## 📈 Performance Tips

1. **Use specific image tags** instead of `latest`
2. **Multi-stage builds** reduce final image size
3. **Health checks** ensure reliable deployments
4. **Volume mounting** for development speeds up rebuilds

## 🚀 Production Deployment

For production deployment:

1. **Set production environment variables**
2. **Use Docker secrets** for sensitive data
3. **Configure reverse proxy** (nginx/traefik)
4. **Set up monitoring** and logging
5. **Regular backups** of database volume

```bash
# Production deployment example
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🔄 Updates and Maintenance

```bash
# Update application
git pull origin main
docker-compose build app
docker-compose up -d app

# Update database
docker-compose pull database
docker-compose up -d database

# Clean up unused images
docker image prune -f
``` 