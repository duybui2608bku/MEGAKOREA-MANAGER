# System Patterns: MEGA-HOLDING-MANAGER

## Architecture Overview

### Clean Architecture Implementation

The system follows a clean architecture pattern with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controllers   │────│    Services     │────│  Repositories   │
│  (HTTP Layer)   │    │ (Business Logic)│    │  (Data Access)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Middlewares   │    │   Interfaces    │    │     Models      │
│ (Cross-cutting) │    │ (Contracts)     │    │  (Data Schema)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Layer Responsibilities

#### Controllers (`/controllers`)

- Handle HTTP requests and responses
- Input validation coordination
- Response formatting
- Delegate business logic to services
- **Pattern**: Thin controllers that focus only on HTTP concerns

#### Services (`/services`)

- Core business logic implementation
- Data transformation and validation
- Coordinate between repositories
- Handle complex business rules
- **Pattern**: Business logic encapsulation

#### Repositories (`/repository`)

- Data access abstraction
- Database query implementation
- Data persistence operations
- **Pattern**: Repository pattern for data access

#### Models (`/models`)

- Database schema definitions
- Data validation rules
- Mongoose model configurations
- **Pattern**: Active Record pattern with Mongoose

## Key Design Patterns

### 1. Middleware Chain Pattern

```typescript
// Request processing pipeline
app.use(compression());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

**Purpose**: Cross-cutting concerns (security, logging, parsing)
**Location**: `/middlewares`

### 2. Dependency Injection Pattern

```typescript
// Service depends on repository
class UserService {
  constructor(private userRepository: UserRepository) {}
}
```

**Purpose**: Loose coupling and testability
**Implementation**: Constructor injection

### 3. Error Handling Pattern

```typescript
// Centralized error handling
app.use(defaultErrorHandler);
```

**Purpose**: Consistent error responses
**Location**: `/middlewares/error`

### 4. Validation Middleware Pattern

```typescript
// Input validation before controller
userRouters.post(
  "/register",
  registerValidator,
  wrapRequestHandler(registerController)
);
```

**Purpose**: Input validation and sanitization
**Location**: `/middlewares/user`

### 5. JWT Authentication Pattern

```typescript
// Token-based authentication
userRouters.get(
  "/profile",
  accessTokenValidator,
  wrapRequestHandler(getProfileController)
);
```

**Purpose**: Stateless authentication
**Location**: `/jwt` and `/middlewares/user`

## Component Relationships

### User Management Flow

```
HTTP Request → Route → Middleware → Controller → Service → Repository → Model → Database
     ↓           ↓         ↓           ↓          ↓          ↓         ↓
  Validation  Auth    Business    Data      Schema    MongoDB
             Check    Logic      Access   Validation
```

### Database Relationships

```
User ──────────── Department
 │                     │
 ├─ role              ├─ name
 ├─ status            ├─ description
 ├─ titles            └─ timestamps
 ├─ department (ref)
 └─ timestamps
```

## Configuration Patterns

### Environment-Based Configuration

```typescript
// Multi-environment support
const configMongodb = { development, production };
const env = process.env.NODE_ENV || "development";
export default configMongodb[env];
```

**Purpose**: Environment-specific settings
**Location**: `/config`

### Constants Organization

```
/constants
├── collections/     # Database collection names
├── enum/           # Enumerated values
├── messages/       # Response messages
└── path-routes/    # API route definitions
```

**Purpose**: Centralized configuration and constants

## Security Patterns

### JWT Token Management

- Access tokens for authentication
- Role-based authorization
- Token validation middleware

### Password Security

- Hashed password storage
- Secure password change flow
- Input validation and sanitization

### Request Validation

- Express-validator integration
- Type-safe request interfaces
- Comprehensive input sanitization

## Error Handling Strategy

### Centralized Error Processing

- Global error handler middleware
- Consistent error response format
- Request wrapper for async operations
- Proper HTTP status codes

### Validation Error Handling

- Input validation at middleware level
- Type-safe error responses
- User-friendly error messages




