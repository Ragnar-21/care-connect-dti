# CareConnect Database - Entity Relationship Diagram

## Visual ER Diagram

```
                              CareConnect Healthcare Database Schema
                                        Entity Relationship Diagram

┌─────────────────────────────────────┐
│               USER                  │
├─────────────────────────────────────┤
│ PK  _id: ObjectId                   │
│ UK  username: String                │
│ UK  email: String                   │
│     password: String (hashed)       │
│     phoneNumber: String             │
│ UK  medicalId: String               │
│     role: Enum[patient,doctor,admin]│
│     specialty: String (doctors only)│
│     location: String (doctors only) │
│     profilePicture: String          │
│     timeStamp: Date                 │
│     isOnline: Boolean               │
└─────────────────────────────────────┘
        │                    │
        │                    │
        │ 1:N               │ 1:N
        ▼                    ▼
┌─────────────────────────────────────┐        ┌─────────────────────────────────────┐
│         APPOINTMENT_REQUEST         │        │            ACTIVITY_LOG             │
├─────────────────────────────────────┤        ├─────────────────────────────────────┤
│ PK  _id: ObjectId                   │        │ PK  _id: ObjectId                   │
│ FK  doctorMedicalId: String         │◄───────┤ FK  userId: ObjectId → User._id     │
│ FK  patientMedicalId: String        │        │     activity: String                │
│     doctorName: String              │        │     date: Date                      │
│     patientName: String             │        └─────────────────────────────────────┘
│     doctorEmail: String             │
│     patientEmail: String            │
│     preferredDate: Date             │                    ┌─────────────────────────────────────┐
│     preferredTime: String           │                    │              DOCTOR                 │
│     symptoms: String                │                    ├─────────────────────────────────────┤
│     contactInfo: String             │                    │ PK  _id: ObjectId                   │
│     notificationType: Enum[email]   │                    │     name: String                    │
│     meetingType: Enum[online,offline│                    │     specialty: String               │
│     videoCallLink: String           │                    │     availability: Array             │
│     status: Enum[pending,approved,  │                    │     ├─ date: Date                   │
│              rejected,cancelled]    │                    │     └─ slots: Array                 │
│     messages: Array                 │                    │        ├─ time: String              │
│     ├─ sender: String (medicalId)   │                    │        └─ available: Boolean        │
│     ├─ senderName: String           │                    └─────────────────────────────────────┘
│     ├─ message: String              │
│     └─ timestamp: Date              │
│     doctorResponse: Object          │
│     ├─ message: String              │
│     └─ respondedAt: Date            │
│     scheduledDate: Date             │
│     scheduledTime: String           │
│     createdAt: Date                 │
│     updatedAt: Date                 │
└─────────────────────────────────────┘
        │
        │ 1:N
        ▼
┌─────────────────────────────────────┐
│             FEEDBACK                │
├─────────────────────────────────────┤
│ PK  _id: ObjectId                   │
│ FK  doctorMedicalId: String         │
│ FK  patientMedicalId: String        │
│     doctorName: String              │
│     patientName: String             │
│ FK  appointmentId: ObjectId         │◄─── References AppointmentRequest._id
│     rating: Number (1-5)            │
│     comment: String (max 1000)      │
│     isAnonymous: Boolean            │
│     createdAt: Date                 │
│     updatedAt: Date                 │
└─────────────────────────────────────┘


┌─────────────────────────────────────┐
│               CHAT                  │
├─────────────────────────────────────┤
│ PK  _id: ObjectId                   │
│ FK  sender: ObjectId → User._id     │◄───┐
│ FK  receiver: ObjectId → User._id   │◄───┼─── Direct ObjectId references
│     message: String                 │    │
│     timestamp: Date                 │    │
└─────────────────────────────────────┘    │
                                           │
                          ┌────────────────┘
                          │
                          ▼
              ┌─────────────────────────────────────┐
              │               USER                  │
              │         (Referenced Above)          │
              └─────────────────────────────────────┘
```

## Relationship Types and Cardinalities

### 1. User → AppointmentRequest (1:N)
- **Type**: One-to-Many
- **Relationship**: One user (patient or doctor) can have multiple appointment requests
- **Foreign Key**: `doctorMedicalId` and `patientMedicalId` in AppointmentRequest
- **Reference Type**: String-based medical ID (not ObjectId)

### 2. User → ActivityLog (1:N)
- **Type**: One-to-Many
- **Relationship**: One user can have multiple activity log entries
- **Foreign Key**: `userId` in ActivityLog
- **Reference Type**: ObjectId with populate capability

### 3. AppointmentRequest → Feedback (1:1 or 1:0)
- **Type**: One-to-Zero-or-One
- **Relationship**: One appointment can have at most one feedback
- **Foreign Key**: `appointmentId` in Feedback
- **Reference Type**: ObjectId (optional reference)

