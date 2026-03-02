# Campus Booking System - API Documentation

## Overview
Campus Booking System API is a RESTful API that manages facility bookings for campus resources. It handles facilities management, booking creation/updates, and real-time availability checking with 30-minute time slots.

**Base URL:** `http://localhost:5000` (development) or your deployed URL

---

## Table of Contents
1. [Authentication](#authentication)
2. [Error Handling](#error-handling)
3. [API Endpoints](#api-endpoints)
4. [Data Models](#data-models)
5. [Integration Guide](#integration-guide)

---

## Authentication
Currently, the API uses no authentication mechanism. For production use, consider implementing JWT or API key authentication.

---

## Error Handling

### Standard Error Response
```json
{
  "message": "Error description"
}
```

### HTTP Status Codes
- `200` - OK: Request successful
- `201` - Created: Resource created successfully
- `400` - Bad Request: Missing or invalid parameters
- `404` - Not Found: Resource not found
- `409` - Conflict: Booking time slot conflict
- `500` - Internal Server Error: Server-side error

---

## API Endpoints

### 1. FACILITIES

#### Get All Facilities
**Request:**
```
GET /facilities
```

**Description:** Retrieve all available facilities in the system.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Engineering Lab",
    "location": "Building A, Room 101",
    "capacity": 30,
    "description": "State-of-the-art engineering laboratory"
  },
  {
    "id": 2,
    "name": "Conference Room",
    "location": "Building B, Floor 2",
    "capacity": 20,
    "description": "Professional conference room with AV equipment"
  }
]
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/facilities
```

---

#### Get Facility by ID
**Request:**
```
GET /facilities/:id
```

**Path Parameters:**
- `id` (required, number): Facility ID

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Engineering Lab",
  "location": "Building A, Room 101",
  "capacity": 30,
  "description": "State-of-the-art engineering laboratory"
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Facility not found"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/facilities/1
```

---

### 2. BOOKINGS

#### Get All Bookings
**Request:**
```
GET /bookings
```

**Description:** Retrieve all bookings in the system.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "facility_id": 1,
    "user_id": 1,
    "user_name": "John Doe",
    "date": "2026-03-10",
    "start_time": "09:00",
    "end_time": "09:30",
    "status": "confirmed",
    "created_at": "2026-03-02T10:30:00Z"
  }
]
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/bookings
```

---

#### Create a New Booking
**Request:**
```
POST /bookings
```

**Request Body:**
```json
{
  "facility_id": 1,
  "user_id": "user123",
  "user_name": "John Doe",
  "date": "2026-03-10",
  "start_time": "09:00",
  "end_time": "09:30"
}
```

**Required Fields:**
- `facility_id` (number): ID of the facility to book
- `user_id` (string): External user identifier
- `user_name` (string): Name of the user
- `date` (string): Booking date in YYYY-MM-DD format
- `start_time` (string): Start time in HH:MM format
- `end_time` (string): End time in HH:MM format (must be > start_time)

**Response (201 Created):**
```json
{
  "id": 1,
  "facility_id": 1,
  "user_id": 1,
  "user_name": "John Doe",
  "date": "2026-03-10",
  "start_time": "09:00",
  "end_time": "09:30",
  "status": "confirmed",
  "created_at": "2026-03-02T10:30:00Z"
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "Missing required fields (facility_id, user_id, user_name, date, start_time, end_time)"
}
```

**Error Response (409 Conflict):**
```json
{
  "message": "Booking conflict: time slot already booked"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "facility_id": 1,
    "user_id": "user123",
    "user_name": "John Doe",
    "date": "2026-03-10",
    "start_time": "09:00",
    "end_time": "09:30"
  }'
```

---

#### Update a Booking
**Request:**
```
PUT /bookings/:id
```

**Path Parameters:**
- `id` (required, number): Booking ID

**Request Body:**
```json
{
  "facility_id": 1,
  "date": "2026-03-10",
  "start_time": "10:00",
  "end_time": "10:30",
  "status": "confirmed"
}
```

**Required Fields:**
- `facility_id` (number): Facility ID
- `date` (string): Booking date in YYYY-MM-DD format
- `start_time` (string): Start time in HH:MM format
- `end_time` (string): End time in HH:MM format

**Optional Fields:**
- `status` (string): Booking status (default: "confirmed")

**Response (200 OK):**
```json
{
  "id": 1,
  "facility_id": 1,
  "user_id": 1,
  "date": "2026-03-10",
  "start_time": "10:00",
  "end_time": "10:30",
  "status": "confirmed",
  "updated_at": "2026-03-02T11:00:00Z"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/bookings/1 \
  -H "Content-Type: application/json" \
  -d '{
    "facility_id": 1,
    "date": "2026-03-10",
    "start_time": "10:00",
    "end_time": "10:30"
  }'
```

---

#### Cancel a Booking
**Request:**
```
DELETE /bookings/:id
```

**Path Parameters:**
- `id` (required, number): Booking ID

**Response (200 OK):**
```json
{
  "message": "Booking cancelled successfully",
  "booking": {
    "id": 1,
    "facility_id": 1,
    "status": "cancelled"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Booking not found"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/bookings/1
```

---

### 3. AVAILABILITY

#### Get Available Time Slots
**Request:**
```
GET /availability?facility_id=1&date=2026-03-10
```

**Query Parameters:**
- `facility_id` (required, number): Facility ID
- `date` (required, string): Date in YYYY-MM-DD format

**Description:** Get all 30-minute time slots for a facility on a specific date. Marks slots as available or booked based on existing bookings.

**Response (200 OK):**
```json
{
  "facility_id": 1,
  "date": "2026-03-10",
  "slots": [
    {
      "start_time": "08:00",
      "end_time": "08:30",
      "available": true
    },
    {
      "start_time": "08:30",
      "end_time": "09:00",
      "available": false
    },
    {
      "start_time": "09:00",
      "end_time": "09:30",
      "available": true
    }
  ]
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "facility_id and date are required"
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/availability?facility_id=1&date=2026-03-10"
```

---

## Data Models

### Facility
```json
{
  "id": "number (Primary Key)",
  "name": "string (unique, required)",
  "location": "string",
  "capacity": "number",
  "description": "string",
  "created_at": "timestamp"
}
```

### User
```json
{
  "id": "number (Primary Key)",
  "external_id": "string (unique, required)",
  "name": "string",
  "created_at": "timestamp"
}
```

### Booking
```json
{
  "id": "number (Primary Key)",
  "facility_id": "number (Foreign Key)",
  "user_id": "number (Foreign Key)",
  "date": "date (YYYY-MM-DD)",
  "start_time": "time (HH:MM)",
  "end_time": "time (HH:MM)",
  "status": "string (confirmed, pending, cancelled)",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

---

## Integration Guide

### Frontend Integration (Next.js)

The frontend communicates with the API using the `API` module in `lib/api.js`:

```javascript
import { API } from "../lib/api";

// Get all facilities
const facilities = await API.getFacilities();

// Get facility details
const facility = await API.getFacility(id);

// Get available slots
const availability = await API.getAvailability(facilityId, date);

// Get all bookings
const bookings = await API.getBookings();

// Create booking
const booking = await API.createBooking({
  facility_id: 1,
  user_id: "user123",
  user_name: "John Doe",
  date: "2026-03-10",
  start_time: "09:00",
  end_time: "09:30"
});

// Cancel booking
await API.cancelBooking(bookingId);
```

### Environment Variables

Create a `.env` file in the backend root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=campus_booking

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration (optional)
CORS_ORIGIN=http://localhost:3000
```

For the frontend, create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE=http://localhost:5000
```

### Database Schema

Run migrations to initialize the database:

```bash
node migrate.js
```

This creates:
- `users` table
- `facilities` table
- `bookings` table

### Development Workflow

1. **Start the Backend:**
   ```bash
   cd campus-booking-api/campus-booking-api
   npm install
   npm run dev
   ```

2. **Start the Frontend:**
   ```bash
   cd campus-booking-frontend
   npm install
   npm run dev
   ```

3. **Access the Application:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

---

## Response Time & Performance

- Average response time: < 100ms
- Database queries optimized with indexes
- CORS enabled for cross-origin requests
- JSON response compression recommended for production

---

## Rate Limiting

Currently not implemented. Consider adding rate limiting middleware for production deployment.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-02 | Initial API release |

---

## Support & Contact

For issues or questions about the API, please contact the development team.
