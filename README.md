# Booking API

A RESTful API for managing bookings and users, built with NestJS.

## Overview

This Booking API provides a solution for managing bookings with user relationships. It features API documentation using Swagger, validation, and a clean architecture following NestJS best practices.

## Features

- **Booking Management**: Create, read, update, and delete bookings
- **User Management**: User creation and management with relationship to bookings
- **API Documentation**: Interactive Swagger documentation
- **Data Validation**: Data validation using class-validator

## API Documentation

The API documentation is available at `/api/docs` when the application is running. It provides an interactive interface to explore and test all available endpoints.

### Endpoints

#### Bookings

- `POST /bookings` - Create a new booking
- `GET /bookings` - Get all bookings
- `GET /bookings/:id` - Get a booking by ID
- `PUT /bookings/:id` - Update a booking
- `DELETE /bookings/:id` - Delete a booking

#### Users

- `POST /users` - Create a new user
- `GET /users` - Get all users
- `GET /users/:id` - Get a user by ID
- `PATCH /users/:id` - Update a user
- `DELETE /users/:id` - Delete a user

## Data Models

### Booking

```typescript
interface Booking {
  id: string;
  startTime: Date;
  endTime: Date;
  notes?: string;
  status: BookingStatus; // PENDING, CONFIRMED, CANCELLED, COMPLETED
  userId: string;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}
```

### User

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  password?: string; // Never returned in responses
  createdAt: Date;
  updatedAt: Date;
}
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/booking-api.git

# Navigate to the project directory
cd booking-api

# Install dependencies
npm install
```

### Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

The API will be available at `http://localhost:3001` and the documentation at `http://localhost:3001/api/docs`.

## Date Handling

The API accepts dates as ISO 8601 strings (e.g., "2025-04-20T00:00:00.000Z") in all requests. The system automatically validates and converts these strings to Date objects.

## Authentication

The API uses bearer token authentication. Include your token in the Authorization header:

```
Authorization: Bearer your-token-here
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

