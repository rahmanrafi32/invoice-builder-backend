<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">Invoice Builder Backend</h1>

<p align="center">
  <strong>A professional, scalable, and secure API for generating, managing, and storing invoices with advanced features including PDF generation, cloud storage, and real-time monitoring.</strong>
</p>

<p align="center">
  Built with <a href="http://nestjs.com/" target="_blank"><strong>NestJS</strong></a> • TypeScript • PostgreSQL • Docker
</p>

---

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Migrations](#database-migrations)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Core Modules](#core-modules)
- [Monitoring & Observability](#monitoring--observability)
- [Development](#development)
- [Deployment](#deployment)
- [Error Handling](#error-handling)
- [Security Considerations](#security-considerations)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based Authentication** - Secure token-based authentication with Passport.js
- **Local Strategy** - Username/password login with bcrypt password hashing
- **JWT Strategy** - Stateless request authentication using JWT tokens
- **Role-Based Access Control** - Protect routes with authentication guards
- **Secure Password Storage** - Industry-standard bcrypt hashing (salting rounds: 10)
- **Refresh Token Support** - Long-lived sessions with refresh token mechanism
- **User Profile Management** - Customizable user profiles and settings

### 📄 Invoice Management
- **Create Invoices** - Generate professional invoices with auto-incrementing invoice numbers
- **List Invoices** - Paginated invoice listing with search and filter capabilities
- **Search & Filter** - Find invoices by client name or filter by month
- **Retrieve Invoice Details** - Get comprehensive invoice information
- **Delete Invoices** - Remove invoices and associated PDF files from cloud storage
- **Auto-Generated Invoice Numbers** - Customizable invoice prefix (e.g., INV, INVOICE)
- **Payment Terms** - Configurable payment terms in days
- **Multi-Currency Support** - Default currency configuration per user (USD, EUR, etc.)

### 👥 Client Management
- **Create Clients** - Add and manage client information
- **List Clients** - View all clients with pagination support
- **Update Clients** - Modify client details
- **Delete Clients** - Remove clients from the system
- **Client Contact Information** - Store email, phone, and address details

### 📑 PDF Generation & Management
- **Automatic PDF Generation** - PDFMake integration for professional invoice PDFs
- **Cloud Storage Integration** - Cloudinary for secure file hosting and delivery
- **PDF Preview URLs** - Generate shareable preview links
- **PDF Download URLs** - Create direct download links for invoices
- **Automatic Cleanup** - Delete PDFs from Cloudinary when invoices are removed

### 💾 Database Features
- **PostgreSQL 16** - Robust relational database
- **Database Replication** - Master-replica setup for high availability
- **TypeORM Integration** - Type-safe database operations
- **Database Migrations** - Version-controlled database schema changes
- **Connection Pooling** - Optimized database connections

### 📊 Monitoring & Observability
- **Prometheus Integration** - Metrics collection and monitoring
- **Grafana Dashboards** - Visual monitoring and alerting
- **Health Checks** - Application health monitoring endpoints
- **Performance Metrics** - Track request latency and throughput

### 🐳 Infrastructure
- **Docker Support** - Containerized application and services
- **Docker Compose** - Multi-container orchestration (PostgreSQL, Prometheus, Grafana)
- **Environment Configuration** - Flexible configuration management with .env support
- **Network Isolation** - Secure container networking

### 📚 API Documentation
- **Swagger/OpenAPI** - Interactive API documentation
- **Auto-generated Endpoints** - Swagger UI with all endpoints documented
- **Request/Response Examples** - Detailed API schemas with examples
- **Authentication Documentation** - Bearer token setup guide

### ✅ Quality Assurance
- **Jest Testing Framework** - Unit and integration testing
- **E2E Testing** - End-to-end test support
- **Test Coverage Reports** - Comprehensive coverage analysis
- **ESLint & Prettier** - Code quality and formatting

---

## 🛠 Technology Stack

| Category | Technology |
|----------|-----------|
| **Runtime** | Node.js |
| **Framework** | NestJS 11.x |
| **Language** | TypeScript 5.x |
| **Database** | PostgreSQL 16 |
| **ORM** | TypeORM 0.3.x |
| **Authentication** | Passport.js, JWT |
| **PDF Generation** | PDFMake |
| **Cloud Storage** | Cloudinary |
| **API Documentation** | Swagger/OpenAPI 3.0 |
| **Validation** | class-validator, class-transformer |
| **Password Hashing** | bcrypt |
| **Monitoring** | Prometheus, Grafana |
| **Testing** | Jest, Supertest |
| **Code Quality** | ESLint, Prettier |
| **Container** | Docker, Docker Compose |
| **Environment** | dotenv |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **Docker** & **Docker Compose** (for containerized setup)
- **PostgreSQL** (v16 - can also use Docker)
- **Git**

---

## 🚀 Installation

### Option 1: Local Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/invoice-builder-backend.git
cd invoice-builder-backend

# Install dependencies
npm install
```

### Option 2: Docker Setup (Recommended)

```bash
# Ensure Docker and Docker Compose are installed
docker-compose up -d
```

This will start:
- PostgreSQL Master (port 5432)
- PostgreSQL Replica (port 5433)
- Prometheus (monitoring)
- Grafana (visualization)

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=admin
DB_PASSWORD=invoice@pass
DB_NAME=invoice_db
DB_SYNCHRONIZE=false
DB_LOGGING=false

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRATION=3600
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRATION=604800

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Application
NODE_ENV=development
APP_PORT=3000
APP_URL=http://localhost:3000

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### Database Configuration

The application uses TypeORM with PostgreSQL. Configuration file: `src/config/typeorm.config.ts`

Supported databases:
- PostgreSQL (primary)
- Can be extended with MySQL, MariaDB, etc.

---

## 🏃 Running the Application

### Development Mode

```bash
# Watch mode - auto-reload on file changes
npm run start:dev

# Debug mode
npm run start:debug

# Regular start
npm run start
```

The application will be available at `http://localhost:3000`

### Production Mode

```bash
# Build the application
npm run build

# Run production build
npm run start:prod
```

### Using Docker

```bash
# Build Docker image
docker build -t invoice-builder-backend .

# Run container
docker run -p 3000:3000 --env-file .env invoice-builder-backend

# Or use docker-compose
docker-compose up
```

---

## 📚 API Documentation

Once the application is running, access the interactive Swagger documentation:

**URL:** `http://localhost:3000/api/docs`

The Swagger UI provides:
- Complete API endpoint documentation
- Request/response schemas
- Live API testing interface
- Authentication setup guide

---

## 💾 Database Migrations

### Create a New Migration

```bash
npm run migration:create -- -n add_new_column
```

This generates a new migration file in `src/migrations/`

### Generate Migration from Entities

```bash
npm run migration:generate -- -n generate_schema
```

Automatically creates migration based on entity changes

### Run Pending Migrations

```bash
npm run migration:run
```

### Revert Last Migration

```bash
npm run migration:revert
```

### View Migration Status

```bash
npm run migration:show
```

---

## ✅ Testing

### Unit Tests

```bash
# Run all unit tests
npm run test

# Watch mode
npm run test:watch

# Debug mode
npm run test:debug
```

### E2E Tests

```bash
# Run end-to-end tests
npm run test:e2e
```

### Test Coverage

```bash
# Generate coverage report
npm run test:cov
```

Coverage reports are generated in the `coverage/` directory.

---

## 📁 Project Structure

```
invoice-builder-backend/
├── src/
│   ├── auth/                          # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── guards/                    # JWT and Local guards
│   │   ├── strategies/                # Passport strategies
│   │   ├── decorators/                # Custom decorators
│   │   ├── dto/                       # Request DTOs
│   │   ├── entities/                  # User entity
│   │   └── utils/                     # Password validation
│   │
│   ├── client/                        # Client management module
│   │   ├── client.controller.ts
│   │   ├── client.service.ts
│   │   ├── client.module.ts
│   │   ├── entities/
│   │   └── dto/
│   │
│   ├── invoice/                       # Invoice management module
│   │   ├── invoice.controller.ts
│   │   ├── invoice.service.ts
│   │   ├── invoice.module.ts
│   │   ├── entities/
│   │   ├── dto/
│   │   └── utils/
│   │
│   ├── cloudinary/                    # Cloud storage integration
│   │   ├── cloudinary.module.ts
│   │   └── cloudinary.service.ts
│   │
│   ├── config/                        # Configuration factory
│   │   ├── database.factory.ts
│   │   ├── typeorm.config.ts
│   │   └── cloudinary.config.ts
│   │
│   ├── migrations/                    # Database migrations
│   │
│   ├── app.module.ts                  # Root module
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts                        # Application entry point
│
├── docker-compose.yml                 # Container orchestration
├── tsconfig.json                      # TypeScript config
├── eslint.config.mjs                  # ESLint config
├── package.json
└── README.md
```

---

## 🔧 Core Modules

### Auth Module
Handles user authentication and authorization:
- User registration with complete profile setup
- Login with JWT token generation
- JWT refresh token mechanism
- Password validation and bcrypt hashing
- Bearer token authentication guard
- Current user decorator for route handlers

**Key Files:**
- `auth.service.ts` - Authentication business logic
- `jwt.strategy.ts` - JWT strategy implementation
- `jwt.guard.ts` - Route protection guard

### Client Module
Manages client information:
- CRUD operations for clients
- Client contact and address information
- Client-invoice relationships

**Key Files:**
- `client.service.ts` - Client business logic
- `client.entity.ts` - Database entity definition

### Invoice Module
Core invoice management system:
- Create invoices with auto-generated numbers
- List with pagination, search, and filtering
- PDF generation and cloud storage
- Automatic invoice number sequencing
- Currency and payment terms configuration

**Key Files:**
- `invoice.service.ts` - Invoice business logic
- `invoice.controller.ts` - API endpoints
- `helper.utils.ts` - PDF and formatting utilities

### Cloudinary Module
Cloud storage and CDN integration:
- File upload to Cloudinary
- Automatic PDF generation
- PDF preview and download URL generation
- Secure file deletion

---

## 📊 Monitoring & Observability

### Prometheus Metrics

Prometheus is configured to collect application metrics:

**Access:** `http://localhost:9090`

**Default Configuration:** `prometheus/prometheus.yml`

### Grafana Dashboards

Grafana provides visual monitoring and alerting:

**Access:** `http://localhost:3000` (when using docker-compose)

**Features:**
- Real-time metrics visualization
- Request latency monitoring
- Error rate tracking
- Uptime monitoring

### Health Checks

```bash
GET /health
```

Returns application health status and readiness.

---

## 👨‍💻 Development

### Code Quality Tools

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format

# Build project
npm run build
```

### Debugging

**VS Code Launch Config (.vscode/launch.json):**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug",
      "program": "${workspaceFolder}/node_modules/.bin/nest",
      "args": ["start", "--debug", "--watch"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Development Best Practices

1. **Use DTOs** for input validation
2. **Create migrations** for schema changes
3. **Write tests** for critical paths
4. **Use async/await** for asynchronous operations
5. **Follow NestJS conventions** for modularity
6. **Document complex logic** with comments
7. **Use guards** for authentication/authorization

---

## 🚢 Deployment

### Preparing for Production

1. **Update environment variables** in `.env`
2. **Run database migrations**: `npm run migration:run`
3. **Build application**: `npm run build`
4. **Set NODE_ENV=production**
5. **Configure Cloudinary credentials**
6. **Set up PostgreSQL replication** (optional)

### Docker Deployment

```bash
# Build image with specific tag
docker build -t invoice-builder-backend:1.0.0 .

# Push to registry
docker push your-registry/invoice-builder-backend:1.0.0

# Run in production
docker run -d \
  --name invoice-builder \
  -p 3000:3000 \
  --env-file .env.production \
  invoice-builder-backend:1.0.0
```

### Cloud Platforms

The application can be deployed to:
- **AWS** (EC2, ECS, EKS)
- **Google Cloud** (Cloud Run, GKE)
- **Azure** (App Service, AKS)
- **DigitalOcean** (App Platform, Kubernetes)
- **Heroku**
- **Railway**
- **Render**

---

## 🔒 Security Considerations

### Authentication & Authorization
- ✅ JWT tokens with expiration
- ✅ Refresh token rotation
- ✅ bcrypt password hashing
- ✅ Bearer token validation
- ✅ Route-level guards

### Database Security
- ✅ SQL injection prevention via TypeORM
- ✅ Connection pooling
- ✅ Environmental variable configuration
- ✅ Database replication for high availability

### API Security
- ✅ CORS configuration (implement as needed)
- ✅ Rate limiting (recommended: implement)
- ✅ Input validation with class-validator
- ✅ Request/response logging
- ✅ Error handling without sensitive data exposure

### Best Practices
1. Never commit `.env` files
2. Regularly rotate JWT secrets
3. Use HTTPS in production
4. Implement rate limiting
5. Regular security audits
6. Keep dependencies updated
7. Implement request signing
8. Add API versioning

---

## ❌ Error Handling

The application implements global error handling:

```typescript
// Custom HTTP exceptions are caught and formatted
{
  "statusCode": 400,
  "message": "Invalid input provided",
  "timestamp": "2025-05-10T10:30:00Z"
}
```

**Common HTTP Status Codes:**
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## 🛠️ Troubleshooting

### Issue: Database Connection Error
```bash
# Check PostgreSQL is running
docker-compose ps

# View container logs
docker-compose logs postgres
```

### Issue: Cloudinary Upload Failed
```bash
# Verify Cloudinary credentials in .env
# Check API key and secret
# Ensure account is active
```

### Issue: JWT Token Invalid
```bash
# Verify JWT_SECRET is set correctly
# Check token expiration
# Ensure Authorization header format: "Bearer <token>"
```

### Issue: Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

---

## 📞 Support & Contact

For issues, questions, or suggestions:

1. **GitHub Issues** - Report bugs and feature requests
2. **Documentation** - Check [NestJS docs](https://docs.nestjs.com)
3. **Discord** - Join [NestJS Discord](https://discord.gg/G7Qnnhy)

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🎯 Roadmap

Planned features:
- [ ] Email notifications
- [ ] Invoice templates
- [ ] Multi-language support
- [ ] Advanced reporting
- [ ] Mobile app
- [ ] Payment gateway integration
- [ ] API rate limiting
- [ ] Webhook support
- [ ] Invoice scheduling
- [ ] Tax calculations

---

## ⭐ Show Your Support

If you find this project useful, please consider giving it a star on GitHub!

---

**Last Updated:** May 10, 2025

**Version:** 0.0.1
