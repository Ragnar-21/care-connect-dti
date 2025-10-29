# CareConnect API Documentation

## Application URLs
- **Frontend (Production)**: `https://6860ef01066d250e1bbf1bbf--animated-toffee-1179a7.netlify.app/`
- **Frontend (Development)**: `http://localhost:3000`

## API Base URL
- **Development**: `http://localhost:5001/api`
- **Production**: `https://careconnect-backend-mw1u.onrender.com/api`

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": boolean,
  "message": string,
  "data": object | array,
  "error": string (only on errors)
}
```

---

## Authentication Endpoints

### POST `/auth/signup`
Register a new user (student, doctor, or admin).

**Request Body:**
```json
{
  "username": "string (required)",
  "email": "string (required)",
  "password": "string (required, min 6 chars)",
  "role": "string (required: 'patient', 'doctor', 'admin')",
  "phoneNumber": "string (optional)",
  "medicalId": "string (optional)",
  "specialty": "string (required if role is 'doctor')"
}
```

**Response (201 Created):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "patient",
    "medicalId": "PAT001"
  }
}
```

**Possible Errors:**
- `400`: Validation errors (missing fields, invalid email, etc.)
- `409`: Email already exists

---

### POST `/auth/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Response (200 OK):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "patient",
    "medicalId": "PAT001"
  }
}
```

**Possible Errors:**
- `401`: Invalid credentials
- `400`: Missing username or password

---

### POST `/auth/refresh-token`
🔒 **Protected Route** - Refresh expired JWT token.

**Headers:**
```
Authorization: Bearer <expired_token>
```

**Response (200 OK):**
```json
{
  "token": "new_jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "patient",
    "medicalId": "PAT001"
  }
}
```

---

## User Profile Endpoints

### GET `/profile`
🔒 **Protected Route** - Get current user's profile.

**Response (200 OK):**
```json
{
  "id": "user_id",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "patient",
  "medicalId": "PAT001",
  "phoneNumber": "+1234567890",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### PUT `/profile`
🔒 **Protected Route** - Update current user's profile.

**Request Body:**
```json
{
  "username": "string (optional)",
  "email": "string (optional)",
  "phoneNumber": "string (optional)",
  "specialty": "string (optional, doctors only)"
}
```

**Response (200 OK):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "user_id",
    "username": "updated_username",
    "email": "updated@example.com",
    "role": "patient",
    "medicalId": "PAT001"
  }
}
```

---

## Appointment Endpoints

### GET `/appointments/history`
🔒 **Protected Route** - Get appointment history for current user.

**Query Parameters:**
- `status`: Filter by status (`pending`, `approved`, `rejected`, `completed`)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response (200 OK):**
```json
{
  "appointments": [
    {
      "id": "appointment_id",
      "patientMedicalId": "PAT001",
      "doctorMedicalId": "DOC001",
      "patientName": "John Doe",
      "doctorName": "Dr. Smith",
      "scheduledDate": "2024-01-15T10:00:00.000Z",
      "meetingType": "online",
      "status": "pending",
      "symptoms": "Headache and fever",
      "doctorResponse": {
        "message": "Please rest and drink fluids",
        "respondedAt": "2024-01-15T10:30:00.000Z"
      },
      "createdAt": "2024-01-14T15:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalAppointments": 25
  }
}
```

---

### POST `/appointments/book`
🔒 **Protected Route** - Book a new appointment (patients only).

**Request Body:**
```json
{
  "doctorMedicalId": "string (required)",
  "scheduledDate": "string (required, ISO date)",
  "meetingType": "string (required: 'online' or 'offline')",
  "symptoms": "string (required)"
}
```

**Response (201 Created):**
```json
{
  "message": "Appointment booked successfully",
  "appointment": {
    "id": "appointment_id",
    "patientMedicalId": "PAT001",
    "doctorMedicalId": "DOC001",
    "scheduledDate": "2024-01-20T10:00:00.000Z",
    "meetingType": "online",
    "status": "pending",
    "symptoms": "Feeling unwell"
  }
}
```

**Possible Errors:**
- `400`: Invalid date, missing fields
- `404`: Doctor not found
- `409`: Time slot already taken

---

### GET `/appointments/doctors`
Get all available doctors (public endpoint).

**Query Parameters:**
- `specialty`: Filter by medical specialty
- `available`: Filter by availability (`true`/`false`)

**Response (200 OK):**
```json
{
  "doctors": [
    {
      "id": "doctor_id",
      "medicalId": "DOC001",
      "username": "dr_smith",
      "email": "smith@healthcenter.edu",
      "specialty": "General Medicine",
      "phoneNumber": "+1234567890",
      "available": true,
      "rating": 4.8,
      "totalAppointments": 150
    }
  ]
}
```

---

### GET `/appointments/patients`
🔒 **Doctor/Admin Route** - Get all patients.

**Response (200 OK):**
```json
{
  "patients": [
    {
      "id": "patient_id",
      "medicalId": "PAT001",
      "username": "john_doe",
      "email": "john@student.edu",
      "phoneNumber": "+1234567890",
      "totalAppointments": 5,
      "lastAppointment": "2024-01-10T10:00:00.000Z"
    }
  ]
}
```

---

### GET `/appointments/pending/:userId`
🔒 **Protected Route** - Get pending appointments for specific user.

**Response (200 OK):**
```json
{
  "pendingAppointments": [
    {
      "id": "appointment_id",
      "patientName": "John Doe",
      "doctorName": "Dr. Smith",
      "scheduledDate": "2024-01-20T10:00:00.000Z",
      "symptoms": "Feeling unwell",
      "status": "pending",
      "createdAt": "2024-01-15T09:00:00.000Z"
    }
  ]
}
```

---

### GET `/appointments/upcoming`
🔒 **Protected Route** - Get upcoming appointments for current user.

**Response (200 OK):**
```json
{
  "upcomingAppointments": [
    {
      "id": "appointment_id",
      "patientName": "John Doe",
      "doctorName": "Dr. Smith",
      "scheduledDate": "2024-01-25T14:00:00.000Z",
      "meetingType": "online",
      "status": "approved",
      "meetingLink": "https://meet.example.com/room123"
    }
  ]
}
```

---

## Doctor Endpoints

### GET `/doctors/:medicalId`
Get specific doctor details.

**Response (200 OK):**
```json
{
  "doctor": {
    "id": "doctor_id",
    "medicalId": "DOC001",
    "username": "dr_smith",
    "email": "smith@healthcenter.edu",
    "specialty": "General Medicine",
    "available": true,
    "bio": "Experienced general practitioner...",
    "education": "MD from University Medical School",
    "experience": "10 years",
    "rating": 4.8,
    "totalReviews": 45
  }
}
```

---

### PUT `/doctors/availability`
🔒 **Doctor Route** - Update doctor availability.

**Request Body:**
```json
{
  "available": "boolean (required)",
  "schedule": {
    "monday": ["09:00-17:00"],
    "tuesday": ["09:00-17:00"],
    "wednesday": ["09:00-12:00"],
    "thursday": ["09:00-17:00"],
    "friday": ["09:00-17:00"]
  }
}
```

**Response (200 OK):**
```json
{
  "message": "Availability updated successfully",
  "availability": {
    "available": true,
    "schedule": { /* schedule object */ }
  }
}
```

---

## Feedback Endpoints

### POST `/feedback`
🔒 **Protected Route** - Submit feedback (patients only).

**Request Body:**
```json
{
  "doctorMedicalId": "string (required)",
  "appointmentId": "string (required)",
  "rating": "number (required, 1-5)",
  "comment": "string (optional)",
  "categories": {
    "communication": "number (1-5)",
    "professionalism": "number (1-5)",
    "timeliness": "number (1-5)"
  }
}
```

**Response (201 Created):**
```json
{
  "message": "Feedback submitted successfully",
  "feedback": {
    "id": "feedback_id",
    "doctorMedicalId": "DOC001",
    "rating": 5,
    "comment": "Excellent care",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

### GET `/feedback/doctor/:medicalId`
Get all feedback for a specific doctor.

**Response (200 OK):**
```json
{
  "doctorMedicalId": "DOC001",
  "averageRating": 4.6,
  "totalReviews": 45,
  "feedback": [
    {
      "id": "feedback_id",
      "patientName": "Anonymous",
      "rating": 5,
      "comment": "Excellent care and communication",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "categories": {
        "communication": 5,
        "professionalism": 5,
        "timeliness": 4
      }
    }
  ]
}
```

---

### GET `/feedback/patient`
🔒 **Protected Route** - Get feedback history for current patient.

**Response (200 OK):**
```json
{
  "feedbackHistory": [
    {
      "id": "feedback_id",
      "doctorName": "Dr. Smith",
      "doctorMedicalId": "DOC001",
      "appointmentDate": "2024-01-10T10:00:00.000Z",
      "rating": 5,
      "comment": "Great doctor",
      "submittedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

## Chat Endpoints

### GET `/chat/messages/:userId1/:userId2`
🔒 **Protected Route** - Get chat messages between two users.

**Response (200 OK):**
```json
{
  "messages": [
    {
      "id": "message_id",
      "sender": "PAT001",
      "receiver": "DOC001",
      "message": "I have a question about my medication",
      "timestamp": "2024-01-15T10:00:00.000Z",
      "read": false
    }
  ]
}
```

---

### POST `/chat/send`
🔒 **Protected Route** - Send a chat message.

**Request Body:**
```json
{
  "receiver": "string (required, medical ID)",
  "message": "string (required)"
}
```

**Response (201 Created):**
```json
{
  "message": "Message sent successfully",
  "chatMessage": {
    "id": "message_id",
    "sender": "PAT001",
    "receiver": "DOC001",
    "message": "Thank you for the consultation",
    "timestamp": "2024-01-15T10:00:00.000Z"
  }
}
```

---

## Notification Endpoints

### GET `/notifications`
🔒 **Protected Route** - Get notifications for current user.

**Query Parameters:**
- `unread`: Filter unread notifications (`true`/`false`)
- `limit`: Number of notifications (default: 20)

**Response (200 OK):**
```json
{
  "notifications": [
    {
      "id": "notification_id",
      "title": "Appointment Approved",
      "message": "Your appointment with Dr. Smith has been approved",
      "type": "appointment",
      "read": false,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "data": {
        "appointmentId": "appointment_id",
        "doctorName": "Dr. Smith"
      }
    }
  ],
  "unreadCount": 3
}
```

---

### PUT `/notifications/:id/read`
🔒 **Protected Route** - Mark notification as read.

**Response (200 OK):**
```json
{
  "message": "Notification marked as read"
}
```

---

## Symptom Checker Endpoints

### POST `/symptoms/check`
🔒 **Protected Route** - Check symptoms using NLP.

**Request Body:**
```json
{
  "symptoms": "string (required)",
  "age": "number (optional)",
  "gender": "string (optional)"
}
```

**Response (200 OK):**
```json
{
  "analysis": {
    "possibleConditions": [
      {
        "condition": "Common Cold",
        "probability": 0.8,
        "description": "Viral infection of upper respiratory tract"
      },
      {
        "condition": "Flu",
        "probability": 0.6,
        "description": "Influenza viral infection"
      }
    ],
    "recommendations": [
      "Rest and stay hydrated",
      "Consider seeing a doctor if symptoms worsen",
      "Monitor temperature"
    ],
    "urgency": "low"
  }
}
```

---

### GET `/symptoms/history`
🔒 **Protected Route** - Get symptom check history.

**Response (200 OK):**
```json
{
  "history": [
    {
      "id": "check_id",
      "symptoms": "headache, fever, tired",
      "analysis": { /* analysis object */ },
      "checkedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

## Admin Endpoints

### GET `/admin/users`
🔒 **Admin Only** - Get all users with pagination.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `role`: Filter by role
- `search`: Search by username or email

**Response (200 OK):**
```json
{
  "users": [
    {
      "id": "user_id",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "patient",
      "medicalId": "PAT001",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastLogin": "2024-01-15T09:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalUsers": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### GET `/admin/doctors`
🔒 **Admin Only** - Get all doctors with detailed information.

**Response (200 OK):**
```json
{
  "doctors": [
    {
      "id": "doctor_id",
      "medicalId": "DOC001",
      "username": "dr_smith",
      "email": "smith@healthcenter.edu",
      "specialty": "General Medicine",
      "isActive": true,
      "totalAppointments": 150,
      "averageRating": 4.8,
      "availability": true
    }
  ]
}
```

---

### GET `/admin/appointments`
🔒 **Admin Only** - Get all appointments with filters.

**Query Parameters:**
- `status`: Filter by status
- `date`: Filter by date range
- `doctorId`: Filter by doctor
- `patientId`: Filter by patient

**Response (200 OK):**
```json
{
  "appointments": [
    {
      "id": "appointment_id",
      "patientName": "John Doe",
      "doctorName": "Dr. Smith",
      "scheduledDate": "2024-01-20T10:00:00.000Z",
      "status": "pending",
      "meetingType": "online",
      "symptoms": "Feeling unwell"
    }
  ]
}
```

---

### PUT `/admin/users/:id`
🔒 **Admin Only** - Update user account.

**Request Body:**
```json
{
  "isActive": "boolean (optional)",
  "role": "string (optional)"
}
```

**Response (200 OK):**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "role": "patient",
    "isActive": false
  }
}
```

---

### DELETE `/admin/users/:id`
🔒 **Admin Only** - Delete user account.

**Response (200 OK):**
```json
{
  "message": "User deleted successfully"
}
```

---

## Analytics Endpoints

### GET `/analytics/dashboard`
🔒 **Admin Only** - Get system analytics and statistics.

**Response (200 OK):**
```json
{
  "overview": {
    "totalUsers": 250,
    "totalDoctors": 15,
    "totalPatients": 230,
    "totalAppointments": 1500,
    "activeUsers": 45
  },
  "appointmentStats": {
    "pending": 12,
    "approved": 8,
    "completed": 1450,
    "rejected": 30
  },
  "monthlyTrends": {
    "appointments": [45, 52, 48, 61, 55, 58],
    "newUsers": [12, 15, 8, 22, 18, 14]
  },
  "popularServices": [
    { "service": "General Consultation", "count": 450 },
    { "service": "Mental Health", "count": 320 },
    { "service": "Sports Medicine", "count": 180 }
  ]
}
```

---

### GET `/analytics/reports`
🔒 **Admin Only** - Generate detailed reports.

**Query Parameters:**
- `type`: Report type (`appointments`, `users`, `feedback`)
- `startDate`: Start date (YYYY-MM-DD)
- `endDate`: End date (YYYY-MM-DD)
- `format`: Response format (`json`, `csv`)

**Response (200 OK):**
```json
{
  "report": {
    "type": "appointments",
    "period": "2024-01-01 to 2024-01-31",
    "summary": {
      "totalAppointments": 120,
      "completedAppointments": 95,
      "averageRating": 4.6
    },
    "details": [
      {
        "date": "2024-01-15",
        "appointments": 8,
        "completed": 7,
        "cancelled": 1
      }
    ]
  }
}
```

---

## Activity Log Endpoints

### GET `/activity-logs`
🔒 **Admin Only** - Get system activity logs.

**Query Parameters:**
- `userId`: Filter by user
- `action`: Filter by action type
- `page`: Page number
- `limit`: Items per page

**Response (200 OK):**
```json
{
  "logs": [
    {
      "id": "log_id",
      "userId": "user_id",
      "username": "john_doe",
      "action": "APPOINTMENT_BOOKED",
      "details": {
        "appointmentId": "appointment_id",
        "doctorName": "Dr. Smith"
      },
      "ipAddress": "192.168.1.1",
      "timestamp": "2024-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalLogs": 500
  }
}
```

---

## Health Check Endpoints

### GET `/health`
Check API health status (public endpoint).

**Response (200 OK):**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "uptime": "2 days, 5 hours, 30 minutes",
  "version": "1.0.0"
}
```

---

### GET `/`
API root endpoint with basic information.

**Response (200 OK):**
```json
{
  "message": "CareConnect Backend API is running!",
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

---

## Error Codes

| Code | Description | Example Response |
|------|-------------|------------------|
| 200 | Success | `{"message": "Success"}` |
| 201 | Created successfully | `{"message": "Resource created"}` |
| 400 | Bad request (validation errors) | `{"message": "Validation failed", "errors": ["Field required"]}` |
| 401 | Unauthorized (invalid/missing token) | `{"message": "Invalid credentials"}` |
| 403 | Forbidden (insufficient permissions) | `{"message": "Admin role required"}` |
| 404 | Resource not found | `{"message": "User not found"}` |
| 409 | Conflict (duplicate data) | `{"message": "Email already exists"}` |
| 429 | Too many requests | `{"message": "Rate limit exceeded"}` |
| 500 | Internal server error | `{"message": "Internal server error"}` |

---

## WebSocket Events (Socket.IO)

### Connection
```javascript
// Connect to socket
const socket = io('https://careconnect-backend-mw1u.onrender.com')

// Listen for connection
socket.on('connect', () => {
  console.log('Connected to server')
})
```

### Chat Events
```javascript
// Send message
socket.emit('sendMessage', {
  sender: 'PAT001',
  receiver: 'DOC001',
  message: 'Hello doctor'
})

// Receive message
socket.on('receiveMessage', (data) => {
  console.log('New message:', data)
})
```

### Appointment Events
```javascript
// Listen for appointment updates
socket.on('appointmentUpdate', (data) => {
  console.log('Appointment status changed:', data)
})

// Listen for doctor availability changes
socket.on('doctorAvailabilityUpdate', (data) => {
  console.log('Doctor availability updated:', data)
})
```

### Notification Events
```javascript
// Listen for new notifications
socket.on('newNotification', (notification) => {
  console.log('New notification:', notification)
})

// Join user-specific room
socket.emit('joinRoom', { userId: 'PAT001' })
```

---

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute per IP
- **General API endpoints**: 100 requests per minute per authenticated user
- **Chat endpoints**: 30 messages per minute per user
- **File upload endpoints**: 10 requests per minute per user
- **Admin endpoints**: 200 requests per minute per admin user

---

## Security Headers

All API responses include security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`
- `Content-Security-Policy: default-src 'self'`

---

## CORS Policy

Allowed origins:
- `http://localhost:3000` (development)
- `https://deluxe-pegasus-05c89a.netlify.app` (production)

Allowed methods: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
Allowed headers: `Content-Type`, `Authorization`, `X-Requested-With`

---

## Example Usage

### JavaScript/React Example
```javascript
// Login and store token
const login = async (credentials) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
  const data = await response.json()
  localStorage.setItem('token', data.token)
  return data
}

// Make authenticated request
const getAppointments = async () => {
  const token = localStorage.getItem('token')
  const response = await fetch('/api/appointments/history', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  return response.json()
}

// Book appointment
const bookAppointment = async (appointmentData) => {
  const token = localStorage.getItem('token')
  const response = await fetch('/api/appointments/book', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(appointmentData)
  })
  return response.json()
}
```

### cURL Examples
```bash
# Login
curl -X POST https://careconnect-backend-mw1u.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"password123"}'

# Get appointments (with token)
curl -X GET https://careconnect-backend-mw1u.onrender.com/api/appointments/history \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Book appointment
curl -X POST https://careconnect-backend-mw1u.onrender.com/api/appointments/book \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "doctorMedicalId":"DOC001",
    "scheduledDate":"2024-01-20T10:00:00.000Z",
    "meetingType":"online",
    "symptoms":"Feeling unwell"
  }'

# Submit feedback
curl -X POST https://careconnect-backend-mw1u.onrender.com/api/feedback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "doctorMedicalId":"DOC001",
    "appointmentId":"appointment_id",
    "rating":5,
    "comment":"Excellent service"
  }'
```

### Python Example
```python
import requests

# Login
login_data = {
    "username": "john_doe",
    "password": "password123"
}

response = requests.post(
    "https://careconnect-backend-mw1u.onrender.com/api/auth/login",
    json=login_data
)

token = response.json()["token"]

# Get appointments
headers = {"Authorization": f"Bearer {token}"}
appointments = requests.get(
    "https://careconnect-backend-mw1u.onrender.com/api/appointments/history",
    headers=headers
)

print(appointments.json())
```

---

## Error Handling Best Practices

### Client-Side Error Handling
```javascript
const handleApiCall = async (apiFunction) => {
  try {
    const response = await apiFunction()
    return { success: true, data: response }
  } catch (error) {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      // Insufficient permissions
      console.error('Access denied')
    } else {
      // Other errors
      console.error('API Error:', error.response?.data?.message)
    }
    return { success: false, error: error.response?.data?.message }
  }
}
```

### Server-Side Error Response Format
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ],
  "code": "VALIDATION_ERROR",
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

---

## Pagination

Standard pagination format for list endpoints:

**Query Parameters:**
- `page`: Page number (1-based, default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `sort`: Sort field (default: 'createdAt')
- `order`: Sort order ('asc' or 'desc', default: 'desc')

**Response Format:**
```json
{
  "data": [ /* array of items */ ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## Testing

### Test Credentials
```
Admin:
  username: admin
  password: admin123

Doctor:
  username: dr_smith
  password: doctor123

Patient:
  username: john_doe
  password: patient123
```

### Postman Collection
Import this environment into Postman:
```json
{
  "name": "CareConnect API",
  "values": [
    {
      "key": "base_url",
      "value": "https://careconnect-backend-mw1u.onrender.com/api"
    },
    {
      "key": "token",
      "value": "{{auth_token}}"
    }
  ]
}

