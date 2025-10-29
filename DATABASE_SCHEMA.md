# CareConnect Database Schema Documentation

## Database Schema Overview

### Entity Relationship Diagram (Conceptual)

```
┌─────────────────┐         ┌─────────────────────┐         ┌─────────────────┐
│      User       │         │ AppointmentRequest  │         │    Feedback     │
├─────────────────┤         ├─────────────────────┤         ├─────────────────┤
│ _id (ObjectId)  │    ┌────│ patientMedicalId    │         │ patientMedicalId│
│ username        │    │    │ doctorMedicalId     │────┐    │ doctorMedicalId │
│ email           │    │    │ patientName         │    │    │ appointmentId   │
│ password        │    │    │ doctorName          │    │    │ rating (1-5)    │
│ medicalId (UK)  │────┘    │ status              │    │    │ comment         │
│ role            │         │ symptoms            │    │    │ createdAt       │
│ specialty       │         │ meetingType         │    │    └─────────────────┘
│ phoneNumber     │         │ scheduledDate       │    │              
│ isOnline        │         │ messages[]          │    │    
│ timeStamp       │         │ doctorResponse      │    │    
└─────────────────┘         │ createdAt           │    │    
                            └─────────────────────┘    │    
                                     │                 │    
┌─────────────────┐                  │                 │    
│      Chat       │                  │                 │    
├─────────────────┤                  │                 │    
│ _id (ObjectId)  │                  │                 │    
│ sender (ref)    │──────────────────┘                 │    
│ receiver (ref)  │                                    │    
│ message         │                                    │    
│ timestamp       │                                    │    
└─────────────────┘                                    │    
                                                       │    
┌─────────────────┐                                    │    
│  ActivityLog    │                                    │    
├─────────────────┤                                    │    
│ _id (ObjectId)  │                                    │    
│ userId (ref)    │────────────────────────────────────┘    
│ activity        │                                         
│ date            │                                         
└─────────────────┘                                         

┌─────────────────┐
│     Doctor      │
├─────────────────┤
│ _id (ObjectId)  │
│ name            │
│ specialty       │
│ availability[]  │
│ ├─ date         │
│ └─ slots[]      │
│    ├─ time      │
│    └─ available │
└─────────────────┘
```

## Detailed Schema Analysis

### 1. User Collection
```javascript
// Index Strategy
db.users.createIndex({ "medicalId": 1 }, { unique: true })
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "username": 1 }, { unique: true })
db.users.createIndex({ "role": 1 })
db.users.createIndex({ "specialty": 1 }) // For doctor filtering
db.users.createIndex({ "isOnline": 1 }) // For online status

// Sample Document
{
  "_id": ObjectId("..."),
  "username": "dr_smith",
  "email": "smith@healthcenter.edu",
  "password": "$2b$10$encrypted_password_hash",
  "medicalId": "DOC001",
  "role": "doctor",
  "specialty": "General Medicine",
  "phoneNumber": "+1234567890",
  "location": "New York",
  "profilePicture": "uploads/dr_smith.jpg",
  "isOnline": true,
  "timeStamp": ISODate("2024-01-01T00:00:00.000Z")
}
```

### 2. AppointmentRequest Collection
```javascript
// Index Strategy
db.appointmentRequests.createIndex({ 
  "doctorMedicalId": 1, 
  "status": 1, 
  "createdAt": -1 
})
db.appointmentRequests.createIndex({ 
  "patientMedicalId": 1, 
  "createdAt": -1 
})
db.appointmentRequests.createIndex({ "status": 1 })
db.appointmentRequests.createIndex({ "scheduledDate": 1 })

// Sample Document
{
  "_id": ObjectId("..."),
  "doctorMedicalId": "DOC001",
  "patientMedicalId": "PAT001",
  "doctorName": "Dr. Smith",
  "patientName": "John Doe",
  "doctorEmail": "smith@healthcenter.edu",
  "patientEmail": "john@student.edu",
  "preferredDate": ISODate("2024-01-20T10:00:00.000Z"),
  "preferredTime": "10:00 AM",
  "symptoms": "Headache and fever for 2 days",
  "contactInfo": "+1234567890",
  "meetingType": "online",
  "videoCallLink": "https://meet.google.com/xyz-abc-123",
  "status": "approved",
  "messages": [
    {
      "sender": "DOC001",
      "senderName": "Dr. Smith",
      "message": "I can see you at 2 PM instead. Is that okay?",
      "timestamp": ISODate("2024-01-15T14:00:00.000Z")
    }
  ],
  "doctorResponse": {
    "message": "Please bring your medical history",
    "respondedAt": ISODate("2024-01-15T15:00:00.000Z")
  },
  "scheduledDate": ISODate("2024-01-20T14:00:00.000Z"),
  "scheduledTime": "2:00 PM",
  "createdAt": ISODate("2024-01-15T10:00:00.000Z"),
  "updatedAt": ISODate("2024-01-15T15:00:00.000Z")
}
```

### 3. Chat Collection
```javascript
// Index Strategy
db.chats.createIndex({ 
  "sender": 1, 
  "receiver": 1, 
  "timestamp": -1 
})
db.chats.createIndex({ "timestamp": -1 })

// Sample Document
{
  "_id": ObjectId("..."),
  "sender": ObjectId("user_id_1"),
  "receiver": ObjectId("user_id_2"),
  "message": "Hello doctor, I have a question about my medication",
  "timestamp": ISODate("2024-01-15T10:30:00.000Z")
}
```

