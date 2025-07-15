# 💸 Money Transfer App - Backend API

A fintech backend API built with Node.js, TypeScript, and Express.js that integrates with Raven Atlas for virtual accounts and money transfers.

## 🚀 Features

- ✅ User authentication with JWT
- ✅ Virtual bank account generation (in-app)
- ✅ Money transfers to Nigerian bank accounts via Raven Atlas
- ✅ Webhook handling for deposit notifications
- ✅ Transaction history and tracking
- ✅ Secure password hashing with bcrypt
- ✅ Input validation with Joi
- ✅ Comprehensive error handling
- ✅ Database migrations with Knex.js
- ✅ Unit and integration testing with Jest
- ✅ TypeScript for type safety

## 🛠️ Technology Stack

- **Language:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** MySQL with Knex.js ORM
- **Authentication:** JWT + bcrypt
- **Validation:** Joi
- **External API:** Raven Atlas
- **Testing:** Jest + Supertest
- **Logging:** Winston

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd money-transfer-app
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file with actual values:
```env
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=money_transfer_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Raven Atlas API Configuration
RAVEN_BASE_URL=https://atlas.getravenbank.com
RAVEN_PUBLIC_KEY=your-raven-public-key
RAVEN_SECRET_KEY=your-raven-secret-key

# Webhook Configuration
WEBHOOK_SECRET=your-webhook-secret

# App Configuration
BCRYPT_ROUNDS=12
TRANSFER_LIMIT=10000
```

5. Run database migrations:
```bash
npm run migrate:latest
```

6. Start the development server:
```bash
npm run dev
```

## 📚 API Documentation

### Authentication Endpoints

#### Sign Up
```http
POST /api/v1/auth/signup
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone_number": "+2348012345678"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### User Endpoints

#### Get Profile
```http
GET /api/v1/users/profile
Authorization: Bearer <jwt_token>
```

#### Generate Virtual Account
```http
POST /api/v1/users/virtual-account
Authorization: Bearer <jwt_token>
```

**Note:** Virtual accounts are automatically generated during user signup. This endpoint is available for users who signed up before the auto-generation feature was implemented.

### Transaction Endpoints

#### Initiate Transfer
```http
POST /api/v1/transactions/transfer
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "recipient_account_number": "1234567890",
  "recipient_bank_code": "058",
  "amount": 5000,
  "description": "Payment for services"
}
```

#### Get Transaction History
```http
GET /api/v1/transactions?type=transfer&page=1&limit=20
Authorization: Bearer <jwt_token>
```

#### Get Transaction by ID
```http
GET /api/v1/transactions/{id}
Authorization: Bearer <jwt_token>
```

### Webhook Endpoints

#### Deposit Webhook
```http
POST /api/v1/webhooks/deposit
X-Webhook-Secret: <webhook_secret>
Content-Type: application/json

{
  "reference": "DEP_123456789",
  "amount": 10000,
  "account_number": "1234567890",
  "sender_name": "Jane Doe",
  "description": "Bank transfer deposit"
}
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 🗃️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  virtual_account_number VARCHAR(20),
  virtual_account_bank VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type ENUM('deposit', 'transfer') NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  reference VARCHAR(100) UNIQUE NOT NULL,
  status ENUM('pending', 'success', 'failed') NOT NULL,
  description TEXT,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run migrate:latest` - Run database migrations
- `npm run migrate:rollback` - Rollback last migration
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## 🚀 Deployment

1. Build the project:
```bash
npm run build
```

2. Set production environment variables

3. Run migrations:
```bash
npm run migrate:latest
```

4. Start the server:
```bash
npm start
```

## 🔒 Security Features

- Password hashing with bcrypt (12 rounds)
- JWT authentication with expiration
- Input validation and sanitization
- Rate limiting on API endpoints
- Helmet.js security headers
- CORS configuration
- Webhook secret validation

## 📝 Task Completion Status

### ✅ Auth Module
- ✅ Sign up a new user
- ✅ Log in an existing user
- ✅ Encrypt password using bcrypt
- ✅ Generate JWT for authenticated requests

### ✅ Virtual Account Generation
- ✅ Integrate Raven Atlas Virtual Account API
- ✅ Save generated account number and bank details in user record

### ✅ Webhook Listener
- ✅ Create webhook endpoint to receive deposit notifications
- ✅ Parse and validate incoming payloads from Raven
- ✅ Update transactions table with successful deposits
- ✅ Log raw payloads for debugging

### ✅ Send Money to Bank
- ✅ Create endpoint to initiate bank transfer via Raven API
- ✅ Save transfer metadata in the transactions table
- ✅ Ensure transfer limits (₦100 for testing)
- ✅ Handle failed/success response flows

### ✅ Transactions History
- ✅ Create endpoint to list all transactions
- ✅ Create endpoint to filter by type (deposit or transfer)
- ✅ Return paginated results sorted by most recent

### ✅ Testing & Documentation
- ✅ Write unit and integration tests (Jest + Supertest)
- ✅ Document all API endpoints in README
- ✅ Test webhook using webhook.site and Postman

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details. 