### 4. User → Chat (M:N)
- **Type**: Many-to-Many (through sender/receiver)
- **Relationship**: Users can send/receive multiple messages
- **Foreign Key**: `sender` and `receiver` in Chat
- **Reference Type**: ObjectId with populate capability

### 5. Doctor Collection (Standalone)
- **Type**: Independent entity
- **Relationship**: Separate scheduling system
- **Note**: Could be merged with User model in future

## Detailed Entity Descriptions

### USER Entity
```
Primary Key: _id (ObjectId)
Unique Keys: username, email, medicalId
Indexes:
  - { medicalId: 1 } (unique)
  - { email: 1 } (unique)
  - { role: 1 }
  - { specialty: 1 }
  - { isOnline: 1 }

Business Rules:
  - medicalId format: PAT001, DOC001, ADM001
  - specialty required only for doctors
  - password automatically hashed on save
```

### APPOINTMENT_REQUEST Entity
```
Primary Key: _id (ObjectId)
Foreign Keys: 
  - doctorMedicalId → User.medicalId
  - patientMedicalId → User.medicalId
  - appointmentId ← Feedback.appointmentId

Indexes:
  - { doctorMedicalId: 1, status: 1, createdAt: -1 }
  - { patientMedicalId: 1, createdAt: -1 }
  - { status: 1 }
  - { scheduledDate: 1 }

Business Rules:
  - preferredDate must be in future
  - videoCallLink required only for online meetings
  - messages array for doctor-patient communication
  - status workflow: pending → approved/rejected → completed
```

### CHAT Entity
```
Primary Key: _id (ObjectId)
Foreign Keys:
  - sender → User._id
  - receiver → User._id

Indexes:
  - { sender: 1, receiver: 1, timestamp: -1 }
  - { timestamp: -1 }

Business Rules:
  - Real-time messaging between any users
  - Messages stored permanently for history
  - Support for text messages only
```

### FEEDBACK Entity
```
Primary Key: _id (ObjectId)
Foreign Keys:
  - appointmentId → AppointmentRequest._id
  - doctorMedicalId → User.medicalId
  - patientMedicalId → User.medicalId

Indexes:
  - { doctorMedicalId: 1, createdAt: -1 }
  - { patientMedicalId: 1 }
  - { rating: 1 }

Business Rules:
  - rating between 1-5
  - comment max 1000 characters
  - optional anonymous feedback
  - one feedback per appointment
```

### ACTIVITY_LOG Entity
```
Primary Key: _id (ObjectId)
Foreign Keys:
  - userId → User._id

Indexes:
  - { userId: 1, date: -1 }
  - { date: -1 }

Business Rules:
  - Audit trail for all user actions
  - Automatic timestamp on creation
  - Used for compliance and monitoring
```

### DOCTOR Entity (Separate)
```
Primary Key: _id (ObjectId)

Business Rules:
  - Separate availability management
  - Time slot scheduling
  - Could be integrated into User model
  - availability array with date/time slots
```

## Key Design Decisions

### 1. Medical ID vs ObjectId References
**Decision**: Use medical IDs for business logic, ObjectIds for technical references
**Reason**: 
- Medical IDs are human-readable (PAT001, DOC001)
- Better for business queries and reporting
- ObjectIds for internal system references (chat, logs)

### 2. Denormalization Strategy
**Decision**: Store names alongside IDs in appointment requests
**Reason**:
- Faster query performance
- Reduces need for joins
- Historical data preservation

### 3. Embedded vs Referenced Data
**Decision**: Mixed approach
- **Embedded**: Messages in appointments, availability in doctors
- **Referenced**: Users, appointments, feedback
**Reason**: Balance between query performance and data integrity

### 4. Single User Collection
**Decision**: One collection for all user types with role differentiation
**Reason**:
- Simplified authentication
- Easier role-based access control
- Reduced data duplication

## Database Constraints and Validations

```javascript
// User Model Constraints
username: { unique: true, required: true }
email: { unique: true, required: true, format: email }
medicalId: { unique: true, required: true, pattern: /^(PAT|DOC|ADM)\d{3}$/ }
role: { enum: ['patient', 'doctor', 'admin'], required: true }

// Appointment Constraints
preferredDate: { required: true, validate: futureDate }
status: { enum: ['pending', 'approved', 'rejected', 'cancelled'] }
meetingType: { enum: ['online', 'offline'], required: true }

// Feedback Constraints
rating: { min: 1, max: 5, required: true }
comment: { maxLength: 1000, required: true }
```

This ER diagram shows the complete data model with all relationships, constraints, and business rules for the CareConnect healthcare management system.
