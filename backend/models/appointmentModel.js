const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
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
  date: { type: Date, required: true },
  time: { type: String, required: true },
  symptoms: { type: String, required: true },
  urgencyLevel: {
    type: String,
    enum: ['Routine', 'Non-Urgent', 'Urgent', 'Emergency'],
    default: 'Routine',
    validate: {
      validator: function(value) {
        // If urgencyScore exists and is not coming from SymptomChecker, only allow 'Routine'
        if (!this.fromSymptomChecker && value !== 'Routine') {
          return false;
        }
        return true;
      },
      message: 'Urgency level can only be set via Symptom Checker assessment'
    }
  },
  urgencyScore: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  fromSymptomChecker: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  }
})

module.exports = mongoose.model('Appointment', appointmentSchema)
