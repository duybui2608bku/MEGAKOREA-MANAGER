# Technical Context: MEGA-HOLDING-MANAGER

## Technology Stack

### Backend Framework

- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **TypeScript**: Type-safe JavaScript development

### Database & ODM

- **MongoDB**: NoSQL document database
- **Mongoose**: Object Document Mapping (ODM) library
- **Connection Management**: Custom connection handling with overload protection

### Authentication & Security

- **JWT (jsonwebtoken)**: Token-based authentication
- **Helmet**: Security headers middleware
- **bcrypt**: Password hashing (implied from crypto usage)
- **Express Validator**: Input validation and sanitization

### Development Tools

- **Nodemon**: Development server with auto-restart
- **TypeScript Compiler**: Type checking and compilation
- **TSC-Alias**: Path alias resolution
- **ESLint**: Code linting
- **Prettier**: Code formatting

### Middleware & Utilities

- **Compression**: Response compression
- **Morgan**: HTTP request logging
- **CORS**: Cross-origin resource sharing (if needed)
- **Lodash**: Utility functions

## Project Structure

### Directory Organization

```
SERVER/
├── src/
│   ├── config/           # Environment configurations
│   ├── constants/        # Application constants
│   │   ├── collections/  # Database collection names
│   │   ├── enum/         # Enumerated values
│   │   ├── messages/     # Response messages
│   │   └── path-routes/  # API route definitions
│   ├── controllers/      # HTTP request handlers
│   ├── db/              # Database connection setup
│   ├── helpers/         # Utility functions
│   ├── interfaces/      # TypeScript interfaces
│   ├── jwt/             # JWT token management
│   ├── middlewares/     # Express middlewares
│   │   ├── error/       # Error handling
│   │   ├── handler/     # Request/response handlers
│   │   ├── user/        # User-specific middlewares
│   │   └── utils/       # Utility middlewares
│   ├── models/          # Database models
│   ├── repository/      # Data access layer
│   ├── routes/          # API route definitions
│   └── services/        # Business logic layer
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── nodemon.json         # Nodemon configuration
```

## Development Setup

### Environment Configuration

- **Development Environment**: Local development with hot reload
- **Production Environment**: Optimized build with proper error handling
- **Environment Variables**: Separate configs for dev/prod database and app settings

### Build Process

```json
{
  "build": "rimraf ./dist && tsc && tsc-alias",
  "start": "node dist/index.js",
  "dev": "npx nodemon"
}
```

### Path Aliases

- Uses `~` alias for clean imports from src root
- TSC-Alias for build-time path resolution
- Configured in tsconfig.json

## Database Design

### Collections

- **Users**: Employee information and authentication
- **Departments**: Organizational structure

### Schema Patterns

- **Timestamps**: Automatic created_at/updated_at fields
- **Indexing**: Strategic indexes on frequently queried fields (name, phone)
- **References**: ObjectId references between collections
- **Enums**: Numeric enums for status, role, gender, titles

### Connection Management

- **Connection Pooling**: MongoDB connection pool management
- **Overload Protection**: Connection monitoring and protection
- **Environment-based**: Different connection strings for dev/prod

## API Design

### RESTful Endpoints

- **POST /users/register**: User registration
- **POST /users/login**: User authentication
- **GET /users/profile**: Get user profile (authenticated)
- **PUT /users/profile**: Update user profile (authenticated)
- **PUT /users/change-password**: Change password (authenticated)

### Request/Response Patterns

- **Consistent Response Format**: Standardized success/error responses
- **Input Validation**: Comprehensive validation using express-validator
- **Error Handling**: Centralized error processing with proper HTTP status codes

## Security Implementation

### Authentication Flow

1. User registration with password hashing
2. Login generates JWT access token
3. Protected routes validate JWT token
4. Role-based access control

### Security Measures

- **Password Hashing**: Secure password storage
- **JWT Tokens**: Stateless authentication
- **Input Validation**: Prevent injection attacks
- **Security Headers**: Helmet middleware for security headers
- **Request Sanitization**: Clean user input

## Development Constraints

### TypeScript Configuration

- **Strict Mode**: Enabled for type safety
- **Path Mapping**: Clean import paths with aliases
- **Target**: Modern ES features with Node.js compatibility

### Code Quality

- **ESLint**: Enforced coding standards
- **Prettier**: Consistent code formatting
- **Type Safety**: Full TypeScript coverage

### Performance Considerations

- **Compression**: Response compression middleware
- **Connection Pooling**: Efficient database connections
- **Async/Await**: Non-blocking operations
- **Error Boundaries**: Proper error handling without crashes

## Deployment Requirements

### Production Setup

- **Environment Variables**: Secure configuration management
- **Build Process**: Compiled TypeScript to JavaScript
- **Process Management**: Production-ready process handling
- **Database**: MongoDB production instance
- **Security**: Production security headers and HTTPS

### Monitoring & Logging

- **Morgan**: HTTP request logging
- **Error Logging**: Centralized error tracking
- **Connection Monitoring**: Database connection health checks