### 4. Feedback Collection
```javascript
// Index Strategy
db.feedbacks.createIndex({ 
  "doctorMedicalId": 1, 
  "createdAt": -1 
})
db.feedbacks.createIndex({ "patientMedicalId": 1 })
db.feedbacks.createIndex({ "rating": 1 })
db.feedbacks.createIndex({ "appointmentId": 1 })

// Sample Document
{
  "_id": ObjectId("..."),
  "doctorMedicalId": "DOC001",
  "patientMedicalId": "PAT001",
  "doctorName": "Dr. Smith",
  "patientName": "John Doe",
  "appointmentId": ObjectId("appointment_request_id"),
  "rating": 5,
  "comment": "Excellent consultation. Very thorough and professional.",
  "isAnonymous": false,
  "createdAt": ISODate("2024-01-20T16:00:00.000Z"),
  "updatedAt": ISODate("2024-01-20T16:00:00.000Z")
}
```

## Query Patterns and Optimizations

### Common Queries

#### 1. Get Doctor's Pending Appointments
```javascript
db.appointmentRequests.find({
  "doctorMedicalId": "DOC001",
  "status": "pending"
}).sort({ "createdAt": -1 })
```

#### 2. Get Patient's Appointment History
```javascript
db.appointmentRequests.find({
  "patientMedicalId": "PAT001"
}).sort({ "createdAt": -1 })
```

#### 3. Get Doctor's Average Rating
```javascript
db.feedbacks.aggregate([
  { $match: { "doctorMedicalId": "DOC001" } },
  { $group: {
    _id: "$doctorMedicalId",
    averageRating: { $avg: "$rating" },
    totalReviews: { $sum: 1 }
  }}
])
```

#### 4. Get Chat Messages Between Users
```javascript
db.chats.find({
  $or: [
    { "sender": ObjectId("user1"), "receiver": ObjectId("user2") },
    { "sender": ObjectId("user2"), "receiver": ObjectId("user1") }
  ]
}).sort({ "timestamp": 1 })
```

#### 5. Get Online Doctors by Specialty
```javascript
db.users.find({
  "role": "doctor",
  "specialty": "General Medicine",
  "isOnline": true
})
```

## Data Relationships

### 1. User ↔ AppointmentRequest
- **Relationship**: One-to-Many (medicalId reference)
- **Type**: Logical reference via medicalId strings
- **Queries**: Filter appointments by patient/doctor medicalId

### 2. User ↔ Chat
- **Relationship**: Many-to-Many (ObjectId reference)
- **Type**: Direct ObjectId reference with populate
- **Queries**: Find chats where user is sender or receiver

### 3. AppointmentRequest ↔ Feedback
- **Relationship**: One-to-One (ObjectId reference)
- **Type**: Optional reference (appointmentId in feedback)
- **Queries**: Link feedback to specific appointments

### 4. User ↔ ActivityLog
- **Relationship**: One-to-Many (ObjectId reference)
- **Type**: Direct reference for audit trail
- **Queries**: Track user activities chronologically

## Performance Considerations

### 1. Indexing Strategy
```javascript
// Compound indexes for common query patterns
db.appointmentRequests.createIndex({ 
  "doctorMedicalId": 1, 
  "status": 1, 
  "scheduledDate": 1 
})

// Text search for symptoms
db.appointmentRequests.createIndex({ 
  "symptoms": "text",
  "patientName": "text",
  "doctorName": "text"
})

// TTL index for chat cleanup (optional)
db.chats.createIndex(
  { "timestamp": 1 }, 
  { expireAfterSeconds: 2592000 } // 30 days
)
```

### 2. Query Optimization Techniques
```javascript
// Use projection to limit returned fields
db.users.find(
  { "role": "doctor" },
  { "password": 0, "email": 0 } // Exclude sensitive fields
)

// Aggregation for complex reports
db.appointmentRequests.aggregate([
  { $match: { "createdAt": { $gte: startDate, $lte: endDate } } },
  { $group: {
    _id: "$status",
    count: { $sum: 1 }
  }},
  { $sort: { "count": -1 } }
])
```

### 3. Pagination Implementation
```javascript
// Efficient pagination with skip/limit
const page = 2;
const limit = 10;
const skip = (page - 1) * limit;

db.appointmentRequests.find({})
  .sort({ "createdAt": -1 })
  .skip(skip)
  .limit(limit)
```

## Data Validation Rules

### 1. User Model Validation
```javascript
// Mongoose Schema Validation
const userSchema = {
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    required: true
  },
  medicalId: {
    type: String,
    unique: true,
    required: true,
    match: /^(PAT|DOC|ADM)\d{3}$/
  }
}
```

### 2. Appointment Validation
```javascript
const appointmentSchema = {
  preferredDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(date) {
        return date > new Date(); // Future date only
      },
      message: 'Appointment date must be in the future'
    }
  },
  meetingType: {
    type: String,
    enum: ['online', 'offline'],
    required: true
  },
  symptoms: {
    type: String,
    required: true,
    maxlength: 1000
  }
}
```

## Backup and Recovery Strategy

### 1. Regular Backups
```bash
# Daily backup script
mongodump --host localhost --port 27017 --db careconnect --out /backup/$(date +%Y%m%d)

# Automated backup with compression
mongodump --db careconnect --gzip --archive=/backup/careconnect_$(date +%Y%m%d).gz
```

### 2. Point-in-Time Recovery
```bash
# Restore from specific backup
mongorestore --db careconnect --gzip --archive=/backup/careconnect_20240115.gz

# Restore specific collections
mongorestore --db careconnect --collection users /backup/20240115/careconnect/users.bson
```

This schema documentation provides a comprehensive understanding of the database design, relationships, and optimization strategies used in the CareConnect application.
