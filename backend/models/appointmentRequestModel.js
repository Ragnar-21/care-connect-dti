const mongoose = require('mongoose')

const appointmentRequestSchema = new mongoose.Schema({
  doctorMedicalId: {
    type: String,
    required: true,
  },
  patientMedicalId: {
    type: String,
    required: true,
  },
  doctorName: { type: String, required: true },
  patientName: { type: String, required: true },
  doctorEmail: { type: String, required: true },
  patientEmail: { type: String, required: true },
  preferredDate: { type: Date, required: true },
  preferredTime: { type: String, required: true },
  symptoms: { type: String, required: true },
  contactInfo: { type: String, required: true },
  notificationType: { 
    type: String, 
    enum: ['email'], 
    default: 'email' 
  },
  meetingType: {
    type: String,
    enum: ['online', 'offline'],
    required: true,
    default: 'offline'
  },
  videoCallLink: {
    type: String,
    required: false // Only required for online meetings
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  messages: [{
    sender: {
      type: String,
      required: true // Will store medicalId of sender
    },
    senderName: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  doctorResponse: {
    message: String,
    respondedAt: Date
  },
  scheduledDate: Date,
  scheduledTime: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Update the updatedAt field before saving
appointmentRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model('AppointmentRequest', appointmentRequestSchema)
